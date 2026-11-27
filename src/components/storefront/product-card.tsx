import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";

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

  return (
    <article className="product-tile luxury-card group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary/40">
        <Link to="/products/$slug" params={{ slug: product.id }} aria-label={`View ${product.name}`} className="block h-full w-full">
          <img src={product.image} alt={product.name} className="product-photo h-full w-full object-cover" loading="lazy" />
        </Link>
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="rounded-full bg-[#FF4081] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white shadow-xs">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="w-fit rounded-full bg-[#D81B60] px-2.5 py-0.5 text-[9px] font-semibold tracking-wide text-white shadow-xs">
              {discount}% OFF
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={saved}
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-2.5 top-2.5 rounded-full bg-white/90 shadow-xs backdrop-blur-xs hover:bg-white"
        >
          <Heart size={16} className={saved ? "fill-primary text-primary" : "text-foreground/75"} />
        </Button>
        <div className="absolute inset-x-2.5 bottom-2.5 flex translate-y-4 gap-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <Button type="button" variant="secondary" size="sm" className="flex-1 rounded-full bg-white/95 text-xs shadow-sm backdrop-blur-xs hover:bg-white" onClick={() => setQuickViewOpen(true)}>
            <Eye size={14} /> Quick View
          </Button>
          <Button type="button" variant="default" size="icon" className="size-8 rounded-full shadow-sm" aria-label={`Add ${product.name} to bag`} disabled={product.stock < 1} onClick={add}>
            <ShoppingBag size={14} />
          </Button>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/80">
          {product.brand} <span className="mx-1 text-[#FFD700]">·</span> {product.category}
        </p>
        <Link to="/products/$slug" params={{ slug: product.id }} className="mt-1.5 line-clamp-2 min-h-10 text-sm font-medium leading-5 text-foreground transition-colors hover:text-primary">
          {product.name}
        </Link>
        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-base font-semibold text-foreground">{formatINR(product.price)}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>
              )}
            </div>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-secondary/70 px-2 py-0.5 text-xs font-medium text-foreground">
              <Star size={12} className="fill-[#FFD700] text-[#FFD700]" />
              {product.rating.toFixed(1)}
              <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
            </span>
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-2">
            <span className={`text-[11px] font-medium ${product.stock > 0 ? "text-success" : "text-destructive"}`}>
              {product.stock > 0 ? (product.stock < 8 ? `Only ${product.stock} left` : "In Stock") : "Out of Stock"}
            </span>
            <Link to="/products/$slug" params={{ slug: product.id }} className="text-[11px] font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline">
              View Details
            </Link>
          </div>
          {added && <p role="status" className="mt-2 text-xs font-medium text-success">Added to your bag</p>}
        </div>
      </div>
      <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-3xl">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="aspect-square overflow-hidden rounded-xl bg-secondary/50">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">{product.brand}</p>
              <DialogHeader className="mt-2 text-left">
                <DialogTitle className="font-display text-3xl">{product.name}</DialogTitle>
                <DialogDescription>{product.category} · ★ {product.rating.toFixed(1)} ({product.reviews} reviews)</DialogDescription>
              </DialogHeader>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{product.description}</p>
              <p className="mt-4 text-2xl font-semibold">
                {formatINR(product.price)}
                {product.originalPrice > product.price && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground line-through">{formatINR(product.originalPrice)}</span>
                )}
              </p>
              <div className="mt-5 flex gap-2">
                <Button onClick={add} disabled={product.stock < 1} className="flex-1 rounded-full">Add to Bag</Button>
                <Button asChild variant="outline" className="rounded-full"><Link to="/products/$slug" params={{ slug: product.id }}>View Details</Link></Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return <p className="col-span-full rounded-2xl border border-dashed border-border py-14 text-center text-sm text-muted-foreground">No products match those filters yet.</p>;
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {products.map((product) => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}

export function RatingStars({ rating }: { rating: number }) {
  return <span className="inline-flex items-center gap-1 text-sm"><Star size={15} className="fill-[#FFD700] text-[#FFD700]" />{rating.toFixed(1)}</span>;
}
