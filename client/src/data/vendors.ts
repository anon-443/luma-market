import { lumaAsset } from "./products";

export type Vendor = {
  id: string;
  name: string;
  logo: string;
  portrait: string;
  slug: string;
  description: string;
  category: string;
  categories: string[];
  products: number;
  totalProducts: number;
  rating: null;
  reviewCount: 0;
  palette: string;
  location: string;
  contactEmail: string;
  websiteLabel: string;
  story: string;
};

export const vendors: Vendor[] = [
  { id: "maison-sora", name: "Maison Sora", logo: "MS", portrait: lumaAsset("/manus-storage/luma-maker-maison-sora_33c0fb90.jpg"), slug: "maison-sora", description: "Small rituals for the table", category: "Ceramics & home", categories: ["Home", "Ceramics"], products: 18, totalProducts: 18, rating: null, reviewCount: 0, palette: "sora", location: "Portland, Oregon", contactEmail: "hello@maisonsora.studio", websiteLabel: "maisonsora.studio", story: "A small ceramics studio making quietly useful vessels for shared meals and slower mornings." },
  { id: "field-theory", name: "Field Theory", logo: "FT", portrait: lumaAsset("/manus-storage/luma-maker-field-theory_81f2f02f.jpg"), slug: "field-theory", description: "Objects that hold a room together", category: "Lighting & furniture", categories: ["Home", "Lighting", "Furniture"], products: 24, totalProducts: 24, rating: null, reviewCount: 0, palette: "field", location: "Brooklyn, New York", contactEmail: "studio@fieldtheory.design", websiteLabel: "fieldtheory.design", story: "Field Theory makes practical room-scale objects with soft geometry, considered metals, and long repairable lives." },
  { id: "onda-goods", name: "Onda Goods", logo: "OG", portrait: lumaAsset("/manus-storage/luma-maker-onda-goods_9a99d087.jpg"), slug: "onda-goods", description: "Useful things with soft edges", category: "Textiles & accessories", categories: ["Accessories", "Textiles", "Home"], products: 31, totalProducts: 31, rating: null, reviewCount: 0, palette: "onda", location: "Los Angeles, California", contactEmail: "hello@ondagoods.studio", websiteLabel: "ondagoods.studio", story: "Onda Goods works with tactile textiles and everyday carry pieces designed to soften the sharper parts of a day." },
  { id: "acoustic-tide", name: "Acoustic Tide", logo: "AT", portrait: lumaAsset("/manus-storage/luma-maker-acoustic-tide_513e825a.jpg"), slug: "acoustic-tide", description: "Better listening, quieter work", category: "Sound & desk objects", categories: ["Tech", "Sound", "Desk"], products: 14, totalProducts: 14, rating: null, reviewCount: 0, palette: "tide", location: "Seattle, Washington", contactEmail: "studio@acoustictide.audio", websiteLabel: "acoustictide.audio", story: "Acoustic Tide builds calm listening tools and desk companions for focused, lower-friction routines." },
  { id: "paper-current", name: "Paper Current", logo: "PC", portrait: lumaAsset("/manus-storage/luma-maker-paper-current_686daf69.jpg"), slug: "paper-current", description: "Paper tools for thinking clearly", category: "Stationery & paper", categories: ["Stationery", "Paper"], products: 22, totalProducts: 22, rating: null, reviewCount: 0, palette: "paper", location: "Chicago, Illinois", contactEmail: "hello@papercurrent.co", websiteLabel: "papercurrent.co", story: "Paper Current makes durable desk stationery that leaves room for plans, notes, lists, and a little drift." },
];
