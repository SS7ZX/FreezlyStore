// File: api/checkout.js
import Xendit from 'xendit-node';

export default async function handler(req, res) {
    // 1. Cek Method (Harus POST)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Cek Secret Key (Wajib ada di Vercel Settings)
    if (!process.env.XENDIT_SECRET_KEY) {
        return res.status(500).json({ error: 'Server Misconfiguration: Xendit Key missing' });
    }

    const { userId, zoneId, game, product, paymentMethod, price } = req.body;

    // 3. Inisialisasi Xendit
    const x = new Xendit({
        secretKey: process.env.XENDIT_SECRET_KEY,
    });
    const { Invoice } = x;
    const invoiceSpecificOptions = {};
    const i = new Invoice(invoiceSpecificOptions);

    try {
        // 4. Buat Invoice ke Xendit
        const resp = await i.createInvoice({
            externalID: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            amount: price, // Pastikan ini ANGKA, bukan String
            description: `Topup ${game} - ${product.name} (${userId})`,
            invoiceDuration: 86400, // 24 jam
            currency: 'IDR',
            customer: {
                given_names: userId,
                email: 'user@example.com' // Bisa diganti input user kalau ada
            },
            successRedirectURL: 'https://freezly-store.vercel.app', // Ganti sama link website kamu
            failureRedirectURL: 'https://freezly-store.vercel.app'
        });

        // 5. Kirim Link Pembayaran balik ke Frontend
        return res.status(200).json({ 
            invoice_url: resp.invoice_url,
            status: 'PENDING' 
        });

    } catch (error) {
        console.error("Xendit Error:", error);
        return res.status(500).json({ error: 'Gagal membuat invoice Xendit', details: error.message });
    }
}