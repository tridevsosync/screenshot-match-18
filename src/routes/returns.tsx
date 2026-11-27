import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/storefront/content-pages";
import { pageMeta } from "@/lib/store-utils";

export const Route = createFileRoute("/returns")({
  head: () => ({ meta: pageMeta("Returns and exchanges | Sana Cosmetics", "Learn how to contact Sana Cosmetics about a product or return enquiry.") }),
  component: ReturnsPage,
});

function ReturnsPage() {
  return <PolicyPage kind="returns" />;
}