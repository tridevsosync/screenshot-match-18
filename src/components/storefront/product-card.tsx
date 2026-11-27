import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star } from "lucide-react";

import { useStore } from "@/context/store-context";
import { formatINR } from "@/lib/store-utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Product } from "@/data/mock-data";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const saved = wishlist.includes(product.id);
  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  function add() {
    addToCart(product.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  }

  return <article className="product-tile group min-w-0">
    <div className="relative aspect-[4/5] overflow-hidden bg-secondary/60">
      <Link to="/products/$slug" params={{ slug: product.id }} aria-label={`View ${product.name}`} className="block h-full w-full">
        <img src={product.image} alt={product.name} className="product-photo h-full w-full object-cover" loading="lazy" />
      </Link>
      {product.badge && <span className="absolute left-3 top-3 bg-background/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.13em] text-foreground">{product.badge}</span>}
      <Button variant="ghost" size="icon" aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} aria-pressed={saved} onClick={() => toggleWishlist(product.id)} className="absolute right-2 top-2 bg-background/90 hover:bg-background">
        <Heart className={saved ? "fill-primary text-primary" : ""} />
      </Button>
      <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-2 bg-background/95 p-2 transition-transform group-hover:translate-y-0 group-focus-within:translate-y-0">
        <Button type="button" variant="outline" className="flex-1" onClick={() => setQuickViewOpen(true)}>Quick view</Button>
        <Button type="button" variant="default" size="icon" aria-label={`Add ${product.name} to bag`} disabled={product.stock < 1} onClick={add}><ShoppingBag /></Button>
      </div>
    </div>
    <div className="pt-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">{product.brand} <span className="mx-1 text-gold">·</span> {product.category}</p>
      <Link to="/products/$slug" params={{ slug: product.id }} className="mt-1 block min-h-11 text-sm font-medium leading-5 hover:text-primary">{product.name}</Link>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-baseline gap-2"><span className="text-sm font-semibold">{formatINR(product.price)}</span><span className="text-xs text-muted-foreground line-through">{formatINR(product.originalPrice)}</span><span className="text-[10px] font-semibold text-primary">{discount}% off</span></div>
        <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground"><Star size={13} className="fill-gold text-gold" />{product.rating.toFixed(1)}</span>
      </div>
      {added && <p role="status" className="mt-2 text-xs text-success">Added to your bag</p>}
    </div>
    <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="aspect-square overflow-hidden bg-secondary/60"><img src={product.image} alt={product.name} className="h-full w-full object-cover" /></div>
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{product.brand}</p>
            <DialogHeader className="mt-2 text-left"><DialogTitle className="font-display text-3xl">{product.name}</DialogTitle><DialogDescription>{product.category} · {product.reviews} reviews</DialogDescription></DialogHeader>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">{product.description}</p>
            <p className="mt-4 text-xl font-semibold">{formatINR(product.price)} <span className="ml-2 text-sm font-normal text-muted-foreground line-through">{formatINR(product.originalPrice)}</span></p>
            <div className="mt-5 flex gap-2"><Button onClick={add} disabled={product.stock < 1} className="flex-1">Add to bag</Button><Button asChild variant="outline"><Link to="/products/$slug" params={{ slug: product.id }}>View details</Link></Button></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </article>;
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) return <p className="col-span-full py-12 text-center text-sm text-muted-foreground">No products match those filters yet.</p>;
  return <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>;
}

export function RatingStars({ rating }: { rating: number }) {
  return <span className="inline-flex items-center gap-1 text-sm"><Star size={15} className="fill-gold text-gold" />{rating.toFixed(1)}</span>;
}