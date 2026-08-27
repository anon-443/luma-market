import { describe, expect, it } from "vitest";
import { areImagesReady, availabilityLabel, completeFirstVisitTour, motionAllowed, nextComparisonIds, nextTourStep, normalizeMotionPreference, orderProducts, products, saveMotionPreference, seasonalPalettes, vendors } from "./Home";

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
});
