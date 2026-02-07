// api/webhooks.js
import { processWebhook } from './lib/xendit.js';
import { updateTransactionStatus } from './lib/supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log('Webhook received:', req.body);

    // Process webhook data
    const webhookData = processWebhook(req.body);

    // Update transaction in database
    await updateTransactionStatus(
      webhookData.invoiceId,
      webhookData.status,
      webhookData.paidAt
    );

    console.log(`Transaction ${webhookData.invoiceId} updated to ${webhookData.status}`);

    // Always return 200 to acknowledge receipt
    return res.status(200).json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    // Still return 200 to prevent retries
    return res.status(200).json({ received: true, error: error.message });
  }
}