import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Heart, Minus, Plus, ShoppingBag, Star, Trash2 } from "lucide-react";

import { useStore } from "@/context/store-context";
import { formatINR } from "@/lib/store-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageIntro, StorefrontLayout } from "@/components/storefront/layout";
import { ProductCard, ProductGrid } from "@/components/storefront/product-card";
import type { Order, Product } from "@/data/mock-data";

const controlClass = "h-10 w-full border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export function CatalogPage({ initialCategory, initialSort }: { initialCategory: string; initialSort: string }) {
  const { products, categories, brands, searchTerm, setSearchTerm } = useStore();
  const [category, setCategory] = useState(initialCategory);
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState("");
  const [discountOnly, setDiscountOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState(initialSort);

  useEffect(() => setCategory(initialCategory), [initialCategory]);
  useEffect(() => setSort(initialSort), [initialSort]);

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const minimum = minPrice === "" ? 0 : Number(minPrice);
    const maximum = maxPrice === "" ? Number.POSITIVE_INFINITY : Number(maxPrice);
    const list = products.filter((product) => {
      const matchesQuery = !query || `${product.name} ${product.category} ${product.brand}`.toLowerCase().includes(query);
      const discount = Math.round((1 - product.price / product.originalPrice) * 100);
      return matchesQuery
        && (!category || product.category === category)
        && (!brand || product.brand === brand)
        && product.price >= minimum && product.price <= maximum
        && (!rating || product.rating >= Number(rating))
        && (!discountOnly || discount > 0)
        && (!inStockOnly || product.stock > 0);
    });
    if (sort === "new") return list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    if (sort === "best") return list.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
    if (sort === "price-low") return list.sort((a, b) => a.price - b.price);
    if (sort === "price-high") return list.sort((a, b) => b.price - a.price);
    if (sort === "rating") return list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, searchTerm, category, brand, minPrice, maxPrice, rating, discountOnly, inStockOnly, sort]);

  function resetFilters() {
    setCategory(""); setBrand(""); setMinPrice(""); setMaxPrice(""); setRating(""); setDiscountOnly(false); setInStockOnly(false); setSearchTerm(""); setSort("");
  }

  return <StorefrontLayout>
    <PageIntro eyebrow="THE BEAUTY EDIT" title="Find your next favourite" description="Explore colour, care, fragrance, and professional essentials—thoughtfully selected by Sana." />
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[230px_1fr] lg:px-8">
      <aside className="space-y-6 border-b border-border pb-6 lg:border-b-0 lg:border-r lg:pr-7" aria-label="Product filters">
        <div className="flex items-center justify-between"><h2 className="font-display text-2xl">Filters</h2><Button type="button" variant="link" size="sm" onClick={resetFilters}>Clear</Button></div>
        <label className="block text-xs font-medium">Search<input className={`${controlClass} mt-2`} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Name, brand, category" /></label>
        <label className="block text-xs font-medium">Category<select className={`${controlClass} mt-2`} value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <label className="block text-xs font-medium">Brand<select className={`${controlClass} mt-2`} value={brand} onChange={(event) => setBrand(event.target.value)}><option value="">All brands</option>{brands.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
        <fieldset><legend className="text-xs font-medium">Price range</legend><div className="mt-2 grid grid-cols-2 gap-2"><Input type="number" min="0" aria-label="Minimum price" placeholder="Min ₹" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} /><Input type="number" min="0" aria-label="Maximum price" placeholder="Max ₹" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} /></div></fieldset>
        <label className="block text-xs font-medium">Customer rating<select className={`${controlClass} mt-2`} value={rating} onChange={(event) => setRating(event.target.value)}><option value="">Any rating</option><option value="4">4 stars & up</option><option value="4.5">4.5 stars & up</option></select></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} className="size-4 accent-primary" />In stock only</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={discountOnly} onChange={(event) => setDiscountOnly(event.target.checked)} className="size-4 accent-primary" />On offer</label>
      </aside>
      <section>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-semibold tracking-[0.2em] text-primary">A CONSIDERED COLLECTION</p><p className="mt-1 text-sm text-muted-foreground">{filtered.length} products</p></div><label className="flex items-center gap-2 text-xs text-muted-foreground">Sort by<select className="h-9 border border-input bg-background px-3 text-sm text-foreground" value={sort} onChange={(event) => setSort(event.target.value)}><option value="">Recommended</option><option value="new">New arrivals</option><option value="best">Best sellers</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select></label></div>
        <ProductGrid products={filtered} />
      </section>
    </div>
  </StorefrontLayout>;
}

