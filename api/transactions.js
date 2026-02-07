// api/transactions.js
import { getTransactionByExternalId, getTransactionByInvoiceId } from './lib/supabase.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { externalId, invoiceId } = req.body;

    if (!externalId && !invoiceId) {
      return res.status(400).json({
        error: 'Missing search parameter',
        message: 'Provide either externalId or invoiceId'
      });
    }

    let transaction = null;

    if (externalId) {
      transaction = await getTransactionByExternalId(externalId);
    } else if (invoiceId) {
      transaction = await getTransactionByInvoiceId(invoiceId);
    }

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    return res.status(200).json({
      success: true,
      transaction: {
        id: transaction.id,
        external_id: transaction.external_id,
        invoice_id: transaction.invoice_id,
        status: transaction.status,
        game_name: transaction.game_name,
        product_name: transaction.product_name,
        user_game_id: transaction.user_game_id,
        final_amount: transaction.final_amount,
        payment_method: transaction.payment_method,
        created_at: transaction.created_at,
        paid_at: transaction.paid_at,
        invoice_url: transaction.invoice_url
      }
    });

  } catch (error) {
    console.error('Transaction lookup error:', error);
    return res.status(500).json({
      error: 'Lookup failed',
      message: error.message
    });
  }
}