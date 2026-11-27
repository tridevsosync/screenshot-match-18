import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, BadgeCheck, HeartHandshake, Instagram, Leaf, Sparkles, Star } from "lucide-react";

import { useStore } from "@/context/store-context";
import { storeImages } from "@/lib/media";
import { formatINR } from "@/lib/store-utils";
import { Button } from "@/components/ui/button";
import { NewsletterSignup, SectionHeading, StorefrontLayout } from "@/components/storefront/layout";
import { ProductGrid } from "@/components/storefront/product-card";

const categoryCards = [
  { name: "Makeup", image: storeImages.makeup, label: "Colour & Finish" },
  { name: "Skincare", image: storeImages.skincare, label: "Daily Radiance" },
  { name: "Haircare", image: storeImages.haircare, label: "Salon Rituals" },
  { name: "Beauty Accessories", image: storeImages.accessories, label: "Pro Brushes & Tools" },
  { name: "Salon Equipment", image: storeImages.salon, label: "Studio Furniture" },
  { name: "Parlour Material", image: storeImages.salon, label: "Parlour Staples" },
  { name: "Wax Products", image: storeImages.skincare, label: "Smooth Care" },
  { name: "Makeup Kits", image: storeImages.nailsKits, label: "Curated Palettes" },
  { name: "Perfumes", image: storeImages.perfume, label: "Signature Scents" },
  { name: "Nail Care", image: storeImages.nailsKits, label: "Gel & Gloss" },
];

const heroHighlights = ["Lipsticks", "Foundation", "Makeup Kits", "Skincare", "Haircare", "Salon Products"];

const instagramTiles = [
  { src: storeImages.makeup, alt: "Velvet matte lipsticks and foundation", tag: "Velvet Lip Edit" },
  { src: storeImages.skincare, alt: "Vitamin C serum and daily moisturiser", tag: "Morning Glow" },
  { src: storeImages.perfume, alt: "Golden Hour Eau de Parfum", tag: "Signature Scent" },
  { src: storeImages.haircare, alt: "Salon repair haircare collection", tag: "Salon Care" },
  { src: storeImages.accessories, alt: "Rose-gold makeup brush set", tag: "Pro Tools" },
  { src: storeImages.nailsKits, alt: "Eyeshadow palette and nail lacquers", tag: "Color Theory" },
];

