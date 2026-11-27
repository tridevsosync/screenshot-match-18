import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, Mail, MapPin, Phone, Sparkles } from "lucide-react";

import { useStore } from "@/context/store-context";
import { formatINR } from "@/lib/store-utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageIntro, StorefrontLayout } from "@/components/storefront/layout";

export function AboutPage() {
  return <StorefrontLayout>
    <PageIntro eyebrow="OUR STORY" title="Beauty should feel personal." description="Sana Cosmetics is a Kolhapur beauty destination for everyday rituals, special moments, and the professionals who make people feel their best." />
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-[1fr_0.85fr] md:items-center">
        <div><p className="text-[10px] font-semibold tracking-[0.2em] text-primary">A LOCAL BEAUTY ADDRESS</p><h2 className="mt-3 max-w-xl text-4xl leading-tight sm:text-5xl">A thoughtful edit, chosen close to home.</h2><p className="mt-5 text-sm leading-7 text-muted-foreground">From makeup and skincare to salon and parlour essentials, Sana Cosmetics brings together the products people reach for every day and the tools beauty professionals rely on. We believe great service starts with listening—and that finding the right product should feel welcoming, never overwhelming.</p><p className="mt-4 text-sm leading-7 text-muted-foreground">Based in Kolhapur, we serve beauty lovers, salons, and parlours with a broad range of quality essentials and a personal approach to every visit.</p><Button asChild className="mt-6"><Link to="/contact">Come say hello <ArrowRight /></Link></Button></div>
        <div className="relative min-h-[350px] overflow-hidden bg-secondary"><img src="/assets/sana-hero.png" alt="Sana Cosmetics beauty collection" className="absolute inset-0 h-full w-full object-cover" /></div>
      </div>
      <div className="mt-14 grid gap-8 border-y border-border py-9 md:grid-cols-3">
        <div><span className="text-[10px] font-semibold tracking-[0.2em] text-primary">OUR MISSION</span><h3 className="mt-2 text-2xl">Make good beauty easier to find.</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Bring a considered range of beauty and professional products together with thoughtful, helpful service.</p></div>
        <div><span className="text-[10px] font-semibold tracking-[0.2em] text-primary">OUR VISION</span><h3 className="mt-2 text-2xl">A trusted local beauty partner.</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Be a welcoming destination for customers, salons, and parlours across Kolhapur and beyond.</p></div>
        <div><span className="text-[10px] font-semibold tracking-[0.2em] text-primary">OUR PROMISE</span><h3 className="mt-2 text-2xl">Care in every recommendation.</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Listen first, offer practical guidance, and help each person find what suits them.</p></div>
      </div>
    </div>
  </StorefrontLayout>;
}

export function ContactPage() {
  const { settings } = useStore();
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return <StorefrontLayout>
    <PageIntro eyebrow="WE’RE HERE TO HELP" title="Let’s talk beauty." description="Have a question about a product, salon supplies, or visiting the store? We’d love to hear from you." />
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <div className="space-y-7">
        <div className="flex gap-4"><span className="grid size-10 shrink-0 place-items-center border border-primary/25 text-primary"><MapPin size={18} /></span><div><h2 className="font-display text-xl">Visit the store</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">{settings.address}</p><a className="mt-2 inline-block text-xs font-medium text-primary underline underline-offset-4" href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`} target="_blank" rel="noreferrer">Open in Maps</a></div></div>
        <div className="flex gap-4"><span className="grid size-10 shrink-0 place-items-center border border-primary/25 text-primary"><Phone size={18} /></span><div><h2 className="font-display text-xl">Call us</h2><a href={`tel:${settings.phone}`} className="mt-1 block text-sm text-muted-foreground hover:text-primary">{settings.phone}</a></div></div>
        <div className="flex gap-4"><span className="grid size-10 shrink-0 place-items-center border border-primary/25 text-primary"><Mail size={18} /></span><div><h2 className="font-display text-xl">Email us</h2><a href={`mailto:${settings.email}`} className="mt-1 block text-sm text-muted-foreground hover:text-primary">{settings.email}</a></div></div>
        <div className="flex gap-4"><span className="grid size-10 shrink-0 place-items-center border border-primary/25 text-primary"><Clock3 size={18} /></span><div><h2 className="font-display text-xl">Store hours</h2><p className="mt-1 text-sm text-muted-foreground">Please call ahead for today’s hours.</p></div></div>
        <div className="relative min-h-[220px] overflow-hidden border border-border bg-secondary/60" role="img" aria-label="Map location placeholder for Sana Cosmetics in Kolhapur">
          <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
          <div className="absolute left-[38%] top-[35%] grid size-11 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg"><MapPin size={20} /></div>
          <div className="absolute bottom-3 left-3 bg-background/90 px-3 py-2 text-xs font-medium">Sana Cosmetics · Kolhapur</div>
        </div>
      </div>
      <form onSubmit={submit} className="h-fit border border-border bg-card p-5 sm:p-7">
        <h2 className="font-display text-3xl">Send us a note</h2><p className="mt-2 text-sm text-muted-foreground">This preview form shows a confirmation only; it doesn’t send a message.</p>
        {submitted ? <div role="status" className="mt-8 border-y border-border py-8 text-center"><Sparkles size={25} className="mx-auto text-primary" /><p className="mt-3 font-medium">Thanks for reaching out.</p><p className="mt-1 text-sm text-muted-foreground">We’ve saved your message in this demo.</p></div> : <div className="mt-6 space-y-4">
          <label className="block text-xs font-medium">Your name<Input required className="mt-2" autoComplete="name" /></label>
          <label className="block text-xs font-medium">Email address<Input required type="email" className="mt-2" autoComplete="email" /></label>
          <label className="block text-xs font-medium">How can we help?<Textarea required rows={5} className="mt-2" /></label>
          <Button type="submit" className="w-full">Send message <ArrowRight /></Button>
        </div>}
      </form>
    </div>
  </StorefrontLayout>;
}

