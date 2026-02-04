// src/data/games.ts

export interface Product {
  name: string;
  price: string;
  rawValue: number; // Added for calculation logic
}

export interface Game {
  id: string;
  name: string;
  publisher: string;
  image: string; // Cover image (Wide)
  logo: string;  // Icon image (Square)
  category: 'MOBILE' | 'PC';
  products: Product[];
}

export const GAMES: Game[] = [
  {
    id: 'mlbb',
    name: 'Mobile Legends',
    publisher: 'Moonton',
    category: 'MOBILE',
    // UPDATED: M7 Champion Branding Image
    image: 'https://images.unsplash.com/photo-1628277613967-6bc3d4505c11?q=80&w=2670&auto=format&fit=crop', 
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Mobile_Legends_Bang_Bang_logo.png/220px-Mobile_Legends_Bang_Bang_logo.png',
    products: [
      { name: 'Weekly Diamond Pass', price: 'Rp 27.500', rawValue: 27500 },
      { name: '86 Diamonds', price: 'Rp 19.100', rawValue: 19100 },
      { name: '172 Diamonds', price: 'Rp 38.200', rawValue: 38200 },
      { name: '257 Diamonds', price: 'Rp 57.500', rawValue: 57500 },
      { name: 'M7 Glory Pass', price: 'Rp 150.000', rawValue: 150000 }, // Added M7 Item
    ]
  },
  {
    id: 'ff',
    name: 'Free Fire',
    publisher: 'Garena',
    category: 'MOBILE',
    image: 'https://images2.alphacoders.com/109/1099688.jpg',
    logo: 'https://upload.wikimedia.org/wikipedia/en/a/a3/Free_Fire_Logo.png',
    products: [
      { name: '100 Diamonds', price: 'Rp 16.000', rawValue: 16000 },
      { name: '310 Diamonds', price: 'Rp 46.000', rawValue: 46000 },
      { name: '520 Diamonds', price: 'Rp 77.000', rawValue: 77000 },
      { name: '1060 Diamonds', price: 'Rp 155.000', rawValue: 155000 },
      { name: 'Weekly Membership', price: 'Rp 30.000', rawValue: 30000 },
    ]
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    publisher: 'Tencent',
    category: 'MOBILE',
    image: 'https://images.hdqwalls.com/wallpapers/pubg-mobile-4k-game-cl.jpg',
    logo: 'https://upload.wikimedia.org/wikipedia/en/1/1b/PUBG_Mobile_Logo.png',
    products: [
      { name: '60 UC', price: 'Rp 14.500', rawValue: 14500 },
      { name: '325 UC', price: 'Rp 75.000', rawValue: 75000 },
      { name: '660 UC', price: 'Rp 150.000', rawValue: 150000 },
      { name: '1800 UC', price: 'Rp 375.000', rawValue: 375000 },
      { name: 'Royale Pass', price: 'Rp 160.000', rawValue: 160000 },
    ]
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    publisher: 'HoYoverse',
    category: 'PC',
    image: 'https://images8.alphacoders.com/116/1166747.jpg',
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/5d/Genshin_Impact_logo.svg',
    products: [
      { name: '60 Genesis', price: 'Rp 16.000', rawValue: 16000 },
      { name: '300 Genesis', price: 'Rp 79.000', rawValue: 79000 },
      { name: '980 Genesis', price: 'Rp 249.000', rawValue: 249000 },
      { name: 'Welkin Moon', price: 'Rp 79.000', rawValue: 79000 },
    ]
  },
  {
    id: 'valorant',
    name: 'Valorant',
    publisher: 'Riot Games',
    category: 'PC',
    image: 'https://images7.alphacoders.com/114/thumb-1920-1149301.jpg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Valorant_logo_-_pink_color_version.svg',
    products: [
      { name: '125 Points', price: 'Rp 15.000', rawValue: 15000 },
      { name: '420 Points', price: 'Rp 50.000', rawValue: 50000 },
      { name: '1375 Points', price: 'Rp 150.000', rawValue: 150000 },
      { name: '2400 Points', price: 'Rp 250.000', rawValue: 250000 },
    ]
  },
  {
    id: 'roblox',
    name: 'Roblox',
    publisher: 'Roblox Corp',
    category: 'MOBILE',
    image: 'https://images4.alphacoders.com/133/1339890.jpeg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Roblox_logo.svg',
    products: [
      { name: '80 Robux', price: 'Rp 15.000', rawValue: 15000 },
      { name: '400 Robux', price: 'Rp 75.000', rawValue: 75000 },
      { name: '800 Robux', price: 'Rp 150.000', rawValue: 150000 },
      { name: '2000 Robux', price: 'Rp 375.000', rawValue: 375000 },
    ]
  },
  {
    id: 'hok',
    name: 'Honor of Kings',
    publisher: 'Level Infinite',
    category: 'MOBILE',
    image: 'https://images5.alphacoders.com/135/1352496.jpeg',
    logo: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Honor_of_Kings_Logo.png',
    products: [
      { name: '16 Tokens', price: 'Rp 3.000', rawValue: 3000 },
      { name: '80 Tokens', price: 'Rp 15.000', rawValue: 15000 },
      { name: '240 Tokens', price: 'Rp 45.000', rawValue: 45000 },
      { name: 'Weekly Card', price: 'Rp 30.000', rawValue: 30000 },
    ]
  },
  {
    id: 'codm',
    name: 'Call of Duty: Mobile',
    publisher: 'Activision',
    category: 'MOBILE',
    image: 'https://images2.alphacoders.com/105/1057678.jpg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Call_of_Duty_Mobile_Logo.png',
    products: [
      { name: '53 CP', price: 'Rp 10.000', rawValue: 10000 },
      { name: '265 CP', price: 'Rp 50.000', rawValue: 50000 },
      { name: '530 CP', price: 'Rp 100.000', rawValue: 100000 },
      { name: 'Premium Pass', price: 'Rp 150.000', rawValue: 150000 },
    ]
  },
];