export type CatalogProduct = {
  id: number;
  name: string;
  vendor: string;
  category: string;
  description: string;
  inventoryStatus: "inStock" | "lowStock";
  remaining: number;
};

export const PRODUCT_CATALOG: CatalogProduct[] = [
  { id: 1, name: "Lumen Table Lamp", vendor: "Field Theory", category: "Home", description: "A warm dimmable task lamp with a low sculptural profile.", inventoryStatus: "inStock", remaining: 18 },
  { id: 2, name: "Flora Carryall", vendor: "Onda Goods", category: "Accessories", description: "A recycled canvas carryall with a curved handle and interior pocket.", inventoryStatus: "lowStock", remaining: 4 },
  { id: 3, name: "Cloud Ritual Mug", vendor: "Maison Sora", category: "Home", description: "A hand-finished stoneware mug for tea and weekend coffee.", inventoryStatus: "inStock", remaining: 27 },
  { id: 4, name: "Daytrip Headphones", vendor: "Acoustic Tide", category: "Tech", description: "Cushioned wireless over-ear headphones for relaxed listening.", inventoryStatus: "lowStock", remaining: 3 },
  { id: 5, name: "Notion Daily Book", vendor: "Paper Current", category: "Stationery", description: "An undated daily planner for planning and making room for good ideas.", inventoryStatus: "inStock", remaining: 44 },
  { id: 6, name: "Coastline Throw", vendor: "Onda Goods", category: "Home", description: "A generous cotton throw in an irregular oat and coral stripe.", inventoryStatus: "lowStock", remaining: 6 },
  { id: 7, name: "Orbit Alarm Clock", vendor: "Field Theory", category: "Home", description: "A quietly graphic bedside clock with a soft-touch body and gentle alarm.", inventoryStatus: "inStock", remaining: 12 },
  { id: 8, name: "Hush Desk Stand", vendor: "Acoustic Tide", category: "Tech", description: "A low-profile desktop stand for phones and small tablets.", inventoryStatus: "inStock", remaining: 21 },
  { id: 9, name: "Second Sun Scarf", vendor: "Onda Goods", category: "Accessories", description: "A light woven scarf in a sun-washed stripe for in-between seasons.", inventoryStatus: "lowStock", remaining: 5 },
  { id: 10, name: "Marginalia Pen Set", vendor: "Paper Current", category: "Stationery", description: "Four smooth-writing refillable pens in a reusable case.", inventoryStatus: "inStock", remaining: 36 },
  { id: 11, name: "Daylight Pouch", vendor: "Onda Goods", category: "Accessories", description: "A softly structured pouch for small everyday objects.", inventoryStatus: "inStock", remaining: 19 },
  { id: 12, name: "Sunday Serving Tray", vendor: "Maison Sora", category: "Home", description: "A hand-glazed serving tray for fruit, small rituals and slow breakfast gatherings.", inventoryStatus: "inStock", remaining: 14 },
];

export type ProductSearchSuggestion = {
  productIds: number[];
  shortReason: string;
  inventoryNote: string;
  source: "ai" | "catalog";
};

function catalogFallback(query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);
  const matches = PRODUCT_CATALOG.map(product => {
    const searchable = `${product.name} ${product.vendor} ${product.category} ${product.description} ${product.inventoryStatus}`.toLowerCase();
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
    const parsed = JSON.parse(raw) as { productIds?: unknown; shortReason?: unknown; inventoryNote?: unknown };
    const allowedIds = new Set(PRODUCT_CATALOG.map(product => product.id));
    const productIds = Array.isArray(parsed.productIds)
      ? parsed.productIds.filter((id): id is number => typeof id === "number" && allowedIds.has(id)).slice(0, 4)
      : [];
    const shortReason = typeof parsed.shortReason === "string" ? parsed.shortReason.trim().slice(0, 180) : "";
    const inventoryNote = typeof parsed.inventoryNote === "string" ? parsed.inventoryNote.trim().slice(0, 130) : "";

    if (productIds.length) {
      return { productIds, shortReason: shortReason || "Selected for the details in your search.", inventoryNote: inventoryNote || "Availability checked against Luma’s current market inventory.", source: "ai" };
    }
  } catch {
    // A catalog-only fallback keeps the product search usable if a model response is unavailable or malformed.
  }

  return {
    productIds: catalogFallback(query),
    shortReason: "These picks match the words and categories in your search.",
    inventoryNote: "Availability checked against Luma’s current market inventory.",
    source: "catalog",
  };
}
