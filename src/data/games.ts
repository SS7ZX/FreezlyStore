// src/data/games.ts

export interface Product {
  name: string;
  price: string;
}

export interface Game {
  id: string;
  name: string;
  publisher: string;
  image: string;
  logo: string;
  category: 'MOBILE' | 'PC';
  products: Product[]; // <--- THIS MUST BE HERE
}

export const GAMES: Game[] = [
  {
    id: 'mlbb',
    name: 'Mobile Legends',
    publisher: 'Moonton',
    category: 'MOBILE',
    image: 'https://images5.alphacoders.com/115/1152643.jpg',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Mobile_Legends_Bang_Bang_logo.png/220px-Mobile_Legends_Bang_Bang_logo.png',
    products: [
      { name: '86 Diamonds', price: 'Rp 20.000' },
      { name: '172 Diamonds', price: 'Rp 40.000' },
      { name: '257 Diamonds', price: 'Rp 60.000' },
      { name: '706 Diamonds', price: 'Rp 160.000' },
      { name: '2195 Diamonds', price: 'Rp 500.000' },
      { name: 'Twilight Pass', price: 'Rp 150.000' },
    ]
  },
  {
    id: 'ff',
    name: 'Free Fire',
    publisher: 'Garena',
    category: 'MOBILE',
    image: 'https://c4.wallpaperflare.com/wallpaper/777/582/385/garena-free-fire-battlegrounds-video-games-poster-wallpaper-preview.jpg',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Free_Fire_Logo.png/220px-Free_Fire_Logo.png',
    products: [
      { name: '100 Diamonds', price: 'Rp 16.000' },
      { name: '310 Diamonds', price: 'Rp 46.000' },
      { name: '520 Diamonds', price: 'Rp 77.000' },
      { name: '1060 Diamonds', price: 'Rp 155.000' },
      { name: 'Weekly Membership', price: 'Rp 30.000' },
    ]
  },
  {
    id: 'pubg',
    name: 'PUBG Mobile',
    publisher: 'Tencent',
    category: 'MOBILE',
    image: 'https://images.hdqwalls.com/wallpapers/pubg-mobile-4k-game-cl.jpg',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1b/PUBG_Mobile_Logo.png/220px-PUBG_Mobile_Logo.png',
    products: [
      { name: '60 UC', price: 'Rp 14.500' },
      { name: '325 UC', price: 'Rp 75.000' },
      { name: '660 UC', price: 'Rp 150.000' },
      { name: '1800 UC', price: 'Rp 375.000' },
      { name: 'Royale Pass', price: 'Rp 160.000' },
    ]
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    publisher: 'HoYoverse',
    category: 'PC',
    image: 'https://images8.alphacoders.com/116/1166747.jpg',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/Genshin_Impact_logo.svg/1200px-Genshin_Impact_logo.svg.png',
    products: [
      { name: '60 Genesis', price: 'Rp 16.000' },
      { name: '300 Genesis', price: 'Rp 79.000' },
      { name: '980 Genesis', price: 'Rp 249.000' },
      { name: 'Welkin Moon', price: 'Rp 79.000' },
    ]
  },
  {
    id: 'valorant',
    name: 'Valorant',
    publisher: 'Riot Games',
    category: 'PC',
    image: 'https://images7.alphacoders.com/114/thumb-1920-1149301.jpg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Valorant_logo_-_pink_color_version.svg/2560px-Valorant_logo_-_pink_color_version.svg.png',
    products: [
      { name: '125 Points', price: 'Rp 15.000' },
      { name: '420 Points', price: 'Rp 50.000' },
      { name: '1375 Points', price: 'Rp 150.000' },
      { name: '2400 Points', price: 'Rp 250.000' },
    ]
  },
  {
    id: 'roblox',
    name: 'Roblox',
    publisher: 'Roblox Corp',
    category: 'MOBILE',
    image: 'https://images4.alphacoders.com/133/1339890.jpeg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Roblox_logo.svg/2560px-Roblox_logo.svg.png',
    products: [
      { name: '80 Robux', price: 'Rp 15.000' },
      { name: '400 Robux', price: 'Rp 75.000' },
      { name: '800 Robux', price: 'Rp 150.000' },
      { name: '2000 Robux', price: 'Rp 375.000' },
    ]
  },
  {
    id: 'hok',
    name: 'Honor of Kings',
    publisher: 'Level Infinite',
    category: 'MOBILE',
    image: 'https://images5.alphacoders.com/135/1352496.jpeg',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/Honor_of_Kings_Logo.png/220px-Honor_of_Kings_Logo.png',
    products: [
      { name: '16 Tokens', price: 'Rp 3.000' },
      { name: '80 Tokens', price: 'Rp 15.000' },
      { name: '240 Tokens', price: 'Rp 45.000' },
      { name: 'Weekly Card', price: 'Rp 30.000' },
    ]
  },
  {
    id: 'codm',
    name: 'Call of Duty: Mobile',
    publisher: 'Activision',
    category: 'MOBILE',
    image: 'https://images2.alphacoders.com/105/1057678.jpg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Call_of_Duty_Mobile_Logo.png/640px-Call_of_Duty_Mobile_Logo.png',
    products: [
      { name: '53 CP', price: 'Rp 10.000' },
      { name: '265 CP', price: 'Rp 50.000' },
      { name: '530 CP', price: 'Rp 100.000' },
      { name: 'Premium Pass', price: 'Rp 150.000' },
    ]
  },
];