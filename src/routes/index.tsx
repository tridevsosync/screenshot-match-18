import { createFileRoute } from "@tanstack/react-router";

import { HomePage } from "@/components/storefront/home-page";
import { pageMeta } from "@/lib/store-utils";

export const Route = createFileRoute("/")({
  head: () => ({ meta: pageMeta("Sana Cosmetics | Beauty, well chosen", "Shop thoughtful beauty, skincare, haircare, and salon essentials from Sana Cosmetics in Kolhapur.") }),
  component: HomePage,
});