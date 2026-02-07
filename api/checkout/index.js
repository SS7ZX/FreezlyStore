import { checkoutService } from './service.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  try {
    const result = await checkoutService(req.body);

    return res.status(200).json({
      success: true,
      invoiceUrl: result.invoiceUrl,
      invoiceId: result.invoiceId,
      externalId: result.externalId
    });

  } catch (err) {
    console.error('🔥 CHECKOUT FAILED FULL ERROR:', {
      name: err?.name,
      message: err?.message,
      stack: err?.stack
    });

    return res.status(500).json({
      error: 'CHECKOUT_FAILED',
      message: err?.message || 'Unknown server error'
    });
  }
}
