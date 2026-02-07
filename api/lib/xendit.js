// api/lib/xendit.js
import { v4 as uuidv4 } from 'uuid';

const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY;

if (!XENDIT_SECRET_KEY) {
  throw new Error('Missing XENDIT_SECRET_KEY');
}

export async function createInvoice(data) {
  const externalId = `TRX-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`;
  
  const authString = Buffer.from(XENDIT_SECRET_KEY + ':').toString('base64');

  const invoicePayload = {
    external_id: externalId,
    amount: data.amount,
    description: `${data.game} - ${data.productName} for User ${data.userId}`,
    invoice_duration: 86400, // 24 hours
    currency: 'IDR',
    customer: {
      given_names: data.customerName || 'Game Player',
      email: data.customerEmail || 'player@example.com'
    },
    success_redirect_url: `${data.frontendUrl}/payment/success?external_id=${externalId}`,
    failure_redirect_url: `${data.frontendUrl}/payment/failed?external_id=${externalId}`,
    payment_methods: getPaymentMethods(data.paymentMethod)
  };

  const response = await fetch('https://api.xendit.co/v2/invoices', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${authString}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(invoicePayload)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Xendit API Error: ${errorData.message || 'Unknown error'}`);
  }

  const invoice = await response.json();

  return {
    invoice_url: invoice.invoice_url,
    invoice_id: invoice.id,
    external_id: externalId,
    amount: data.amount,
    expiry_date: invoice.expiry_date
  };
}

function getPaymentMethods(method) {
  const methodMap = {
    qris: ['QR_CODE'],
    gopay: ['EWALLET'],
    dana: ['EWALLET'],
    ovo: ['EWALLET'],
    shopeepay: ['EWALLET']
  };

  return methodMap[method.toLowerCase()] || ['QR_CODE', 'EWALLET'];
}

export function processWebhook(payload) {
  return {
    invoiceId: payload.id,
    externalId: payload.external_id,
    status: mapStatus(payload.status),
    paidAt: payload.paid_at
  };
}

function mapStatus(xenditStatus) {
  const statusMap = {
    PENDING: 'PENDING',
    PAID: 'PAID',
    SETTLED: 'PAID',
    EXPIRED: 'EXPIRED',
    FAILED: 'FAILED'
  };
  return statusMap[xenditStatus] || 'PENDING';
}