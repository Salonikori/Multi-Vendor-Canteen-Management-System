// ─────────────────────────────────────────────────────────────────────────
// Mock data layer. In a real deployment this would be replaced by responses
// from the backend REST API (see src/services/api.js for the integration
// points where fetch/axios calls would be made instead).
// ─────────────────────────────────────────────────────────────────────────

export const VENDORS = [
  {
    id: 1,
    name: 'Spice Garden',
    cuisine: 'Indian',
    rating: 4.8,
    ordersToday: 142,
    color: '#F5A623',
    emoji: '🍛',
    stall: 'A1',
    open: true,
    prepTime: '10-15 min',
    description: 'Home-style North Indian curries and tandoor classics.',
  },
  {
    id: 2,
    name: 'Wok & Roll',
    cuisine: 'Chinese',
    rating: 4.6,
    ordersToday: 98,
    color: '#2EC4B6',
    emoji: '🍜',
    stall: 'B2',
    open: true,
    prepTime: '8-12 min',
    description: 'Indo-Chinese favorites, wok-tossed to order.',
  },
  {
    id: 3,
    name: 'The Grill House',
    cuisine: 'Continental',
    rating: 4.5,
    ordersToday: 76,
    color: '#FF6B6B',
    emoji: '🥩',
    stall: 'C3',
    open: false,
    prepTime: '15-20 min',
    description: 'Grilled mains, sandwiches and salads.',
  },
  {
    id: 4,
    name: 'Fresh Bites',
    cuisine: 'Healthy',
    rating: 4.9,
    ordersToday: 201,
    color: '#4CAF82',
    emoji: '🥗',
    stall: 'A2',
    open: true,
    prepTime: '5-8 min',
    description: 'Bowls, smoothies and light bites for clean eating.',
  },
  {
    id: 5,
    name: 'Chai & Snacks',
    cuisine: 'Beverages',
    rating: 4.7,
    ordersToday: 334,
    color: '#7C4DFF',
    emoji: '☕',
    stall: 'D1',
    open: true,
    prepTime: '3-5 min',
    description: 'Tea, coffee and quick evening snacks.',
  },
  {
    id: 6,
    name: 'Pizza Plaza',
    cuisine: 'Italian',
    rating: 4.4,
    ordersToday: 55,
    color: '#FF9800',
    emoji: '🍕',
    stall: 'B1',
    open: true,
    prepTime: '12-18 min',
    description: 'Wood-fired style pizzas and pastas.',
  },
]

export const MENU_ITEMS = {
  1: [
    { id: 101, name: 'Butter Chicken', price: 120, cat: 'Main', desc: 'Creamy tomato gravy', popular: true },
    { id: 102, name: 'Dal Tadka', price: 80, cat: 'Main', desc: 'Yellow lentil with tempering' },
    { id: 103, name: 'Naan (2 pcs)', price: 40, cat: 'Bread', desc: 'Soft leavened flatbread' },
    { id: 104, name: 'Veg Biryani', price: 110, cat: 'Rice', desc: 'Aromatic basmati rice', popular: true },
    { id: 105, name: 'Lassi', price: 45, cat: 'Drinks', desc: 'Sweet or salty yogurt drink' },
  ],
  2: [
    { id: 201, name: 'Veg Fried Rice', price: 90, cat: 'Rice', desc: 'Wok-tossed with vegetables', popular: true },
    { id: 202, name: 'Hakka Noodles', price: 95, cat: 'Noodles', desc: 'Classic spicy noodles' },
    { id: 203, name: 'Manchurian', price: 85, cat: 'Starter', desc: 'Crispy balls in sauce', popular: true },
    { id: 204, name: 'Spring Rolls (4)', price: 70, cat: 'Starter', desc: 'Crispy veggie rolls' },
    { id: 205, name: 'Clear Soup', price: 50, cat: 'Soup', desc: 'Light vegetable broth' },
  ],
  3: [
    { id: 301, name: 'Grilled Chicken', price: 180, cat: 'Main', desc: 'Herb-marinated grilled', popular: true },
    { id: 302, name: 'Club Sandwich', price: 130, cat: 'Sandwich', desc: 'Triple-decker classic' },
    { id: 303, name: 'Pasta Arrabiata', price: 140, cat: 'Pasta', desc: 'Spicy tomato pasta' },
    { id: 304, name: 'Caesar Salad', price: 120, cat: 'Salad', desc: 'Romaine with dressing' },
  ],
  4: [
    { id: 401, name: 'Buddha Bowl', price: 150, cat: 'Bowl', desc: 'Quinoa + roasted veggies', popular: true },
    { id: 402, name: 'Fruit Bowl', price: 80, cat: 'Snack', desc: 'Seasonal fresh fruits' },
    { id: 403, name: 'Avocado Toast', price: 120, cat: 'Breakfast', desc: 'Multigrain with toppings', popular: true },
    { id: 404, name: 'Green Smoothie', price: 90, cat: 'Drinks', desc: 'Spinach, banana, almond' },
    { id: 405, name: 'Oat Bowl', price: 100, cat: 'Breakfast', desc: 'Overnight oats with seeds' },
  ],
  5: [
    { id: 501, name: 'Masala Chai', price: 25, cat: 'Hot', desc: 'Spiced milk tea', popular: true },
    { id: 502, name: 'Cold Coffee', price: 60, cat: 'Cold', desc: 'Blended iced coffee' },
    { id: 503, name: 'Samosa (2)', price: 30, cat: 'Snack', desc: 'Crispy pastry pockets', popular: true },
    { id: 504, name: 'Vada Pav', price: 25, cat: 'Snack', desc: 'Mumbai street burger' },
    { id: 505, name: 'Lemonade', price: 40, cat: 'Cold', desc: 'Fresh squeezed with mint' },
  ],
  6: [
    { id: 601, name: 'Margherita Pizza', price: 160, cat: 'Pizza', desc: 'Classic tomato mozzarella', popular: true },
    { id: 602, name: 'Pepperoni Pizza', price: 190, cat: 'Pizza', desc: 'Loaded with pepperoni' },
    { id: 603, name: 'Garlic Bread', price: 80, cat: 'Sides', desc: 'Toasted herbed bread' },
    { id: 604, name: 'Pasta Carbonara', price: 150, cat: 'Pasta', desc: 'Creamy egg pasta' },
  ],
}

