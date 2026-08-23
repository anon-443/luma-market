import { describe, expect, it } from "vitest";
import { normalizeAISearchResponse } from "./catalog";

describe("normalizeAISearchResponse", () => {
  it("keeps only product IDs that exist in Luma Market's catalog", () => {
    const result = normalizeAISearchResponse('{"productIds":[4,999,1],"shortReason":"Soft listening and warm light."}', "something calm for my desk");
    expect(result).toEqual({ productIds: [4, 1], shortReason: "Soft listening and warm light.", source: "ai" });
  });

  it("uses the deterministic catalog fallback when the AI response is malformed", () => {
    const result = normalizeAISearchResponse("not-json", "a warm lamp for my home office");
    expect(result.source).toBe("catalog");
    expect(result.productIds).toContain(1);
  });
});
