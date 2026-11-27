import { storeImages } from "@/lib/media";

export type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  stock: number;
  badge: string;
  image: string;
  photos: string[];
  description: string;
  ingredients: string[];
  benefits: string[];
  directions: string;
  isNew: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
};

export type CartItem = { productId: string; quantity: number };
export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type Order = {
  id: string;
  customer: string;
  mobile: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  date: string;
  total: number;
  status: OrderStatus;
  payment: string;
  items: { name: string; quantity: number; price: number }[];
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  orders: number;
  spent: number;
};

export type Coupon = {
  code: string;
  discount: number;
  kind: "Percent" | "Flat";
  active: boolean;
  expires: string;
};

export type Testimonial = { id: string; name: string; city: string; quote: string; rating: number };
export type Banner = { id: string; title: string; subtitle: string; image: string; active: boolean };
export type NewsletterSubscriber = { id: string; email: string; date: string };
export type StoreSettings = {
  businessName: string;
  clientName: string;
  address: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  themeColor: "rose" | "berry" | "gold";
};

export const categories = [
  "Makeup",
  "Skincare",
  "Haircare",
  "Beauty Accessories",
  "Salon Equipment",
  "Parlour Material",
  "Wax Products",
  "Makeup Kits",
  "Perfumes",
  "Nail Care",
];

export const brands = ["Sana Select", "Color Theory", "Lumière", "Bare Botanics", "Studio Pro", "Velvet Rose"];

function product(input: Omit<Product, "photos">): Product {
  const galleryByCategory: Record<string, string[]> = {
    Makeup: [storeImages.makeup, storeImages.nailsKits, storeImages.accessories],
    "Makeup Kits": [storeImages.nailsKits, storeImages.makeup, storeImages.accessories],
    Skincare: [storeImages.skincare, storeImages.hero, storeImages.makeup],
    Haircare: [storeImages.haircare, storeImages.salon, storeImages.skincare],
    Perfumes: [storeImages.perfume, storeImages.hero, storeImages.makeup],
    "Beauty Accessories": [storeImages.accessories, storeImages.makeup, storeImages.nailsKits],
    "Parlour Material": [storeImages.salon, storeImages.haircare, storeImages.accessories],
    "Wax Products": [storeImages.skincare, storeImages.salon, storeImages.haircare],
    "Salon Equipment": [storeImages.salon, storeImages.haircare, storeImages.hero],
    "Nail Care": [storeImages.nailsKits, storeImages.makeup, storeImages.accessories],
  };
  const extras = galleryByCategory[input.category] ?? [storeImages.makeup, storeImages.skincare];
  const photos = Array.from(new Set([input.image, ...extras]));
  return { ...input, photos };
}