export function HomePage() {
  const { products, banners, testimonials, brands } = useStore();
  const banner = banners.find((item) => item.active) ?? banners[0];
  const featured = products.filter((product) => product.isFeatured).slice(0, 4);
  const bestSellers = products.filter((product) => product.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((product) => product.isNew).slice(0, 4);
  const offers = products.filter((product) => product.originalPrice > product.price).slice(0, 3);

  return (
    <StorefrontLayout>
      <section className="relative isolate min-h-[560px] overflow-hidden bg-secondary sm:min-h-[640px] lg:min-h-[680px]" aria-label="Featured beauty collection">
        <img
          src={banner?.image ?? storeImages.hero}
          alt="Sana Cosmetics luxury lipsticks, foundation, skincare, and salon beauty collection"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="hero-scrim absolute inset-0" />
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-5 py-14 sm:min-h-[640px] sm:px-8 lg:min-h-[680px] lg:px-12">
          <div className="max-w-[570px]">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-white/90 px-4 py-1.5 text-[10px] font-semibold tracking-[0.26em] text-primary shadow-xs backdrop-blur-xs">
              <Sparkles size={12} className="text-[#FFD700]" /> THE SANA LUXE EDIT
            </p>
            <h1 className="text-5xl font-medium leading-[1.01] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              {banner?.title ?? "Enhance Your Natural Beauty"}
            </h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-foreground/80 sm:text-base">
              {banner?.subtitle ?? "Premium Cosmetics & Beauty Products for Every Occasion."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-8 shadow-md">
                <Link to="/products" search={{}}>Shop Now <ArrowRight size={16} /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-white/85 px-8 backdrop-blur-xs hover:bg-white">
                <Link to="/products" search={{ sort: "new" }}>Explore Collection</Link>
              </Button>
            </div>
            <div className="mt-9 flex flex-wrap gap-2">
              {heroHighlights.map((item) => (
                <span key={item} className="rounded-full border border-border/90 bg-white/80 px-3.5 py-1 text-[11px] font-medium text-foreground/85 shadow-2xs backdrop-blur-xs">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="absolute bottom-7 right-8 hidden max-w-xs rounded-2xl border border-white/60 bg-white/85 p-4 shadow-lg backdrop-blur-md lg:block">
            <p className="text-[10px] font-semibold tracking-[0.22em] text-primary">KOLHAPUR SHOWROOM</p>
            <p className="mt-1 font-display text-xl text-foreground">Retail Luxury &amp; Salon Wholesale</p>
            <p className="mt-1 text-xs text-muted-foreground">Curated cosmetics, skincare &amp; studio essentials.</p>
          </div>
        </div>
      </section>

      <section className="luxe-section-glow mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <SectionHeading
            eyebrow="SHOP BY CATEGORY"
            title="Beauty in every form"
            description="From everyday colour and luminous skincare to professional salon & parlour essentials."
          />
          <Link to="/products" search={{}} className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-primary shadow-2xs transition-colors hover:border-primary sm:flex">
            All Categories <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categoryCards.map((category) => (
            <Link
              key={category.name}
              to="/products"
              search={{ category: category.name, sort: "" }}
              className="group relative min-h-[225px] overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg"
            >
              <img src={category.image} alt={`${category.name} collection`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-108" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/20 to-transparent" />
              <span className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur-xs transition-all duration-300 group-hover:opacity-100">
                <ArrowUpRight size={15} />
              </span>
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#FFD700]">{category.label}</span>
                <h3 className="mt-1 text-xl leading-tight">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <SectionHeading eyebrow="FEATURED EDIT" title="Curated luxury favourites" description="Rich pigments, nourishing formulas, and icons worth keeping close." />
            <Button asChild variant="outline" className="hidden rounded-full px-6 sm:inline-flex">
              <Link to="/products" search={{}}>Shop All</Link>
            </Button>
          </div>
          <ProductGrid products={featured} />
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
        <div className="relative min-h-[380px] overflow-hidden rounded-3xl border border-border bg-secondary shadow-md sm:min-h-[460px]">
          <img src={storeImages.skincare} alt="Skincare essentials selected by Sana Cosmetics" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute left-5 top-5 rounded-full bg-white/92 px-4 py-2 text-[10px] font-semibold tracking-[0.2em] text-primary shadow-xs backdrop-blur-xs">
            THE DAILY RITUAL
          </div>
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/50 bg-white/88 p-4 backdrop-blur-md sm:right-auto sm:max-w-xs">
            <p className="text-[10px] font-semibold tracking-[0.2em] text-primary">RADIANCE SCIENCE</p>
            <p className="mt-1 text-xs leading-5 text-foreground/85">Vitamin C, hyaluronic acid &amp; ceramide barrier care.</p>
          </div>
        </div>
        <div className="lg:pl-10">
          <p className="mb-3 text-[10px] font-semibold tracking-[0.26em] text-primary">RADIANT SKIN FIRST</p>
          <h2 className="max-w-lg text-4xl leading-tight sm:text-5xl">A routine that feels effortlessly yours.</h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
            Lightweight Vitamin C serums, barrier-loving cloud creams, and gentle formulas chosen for real Indian skin and everyday glow.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-foreground/80">
            <span className="rounded-full border border-border bg-card px-4 py-1.5">✦ Dermatologist-Loved Actives</span>
            <span className="rounded-full border border-border bg-card px-4 py-1.5">✦ Lightweight &amp; Non-Sticky</span>
          </div>
          <Button asChild size="lg" className="mt-7 rounded-full px-8">
            <Link to="/products" search={{ category: "Skincare", sort: "" }}>Explore Skincare <ArrowRight size={16} /></Link>
          </Button>
        </div>
      </section>

      <section className="bg-gradient-to-r from-[#AD1457] via-[#C2185B] to-[#E91E63] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[10px] font-semibold tracking-[0.24em] text-[#FFD700]">TODAY’S OFFERS</p>
              <span className="rounded-full border border-[#FFD700]/50 bg-[#FFD700]/15 px-3 py-0.5 text-[10px] font-semibold tracking-wider text-[#FFD700]">
                CODE: GLOW10
              </span>
            </div>
            <h2 className="mt-2 text-3xl sm:text-4xl">Luxury beauty, even sweeter on offer.</h2>
          </div>
          <Button asChild variant="outline" className="w-fit rounded-full border-white/40 bg-white/10 px-6 text-white hover:bg-white hover:text-[#C2185B]">
            <Link to="/products" search={{}}>View All Offers <ArrowRight size={16} /></Link>
          </Button>
        </div>
        <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {offers.map((product) => (
              <Link key={product.id} to="/products/$slug" params={{ slug: product.id }} className="flex items-center gap-4 rounded-2xl border border-white/25 bg-white/12 p-4 backdrop-blur-xs transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20">
                <img src={product.image} alt={product.name} className="size-18 shrink-0 rounded-xl object-cover shadow-xs" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{product.name}</p>
                  <p className="mt-1 text-xs text-white/85">
                    Now {formatINR(product.price)} <span className="ml-1 line-through opacity-70">{formatINR(product.originalPrice)}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <SectionHeading eyebrow="NEW ARRIVALS" title="Fresh on the beauty bar" description="Latest shades, serums, and signature scents just added to Sana." />
          <Link to="/products" search={{ category: "", sort: "new" }} className="hidden items-center gap-2 text-sm font-medium text-primary hover:underline sm:flex">
            See everything <ArrowRight size={16} />
          </Link>
        </div>
        <ProductGrid products={newArrivals} />
      </section>

      <section className="border-y border-border bg-secondary/45 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between gap-4">
            <SectionHeading eyebrow="BEST SELLERS" title="Sana community icons" description="Most-loved beauty staples and salon-grade favourites." />
            <Link to="/products" search={{ category: "", sort: "best" }} className="hidden items-center gap-2 text-sm font-medium text-primary hover:underline sm:flex">
              Shop best sellers <ArrowRight size={16} />
            </Link>
          </div>
          <ProductGrid products={bestSellers} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading eyebrow="WHY CHOOSE SANA COSMETICS" title="A thoughtful way to shop beauty" description="Retail luxury and wholesale salon reliability—under one roof in Kolhapur." align="center" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { num: "01", icon: <Leaf size={20} />, title: "Curated Authenticity", copy: "Handpicked cosmetics, skincare, haircare, and salon supplies from trusted brands." },
            { num: "02", icon: <BadgeCheck size={20} />, title: "Retail & Wholesale", copy: "Serving everyday beauty lovers as well as salons and parlours across Kolhapur." },
            { num: "03", icon: <HeartHandshake size={20} />, title: "Personal Guidance", copy: "Friendly, knowledgeable advice to help you match every shade and formula." },
          ].map((item) => (
            <div key={item.title} className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <span className="absolute right-5 top-4 font-display text-4xl font-semibold text-secondary">{item.num}</span>
              <span className="grid size-12 place-items-center rounded-full bg-secondary text-primary">{item.icon}</span>
              <h3 className="mt-4 text-2xl">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="TESTIMONIALS" title="Loved by our community" description="Real notes from customers and salon partners." align="center" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((review) => (
              <blockquote key={review.id} className="flex flex-col justify-between rounded-2xl border border-border bg-background p-6 shadow-xs">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5 text-[#FFD700]">
                      {Array.from({ length: review.rating }).map((_, idx) => <Star key={idx} size={14} className="fill-[#FFD700]" />)}
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/75">Verified</span>
                  </div>
                  <p className="mt-4 font-display text-2xl leading-snug text-foreground">“{review.quote}”</p>
                </div>
                <footer className="mt-5 border-t border-border/60 pt-3 text-xs font-medium text-muted-foreground">{review.name} · {review.city}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-5 rounded-2xl border border-border bg-card px-8 py-8 text-center shadow-2xs sm:flex-row sm:text-left">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.24em] text-primary">BRAND PARTNERS</p>
            <h2 className="mt-1 font-display text-3xl">Names behind the edit</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-muted-foreground sm:justify-end">
            {brands.map((brand) => <span key={brand} className="transition-colors hover:text-primary">{brand}</span>)}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.24em] text-primary">INSTAGRAM GALLERY</p>
              <h2 className="mt-2 text-4xl">Beauty, between moments.</h2>
            </div>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-semibold shadow-2xs transition-colors hover:border-primary hover:text-primary">
              <Instagram size={14} /> Follow @sanacosmetics <ArrowRight size={14} />
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {instagramTiles.map((tile, idx) => (
              <a key={idx} href="https://instagram.com" target="_blank" rel="noreferrer" className="group relative aspect-square overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xs">
                <img src={tile.src} alt={tile.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/45 p-2 text-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Instagram size={18} className="mb-1" />
                  <span className="text-[10px] font-medium tracking-wider">{tile.tag}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <p className="text-[10px] font-semibold tracking-[0.24em] text-primary">LETTERS FROM SANA</p>
        <h2 className="mt-2 text-4xl">A little luxury in your inbox.</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Get early access to new launches, festive offers, and beauty tips.</p>
        <NewsletterSignup />
      </section>
    </StorefrontLayout>
  );
}
