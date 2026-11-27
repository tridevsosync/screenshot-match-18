import { createFileRoute } from "@tanstack/react-router";

import { AboutPage } from "@/components/storefront/content-pages";
import { pageMeta } from "@/lib/store-utils";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: pageMeta("Our story | Sana Cosmetics", "Meet Sana Cosmetics, a welcoming beauty and professional essentials destination in Kolhapur.") }),
  component: AboutPage,
});