export const initialProducts: Product[] = [
  product({ id: "velvet-lip-color", name: "Velvet Matte Lip Color", category: "Makeup", brand: "Velvet Rose", price: 649, originalPrice: 849, rating: 4.8, reviews: 126, stock: 42, badge: "Bestseller", image: storeImages.makeup, description: "A soft-focus, comfortable matte lip colour with rich pigment and a refined satin finish.", ingredients: ["Jojoba oil", "Vitamin E", "Plant waxes"], benefits: ["Comfortable all-day wear", "Buildable colour", "Soft matte finish"], directions: "Apply from the centre of the lips outward. Blot once for a soft stain or layer for full colour.", isNew: false, isBestSeller: true, isFeatured: true }),
  product({ id: "skin-veil-foundation", name: "Skin Veil Foundation", category: "Makeup", brand: "Color Theory", price: 899, originalPrice: 1199, rating: 4.7, reviews: 89, stock: 18, badge: "20% off", image: storeImages.makeup, description: "A breathable, blendable foundation designed to let natural skin look like itself.", ingredients: ["Hyaluronic acid", "Vitamin E", "Mineral pigments"], benefits: ["Medium buildable coverage", "Natural satin finish", "Feels light on skin"], directions: "Blend a small amount over moisturised skin with fingers, a brush, or a damp sponge.", isNew: false, isBestSeller: false, isFeatured: true }),
  product({ id: "soft-glow-palette", name: "Soft Glow Edit Palette", category: "Makeup Kits", brand: "Lumière", price: 1299, originalPrice: 1599, rating: 4.9, reviews: 74, stock: 9, badge: "Limited edit", image: storeImages.nailsKits, description: "An easy-to-wear edit of warm neutrals, soft rose, and luminous highlight shades.", ingredients: ["Mica", "Talc", "Vitamin E"], benefits: ["Blendable pigments", "Day-to-evening shades", "Compact travel case"], directions: "Sweep a light shade across the lid, add depth at the crease, then finish with a highlight.", isNew: true, isBestSeller: false, isFeatured: true }),
  product({ id: "radiance-vitamin-serum", name: "Radiance Vitamin C Serum", category: "Skincare", brand: "Bare Botanics", price: 799, originalPrice: 999, rating: 4.8, reviews: 203, stock: 31, badge: "Glow favourite", image: storeImages.skincare, description: "A feather-light daily serum that helps skin feel refreshed, hydrated, and luminous.", ingredients: ["Vitamin C", "Hyaluronic acid", "Aloe vera"], benefits: ["Supports a bright-looking complexion", "Layers well under moisturiser", "Non-sticky feel"], directions: "Apply two to three drops to clean, dry skin in the morning. Follow with moisturiser and SPF.", isNew: false, isBestSeller: true, isFeatured: true }),
  product({ id: "cloud-cream-moisturiser", name: "Cloud Cream Moisturiser", category: "Skincare", brand: "Bare Botanics", price: 699, originalPrice: 899, rating: 4.6, reviews: 92, stock: 24, badge: "Daily ritual", image: storeImages.skincare, description: "A cushioning daily moisturiser that leaves skin feeling soft without a heavy finish.", ingredients: ["Ceramides", "Shea butter", "Squalane"], benefits: ["Comforting daily hydration", "Supports the skin barrier", "Works under makeup"], directions: "Massage a pearl-sized amount over face and neck after serum, morning or evening.", isNew: true, isBestSeller: false, isFeatured: false }),
  product({ id: "nourish-shampoo", name: "Nourish Repair Shampoo", category: "Haircare", brand: "Studio Pro", price: 549, originalPrice: 699, rating: 4.5, reviews: 61, stock: 7, badge: "Low stock", image: storeImages.haircare, description: "A gentle salon-inspired wash for hair that needs a little extra softness and shine.", ingredients: ["Argan oil", "Amino acids", "Aloe vera"], benefits: ["Cleanses without a stripped feel", "Leaves lengths soft", "Salon-size value"], directions: "Massage into wet hair and scalp. Rinse thoroughly and repeat if needed.", isNew: false, isBestSeller: false, isFeatured: false }),
  product({ id: "satin-repair-mask", name: "Satin Repair Hair Mask", category: "Haircare", brand: "Studio Pro", price: 749, originalPrice: 949, rating: 4.7, reviews: 48, stock: 15, badge: "Salon pick", image: storeImages.haircare, description: "A rich weekly treatment that helps dry lengths feel smoother and easier to style.", ingredients: ["Shea butter", "Coconut oil", "Pro-vitamin B5"], benefits: ["Adds a silky feel", "Helps detangle", "Great for weekly care"], directions: "Work through clean, damp mid-lengths and ends. Leave for five minutes, then rinse.", isNew: false, isBestSeller: true, isFeatured: false }),
  product({ id: "golden-hour-eau-de-parfum", name: "Golden Hour Eau de Parfum", category: "Perfumes", brand: "Lumière", price: 1499, originalPrice: 1899, rating: 4.8, reviews: 54, stock: 12, badge: "New", image: storeImages.perfume, description: "A softly radiant scent with a graceful balance of citrus, white florals, and warm woods.", ingredients: ["Citrus", "White florals", "Warm woods"], benefits: ["Elegant everyday profile", "Easy-to-layer scent", "Gift-ready bottle"], directions: "Mist lightly onto pulse points from a comfortable distance.", isNew: true, isBestSeller: false, isFeatured: false }),
  product({ id: "brow-and-glow-brush-set", name: "Brow & Glow Brush Set", category: "Beauty Accessories", brand: "Sana Select", price: 599, originalPrice: 799, rating: 4.6, reviews: 38, stock: 26, badge: "Everyday essential", image: storeImages.accessories, description: "A thoughtfully edited set of soft, easy-to-use brushes for everyday makeup routines.", ingredients: ["Synthetic bristles", "Aluminium ferrules", "Wood handles"], benefits: ["Soft vegan bristles", "Easy to clean", "Everyday essentials"], directions: "Wash gently with brush cleanser and allow to air dry flat after use.", isNew: false, isBestSeller: false, isFeatured: false }),
  product({ id: "studio-pro-salon-kit", name: "Studio Pro Salon Essentials Kit", category: "Parlour Material", brand: "Studio Pro", price: 2499, originalPrice: 2999, rating: 4.7, reviews: 29, stock: 6, badge: "Professional pick", image: storeImages.salon, description: "A curated set of practical salon staples for smooth, organised professional services.", ingredients: ["Salon-grade accessories", "Reusable storage case"], benefits: ["Made for busy studios", "Useful everyday essentials", "Easy to organise"], directions: "Arrange the tools before each service and clean according to the item instructions.", isNew: false, isBestSeller: false, isFeatured: false }),
  product({ id: "silk-touch-wax-strips", name: "Silk Touch Wax Strips", category: "Wax Products", brand: "Sana Select", price: 349, originalPrice: 449, rating: 4.4, reviews: 57, stock: 33, badge: "Easy care", image: storeImages.skincare, description: "Ready-to-use wax strips for a convenient, tidy at-home beauty routine.", ingredients: ["Gentle wax blend", "Post-wax wipes"], benefits: ["No warmer needed", "Easy to pack for travel", "Quick routine"], directions: "Rub strips between palms, separate, apply in the direction of hair growth, and remove as directed.", isNew: false, isBestSeller: false, isFeatured: false }),
  product({ id: "salon-comfort-chair", name: "Salon Comfort Styling Chair", category: "Salon Equipment", brand: "Studio Pro", price: 8999, originalPrice: 10999, rating: 4.9, reviews: 16, stock: 3, badge: "Professional", image: storeImages.salon, description: "A sturdy styling chair with a clean professional look for salons and beauty studios.", ingredients: ["Steel base", "Easy-clean upholstery", "Hydraulic lift"], benefits: ["Comfortable salon seating", "Adjustable styling height", "Designed for daily use"], directions: "Place on a level surface. Wipe upholstery with a soft damp cloth after use.", isNew: false, isBestSeller: false, isFeatured: false }),
  product({ id: "gel-shine-nail-lacquer", name: "Gel Shine Nail Lacquer", category: "Nail Care", brand: "Color Theory", price: 299, originalPrice: 399, rating: 4.6, reviews: 44, stock: 28, badge: "New shade", image: storeImages.nailsKits, description: "A high-gloss, chip-resistant nail colour with a smooth salon-style brush.", ingredients: ["Vitamin E", "Plant-derived solvents", "Gloss resin"], benefits: ["High-shine finish", "Even one-stroke coverage", "Quick-dry formula"], directions: "Apply two thin coats over a clean base coat and seal with a clear top coat.", isNew: true, isBestSeller: false, isFeatured: false }),
];

