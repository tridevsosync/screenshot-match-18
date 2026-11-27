import { describe, expect, it } from "vitest";

import { isAdminCredentials } from "@/lib/store-utils";

describe("demo admin access", () => {
  it("accepts the source-defined demo username and password", () => {
    expect(isAdminCredentials("admin", "admin123")).toBe(true);
  });

  it("rejects incorrect demo credentials", () => {
    expect(isAdminCredentials("admin", "wrong-password")).toBe(false);
  });
});