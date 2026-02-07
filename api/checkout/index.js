import { checkoutService } from './service.js';
import { AppError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const result = await checkoutService(req.body);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    logger.error('Checkout failed', err);

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        error: err.code,
        message: err.message
      });
    }

    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: 'Unexpected system failure'
    });
  }
}
