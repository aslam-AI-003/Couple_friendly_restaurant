// Complete Menu Items for Couple Friendly Hub
// Exact items from the official menu PDF

const menuItems = [
  // ===== SIGNATURE LOADED FRIES =====
  {
    id: 'lf-001',
    name: 'Classic Peri Peri Fries',
    category: 'Signature Loaded Fries',
    price: 79,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    description: 'Crispy fries with peri peri seasoning',
    stock: 100,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'lf-002',
    name: 'Cheese Loaded Fries',
    category: 'Signature Loaded Fries',
    price: 99,
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=400',
    description: 'Fries loaded with melted cheese sauce',
    stock: 80,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'lf-003',
    name: 'Veg Loaded Fries',
    category: 'Signature Loaded Fries',
    price: 119,
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400',
    description: 'Fries with veggies, cheese & sauces',
    stock: 75,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'lf-004',
    name: 'Chicken Loaded Fries',
    category: 'Signature Loaded Fries',
    price: 139,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
    description: 'Fries with chicken chunks, cheese & sauces',
    stock: 90,
    isVeg: false,
    isAvailable: true
  },

  // ===== WRAPS & ROLLS =====
  {
    id: 'wr-001',
    name: 'Veg Mayo Wrap',
    category: 'Wraps & Rolls',
    price: 89,
    image: 'https://images.unsplash.com/photo-1600803907087-f56d462fd26b?w=400',
    description: 'Fresh veggie wrap with mayo',
    stock: 55,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'wr-002',
    name: 'Paneer Wrap',
    category: 'Wraps & Rolls',
    price: 119,
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
    description: 'Soft tortilla with paneer tikka filling',
    stock: 60,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'wr-003',
    name: 'Egg Chicken Roll',
    category: 'Wraps & Rolls',
    price: 119,
    image: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=400',
    description: 'Egg and chicken roll',
    stock: 65,
    isVeg: false,
    isAvailable: true
  },
  {
    id: 'wr-004',
    name: 'Spicy Chicken Wrap',
    category: 'Wraps & Rolls',
    price: 149,
    image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400',
    description: 'Spicy grilled chicken wrapped in tortilla',
    stock: 70,
    isVeg: false,
    isAvailable: true
  },

  // ===== CRISPY SNACKS =====
  {
    id: 'cs-001',
    name: 'Crispy Veg Nuggets',
    category: 'Crispy Snacks',
    price: 89,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
    description: 'Crispy golden veg nuggets',
    stock: 80,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'cs-002',
    name: 'Chicken Popcorn',
    category: 'Crispy Snacks',
    price: 99,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400',
    description: 'Bite-sized crispy chicken popcorn',
    stock: 90,
    isVeg: false,
    isAvailable: true
  },
  {
    id: 'cs-003',
    name: 'Crispy Chicken Strips',
    category: 'Crispy Snacks',
    price: 149,
    image: 'https://images.unsplash.com/photo-1562967915-92ae0c320a01?w=400',
    description: 'Crunchy chicken strips with dip',
    stock: 70,
    isVeg: false,
    isAvailable: true
  },
  {
    id: 'cs-004',
    name: 'Peri Peri Chicken Bites',
    category: 'Crispy Snacks',
    price: 159,
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400',
    description: 'Spicy peri peri chicken bites',
    stock: 75,
    isVeg: false,
    isAvailable: true
  },
  {
    id: 'cs-005',
    name: 'Crab Lollipop',
    category: 'Crispy Snacks',
    price: 199,
    image: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400',
    description: 'Crispy crab lollipops',
    stock: 50,
    isVeg: false,
    isAvailable: true
  },

  // ===== MOMOS =====
  {
    id: 'mm-001',
    name: 'Veg Momos (Steamed/Fried)',
    category: "Momo's",
    price: 89,
    image: 'https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=400',
    description: 'Steamed or fried veg momos with chutney',
    stock: 100,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'mm-002',
    name: 'Paneer Momos (Steamed/Fried)',
    category: "Momo's",
    price: 99,
    image: 'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400',
    description: 'Steamed or fried paneer momos',
    stock: 80,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'mm-003',
    name: 'Chicken Momos (Steamed/Fried)',
    category: "Momo's",
    price: 109,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400',
    description: 'Steamed or fried chicken momos with chutney',
    stock: 90,
    isVeg: false,
    isAvailable: true
  },
  {
    id: 'mm-004',
    name: 'Spicy Chicken Momos',
    category: "Momo's",
    price: 119,
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400',
    description: 'Extra spicy chicken momos',
    stock: 85,
    isVeg: false,
    isAvailable: true
  },

  // ===== COOL DRINKS =====
  {
    id: 'cd-001',
    name: 'Mint Mojito',
    category: 'Cool Drinks',
    price: 59,
    image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400',
    description: 'Fresh mint mojito with lime',
    stock: 150,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'cd-002',
    name: 'Blue Lagoon Mojito',
    category: 'Cool Drinks',
    price: 69,
    image: 'https://images.unsplash.com/photo-1560508179-b2c9a3f8e92b?w=400',
    description: 'Blue curacao flavored refreshing mojito',
    stock: 120,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'cd-003',
    name: 'Watermelon Mojito',
    category: 'Cool Drinks',
    price: 69,
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=400',
    description: 'Fresh watermelon mojito',
    stock: 100,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'cd-004',
    name: 'Lemon Iced Tea',
    category: 'Cool Drinks',
    price: 49,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    description: 'Refreshing lemon iced tea',
    stock: 110,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'cd-005',
    name: 'Cold Coffee',
    category: 'Cool Drinks',
    price: 79,
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    description: 'Creamy cold coffee with ice cream',
    stock: 90,
    isVeg: true,
    isAvailable: true
  },

  // ===== EGG/MAGGIE SPECIALS =====
  {
    id: 'em-001',
    name: 'Veg Maggie',
    category: 'Egg/Maggie Specials',
    price: 99,
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400',
    description: 'Hot veg maggie noodles',
    stock: 80,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'em-002',
    name: 'Egg Maggie',
    category: 'Egg/Maggie Specials',
    price: 109,
    image: 'https://images.unsplash.com/photo-1645696301019-35adcc18b253?w=400',
    description: 'Maggie noodles with egg',
    stock: 75,
    isVeg: false,
    isAvailable: true
  },
  {
    id: 'em-003',
    name: 'Chicken Maggie',
    category: 'Egg/Maggie Specials',
    price: 129,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    description: 'Maggie noodles with chicken',
    stock: 70,
    isVeg: false,
    isAvailable: true
  },
  {
    id: 'em-004',
    name: 'Egg 65',
    category: 'Egg/Maggie Specials',
    price: 99,
    image: 'https://images.unsplash.com/photo-1482049016gy7uj9-316bb0b47aeb?w=400',
    description: 'Spicy fried egg 65',
    stock: 90,
    isVeg: false,
    isAvailable: true
  },
  {
    id: 'em-005',
    name: 'Egg Lollipop',
    category: 'Egg/Maggie Specials',
    price: 99,
    image: 'https://images.unsplash.com/photo-1606728035253-49e8a23146de?w=400',
    description: 'Crispy egg lollipops with spicy coating',
    stock: 100,
    isVeg: false,
    isAvailable: true
  },

  // ===== SWEET CORN =====
  {
    id: 'sc-001',
    name: 'Classic Butter Sweet Corn',
    category: 'Sweet Corn',
    price: 69,
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400',
    description: 'Hot buttered sweet corn',
    stock: 100,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'sc-002',
    name: 'Peri Peri Sweet Corn',
    category: 'Sweet Corn',
    price: 79,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400',
    description: 'Sweet corn with peri peri seasoning',
    stock: 90,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'sc-003',
    name: 'Cheese Sweet Corn',
    category: 'Sweet Corn',
    price: 89,
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400',
    description: 'Sweet corn with melted cheese',
    stock: 85,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'sc-004',
    name: 'Masala Sweet Corn',
    category: 'Sweet Corn',
    price: 79,
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400',
    description: 'Spicy masala sweet corn',
    stock: 95,
    isVeg: true,
    isAvailable: true
  },

  // ===== ADD-ONS =====
  {
    id: 'ao-001',
    name: 'Extra Cheese',
    category: 'Add-Ons',
    price: 20,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400',
    description: 'Extra cheese topping',
    stock: 200,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'ao-002',
    name: 'Extra Mayo Dip',
    category: 'Add-Ons',
    price: 15,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    description: 'Extra mayo dipping sauce',
    stock: 200,
    isVeg: true,
    isAvailable: true
  },
  {
    id: 'ao-003',
    name: 'Extra Chicken',
    category: 'Add-Ons',
    price: 40,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400',
    description: 'Extra chicken portion',
    stock: 150,
    isVeg: false,
    isAvailable: true
  },
  {
    id: 'ao-004',
    name: 'Peri Peri Seasoning',
    category: 'Add-Ons',
    price: 10,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
    description: 'Extra peri peri seasoning',
    stock: 200,
    isVeg: true,
    isAvailable: true
  },

  // ===== COMBOS =====
  {
    id: 'cb-001',
    name: 'Couple Challenge Combo',
    category: 'Combos',
    price: 299,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    description: '2 Chicken Loaded Fries + 2 Mojitos + Game Access',
    stock: 50,
    isVeg: false,
    isAvailable: true
  },
  {
    id: 'cb-002',
    name: 'Friendly Challenge Combo',
    category: 'Combos',
    price: 249,
    image: 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=400',
    description: '2 Wraps + 1 Fries + Game Access',
    stock: 45,
    isVeg: false,
    isAvailable: true
  },
  {
    id: 'cb-003',
    name: 'Buddy Battle Combo',
    category: 'Combos',
    price: 259,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    description: '2 Crispy Snacks + 2 Mojitos + Game Access',
    stock: 40,
    isVeg: false,
    isAvailable: true
  }
];

export const categories = [
  'All',
  'Signature Loaded Fries',
  'Wraps & Rolls',
  'Crispy Snacks',
  "Momo's",
  'Cool Drinks',
  'Egg/Maggie Specials',
  'Sweet Corn',
  'Add-Ons',
  'Combos'
];

export default menuItems;
