import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgePercent,
  BarChart3,
  Boxes,
  Check,
  ClipboardList,
  Heart,
  LogOut,
  Mail,
  Package,
  Plus,
  Settings2,
  Store,
  Trash2,
  Users,
} from "lucide-react";

import { useStore } from "@/context/store-context";
import { storeImages } from "@/lib/media";
import { formatINR, isAdminCredentials, slugify } from "@/lib/store-utils";
import type { Coupon, OrderStatus, Product, StoreSettings } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function AdminLoginPage() {
  const { isAdminAuthenticated, setAdminAuthenticated } = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAdminAuthenticated) void navigate({ to: "/admin", replace: true });
  }, [isAdminAuthenticated, navigate]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAdminCredentials(username, password)) {
      setError("Those demo sign-in details don’t match.");
      return;
    }
    setAdminAuthenticated(true);
    setError("");
    void navigate({ to: "/admin", replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/45 px-4 py-10">
      <section className="w-full max-w-md border border-border bg-background p-6 sm:p-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft size={15} /> Back to Sana Cosmetics
        </Link>
        <p className="mt-8 text-[10px] font-semibold tracking-[0.2em] text-primary">DEMO STORE MANAGEMENT</p>
        <h1 className="mt-2 font-display text-4xl">Welcome back.</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Sign in to manage the sample storefront and its demo records.</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label htmlFor="admin-username" className="block text-xs font-medium">Username
            <Input id="admin-username" autoComplete="username" className="mt-2" value={username} onChange={(event) => setUsername(event.target.value)} required />
          </label>
          <label htmlFor="admin-password" className="block text-xs font-medium">Password
            <Input id="admin-password" type="password" autoComplete="current-password" className="mt-2" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
        <p className="mt-5 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">Demo access: <strong className="text-foreground">admin</strong> / <strong className="text-foreground">admin123</strong>. This sign-in is for preview use only and does not protect real store data.</p>
      </section>
    </main>
  );
}

type AdminSection = "Overview" | "Products" | "Orders" | "Customers" | "Offers" | "Storefront" | "Subscribers" | "Settings";

const adminSections: Array<{ name: AdminSection; icon: ReactNode }> = [
  { name: "Overview", icon: <BarChart3 size={16} /> },
  { name: "Products", icon: <Package size={16} /> },
  { name: "Orders", icon: <ClipboardList size={16} /> },
  { name: "Customers", icon: <Users size={16} /> },
  { name: "Offers", icon: <BadgePercent size={16} /> },
  { name: "Storefront", icon: <Store size={16} /> },
  { name: "Subscribers", icon: <Mail size={16} /> },
  { name: "Settings", icon: <Settings2 size={16} /> },
];

export function AdminDashboardPage() {
  const { isAdminAuthenticated, setAdminAuthenticated } = useStore();
  const navigate = useNavigate();
  const [section, setSection] = useState<AdminSection>("Overview");

  useEffect(() => {
    if (!isAdminAuthenticated) void navigate({ to: "/admin/login", replace: true });
  }, [isAdminAuthenticated, navigate]);

  if (!isAdminAuthenticated) return null;

  function signOut() {
    setAdminAuthenticated(false);
    void navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="Sana Cosmetics storefront">
            <span className="grid size-10 place-items-center rounded-full border border-primary/30 bg-secondary text-primary"><Heart size={17} /></span>
            <span><span className="block font-display text-xl font-semibold">Sana</span><span className="block text-[9px] font-semibold tracking-[0.22em] text-muted-foreground">STORE STUDIO</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden items-center gap-2 text-xs text-muted-foreground hover:text-primary sm:inline-flex"><ArrowLeft size={14} /> View storefront</Link>
            <Button type="button" variant="outline" size="sm" onClick={signOut}><LogOut size={14} /> Sign out</Button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-[10px] font-semibold tracking-[0.2em] text-primary">SANA COSMETICS · PREVIEW</p><h1 className="mt-1 font-display text-4xl">Store management</h1></div>
          <p className="max-w-sm text-xs leading-5 text-muted-foreground">Changes apply to this preview session only. No live orders, payments, or customer records are connected.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-12">
          <nav aria-label="Store management" className="flex gap-1 overflow-x-auto border-b border-border pb-3 lg:block lg:overflow-visible lg:border-b-0 lg:pb-0">
            {adminSections.map((item) => (
              <Button key={item.name} type="button" variant={section === item.name ? "secondary" : "ghost"} size="sm" aria-current={section === item.name ? "page" : undefined} onClick={() => setSection(item.name)} className="shrink-0 justify-start gap-2 lg:mb-1 lg:flex lg:w-full">
                {item.icon}<span>{item.name}</span>
              </Button>
            ))}
          </nav>
          <main className="min-w-0">
            {section === "Overview" && <OverviewPanel />}
            {section === "Products" && <ProductsPanel />}
            {section === "Orders" && <OrdersPanel />}
            {section === "Customers" && <CustomersPanel />}
            {section === "Offers" && <OffersPanel />}
            {section === "Storefront" && <StorefrontPanel />}
            {section === "Subscribers" && <SubscribersPanel />}
            {section === "Settings" && <SettingsPanel />}
          </main>
        </div>
      </div>
    </div>
  );
}

