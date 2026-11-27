import { createFileRoute } from "@tanstack/react-router";

import { FaqPage } from "@/components/storefront/content-pages";
import { pageMeta } from "@/lib/store-utils";

export const Route = createFileRoute("/faqs")({
  head: () => ({ meta: pageMeta("Beauty shopping FAQs | Sana Cosmetics", "Answers about Sana Cosmetics products, salon supplies, demo orders, and payments.") }),
  component: FaqPage,
});