export const initialOrders: Order[] = [
  { id: "SC-1048", customer: "Ananya Patil", mobile: "98220 41082", email: "ananya@example.com", address: "18 Tarabai Park", city: "Kolhapur", state: "Maharashtra", pincode: "416003", date: "27 Nov 2026", total: 1948, status: "Processing", payment: "UPI", items: [{ name: "Radiance Vitamin C Serum", quantity: 1, price: 799 }, { name: "Velvet Matte Lip Color", quantity: 1, price: 649 }] },
  { id: "SC-1047", customer: "Meera Joshi", mobile: "97654 33911", email: "meera@example.com", address: "Market Yard Road", city: "Sangli", state: "Maharashtra", pincode: "416416", date: "26 Nov 2026", total: 1299, status: "Pending", payment: "Cash on Delivery", items: [{ name: "Soft Glow Edit Palette", quantity: 1, price: 1299 }] },
  { id: "SC-1046", customer: "Riya Shah", mobile: "94218 55203", email: "riya@example.com", address: "Rajarampuri", city: "Kolhapur", state: "Maharashtra", pincode: "416008", date: "25 Nov 2026", total: 1598, status: "Delivered", payment: "Credit Card", items: [{ name: "Cloud Cream Moisturiser", quantity: 1, price: 699 }, { name: "Satin Repair Hair Mask", quantity: 1, price: 749 }] },
  { id: "SC-1045", customer: "Nisha Kulkarni", mobile: "98810 26174", email: "nisha@example.com", address: "Shivaji Peth", city: "Kolhapur", state: "Maharashtra", pincode: "416012", date: "24 Nov 2026", total: 549, status: "Shipped", payment: "UPI", items: [{ name: "Nourish Repair Shampoo", quantity: 1, price: 549 }] },
];

