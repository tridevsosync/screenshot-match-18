import { createFileRoute } from "@tanstack/react-router";

import { WishlistPage } from "@/components/storefront/shop-pages";
import { pageMeta } from "@/lib/store-utils";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: pageMeta("Your wishlist | Sana Cosmetics", "Keep your favourite beauty and salon products together in one place.") }),
  component: WishlistPage,
});