function PanelHeading({ title, description }: { title: string; description: string }) {
  return <div className="mb-6 border-b border-border pb-4"><h2 className="font-display text-3xl">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p></div>;
}

function OverviewPanel() {
  const { products, orders, customers, subscribers } = useStore();
  const pendingOrders = orders.filter((order) => order.status === "Pending").length;
  const lowStock = products.filter((product) => product.stock > 0 && product.stock < 8).length;
  const stats = [
    { label: "Products", value: products.length, icon: <Package size={17} /> },
    { label: "Orders", value: orders.length, icon: <ClipboardList size={17} /> },
    { label: "Customers", value: customers.length, icon: <Users size={17} /> },
    { label: "Subscribers", value: subscribers.length, icon: <Mail size={17} /> },
  ];
  return <>
    <PanelHeading title="Overview" description="A quick look at this sample store’s activity." />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <div key={stat.label} className="border border-border p-4"><div className="flex items-center justify-between text-muted-foreground"><span className="text-xs">{stat.label}</span>{stat.icon}</div><p className="mt-3 font-display text-3xl">{stat.value}</p></div>)}</div>
    <div className="mt-8 grid gap-8 md:grid-cols-2">
      <section><h3 className="font-display text-2xl">Needs a look</h3><div className="mt-3 divide-y divide-border border-y border-border text-sm"><div className="flex justify-between gap-4 py-3"><span className="text-muted-foreground">Pending orders</span><strong>{pendingOrders}</strong></div><div className="flex justify-between gap-4 py-3"><span className="text-muted-foreground">Low-stock products</span><strong>{lowStock}</strong></div></div></section>
      <section><h3 className="font-display text-2xl">Preview status</h3><p className="mt-3 border-y border-border py-3 text-sm leading-6 text-muted-foreground">This is a sample storefront. Your edits are temporary, checkout is simulated, and no payment or message is sent.</p></section>
    </div>
  </>;
}

type ProductDraft = Pick<Product, "name" | "category" | "brand" | "price" | "originalPrice" | "stock" | "description">;
const blankProductDraft: ProductDraft = { name: "", category: "Makeup", brand: "Sana Select", price: 0, originalPrice: 0, stock: 0, description: "" };

