import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Heart, Minus, Plus, ShieldCheck, ShoppingBag, Sparkles, Star, Trash2, ZoomIn } from "lucide-react";

import { useStore } from "@/context/store-context";
import { formatINR } from "@/lib/store-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageIntro, StorefrontLayout } from "@/components/storefront/layout";
import { ProductCard, ProductGrid } from "@/components/storefront/product-card";
import type { Order } from "@/data/mock-data";

const controlClass =
  "h-10 w-full rounded-xl border border-input bg-background px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

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
  const [page, setPage] = useState(1);
  const pageSize = 8;

  useEffect(() => setCategory(initialCategory), [initialCategory]);
  useEffect(() => setSort(initialSort), [initialSort]);
  useEffect(() => setPage(1), [searchTerm, category, brand, minPrice, maxPrice, rating, discountOnly, inStockOnly, sort]);

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const minimum = minPrice === "" ? 0 : Number(minPrice);
    const maximum = maxPrice === "" ? Number.POSITIVE_INFINITY : Number(maxPrice);
    const list = products.filter((product) => {
      const matchesQuery = !query || `${product.name} ${product.category} ${product.brand}`.toLowerCase().includes(query);
      const discount = Math.round((1 - product.price / product.originalPrice) * 100);
      return (
        matchesQuery &&
        (!category || product.category === category) &&
        (!brand || product.brand === brand) &&
        product.price >= minimum &&
        product.price <= maximum &&
        (!rating || product.rating >= Number(rating)) &&
        (!discountOnly || discount > 0) &&
        (!inStockOnly || product.stock > 0)
      );
    });
    if (sort === "new") return list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    if (sort === "best") return list.sort((a, b) => Number(b.isBestSeller) - Number(a.isBestSeller));
    if (sort === "price-low") return list.sort((a, b) => a.price - b.price);
    if (sort === "price-high") return list.sort((a, b) => b.price - a.price);
    if (sort === "rating") return list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, searchTerm, category, brand, minPrice, maxPrice, rating, discountOnly, inStockOnly, sort]);

  function resetFilters() {
    setCategory("");
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    setRating("");
    setDiscountOnly(false);
    setInStockOnly(false);
    setSearchTerm("");
    setSort("");
  }

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <StorefrontLayout>
      <PageIntro eyebrow="THE BEAUTY EDIT" title="Find your next favourite" description="Explore colour, care, fragrance, and professional beauty essentials—thoughtfully curated by Sana." />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className="h-fit space-y-5 rounded-2xl border border-border bg-card p-5 shadow-xs lg:sticky lg:top-28" aria-label="Product filters">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-display text-2xl">Filters</h2>
            <Button type="button" variant="link" size="sm" onClick={resetFilters}>Clear all</Button>
          </div>
          <label className="block text-xs font-medium">Search<input className={`${controlClass} mt-2`} value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Name, brand, category" /></label>
          <label className="block text-xs font-medium">Category<select className={`${controlClass} mt-2`} value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="block text-xs font-medium">Brand<select className={`${controlClass} mt-2`} value={brand} onChange={(event) => setBrand(event.target.value)}><option value="">All brands</option>{brands.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <fieldset>
            <legend className="text-xs font-medium">Price range</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Input type="number" min="0" aria-label="Minimum price" placeholder="Min ₹" className="rounded-xl" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} />
              <Input type="number" min="0" aria-label="Maximum price" placeholder="Max ₹" className="rounded-xl" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} />
            </div>
          </fieldset>
          <label className="block text-xs font-medium">Customer rating<select className={`${controlClass} mt-2`} value={rating} onChange={(event) => setRating(event.target.value)}><option value="">Any rating</option><option value="4">4 stars &amp; up</option><option value="4.5">4.5 stars &amp; up</option></select></label>
          <div className="space-y-2.5 border-t border-border pt-4">
            <label className="flex items-center gap-2.5 text-sm"><input type="checkbox" checked={inStockOnly} onChange={(event) => setInStockOnly(event.target.checked)} className="size-4 accent-primary" />In stock only</label>
            <label className="flex items-center gap-2.5 text-sm"><input type="checkbox" checked={discountOnly} onChange={(event) => setDiscountOnly(event.target.checked)} className="size-4 accent-primary" />On offer</label>
          </div>
        </aside>
        <section>
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-border bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.22em] text-primary">A CONSIDERED COLLECTION</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{filtered.length} products available</p>
            </div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              Sort by
              <select className="h-9 rounded-full border border-input bg-background px-4 text-sm text-foreground" value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="">Recommended</option>
                <option value="new">New arrivals</option>
                <option value="best">Best sellers</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
            </label>
          </div>
          <ProductGrid products={paginated} />
          {totalPages > 1 && (
            <nav aria-label="Catalog pagination" className="mt-10 flex items-center justify-center gap-2 border-t border-border pt-6">
              <Button type="button" variant="outline" size="sm" className="rounded-full" disabled={currentPage <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</Button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <Button key={pageNumber} type="button" variant={pageNumber === currentPage ? "default" : "outline"} size="sm" className="rounded-full" aria-current={pageNumber === currentPage ? "page" : undefined} onClick={() => setPage(pageNumber)}>
                  {pageNumber}
                </Button>
              ))}
              <Button type="button" variant="outline" size="sm" className="rounded-full" disabled={currentPage >= totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>Next</Button>
            </nav>
          )}
        </section>
      </div>
    </StorefrontLayout>
  );
}

