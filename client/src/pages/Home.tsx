/**
 * Solstice Arcade design reminder: make discovery feel like a lively editorial market promenade.
 * Use asymmetric sections, Luma Saffron price stickers, spectral arches, and tactile 160–260ms motion.
 */
import { useEffect, useMemo, useState } from "react";
import type { FormEvent, KeyboardEvent, TouchEvent } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Eye,
  Expand,
  Heart,
  LampDesk,
  Loader2,
  Menu,
  Mic,
  MicOff,
  Minus,
  Moon,
  Package,
  Plus,
  Search,
  Share2,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  X,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";

type Product = {
  id: number;
  name: string;
  vendor: string;
  category: string;
  price: number;
  color: string;
  imageClass: string;
  image: string;
  imagePosition?: string;
  description: string;
  specs: string[];
  Icon: LucideIcon;
  badge?: string;
  inventoryStatus: "inStock" | "lowStock";
  remaining: number;
};

type CartLine = Product & { quantity: number };
type VisitorReview = { id: number; authorName: string; rating: number; comment: string; createdAt: Date | string };
type GalleryImage = { src: string; alt: string; position?: string };
type PastOrder = { id: string; createdAt: number; itemCount: number; total: number; items: Array<{ id: number; quantity: number }> };
type WebSpeechEvent = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
type WebSpeechRecognition = { continuous: boolean; interimResults: boolean; lang: string; start: () => void; onresult: ((event: WebSpeechEvent) => void) | null; onerror: (() => void) | null; onend: (() => void) | null };
type WebSpeechConstructor = new () => WebSpeechRecognition;

const products: Product[] = [
  {
    id: 1,
    name: "Lumen Table Lamp",
    vendor: "Field Theory",
    category: "Home",
    price: 128,
    color: "Brushed brass",
    imageClass: "lamp",
    image: "/manus-storage/luma-product-objects_5f2f2446.jpg",
    imagePosition: "80% 40%",
    description: "A warm, dimmable task lamp with a low, sculptural profile for corners that need a softer idea of light.",
    specs: ["Aluminium & steel", "Warm LED, 2700K", "2-year maker warranty"],
    Icon: LampDesk,
    badge: "Just landed",
    inventoryStatus: "inStock",
    remaining: 18,
  },
  {
    id: 2,
    name: "Flora Carryall",
    vendor: "Onda Goods",
    category: "Accessories",
    price: 86,
    color: "Persimmon",
    imageClass: "tote",
    image: "/manus-storage/luma-product-accessory_fcbbe62f.jpg",
    imagePosition: "center",
    description: "An everyday carryall cut from sturdy recycled canvas, finished with a relaxed curved handle and interior pocket.",
    specs: ["Recycled canvas", "Magnetic closure", "Interior pocket"],
    Icon: ShoppingBag,
    badge: "Small batch",
    inventoryStatus: "lowStock",
    remaining: 4,
  },
  {
    id: 3,
    name: "Cloud Ritual Mug",
    vendor: "Maison Sora",
    category: "Home",
    price: 34,
    color: "Cobalt glaze",
    imageClass: "mug",
    image: "/manus-storage/luma-product-ceramic_6dbcb79f.jpg",
    imagePosition: "center 34%",
    description: "A hand-finished stoneware mug with a generous curve, designed for unhurried tea and ample weekend coffee.",
    specs: ["Stoneware", "350 ml capacity", "Dishwasher safe"],
    Icon: Sparkles,
    inventoryStatus: "inStock",
    remaining: 27,
  },
  {
    id: 4,
    name: "Daytrip Headphones",
    vendor: "Acoustic Tide",
    category: "Tech",
    price: 164,
    color: "Sage grey",
    imageClass: "headphones",
    image: "/manus-storage/luma-product-knit_22081181.webp",
    imagePosition: "center",
    description: "Cushioned over-ear headphones engineered for low-friction listening and a gentle, balanced sound profile.",
    specs: ["30-hour battery", "Wireless Bluetooth", "Soft vegan leather"],
    Icon: CircleUserRound,
    badge: "Editor’s pick",
    inventoryStatus: "lowStock",
    remaining: 3,
  },
  {
    id: 5,
    name: "Notion Daily Book",
    vendor: "Paper Current",
    category: "Stationery",
    price: 24,
    color: "Ink blue",
    imageClass: "book",
    image: "/manus-storage/luma-product-objects_5f2f2446.jpg",
    imagePosition: "13% 62%",
    description: "An undated daily book with prompts for planning, remembering and making slightly more room for good ideas.",
    specs: ["176 recycled pages", "Lay-flat binding", "A5 format"],
    Icon: Package,
    inventoryStatus: "inStock",
    remaining: 44,
  },
  {
    id: 6,
    name: "Coastline Throw",
    vendor: "Onda Goods",
    category: "Home",
    price: 92,
    color: "Oat & coral",
    imageClass: "throw",
    image: "/manus-storage/luma-product-knit_22081181.webp",
    imagePosition: "73% 58%",
    description: "A generous cotton throw woven in an irregular stripe with a weighted, lived-in feel from day one.",
    specs: ["100% cotton", "130 × 180 cm", "Machine washable"],
    Icon: Heart,
    inventoryStatus: "lowStock",
    remaining: 6,
  },
  {
    id: 7,
    name: "Orbit Alarm Clock",
    vendor: "Field Theory",
    category: "Home",
    price: 72,
    color: "Sage grey",
    imageClass: "clock",
    image: "/manus-storage/luma-product-accessory_fcbbe62f.jpg",
    imagePosition: "16% 44%",
    description: "A quietly graphic bedside clock with a soft-touch body, clear face and gentle alarm for more considered mornings.",
    specs: ["Silent sweep movement", "Battery powered", "Soft-touch finish"],
    Icon: Package,
    badge: "New studio",
    inventoryStatus: "inStock",
    remaining: 12,
  },
  {
    id: 8,
    name: "Hush Desk Stand",
    vendor: "Acoustic Tide",
    category: "Tech",
    price: 58,
    color: "Brushed brass",
    imageClass: "stand",
    image: "/manus-storage/luma-product-objects_5f2f2446.jpg",
    imagePosition: "55% 34%",
    description: "A low-profile desktop stand that gives phones and small tablets an easier, more intentional place to land.",
    specs: ["Powder-coated steel", "Non-slip cork base", "Fits devices up to 13 in"],
    Icon: CircleUserRound,
    inventoryStatus: "inStock",
    remaining: 21,
  },
  {
    id: 9,
    name: "Second Sun Scarf",
    vendor: "Onda Goods",
    category: "Accessories",
    price: 48,
    color: "Persimmon",
    imageClass: "scarf",
    image: "/manus-storage/luma-product-knit_22081181.webp",
    imagePosition: "43% 48%",
    description: "A light, generous scarf woven with a sun-washed stripe and a clean edge for the in-between seasons.",
    specs: ["Organic cotton blend", "Hand-finished edge", "One-size wrap"],
    Icon: Heart,
    badge: "Small batch",
    inventoryStatus: "lowStock",
    remaining: 5,
  },
  {
    id: 10,
    name: "Marginalia Pen Set",
    vendor: "Paper Current",
    category: "Stationery",
    price: 32,
    color: "Ink blue",
    imageClass: "pens",
    image: "/manus-storage/luma-product-objects_5f2f2446.jpg",
    imagePosition: "33% 65%",
    description: "Four smooth-writing pens in a small reusable case, assembled for lists, margins, and long-note days.",
    specs: ["0.5 mm gel ink", "Refillable cartridges", "Four considered colours"],
    Icon: Package,
    inventoryStatus: "inStock",
    remaining: 36,
  },
  {
    id: 11,
    name: "Daylight Pouch",
    vendor: "Onda Goods",
    category: "Accessories",
    price: 26,
    color: "Oat & coral",
    imageClass: "pouch",
    image: "/manus-storage/luma-product-accessory_fcbbe62f.jpg",
    imagePosition: "82% 61%",
    description: "A softly structured pouch for the little objects that otherwise disappear at the bottom of a larger bag.",
    specs: ["Recycled nylon shell", "Water-resistant lining", "Zip closure"],
    Icon: ShoppingBag,
    inventoryStatus: "inStock",
    remaining: 19,
  },
  {
    id: 12,
    name: "Sunday Serving Tray",
    vendor: "Maison Sora",
    category: "Home",
    price: 68,
    color: "Cobalt glaze",
    imageClass: "tray",
    image: "/manus-storage/luma-product-ceramic_6dbcb79f.jpg",
    imagePosition: "62% 52%",
    description: "A hand-glazed serving tray with a fluid edge, made for fruit, small rituals and slow breakfast gatherings.",
    specs: ["Hand-glazed stoneware", "Food safe", "28 cm diameter"],
    Icon: Sparkles,
    badge: "Maker’s choice",
    inventoryStatus: "inStock",
    remaining: 14,
  },
];

