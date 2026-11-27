import { createFileRoute } from "@tanstack/react-router";

import { ContactPage } from "@/components/storefront/content-pages";
import { pageMeta } from "@/lib/store-utils";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: pageMeta("Contact Sana Cosmetics", "Find Sana Cosmetics in Kolhapur, call the store, or send a preview message.") }),
  component: ContactPage,
});