export function ProductDetailsPage({ slug }: { slug: string }) {
  const { products, addToCart, wishlist, toggleWishlist } = useStore();
  const product = products.find((item) => item.id === slug);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <StorefrontLayout>
        <div className="mx-auto max-w-7xl px-4 py-24 text-center">
          <h1 className="text-4xl">We couldn’t find that product.</h1>
          <Button asChild className="mt-5 rounded-full"><Link to="/products" search={{}}>Back to the edit</Link></Button>
        </div>
      </StorefrontLayout>
    );
  }

  const similar = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const images = product.photos.length ? product.photos : [product.image];
  const isSaved = wishlist.includes(product.id);
  const currentProduct = product;
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  function addProduct() {
    addToCart(currentProduct.id, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <StorefrontLayout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/products" search={{}} className="hover:text-primary">Shop</Link>
          <span>/</span>
          <Link to="/products" search={{ category: product.category, sort: "" }} className="hover:text-primary">{product.category}</Link>
          <span>/</span>
          <span className="truncate font-medium text-foreground">{product.name}</span>
        </nav>
        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="grid grid-cols-[68px_1fr] gap-3 sm:grid-cols-[88px_1fr]">
            <div className="flex flex-col gap-2.5">
              {images.map((image, index) => (
                <Button key={`${image}-${index}`} variant="ghost" onClick={() => setSelectedImage(index)} aria-label={`View product image ${index + 1}`} className={`h-auto w-full overflow-hidden rounded-xl p-0 ${selectedImage === index ? "ring-2 ring-primary" : "opacity-65 hover:opacity-100"}`}>
                  <img src={image} alt={`${product.name} view ${index + 1}`} className="aspect-square w-full object-cover" />
                </Button>
              ))}
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <Button variant="ghost" onClick={() => setZoomed((value) => !value)} aria-label={zoomed ? "Zoom out product image" : "Zoom product image"} className="h-full w-full rounded-none p-0">
                <img src={images[selectedImage] ?? product.image} alt={product.name} className={`aspect-[4/5] w-full object-cover transition-transform duration-300 ${zoomed ? "scale-150 cursor-zoom-out" : "scale-100 cursor-zoom-in"}`} />
              </Button>
              <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-foreground shadow-xs">
                <ZoomIn size={13} /> {zoomed ? "Click to reset" : "Click to zoom"}
              </span>
            </div>
          </div>
          <div className="py-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">
              {product.brand} <span className="mx-1 text-[#FFD700]">·</span> {product.category}
            </p>
            <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">{product.name}</h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium"><Star size={14} className="fill-[#FFD700] text-[#FFD700]" /> {product.rating.toFixed(1)}</span>
              <a href="#reviews" className="text-muted-foreground underline underline-offset-4 hover:text-primary">{product.reviews} reviews</a>
              <span className={`font-medium ${product.stock > 0 ? "text-success" : "text-destructive"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <span className="text-3xl font-semibold">{formatINR(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-base text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>
                  <span className="rounded-full bg-[#D81B60] px-3 py-1 text-[10px] font-semibold text-white">{discount}% OFF</span>
                </>
              )}
            </div>
            <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">{product.description}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="flex h-11 items-center rounded-full border border-input bg-card px-1">
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={15} /></Button>
                <span className="min-w-8 text-center text-sm font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" className="rounded-full" aria-label="Increase quantity" disabled={quantity >= product.stock} onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}><Plus size={15} /></Button>
              </div>
              <Button onClick={addProduct} disabled={product.stock < 1} size="lg" className="min-w-48 flex-1 rounded-full sm:flex-none">
                <ShoppingBag size={16} /> Add to Bag
              </Button>
              <Button variant="outline" size="icon" className="size-11 rounded-full" aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={isSaved} onClick={() => toggleWishlist(product.id)}>
                <Heart size={18} className={isSaved ? "fill-primary text-primary" : ""} />
              </Button>
            </div>
            {added && <p role="status" className="mt-3 text-sm font-medium text-success">Added to your shopping bag.</p>}
            <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl border border-border bg-secondary/35 p-3 text-center text-[11px] font-medium text-foreground/80">
              <span>✦ 100% Authentic</span>
              <span>✦ Retail &amp; Wholesale</span>
              <span>✦ Kolhapur Dispatch</span>
            </div>
            <div className="mt-6 rounded-2xl border border-border bg-card p-5">
              <h2 className="text-xl">Key Benefits</h2>
              <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
                {product.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2"><Sparkles size={13} className="shrink-0 text-primary" />{benefit}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6"><h2 className="font-display text-2xl">Ingredients</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{product.ingredients.length ? product.ingredients.join(" · ") : "Formulated with salon-grade beauty ingredients."}</p></div>
          <div className="rounded-2xl border border-border bg-card p-6"><h2 className="font-display text-2xl">How to Use</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">{product.directions || "Apply as part of your daily beauty ritual."}</p></div>
          <div id="reviews" className="rounded-2xl border border-border bg-card p-6"><h2 className="font-display text-2xl">Customer Reviews</h2><p className="mt-3 flex items-center gap-2 text-sm font-medium"><Star size={16} className="fill-[#FFD700] text-[#FFD700]" /> {product.rating.toFixed(1)} average from {product.reviews} reviews</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Loved by customers who appreciate a thoughtful beauty routine.</p></div>
        </div>
        {similar.length > 0 && (
          <section className="py-14">
            <div className="mb-7 flex items-end justify-between">
              <div><p className="text-[10px] font-semibold tracking-[0.22em] text-primary">KEEP EXPLORING</p><h2 className="mt-1 text-3xl">Similar Products</h2></div>
              <Link to="/products" search={{}} className="text-sm font-medium text-primary hover:underline">Shop all <ArrowRight size={14} className="ml-1 inline" /></Link>
            </div>
            <ProductGrid products={similar} />
          </section>
        )}
      </div>
    </StorefrontLayout>
  );
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

  return (
    <StorefrontLayout>
      <PageIntro eyebrow="YOUR SELECTION" title="Your shopping bag" description="Review your chosen beauty favourites before checkout." />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_370px] lg:px-8">
        <section>
          {rows.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card py-16 text-center">
              <ShoppingBag size={30} className="mx-auto text-primary" />
              <h2 className="mt-4 font-display text-3xl">Your bag is taking a breather.</h2>
              <p className="mt-2 text-sm text-muted-foreground">Explore our cosmetics, skincare, and salon essentials.</p>
              <Button asChild className="mt-6 rounded-full px-7"><Link to="/products" search={{}}>Discover the Edit</Link></Button>
            </div>
          ) : (
            <div className="divide-y divide-border rounded-2xl border border-border bg-card px-5">
              {rows.map(({ product, quantity }) => (
                <article key={product.id} className="grid grid-cols-[88px_1fr] gap-4 py-5 sm:grid-cols-[110px_1fr_auto] sm:items-center">
                  <img src={product.image} alt={product.name} className="aspect-square w-full rounded-xl object-cover" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">{product.brand}</p>
                    <Link to="/products/$slug" params={{ slug: product.id }} className="mt-1 block font-medium hover:text-primary">{product.name}</Link>
                    <p className="mt-1 text-sm font-semibold">{formatINR(product.price)}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center rounded-full border border-input px-1">
                        <Button variant="ghost" size="icon" className="size-7 rounded-full" aria-label={`Decrease ${product.name} quantity`} onClick={() => updateCartQuantity(product.id, quantity - 1)}><Minus size={13} /></Button>
                        <span className="min-w-6 text-center text-xs font-medium">{quantity}</span>
                        <Button variant="ghost" size="icon" className="size-7 rounded-full" aria-label={`Increase ${product.name} quantity`} disabled={quantity >= product.stock} onClick={() => updateCartQuantity(product.id, quantity + 1)}><Plus size={13} /></Button>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(product.id)}><Trash2 size={14} /> Remove</Button>
                    </div>
                  </div>
                  <p className="col-start-2 text-base font-semibold sm:col-start-auto">{formatINR(product.price * quantity)}</p>
                </article>
              ))}
            </div>
          )}
          {rows.length > 0 && (
            <form onSubmit={submitCoupon} className="mt-6 max-w-md rounded-2xl border border-border bg-card p-5">
              <label className="text-xs font-medium" htmlFor="coupon">Have a promo code? <span className="text-muted-foreground">(Try GLOW10 or WELCOME150)</span></label>
              <div className="mt-2 flex gap-2">
                <Input id="coupon" value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Enter code" className="rounded-full" />
                <Button type="submit" variant="outline" className="rounded-full px-5">Apply</Button>
              </div>
              {couponMessage && <p role="status" className={`mt-2 text-xs ${appliedCoupon ? "text-success" : "text-destructive"}`}>{couponMessage}</p>}
            </form>
          )}
        </section>
        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-xs">
          <h2 className="font-display text-2xl">Order Summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery charges</span><span>{deliveryFee === 0 ? "—" : formatINR(deliveryFee)}</span></div>
            {appliedCoupon && (
              <div className="flex items-center justify-between text-success">
                <span>Offer · {appliedCoupon.code}</span>
                <div className="flex items-center gap-2"><Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={clearCoupon}>Remove</Button><span>-{formatINR(couponDiscount)}</span></div>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold"><span>Grand Total</span><span>{formatINR(grandTotal)}</span></div>
          </div>
          <Button asChild disabled={rows.length === 0} className="mt-6 w-full rounded-full" size="lg">
            <Link to="/checkout">Continue to Checkout <ArrowRight size={16} /></Link>
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck size={14} className="text-primary" /> Simulated checkout for preview</p>
        </aside>
      </div>
    </StorefrontLayout>
  );
}

export function WishlistPage() {
  const { products, wishlist, moveWishlistToCart, toggleWishlist } = useStore();
  const saved = products.filter((product) => wishlist.includes(product.id));
  return (
    <StorefrontLayout>
      <PageIntro eyebrow="SAVED FOR LATER" title="Your wishlist" description="Keep your favourite lipsticks, serums, and salon essentials ready to move to your bag." />
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {saved.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {saved.map((product) => (
              <div key={product.id} className="flex flex-col gap-3">
                <ProductCard product={product} />
                <div className="flex gap-2">
                  <Button type="button" size="sm" className="flex-1 rounded-full" disabled={product.stock < 1} onClick={() => moveWishlistToCart(product.id)}>Move to Bag</Button>
                  <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => toggleWishlist(product.id)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card py-16 text-center">
            <Heart size={30} className="mx-auto text-primary" />
            <h2 className="mt-4 font-display text-3xl">Nothing saved just yet.</h2>
            <p className="mt-2 text-sm text-muted-foreground">Tap the heart on anything you love and we’ll keep it here.</p>
            <Button asChild className="mt-6 rounded-full px-7"><Link to="/products" search={{}}>Browse Products</Link></Button>
          </div>
        )}
      </section>
    </StorefrontLayout>
  );
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

  if (order) {
    return (
      <StorefrontLayout>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-secondary text-success"><CheckCircle2 size={30} /></span>
          <p className="mt-5 text-[10px] font-semibold tracking-[0.22em] text-primary">ORDER RECEIVED</p>
          <h1 className="mt-2 text-5xl">Thank you, {order.customer.split(" ")[0]}.</h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">Your demo order <strong className="text-foreground">{order.id}</strong> has been placed. No payment was collected.</p>
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-left">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Order total</span><span className="font-semibold">{formatINR(order.total)}</span></div>
            <p className="mt-2 text-xs text-muted-foreground">{order.payment} · {order.date}</p>
          </div>
          <Button asChild className="mt-7 rounded-full px-7"><Link to="/products" search={{}}>Continue Shopping</Link></Button>
        </div>
      </StorefrontLayout>
    );
  }

  const checkoutItems = cart.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.productId);
    return product ? [{ product, quantity: item.quantity }] : [];
  });

  if (checkoutItems.length === 0) {
    return (
      <StorefrontLayout>
        <div className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="text-4xl">Your bag is empty.</h1>
          <Button asChild className="mt-6 rounded-full px-7"><Link to="/products" search={{}}>Find Something Lovely</Link></Button>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <PageIntro eyebrow="ALMOST YOURS" title="Checkout" description="Enter your delivery details and choose a mock payment option." />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <form onSubmit={submit} className="space-y-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <section>
            <h2 className="font-display text-2xl">Contact &amp; Delivery</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-medium sm:col-span-2">Full name<Input required autoComplete="name" className="mt-2 rounded-xl" value={form.customer} onChange={(event) => updateField("customer", event.target.value)} /></label>
              <label className="text-xs font-medium">Mobile number<Input required type="tel" autoComplete="tel" pattern="[0-9+() -]{8,18}" className="mt-2 rounded-xl" value={form.mobile} onChange={(event) => updateField("mobile", event.target.value)} /></label>
              <label className="text-xs font-medium">Email address<Input required type="email" autoComplete="email" className="mt-2 rounded-xl" value={form.email} onChange={(event) => updateField("email", event.target.value)} /></label>
              <label className="text-xs font-medium sm:col-span-2">Street address<Textarea required autoComplete="street-address" className="mt-2 rounded-xl" rows={3} value={form.address} onChange={(event) => updateField("address", event.target.value)} /></label>
              <label className="text-xs font-medium">City<Input required autoComplete="address-level2" className="mt-2 rounded-xl" value={form.city} onChange={(event) => updateField("city", event.target.value)} /></label>
              <label className="text-xs font-medium">State<Input required autoComplete="address-level1" className="mt-2 rounded-xl" value={form.state} onChange={(event) => updateField("state", event.target.value)} /></label>
              <label className="text-xs font-medium">Pincode<Input required inputMode="numeric" autoComplete="postal-code" pattern="[0-9]{6}" className="mt-2 rounded-xl" value={form.pincode} onChange={(event) => updateField("pincode", event.target.value)} /></label>
            </div>
          </section>
          <fieldset>
            <legend className="font-display text-2xl">Payment Method</legend>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {["Cash on Delivery", "UPI", "Credit Card"].map((method) => (
                <label key={method} className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3.5 text-sm transition-colors ${form.payment === method ? "border-primary bg-secondary/50 font-medium" : "border-border"}`}>
                  <input type="radio" name="payment" value={method} checked={form.payment === method} onChange={(event) => updateField("payment", event.target.value)} className="accent-primary" />
                  {method}
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">No real payment gateway is connected.</p>
          </fieldset>
          {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}
          <Button type="submit" size="lg" className="w-full rounded-full sm:w-auto sm:px-8">Place Demo Order · {formatINR(grandTotal)}</Button>
        </form>
        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-xs">
          <h2 className="font-display text-2xl">Your Order</h2>
          <div className="mt-5 divide-y divide-border">
            {checkoutItems.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between gap-3 py-3 text-sm">
                <span className="min-w-0"><span className="block truncate font-medium">{product.name}</span><span className="text-xs text-muted-foreground">Qty {quantity}</span></span>
                <span>{formatINR(product.price * quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-3 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal ({itemCount} items)</span><span>{formatINR(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{deliveryFee ? formatINR(deliveryFee) : "—"}</span></div>
            {appliedCoupon && <div className="flex justify-between text-success"><span>Offer · {appliedCoupon.code}</span><span>-{formatINR(couponDiscount)}</span></div>}
            <div className="flex justify-between border-t border-border pt-3 text-base font-semibold"><span>Grand Total</span><span>{formatINR(grandTotal)}</span></div>
          </div>
        </aside>
      </div>
    </StorefrontLayout>
  );
}

export type CatalogSort = "" | "new" | "best";