export const initialCustomers: Customer[] = [
  { id: "CU-3001", name: "Ananya Patil", email: "ananya@example.com", mobile: "98220 41082", orders: 6, spent: 6840 },
  { id: "CU-3002", name: "Meera Joshi", email: "meera@example.com", mobile: "97654 33911", orders: 4, spent: 5120 },
  { id: "CU-3003", name: "Riya Shah", email: "riya@example.com", mobile: "94218 55203", orders: 3, spent: 3948 },
  { id: "CU-3004", name: "Nisha Kulkarni", email: "nisha@example.com", mobile: "98810 26174", orders: 2, spent: 2180 },
];

export const initialCoupons: Coupon[] = [
  { code: "GLOW10", discount: 10, kind: "Percent", active: true, expires: "31 Dec 2026" },
  { code: "WELCOME150", discount: 150, kind: "Flat", active: true, expires: "31 Dec 2026" },
  { code: "SALON15", discount: 15, kind: "Percent", active: false, expires: "30 Nov 2026" },
];

export const initialTestimonials: Testimonial[] = [
  { id: "review-1", name: "Ananya P.", city: "Kolhapur", quote: "A lovely range and such thoughtful help choosing the right products.", rating: 5 },
  { id: "review-2", name: "Meera J.", city: "Sangli", quote: "My salon essentials arrived neatly packed. I will definitely order again.", rating: 5 },
  { id: "review-3", name: "Riya S.", city: "Kolhapur", quote: "The skincare recommendations were spot on, and the prices feel fair.", rating: 5 },
];

export const initialBanners: Banner[] = [
  { id: "main-banner", title: "Enhance your natural beauty", subtitle: "Premium cosmetics and beauty essentials for every occasion, routine, and creative moment.", image: storeImages.hero, active: true },
];

export const initialSubscribers: NewsletterSubscriber[] = [];

export const defaultSettings: StoreSettings = {
  businessName: "Sana Cosmetics",
  clientName: "Sana",
  address: "Shop No.6, Sharda Vihar, Isolation Ring Road, Near Dhyanchand Hockey Stadium, Padmala, Kolhapur, Maharashtra 416007",
  phone: "9421216286",
  email: "sanacosmetic@gmail.com",
  instagram: "@sanacosmetics",
  facebook: "Sana Cosmetics",
  themeColor: "rose",
};

export const DEMO_ADMIN = { username: "admin", password: "admin123" };