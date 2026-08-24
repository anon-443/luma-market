import { describe, expect, it } from "vitest";
import { orderProducts, products, seasonalPalettes, vendors } from "./Home";

describe("marketplace ordering and vendor metadata", () => {
  it("orders the catalog by popularity", () => {
    const ordered = orderProducts(products, "popular");
    expect(ordered.map((product) => product.id)).toEqual([1, 4, 12, 3, 9, 6, 2, 5, 7, 10, 8, 11]);
  });

  it("keeps an unrated catalog deterministic when Top rated is selected", () => {
    const ordered = orderProducts(products, "rating");
    expect(ordered.map((product) => product.id)).toEqual([1, 4, 12, 3, 9, 6, 2, 5, 7, 10, 8, 11]);
  });

  it("offers Gallery linen as the default alongside three seasonal palette alternatives", () => {
    expect(seasonalPalettes.map((palette) => palette.id)).toEqual(["gallery", "cinema", "terracotta", "coastal"]);
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