const productGallery: Record<number, GalleryImage[]> = {
  1: [{ src: "/manus-storage/luma-product-objects_5f2f2446.jpg", alt: "Lumen Table Lamp front view", position: "80% 40%" }, { src: "/manus-storage/luma-product-accessory_fcbbe62f.jpg", alt: "Lumen Table Lamp material detail", position: "18% 50%" }, { src: "/manus-storage/luma-product-knit_22081181.webp", alt: "Lumen Table Lamp styled room view", position: "64% 50%" }],
  2: [{ src: "/manus-storage/luma-product-accessory_fcbbe62f.jpg", alt: "Flora Carryall product view", position: "center" }, { src: "/manus-storage/luma-product-knit_22081181.webp", alt: "Flora Carryall textile detail", position: "70% 56%" }, { src: "/manus-storage/luma-product-objects_5f2f2446.jpg", alt: "Flora Carryall styled context", position: "84% 44%" }],
  3: [{ src: "/manus-storage/luma-product-ceramic_6dbcb79f.jpg", alt: "Cloud Ritual Mug ceramic view", position: "center 34%" }, { src: "/manus-storage/luma-product-objects_5f2f2446.jpg", alt: "Cloud Ritual Mug material detail", position: "18% 66%" }, { src: "/manus-storage/luma-product-knit_22081181.webp", alt: "Cloud Ritual Mug table setting", position: "40% 52%" }],
  4: [{ src: "/manus-storage/luma-product-knit_22081181.webp", alt: "Daytrip Headphones product view", position: "center" }, { src: "/manus-storage/luma-product-objects_5f2f2446.jpg", alt: "Daytrip Headphones desk setup", position: "76% 36%" }, { src: "/manus-storage/luma-product-accessory_fcbbe62f.jpg", alt: "Daytrip Headphones colour detail", position: "20% 55%" }],
  5: [{ src: "/manus-storage/luma-product-objects_5f2f2446.jpg", alt: "Notion Daily Book cover view", position: "13% 62%" }, { src: "/manus-storage/luma-product-knit_22081181.webp", alt: "Notion Daily Book paper detail", position: "64% 56%" }, { src: "/manus-storage/luma-product-accessory_fcbbe62f.jpg", alt: "Notion Daily Book desk context", position: "48% 54%" }],
  6: [{ src: "/manus-storage/luma-product-knit_22081181.webp", alt: "Coastline Throw woven texture", position: "73% 58%" }, { src: "/manus-storage/luma-product-accessory_fcbbe62f.jpg", alt: "Coastline Throw colour detail", position: "68% 50%" }, { src: "/manus-storage/luma-product-objects_5f2f2446.jpg", alt: "Coastline Throw living space", position: "94% 46%" }],
  7: [{ src: "/manus-storage/luma-product-accessory_fcbbe62f.jpg", alt: "Orbit Alarm Clock front view", position: "16% 44%" }, { src: "/manus-storage/luma-product-objects_5f2f2446.jpg", alt: "Orbit Alarm Clock material detail", position: "55% 34%" }, { src: "/manus-storage/luma-product-knit_22081181.webp", alt: "Orbit Alarm Clock bedside context", position: "40% 58%" }],
  8: [{ src: "/manus-storage/luma-product-objects_5f2f2446.jpg", alt: "Hush Desk Stand front view", position: "55% 34%" }, { src: "/manus-storage/luma-product-accessory_fcbbe62f.jpg", alt: "Hush Desk Stand texture detail", position: "25% 50%" }, { src: "/manus-storage/luma-product-knit_22081181.webp", alt: "Hush Desk Stand work setting", position: "75% 48%" }],
  9: [{ src: "/manus-storage/luma-product-knit_22081181.webp", alt: "Second Sun Scarf woven view", position: "43% 48%" }, { src: "/manus-storage/luma-product-accessory_fcbbe62f.jpg", alt: "Second Sun Scarf colour detail", position: "65% 48%" }, { src: "/manus-storage/luma-product-objects_5f2f2446.jpg", alt: "Second Sun Scarf styled context", position: "82% 45%" }],
  10: [{ src: "/manus-storage/luma-product-objects_5f2f2446.jpg", alt: "Marginalia Pen Set view", position: "33% 65%" }, { src: "/manus-storage/luma-product-accessory_fcbbe62f.jpg", alt: "Marginalia Pen Set detail", position: "20% 55%" }, { src: "/manus-storage/luma-product-knit_22081181.webp", alt: "Marginalia Pen Set writing context", position: "58% 54%" }],
  11: [{ src: "/manus-storage/luma-product-accessory_fcbbe62f.jpg", alt: "Daylight Pouch product view", position: "82% 61%" }, { src: "/manus-storage/luma-product-knit_22081181.webp", alt: "Daylight Pouch textile detail", position: "62% 57%" }, { src: "/manus-storage/luma-product-objects_5f2f2446.jpg", alt: "Daylight Pouch desk setting", position: "18% 56%" }],
  12: [{ src: "/manus-storage/luma-product-ceramic_6dbcb79f.jpg", alt: "Sunday Serving Tray view", position: "62% 52%" }, { src: "/manus-storage/luma-product-objects_5f2f2446.jpg", alt: "Sunday Serving Tray glaze detail", position: "43% 54%" }, { src: "/manus-storage/luma-product-knit_22081181.webp", alt: "Sunday Serving Tray table context", position: "30% 48%" }],
};

const vendors = [
  { name: "Maison Sora", description: "Small rituals for the table", category: "Ceramics & home", products: 18, palette: "sora" },
  { name: "Field Theory", description: "Objects that hold a room together", category: "Lighting & furniture", products: 24, palette: "field" },
  { name: "Onda Goods", description: "Useful things with soft edges", category: "Textiles & accessories", products: 31, palette: "onda" },
];

const categories = ["All", "Home", "Accessories", "Tech", "Stationery"];
const colorSwatches = [
  { value: "Brushed brass", color: "#b18543" },
  { value: "Persimmon", color: "#df704d" },
  { value: "Cobalt glaze", color: "#284783" },
  { value: "Sage grey", color: "#9eafa3" },
  { value: "Ink blue", color: "#263d77" },
  { value: "Oat & coral", color: "#d8c3a1" },
];

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function ProductVisual({ product }: { product: Product }) {
  const { Icon } = product;
  const gallery = productGallery[product.id] ?? [{ src: product.image, alt: product.name, position: product.imagePosition }];
  const secondary = gallery[1] ?? gallery[0];
  return (
    <div className={`product-visual ${product.imageClass}`} aria-label={`${product.name} product artwork`}>
      <img className="product-photo" src={product.image} style={{ objectPosition: product.imagePosition }} alt="" />
      <img className="product-photo product-photo-secondary" src={secondary.src} style={{ objectPosition: secondary.position }} alt="" />
      <div className="photo-vignette" />
      <div className="visual-orbit" />
      <span className="product-icon-badge"><Icon aria-hidden="true" /></span>
      <span className="visual-shadow" />
    </div>
  );
}

