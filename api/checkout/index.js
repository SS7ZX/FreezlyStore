import { createCheckout } from './service.js';
import { ApiError } from '../lib/errors.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // your checkout logic here
}

  try {
    const result = await createCheckout(req.body);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('🔥 CHECKOUT ERROR', {
      name: err?.name,
      message: err?.message,
      stack: err?.stack
    });

    if (err instanceof ApiError) {
      return res.status(err.status).json({
        error: err.code,
        message: err.message
      });
    }

    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Unexpected checkout failure'
    });
  }
