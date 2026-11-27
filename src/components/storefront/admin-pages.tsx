import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  BadgePercent,
  BarChart3,
  Boxes,
  Check,
  ClipboardList,
  Eye,
  Heart,
  LogOut,
  Mail,
  Package,
  Pencil,
  Plus,
  Settings2,
  Sparkles,
  Store,
  Tags,
  Trash2,
  Users,
} from "lucide-react";

import { useStore } from "@/context/store-context";
import { storeImages } from "@/lib/media";
import { formatINR, isAdminCredentials, slugify } from "@/lib/store-utils";
import type { Banner, Coupon, Customer, Order, OrderStatus, Product, StoreSettings, Testimonial } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const statusTone: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Processing: "bg-sky-100 text-sky-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-rose-100 text-rose-800",
};

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
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary/70 via-background to-secondary/50 px-4 py-10">
      <section className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-lg md:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden min-h-[440px] bg-secondary md:block">
          <img src={storeImages.atelier} alt="Sana Cosmetics boutique interior" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-7 text-white">
            <p className="text-[10px] font-semibold tracking-[0.24em] text-[#FFD700]">SANA STUDIO</p>
            <h2 className="mt-2 font-display text-3xl leading-snug">Curate the beauty bar, orders &amp; offers.</h2>
          </div>
        </div>
        <div className="p-7 sm:p-10">
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary">
            <ArrowLeft size={15} /> Back to Sana Cosmetics
          </Link>
          <p className="mt-8 text-[10px] font-semibold tracking-[0.22em] text-primary">DEMO STORE MANAGEMENT</p>
          <h1 className="mt-2 font-display text-4xl">Welcome back.</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Sign in to manage the sample storefront and its demo records.</p>
          <form onSubmit={submit} className="mt-7 space-y-4">
            <label htmlFor="admin-username" className="block text-xs font-medium">Username
              <Input id="admin-username" autoComplete="username" className="mt-2 rounded-xl" value={username} onChange={(event) => setUsername(event.target.value)} required />
            </label>
            <label htmlFor="admin-password" className="block text-xs font-medium">Password
              <Input id="admin-password" type="password" autoComplete="current-password" className="mt-2 rounded-xl" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </label>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" size="lg" className="w-full rounded-full">Sign in</Button>
          </form>
          <p className="mt-6 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">Demo access: <strong className="text-foreground">admin</strong> / <strong className="text-foreground">admin123</strong>. Preview only — no backend authentication.</p>
        </div>
      </section>
    </main>
  );
}

type AdminSection =
  | "Overview"
  | "Products"
  | "Categories & Brands"
  | "Inventory"
  | "Orders"
  | "Customers"
  | "Offers"
  | "Storefront"
  | "Subscribers"
  | "Settings";

const adminSections: Array<{ name: AdminSection; icon: ReactNode }> = [
  { name: "Overview", icon: <BarChart3 size={16} /> },
  { name: "Products", icon: <Package size={16} /> },
  { name: "Categories & Brands", icon: <Tags size={16} /> },
  { name: "Inventory", icon: <Boxes size={16} /> },
  { name: "Orders", icon: <ClipboardList size={16} /> },
  { name: "Customers", icon: <Users size={16} /> },
  { name: "Offers", icon: <BadgePercent size={16} /> },
  { name: "Storefront", icon: <Store size={16} /> },
  { name: "Subscribers", icon: <Mail size={16} /> },
  { name: "Settings", icon: <Settings2 size={16} /> },
];