function ProductsPanel() {
  const { products, setProducts, categories } = useStore();
  const [draft, setDraft] = useState<ProductDraft>(blankProductDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  function beginCreate() {
    setDraft(blankProductDraft);
    setEditingId(null);
    setCreating(true);
  }

  function beginEdit(product: Product) {
    setDraft({ name: product.name, category: product.category, brand: product.brand, price: product.price, originalPrice: product.originalPrice, stock: product.stock, description: product.description });
    setEditingId(product.id);
    setCreating(false);
  }

  function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = draft.name.trim();
    if (!cleanName) return;
    if (creating) {
      const baseId = slugify(cleanName) || "new-product";
      const id = products.some((product) => product.id === baseId) ? `${baseId}-${Date.now().toString().slice(-5)}` : baseId;
      const product: Product = { ...draft, id, badge: "New", image: storeImages.makeup, photos: [storeImages.makeup], rating: 0, reviews: 0, ingredients: [], benefits: [], directions: "", isNew: true, isBestSeller: false, isFeatured: false };
      setProducts((current) => [product, ...current]);
    } else if (editingId !== null) {
      setProducts((current) => current.map((product) => product.id === editingId ? { ...product, ...draft, name: cleanName } : product));
    }
    setDraft(blankProductDraft);
    setEditingId(null);
    setCreating(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setCreating(false);
  }

  return <>
    <PanelHeading title="Products" description={`${products.length} items in the sample catalog.`} />
    <div className="mb-4 flex justify-end"><Button type="button" onClick={beginCreate}><Plus size={15} /> Add product</Button></div>
    {(creating || editingId !== null) && <form onSubmit={saveProduct} className="mb-7 grid gap-4 border border-border p-4 sm:grid-cols-2 lg:grid-cols-3">
      <label className="text-xs font-medium">Product name<Input required className="mt-2" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} /></label>
      <label className="text-xs font-medium">Category<select className="admin-select mt-2" value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
      <label className="text-xs font-medium">Brand<Input className="mt-2" value={draft.brand} onChange={(event) => setDraft((current) => ({ ...current, brand: event.target.value }))} /></label>
      <label className="text-xs font-medium">Price (₹)<Input required type="number" min="0" className="mt-2" value={draft.price} onChange={(event) => setDraft((current) => ({ ...current, price: Number(event.target.value) }))} /></label>
      <label className="text-xs font-medium">Original price (₹)<Input required type="number" min="0" className="mt-2" value={draft.originalPrice} onChange={(event) => setDraft((current) => ({ ...current, originalPrice: Number(event.target.value) }))} /></label>
      <label className="text-xs font-medium">Stock<Input required type="number" min="0" className="mt-2" value={draft.stock} onChange={(event) => setDraft((current) => ({ ...current, stock: Number(event.target.value) }))} /></label>
      <label className="text-xs font-medium sm:col-span-2 lg:col-span-3">Description<Textarea rows={2} className="mt-2" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} /></label>
      <div className="flex gap-2 sm:col-span-2 lg:col-span-3"><Button type="submit"><Check size={15} /> Save product</Button><Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button></div>
    </form>}
    <div className="overflow-x-auto border-y border-border"><table className="w-full min-w-[680px] text-left text-sm"><thead className="text-xs text-muted-foreground"><tr><th className="py-3 pr-4 font-medium">Product</th><th className="py-3 pr-4 font-medium">Category</th><th className="py-3 pr-4 font-medium">Price</th><th className="py-3 pr-4 font-medium">Stock</th><th className="py-3 font-medium">Actions</th></tr></thead><tbody className="divide-y divide-border">{products.map((product) => <tr key={product.id}><td className="py-3 pr-4"><div className="flex items-center gap-3"><img src={product.image} alt="" className="size-12 shrink-0 object-cover" /><span className="min-w-0"><span className="block font-medium">{product.name}</span><span className="text-xs text-muted-foreground">{product.brand}</span></span></div></td><td className="py-3 pr-4 text-muted-foreground">{product.category}</td><td className="py-3 pr-4">{formatINR(product.price)}</td><td className="py-3 pr-4">{product.stock}</td><td className="py-3"><div className="flex gap-1"><Button type="button" variant="ghost" size="sm" onClick={() => beginEdit(product)}>Edit</Button><Button type="button" variant="ghost" size="icon" aria-label={`Remove ${product.name}`} onClick={() => setProducts((current) => current.filter((item) => item.id !== product.id))}><Trash2 size={15} /></Button></div></td></tr>)}</tbody></table></div>
  </>;
}

const orderStatuses: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

