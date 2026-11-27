import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/storefront/content-pages";
import { pageMeta } from "@/lib/store-utils";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: pageMeta("Privacy information | Sana Cosmetics", "Understand how information is handled in the Sana Cosmetics preview storefront.") }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return <PolicyPage kind="privacy" />;
}