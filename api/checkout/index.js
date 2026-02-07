import { createCheckout } from './service.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await createCheckout(req.body);

    // 🔒 HARD GUARANTEE
    if (!result?.invoice_url) {
      throw new Error('invoice_url missing from gateway response');
    }

    return res.status(200).json({
      invoice_url: result.invoice_url,
      reference_id: result.reference_id
    });

  } catch (err) {
    console.error('❌ CHECKOUT FAILED:', err);

    return res.status(500).json({
      error: 'Checkout failed',
      message: err.message
    });
  }
}
