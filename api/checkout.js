// File: api/checkout.js
import Xendit from 'xendit-node';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
    // 1. Validasi Method
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Validasi Environment Variables
    if (!process.env.XENDIT_SECRET_KEY || !process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
        return res.status(500).json({ error: 'Server Config Error: Key Xendit/Supabase hilang' });
    }

    const { userId, zoneId, game, product, paymentMethod, price } = req.body;

    // 3. Setup Xendit
    const x = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY });
    const { Invoice } = x;
    const i = new Invoice({});
    
    // Bikin ID Unik buat Transaksi (PENTING BIAR GAK TUKER)
    const externalID = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    try {
        // 4. Minta Invoice ke Xendit
        const resp = await i.createInvoice({
            externalID: externalID,
            amount: price,
            description: `Topup ${game} - ${product.name}`,
            invoiceDuration: 86400,
            currency: 'IDR',
            customer: {
                given_names: userId,
                email: 'user@freezyle.com'
            },
            successRedirectURL: 'https://freezly-store.vercel.app', // Ganti domain kamu
            failureRedirectURL: 'https://freezly-store.vercel.app'
        });

        // 5. SIMPAN KE SUPABASE (Ini yang baru!)
        const { error: dbError } = await supabase
            .from('transactions')
            .insert([
                {
                    external_id: externalID,
                    user_id: userId,
                    zone_id: zoneId || '-',
                    game: game,
                    product_name: product.name,
                    amount: price,
                    payment_method: paymentMethod,
                    status: 'PENDING', // Awal bikin pasti PENDING
                    invoice_url: resp.invoice_url
                }
            ]);

        if (dbError) {
            console.error("Supabase Error:", dbError);
            // Tetap lanjut meski error DB, yang penting user bisa bayar dulu (opsional)
        }

        // 6. Balikin Link ke Frontend
        return res.status(200).json({ 
            invoice_url: resp.invoice_url,
            transaction_id: externalID 
        });

    } catch (error) {
        console.error("Transaction Error:", error);
        return res.status(500).json({ error: error.message });
    }
}