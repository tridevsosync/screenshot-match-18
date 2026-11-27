import { createFileRoute } from "@tanstack/react-router";

import { PolicyPage } from "@/components/storefront/content-pages";
import { pageMeta } from "@/lib/store-utils";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: pageMeta("Terms and conditions | Sana Cosmetics", "Read the terms for using this Sana Cosmetics demonstration storefront.") }),
  component: TermsPage,
});

function TermsPage() {
  return <PolicyPage kind="terms" />;
}