import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  Clock3,
  Facebook,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

import { useStore } from "@/context/store-context";
import { formatINR } from "@/lib/store-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StorefrontLayout({ children }: { children: ReactNode }) {
  const { settings } = useStore();

  return (
    <div className="min-h-screen bg-background text-foreground" data-theme={settings.themeColor} data-store-theme={settings.themeColor}>
      <Navbar />
      <main>{children}</main>
      <StoreFooter businessName={settings.businessName} />
      <FloatingSocialButtons phone={settings.phone} />
    </div>
  );
}

function FloatingSocialButtons({ phone }: { phone: string }) {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const whatsappNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  return (
    <aside aria-label="Social media quick links" className="fixed bottom-6 right-4 z-40 flex flex-col gap-2.5 sm:right-6">
      <a
        href="https://instagram.com"
        target="_blank"
        rel="noreferrer"
        aria-label="Follow Sana Cosmetics on Instagram"
        title="Instagram"
        className="grid size-11 place-items-center rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:scale-110"
      >
        <Instagram size={19} />
      </a>
      <a
        href={`https://wa.me/${whatsappNumber}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Sana Cosmetics on WhatsApp"
        title="WhatsApp"
        className="grid size-11 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:scale-110"
      >
        <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.78 14.12c-.24.68-1.4 1.3-1.94 1.38-.49.07-1.12.1-1.8-.11-.42-.13-.95-.31-1.63-.61-2.87-1.24-4.74-4.14-4.88-4.33-.14-.19-1.17-1.56-1.17-2.97s.74-2.1 1-2.39c.26-.29.57-.36.76-.36h.55c.18 0 .41-.07.64.49.24.58.81 1.98.88 2.12.07.14.12.31.02.5-.1.19-.14.31-.29.48-.14.17-.3.38-.43.51-.14.14-.29.3-.12.59.17.29.74 1.22 1.59 1.98 1.09.97 2.01 1.27 2.3 1.41.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.64-.14.26.1 1.66.78 1.94.92.29.14.48.22.55.34.07.12.07.69-.17 1.37z" />
        </svg>
      </a>
      <a
        href="https://youtube.com"
        target="_blank"
        rel="noreferrer"
        aria-label="Subscribe to Sana Cosmetics on YouTube"
        title="YouTube"
        className="grid size-11 place-items-center rounded-full bg-[#FF0000] text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:scale-110"
      >
        <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden="true">
          <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" />
        </svg>
      </a>
    </aside>
  );
}

export function Navbar() {
  const { products, categories, cart, wishlist, subtotal, searchTerm, setSearchTerm, settings } = useStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const bagCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const query = searchTerm.trim().toLowerCase();
  const searchMatches = query
    ? products.filter((p) => `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query)).slice(0, 4)
    : [];

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchFocused(false);
    setMobileMenuOpen(false);
    void navigate({ to: "/products", search: {} });
  }

  return (
    <>
      <div className="bg-gradient-to-r from-[#AD1457] via-[#E91E63] to-[#C2185B] px-4 py-2 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-[11px] font-medium tracking-[0.14em] sm:text-xs">
          <span className="hidden lg:inline text-white/85">{settings.phone}</span>
          <p className="mx-auto text-center">
            LUXURY BEAUTY &amp; SALON ESSENTIALS <span className="mx-2 text-[#FFD700]">✦</span> USE CODE{" "}
            <span className="font-semibold text-[#FFD700]">GLOW10</span> FOR 10% OFF
          </p>
          <div className="hidden items-center gap-4 text-[11px] text-white/85 lg:flex">
            <Link to="/contact" className="hover:text-white">Visit Store</Link>
            <Link to="/admin/login" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 shadow-2xs backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <Button
            className="rounded-full lg:hidden"
            variant="ghost"
            size="icon"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>

          <Link to="/" className="group flex shrink-0 items-center gap-3" aria-label="Sana Cosmetics home">
            <span className="grid size-10 place-items-center rounded-full border border-primary/30 bg-gradient-to-br from-secondary via-background to-secondary text-primary shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Sparkles size={18} />
            </span>
            <span className="leading-none">
              <span className="block font-display text-2xl font-semibold tracking-tight sm:text-3xl">Sana</span>
              <span className="mt-0.5 block text-[9px] font-semibold tracking-[0.3em] text-primary">COSMETICS</span>
            </span>
          </Link>

          <div className="relative mx-auto hidden w-full max-w-xl md:block">
            <form
              onSubmit={submitSearch}
              className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1 shadow-xs transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15"
            >
              <Search size={16} className="shrink-0 text-muted-foreground" />
              <Input
                aria-label="Search beauty products"
                placeholder="Search lipsticks, serums, salon kits, brands..."
                value={searchTerm}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => window.setTimeout(() => setSearchFocused(false), 160)}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-8 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
              />
              {searchTerm && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchTerm("")}
                  className="rounded-full p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <X size={14} />
                </button>
              )}
              <Button type="submit" size="sm" className="rounded-full px-4 text-xs">Search</Button>
            </form>

            {searchFocused && query.length > 0 && (
              <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-lg">
                {searchMatches.length > 0 ? (
                  <>
                    {searchMatches.map((item) => (
                      <Link
                        key={item.id}
                        to="/products/$slug"
                        params={{ slug: item.id }}
                        onClick={() => setSearchFocused(false)}
                        className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary/60"
                      >
                        <img src={item.image} alt={item.name} className="size-11 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{item.name}</p>
                          <p className="text-[11px] text-muted-foreground">{item.brand} · {item.category}</p>
                        </div>
                        <span className="text-xs font-semibold text-primary">{formatINR(item.price)}</span>
                      </Link>
                    ))}
                    <Link
                      to="/products"
                      search={{}}
                      onClick={() => setSearchFocused(false)}
                      className="mt-1 flex items-center justify-center gap-1 rounded-xl border-t border-border py-2 text-xs font-medium text-primary hover:bg-secondary/40"
                    >
                      View all results for “{searchTerm}” <ArrowRight size={13} />
                    </Link>
                  </>
                ) : (
                  <p className="px-3 py-4 text-center text-xs text-muted-foreground">No matching products found.</p>
                )}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
            <Button asChild variant="ghost" size="sm" aria-label={`Wishlist, ${wishlist.length} items`} className="relative rounded-full px-2.5 hover:bg-secondary">
              <Link to="/wishlist" className="flex items-center gap-1.5">
                <span className="relative">
                  <Heart size={19} />
                  {wishlist.length > 0 && (
                    <span className="absolute -right-2 -top-1.5 grid size-4 place-items-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
                      {wishlist.length}
                    </span>
                  )}
                </span>
                <span className="hidden text-xs font-medium xl:inline">Wishlist</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" aria-label={`Shopping bag, ${bagCount} items`} className="relative rounded-full border-border/90 bg-card px-3 hover:border-primary hover:bg-secondary/60">
              <Link to="/cart" className="flex items-center gap-2">
                <span className="relative">
                  <ShoppingBag size={18} className="text-primary" />
                  {bagCount > 0 && (
                    <span className="absolute -right-2 -top-1.5 grid size-4 place-items-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
                      {bagCount}
                    </span>
                  )}
                </span>
                <span className="hidden text-xs font-semibold sm:inline">
                  {subtotal > 0 ? formatINR(subtotal) : "Bag"}
                </span>
              </Link>
            </Button>
          </div>
        </div>

        <form onSubmit={submitSearch} className="mx-4 mb-3 flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 md:hidden">
          <Search size={15} className="text-muted-foreground" />
          <Input
            aria-label="Search beauty products"
            placeholder="Search products or brands"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-8 border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
          <Button type="submit" size="icon" variant="ghost" aria-label="Search" className="rounded-full"><ArrowRight size={15} /></Button>
        </form>

        <nav className="hidden items-center justify-center gap-8 border-t border-border/60 bg-background/70 px-4 py-2.5 lg:flex" aria-label="Main navigation">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-primary font-semibold" }}
            className="group relative py-0.5 text-xs font-medium tracking-wide text-foreground/85 transition-colors hover:text-primary"
          >
            Home
            <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
          </Link>

          <Link
            to="/products"
            search={{}}
            activeProps={{ className: "text-primary font-semibold" }}
            className="group relative py-0.5 text-xs font-medium tracking-wide text-foreground/85 transition-colors hover:text-primary"
          >
            Shop
            <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button
              type="button"
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((open) => !open)}
              className="group flex items-center gap-1 py-0.5 text-xs font-medium tracking-wide text-foreground/85 transition-colors hover:text-primary"
            >
              Categories <ChevronDown size={13} className={`transition-transform duration-200 ${moreOpen ? "rotate-180" : ""}`} />
            </button>
            {moreOpen && (
              <div className="absolute left-1/2 top-full z-50 w-80 -translate-x-1/2 pt-2">
                <div className="grid grid-cols-2 gap-1 rounded-2xl border border-border bg-card p-3 shadow-lg">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      to="/products"
                      search={{ category: cat, sort: "" }}
                      onClick={() => setMoreOpen(false)}
                      className="rounded-xl px-3 py-2 text-xs font-medium text-foreground/85 transition-colors hover:bg-secondary hover:text-primary"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/about"
            activeProps={{ className: "text-primary font-semibold" }}
            className="group relative py-0.5 text-xs font-medium tracking-wide text-foreground/85 transition-colors hover:text-primary"
          >
            Our Story
            <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
          </Link>

          <Link
            to="/contact"
            activeProps={{ className: "text-primary font-semibold" }}
            className="group relative py-0.5 text-xs font-medium tracking-wide text-foreground/85 transition-colors hover:text-primary"
          >
            Visit Us
            <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
          </Link>
        </nav>

        {mobileMenuOpen && (
          <nav className="space-y-4 border-t border-border bg-card px-4 py-5 lg:hidden" aria-label="Mobile navigation">
            <div className="grid gap-1">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/90 hover:bg-secondary">Home</Link>
              <Link to="/products" search={{}} onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/90 hover:bg-secondary">Shop</Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/90 hover:bg-secondary">Our Story</Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/90 hover:bg-secondary">Visit Us</Link>
            </div>
            <div className="border-t border-border pt-3">
              <p className="px-3 text-[10px] font-semibold tracking-[0.2em] text-primary">CATEGORIES</p>
              <div className="mt-2 flex flex-wrap gap-2 px-2">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    to="/products"
                    search={{ category: cat, sort: "" }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
            <div className="grid gap-1 border-t border-border pt-3">
              <Link to="/faqs" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-2 text-sm text-foreground/85 hover:bg-secondary">FAQs</Link>
              <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-2 text-sm font-medium text-primary hover:bg-secondary">Admin Login</Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}

function StoreFooter({ businessName }: { businessName: string }) {
  const { settings } = useStore();
  return (
    <footer className="mt-20 border-t border-border bg-gradient-to-b from-secondary/50 to-secondary/85">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="font-display text-3xl font-semibold tracking-tight">{businessName}</Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">
            Kolhapur’s trusted cosmetics dealer &amp; wholesaler—curating luxury makeup, skincare, haircare, and salon essentials.
          </p>
          <div className="mt-4 space-y-2 text-xs text-muted-foreground">
            <p className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-primary" /><span>{settings.address}</span></p>
            <p className="flex items-center gap-2"><Clock3 size={14} className="shrink-0 text-primary" /><span>Mon–Sat: 10:00 AM – 8:30 PM</span></p>
          </div>
          <div className="mt-5 flex gap-2">
            <Button asChild variant="outline" size="icon" aria-label="Instagram" className="rounded-full bg-card">
              <a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram size={16} /></a>
            </Button>
            <Button asChild variant="outline" size="icon" aria-label="Facebook" className="rounded-full bg-card">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"><Facebook size={16} /></a>
            </Button>
          </div>
        </div>
        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-primary">QUICK LINKS</h2>
          <div className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
            <Link to="/products" search={{}} className="hover:text-primary">Shop All</Link>
            <Link to="/about" className="hover:text-primary">About Sana</Link>
            <Link to="/contact" className="hover:text-primary">Contact Us</Link>
            <Link to="/faqs" className="hover:text-primary">FAQs</Link>
            <Link to="/wishlist" className="hover:text-primary">Wishlist</Link>
            <Link to="/admin/login" className="font-medium text-foreground hover:text-primary">Admin Login</Link>
          </div>
        </div>
        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-primary">CUSTOMER SUPPORT</h2>
          <div className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
            <Link to="/shipping" className="hover:text-primary">Shipping Policy</Link>
            <Link to="/returns" className="hover:text-primary">Return Policy</Link>
            <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary">Terms &amp; Conditions</Link>
            <a href={`tel:${settings.phone}`} className="flex items-center gap-2 hover:text-primary"><Phone size={14} className="text-primary" />{settings.phone}</a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-primary"><Mail size={14} className="text-primary" />{settings.email}</a>
          </div>
        </div>
        <div>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-primary">NEWSLETTER</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">Subscribe for new arrivals, festive beauty offers, and salon-pro exclusives.</p>
          <NewsletterSignup compact />
        </div>
      </div>
      <div className="border-t border-border/70 bg-background/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <span>© {new Date().getFullYear()} {businessName}. All rights reserved.</span>
          <span className="flex items-center gap-1.5"><MapPin size={13} className="text-primary" /> Padmala, Kolhapur, Maharashtra 416007</span>
        </div>
      </div>
    </footer>
  );
}

export function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const { subscribers, setSubscribers } = useStore();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || subscribers.some((subscriber) => subscriber.email.toLowerCase() === cleanEmail)) {
      setMessage("You’re already on the list.");
      return;
    }
    setSubscribers((current) => [{ id: `NEWS-${Date.now()}`, email: cleanEmail, date: new Date().toLocaleDateString("en-IN") }, ...current]);
    setEmail("");
    setMessage("Welcome to Sana — you’re subscribed.");
  }

  return (
    <form onSubmit={submit} className={`mt-4 ${compact ? "" : "mx-auto max-w-lg"}`}>
      <div className="flex gap-2">
        <Input type="email" required aria-label="Email for newsletter" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} className="rounded-full bg-card px-4" />
        <Button type="submit" size={compact ? "icon" : "default"} aria-label="Subscribe to newsletter" className="rounded-full px-5">
          {compact ? <ArrowRight size={16} /> : "Subscribe"}
        </Button>
      </div>
      {message && <p role="status" className="mt-2 text-xs text-primary">{message}</p>}
    </form>
  );
}

export function SectionHeading({ eyebrow, title, description, align = "left" }: { eyebrow?: string; title: string; description?: string; align?: "left" | "center" }) {
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-2xl`}>
      {eyebrow && <p className="mb-2 text-[10px] font-semibold tracking-[0.26em] text-primary">{eyebrow}</p>}
      <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>}
    </div>
  );
}

export function PageIntro({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return (
    <div className="relative overflow-hidden border-b border-border bg-gradient-to-br from-secondary/80 via-background to-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {eyebrow && <p className="mb-2 text-[10px] font-semibold tracking-[0.26em] text-primary">{eyebrow}</p>}
        <h1 className="max-w-3xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
