// File: api/checkout.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { userId, zoneId, game, product, paymentMethod, price } = req.body;
  const externalID = `INV-${Date.now()}`;
  const authString = Buffer.from(process.env.XENDIT_SECRET_KEY + ':').toString('base64');

  try {
    // 1. HIT XENDIT
    const xenditResponse = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        external_id: externalID,
        amount: price,
        description: `Topup ${game} - ${product.name}`,
        currency: 'IDR',
        customer: { given_names: userId },
        success_redirect_url: 'https://freezly-store.vercel.app', 
        failure_redirect_url: 'https://freezly-store.vercel.app'
      })
    });

    const xenditData = await xenditResponse.json();

    if (!xenditResponse.ok) {
        // --- INI BIAR ERRORNYA KELIHATAN ---
        return res.status(500).json({ error: xenditData });
    }

    // 2. SIMPAN KE SUPABASE
    await supabase.from('transactions').insert({
        external_id: externalID,
        user_id: userId,
        game: game,
        product_name: product.name,
        amount: price,
        status: 'PENDING',
        invoice_url: xenditData.invoice_url
    });

    return res.status(200).json({ invoice_url: xenditData.invoice_url });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}