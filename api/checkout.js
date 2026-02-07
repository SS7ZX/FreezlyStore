// file: /api/checkout.js
// Vercel otomatis menganggap file di dalam folder /api sebagai Backend

import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // 1. Setup CORS (Biar browser gak ngamuk)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Ambil Kunci Rahasia dari Vercel Environment
  const xenditSecret = process.env.XENDIT_SECRET_KEY;
  const supabaseUrl = process.env.SUPABASE_URL; // Perhatikan nama variabelnya nanti di Vercel
  const supabaseKey = process.env.SUPABASE_KEY; // Service Role Key (Bukan Anon Key kalau bisa, tapi Anon gpp buat MVP)

  if (!xenditSecret || !supabaseUrl) {
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  try {
    const { userId, zoneId, game, product, paymentMethod, price } = req.body;
    
    // Validasi Data
    if(!price || !product) throw new Error("Data incomplete");

    // 3. Init Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 4. Buat ID Invoice Unik
    const externalId = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // 5. Simpan ke Database (Status PENDING)
    const { error: dbError } = await supabase
      .from('transactions') // Pastikan tabel 'transactions' ada di Supabase
      .insert({
        trx_id: externalId,
        user_id_input: userId,
        zone_id_input: zoneId || '-',
        product_name: product.name, // Pastikan kirim object product
        price: price,
        payment_method: paymentMethod,
        status: 'PENDING'
      });

    if (dbError) throw new Error("Database Error: " + dbError.message);

    // 6. Tembak Xendit (Server to Server)
    const xenditRes = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(xenditSecret + ':').toString('base64'),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        external_id: externalId,
        amount: price,
        payer_email: 'customer@freezyle.com', // Bisa diganti email user
        description: `Topup ${game} - ${product.name}`,
        // Ganti URL ini dengan URL Vercel kamu nanti
        success_redirect_url: 'https://nama-project-kamu.vercel.app/?status=success',
        failure_redirect_url: 'https://nama-project-kamu.vercel.app/?status=failed'
      })
    });

    const xenditData = await xenditRes.json();

    if (!xenditRes.ok) throw new Error(xenditData.message);

    // 7. Sukses! Kirim Link Bayar ke Frontend
    return res.status(200).json({ 
      status: 'OK', 
      invoice_url: xenditData.invoice_url 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}