// Order lifecycle: pending -> preparing -> ready -> delivered
export const STATUS_FLOW = ['pending', 'preparing', 'ready', 'delivered']

export const STATUS_CONFIG = {
  pending: { label: 'Pending', color: '#F5A623', bg: 'rgba(245,166,35,0.15)' },
  preparing: { label: 'Preparing', color: '#2EC4B6', bg: 'rgba(46,196,182,0.15)' },
  ready: { label: 'Ready', color: '#4CAF82', bg: 'rgba(76,175,130,0.15)' },
  delivered: { label: 'Delivered', color: '#8B87A8', bg: 'rgba(139,135,168,0.15)' },
  cancelled: { label: 'Cancelled', color: '#FF6B6B', bg: 'rgba(255,107,107,0.15)' },
}

// Seed orders distributed across vendors and students
export const SEED_ORDERS = [
  {
    id: 'ORD-2847',
    vendorId: 1,
    studentId: 'stu-1',
    studentName: 'Rahul M.',
    table: 'T-12',
    items: [
      { name: 'Butter Chicken', qty: 1, price: 120 },
      { name: 'Naan (2 pcs)', qty: 2, price: 40 },
    ],
    status: 'preparing',
    createdAt: Date.now() - 8 * 60 * 1000,
  },
  {
    id: 'ORD-2848',
    vendorId: 5,
    studentId: 'stu-2',
    studentName: 'Priya S.',
    table: 'T-07',
    items: [
      { name: 'Masala Chai', qty: 3, price: 25 },
      { name: 'Samosa (2)', qty: 1, price: 30 },
    ],
    status: 'ready',
    createdAt: Date.now() - 14 * 60 * 1000,
  },
  {
    id: 'ORD-2849',
    vendorId: 4,
    studentId: 'stu-3',
    studentName: 'Arjun K.',
    table: 'T-03',
    items: [{ name: 'Buddha Bowl', qty: 1, price: 150 }],
    status: 'pending',
    createdAt: Date.now() - 2 * 60 * 1000,
  },
  {
    id: 'ORD-2850',
    vendorId: 2,
    studentId: 'stu-4',
    studentName: 'Sneha R.',
    table: 'T-15',
    items: [
      { name: 'Veg Fried Rice', qty: 1, price: 90 },
      { name: 'Manchurian', qty: 1, price: 85 },
    ],
    status: 'preparing',
    createdAt: Date.now() - 5 * 60 * 1000,
  },
  {
    id: 'ORD-2851',
    vendorId: 6,
    studentId: 'stu-5',
    studentName: 'Dev P.',
    table: 'T-09',
    items: [{ name: 'Margherita Pizza', qty: 1, price: 160 }],
    status: 'pending',
    createdAt: Date.now() - 1 * 60 * 1000,
  },
  {
    id: 'ORD-2841',
    vendorId: 5,
    studentId: 'stu-1',
    studentName: 'Rahul M.',
    table: 'T-12',
    items: [
      { name: 'Masala Chai', qty: 1, price: 25 },
      { name: 'Vada Pav', qty: 1, price: 25 },
    ],
    status: 'delivered',
    createdAt: Date.now() - 90 * 60 * 1000,
  },
  {
    id: 'ORD-2835',
    vendorId: 4,
    studentId: 'stu-1',
    studentName: 'Rahul M.',
    table: 'T-12',
    items: [{ name: 'Buddha Bowl', qty: 1, price: 150 }],
    status: 'delivered',
    createdAt: Date.now() - 180 * 60 * 1000,
  },
  {
    id: 'ORD-2839',
    vendorId: 1,
    studentId: 'stu-6',
    studentName: 'Vivek T.',
    table: 'T-04',
    items: [
      { name: 'Butter Chicken', qty: 1, price: 120 },
      { name: 'Lassi', qty: 1, price: 45 },
    ],
    status: 'delivered',
    createdAt: Date.now() - 35 * 60 * 1000,
  },
  {
    id: 'ORD-2836',
    vendorId: 1,
    studentId: 'stu-7',
    studentName: 'Anjali P.',
    table: 'T-10',
    items: [
      { name: 'Dal Tadka', qty: 2, price: 80 },
      { name: 'Naan (2 pcs)', qty: 4, price: 40 },
    ],
    status: 'delivered',
    createdAt: Date.now() - 50 * 60 * 1000,
  },
]

export const orderTotal = (order) => order.items.reduce((sum, i) => sum + i.price * i.qty, 0)