function ProductGallery({ product, onOpenLightbox }: { product: Product; onOpenLightbox: (index: number) => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const gallery = productGallery[product.id] ?? [{ src: product.image, alt: product.name, position: product.imagePosition }];
  const activeImage = gallery[activeIndex] ?? gallery[0];

  useEffect(() => { setActiveIndex(0); setZoomed(false); }, [product.id]);

  return <div className="product-gallery"><button className="gallery-stage" onClick={() => onOpenLightbox(activeIndex)} onMouseMove={(event) => { const box = event.currentTarget.getBoundingClientRect(); setOrigin(`${((event.clientX - box.left) / box.width) * 100}% ${((event.clientY - box.top) / box.height) * 100}%`); }} onMouseEnter={() => setZoomed(true)} onMouseLeave={() => setZoomed(false)} aria-label={`Open ${product.name} image ${activeIndex + 1} in lightbox`}><img src={activeImage.src} alt={activeImage.alt} style={{ objectPosition: activeImage.position, transformOrigin: origin, transform: zoomed ? "scale(1.34)" : "scale(1)" }} /><span className="gallery-enlarge"><Expand size={16} /> Click to inspect</span></button><div className="gallery-thumbnails" aria-label={`${product.name} image views`}>{gallery.map((image, index) => <button key={`${image.src}-${index}`} className={index === activeIndex ? "selected" : ""} onClick={() => setActiveIndex(index)} aria-label={`Show ${product.name} image ${index + 1}`}><img src={image.src} alt="" style={{ objectPosition: image.position }} /></button>)}</div></div>;
}

function ImageLightbox({ product, imageIndex, onClose }: { product: Product; imageIndex: number; onClose: () => void }) {
  const gallery = productGallery[product.id] ?? [{ src: product.image, alt: product.name, position: product.imagePosition }];
  const [activeIndex, setActiveIndex] = useState(imageIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [gesture, setGesture] = useState<{ mode: "drag" | "pinch"; startX: number; startY: number; startPan: { x: number; y: number }; startDistance?: number; startZoom: number } | null>(null);
  const image = gallery[activeIndex] ?? gallery[0];
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  const changeImage = (direction: number) => { setActiveIndex((current) => (current + direction + gallery.length) % gallery.length); resetView(); };
  const distance = (first: { clientX: number; clientY: number }, second: { clientX: number; clientY: number }) => Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const first = event.touches[0];
    if (!first) return;
    if (event.touches.length === 2 && event.touches[1]) { setGesture({ mode: "pinch", startX: 0, startY: 0, startPan: pan, startDistance: distance(first, event.touches[1]), startZoom: zoom }); return; }
    if (zoom > 1) setGesture({ mode: "drag", startX: first.clientX, startY: first.clientY, startPan: pan, startZoom: zoom });
  };
  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (!gesture) return;
    const first = event.touches[0];
    if (!first) return;
    event.preventDefault();
    if (gesture.mode === "pinch" && event.touches[1] && gesture.startDistance) {
      const nextZoom = Math.min(2.8, Math.max(1, gesture.startZoom * (distance(first, event.touches[1]) / gesture.startDistance)));
      setZoom(nextZoom);
      if (nextZoom === 1) setPan({ x: 0, y: 0 });
      return;
    }
    if (gesture.mode === "drag") setPan({ x: Math.max(-170, Math.min(170, gesture.startPan.x + first.clientX - gesture.startX)), y: Math.max(-170, Math.min(170, gesture.startPan.y + first.clientY - gesture.startY)) });
  };

  return <div className="lightbox-overlay" role="presentation" onMouseDown={onClose}><section className="image-lightbox" role="dialog" aria-modal="true" aria-label={`${product.name} image gallery`} onMouseDown={(event) => event.stopPropagation()}><button className="lightbox-close" onClick={onClose} aria-label="Close image lightbox"><X size={22} /></button><div className="lightbox-image-wrap" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => setGesture(null)} onTouchCancel={() => setGesture(null)}><img src={image.src} alt={image.alt} style={{ objectPosition: image.position, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }} /></div><div className="lightbox-footer"><div className="lightbox-controls"><button onClick={() => { setZoom((value) => Math.max(1, value - 0.3)); if (zoom <= 1.3) setPan({ x: 0, y: 0 }); }} disabled={zoom <= 1} aria-label="Zoom out"><ZoomOut size={18} /></button><span>{Math.round(zoom * 100)}%</span><button onClick={() => setZoom((value) => Math.min(2.8, value + 0.3))} disabled={zoom >= 2.8} aria-label="Zoom in"><ZoomIn size={18} /></button></div><p>{activeIndex + 1} / {gallery.length} · {product.name}<small>Pinch to zoom · drag to pan</small></p><div className="lightbox-controls"><button onClick={() => changeImage(-1)} aria-label="Previous image"><ChevronLeft size={18} /></button><button onClick={() => changeImage(1)} aria-label="Next image"><ChevronRight size={18} /></button></div></div></section></div>;
}

function ProductReviews({ product }: { product: Product }) {
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const reviewsQuery = trpc.reviews.list.useQuery({ productId: product.id });
  const reviewSummaryQuery = trpc.reviews.summarize.useQuery({ productId: product.id }, { staleTime: 10 * 60 * 1000 });
  const createReview = trpc.reviews.create.useMutation({
    onSuccess: async () => {
      setAuthorName("");
      setRating(0);
      setComment("");
      await reviewsQuery.refetch();
      await reviewSummaryQuery.refetch();
      toast.success("Your review is now part of this product’s visitor notes");
    },
    onError: (error) => toast.error(error.message || "We couldn’t save that review just yet"),
  });
  const reviews = (reviewsQuery.data ?? []) as VisitorReview[];

  return (
    <section className="reviews-panel" aria-labelledby={`reviews-${product.id}`}>
      <div className="review-heading"><div><p className="eyebrow"><span /> VISITOR NOTES</p><h4 id={`reviews-${product.id}`}>Your take matters</h4></div><span>{reviews.length} note{reviews.length === 1 ? "" : "s"}</span></div>
      <section className="review-summary" aria-label="AI review themes"><div><Sparkles size={16} /><strong>AI review themes</strong><span>Built only from visitor notes</span></div>{reviewSummaryQuery.isLoading && reviews.length > 0 && <p>Reading submitted themes…</p>}{reviewSummaryQuery.data?.status === "empty" && <p>No notes yet — no themes to summarize</p>}{reviewSummaryQuery.data?.status === "unavailable" && <p>Visitor notes are here but themes are temporarily unavailable</p>}{reviewSummaryQuery.data?.status === "ready" && <div className="theme-columns"><div><b>Often appreciated</b>{reviewSummaryQuery.data.positives.length ? <ul>{reviewSummaryQuery.data.positives.map((item) => <li key={item}><Check size={13} />{item}</li>)}</ul> : <p>No repeated praise is clear yet</p>}</div><div><b>Worth noting</b>{reviewSummaryQuery.data.considerations.length ? <ul>{reviewSummaryQuery.data.considerations.map((item) => <li key={item}><span>–</span>{item}</li>)}</ul> : <p>No recurring concerns are clear yet</p>}</div></div>}</section>
      <div className="review-list">
        {reviewsQuery.isLoading && <p className="review-status">Finding recent notes…</p>}
        {!reviewsQuery.isLoading && !reviews.length && <p className="review-status">No visitor notes yet — be the first to share a considered take</p>}
        {reviews.map((review) => <article className="review-comment" key={review.id}><div><strong>{review.authorName}</strong><span className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{Array.from({ length: 5 }, (_, index) => <Star key={index} size={13} fill={index < review.rating ? "currentColor" : "transparent"} />)}</span></div><p>{review.comment}</p></article>)}
      </div>
      <form className="review-form" onSubmit={(event) => { event.preventDefault(); if (!rating) { toast.info("Choose a star rating before sharing your note"); return; } createReview.mutate({ productId: product.id, authorName, rating, comment }); }}>
        <label>Your name<input required value={authorName} maxLength={80} onChange={(event) => setAuthorName(event.target.value)} placeholder="Name for your note" /></label>
        <fieldset><legend>Your rating</legend><div className="rating-picker" role="radiogroup" aria-label="Choose a rating from 1 to 5 stars">{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} onClick={() => setRating(value)} aria-label={`${value} star${value === 1 ? "" : "s"}`} aria-pressed={rating === value}><Star size={21} fill={value <= rating ? "currentColor" : "transparent"} /></button>)}</div></fieldset>
        <label>Your note<textarea required value={comment} minLength={4} maxLength={1000} onChange={(event) => setComment(event.target.value)} placeholder="What stood out when you used it?" rows={3} /></label>
        <button className="review-submit" type="submit" disabled={createReview.isPending}>{createReview.isPending ? "Saving your note…" : "Share your note"}<ArrowRight size={16} /></button>
      </form>
    </section>
  );
}

