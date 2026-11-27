import { createFileRoute } from "@tanstack/react-router";

import { AdminLoginPage } from "@/components/storefront/admin-pages";
import { pageMeta } from "@/lib/store-utils";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: pageMeta(
      "Demo admin sign in | Sana Cosmetics",
      "Sign in to the demo-only Sana Cosmetics store management area.",
    ),
  }),
  component: AdminLoginPage,
});
