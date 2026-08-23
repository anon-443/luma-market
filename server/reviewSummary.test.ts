import { describe, expect, it } from "vitest";
import { listReviewSummaries } from "./db";

describe("listReviewSummaries", () => {
  it("returns a safe array for rating-aware product discovery without creating review data", async () => {
    const summaries = await listReviewSummaries();

    expect(Array.isArray(summaries)).toBe(true);
    summaries.forEach(summary => {
      expect(summary.productId).toEqual(expect.any(Number));
      expect(summary.reviewCount).toEqual(expect.any(Number));
      expect(summary.averageRating).toEqual(expect.any(Number));
    });
  });
});
