import { describe, expect, it } from "vitest";
import { orderProducts, products, vendors } from "./Home";

describe("marketplace ordering and vendor metadata", () => {
  it("orders the catalog by popularity without relying on visitor ratings", () => {
    const ordered = orderProducts(products, "popular");
    expect(ordered.map((product) => product.id)).toEqual([1, 4, 12, 3, 9, 6, 2, 5, 7, 10, 8, 11]);
  });

  it("provides a standalone route slug and contact metadata for every vendor", () => {
    expect(vendors).toHaveLength(5);
    vendors.forEach((vendor) => {
      expect(vendor.slug).toMatch(/^[a-z0-9-]+$/);
      expect(vendor.contactEmail).toContain("@");
      expect(products.some((product) => product.vendor === vendor.name)).toBe(true);
    });
  });
});
