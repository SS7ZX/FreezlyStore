import React from 'react';
import { 
  Gamepad2, 
  Instagram, 
  Youtube, 
  Twitter, 
  Facebook, 
  Mail, 
  MapPin, 
  Phone, 
  ArrowRight 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-[#0a0a0a] text-gray-300 pt-20 overflow-hidden font-sans">
      
      {/* --- Cool Spiky Divider (Gamer Aesthetic) --- */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg 
          className="relative block w-[calc(100%+1.3px)] h-[50px] md:h-[80px]" 
          data-name="Layer 1" 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-indigo-900/20"
          ></path>
           {/* Sharp geometric overlay for the 'Takapedia' vibe */}
           <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-[#9333ea]"></path>
        </svg>
        {/* Gradient Line Separator */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-70"></div>
      </div>

      <div className="container mx-auto px-4 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* --- Brand Section --- */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg shadow-lg shadow-purple-500/20">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 italic">
                FREEZLY<span className="text-purple-500">STORE</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              The #1 Trusted Gaming Marketplace. Instant delivery for Mobile Legends, PUBG, Valorant, and 100+ other games. Secure payments and 24/7 Support.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialIcon icon={<Instagram size={18} />} href="#" />
              <SocialIcon icon={<Youtube size={18} />} href="#" />
              <SocialIcon icon={<Twitter size={18} />} href="#" />
              <SocialIcon icon={<Facebook size={18} />} href="#" />
            </div>
          </div>

          {/* --- Sitemap --- */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-purple-500 pl-3">SITEMAP</h3>
            <ul className="space-y-3">
              <FooterLink text="Home" />
              <FooterLink text="All Games" />
              <FooterLink text="Flash Sale" />
              <FooterLink text="Track Order" />
              <FooterLink text="Win Rate Calculator" />
            </ul>
          </div>

          {/* --- Support --- */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-pink-500 pl-3">SUPPORT</h3>
            <ul className="space-y-3">
              <FooterLink text="Contact Us" />
              <FooterLink text="FAQ" />
              <FooterLink text="Terms of Service" />
              <FooterLink text="Privacy Policy" />
              <FooterLink text="Reseller Program" />
            </ul>
          </div>

          {/* --- Contact Info --- */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 border-l-4 border-blue-500 pl-3">CONTACT</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="w-5 h-5 text-purple-500 mt-0.5 shrink-0" />
                <span>Jakarta, Indonesia<br />Level 99 Gaming Tower</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-5 h-5 text-purple-500 shrink-0" />
                <span>support@freezlystore.com</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-5 h-5 text-purple-500 shrink-0" />
                <span>+62 812-3456-7890</span>
              </li>
            </ul>
          </div>
        </div>

        {/* --- Payment Methods Section (Visual Only) --- */}
        <div className="border-t border-gray-800 pt-8 mb-8">
            <p className="text-center text-xs font-semibold text-gray-500 mb-4 tracking-widest uppercase">Official Payment Partners</p>
            <div className="flex flex-wrap justify-center gap-4 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Simple Placeholders for Payment Logos - Replace with <img> tags if you have assets */}
                {['BCA', 'MANDIRI', 'OVO', 'DANA', 'GOPAY', 'QRIS', 'ALFAMART'].map((payment) => (
                    <div key={payment} className="bg-gray-800 px-4 py-2 rounded text-xs font-bold text-gray-300 border border-gray-700">
                        {payment}
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* --- Bottom Bar --- */}
      <div className="bg-black border-t border-gray-900 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} FreezlyStore MVP. All rights reserved.</p>
          <div className="flex gap-6 mt-2 md:mt-0">
            <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-purple-400 transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Subcomponents for Clean Code ---

const FooterLink = ({ text }: { text: string }) => (
  <li>
    <a 
      href="#" 
      className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-all duration-300"
    >
      <ArrowRight className="w-3 h-3 text-purple-500 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
      {text}
    </a>
  </li>
);

const SocialIcon = ({ icon, href }: { icon: React.ReactNode, href: string }) => (
  <a 
    href={href} 
    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-purple-600 hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-black/50"
  >
    {icon}
  </a>
);

export default Footer;