function OrdersPanel() {
  const { orders, setOrders } = useStore();
  return <>
    <PanelHeading title="Orders" description="Update the status of sample orders. No fulfilment service is connected." />
    <div className="overflow-x-auto border-y border-border"><table className="w-full min-w-[720px] text-left text-sm"><thead className="text-xs text-muted-foreground"><tr><th className="py-3 pr-4 font-medium">Order</th><th className="py-3 pr-4 font-medium">Customer</th><th className="py-3 pr-4 font-medium">Placed</th><th className="py-3 pr-4 font-medium">Total</th><th className="py-3 font-medium">Status</th></tr></thead><tbody className="divide-y divide-border">{orders.map((order) => <tr key={order.id}><td className="py-3 pr-4 font-medium">{order.id}<span className="mt-1 block text-xs font-normal text-muted-foreground">{order.items.length} items · {order.payment}</span></td><td className="py-3 pr-4">{order.customer}<span className="mt-1 block text-xs text-muted-foreground">{order.email}</span></td><td className="py-3 pr-4 text-muted-foreground">{order.date}</td><td className="py-3 pr-4">{formatINR(order.total)}</td><td className="py-3"><select aria-label={`Update status for order ${order.id}`} className="admin-select" value={order.status} onChange={(event) => { const nextStatus = orderStatuses.find((status) => status === event.target.value); if (nextStatus) setOrders((current) => current.map((item) => item.id === order.id ? { ...item, status: nextStatus } : item)); }}>{orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td></tr>)}</tbody></table></div>
  </>;
}

function CustomersPanel() {
  const { customers } = useStore();
  return <>
    <PanelHeading title="Customers" description="Sample customer records included with the storefront preview." />
    <div className="overflow-x-auto border-y border-border"><table className="w-full min-w-[620px] text-left text-sm"><thead className="text-xs text-muted-foreground"><tr><th className="py-3 pr-4 font-medium">Customer</th><th className="py-3 pr-4 font-medium">Contact</th><th className="py-3 pr-4 font-medium">Orders</th><th className="py-3 font-medium">Spent</th></tr></thead><tbody className="divide-y divide-border">{customers.map((customer) => <tr key={customer.id}><td className="py-3 pr-4 font-medium">{customer.name}</td><td className="py-3 pr-4"><span className="block">{customer.email}</span><span className="text-xs text-muted-foreground">{customer.mobile}</span></td><td className="py-3 pr-4">{customer.orders}</td><td className="py-3">{formatINR(customer.spent)}</td></tr>)}</tbody></table></div>
  </>;
}

function OffersPanel() {
  const { coupons, setCoupons } = useStore();
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(10);
  const [kind, setKind] = useState<Coupon["kind"]>("Percent");
  const [notice, setNotice] = useState("");

  function addCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode || discount < 1 || coupons.some((coupon) => coupon.code.toUpperCase() === cleanCode)) {
      setNotice("Choose a new code and a discount above zero.");
      return;
    }
    setCoupons((current) => [{ code: cleanCode, discount, kind, active: true, expires: "No expiry" }, ...current]);
    setCode("");
    setNotice("Offer added to the preview.");
  }

  return <>
    <PanelHeading title="Offers" description="Create sample coupon codes and switch offers on or off." />
    <form onSubmit={addCoupon} className="mb-7 grid gap-3 border border-border p-4 sm:grid-cols-[1fr_150px_150px_auto] sm:items-end">
      <label className="text-xs font-medium">New code<Input required className="mt-2" placeholder="GLOW10" value={code} onChange={(event) => setCode(event.target.value)} /></label>
      <label className="text-xs font-medium">Discount<select className="admin-select mt-2" value={kind} onChange={(event) => { if (event.target.value === "Flat" || event.target.value === "Percent") setKind(event.target.value); }}><option value="Percent">Percent</option><option value="Flat">Amount (₹)</option></select></label>
      <label className="text-xs font-medium">Value<Input required type="number" min="1" className="mt-2" value={discount} onChange={(event) => setDiscount(Number(event.target.value))} /></label>
      <Button type="submit"><Plus size={15} /> Add offer</Button>
      {notice && <p role="status" className="text-xs text-muted-foreground sm:col-span-4">{notice}</p>}
    </form>
    <div className="divide-y divide-border border-y border-border">{coupons.map((coupon) => <div key={coupon.code} className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="font-medium">{coupon.code}<span className="ml-2 text-xs font-normal text-muted-foreground">{coupon.kind === "Percent" ? `${coupon.discount}% off` : `${formatINR(coupon.discount)} off`}</span></p><p className="mt-1 text-xs text-muted-foreground">{coupon.expires}</p></div><div className="flex items-center gap-2"><span className={`text-xs ${coupon.active ? "text-success" : "text-muted-foreground"}`}>{coupon.active ? "Active" : "Paused"}</span><Button type="button" variant="outline" size="sm" aria-pressed={coupon.active} onClick={() => setCoupons((current) => current.map((item) => item.code === coupon.code ? { ...item, active: !item.active } : item))}>{coupon.active ? "Pause" : "Activate"}</Button></div></div>)}</div>
  </>;
}

