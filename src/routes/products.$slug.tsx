import { createFileRoute } from "@tanstack/react-router";

import { ProductDetailsPage } from "@/components/storefront/shop-pages";
import { pageMeta } from "@/lib/store-utils";

export const Route = createFileRoute("/products/$slug")({
  head: () => ({ meta: pageMeta("Product details | Sana Cosmetics", "Explore product details, ingredients, and everyday beauty essentials from Sana Cosmetics.") }),
  component: ProductRoute,
});

function ProductRoute() {
  const { slug } = Route.useParams();
  return <ProductDetailsPage slug={slug} />;
}