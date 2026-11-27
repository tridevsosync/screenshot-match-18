import { createFileRoute } from "@tanstack/react-router";

import { CartPage } from "@/components/storefront/shop-pages";
import { pageMeta } from "@/lib/store-utils";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: pageMeta("Your shopping bag | Sana Cosmetics", "Review your selected beauty and salon products before continuing to the demo checkout.") }),
  component: CartPage,
});