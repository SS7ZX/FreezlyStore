import { createClient } from '@supabase/supabase-js';

// Setup Supabase (Pastikan env var ini ada di Vercel)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  // 1. Validasi Method & CORS
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Cek Kunci Rahasia
  const xenditSecret = process.env.XENDIT_SECRET_KEY;
  if (!xenditSecret || !process.env.SUPABASE_URL) {
    console.error("Missing Env Vars");
    return res.status(500).json({ error: 'Server Config Error (Key Missing)' });
  }

  try {
    const { userId, zoneId, game, product, paymentMethod, price } = req.body;

    // 3. Buat External ID Unik
    const externalID = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 4. HIT XENDIT PAKAI FETCH (Lebih Stabil daripada SDK)
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
        payer_email: 'customer@freezyle.com', // Default email (opsional)
        customer: {
             given_names: userId,
             mobile_number: null
        },
        success_redirect_url: 'https://freezyle-store-pro.vercel.app', // GANTI URL WEB KAMU
        failure_redirect_url: 'https://freezyle-store-pro.vercel.app'
      })
    });

    const xenditData = await xenditResponse.json();

    if (!xenditResponse.ok) {
       // Kalau Xendit nolak, lempar errornya biar ketauan
       throw new Error(`Xendit Error: ${xenditData.message || JSON.stringify(xenditData)}`);
    }

    // 5. SIMPAN KE SUPABASE (Setelah sukses dapet Invoice)
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
      console.error("Supabase Save Error:", dbError);
      // Kita gak throw error disini, karena yang penting User bisa bayar dulu.
      // Nanti bisa dicek manual kalau data gak masuk.
    }

    // 6. SUKSES!
    return res.status(200).json({
      status: 'SUCCESS',
      invoice_url: xenditData.invoice_url
    });

  } catch (error) {
    console.error("FATAL API ERROR:", error);
    return res.status(500).json({ 
        error: error.message || "Internal Server Error" 
    });
  }
}