export function ProductDetailsPage({ slug }: { slug: string }) {
  const { products, addToCart, wishlist, toggleWishlist } = useStore();
  const product = products.find((item) => item.id === slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return <StorefrontLayout><div className="mx-auto max-w-7xl px-4 py-24 text-center"><h1 className="text-4xl">We couldn’t find that product.</h1><Button asChild className="mt-5"><Link to="/products">Back to the edit</Link></Button></div></StorefrontLayout>;

  const similar = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const images = product.photos.length ? product.photos : [product.image];
  const isSaved = wishlist.includes(product.id);

  function addProduct() {
    addToCart(product.id, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return <StorefrontLayout>
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/products" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary"><ArrowLeft size={15} /> Back to the edit</Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="grid grid-cols-[64px_1fr] gap-3 sm:grid-cols-[84px_1fr]">
          <div className="flex flex-col gap-2">{images.map((image, index) => <Button key={`${image}-${index}`} variant="ghost" onClick={() => setSelectedImage(index)} aria-label={`View product image ${index + 1}`} className={`h-auto w-full rounded-none p-0 ${selectedImage === index ? "ring-1 ring-primary" : "opacity-65"}`}><img src={image} alt={`${product.name} view ${index + 1}`} className="aspect-square w-full object-cover" /></Button>)}</div>
          <div className="overflow-hidden bg-secondary/60"><Button variant="ghost" onClick={() => setZoomed((value) => !value)} aria-label={zoomed ? "Zoom out product image" : "Zoom product image"} className="h-full w-full rounded-none p-0"><img src={images[selectedImage] ?? product.image} alt={product.name} className={`aspect-[4/5] w-full object-cover transition-transform duration-300 ${zoomed ? "scale-150" : "scale-100"}`} /></Button></div>
        </div>
        <div className="py-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{product.brand} <span className="mx-1 text-gold">·</span> {product.category}</p>
          <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm"><span className="flex items-center gap-1"><Star size={15} className="fill-gold text-gold" />{product.rating.toFixed(1)}</span><a href="#reviews" className="text-muted-foreground underline underline-offset-4">{product.reviews} reviews</a><span className={product.stock > 0 ? "text-success" : "text-destructive"}>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</span></div>
          <div className="mt-5 flex items-center gap-3"><span className="text-2xl font-semibold">{formatINR(product.price)}</span><span className="text-sm text-muted-foreground line-through">{formatINR(product.originalPrice)}</span><span className="bg-secondary px-2 py-1 text-[10px] font-semibold text-primary">{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF</span></div>
          <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">{product.description}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3"><div className="flex h-11 items-center border border-input"><Button variant="ghost" size="icon" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={15} /></Button><span className="min-w-8 text-center text-sm">{quantity}</span><Button variant="ghost" size="icon" aria-label="Increase quantity" disabled={quantity >= product.stock} onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}><Plus size={15} /></Button></div><Button onClick={addProduct} disabled={product.stock < 1} className="min-w-48 flex-1 sm:flex-none"><ShoppingBag /> Add to bag</Button><Button variant="outline" size="icon" aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={isSaved} onClick={() => toggleWishlist(product.id)}><Heart className={isSaved ? "fill-primary text-primary" : ""} /></Button></div>
          {added && <p role="status" className="mt-3 text-sm text-success">Added to your bag.</p>}
          <div className="mt-8 border-t border-border pt-6"><h2 className="text-xl">Why you’ll love it</h2><ul className="mt-3 grid gap-2 text-sm text-muted-foreground">{product.benefits.map((benefit) => <li key={benefit} className="flex gap-2"><span className="text-primary">✦</span>{benefit}</li>)}</ul></div>
        </div>
      </div>
      <div className="mt-14 grid gap-10 border-y border-border py-8 md:grid-cols-3">
        <div><h2 className="font-display text-2xl">Ingredients</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{product.ingredients.join(" · ")}</p></div>
        <div><h2 className="font-display text-2xl">How to use</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{product.directions}</p></div>
        <div id="reviews"><h2 className="font-display text-2xl">Reviews</h2><p className="mt-3 flex items-center gap-2 text-sm"><Star size={16} className="fill-gold text-gold" /> {product.rating.toFixed(1)} average from {product.reviews} reviews</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Loved by customers who appreciate a thoughtful beauty routine.</p></div>
      </div>
      {similar.length > 0 && <section className="py-12"><div className="mb-7 flex items-end justify-between"><div><p className="text-[10px] font-semibold tracking-[0.2em] text-primary">KEEP EXPLORING</p><h2 className="mt-1 text-3xl">You may also love</h2></div><Link to="/products" className="text-sm hover:text-primary">Shop all <ArrowRight size={14} className="ml-1 inline" /></Link></div><ProductGrid products={similar} /></section>}
    </div>
  </StorefrontLayout>;
}

export function CartPage() {
  const { cart, products, subtotal, deliveryFee, couponDiscount, grandTotal, appliedCoupon, applyCoupon, clearCoupon, updateCartQuantity, removeFromCart } = useStore();
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const rows = cart.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return product ? [{ product, quantity: item.quantity }] : [];
  });

  function submitCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const success = applyCoupon(couponCode);
    setCouponMessage(success ? "Offer applied to your order." : "That code isn’t active. Try GLOW10 or WELCOME150.");
  }

  return <StorefrontLayout>
    <PageIntro eyebrow="YOUR SELECTION" title="Your shopping bag" description="Your favourites, gathered in one place." />
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_350px] lg:px-8">
      <section>
        {rows.length === 0 ? <div className="border-y border-border py-16 text-center"><ShoppingBag size={28} className="mx-auto text-primary" /><h2 className="mt-4 font-display text-3xl">Your bag is taking a breather.</h2><p className="mt-2 text-sm text-muted-foreground">Explore something lovely and it will appear here.</p><Button asChild className="mt-6"><Link to="/products">Discover the edit</Link></Button></div> : <div className="divide-y divide-border border-y border-border">
          {rows.map(({ product, quantity }) => <article key={product.id} className="grid grid-cols-[88px_1fr] gap-4 py-5 sm:grid-cols-[110px_1fr_auto] sm:items-center"><img src={product.image} alt={product.name} className="aspect-square w-full object-cover" /><div className="min-w-0"><p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{product.brand}</p><Link to="/products/$slug" params={{ slug: product.id }} className="mt-1 block font-medium hover:text-primary">{product.name}</Link><p className="mt-1 text-sm font-semibold">{formatINR(product.price)}</p><div className="mt-3 flex items-center gap-2"><div className="flex items-center border border-input"><Button variant="ghost" size="icon" aria-label={`Decrease ${product.name} quantity`} onClick={() => updateCartQuantity(product.id, quantity - 1)}><Minus size={14} /></Button><span className="min-w-7 text-center text-xs">{quantity}</span><Button variant="ghost" size="icon" aria-label={`Increase ${product.name} quantity`} disabled={quantity >= product.stock} onClick={() => updateCartQuantity(product.id, quantity + 1)}><Plus size={14} /></Button></div><Button variant="ghost" size="sm" onClick={() => removeFromCart(product.id)}><Trash2 size={14} />Remove</Button></div></div><p className="col-start-2 text-sm font-semibold sm:col-start-auto">{formatINR(product.price * quantity)}</p></article>)}
        </div>}
        {rows.length > 0 && <form onSubmit={submitCoupon} className="mt-7 max-w-md"><label className="text-xs font-medium" htmlFor="coupon">Have a promo code?</label><div className="mt-2 flex gap-2"><Input id="coupon" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Enter code" /><Button type="submit" variant="outline">Apply</Button></div>{couponMessage && <p role="status" className={`mt-2 text-xs ${appliedCoupon ? "text-success" : "text-destructive"}`}>{couponMessage}</p>}</form>}
      </section>
      <aside className="h-fit border border-border bg-card p-5 sm:p-6"><h2 className="font-display text-2xl">Order summary</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(subtotal)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{deliveryFee === 0 ? "—" : formatINR(deliveryFee)}</span></div>{appliedCoupon && <div className="flex justify-between text-success"><span>Offer · {appliedCoupon.code}</span><Button variant="link" size="sm" onClick={clearCoupon}>Remove</Button><span>-{formatINR(couponDiscount)}</span></div>}<div className="flex justify-between border-t border-border pt-3 text-base font-semibold"><span>Total</span><span>{formatINR(grandTotal)}</span></div></div><Button asChild disabled={rows.length === 0} className="mt-6 w-full"><Link to="/checkout">Continue to checkout <ArrowRight /></Link></Button><p className="mt-3 text-center text-xs text-muted-foreground">Payments are simulated for this preview.</p></aside>
    </div>
  </StorefrontLayout>;
}