function StorefrontPanel() {
  const { banners, setBanners, testimonials, setTestimonials } = useStore();
  const banner = banners[0];
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [quote, setQuote] = useState("");

  function updateBanner(field: "title" | "subtitle", value: string) {
    setBanners((current) => current.map((item, index) => index === 0 ? { ...item, [field]: value } : item));
  }

  function addTestimonial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !quote.trim()) return;
    setTestimonials((current) => [{ id: `review-${Date.now()}`, name: name.trim(), city: city.trim() || "Kolhapur", quote: quote.trim(), rating: 5 }, ...current]);
    setName("");
    setCity("");
    setQuote("");
  }

  return <>
    <PanelHeading title="Storefront" description="Update the homepage message and customer quotes shown in the preview." />
    {banner ? <section className="border-b border-border pb-7"><h3 className="font-display text-2xl">Homepage message</h3><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-xs font-medium">Headline<Input className="mt-2" value={banner.title} onChange={(event) => updateBanner("title", event.target.value)} /></label><label className="text-xs font-medium">Supporting message<Textarea rows={2} className="mt-2" value={banner.subtitle} onChange={(event) => updateBanner("subtitle", event.target.value)} /></label></div></section> : <p className="border-b border-border pb-6 text-sm text-muted-foreground">No homepage banner is set.</p>}
    <section className="pt-7"><h3 className="font-display text-2xl">Customer quotes</h3>
      <form onSubmit={addTestimonial} className="mt-4 grid gap-3 border border-border p-4 sm:grid-cols-3"><label className="text-xs font-medium">Name<Input required className="mt-2" value={name} onChange={(event) => setName(event.target.value)} /></label><label className="text-xs font-medium">City<Input className="mt-2" value={city} onChange={(event) => setCity(event.target.value)} /></label><label className="text-xs font-medium sm:col-span-3">Quote<Textarea required rows={2} className="mt-2" value={quote} onChange={(event) => setQuote(event.target.value)} /></label><Button type="submit" className="w-fit"><Plus size={15} /> Add quote</Button></form>
      <div className="mt-5 divide-y divide-border border-y border-border">{testimonials.map((item) => <div key={item.id} className="flex items-start justify-between gap-4 py-4"><div><p className="text-sm">“{item.quote}”</p><p className="mt-2 text-xs text-muted-foreground">{item.name} · {item.city}</p></div><Button type="button" variant="ghost" size="icon" aria-label={`Remove quote from ${item.name}`} onClick={() => setTestimonials((current) => current.filter((quoteItem) => quoteItem.id !== item.id))}><Trash2 size={15} /></Button></div>)}</div>
    </section>
  </>;
}

function SubscribersPanel() {
  const { subscribers, setSubscribers } = useStore();
  return <>
    <PanelHeading title="Subscribers" description="Addresses collected through the preview newsletter form." />
    {subscribers.length === 0 ? <p className="border-y border-border py-8 text-sm text-muted-foreground">No newsletter sign-ups yet.</p> : <div className="divide-y divide-border border-y border-border">{subscribers.map((subscriber) => <div key={subscriber.id} className="flex items-center justify-between gap-4 py-3"><div><p className="text-sm font-medium">{subscriber.email}</p><p className="mt-1 text-xs text-muted-foreground">Joined {subscriber.date}</p></div><Button type="button" variant="ghost" size="icon" aria-label={`Remove ${subscriber.email}`} onClick={() => setSubscribers((current) => current.filter((item) => item.id !== subscriber.id))}><Trash2 size={15} /></Button></div>)}</div>}
  </>;
}

function SettingsPanel() {
  const { settings, setSettings } = useStore();
  const [draft, setDraft] = useState<StoreSettings>(settings);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSettings(draft);
    setSaved(true);
  }

  return <>
    <PanelHeading title="Store settings" description="Edit the contact details and colour theme shown around the storefront." />
    <form onSubmit={saveSettings} className="grid gap-4 sm:grid-cols-2">
      <label className="text-xs font-medium">Business name<Input required className="mt-2" value={draft.businessName} onChange={(event) => update("businessName", event.target.value)} /></label>
      <label className="text-xs font-medium">Client name<Input className="mt-2" value={draft.clientName} onChange={(event) => update("clientName", event.target.value)} /></label>
      <label className="text-xs font-medium">Phone<Input className="mt-2" value={draft.phone} onChange={(event) => update("phone", event.target.value)} /></label>
      <label className="text-xs font-medium">Email<Input type="email" className="mt-2" value={draft.email} onChange={(event) => update("email", event.target.value)} /></label>
      <label className="text-xs font-medium sm:col-span-2">Address<Textarea rows={3} className="mt-2" value={draft.address} onChange={(event) => update("address", event.target.value)} /></label>
      <label className="text-xs font-medium">Instagram<Input className="mt-2" value={draft.instagram} onChange={(event) => update("instagram", event.target.value)} /></label>
      <label className="text-xs font-medium">Facebook<Input className="mt-2" value={draft.facebook} onChange={(event) => update("facebook", event.target.value)} /></label>
      <label className="text-xs font-medium">Store colour<select className="admin-select mt-2" value={draft.themeColor} onChange={(event) => { if (event.target.value === "rose" || event.target.value === "berry" || event.target.value === "gold") update("themeColor", event.target.value); }}><option value="rose">Rose</option><option value="berry">Berry</option><option value="gold">Gold</option></select></label>
      <div className="flex items-end gap-3"><Button type="submit"><Check size={15} /> Save settings</Button>{saved && <span role="status" className="text-xs text-success">Saved for this preview.</span>}</div>
    </form>
  </>;
}