export type CatalogProduct = {
  id: number;
  name: string;
  vendor: string;
  category: string;
  description: string;
};

export const PRODUCT_CATALOG: CatalogProduct[] = [
  { id: 1, name: "Lumen Table Lamp", vendor: "Field Theory", category: "Home", description: "A warm dimmable task lamp with a low sculptural profile." },
  { id: 2, name: "Flora Carryall", vendor: "Onda Goods", category: "Accessories", description: "A recycled canvas carryall with a curved handle and interior pocket." },
  { id: 3, name: "Cloud Ritual Mug", vendor: "Maison Sora", category: "Home", description: "A hand-finished stoneware mug for tea and weekend coffee." },
  { id: 4, name: "Daytrip Headphones", vendor: "Acoustic Tide", category: "Tech", description: "Cushioned wireless over-ear headphones for relaxed listening." },
  { id: 5, name: "Notion Daily Book", vendor: "Paper Current", category: "Stationery", description: "An undated daily planner for planning and making room for good ideas." },
  { id: 6, name: "Coastline Throw", vendor: "Onda Goods", category: "Home", description: "A generous cotton throw in an irregular oat and coral stripe." },
];

export type ProductSearchSuggestion = {
  productIds: number[];
  shortReason: string;
  source: "ai" | "catalog";
};

function catalogFallback(query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);
  const matches = PRODUCT_CATALOG.map(product => {
    const searchable = `${product.name} ${product.vendor} ${product.category} ${product.description}`.toLowerCase();
    return { product, score: terms.reduce((total, term) => total + (searchable.includes(term) ? 1 : 0), 0) };
  })
    .filter(item => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 4)
    .map(item => item.product.id);

  return matches.length ? matches : PRODUCT_CATALOG.slice(0, 4).map(product => product.id);
}

export function normalizeAISearchResponse(raw: string, query: string): ProductSearchSuggestion {
  try {
    const parsed = JSON.parse(raw) as { productIds?: unknown; shortReason?: unknown };
    const allowedIds = new Set(PRODUCT_CATALOG.map(product => product.id));
    const productIds = Array.isArray(parsed.productIds)
      ? parsed.productIds.filter((id): id is number => typeof id === "number" && allowedIds.has(id)).slice(0, 4)
      : [];
    const shortReason = typeof parsed.shortReason === "string" ? parsed.shortReason.trim().slice(0, 180) : "";

    if (productIds.length) {
      return { productIds, shortReason: shortReason || "Selected for the details in your search.", source: "ai" };
    }
  } catch {
    // A catalog-only fallback keeps the product search usable if a model response is unavailable or malformed.
  }

  return {
    productIds: catalogFallback(query),
    shortReason: "These picks match the words and categories in your search.",
    source: "catalog",
  };
}