export function WishlistPage() {
  const { products, wishlist } = useStore();
  const saved = products.filter((product) => wishlist.includes(product.id));
  return <StorefrontLayout><PageIntro eyebrow="SAVED FOR LATER" title="Your wishlist" description="The pieces you’d like to come back to." /><section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">{saved.length ? <ProductGrid products={saved} /> : <div className="border-y border-border py-16 text-center"><Heart size={28} className="mx-auto text-primary" /><h2 className="mt-4 font-display text-3xl">Nothing saved just yet.</h2><p className="mt-2 text-sm text-muted-foreground">Tap the heart on anything you love and we’ll keep it here.</p><Button asChild className="mt-6"><Link to="/products">Browse products</Link></Button></div>}</section></StorefrontLayout>;
}

type CheckoutDraft = { customer: string; mobile: string; email: string; address: string; city: string; state: string; pincode: string; payment: string };
const blankCheckout: CheckoutDraft = { customer: "", mobile: "", email: "", address: "", city: "", state: "Maharashtra", pincode: "", payment: "Cash on Delivery" };

export function CheckoutPage() {
  const { cart, products, subtotal, deliveryFee, couponDiscount, grandTotal, appliedCoupon, placeOrder } = useStore();
  const [form, setForm] = useState(blankCheckout);
  const [order, setOrder] = useState<Order | null>(null);
  const [formError, setFormError] = useState("");
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  function updateField(field: keyof CheckoutDraft, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const created = placeOrder(form);
    if (!created) {
      setFormError("A product in your bag is no longer available. Please review your bag.");
      return;
    }
    setOrder(created);
    setFormError("");
  }

  if (order) return <StorefrontLayout><div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6"><span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-success">✓</span><p className="mt-5 text-[10px] font-semibold tracking-[0.2em] text-primary">ORDER RECEIVED</p><h1 className="mt-2 text-5xl">Thank you, {order.customer.split(" ")[0]}.</h1><p className="mt-4 text-sm leading-6 text-muted-foreground">Your demo order <strong className="text-foreground">{order.id}</strong> has been placed. No payment was collected.</p><div className="mt-8 border-y border-border py-5 text-left"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Order total</span><span className="font-semibold">{formatINR(order.total)}</span></div><p className="mt-2 text-xs text-muted-foreground">{order.payment} · {order.date}</p></div><Button asChild className="mt-7"><Link to="/products">Continue shopping</Link></Button></div></StorefrontLayout>;

  const checkoutItems = cart.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return product ? [{ product, quantity: item.quantity }] : [];
  });

  if (checkoutItems.length === 0) return <StorefrontLayout><div className="mx-auto max-w-2xl px-4 py-20 text-center"><h1 className="text-4xl">Your bag is empty.</h1><Button asChild className="mt-6"><Link to="/products">Find something lovely</Link></Button></div></StorefrontLayout>;

  return <StorefrontLayout>
    <PageIntro eyebrow="ALMOST YOURS" title="A few details, then done" description="Tell us where to send your order. This demo checkout will not collect payment." />
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_370px] lg:px-8">
      <form onSubmit={submit} className="space-y-8">
        <section><h2 className="font-display text-2xl">Contact & delivery</h2><div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-medium sm:col-span-2">Full name<Input required autoComplete="name" className="mt-2" value={form.customer} onChange={(event) => updateField("customer", event.target.value)} /></label>
          <label className="text-xs font-medium">Mobile number<Input required type="tel" autoComplete="tel" pattern="[0-9+() -]{8,18}" className="mt-2" value={form.mobile} onChange={(event) => updateField("mobile", event.target.value)} /></label>
          <label className="text-xs font-medium">Email address<Input required type="email" autoComplete="email" className="mt-2" value={form.email} onChange={(event) => updateField("email", event.target.value)} /></label>
          <label className="text-xs font-medium sm:col-span-2">Street address<Textarea required autoComplete="street-address" className="mt-2" rows={3} value={form.address} onChange={(event) => updateField("address", event.target.value)} /></label>
          <label className="text-xs font-medium">City<Input required autoComplete="address-level2" className="mt-2" value={form.city} onChange={(event) => updateField("city", event.target.value)} /></label>
          <label className="text-xs font-medium">State<Input required autoComplete="address-level1" className="mt-2" value={form.state} onChange={(event) => updateField("state", event.target.value)} /></label>
          <label className="text-xs font-medium">Pincode<Input required inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{6}" className="mt-2" value={form.pincode} onChange={(event) => updateField("pincode", event.target.value)} /></label>
        </div></section>
        <fieldset><legend className="font-display text-2xl">Payment method</legend><div className="mt-4 grid gap-3 sm:grid-cols-3">{["Cash on Delivery", "UPI", "Credit Card"].map((method) => <label key={method} className={`flex cursor-pointer items-center gap-2 border p-3 text-sm ${form.payment === method ? "border-primary bg-secondary/50" : "border-border"}`}><input type="radio" name="payment" value={method} checked={form.payment === method} onChange={(event) => updateField("payment", event.target.value)} className="accent-primary" />{method}</label>)}</div><p className="mt-2 text-xs text-muted-foreground">No real payment is processed.</p></fieldset>
        {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}
        <Button type="submit" size="lg" className="w-full sm:w-auto">Place demo order · {formatINR(grandTotal)}</Button>
      </form>
      <aside className="h-fit border border-border bg-card p-5 sm:p-6"><h2 className="font-display text-2xl">Your order</h2><div className="mt-5 divide-y divide-border">{checkoutItems.map(({ product, quantity }) => <div key={product.id} className="flex justify-between gap-3 py-3 text-sm"><span className="min-w-0"><span className="block truncate">{product.name}</span><span className="text-xs text-muted-foreground">Qty {quantity}</span></span><span>{formatINR(product.price * quantity)}</span></div>)}</div><div className="mt-3 space-y-3 border-t border-border pt-4 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({itemCount} items)</span><span>{formatINR(subtotal)}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{deliveryFee ? formatINR(deliveryFee) : "—"}</span></div>{appliedCoupon && <div className="flex justify-between text-success"><span>Offer · {appliedCoupon.code}</span><span>-{formatINR(couponDiscount)}</span></div>}<div className="flex justify-between border-t border-border pt-3 text-base font-semibold"><span>Total</span><span>{formatINR(grandTotal)}</span></div></div><p className="mt-4 text-xs leading-5 text-muted-foreground">Your details stay in this preview session only.</p></aside>
    </div>
  </StorefrontLayout>;
}

export type CatalogSort = "" | "new" | "best";