function RelatedProducts({ product, onSelect, onAddToCart, searchHistory, wishlist }: { product: Product; onSelect: (product: Product) => void; onAddToCart: (product: Product) => void; searchHistory: string[]; wishlist: number[] }) {
  const intentTerms = searchHistory.join(" ").toLowerCase().split(/\s+/).filter((term) => term.length > 2);
  const savedSignals = products.filter((item) => wishlist.includes(item.id));
  const related = products.filter((candidate) => candidate.id !== product.id).sort((left, right) => {
    const score = (candidate: Product) => {
      const searchable = `${candidate.name} ${candidate.vendor} ${candidate.category} ${candidate.description}`.toLowerCase();
      const historyScore = intentTerms.reduce((total, term) => total + Number(searchable.includes(term)), 0);
      const savedScore = savedSignals.reduce((total, saved) => total + Number(candidate.category === saved.category) * 2 + Number(candidate.vendor === saved.vendor), 0);
      return Number(candidate.category === product.category) * 2 + Number(candidate.vendor === product.vendor) + historyScore + savedScore;
    };
    return score(right) - score(left) || left.id - right.id;
  }).slice(0, 2);

  return <section className="related-products" aria-labelledby={`related-${product.id}`}><div className="related-heading"><div><p className="eyebrow"><span /> FOR YOUR MARKET TRAIL</p><h4 id={`related-${product.id}`}>You may also like</h4></div><Sparkles size={18} /></div><p className="related-rationale">Matched from this find, your recent searches, and saved pieces</p><div className="related-grid">{related.map((item) => <article key={item.id}><button className="related-image" onClick={() => onSelect(item)} aria-label={`View ${item.name}`}><img src={item.image} alt="" style={{ objectPosition: item.imagePosition }} /></button><div><button onClick={() => onSelect(item)}>{item.name}</button><p>{item.vendor}</p><strong>{money.format(item.price)}</strong><button className="related-add" onClick={() => onAddToCart(item)} aria-label={`Add ${item.name} to cart`}><Plus size={14} /></button></div></article>)}</div></section>;
}

function QuickViewModal({ product, onClose, onAddToCart, onViewDetails }: { product: Product; onClose: () => void; onAddToCart: (product: Product) => void; onViewDetails: (product: Product) => void }) {
  const [isLeaving, setIsLeaving] = useState(false);
  const closeWithMotion = (afterClose?: () => void) => {
    setIsLeaving(true);
    window.setTimeout(() => { onClose(); afterClose?.(); }, 180);
  };
  return <div className={`overlay quick-view-overlay ${isLeaving ? "is-leaving" : ""}`} role="presentation" onMouseDown={() => closeWithMotion()}><section className="quick-view-modal" role="dialog" aria-modal="true" aria-label={`Quick view: ${product.name}`} onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => closeWithMotion()} aria-label="Close quick view"><X size={20} /></button><div className="quick-view-image"><img src={product.image} alt={product.name} style={{ objectPosition: product.imagePosition }} /><span className={`stock-note ${product.inventoryStatus}`}>{product.inventoryStatus === "lowStock" ? `Only ${product.remaining} left` : `${product.remaining} in stock`}</span></div><div className="quick-view-copy"><p className="eyebrow"><span /> {product.vendor.toUpperCase()}</p><h3>{product.name}</h3><p className="detail-price">{money.format(product.price)}</p><p>{product.description}</p><ul>{product.specs.slice(0, 2).map((spec) => <li key={spec}><Check size={14} />{spec}</li>)}</ul><button className="button primary-button full-width" onClick={() => { onAddToCart(product); closeWithMotion(); }}>Add to bag <Plus size={17} /></button><button className="quick-view-details" onClick={() => closeWithMotion(() => onViewDetails(product))}>See full details <ArrowRight size={15} /></button></div></section></div>;
}

