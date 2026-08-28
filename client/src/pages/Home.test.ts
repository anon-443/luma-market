import { describe, expect, it } from "vitest";
import { areImagesReady, availabilityLabel, completeFirstVisitTour, createDemoOrderId, createSavedComparisonSet, filterCatalog, motionAllowed, nextComparisonIds, nextTourStep, normalizeMotionPreference, normalizeSavedComparisonSets, orderProducts, products, saveMotionPreference, seasonalPalettes, validateCheckoutDetails, vendors } from "./Home";

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
      expect(vendor.logo).toMatch(/^[A-Z]{2}$/);
      expect(vendor.portrait).toMatch(/\/manus-storage\/luma-maker-/);
    });
  });

  it("uses direct availability labels for current and low stock pieces", () => {
    expect(availabilityLabel(products[0]!)).toBe("18 in stock");
    expect(availabilityLabel(products[1]!)).toBe("Only 4 left");
  });

  it("keeps comparison selections unique and capped at three products", () => {
    expect(nextComparisonIds([1, 2], 3)).toEqual([1, 2, 3]);
    expect(nextComparisonIds([1, 2, 3], 4)).toEqual([1, 2, 3]);
    expect(nextComparisonIds([1, 2, 3], 2)).toEqual([1, 3]);
  });

  it("disables non-essential marketplace motion when reduced motion is requested", () => {
    expect(motionAllowed(false)).toBe(true);
    expect(motionAllowed(true)).toBe(false);
  });

  it("normalizes persisted motion preferences and advances the three-step discovery tour", () => {
    expect(normalizeMotionPreference("soft")).toBe("soft");
    expect(normalizeMotionPreference("still")).toBe("full");
    expect(nextTourStep(0)).toBe(1);
    expect(nextTourStep(2)).toBeNull();
  });

  it("persists accessibility preferences and only completes loading when product images are ready", () => {
    const writes: Record<string, string> = {};
    const storage = { setItem: (key: string, value: string) => { writes[key] = value; } };
    expect(saveMotionPreference(storage, "off")).toBe("off");
    expect(completeFirstVisitTour(storage)).toBeNull();
    expect(writes).toEqual({ "luma-motion-preference": "off", "luma-tour-complete": "true" });
    expect(areImagesReady(2, 3)).toBe(false);
    expect(areImagesReady(3, 3)).toBe(true);
  });

  it("supports a permanent tour dismissal and reusable comparison-set data", () => {
    const writes: Record<string, string> = {};
    const storage = { setItem: (key: string, value: string) => { writes[key] = value; } };
    expect(completeFirstVisitTour(storage, true)).toBeNull();
    expect(writes).toEqual({ "luma-tour-complete": "true", "luma-tour-dismissed": "true" });
    const set = createSavedComparisonSet([1, 2, 2, 99], "Desk choices", "desk", 123);
    expect(set).toEqual({ id: "desk", name: "Desk choices", productIds: [1, 2, 99], createdAt: 123 });
    expect(normalizeSavedComparisonSets([set, { id: "invalid", name: "None", productIds: [] }])).toEqual([{ id: "desk", name: "Desk choices", productIds: [1, 2], createdAt: 123 }]);
  });

  it("keeps reusable static catalog records complete without inventing ratings", () => {
    expect(products).toHaveLength(12);
    products.forEach((product) => {
      expect(product.vendorId).toMatch(/^[a-z0-9-]+$/);
      expect(product.images.length).toBeGreaterThan(0);
      expect(product.specifications.material).toBeTruthy();
      expect(product.rating).toBeNull();
      expect(product.reviewCount).toBe(0);
      expect(product.stock).toBe(product.remaining);
    });
    vendors.forEach((vendor) => {
      expect(vendor.categories.length).toBeGreaterThan(0);
      expect(vendor.totalProducts).toBe(vendor.products);
      expect(vendor.rating).toBeNull();
    });
  });

  it("filters objects and makers using category, price, colour, and text", () => {
    expect(filterCatalog(products, { query: "Maison", category: "All", minPrice: 0, maxPrice: 200 }).map((product) => product.id)).toEqual([3, 12]);
    expect(filterCatalog(products, { category: "Accessories", minPrice: 40, maxPrice: 90, color: "Persimmon" }).map((product) => product.id)).toEqual([2, 9]);
  });

  it("validates required demo checkout details and creates a stable local order ID", () => {
    expect(validateCheckoutDetails({ name: "Jordan" })).toBe("Enter a valid email address");
    expect(validateCheckoutDetails({ name: "Jordan Lee", email: "jordan@example.com", phone: "555", address: "1 Main Street", city: "Portland", postalCode: "97205" })).toBeNull();
    expect(createDemoOrderId(Date.UTC(2026, 7, 28, 0, 0, 0, 123))).toMatch(/^LUMA-20260828-\d{4}$/);
  });
});
