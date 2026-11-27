import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/storefront/content-pages";
import { pageMeta } from "@/lib/store-utils";

export const Route = createFileRoute("/shipping")({
  head: () => ({ meta: pageMeta("Shipping information | Sana Cosmetics", "Read the delivery information for the Sana Cosmetics preview storefront.") }),
  component: ShippingPage,
});

function ShippingPage() {
  return <PolicyPage kind="shipping" />;
}