function ProductDetailModal({ product, onClose, onAddToCart, isWishlisted, onToggleWishlist, onShare, onSelectProduct, searchHistory, wishlist }: { product: Product; onClose: () => void; onAddToCart: (product: Product) => void; isWishlisted: boolean; onToggleWishlist: (product: Product) => void; onShare: (product: Product) => void; onSelectProduct: (product: Product) => void; searchHistory: string[]; wishlist: number[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  return <><div className="overlay product-overlay" role="presentation" onMouseDown={onClose}><section className="product-modal" role="dialog" aria-modal="true" aria-label={product.name} onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose} aria-label="Close product details"><X size={20} /></button><ProductGallery product={product} onOpenLightbox={setLightboxIndex} /><div className="product-detail-copy"><p className="eyebrow"><span /> {product.vendor.toUpperCase()}</p><div className="detail-title-row"><h3>{product.name}</h3><div className="detail-actions"><button className="detail-share" onClick={() => onShare(product)} aria-label={`Share ${product.name}`}><Share2 size={18} /></button><button className={`detail-heart ${isWishlisted ? "is-saved" : ""}`} onClick={() => onToggleWishlist(product)} aria-pressed={isWishlisted} aria-label={`${isWishlisted ? "Remove" : "Save"} ${product.name} from wishlist`}><Heart size={19} fill={isWishlisted ? "currentColor" : "transparent"} /></button></div></div><p className="detail-price">{money.format(product.price)}</p><p className={`detail-stock ${product.inventoryStatus}`}>{product.inventoryStatus === "lowStock" ? `Low stock · ${product.remaining} remaining` : `${product.remaining} ready to ship`}</p><p>{product.description}</p><ul>{product.specs.map((spec) => <li key={spec}><Check size={15} />{spec}</li>)}</ul><button className="button primary-button full-width" onClick={() => { onAddToCart(product); onClose(); }}>Add to bag <Plus size={18} /></button><ProductReviews product={product} /><RelatedProducts product={product} onSelect={(item) => { setLightboxIndex(null); onSelectProduct(item); }} onAddToCart={onAddToCart} searchHistory={searchHistory} wishlist={wishlist} /></div></section></div>{lightboxIndex !== null && <ImageLightbox product={product} imageIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />}</>;
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [priceFloor, setPriceFloor] = useState(20);
  const [priceCeiling, setPriceCeiling] = useState(200);
  const [minimumRating, setMinimumRating] = useState(0);
  const [selectedColor, setSelectedColor] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState<CartLine[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("luma-cart") ?? "[]") as Array<{ id?: number; quantity?: number }>;
      return stored.flatMap((line) => {
        const product = products.find((candidate) => candidate.id === line.id);
        const quantity = Number.isInteger(line.quantity) && line.quantity && line.quantity > 0 ? Math.min(line.quantity, 99) : 0;
        return product && quantity ? [{ ...product, quantity }] : [];
      });
    } catch { return []; }
  });
  const [showCart, setShowCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeVendor, setActiveVendor] = useState<(typeof vendors)[number] | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStage, setCheckoutStage] = useState<"summary" | "processing" | "confirmed">("summary");
  const [showWishlist, setShowWishlist] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem("luma-wishlist") ?? "[]") as number[]; } catch { return []; }
  });
  const [orderHistory, setOrderHistory] = useState<PastOrder[]>(() => {
    try { return JSON.parse(localStorage.getItem("luma-order-history") ?? "[]") as PastOrder[]; } catch { return []; }
  });
  const [profileName, setProfileName] = useState(() => localStorage.getItem("luma-profile-name") ?? "Market visitor");
  const [personalizedDiscovery, setPersonalizedDiscovery] = useState(() => localStorage.getItem("luma-personalized-discovery") !== "false");
  const [marketUpdates, setMarketUpdates] = useState(() => localStorage.getItem("luma-market-updates") === "true");
  const [aiSuggestion, setAiSuggestion] = useState<{ productIds: number[]; shortReason: string; inventoryNote: string; source: "ai" | "catalog" } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem("luma-search-history") ?? "[]") as string[]; } catch { return []; }
  });
  const [voiceSupported] = useState(() => typeof window !== "undefined" && Boolean((window as typeof window & { SpeechRecognition?: WebSpeechConstructor; webkitSpeechRecognition?: WebSpeechConstructor }).SpeechRecognition || (window as typeof window & { SpeechRecognition?: WebSpeechConstructor; webkitSpeechRecognition?: WebSpeechConstructor }).webkitSpeechRecognition));
  const aiSearch = trpc.discovery.suggest.useMutation({
    onSuccess: (suggestion) => setAiSuggestion(suggestion),
    onError: () => toast.error("The market finder is taking a breath — try a few keywords instead"),
  });
  const ratingSummaries = trpc.reviews.summaries.useQuery();

  useEffect(() => { localStorage.setItem("luma-wishlist", JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem("luma-cart", JSON.stringify(cart.map(({ id, quantity }) => ({ id, quantity })))); }, [cart]);
  useEffect(() => { localStorage.setItem("luma-search-history", JSON.stringify(searchHistory)); }, [searchHistory]);
  useEffect(() => { localStorage.setItem("luma-order-history", JSON.stringify(orderHistory)); }, [orderHistory]);
  useEffect(() => { localStorage.setItem("luma-profile-name", profileName); }, [profileName]);
  useEffect(() => { localStorage.setItem("luma-personalized-discovery", String(personalizedDiscovery)); }, [personalizedDiscovery]);
  useEffect(() => { localStorage.setItem("luma-market-updates", String(marketUpdates)); }, [marketUpdates]);
  useEffect(() => {
    const productId = Number(new URLSearchParams(window.location.search).get("product"));
    if (productId) setActiveProduct(products.find((product) => product.id === productId) ?? null);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedShipping = cart.length ? (cartTotal >= 100 ? 0 : 8) : 0;
  const cartGrandTotal = cartTotal + estimatedShipping;
  const ratingsByProduct = useMemo(() => new Map((ratingSummaries.data ?? []).map(summary => [summary.productId, summary])), [ratingSummaries.data]);

  useEffect(() => {
    if (!cartCount) return;
    setCartPulse(true);
    const timeout = window.setTimeout(() => setCartPulse(false), 420);
    return () => window.clearTimeout(timeout);
  }, [cartCount]);

  const filteredProducts = useMemo(() => {
    const candidates = aiSuggestion ? aiSuggestion.productIds.map((id) => products.find((product) => product.id === id)).filter((product): product is Product => Boolean(product)) : products;
    const normalized = query.trim().toLowerCase();
    const result = candidates.filter((product) => {
      const searchMatch = !normalized || [product.name, product.vendor, product.category].some((value) => value.toLowerCase().includes(normalized));
      const categoryMatch = category === "All" || product.category === category;
      const priceMatch = product.price >= priceFloor && product.price <= priceCeiling;
      const colorMatch = selectedColor === "All" || product.color === selectedColor;
      const ratingMatch = !minimumRating || (ratingsByProduct.get(product.id)?.averageRating ?? 0) >= minimumRating;
      return searchMatch && categoryMatch && priceMatch && colorMatch && ratingMatch;
    });

    return [...result].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "rating") return (ratingsByProduct.get(b.id)?.averageRating ?? 0) - (ratingsByProduct.get(a.id)?.averageRating ?? 0);
      return a.id - b.id;
    });
  }, [aiSuggestion, category, minimumRating, priceCeiling, priceFloor, query, ratingsByProduct, selectedColor, sort]);

  const addToCart = (product: Product, options: { openCart?: boolean } = {}) => {
    setCart((current) => {
      const line = current.find((item) => item.id === product.id);
      if (line) return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      return [...current, { ...product, quantity: 1 }];
    });
    if (options.openCart ?? true) setShowCart(true);
    toast.success("Added to your bag", { description: `${product.name} · ${money.format(product.price)}` });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((current) => current.flatMap((item) => {
      if (item.id !== id) return [item];
      const nextQuantity = item.quantity + delta;
      return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
    }));
  };

  const beginPayment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart.length) return;
    setCheckoutStage("processing");
    window.setTimeout(() => setCheckoutStage("confirmed"), 1400);
  };

  const completeCheckout = () => {
    const newOrder: PastOrder = { id: `LM-${Date.now().toString().slice(-6)}`, createdAt: Date.now(), itemCount: cartCount, total: cartGrandTotal, items: cart.map(({ id, quantity }) => ({ id, quantity })) };
    setOrderHistory((current) => [newOrder, ...current].slice(0, 12));
    setCart([]);
    setShowCheckout(false);
    setCheckoutStage("summary");
    toast.success("Order request confirmed", { description: "Your sellers will receive the preparation details next" });
  };

  const openCheckout = () => {
    setShowCart(false);
    setCheckoutStage("summary");
    setShowCheckout(true);
  };

  const moveCollection = (direction: "left" | "right") => {
    const rail = document.getElementById("product-rail");
    rail?.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((current) => {
      const alreadySaved = current.includes(product.id);
      toast.success(alreadySaved ? "Removed from saved finds" : "Saved for later", { description: product.name });
      return alreadySaved ? current.filter((id) => id !== product.id) : [...current, product.id];
    });
  };

  const runDiscovery = (rawQuery: string) => {
    const searchText = rawQuery.trim();
    if (searchText.length < 3) { toast.info("Describe a mood, material, room, or use case in a few words"); return; }
    const nextHistory = [searchText, ...searchHistory.filter((item) => item.toLowerCase() !== searchText.toLowerCase())].slice(0, 5);
    setSearchHistory(nextHistory);
    aiSearch.mutate({ query: searchText, history: nextHistory.slice(1) });
  };

  const submitNaturalSearch = () => runDiscovery(query);

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") { event.preventDefault(); submitNaturalSearch(); }
  };

  const startVoiceSearch = () => {
    const voiceWindow = window as typeof window & { SpeechRecognition?: WebSpeechConstructor; webkitSpeechRecognition?: WebSpeechConstructor };
    const Recognition = voiceWindow.SpeechRecognition ?? voiceWindow.webkitSpeechRecognition;
    if (!Recognition) { toast.info("Voice search is not available in this browser — describe what you need in the search field"); return; }
    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(result => result[0]?.transcript ?? "").join(" ").trim();
      if (!transcript) return;
      setQuery(transcript);
      setAiSuggestion(null);
      runDiscovery(transcript);
    };
    recognition.onerror = () => toast.error("We couldn’t hear that clearly — please try again or type your search");
    recognition.onend = () => setIsListening(false);
    setIsListening(true);
    recognition.start();
  };

  const wishlistProducts = products.filter((product) => wishlist.includes(product.id));

  const shareProduct = async (product: Product) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product.id}`;
    const shareData = { title: `${product.name} · Luma Market`, text: `A thoughtful find from ${product.vendor}: ${product.name}.`, url: shareUrl };
    try {
      if (navigator.share) { await navigator.share(shareData); toast.success("Share sheet opened"); return; }
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Product link copied — ready to share anywhere");
    } catch (error) {
      if ((error as Error).name === "AbortError") return;
      window.prompt("Copy this product link", shareUrl);
    }
  };

  return (
    <div className="market-shell">
      <div className="market-grain" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Luma Market home">
          <img src="/manus-storage/luma-split-sun-logo_8bd655e3.png" alt="" />
          <span>Luma</span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <a href="#shop">Shop</a>
          <a href="#makers">Makers</a>
          <a href="#story">Our story</a>
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "night" : "day"} mode`}>
            <Sun className={theme === "light" ? "active" : ""} size={15} />
            <span className="theme-orbit"><span /></span>
            <Moon className={theme === "dark" ? "active" : ""} size={14} />
          </button>
          <button className="profile-button" onClick={() => setShowProfile(true)} aria-label="Open shopper profile"><CircleUserRound size={18} /></button>
          <button className={`bag-button ${cartCount ? "has-items" : ""} ${cartPulse ? "cart-bump" : ""}`} onClick={() => setShowCart(true)} aria-label={`Open cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}>
            <ShoppingBag size={19} />
            {cartCount > 0 && <span className="cart-count-badge" key={cartCount}>{cartCount}</span>}
          </button>
          <button className={`wishlist-button ${wishlist.length ? "has-saves" : ""}`} onClick={() => setShowWishlist(true)} aria-label={`Open wishlist with ${wishlist.length} item${wishlist.length === 1 ? "" : "s"}`}><Heart size={18} fill={wishlist.length ? "currentColor" : "transparent"} /><span>{wishlist.length}</span></button>
          <button className="menu-button" onClick={() => setShowMenu((open) => !open)} aria-label="Toggle navigation"><Menu size={21} /></button>
        </div>
      </header>

      {showMenu && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <a href="#shop" onClick={() => setShowMenu(false)}>Shop the collection</a>
          <a href="#makers" onClick={() => setShowMenu(false)}>Meet the makers</a>
          <a href="#story" onClick={() => setShowMenu(false)}>Our story</a>
        </nav>
      )}

      <main id="top">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-copy">
            <p className="eyebrow"><span /> MARKETPLACE / 24</p>
            <p className="hero-prompt">Find your next useful obsession</p>
            <h1 id="hero-heading">The good kind <em>of too much</em></h1>
            <p className="hero-description">Thoughtful finds from independent studios</p>
            <div className="hero-stat"><strong>38</strong><span><b>independent sellers</b><small>now in the arcade</small></span></div>
            <div className="hero-cta-row">
              <a className="button primary-button" href="#shop">Browse the market <ArrowDownRight size={18} /></a>
              <a className="text-link" href="#makers">Meet the makers <ArrowRight size={16} /></a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-ring ring-a" />
            <div className="hero-ring ring-b" />
            <div className="hero-image-frame"><img src="/manus-storage/luma-hero-market_87349503.jpg" alt="Curated homeware, accessories and daily objects arranged in a sunlit gallery" /></div>
            <div className="hero-sticker">NEW<br /><b>THIS WEEK</b></div>
            <div className="hero-note"><span className="note-dot" /> Open studio edition</div>
          </div>
        </section>

        <section className="market-section" id="shop" aria-labelledby="shop-heading">
          <div className="section-kicker"><span>01</span> THE MARKET FLOOR</div>
          <div className="shop-heading-row">
            <div>
              <h2 id="shop-heading">Made to become <em>yours.</em></h2>
              <p>Small-run finds from independent sellers ready to take home</p>
            </div>
            <div className="rail-controls" aria-label="Browse products">
              <button onClick={() => moveCollection("left")} aria-label="Scroll products left"><ChevronLeft size={19} /></button>
              <button onClick={() => moveCollection("right")} aria-label="Scroll products right"><ChevronRight size={19} /></button>
            </div>
          </div>

          <div className="shop-tools">
            <div className="ai-search-wrap"><div className="search-field"><Search size={17} /><input value={query} onChange={(event) => { setQuery(event.target.value); setAiSuggestion(null); }} onKeyDown={handleSearchKeyDown} placeholder="Try “a calm desk companion”" aria-label="Describe what you are looking for" /><button className={`voice-search-button ${isListening ? "is-listening" : ""}`} onClick={startVoiceSearch} disabled={!voiceSupported || isListening} aria-label={voiceSupported ? "Speak a product search" : "Voice search is unavailable in this browser"}>{voiceSupported ? <Mic size={15} /> : <MicOff size={15} />}</button><button className="ai-search-button" onClick={submitNaturalSearch} disabled={aiSearch.isPending} aria-label="Ask the AI product finder"><Sparkles size={16} className={aiSearch.isPending ? "sparkle-spin" : ""} /></button></div><p className="ai-search-label">{voiceSupported ? <><Mic size={12} /> Speak or type a mood, material, room, or ritual</> : <><MicOff size={12} /> Voice search is unavailable here — type a natural description</>}</p>{searchHistory.length > 0 && <div className="recent-searches"><span>Recent</span><div>{searchHistory.map((item) => <button key={item} onClick={() => { setQuery(item); setAiSuggestion(null); runDiscovery(item); }}>{item}</button>)}<button className="clear-history" onClick={() => setSearchHistory([])} aria-label="Clear recent searches"><X size={12} /></button></div></div>}</div>
            <div className="filter-row">
              <div className="category-pills" aria-label="Filter by category">
                {categories.map((item) => <button className={category === item ? "selected" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}
              </div>
              <label className="sort-select"><SlidersHorizontal size={16} /><span className="sr-only">Sort products</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Highest visitor rating</option></select></label>
            </div>
          </div>
          {aiSuggestion && <div className="ai-suggestion"><div><Sparkles size={17} /><span><b>{aiSuggestion.source === "ai" ? "Luma’s product finder" : "Catalog match"}</b>{aiSuggestion.shortReason}<small>{aiSuggestion.inventoryNote}</small></span></div><button onClick={() => { setAiSuggestion(null); setQuery(""); }}>Return to all finds <X size={15} /></button></div>}

          <button className="filter-toggle" onClick={() => setShowFilters((visible) => !visible)} aria-expanded={showFilters} aria-controls="product-filters"><SlidersHorizontal size={16} />{showFilters ? "Hide filters" : "Refine products"}</button>
          <div className="catalog-layout">
          <aside className={`filter-sidebar ${showFilters ? "is-open" : ""}`} id="product-filters" aria-label="Filter products">
            <div className="filter-sidebar-heading filter-sidebar-actions"><button onClick={() => { setCategory("All"); setPriceFloor(20); setPriceCeiling(200); setSelectedColor("All"); setMinimumRating(0); }}>Reset filters</button></div>
            <fieldset><legend>Category</legend>{categories.map((item) => <label className="filter-choice" key={item}><input type="radio" name="category-filter" checked={category === item} onChange={() => setCategory(item)} /><span>{item}</span></label>)}</fieldset>
            <fieldset><legend>Price range <b>{money.format(priceFloor)}–{money.format(priceCeiling)}</b></legend><div className="price-visual-range"><div className="price-track" style={{ "--from": `${((priceFloor - 20) / 180) * 100}%`, "--to": `${100 - ((priceCeiling - 20) / 180) * 100}%` } as React.CSSProperties} /><input aria-label="Minimum price" type="range" min="20" max="190" step="10" value={priceFloor} onChange={(event) => setPriceFloor(Math.min(Number(event.target.value), priceCeiling - 10))} /><input aria-label="Maximum price" type="range" min="30" max="200" step="10" value={priceCeiling} onChange={(event) => setPriceCeiling(Math.max(Number(event.target.value), priceFloor + 10))} /></div><div className="range-labels"><span>$20</span><span>$200+</span></div></fieldset>
            <fieldset><legend>Colour</legend><div className="color-swatches"><button className={selectedColor === "All" ? "selected" : ""} onClick={() => setSelectedColor("All")} aria-pressed={selectedColor === "All"} aria-label="All colours">All</button>{colorSwatches.map((swatch) => <button key={swatch.value} className={selectedColor === swatch.value ? "selected" : ""} onClick={() => setSelectedColor(swatch.value)} aria-pressed={selectedColor === swatch.value} aria-label={`Filter by ${swatch.value}`} title={swatch.value}><i style={{ background: swatch.color }} /></button>)}</div><small>{selectedColor === "All" ? "Choose an object colour to narrow the market" : selectedColor}</small></fieldset>
            <fieldset><legend>Visitor rating</legend><label className="filter-choice"><input type="radio" name="rating-filter" checked={minimumRating === 0} onChange={() => setMinimumRating(0)} /><span>Any rating</span></label><label className="filter-choice"><input type="radio" name="rating-filter" checked={minimumRating === 4} onChange={() => setMinimumRating(4)} /><span>4 stars & up</span></label><label className="filter-choice"><input type="radio" name="rating-filter" checked={minimumRating === 5} onChange={() => setMinimumRating(5)} /><span>5 stars</span></label><small>{ratingSummaries.data?.length ? "Filters reflect published visitor notes only" : "Ratings will appear once visitors add notes"}</small></fieldset>
          </aside>
          <div className="product-results"><div className="product-rail" id="product-rail">
            {filteredProducts.map((product, index) => (
              <article className="product-card" style={{ "--index": index } as React.CSSProperties} key={product.id}>
                <div className="product-visual-wrap">
                  <button className="product-visual-button" onClick={() => setActiveProduct(product)} aria-label={`View ${product.name}`}><ProductVisual product={product} /></button>
                  <button className="card-quick-add" onClick={() => addToCart(product, { openCart: false })} aria-label={`Quick add ${product.name} to cart`}><Plus size={16} /><span>Quick add</span></button>
                  <button className="quick-view-trigger" onClick={() => setQuickViewProduct(product)} aria-label={`Quick view ${product.name}`}><Eye size={16} /><span>Quick view</span></button>
                  <button className={`product-heart ${wishlist.includes(product.id) ? "is-saved" : ""}`} onClick={() => toggleWishlist(product)} aria-label={`${wishlist.includes(product.id) ? "Remove" : "Save"} ${product.name} ${wishlist.includes(product.id) ? "from" : "to"} wishlist`} aria-pressed={wishlist.includes(product.id)}><Heart size={17} fill={wishlist.includes(product.id) ? "currentColor" : "transparent"} /></button>
                </div>
                <div className="product-meta">
                  <button className="product-name" onClick={() => setActiveProduct(product)}>{product.name}</button>
                  <p>{product.vendor} <span>·</span> {product.category}</p><span className={`stock-note ${product.inventoryStatus}`}>{product.inventoryStatus === "lowStock" ? `Only ${product.remaining} left` : `${product.remaining} in stock`}</span>
                  <div className="product-price-row"><strong>{money.format(product.price)}</strong><button onClick={() => addToCart(product)} className="circle-add" aria-label={`Add ${product.name} to cart`}><Plus size={17} /></button></div>
                </div>
                {product.badge && <span className="product-badge">{product.badge}</span>}
              </article>
            ))}
            {!filteredProducts.length && <div className="empty-products"><Search size={21} /><p>No market finds match that search yet.</p><button onClick={() => { setQuery(""); setCategory("All"); setPriceFloor(20); setPriceCeiling(200); setSelectedColor("All"); setMinimumRating(0); }}>Clear filters</button></div>}
          </div></div></div>
          <div className="market-pulse" aria-label="Live marketplace signals">
            <span className="pulse-orbit"><i /></span>
            <p><b>Market radar</b> <span>Fresh drops from 7 studios today</span></p>
            <p><b>Fast finding</b> <span>13 low-stock pieces are moving</span></p>
            <a href="#makers">Explore sellers <ArrowRight size={15} /></a>
          </div>
        </section>

        <section className="promo-section" aria-label="Marketplace promotion">
          <div className="promo-copy">
            <p className="eyebrow"><span /> LUMA SELECTS</p>
            <h2>Room for the<br /><em>unexpected.</em></h2>
            <p>Explore a handpicked collection from newer sellers building useful and beautiful things in small numbers</p>
            <button className="button dark-button" onClick={() => { setCategory("Accessories"); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>See the edit <ArrowRight size={18} /></button>
          </div>
          <div className="promo-image"><img src="/manus-storage/luma-promo-arch_a2f778e9.jpg" alt="Curated accessories styled within a cream architectural arch" /><span className="promo-sticker">SAVE<br /><b>15%</b></span></div>
        </section>

        <section className="vendors-section" id="makers" aria-labelledby="makers-heading">
          <div className="section-kicker"><span>02</span> SELLER STALLS</div>
          <div className="vendors-heading"><h2 id="makers-heading">The people behind <em>the good stuff.</em></h2><p>Independent studios all in one welcoming place</p></div>
          <div className="vendor-list">
            {vendors.map((vendor, index) => (
              <button className={`vendor-card ${vendor.palette}`} key={vendor.name} onClick={() => setActiveVendor(vendor)}>
                <span className="vendor-number">0{index + 1}</span>
                <span className="vendor-mark">{vendor.name.charAt(0)}</span>
                <span className="vendor-details"><b>{vendor.name}</b><small>{vendor.description}</small></span>
                <span className="vendor-category">{vendor.category}<br />{vendor.products} items</span>
                <ArrowRight className="vendor-arrow" size={20} />
              </button>
            ))}
          </div>
        </section>

        <section className="story-section" id="story" aria-labelledby="story-heading">
          <div className="story-image"><img src="/manus-storage/luma-vendor-story_61e67283.jpg" alt="A sunlit independent ceramic studio with handmade tableware" /><div className="story-stamp">CURIOUSLY<br />COLLECTED</div></div>
          <div className="story-copy"><p className="eyebrow"><span /> A DIFFERENT KIND OF CART</p><h2 id="story-heading">Good objects start with <em>good questions.</em></h2><p>We build a calmer place to browse the things people make with intention. Every seller brings their own point of view. Your cart just lets the conversation continue.</p><a href="#shop" className="text-link">Take a look around <ArrowRight size={16} /></a></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand"><img src="/manus-storage/luma-split-sun-logo_8bd655e3.png" alt="" /><span>Luma</span></div>
        <p>Find a new favourite seller</p>
        <div className="footer-columns">
          <section><b>Shop</b><a href="#shop">Home</a><button onClick={() => { setCategory("Accessories"); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>Accessories</button><button onClick={() => { setCategory("Tech"); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>Tech</button><button onClick={() => { setCategory("Stationery"); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>Stationery</button></section>
          <section><b>Sellers</b><a href="#makers">Become a maker</a><button onClick={() => setShowProfile(true)}>Seller dashboard</button><a href="#story">Our standards</a></section>
        </div>
      </footer>

      {showCart && (
        <div className="overlay" role="presentation" onMouseDown={() => setShowCart(false)}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart" onMouseDown={(event) => event.stopPropagation()}>
            <div className="drawer-header"><div><p className="eyebrow"><span /> YOUR FINDINGS</p><h3>Shopping bag <sup>{cartCount}</sup></h3></div><button onClick={() => setShowCart(false)} aria-label="Close shopping cart"><X size={21} /></button></div>
            <div className="cart-lines">
              {cart.length ? cart.map((item) => <div className="cart-line" key={item.id}><div className={`cart-thumb ${item.imageClass}`}><item.Icon size={22} /></div><div><b>{item.name}</b><p>{item.vendor}</p><div className="quantity"><button onClick={() => updateQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}><Plus size={13} /></button></div></div><strong>{money.format(item.price * item.quantity)}</strong></div>) : <div className="cart-empty"><ShoppingBag size={26} /><p>Your bag is ready when you are</p><button onClick={() => setShowCart(false)}>Keep browsing</button></div>}
            </div>
            <div className="cart-footer"><div className="cart-price-line"><span>Subtotal</span><b>{money.format(cartTotal)}</b></div><div className="cart-price-line"><span>Estimated delivery</span><b>{estimatedShipping ? money.format(estimatedShipping) : "Complimentary"}</b></div><div className="cart-grand-total"><span>Order estimate</span><b>{money.format(cartGrandTotal)}</b></div><p>{cartTotal >= 100 ? "Complimentary delivery unlocked" : "Add a little more to unlock complimentary delivery"}</p><button className="button primary-button full-width" disabled={!cart.length} onClick={openCheckout}>Continue to delivery <ArrowRight size={18} /></button></div>
          </aside>
        </div>
      )}

      {showProfile && <div className="overlay profile-overlay" role="presentation" onMouseDown={() => setShowProfile(false)}><section className="profile-dashboard" role="dialog" aria-modal="true" aria-label="Shopper profile" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowProfile(false)} aria-label="Close shopper profile"><X size={20} /></button><div className="profile-hero"><span className="profile-avatar"><CircleUserRound size={30} /></span><div><p className="eyebrow"><span /> YOUR LUMA</p><h3>{profileName || "Market visitor"}</h3><p>Your local market preferences and simulated order requests stay on this device</p></div></div><div className="profile-grid"><section className="profile-card profile-preferences"><div><p className="eyebrow"><span /> PREFERENCES</p><h4>Set your signal</h4></div><label>Display name<input value={profileName} maxLength={60} onChange={(event) => setProfileName(event.target.value)} placeholder="Market visitor" /></label><label className="preference-switch"><span><b>Personalized discovery</b><small>Use saved pieces and searches to shape matches</small></span><input type="checkbox" checked={personalizedDiscovery} onChange={(event) => setPersonalizedDiscovery(event.target.checked)} /></label><label className="preference-switch"><span><b>Market updates</b><small>Keep a preference for new-studio notes</small></span><input type="checkbox" checked={marketUpdates} onChange={(event) => setMarketUpdates(event.target.checked)} /></label></section><section className="profile-card profile-orders"><div><p className="eyebrow"><span /> ORDER HISTORY</p><h4>Past requests</h4></div>{orderHistory.length ? <div className="order-history-list">{orderHistory.map((order) => <article key={order.id}><div><b>{order.id}</b><span>{new Date(order.createdAt).toLocaleDateString()} · {order.itemCount} item{order.itemCount === 1 ? "" : "s"}</span></div><strong>{money.format(order.total)}</strong><small>Simulated order request</small></article>)}</div> : <p className="profile-empty">No order requests yet — a completed simulated checkout will appear here</p>}</section><section className="profile-card profile-saves"><div><p className="eyebrow"><span /> SAVED FINDS</p><h4>Still thinking about</h4></div>{wishlistProducts.length ? <div className="profile-saves-list">{wishlistProducts.map((product) => <article key={product.id}><img src={product.image} alt="" /><div><b>{product.name}</b><span>{product.vendor} · {money.format(product.price)}</span></div><button onClick={() => toggleWishlist(product)} aria-label={`Remove ${product.name} from saved finds`}><Heart size={16} fill="currentColor" /></button></article>)}</div> : <p className="profile-empty">Save a piece from the market to keep it close here</p>}</section></div></section></div>}

      {showWishlist && <div className="overlay" role="presentation" onMouseDown={() => setShowWishlist(false)}><aside className="wishlist-drawer" role="dialog" aria-modal="true" aria-label="Saved products" onMouseDown={(event) => event.stopPropagation()}><div className="drawer-header"><div><p className="eyebrow"><span /> KEEP FOR LATER</p><h3>Saved finds <sup>{wishlist.length}</sup></h3></div><button onClick={() => setShowWishlist(false)} aria-label="Close saved products"><X size={21} /></button></div><div className="wishlist-lines">{wishlistProducts.length ? wishlistProducts.map((product) => <article className="wishlist-line" key={product.id}><img src={product.image} alt="" /><div><b>{product.name}</b><p>{product.vendor}</p><strong>{money.format(product.price)}</strong></div><div><button className="small-heart is-saved" onClick={() => toggleWishlist(product)} aria-label={`Remove ${product.name} from wishlist`}><Heart size={17} fill="currentColor" /></button><button className="quick-bag" onClick={() => addToCart(product)}>Bag <Plus size={13} /></button></div></article>) : <div className="wishlist-empty"><Heart size={27} /><p>Keep the pieces you’re still thinking about</p><button onClick={() => setShowWishlist(false)}>Explore the market</button></div>}</div></aside></div>}

      {showCheckout && (
        <div className="overlay checkout-overlay" role="presentation">
          <section className={`checkout-modal checkout-${checkoutStage}`} role="dialog" aria-modal="true" aria-label="Checkout order summary">
            {checkoutStage !== "processing" && <button className="modal-close" onClick={() => { setShowCheckout(false); setCheckoutStage("summary"); }} aria-label="Close checkout"><X size={20} /></button>}
            {checkoutStage === "summary" && <><p className="eyebrow"><span /> ORDER SUMMARY</p><h3>Almost yours</h3><p className="checkout-intro">Review your small-run finds, then try the simulated payment step — no money moves in this experience</p><div className="checkout-lines">{cart.map((item) => <div key={item.id}><span>{item.quantity} × {item.name}</span><b>{money.format(item.price * item.quantity)}</b></div>)}</div><form onSubmit={beginPayment}><label>Full name<input required name="name" placeholder="Jordan Lee" /></label><label>Email address<input required type="email" name="email" placeholder="you@example.com" /></label><label>Delivery address<textarea required name="address" placeholder="Street, city, postal code" rows={3} /></label><div className="checkout-total"><span>Order estimate</span><b>{money.format(cartGrandTotal)}</b></div><button className="button primary-button full-width" type="submit">Simulate payment <ArrowRight size={18} /></button></form></>}
            {checkoutStage === "processing" && <div className="payment-state" aria-live="polite"><span className="payment-orbit"><Loader2 size={28} /></span><p className="eyebrow"><span /> PAYMENT SIMULATION</p><h3>Checking the light</h3><p>Simulating a secure approval for your order estimate of {money.format(cartGrandTotal)}</p></div>}
            {checkoutStage === "confirmed" && <div className="payment-state confirmed" aria-live="polite"><span className="payment-orbit"><Check size={29} /></span><p className="eyebrow"><span /> SIMULATED APPROVAL</p><h3>It’s in motion</h3><p>Your order request is ready for sellers to review — no payment was taken</p><div className="checkout-total"><span>Order estimate</span><b>{money.format(cartGrandTotal)}</b></div><button className="button primary-button full-width" onClick={completeCheckout}>Back to the market <ArrowRight size={18} /></button></div>}
          </section>
        </div>
      )}

      {activeProduct && <ProductDetailModal product={activeProduct} onClose={() => setActiveProduct(null)} onAddToCart={addToCart} isWishlisted={wishlist.includes(activeProduct.id)} onToggleWishlist={toggleWishlist} onShare={shareProduct} onSelectProduct={setActiveProduct} searchHistory={searchHistory} wishlist={wishlist} />}

      {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} onAddToCart={addToCart} onViewDetails={setActiveProduct} />}

      {activeVendor && (
        <div className="overlay" role="presentation" onMouseDown={() => setActiveVendor(null)}>
          <section className="vendor-modal" role="dialog" aria-modal="true" aria-label={`${activeVendor.name} store`} onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveVendor(null)} aria-label="Close seller details"><X size={20} /></button>
            <div className={`vendor-modal-mark ${activeVendor.palette}`}>{activeVendor.name.charAt(0)}</div><p className="eyebrow"><span /> INDEPENDENT SELLER</p><h3>{activeVendor.name}</h3><p>{activeVendor.description} — discover {activeVendor.products} pieces across {activeVendor.category.toLowerCase()}</p><div className="vendor-modal-actions"><button className="button primary-button" onClick={() => { setQuery(activeVendor.name); setActiveVendor(null); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>View available pieces <ArrowRight size={17} /></button><button className="text-link" onClick={() => setActiveVendor(null)}>Back to stalls</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
