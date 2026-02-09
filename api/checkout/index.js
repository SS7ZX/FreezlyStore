import { createClient } from '@supabase/supabase-js';

// Setup Supabase (Wajib ada di ENV Vercel)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  // 1. Izin CORS (Biar frontend bisa akses)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Cek Kunci Rahasia
  const xenditSecret = process.env.XENDIT_SECRET_KEY;
  if (!xenditSecret) {
    console.error("FATAL: XENDIT_SECRET_KEY is missing in Vercel!");
    return res.status(500).json({ error: 'Server Misconfiguration: API Key Missing' });
  }

  try {
    const { userId, zoneId, game, product, paymentMethod, price } = req.body;

    // 3. Validasi Data
    if (!price || price < 1000) {
      return res.status(400).json({ error: 'Harga minimal Rp 1.000 untuk Xendit Sandbox' });
    }

    console.log(`🚀 Making Transaction for: ${userId} (${price})`);

    // 4. Bikin ID Unik
    const externalID = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 5. TEMBAK XENDIT (Direct Fetch)
    // Encode Auth Header: Basic base64(secretKey:)
    const authString = Buffer.from(xenditSecret + ':').toString('base64');
    
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
        invoice_duration: 86400,
        currency: 'IDR',
        payer_email: 'customer@freezyle.com', 
        customer: {
             given_names: userId,
             mobile_number: null
        },
        // Ganti ini sesuai link website kamu nanti
        success_redirect_url: 'https://freezly-store.vercel.app', 
        failure_redirect_url: 'https://freezly-store.vercel.app'
      })
    });

    const xenditData = await xenditResponse.json();

    if (!xenditResponse.ok) {
       console.error("❌ Xendit Rejected:", xenditData);
       return res.status(xenditResponse.status).json({ 
           error: 'Xendit Error', 
           details: xenditData 
       });
    }

    // 6. SIMPAN KE SUPABASE
    const { error: dbError } = await supabase
      .from('transactions')
      .insert({
          external_id: externalID,
          user_id: userId,
          zone_id: zoneId || '-',
          game: game,
          product_name: product.name,
          amount: price,
          payment_method: paymentMethod,
          status: 'PENDING',
          invoice_url: xenditData.invoice_url
      });

    if (dbError) {
      console.error("⚠️ Supabase Save Error (Transaction still works):", dbError);
    }

    // 7. SUKSES! Balikin URL ke Frontend
    return res.status(200).json({
      success: true,
      invoice_url: xenditData.invoice_url,
      external_id: externalID
    });

  } catch (error) {
    console.error("FATAL SERVER ERROR:", error);
    return res.status(500).json({ 
        error: error.message || "Internal Server Error" 
    });
  }
}