import { PaymentProviderError } from './errors.js';
import { v4 as uuid } from 'uuid';

const SECRET = process.env.XENDIT_SECRET_KEY;

export function assertXenditEnv() {
  if (!SECRET) {
    throw new Error('XENDIT_SECRET_KEY missing');
  }
}

const AUTH = Buffer.from(`${SECRET}:`).toString('base64');

const PAYMENT_MAP = {
  qris: ['QRIS'],
  gopay: ['GOPAY'],
  dana: ['DANA'],
  ovo: ['OVO'],
  shopeepay: ['SHOPEEPAY']
};

export async function createXenditInvoice(input) {
  if (!Number.isInteger(input.amount)) {
    throw new PaymentProviderError('Amount must be integer (IDR)');
  }

  const externalId = `TRX-${Date.now()}-${uuid().slice(0, 8).toUpperCase()}`;
  const methods = PAYMENT_MAP[input.paymentMethod];

  if (!methods) {
    throw new PaymentProviderError('Unsupported payment method');
  }

  const payload = {
    external_id: externalId,
    amount: input.amount,
    currency: 'IDR',
    description: `${input.game} - ${input.product}`,
    invoice_duration: 86400,
    customer: {
      given_names: input.customerName,
      email: input.customerEmail
    },
    success_redirect_url: `${input.frontendUrl}/payment/success?ref=${externalId}`,
    failure_redirect_url: `${input.frontendUrl}/payment/failed?ref=${externalId}`,
    payment_methods: methods
  };

  const res = await fetch('https://api.xendit.co/v2/invoices', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${AUTH}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const body = await res.json();

  if (!res.ok) {
    throw new PaymentProviderError(
      body?.message || body?.errors?.[0]?.message || 'Xendit failure'
    );
  }

  return {
    invoiceId: body.id,
    invoiceUrl: body.invoice_url,
    externalId,
    expiry: body.expiry_date
  };
}
