import { createCheckout } from './service.js';
import { ApiError } from '../lib/errors.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'METHOD_NOT_ALLOWED',
      message: 'Only POST requests are allowed'
    });
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
}
