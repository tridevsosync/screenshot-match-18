import { createFileRoute } from "@tanstack/react-router";

import { CheckoutPage } from "@/components/storefront/shop-pages";
import { pageMeta } from "@/lib/store-utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: pageMeta("Demo checkout | Sana Cosmetics", "Enter delivery details for a preview order. No payment is collected or processed.") }),
  component: CheckoutPage,
});