const faqs = [
  ["What can I find at Sana Cosmetics?", "We carry cosmetics, beauty and skincare products, haircare, salon and parlour materials, salon equipment, wax products, makeup kits, fragrance, nail care, and beauty accessories."],
  ["Do you serve salons and parlours?", "Yes. Sana Cosmetics is a dealer and wholesaler with professional beauty and salon essentials. Please contact us about your requirements."],
  ["Can I ask for product recommendations?", "Absolutely. Reach us by phone or visit the store and we’ll help you explore options that suit your routine or professional needs."],
  ["How can I check an order?", "Orders in this preview are demonstrations only. A real order-tracking service is not connected."],
  ["Are payments processed on this website?", "No. Checkout is a mock experience for preview purposes. It does not collect card details or process a payment."],
];

export function FaqPage() {
  return <StorefrontLayout><PageIntro eyebrow="GOOD TO KNOW" title="A few helpful answers." description="If you can’t find what you’re looking for, get in touch and we’ll be happy to help." /><section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">{faqs.map(([question, answer]) => <details key={question} className="group border-b border-border py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display text-xl marker:hidden"><span>{question}</span><span className="text-primary transition-transform group-open:rotate-45">+</span></summary><p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{answer}</p></details>)}</section></StorefrontLayout>;
}

const policyCopy: Record<string, { title: string; eyebrow: string; description: string; sections: Array<[string, string]> }> = {
  privacy: {
    title: "Privacy, with care.", eyebrow: "YOUR INFORMATION", description: "A clear note on information in this Sana Cosmetics preview.", sections: [
      ["Demo experience", "This website uses local sample data to demonstrate shopping and store management. Information you enter is held only in the current browser session and is not sent to a live service."],
      ["Contact details", "The business contact details displayed here are public information provided for Sana Cosmetics. Use the listed phone or email to contact the store directly."],
      ["Payments", "This preview does not collect payment details, operate a payment gateway, or create a real transaction."],
      ["Questions", "For questions about this preview, contact Sana Cosmetics using the details shown on the Contact page."],
    ],
  },
  terms: {
    title: "A few simple terms.", eyebrow: "TERMS & CONDITIONS", description: "Please keep in mind that this website is a demonstration storefront.", sections: [
      ["Preview only", "Product details, prices, stock, orders, and offers are sample information for demonstration. Nothing on this website creates a binding sale."],
      ["No payment", "Checkout offers sample payment choices but does not collect payment information or submit a transaction."],
      ["Product information", "Descriptions are illustrative. For current availability, product details, or professional enquiries, contact Sana Cosmetics directly."],
      ["Use of this site", "Please use the storefront and admin screens as a demonstration of the requested experience."],
    ],
  },
  returns: {
    title: "Here if something isn’t right.", eyebrow: "RETURNS & EXCHANGES", description: "A helpful starting point for return enquiries.", sections: [
      ["Contact us first", "Please contact Sana Cosmetics with your order details and the product concern so the team can guide you."],
      ["Product condition", "For hygiene and safety, cosmetics and personal-care products should remain unopened and unused when you enquire about a return."],
      ["Demo orders", "Orders created in this preview are not real purchases and cannot be returned or refunded."],
      ["Need help?", "Call 9421216286 or email sanacosmetic@gmail.com for store assistance."],
    ],
  },
  shipping: {
    title: "Shipping, made clear.", eyebrow: "DELIVERY INFORMATION", description: "Delivery details shown here are part of the demo shopping experience.", sections: [
      ["Preview checkout", "This website demonstrates a checkout flow. Delivery charges and order totals are sample values and no parcel will be dispatched from an order placed here."],
      ["Address details", "The demo checkout asks for delivery details so the experience can be previewed; those details are not sent to a live fulfilment service."],
      ["Business enquiries", "For actual availability or delivery arrangements, contact Sana Cosmetics directly at 9421216286 or sanacosmetic@gmail.com."],
      ["Local store", "Visit us at Shop No. 6, Sharda Vihar, Isolation Ring Road, near Dhyanchand Hockey Stadium, Padmala, Kolhapur, Maharashtra 416007."],
    ],
  },
};

export function PolicyPage({ kind }: { kind: keyof typeof policyCopy }) {
  const policy = policyCopy[kind];
  return <StorefrontLayout><PageIntro eyebrow={policy.eyebrow} title={policy.title} description={policy.description} /><article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">{policy.sections.map(([title, copy]) => <section key={title} className="border-b border-border py-5"><h2 className="font-display text-2xl">{title}</h2><p className="mt-2 text-sm leading-7 text-muted-foreground">{copy}</p></section>)}<p className="mt-8 text-xs text-muted-foreground">Last reviewed: November 2026.</p></article></StorefrontLayout>;
}