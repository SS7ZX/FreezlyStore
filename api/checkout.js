// api/checkout.js
import { createInvoice } from './lib/xendit.js';
import { createTransaction } from './lib/supabase.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { userId, zoneId, game, product, paymentMethod, price } = req.body;

    // Validation
    if (!userId || !game || !product || !paymentMethod || !price) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'userId, game, product, paymentMethod, and price are required'
      });
    }

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({
        error: 'Invalid price',
        message: 'Price must be a positive number'
      });
    }

    console.log('Creating invoice for:', { userId, game, product: product.name, price });

    // Create Xendit invoice
    const invoiceData = await createInvoice({
      userId,
      game,
      productName: product.name,
      amount: price,
      paymentMethod,
      customerName: 'Game Player',
      customerEmail: 'player@example.com',
      frontendUrl: 'https://freezly-store.vercel.app'
    });

    console.log('Invoice created:', invoiceData.external_id);

    // Save to Supabase
    await createTransaction({
      externalId: invoiceData.external_id,
      invoiceId: invoiceData.invoice_id,
      invoiceUrl: invoiceData.invoice_url,
      userId,
      zoneId,
      game,
      productName: product.name,
      paymentMethod,
      amount: price,
      expiryDate: invoiceData.expiry_date
    });

    console.log('Transaction saved to database');

    return res.status(200).json({
      success: true,
      invoice_url: invoiceData.invoice_url,
      invoice_id: invoiceData.invoice_id,
      external_id: invoiceData.external_id,
      amount: invoiceData.amount,
      expiry_date: invoiceData.expiry_date
    });

  } catch (error) {
    console.error('Checkout error:', error);
    return res.status(500).json({
      error: 'Checkout failed',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}