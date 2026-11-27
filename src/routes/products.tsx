import { createFileRoute } from "@tanstack/react-router";

import { CatalogPage } from "@/components/storefront/shop-pages";
import { pageMeta } from "@/lib/store-utils";

type ProductsSearch = { category: string; sort: string };

export const Route = createFileRoute("/products")({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    category: typeof search.category === "string" ? search.category : "",
    sort: typeof search.sort === "string" ? search.sort : "",
  }),
  head: () => ({ meta: pageMeta("Shop beauty products | Sana Cosmetics", "Browse makeup, skincare, haircare, fragrance, and professional beauty products from Sana Cosmetics.") }),
  component: ProductsRoute,
});

function ProductsRoute() {
  const { category, sort } = Route.useSearch();
  return <CatalogPage initialCategory={category} initialSort={sort} />;
}