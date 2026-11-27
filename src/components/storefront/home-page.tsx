import { Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, HeartHandshake, Leaf, Sparkles } from "lucide-react";

import { useStore } from "@/context/store-context";
import { storeImages } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { NewsletterSignup, SectionHeading, StorefrontLayout } from "@/components/storefront/layout";
import { ProductGrid } from "@/components/storefront/product-card";

const categoryCards = [
  { name: "Makeup", image: storeImages.makeup, label: "Colour, softly expressed" },
  { name: "Skincare", image: storeImages.skincare, label: "Care for your own rhythm" },
  { name: "Haircare", image: storeImages.salon, label: "Salon-loved essentials" },
  { name: "Beauty Accessories", image: storeImages.makeup, label: "The tools that make it yours" },
  { name: "Salon Equipment", image: storeImages.salon, label: "Made for the professionals" },
  { name: "Perfumes", image: storeImages.skincare, label: "A finishing touch" },
];

export function HomePage() {
  const { products, banners, testimonials } = useStore();
  const banner = banners.find((item) => item.active) ?? banners[0];
  const featured = products.filter((product) => product.isFeatured).slice(0, 4);
  const bestSellers = products.filter((product) => product.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((product) => product.isNew).slice(0, 4);
  const offers = products.filter((product) => product.originalPrice > product.price).slice(0, 3);

  return <StorefrontLayout>
    <section className="relative isolate min-h-[510px] overflow-hidden bg-secondary sm:min-h-[590px] lg:min-h-[620px]" aria-label="Featured beauty collection">
      <img src={banner?.image ?? storeImages.hero} alt="Sana Cosmetics beauty and skincare collection" className="absolute inset-0 h-full w-full object-cover object-[62%_center]" />
      <div className="hero-scrim absolute inset-0" />
      <div className="relative mx-auto flex min-h-[510px] max-w-7xl items-center px-5 py-14 sm:min-h-[590px] sm:px-8 lg:min-h-[620px] lg:px-12">
        <div className="max-w-[510px]">
          <p className="mb-4 flex items-center gap-2 text-[10px] font-semibold tracking-[0.24em] text-primary"><span className="h-px w-8 bg-primary" /> THE SANA EDIT</p>
          <h1 className="text-5xl font-medium leading-[0.98] sm:text-6xl lg:text-7xl">{banner?.title ?? "Enhance Your Natural Beauty"}</h1>
          <p className="mt-5 max-w-md text-sm leading-7 text-foreground/75 sm:text-base">{banner?.subtitle ?? "Premium Cosmetics & Beauty Products for Every Occasion."}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg"><Link to="/products">Shop now <ArrowRight /></Link></Button>
            <Button asChild size="lg" variant="outline" className="bg-background/65"><Link to="/products">Explore collection</Link></Button>
          </div>
          <div className="mt-9 flex items-center gap-3 text-xs text-foreground/70"><span className="grid size-8 place-items-center rounded-full border border-foreground/15"><Sparkles size={15} /></span> Thoughtfully selected in Kolhapur</div>
        </div>
      </div>
      <div className="absolute bottom-5 right-5 hidden items-center gap-2 text-[10px] tracking-[0.18em] text-foreground/60 sm:flex"><span className="h-px w-10 bg-foreground/40" /> BEAUTY, WELL CHOSEN</div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4"><SectionHeading eyebrow="FIND YOUR FEEL" title="A little beauty, in every form" description="From your everyday ritual to the tools behind a beautiful service." /><Link to="/products" className="hidden items-center gap-2 pb-1 text-sm font-medium hover:text-primary sm:flex">All categories <ArrowRight size={16} /></Link></div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {categoryCards.map((category, index) => <Link key={category.name} to="/products" search={{ category: category.name, sort: "" }} className={`group relative min-h-[230px] overflow-hidden bg-secondary ${index === 0 || index === 3 ? "sm:col-span-1" : ""}`}>
          <img src={category.image} alt={`${category.name} collection`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-primary-foreground"><span className="text-[9px] uppercase tracking-[0.18em] opacity-80">{category.label}</span><h3 className="mt-1 text-xl leading-tight">{category.name}</h3></div>
        </Link>)}
      </div>
    </section>

    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4"><SectionHeading eyebrow="THE SANA EDIT" title="The pieces we love" description="Good formulas, thoughtful details, and favourites worth coming back to." /><Button asChild variant="outline" className="hidden sm:inline-flex"><Link to="/products">Shop all</Link></Button></div>
        <ProductGrid products={featured} />
      </div>
    </section>

    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
      <div className="relative min-h-[370px] overflow-hidden bg-secondary sm:min-h-[460px]"><img src={storeImages.skincare} alt="Skincare essentials selected by Sana Cosmetics" loading="lazy" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute left-5 top-5 bg-background/90 px-3 py-2 text-[10px] font-semibold tracking-[0.18em]">THE DAILY RITUAL</div></div>
      <div className="lg:pl-10"><p className="mb-3 text-[10px] font-semibold tracking-[0.22em] text-primary">A LITTLE MORE YOU</p><h2 className="max-w-lg text-4xl leading-tight sm:text-5xl">A routine that feels like your own.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">Simple textures, considered colour, and products that fit into real life. Start with one thoughtful find and make it yours.</p><Button asChild className="mt-7"><Link to="/products" search={{ category: "Skincare", sort: "" }}>Explore skincare <ArrowRight /></Link></Button></div>
    </section>

    <section className="bg-berry text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto] md:items-center lg:px-8">
        <div><p className="text-[10px] font-semibold tracking-[0.22em] text-gold">TODAY’S LITTLE TREATS</p><h2 className="mt-2 text-3xl sm:text-4xl">A good find feels even better on offer.</h2></div>
        <Button asChild variant="outline" className="w-fit border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-berry"><Link to="/products">See the edit <ArrowRight /></Link></Button>
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8"><div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">{offers.map((product) => <div key={product.id} className="flex items-center gap-3 border-t border-primary-foreground/20 pt-4"><img src={product.image} alt={product.name} className="size-16 shrink-0 object-cover" /><div className="min-w-0"><p className="truncate text-sm font-medium">{product.name}</p><p className="mt-1 text-xs text-primary-foreground/70">Now {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(product.price)}</p></div></div>)}</div></div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4"><SectionHeading eyebrow="JUST ARRIVED" title="New to the shelf" description="Fresh discoveries for the next step in your routine." /><Link to="/products" search={{ category: "", sort: "new" }} className="hidden items-center gap-2 text-sm font-medium hover:text-primary sm:flex">See everything <ArrowRight size={16} /></Link></div>
      <ProductGrid products={newArrivals} />
    </section>

    <section className="border-y border-border bg-secondary/45">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4"><SectionHeading eyebrow="LOVED AGAIN & AGAIN" title="Sana favourites" description="Well-loved beauty staples with a little staying power." /><Link to="/products" search={{ category: "", sort: "best" }} className="hidden items-center gap-2 text-sm font-medium hover:text-primary sm:flex">Shop favourites <ArrowRight size={16} /></Link></div>
        <ProductGrid products={bestSellers} />
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <SectionHeading eyebrow="THE SANA PROMISE" title="A thoughtful way to shop beauty" description="Here for the little details that make a good experience feel personal." align="center" />
      <div className="mt-10 grid gap-8 border-y border-border py-8 sm:grid-cols-3 sm:gap-10">
        {[
          { icon: <Leaf />, title: "Carefully considered", copy: "A welcoming edit across skincare, colour, hair, and professional essentials." },
          { icon: <BadgeCheck />, title: "Quality first", copy: "Practical, trusted favourites for daily rituals and busy beauty spaces." },
          { icon: <HeartHandshake />, title: "Here to help", copy: "Friendly guidance for finding the right product for your needs." },
        ].map((item) => <div key={item.title} className="flex gap-4"><span className="grid size-11 shrink-0 place-items-center border border-primary/25 text-primary">{item.icon}</span><div><h3 className="text-xl">{item.title}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{item.copy}</p></div></div>)}
      </div>
    </section>

    <section className="bg-card">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeading eyebrow="KIND WORDS" title="A note from our community" description="A few words from customers who make Sana part of their routine." align="center" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">{testimonials.slice(0, 3).map((review) => <blockquote key={review.id} className="border-t border-border pt-5"><p className="text-gold">{"★".repeat(review.rating)}</p><p className="mt-3 font-display text-2xl leading-snug">“{review.quote}”</p><footer className="mt-4 text-xs text-muted-foreground">{review.name} <span className="mx-1">·</span>{review.city}</footer></blockquote>)}</div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="flex flex-col items-center gap-5 border-y border-border py-10 text-center sm:flex-row sm:justify-between sm:text-left">
        <div><p className="text-[10px] font-semibold tracking-[0.22em] text-primary">OUR BRAND PARTNERS</p><h2 className="mt-2 font-display text-3xl">The names behind the edit</h2></div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-muted-foreground sm:justify-end">{["Sana Select", "Color Theory", "Lumière", "Bare Botanics", "Studio Pro", "Velvet Rose"].map((brand) => <span key={brand}>{brand}</span>)}</div>
      </div>
    </section>

    <section className="bg-secondary/55">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:items-center lg:px-8">
        <div><p className="text-[10px] font-semibold tracking-[0.22em] text-primary">A LITTLE INSPIRATION</p><h2 className="mt-2 text-4xl">Beauty, between moments.</h2><p className="mt-3 text-sm text-muted-foreground">Follow along for product discoveries, pro tips, and everyday rituals.</p><a href="https://instagram.com" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:text-primary"><span>@sanacosmetics</span><ArrowRight size={15} /></a></div>
        <div className="grid grid-cols-3 gap-2"><img src={storeImages.makeup} alt="Makeup inspiration" loading="lazy" className="aspect-square w-full object-cover" /><img src={storeImages.skincare} alt="Skincare inspiration" loading="lazy" className="aspect-square w-full object-cover" /><img src={storeImages.salon} alt="Salon essentials inspiration" loading="lazy" className="aspect-square w-full object-cover" /></div>
      </div>
    </section>

    <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
      <p className="text-[10px] font-semibold tracking-[0.22em] text-primary">LETTERS FROM SANA</p><h2 className="mt-2 text-4xl">A little beauty in your inbox.</h2><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Get the latest finds, special offers, and thoughtful beauty notes.</p><NewsletterSignup />
    </section>
  </StorefrontLayout>;
}