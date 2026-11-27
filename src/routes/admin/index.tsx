import { createFileRoute } from "@tanstack/react-router";

import { AdminDashboardPage } from "@/components/storefront/admin-pages";
import { pageMeta } from "@/lib/store-utils";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: pageMeta(
      "Store management | Sana Cosmetics",
      "Manage the Sana Cosmetics demo catalog, orders, offers, and storefront details.",
    ),
  }),
  component: AdminDashboardPage,
});