export function AdminDashboardPage() {
  const { isAdminAuthenticated, setAdminAuthenticated, products, orders, subscribers } = useStore();
  const navigate = useNavigate();
  const [section, setSection] = useState<AdminSection>("Overview");

  useEffect(() => {
    if (!isAdminAuthenticated) void navigate({ to: "/admin/login", replace: true });
  }, [isAdminAuthenticated, navigate]);

  if (!isAdminAuthenticated) return null;

  const lowStockCount = products.filter((p) => p.stock < 8).length;
  const pendingCount = orders.filter((o) => o.status === "Pending").length;

  function badgeFor(name: AdminSection) {
    if (name === "Inventory" && lowStockCount > 0) return lowStockCount;
    if (name === "Orders" && pendingCount > 0) return pendingCount;
    if (name === "Subscribers" && subscribers.length > 0) return subscribers.length;
    return null;
  }

  function signOut() {
    setAdminAuthenticated(false);
    void navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/80 bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="Sana Cosmetics storefront">
            <span className="grid size-10 place-items-center rounded-full border border-primary/30 bg-gradient-to-br from-secondary to-background text-primary shadow-2xs">
              <Heart size={17} />
            </span>
            <span>
              <span className="block font-display text-xl font-semibold">Sana</span>
              <span className="block text-[9px] font-semibold tracking-[0.24em] text-primary">STORE STUDIO</span>
            </span>
          </Link>
          <div className="flex items-center gap-2.5">
            <Button asChild variant="outline" size="sm" className="hidden rounded-full sm:inline-flex">
              <Link to="/"><ArrowLeft size={14} /> View Storefront</Link>
            </Button>
            <Button type="button" variant="default" size="sm" className="rounded-full" onClick={signOut}>
              <LogOut size={14} /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-gradient-to-r from-secondary/60 via-card to-secondary/40 px-6 py-5 shadow-2xs">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.22em] text-primary">
              <Sparkles size={12} className="text-[#FFD700]" /> SANA COSMETICS · ADMIN STUDIO
            </p>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl">Store Management</h1>
          </div>
          <p className="max-w-sm text-xs leading-5 text-muted-foreground">
            Manage catalog, inventory, orders, offers, and storefront content in this live session preview.
          </p>
        </div>

        <div className="grid gap-7 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
          <aside className="h-fit rounded-2xl border border-border bg-card p-2.5 shadow-2xs lg:sticky lg:top-24">
            <nav aria-label="Store management" className="flex gap-1 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
              {adminSections.map((item) => {
                const badge = badgeFor(item.name);
                const active = section === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    aria-current={active ? "page" : undefined}
                    onClick={() => setSection(item.name)}
                    className={`flex shrink-0 items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors lg:w-full ${
                      active ? "bg-primary text-primary-foreground shadow-xs" : "text-foreground/80 hover:bg-secondary/70 hover:text-primary"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">{item.icon}<span>{item.name}</span></span>
                    {badge !== null && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${active ? "bg-white/20 text-white" : "bg-secondary text-primary"}`}>
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>
          <main className="min-w-0">
            {section === "Overview" && <OverviewPanel onNavigate={setSection} />}
            {section === "Products" && <ProductsPanel />}
            {section === "Categories & Brands" && <TaxonomyPanel />}
            {section === "Inventory" && <InventoryPanel />}
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
  return (
    <div className="mb-6 border-b border-border pb-4">
      <h2 className="font-display text-3xl">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function OverviewPanel({ onNavigate }: { onNavigate: (section: AdminSection) => void }) {
  const { products, orders, customers } = useStore();
  const revenue = orders.filter((order) => order.status !== "Cancelled").reduce((sum, order) => sum + order.total, 0);
  const pendingOrders = orders.filter((order) => order.status === "Pending").length;
  const lowStock = products.filter((product) => product.stock < 8).length;
  const stats = [
    { label: "Total Products", value: String(products.length), icon: <Package size={18} />, tone: "bg-pink-100 text-primary" },
    { label: "Total Orders", value: String(orders.length), icon: <ClipboardList size={18} />, tone: "bg-purple-100 text-purple-700" },
    { label: "Revenue", value: formatINR(revenue), icon: <BarChart3 size={18} />, tone: "bg-emerald-100 text-emerald-700" },
    { label: "Customers", value: String(customers.length), icon: <Users size={18} />, tone: "bg-sky-100 text-sky-700" },
    { label: "Low Stock", value: String(lowStock), icon: <AlertTriangle size={18} />, tone: "bg-amber-100 text-amber-700" },
  ];

  return (
    <>
      <PanelHeading title="Overview" description="A clear snapshot of your Sana Cosmetics store activity." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{stat.label}</span>
              <span className={`grid size-9 place-items-center rounded-full ${stat.tone}`}>{stat.icon}</span>
            </div>
            <p className="mt-3 font-display text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl">Recent Orders</h3>
            <Button type="button" variant="link" size="sm" onClick={() => onNavigate("Orders")}>Manage all</Button>
          </div>
          <div className="mt-4 divide-y divide-border text-sm">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-4 py-3.5">
                <div>
                  <p className="font-medium">{order.id} · {order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.date} · {order.payment}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusTone[order.status]}`}>{order.status}</span>
                  <p className="font-semibold">{formatINR(order.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-2xs">
          <h3 className="font-display text-2xl">Quick Attention</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-secondary/45 px-4 py-3">
              <span className="text-muted-foreground">Pending orders</span>
              <strong className="text-primary">{pendingOrders}</strong>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-secondary/45 px-4 py-3">
              <span className="text-muted-foreground">Low-stock items (&lt; 8)</span>
              <strong className="text-primary">{lowStock}</strong>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => onNavigate("Products")}>+ Add Product</Button>
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => onNavigate("Inventory")}>Check Stock</Button>
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => onNavigate("Offers")}>Manage Offers</Button>
            <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => onNavigate("Storefront")}>Edit Banners</Button>
          </div>
        </section>
      </div>
    </>
  );
}

type ProductDraft = Pick<Product, "name" | "category" | "brand" | "price" | "originalPrice" | "stock" | "description">;
const blankProductDraft: ProductDraft = { name: "", category: "Makeup", brand: "Sana Select", price: 0, originalPrice: 0, stock: 0, description: "" };

function ProductsPanel() {
  const { products, setProducts, categories, brands } = useStore();
  const [draft, setDraft] = useState<ProductDraft>(blankProductDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesQuery = !query || `${product.name} ${product.brand}`.toLowerCase().includes(query);
      const matchesCategory = !categoryFilter || product.category === categoryFilter;
      return matchesQuery && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  function beginCreate() {
    setDraft({ ...blankProductDraft, category: categories[0] ?? "Makeup", brand: brands[0] ?? "Sana Select" });
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
      const product: Product = { ...draft, id, badge: "New", image: storeImages.makeup, photos: [storeImages.makeup], rating: 4.5, reviews: 0, ingredients: [], benefits: [], directions: "", isNew: true, isBestSeller: false, isFeatured: false };
      setProducts((current) => [product, ...current]);
    } else if (editingId !== null) {
      setProducts((current) => current.map((product) => (product.id === editingId ? { ...product, ...draft, name: cleanName } : product)));
    }
    setDraft(blankProductDraft);
    setEditingId(null);
    setCreating(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setCreating(false);
  }

  return (
    <>
      <PanelHeading title="Products" description={`${products.length} items in the sample catalog.`} />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <Input placeholder="Search products or brands" aria-label="Search admin products" value={search} onChange={(event) => setSearch(event.target.value)} className="w-56 rounded-full" />
          <select aria-label="Filter by category" className="h-9 rounded-full border border-input bg-background px-4 text-sm" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
        <Button type="button" className="rounded-full px-5" onClick={beginCreate}><Plus size={15} /> Add Product</Button>
      </div>

      {(creating || editingId !== null) && (
        <form onSubmit={saveProduct} className="mb-7 grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-xs sm:grid-cols-2 lg:grid-cols-3">
          <label className="text-xs font-medium">Product name<Input required className="mt-2 rounded-xl" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} /></label>
          <label className="text-xs font-medium">Category<select className="mt-2 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm" value={draft.category} onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
          <label className="text-xs font-medium">Brand<select className="mt-2 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm" value={draft.brand} onChange={(event) => setDraft((current) => ({ ...current, brand: event.target.value }))}>{brands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}</select></label>
          <label className="text-xs font-medium">Price (₹)<Input required type="number" min="0" className="mt-2 rounded-xl" value={draft.price} onChange={(event) => setDraft((current) => ({ ...current, price: Number(event.target.value) }))} /></label>
          <label className="text-xs font-medium">Original price (₹)<Input required type="number" min="0" className="mt-2 rounded-xl" value={draft.originalPrice} onChange={(event) => setDraft((current) => ({ ...current, originalPrice: Number(event.target.value) }))} /></label>
          <label className="text-xs font-medium">Stock<Input required type="number" min="0" className="mt-2 rounded-xl" value={draft.stock} onChange={(event) => setDraft((current) => ({ ...current, stock: Number(event.target.value) }))} /></label>
          <label className="text-xs font-medium sm:col-span-2 lg:col-span-3">Description<Textarea rows={2} className="mt-2 rounded-xl" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} /></label>
          <div className="flex gap-2 sm:col-span-2 lg:col-span-3"><Button type="submit" className="rounded-full px-6"><Check size={15} /> Save Product</Button><Button type="button" variant="outline" className="rounded-full" onClick={cancelEdit}>Cancel</Button></div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-2xs">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-border bg-secondary/35 text-xs text-muted-foreground">
            <tr><th className="px-4 py-3.5 font-medium">Product</th><th className="px-4 py-3.5 font-medium">Category</th><th className="px-4 py-3.5 font-medium">Price</th><th className="px-4 py-3.5 font-medium">Stock</th><th className="px-4 py-3.5 font-medium">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visibleProducts.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-secondary/20">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt="" className="size-12 shrink-0 rounded-xl object-cover" />
                    <span className="min-w-0"><span className="block font-medium">{product.name}</span><span className="text-xs text-muted-foreground">{product.brand}</span></span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-muted-foreground">{product.category}</td>
                <td className="px-4 py-3.5 font-medium">{formatINR(product.price)}</td>
                <td className="px-4 py-3.5">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${product.stock === 0 ? "bg-rose-100 text-rose-800" : product.stock < 8 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={() => beginEdit(product)}>Edit</Button>
                    <Button type="button" variant="ghost" size="icon" className="rounded-full hover:text-destructive" aria-label={`Remove ${product.name}`} onClick={() => setProducts((current) => current.filter((item) => item.id !== product.id))}><Trash2 size={15} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StringListManager({ title, items, onSave, placeholder }: { title: string; items: string[]; onSave: (next: string[]) => void; placeholder: string }) {
  const [newValue, setNewValue] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = newValue.trim();
    if (!clean || items.some((item) => item.toLowerCase() === clean.toLowerCase())) return;
    onSave([...items, clean]);
    setNewValue("");
  }

  function saveEdit(index: number) {
    const clean = editingValue.trim();
    if (!clean) return;
    onSave(items.map((item, i) => (i === index ? clean : item)));
    setEditingIndex(null);
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-2xs">
      <h3 className="font-display text-2xl">{title}</h3>
      <form onSubmit={addItem} className="mt-4 flex gap-2">
        <Input placeholder={placeholder} className="rounded-full" value={newValue} onChange={(event) => setNewValue(event.target.value)} required />
        <Button type="submit" className="rounded-full px-5"><Plus size={15} /> Add</Button>
      </form>
      <div className="mt-4 divide-y divide-border border-t border-border">
        {items.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center justify-between gap-3 py-2.5 text-sm">
            {editingIndex === index ? (
              <div className="flex flex-1 gap-2">
                <Input value={editingValue} onChange={(event) => setEditingValue(event.target.value)} className="h-8 rounded-xl" />
                <Button type="button" size="sm" className="rounded-full" onClick={() => saveEdit(index)}>Save</Button>
                <Button type="button" size="sm" variant="outline" className="rounded-full" onClick={() => setEditingIndex(null)}>Cancel</Button>
              </div>
            ) : (
              <>
                <span className="font-medium">{item}</span>
                <div className="flex gap-1">
                  <Button type="button" variant="ghost" size="icon" className="rounded-full" aria-label={`Edit ${item}`} onClick={() => { setEditingIndex(index); setEditingValue(item); }}><Pencil size={14} /></Button>
                  <Button type="button" variant="ghost" size="icon" className="rounded-full hover:text-destructive" aria-label={`Remove ${item}`} onClick={() => onSave(items.filter((_, i) => i !== index))}><Trash2 size={14} /></Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function TaxonomyPanel() {
  const { categories, setCategories, brands, setBrands } = useStore();
  return (
    <>
      <PanelHeading title="Categories & Brands" description="Add, rename, or remove product categories and brand partners." />
      <div className="grid gap-6 md:grid-cols-2">
        <StringListManager title="Categories" items={categories} onSave={setCategories} placeholder="New category name" />
        <StringListManager title="Brands" items={brands} onSave={setBrands} placeholder="New brand name" />
      </div>
    </>
  );
}

function InventoryPanel() {
  const { products, setProducts } = useStore();
  const lowStockItems = products.filter((product) => product.stock < 8);

  function updateStock(id: string, stock: number) {
    const safeStock = Math.max(0, Math.floor(stock));
    setProducts((current) => current.map((product) => (product.id === id ? { ...product, stock: safeStock } : product)));
  }

  return (
    <>
      <PanelHeading title="Inventory" description="Monitor stock levels and update product quantities." />
      {lowStockItems.length > 0 && (
        <div className="mb-6 rounded-2xl border border-amber-300/70 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="flex items-center gap-2 font-semibold"><AlertTriangle size={16} /> Low stock alerts ({lowStockItems.length})</p>
          <p className="mt-1 text-xs">{lowStockItems.map((item) => `${item.name} (${item.stock})`).join(" · ")}</p>
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-2xs">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-border bg-secondary/35 text-xs text-muted-foreground">
            <tr><th className="px-4 py-3.5 font-medium">Product</th><th className="px-4 py-3.5 font-medium">Status</th><th className="px-4 py-3.5 font-medium">Stock quantity</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-secondary/20">
                <td className="px-4 py-3.5 font-medium">{product.name}<span className="block text-xs font-normal text-muted-foreground">{product.category}</span></td>
                <td className="px-4 py-3.5">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${product.stock === 0 ? "bg-rose-100 text-rose-800" : product.stock < 8 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                    {product.stock === 0 ? "Out of stock" : product.stock < 8 ? "Low stock" : "In stock"}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <Input type="number" min="0" aria-label={`Stock for ${product.name}`} value={product.stock} onChange={(event) => updateStock(product.id, Number(event.target.value))} className="h-8 w-24 rounded-xl" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const orderStatuses: OrderStatus[] = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

function OrdersPanel() {
  const { orders, setOrders } = useStore();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <>
      <PanelHeading title="Orders" description="Inspect sample orders and update their fulfilment status." />
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-2xs">
        <table className="w-full min-w-[740px] text-left text-sm">
          <thead className="border-b border-border bg-secondary/35 text-xs text-muted-foreground">
            <tr><th className="px-4 py-3.5 font-medium">Order</th><th className="px-4 py-3.5 font-medium">Customer</th><th className="px-4 py-3.5 font-medium">Placed</th><th className="px-4 py-3.5 font-medium">Total</th><th className="px-4 py-3.5 font-medium">Status</th><th className="px-4 py-3.5 font-medium">Details</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-secondary/20">
                <td className="px-4 py-3.5 font-medium">{order.id}<span className="mt-1 block text-xs font-normal text-muted-foreground">{order.items.length} items · {order.payment}</span></td>
                <td className="px-4 py-3.5">{order.customer}<span className="mt-1 block text-xs text-muted-foreground">{order.email}</span></td>
                <td className="px-4 py-3.5 text-muted-foreground">{order.date}</td>
                <td className="px-4 py-3.5 font-medium">{formatINR(order.total)}</td>
                <td className="px-4 py-3.5">
                  <select aria-label={`Update status for order ${order.id}`} className="h-9 rounded-full border border-input bg-background px-3 text-xs font-medium" value={order.status} onChange={(event) => { const nextStatus = orderStatuses.find((status) => status === event.target.value); if (nextStatus) setOrders((current) => current.map((item) => (item.id === order.id ? { ...item, status: nextStatus } : item))); }}>
                    {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3.5"><Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={() => setSelectedOrder(order)}><Eye size={14} /> View</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={selectedOrder !== null} onOpenChange={(open) => { if (!open) setSelectedOrder(null); }}>
        <DialogContent className="rounded-2xl">
          {selectedOrder && (
            <>
              <DialogHeader><DialogTitle className="font-display text-2xl">Order {selectedOrder.id}</DialogTitle><DialogDescription>{selectedOrder.date} · {selectedOrder.status} · {selectedOrder.payment}</DialogDescription></DialogHeader>
              <div className="space-y-4 text-sm">
                <div><p className="text-xs font-medium text-muted-foreground">Customer &amp; Shipping</p><p className="mt-1 font-medium">{selectedOrder.customer} ({selectedOrder.mobile})</p><p className="text-muted-foreground">{selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} {selectedOrder.pincode}</p></div>
                <div className="divide-y divide-border border-y border-border">{selectedOrder.items.map((item) => <div key={item.name} className="flex justify-between py-2"><span>{item.name} × {item.quantity}</span><span>{formatINR(item.price * item.quantity)}</span></div>)}</div>
                <div className="flex justify-between font-semibold"><span>Total</span><span>{formatINR(selectedOrder.total)}</span></div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function CustomersPanel() {
  const { customers, orders } = useStore();
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const visibleCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customers;
    return customers.filter((c) => `${c.name} ${c.email} ${c.mobile}`.toLowerCase().includes(query));
  }, [customers, search]);

  return (
    <>
      <PanelHeading title="Customers" description="Sample customer records included with the storefront preview." />
      <div className="mb-4"><Input placeholder="Search customers by name, email, or phone" aria-label="Search customers" value={search} onChange={(event) => setSearch(event.target.value)} className="max-w-sm rounded-full bg-card" /></div>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-2xs">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="border-b border-border bg-secondary/35 text-xs text-muted-foreground">
            <tr><th className="px-4 py-3.5 font-medium">Customer</th><th className="px-4 py-3.5 font-medium">Contact</th><th className="px-4 py-3.5 font-medium">Orders</th><th className="px-4 py-3.5 font-medium">Spent</th><th className="px-4 py-3.5 font-medium">Details</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {visibleCustomers.map((customer) => (
              <tr key={customer.id} className="hover:bg-secondary/20">
                <td className="px-4 py-3.5 font-medium">{customer.name}</td>
                <td className="px-4 py-3.5"><span className="block">{customer.email}</span><span className="text-xs text-muted-foreground">{customer.mobile}</span></td>
                <td className="px-4 py-3.5">{customer.orders}</td>
                <td className="px-4 py-3.5 font-medium">{formatINR(customer.spent)}</td>
                <td className="px-4 py-3.5"><Button type="button" variant="ghost" size="sm" className="rounded-full" onClick={() => setSelectedCustomer(customer)}><Eye size={14} /> View</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={selectedCustomer !== null} onOpenChange={(open) => { if (!open) setSelectedCustomer(null); }}>
        <DialogContent className="rounded-2xl">
          {selectedCustomer && (
            <>
              <DialogHeader><DialogTitle className="font-display text-2xl">{selectedCustomer.name}</DialogTitle><DialogDescription>{selectedCustomer.email} · {selectedCustomer.mobile}</DialogDescription></DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Total orders</span><strong>{selectedCustomer.orders}</strong></div>
                <div className="flex justify-between border-b border-border pb-2"><span className="text-muted-foreground">Total spent</span><strong>{formatINR(selectedCustomer.spent)}</strong></div>
                <div><p className="text-xs font-medium text-muted-foreground">Recent order history</p>{orders.filter((o) => o.email.toLowerCase() === selectedCustomer.email.toLowerCase()).map((o) => <div key={o.id} className="mt-2 flex justify-between text-xs"><span>{o.id} · {o.date}</span><span>{formatINR(o.total)} ({o.status})</span></div>)}</div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function OffersPanel() {
  const { coupons, setCoupons } = useStore();
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(10);
  const [kind, setKind] = useState<Coupon["kind"]>("Percent");
  const [expires, setExpires] = useState("31 Dec 2026");
  const [notice, setNotice] = useState("");

  function addCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode || discount < 1 || coupons.some((coupon) => coupon.code.toUpperCase() === cleanCode)) {
      setNotice("Choose a new code and a discount above zero.");
      return;
    }
    setCoupons((current) => [{ code: cleanCode, discount, kind, active: true, expires: expires.trim() || "No expiry" }, ...current]);
    setCode("");
    setNotice("Offer added to the preview.");
  }

  return (
    <>
      <PanelHeading title="Offers" description="Create sample coupon codes, switch offers on or off, or remove them." />
      <form onSubmit={addCoupon} className="mb-7 grid gap-3 rounded-2xl border border-border bg-card p-5 shadow-2xs sm:grid-cols-[1fr_140px_120px_150px_auto] sm:items-end">
        <label className="text-xs font-medium">New code<Input required className="mt-2 rounded-xl" placeholder="GLOW10" value={code} onChange={(event) => setCode(event.target.value)} /></label>
        <label className="text-xs font-medium">Discount<select className="mt-2 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm" value={kind} onChange={(event) => { if (event.target.value === "Flat" || event.target.value === "Percent") setKind(event.target.value); }}><option value="Percent">Percent</option><option value="Flat">Amount (₹)</option></select></label>
        <label className="text-xs font-medium">Value<Input required type="number" min="1" className="mt-2 rounded-xl" value={discount} onChange={(event) => setDiscount(Number(event.target.value))} /></label>
        <label className="text-xs font-medium">Expires<Input className="mt-2 rounded-xl" value={expires} onChange={(event) => setExpires(event.target.value)} /></label>
        <Button type="submit" className="rounded-full px-5"><Plus size={15} /> Add Offer</Button>
        {notice && <p role="status" className="text-xs text-muted-foreground sm:col-span-5">{notice}</p>}
      </form>
      <div className="divide-y divide-border rounded-2xl border border-border bg-card px-5 shadow-2xs">
        {coupons.map((coupon) => (
          <div key={coupon.code} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="font-medium">{coupon.code}<span className="ml-2 text-xs font-normal text-muted-foreground">{coupon.kind === "Percent" ? `${coupon.discount}% off` : `${formatINR(coupon.discount)} off`}</span></p>
              <p className="mt-1 text-xs text-muted-foreground">{coupon.expires}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${coupon.active ? "bg-emerald-100 text-emerald-800" : "bg-secondary text-muted-foreground"}`}>{coupon.active ? "Active" : "Paused"}</span>
              <Button type="button" variant="outline" size="sm" className="rounded-full" aria-pressed={coupon.active} onClick={() => setCoupons((current) => current.map((item) => (item.code === coupon.code ? { ...item, active: !item.active } : item)))}>{coupon.active ? "Pause" : "Activate"}</Button>
              <Button type="button" variant="ghost" size="icon" className="rounded-full hover:text-destructive" aria-label={`Delete coupon ${coupon.code}`} onClick={() => setCoupons((current) => current.filter((item) => item.code !== coupon.code))}><Trash2 size={15} /></Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function StorefrontPanel() {
  const { banners, setBanners, testimonials, setTestimonials } = useStore();
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [quote, setQuote] = useState("");

  function addBanner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!bannerTitle.trim()) return;
    const next: Banner = { id: `banner-${Date.now()}`, title: bannerTitle.trim(), subtitle: bannerSubtitle.trim(), image: storeImages.hero, active: false };
    setBanners((current) => [...current, next]);
    setBannerTitle("");
    setBannerSubtitle("");
  }

  function saveTestimonial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !quote.trim()) return;
    if (editingTestimonialId) {
      setTestimonials((current) => current.map((item) => (item.id === editingTestimonialId ? { ...item, name: name.trim(), city: city.trim() || "Kolhapur", quote: quote.trim() } : item)));
      setEditingTestimonialId(null);
    } else {
      const next: Testimonial = { id: `review-${Date.now()}`, name: name.trim(), city: city.trim() || "Kolhapur", quote: quote.trim(), rating: 5 };
      setTestimonials((current) => [next, ...current]);
    }
    setName("");
    setCity("");
    setQuote("");
  }

  return (
    <>
      <PanelHeading title="Storefront" description="Manage hero banners and customer quotes shown in the preview." />
      <section className="rounded-2xl border border-border bg-card p-6 shadow-2xs">
        <h3 className="font-display text-2xl">Hero Banners</h3>
        <form onSubmit={addBanner} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-medium">New banner headline<Input required className="mt-2 rounded-xl" value={bannerTitle} onChange={(event) => setBannerTitle(event.target.value)} /></label>
          <label className="text-xs font-medium">Supporting message<Input className="mt-2 rounded-xl" value={bannerSubtitle} onChange={(event) => setBannerSubtitle(event.target.value)} /></label>
          <Button type="submit" className="w-fit rounded-full px-5"><Plus size={15} /> Add Banner</Button>
        </form>
        <div className="mt-5 divide-y divide-border border-t border-border">
          {banners.map((banner) => (
            <div key={banner.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
              <div className="min-w-0 flex-1">
                <Input aria-label={`Banner title ${banner.id}`} value={banner.title} onChange={(event) => setBanners((current) => current.map((b) => (b.id === banner.id ? { ...b, title: event.target.value } : b)))} className="rounded-xl font-medium" />
                <Textarea aria-label={`Banner subtitle ${banner.id}`} rows={2} value={banner.subtitle} onChange={(event) => setBanners((current) => current.map((b) => (b.id === banner.id ? { ...b, subtitle: event.target.value } : b)))} className="mt-2 rounded-xl" />
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant={banner.active ? "default" : "outline"} size="sm" className="rounded-full" onClick={() => setBanners((current) => current.map((b) => ({ ...b, active: b.id === banner.id })))}>{banner.active ? "Active" : "Set active"}</Button>
                {banners.length > 1 && <Button type="button" variant="ghost" size="icon" className="rounded-full hover:text-destructive" aria-label={`Delete banner ${banner.title}`} onClick={() => setBanners((current) => current.filter((b) => b.id !== banner.id))}><Trash2 size={15} /></Button>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-7 rounded-2xl border border-border bg-card p-6 shadow-2xs">
        <h3 className="font-display text-2xl">Customer Quotes</h3>
        <form onSubmit={saveTestimonial} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-xs font-medium">Name<Input required className="mt-2 rounded-xl" value={name} onChange={(event) => setName(event.target.value)} /></label>
          <label className="text-xs font-medium">City<Input className="mt-2 rounded-xl" value={city} onChange={(event) => setCity(event.target.value)} /></label>
          <label className="text-xs font-medium sm:col-span-2">Quote<Textarea required rows={2} className="mt-2 rounded-xl" value={quote} onChange={(event) => setQuote(event.target.value)} /></label>
          <div className="flex gap-2">
            <Button type="submit" className="w-fit rounded-full px-5"><Plus size={15} /> {editingTestimonialId ? "Save Quote" : "Add Quote"}</Button>
            {editingTestimonialId && <Button type="button" variant="outline" className="rounded-full" onClick={() => { setEditingTestimonialId(null); setName(""); setCity(""); setQuote(""); }}>Cancel</Button>}
          </div>
        </form>
        <div className="mt-5 divide-y divide-border border-t border-border">
          {testimonials.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 py-4">
              <div><p className="text-sm">“{item.quote}”</p><p className="mt-2 text-xs text-muted-foreground">{item.name} · {item.city}</p></div>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="icon" className="rounded-full" aria-label={`Edit quote from ${item.name}`} onClick={() => { setEditingTestimonialId(item.id); setName(item.name); setCity(item.city); setQuote(item.quote); }}><Pencil size={15} /></Button>
                <Button type="button" variant="ghost" size="icon" className="rounded-full hover:text-destructive" aria-label={`Remove quote from ${item.name}`} onClick={() => setTestimonials((current) => current.filter((quoteItem) => quoteItem.id !== item.id))}><Trash2 size={15} /></Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function SubscribersPanel() {
  const { subscribers, setSubscribers } = useStore();
  return (
    <>
      <PanelHeading title="Subscribers" description="Addresses collected through the preview newsletter form." />
      {subscribers.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card py-12 text-center text-sm text-muted-foreground">No newsletter sign-ups yet.</div>
      ) : (
        <div className="divide-y divide-border rounded-2xl border border-border bg-card px-5 shadow-2xs">
          {subscribers.map((subscriber) => (
            <div key={subscriber.id} className="flex items-center justify-between gap-4 py-3.5">
              <div><p className="text-sm font-medium">{subscriber.email}</p><p className="mt-1 text-xs text-muted-foreground">Joined {subscriber.date}</p></div>
              <Button type="button" variant="ghost" size="icon" className="rounded-full hover:text-destructive" aria-label={`Remove ${subscriber.email}`} onClick={() => setSubscribers((current) => current.filter((item) => item.id !== subscriber.id))}><Trash2 size={15} /></Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
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

  return (
    <>
      <PanelHeading title="Store Settings" description="Edit the contact details and colour theme shown around the storefront." />
      <form onSubmit={saveSettings} className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-2xs sm:grid-cols-2">
        <label className="text-xs font-medium">Business name<Input required className="mt-2 rounded-xl" value={draft.businessName} onChange={(event) => update("businessName", event.target.value)} /></label>
        <label className="text-xs font-medium">Client name<Input className="mt-2 rounded-xl" value={draft.clientName} onChange={(event) => update("clientName", event.target.value)} /></label>
        <label className="text-xs font-medium">Phone<Input className="mt-2 rounded-xl" value={draft.phone} onChange={(event) => update("phone", event.target.value)} /></label>
        <label className="text-xs font-medium">Email<Input type="email" className="mt-2 rounded-xl" value={draft.email} onChange={(event) => update("email", event.target.value)} /></label>
        <label className="text-xs font-medium sm:col-span-2">Address<Textarea rows={3} className="mt-2 rounded-xl" value={draft.address} onChange={(event) => update("address", event.target.value)} /></label>
        <label className="text-xs font-medium">Instagram<Input className="mt-2 rounded-xl" value={draft.instagram} onChange={(event) => update("instagram", event.target.value)} /></label>
        <label className="text-xs font-medium">Facebook<Input className="mt-2 rounded-xl" value={draft.facebook} onChange={(event) => update("facebook", event.target.value)} /></label>
        <label className="text-xs font-medium">Store colour<select className="mt-2 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm" value={draft.themeColor} onChange={(event) => { if (event.target.value === "rose" || event.target.value === "berry" || event.target.value === "gold") update("themeColor", event.target.value); }}><option value="rose">Rose</option><option value="berry">Berry</option><option value="gold">Gold</option></select></label>
        <div className="flex items-end gap-3"><Button type="submit" className="rounded-full px-6"><Check size={15} /> Save Settings</Button>{saved && <span role="status" className="text-xs font-medium text-success">Saved for this preview.</span>}</div>
      </form>
    </>
  );
}
