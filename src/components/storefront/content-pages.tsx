import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, HeartHandshake, Mail, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";

import { useStore } from "@/context/store-context";
import { storeImages } from "@/lib/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageIntro, StorefrontLayout } from "@/components/storefront/layout";

export function AboutPage() {
  return (
    <StorefrontLayout>
      <PageIntro eyebrow="OUR STORY" title="Beauty should feel personal." description="Sana Cosmetics is Kolhapur’s premier destination for luxury everyday cosmetics, skincare, haircare, and professional salon & parlour supplies." />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1fr_0.95fr] md:items-center">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.24em] text-primary">KOLHAPUR’S BEAUTY DESTINATION</p>
            <h2 className="mt-3 max-w-xl text-4xl leading-tight sm:text-5xl">A thoughtful edit, chosen close to home.</h2>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              From velvety lipsticks and luminous serums to salon chairs, wax strips, and professional parlour material, Sana Cosmetics brings together retail luxury and wholesale dependability. We believe finding the right product should feel welcoming, inspiring, and effortless.
            </p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Located near Dhyanchand Hockey Stadium in Padmala, Kolhapur, we serve individual beauty lovers as well as salons and studios across Maharashtra.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="rounded-full px-7"><Link to="/contact">Visit or Contact Us <ArrowRight size={16} /></Link></Button>
              <Button asChild variant="outline" className="rounded-full px-7"><Link to="/products" search={{}}>Explore Catalog</Link></Button>
            </div>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-3xl border border-border bg-secondary shadow-md">
            <img src={storeImages.atelier} alt="Sana Cosmetics luxury beauty boutique interior" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
        <div className="mt-14 grid grid-cols-2 gap-4 rounded-3xl border border-border bg-gradient-to-r from-secondary/70 via-card to-secondary/70 p-6 text-center shadow-xs sm:grid-cols-4">
          {[
            { value: "10+", label: "Beauty Categories" },
            { value: "100%", label: "Curated Authenticity" },
            { value: "Retail & Pro", label: "Salon Wholesale" },
            { value: "Kolhapur", label: "Padmala Showroom" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-semibold text-primary sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { eyebrow: "OUR MISSION", title: "Make good beauty easy to find.", copy: "Bring a considered range of luxury cosmetics and salon supplies together with warm, helpful guidance." },
            { eyebrow: "OUR VISION", title: "A trusted beauty partner.", copy: "Be the go-to destination for customers, salons, and parlours across Kolhapur and beyond." },
            { eyebrow: "BEAUTY PROMISE", title: "Curated authenticity.", copy: "Every lipstick, serum, and professional kit is selected for reliable quality and real performance." },
            { eyebrow: "CUSTOMER SATISFACTION", title: "Care in every visit.", copy: "Listen first, recommend honestly, and make every shopping experience feel special." },
          ].map((card) => (
            <div key={card.eyebrow} className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <span className="text-[10px] font-semibold tracking-[0.22em] text-primary">{card.eyebrow}</span>
              <h3 className="mt-2 text-2xl">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </StorefrontLayout>
  );
}

export function ContactPage() {
  const { settings } = useStore();
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <StorefrontLayout>
      <PageIntro eyebrow="WE’RE HERE TO HELP" title="Let’s talk beauty." description="Have a question about a product, wholesale parlour orders, or visiting our Kolhapur showroom? Reach out anytime." />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5"><MapPin size={18} className="text-primary" /><h2 className="mt-3 font-display text-xl">Store Address</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">{settings.address}</p><a className="mt-2 inline-block text-xs font-medium text-primary underline underline-offset-4" href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`} target="_blank" rel="noreferrer">Open in Google Maps</a></div>
            <div className="rounded-2xl border border-border bg-card p-5"><Clock3 size={18} className="text-primary" /><h2 className="mt-3 font-display text-xl">Working Hours</h2><p className="mt-1 text-xs leading-5 text-muted-foreground">Monday – Saturday<br />10:00 AM – 8:30 PM<br />Sunday: Closed</p></div>
            <div className="rounded-2xl border border-border bg-card p-5"><Phone size={18} className="text-primary" /><h2 className="mt-3 font-display text-xl">Phone</h2><a href={`tel:${settings.phone}`} className="mt-1 block text-sm text-muted-foreground hover:text-primary">{settings.phone}</a></div>
            <div className="rounded-2xl border border-border bg-card p-5"><Mail size={18} className="text-primary" /><h2 className="mt-3 font-display text-xl">Email</h2><a href={`mailto:${settings.email}`} className="mt-1 block text-sm text-muted-foreground hover:text-primary">{settings.email}</a></div>
          </div>
          <div className="relative min-h-[240px] overflow-hidden rounded-2xl border border-border bg-secondary/50" role="img" aria-label="Google Map placeholder for Sana Cosmetics in Kolhapur">
            <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)", backgroundSize: "38px 38px" }} />
            <div className="absolute left-[42%] top-[36%] grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg"><MapPin size={22} /></div>
            <div className="absolute bottom-3 left-3 rounded-xl bg-white/95 px-4 py-2 text-xs font-medium shadow-xs backdrop-blur-xs">Sana Cosmetics · Padmala, Kolhapur 416007</div>
          </div>
        </div>
        <form onSubmit={submit} className="h-fit rounded-2xl border border-border bg-card p-6 shadow-xs sm:p-8">
          <h2 className="font-display text-3xl">Send us a message</h2>
          <p className="mt-2 text-sm text-muted-foreground">This preview form shows an instant confirmation without sending to a backend.</p>
          {submitted ? (
            <div role="status" className="mt-8 rounded-2xl border border-border bg-secondary/40 py-10 text-center">
              <Sparkles size={28} className="mx-auto text-primary" />
              <p className="mt-3 font-medium">Thanks for reaching out to Sana Cosmetics.</p>
              <p className="mt-1 text-sm text-muted-foreground">Your message has been recorded in this preview.</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <label className="block text-xs font-medium">Your name<Input required className="mt-2 rounded-xl" autoComplete="name" /></label>
              <label className="block text-xs font-medium">Email address<Input required type="email" className="mt-2 rounded-xl" autoComplete="email" /></label>
              <label className="block text-xs font-medium">How can we help?<Textarea required rows={5} className="mt-2 rounded-xl" /></label>
              <Button type="submit" size="lg" className="w-full rounded-full">Send Message <ArrowRight size={16} /></Button>
            </div>
          )}
        </form>
      </div>
    </StorefrontLayout>
  );
}

const faqs = [
  ["What can I find at Sana Cosmetics?", "We carry cosmetics, beauty and skincare products, haircare, salon and parlour materials, salon chairs & equipment, wax products, makeup kits, perfumes, nail care, and beauty accessories."],
  ["Do you serve salons and parlours?", "Yes. Sana Cosmetics is a leading cosmetics dealer and wholesaler in Kolhapur offering both retail and bulk salon essentials."],
  ["Can I ask for product recommendations?", "Absolutely. Call 9421216286 or visit our Padmala showroom for personalised shade and skincare guidance."],
  ["How can I apply a promo code?", "In your shopping bag, enter a code such as GLOW10 or WELCOME150 to preview instant savings on your order summary."],
  ["Are payments processed on this website?", "No. Checkout is a mock preview experience and does not collect real card details or process live payments."],
];

export function FaqPage() {
  return (
    <StorefrontLayout>
      <PageIntro eyebrow="GOOD TO KNOW" title="Frequently Asked Questions" description="Quick answers about Sana Cosmetics, wholesale parlour orders, and this preview storefront." />
      <section className="mx-auto max-w-3xl space-y-4 px-4 py-12 sm:px-6">
        {faqs.map(([question, answer]) => (
          <details key={question} className="group rounded-2xl border border-border bg-card px-6 py-5 shadow-2xs">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display text-xl marker:hidden">
              <span>{question}</span>
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-primary transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{answer}</p>
          </details>
        ))}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-secondary/50 p-6 text-center sm:flex-row sm:text-left">
          <div>
            <p className="font-display text-2xl">Still have a question?</p>
            <p className="text-xs text-muted-foreground">Our Kolhapur team is happy to help with shades, kits, or wholesale orders.</p>
          </div>
          <Button asChild className="rounded-full px-6"><Link to="/contact">Contact Sana <ArrowRight size={15} /></Link></Button>
        </div>
      </section>
    </StorefrontLayout>
  );
}

const policyCopy: Record<string, { title: string; eyebrow: string; description: string; sections: Array<[string, string]> }> = {
  privacy: {
    title: "Privacy Policy", eyebrow: "YOUR INFORMATION", description: "How information is handled in the Sana Cosmetics storefront preview.", sections: [
      ["Demo experience", "This website uses local mock data to demonstrate shopping and store management. Information you enter stays in the current browser session and is not sent to a live server."],
      ["Contact details", "The business contact details displayed here are public information provided for Sana Cosmetics. Use the listed phone or email to contact the store directly."],
      ["Payments", "This preview does not collect payment details, operate a payment gateway, or create a real transaction."],
      ["Questions", "For questions about this preview, contact Sana Cosmetics using the details shown on the Contact page."],
    ],
  },
  terms: {
    title: "Terms & Conditions", eyebrow: "STOREFRONT TERMS", description: "Please keep in mind that this website is a demonstration storefront.", sections: [
      ["Preview only", "Product details, prices, stock, orders, and offers are sample information for demonstration. Nothing on this website creates a binding sale."],
      ["No payment", "Checkout offers sample payment choices but does not collect payment information or submit a transaction."],
      ["Product information", "Descriptions are illustrative. For current availability, wholesale pricing, or professional enquiries, contact Sana Cosmetics directly."],
      ["Use of this site", "Please use the storefront and admin screens as a demonstration of the requested experience."],
    ],
  },
  returns: {
    title: "Return Policy", eyebrow: "RETURNS & EXCHANGES", description: "Clear guidelines for return and exchange enquiries.", sections: [
      ["Contact us first", "Please contact Sana Cosmetics with your order details and concern so our team can guide you."],
      ["Product condition", "For hygiene and safety, cosmetics and personal-care products should remain unopened and unused when enquiring about a return."],
      ["Demo orders", "Orders created in this preview are not real purchases and cannot be returned or refunded."],
      ["Need help?", "Call 9421216286 or email sanacosmetic@gmail.com for store assistance."],
    ],
  },
  shipping: {
    title: "Shipping Policy", eyebrow: "DELIVERY INFORMATION", description: "Delivery details shown here are part of the demo shopping experience.", sections: [
      ["Preview checkout", "This website demonstrates a checkout flow. Delivery charges and order totals are sample values and no parcel will be dispatched from an order placed here."],
      ["Address details", "The demo checkout asks for delivery details so the experience can be previewed; those details are not sent to a live fulfilment service."],
      ["Business enquiries", "For actual availability or wholesale delivery arrangements, contact Sana Cosmetics directly at 9421216286 or sanacosmetic@gmail.com."],
      ["Local store", "Visit us at Shop No. 6, Sharda Vihar, Isolation Ring Road, Near Dhyanchand Hockey Stadium, Padmala, Kolhapur, Maharashtra 416007."],
    ],
  },
};

export function PolicyPage({ kind }: { kind: keyof typeof policyCopy }) {
  const policy = policyCopy[kind];
  if (!policy) return null;
  return (
    <StorefrontLayout>
      <PageIntro eyebrow={policy.eyebrow} title={policy.title} description={policy.description} />
      <article className="mx-auto max-w-3xl space-y-4 px-4 py-12 sm:px-6">
        {policy.sections.map(([title, copy]) => (
          <section key={title} className="rounded-2xl border border-border bg-card p-6 shadow-2xs">
            <h2 className="flex items-center gap-2 font-display text-2xl"><ShieldCheck size={18} className="text-primary" />{title}</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{copy}</p>
          </section>
        ))}
        <p className="pt-4 text-xs text-muted-foreground"><HeartHandshake size={14} className="mr-1.5 inline text-primary" />Last reviewed: November 2026.</p>
      </article>
    </StorefrontLayout>
  );
}
