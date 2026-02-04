import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 pt-16 pb-8 text-sm">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* KOLOM 1: BRAND */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="https://cdn-icons-png.flaticon.com/512/3408/3408506.png" alt="Logo" className="w-8 h-8 grayscale opacity-80" />
              <span className="text-xl font-black italic text-white tracking-tighter">FREEZLY<span className="text-gray-600">STORE</span></span>
            </div>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Platform Top Up game termurah, tercepat, dan terpercaya di Indonesia. Layanan otomatis 24 jam dengan pembayaran lengkap.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Youtube size={18} />} />
            </div>
          </div>

          {/* KOLOM 2: PETA SITUS */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider">Peta Situs</h3>
            <ul className="space-y-2 text-gray-500">
              <FooterLink label="Beranda" />
              <FooterLink label="Cek Transaksi" />
              <FooterLink label="Hubungi Kami" />
              <FooterLink label="Ulasan Pelanggan" />
              <FooterLink label="Daftar Reseller" />
            </ul>
          </div>

          {/* KOLOM 3: LEGAL & SUPPORT */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider">Dukungan</h3>
            <ul className="space-y-2 text-gray-500">
              <FooterLink label="Syarat & Ketentuan" />
              <FooterLink label="Kebijakan Privasi" />
              <FooterLink label="Kebijakan Refund" />
              <FooterLink label="FaQ / Bantuan" />
              <li className="flex items-center gap-2 pt-2"><Mail size={14} /> support@freezly.com</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Jakarta Selatan, ID</li>
            </ul>
          </div>

          {/* KOLOM 4: PEMBAYARAN */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase tracking-wider">Pembayaran Resmi</h3>
            <div className="grid grid-cols-3 gap-2">
               {['BCA', 'BNI', 'MANDIRI', 'QRIS', 'GOPAY', 'DANA', 'OVO', 'SHOPEE', 'ALFAMART'].map((bank, i) => (
                 <div key={i} className="bg-white p-1 h-8 rounded flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
                    <span className="text-[8px] font-bold text-black">{bank}</span>
                 </div>
               ))}
            </div>
            <div className="mt-6 flex items-center gap-2 bg-[#121212] border border-white/10 p-2 rounded-lg">
                <div className="w-8 h-8 bg-green-900/20 rounded flex items-center justify-center text-green-500"><ShieldCheckIcon /></div>
                <div>
                    <p className="text-white font-bold text-xs">Terverifikasi SSL</p>
                    <p className="text-[10px] text-gray-500">Transaksi Aman Terenkripsi</p>
                </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">© 2024 - 2026 FreezlyStore Enterprise. All Rights Reserved.</p>
          <p className="text-gray-700 text-xs">Made for Professionals.</p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: any }) {
  return (
    <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-black transition-all">
      {icon}
    </a>
  );
}

function FooterLink({ label }: { label: string }) {
  return (
    <li><a href="#" className="hover:text-yellow-400 transition-colors">{label}</a></li>
  );
}

function ShieldCheckIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
}