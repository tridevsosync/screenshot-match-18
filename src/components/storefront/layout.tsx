import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Facebook, Heart, Instagram, MapPin, Search, ShoppingBag, Sparkles } from "lucide-react";

import { useStore } from "@/context/store-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const primaryLinks = [
  ["New & noteworthy", "/products?sort=new"],
  ["Makeup", "/products?category=Makeup"],
  ["Skincare", "/products?category=Skincare"],
  ["Hair & salon", "/products?category=Haircare"],
  ["Professional", "/products?category=Salon%20Equipment"],
] as const;

export function StorefrontLayout({ children }: { children: ReactNode }) {
  const { cart, wishlist, searchTerm, setSearchTerm, settings } = useStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void navigate({ to: "/products" });
    setMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="bg-berry px-4 py-2 text-center text-xs tracking-[0.12em] text-primary-foreground sm:text-sm">
        BEAUTY, WELL CHOSEN <span className="mx-2 text-gold">✦</span> Professional & everyday essentials from Kolhapur
      </div>
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Button className="lg:hidden" variant="ghost" size="icon" aria-label="Open menu" onClick={() => setMobileMenuOpen((open) => !open)}>
            <span className="text-lg leading-none">☰</span>
          </Button>
          <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Sana Cosmetics home">
            <span className="grid size-10 place-items-center rounded-full border border-primary/30 bg-secondary text-primary"><Sparkles size={18} /></span>
            <span className="leading-none">
              <span className="block font-display text-2xl font-semibold">Sana</span>
              <span className="mt-1 block text-[9px] font-semibold tracking-[0.28em] text-muted-foreground">COSMETICS</span>
            </span>
          </Link>
          <form onSubmit={submitSearch} className="mx-auto hidden w-full max-w-xl items-center gap-2 border-b border-border px-2 py-1 focus-within:border-primary md:flex">
            <Search size={17} className="shrink-0 text-muted-foreground" />
            <Input aria-label="Search beauty products" placeholder="Search products, brands, or categories" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0" />
            <Button type="submit" variant="ghost" size="sm">Search</Button>
          </form>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <Button asChild variant="ghost" size="icon" aria-label={`Wishlist, ${wishlist.length} items`} className="relative">
              <Link to="/wishlist"><Heart /><span className="sr-only">Wishlist</span>{wishlist.length > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-primary text-[9px] text-primary-foreground">{wishlist.length}</span>}</Link>
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label={`Shopping bag, ${cart.length} items`} className="relative">
              <Link to="/cart"><ShoppingBag /><span className="sr-only">Shopping bag</span>{cart.length > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-primary text-[9px] text-primary-foreground">{cart.length}</span>}</Link>
            </Button>
          </div>
        </div>
        <form onSubmit={submitSearch} className="mx-4 mb-3 flex items-center gap-2 border-b border-border px-2 py-1 md:hidden">
          <Search size={16} className="text-muted-foreground" />
          <Input aria-label="Search beauty products" placeholder="Search products or brands" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="h-9 border-0 bg-transparent shadow-none focus-visible:ring-0" />
          <Button type="submit" size="icon" variant="ghost" aria-label="Search"><ArrowRight /></Button>
        </form>
        <nav className="hidden items-center justify-center gap-8 border-t border-border/70 px-4 py-3 lg:flex" aria-label="Main navigation">
          {primaryLinks.map(([label, to]) => <Link key={label} to={to} className="text-xs font-medium tracking-wide text-foreground/80 transition-colors hover:text-primary">{label}</Link>)}
          <Link to="/about" className="text-xs font-medium tracking-wide text-foreground/80 transition-colors hover:text-primary">Our story</Link>
          <Link to="/contact" className="text-xs font-medium tracking-wide text-foreground/80 transition-colors hover:text-primary">Visit us</Link>
        </nav>
        {mobileMenuOpen && <nav className="grid gap-1 border-t border-border px-4 py-3 lg:hidden" aria-label="Mobile navigation">
          {primaryLinks.map(([label, to]) => <Link key={label} to={to} onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm text-foreground/80">{label}</Link>)}
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm text-foreground/80">Our story</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="py-2 text-sm text-foreground/80">Visit us</Link>
        </nav>}
      </header>
      <main>{children}</main>
      <StoreFooter businessName={settings.businessName} />
    </div>
  );
}

function StoreFooter({ businessName }: { businessName: string }) {
  const { settings } = useStore();
  return (
    <footer className="mt-20 border-t border-border bg-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="font-display text-3xl font-semibold">{businessName}</Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">A considered edit of beauty, care, and professional essentials—chosen with you in mind.</p>
          <div className="mt-5 flex gap-2">
            <Button asChild variant="outline" size="icon" aria-label="Instagram"><a href="https://instagram.com" target="_blank" rel="noreferrer"><Instagram /></a></Button>
            <Button asChild variant="outline" size="icon" aria-label="Facebook"><a href="https://facebook.com" target="_blank" rel="noreferrer"><Facebook /></a></Button>
          </div>
        </div>
        <div>
          <h2 className="text-xs font-semibold tracking-[0.18em]">EXPLORE</h2>
          <div className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
            <Link to="/products" className="hover:text-primary">Shop all</Link><Link to="/about" className="hover:text-primary">About Sana</Link>
            <Link to="/contact" className="hover:text-primary">Contact</Link><Link to="/faqs" className="hover:text-primary">FAQs</Link>
            <Link to="/admin/login" className="hover:text-primary">Admin Login</Link>
          </div>
        </div>
        <div>
          <h2 className="text-xs font-semibold tracking-[0.18em]">CUSTOMER CARE</h2>
          <div className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
            <Link to="/shipping" className="hover:text-primary">Shipping policy</Link><Link to="/returns" className="hover:text-primary">Returns</Link>
            <Link to="/privacy" className="hover:text-primary">Privacy</Link><Link to="/terms" className="hover:text-primary">Terms</Link>
            <a href={`tel:${settings.phone}`} className="hover:text-primary">{settings.phone}</a><a href={`mailto:${settings.email}`} className="hover:text-primary">{settings.email}</a>
          </div>
        </div>
        <div>
          <h2 className="text-xs font-semibold tracking-[0.18em]">A NOTE FROM SANA</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">Fresh finds, pro favourites, and a little inspiration—straight to your inbox.</p>
          <NewsletterSignup compact />
        </div>
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <span>© {new Date().getFullYear()} {businessName}. All rights reserved.</span>
          <span className="flex items-center gap-1"><MapPin size={13} /> Kolhapur, Maharashtra</span>
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
    setMessage("You’re on the list—thank you.");
  }

  return <form onSubmit={submit} className={`mt-4 ${compact ? "" : "mx-auto max-w-lg"}`}>
    <div className="flex gap-2"><Input type="email" required aria-label="Email for newsletter" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} />
      <Button type="submit" size={compact ? "icon" : "default"} aria-label="Subscribe to newsletter">{compact ? <ArrowRight /> : "Subscribe"}</Button>
    </div>
    {message && <p role="status" className="mt-2 text-xs text-muted-foreground">{message}</p>}
  </form>;
}

export function SectionHeading({ eyebrow, title, description, align = "left" }: { eyebrow?: string; title: string; description?: string; align?: "left" | "center" }) {
  return <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-2xl`}>
    {eyebrow && <p className="mb-2 text-[10px] font-semibold tracking-[0.24em] text-primary">{eyebrow}</p>}
    <h2 className="text-3xl font-medium sm:text-4xl">{title}</h2>
    {description && <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>}
  </div>;
}

export function PageIntro({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return <div className="border-b border-border bg-secondary/45">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {eyebrow && <p className="mb-2 text-[10px] font-semibold tracking-[0.24em] text-primary">{eyebrow}</p>}
      <h1 className="max-w-3xl text-4xl font-medium leading-tight sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  </div>;
}