import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import {
  defaultSettings,
  initialBanners,
  initialCoupons,
  initialCustomers,
  initialOrders,
  initialProducts,
  initialSubscribers,
  initialTestimonials,
  type Banner,
  type CartItem,
  type Coupon,
  type Customer,
  type NewsletterSubscriber,
  type Order,
  type OrderStatus,
  type Product,
  type StoreSettings,
  type Testimonial,
} from "@/data/mock-data";

const DELIVERY_FEE = 99;
type CheckoutDetails = Omit<Order, "id" | "date" | "status" | "total" | "items">;
type Setter<T> = Dispatch<SetStateAction<T>>;

type StoreContextValue = {
  products: Product[];
  setProducts: Setter<Product[]>;
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  setOrders: Setter<Order[]>;
  categories: string[];
  setCategories: Setter<string[]>;
  brands: string[];
  setBrands: Setter<string[]>;
  customers: Customer[];
  setCustomers: Setter<Customer[]>;
  coupons: Coupon[];
  setCoupons: Setter<Coupon[]>;
  banners: Banner[];
  setBanners: Setter<Banner[]>;
  testimonials: Testimonial[];
  setTestimonials: Setter<Testimonial[]>;
  subscribers: NewsletterSubscriber[];
  setSubscribers: Setter<NewsletterSubscriber[]>;
  settings: StoreSettings;
  setSettings: Setter<StoreSettings>;
  subtotal: number;
  deliveryFee: number;
  couponDiscount: number;
  grandTotal: number;
  appliedCoupon: Coupon | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isAdminAuthenticated: boolean;
  setAdminAuthenticated: (value: boolean) => void;
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  moveWishlistToCart: (productId: string) => void;
  applyCoupon: (code: string) => boolean;
  clearCoupon: () => void;
  placeOrder: (details: CheckoutDetails) => Order | null;
  updateOrder: (orderId: string, status: OrderStatus) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState(initialOrders);
  const [categories, setCategories] = useState([
    "Makeup", "Skincare", "Haircare", "Beauty Accessories", "Salon Equipment",
    "Parlour Material", "Wax Products", "Makeup Kits", "Perfumes", "Nail Care",
  ]);
  const [brands, setBrands] = useState(["Sana Select", "Color Theory", "Lumière", "Bare Botanics", "Studio Pro", "Velvet Rose"]);
  const [customers, setCustomers] = useState(initialCustomers);
  const [coupons, setCoupons] = useState(initialCoupons);
  const [banners, setBanners] = useState(initialBanners);
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [settings, setSettings] = useState(defaultSettings);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdminAuthenticated, setAdminAuthenticated] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const subtotal = useMemo(() => cart.reduce((total, item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return total + (product?.price ?? 0) * item.quantity;
  }, 0), [cart, products]);

  const activeAppliedCoupon = appliedCoupon && coupons.some((coupon) => coupon.code === appliedCoupon.code && coupon.active)
    ? coupons.find((coupon) => coupon.code === appliedCoupon.code) ?? null
    : null;
  const couponDiscount = activeAppliedCoupon
    ? activeAppliedCoupon.kind === "Percent"
      ? Math.min(subtotal, Math.round(subtotal * activeAppliedCoupon.discount / 100))
      : Math.min(subtotal, activeAppliedCoupon.discount)
    : 0;
  const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
  const grandTotal = Math.max(0, subtotal - couponDiscount) + deliveryFee;

  const addToCart = useCallback((productId: string, quantity = 1) => {
    const product = products.find((item) => item.id === productId);
    if (!product || product.stock < 1 || quantity < 1) return;
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        return current.map((item) => item.productId === productId
          ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
          : item);
      }
      return [...current, { productId, quantity: Math.min(quantity, product.stock) }];
    });
  }, [products]);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setCart((current) => current.filter((item) => item.productId !== productId));
      return;
    }
    const product = products.find((item) => item.id === productId);
    setCart((current) => current.map((item) => item.productId === productId
      ? { ...item, quantity: Math.min(quantity, product?.stock ?? quantity) }
      : item));
  }, [products]);

  const removeFromCart = useCallback((productId: string) => {
    setCart((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]);
  }, []);

  const moveWishlistToCart = useCallback((productId: string) => {
    const product = products.find((item) => item.id === productId);
    if (!product || product.stock < 1) return;
    setCart((current) => {
      const existing = current.find((item) => item.productId === productId);
      return existing
        ? current.map((item) => item.productId === productId
          ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
          : item)
        : [...current, { productId, quantity: 1 }];
    });
    setWishlist((current) => current.filter((id) => id !== productId));
  }, [products]);

  const applyCoupon = useCallback((code: string) => {
    const coupon = coupons.find((item) => item.code.toLowerCase() === code.trim().toLowerCase() && item.active);
    if (!coupon) return false;
    setAppliedCoupon(coupon);
    return true;
  }, [coupons]);

  const clearCoupon = useCallback(() => setAppliedCoupon(null), []);

  const placeOrder = useCallback((details: CheckoutDetails) => {
    if (cart.length === 0) return null;
    const orderItems = cart.flatMap((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return product && product.stock >= item.quantity
        ? [{ name: product.name, quantity: item.quantity, price: product.price }]
        : [];
    });
    if (orderItems.length !== cart.length) return null;

    const total = grandTotal;
    const id = `SC-${Date.now().toString().slice(-6)}`;
    const date = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date());
    const order: Order = { ...details, id, date, total, status: "Pending", items: orderItems };
    setOrders((current) => [order, ...current]);
    setCustomers((current) => {
      const existing = current.find((customer) => customer.email.toLowerCase() === details.email.toLowerCase());
      if (existing) {
        return current.map((customer) => customer.id === existing.id
          ? { ...customer, orders: customer.orders + 1, spent: customer.spent + total }
          : customer);
      }
      return [{ id: `CU-${Date.now().toString().slice(-4)}`, name: details.customer, email: details.email, mobile: details.mobile, orders: 1, spent: total }, ...current];
    });
    setProducts((current) => current.map((product) => {
      const purchased = cart.find((item) => item.productId === product.id);
      return purchased ? { ...product, stock: Math.max(0, product.stock - purchased.quantity) } : product;
    }));
    setCart([]);
    setAppliedCoupon(null);
    return order;
  }, [cart, products, grandTotal]);

  const updateOrder = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, status } : order));
  }, []);

  const value = useMemo<StoreContextValue>(() => ({
    products, setProducts, cart, wishlist, orders, setOrders, categories, setCategories, brands, setBrands,
    customers, setCustomers, coupons, setCoupons, banners, setBanners, testimonials, setTestimonials,
    subscribers, setSubscribers, settings, setSettings, subtotal, deliveryFee, couponDiscount, grandTotal,
    appliedCoupon: activeAppliedCoupon, searchTerm, setSearchTerm, isAdminAuthenticated,
    setAdminAuthenticated, addToCart, updateCartQuantity, removeFromCart, toggleWishlist,
    moveWishlistToCart, applyCoupon, clearCoupon, placeOrder, updateOrder,
  }), [products, cart, wishlist, orders, categories, brands, customers, coupons, banners, testimonials,
    subscribers, settings, subtotal, deliveryFee, couponDiscount, grandTotal, activeAppliedCoupon,
    searchTerm, isAdminAuthenticated, addToCart, updateCartQuantity, removeFromCart, toggleWishlist,
    moveWishlistToCart, applyCoupon, clearCoupon, placeOrder, updateOrder]);

  return <StoreContext.Provider value={value}><div data-store-theme={settings.themeColor}>{children}</div></StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}