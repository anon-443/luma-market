/**
 * Solstice Arcade design reminder: make discovery feel like a lively editorial market promenade.
 * Use asymmetric sections, Luma Saffron price stickers, spectral arches, and tactile 160–260ms motion.
 */
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Heart,
  LampDesk,
  Menu,
  Minus,
  Moon,
  Package,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Sun,
  X,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

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
};

type CartLine = Product & { quantity: number };

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
  },
];

const vendors = [
  { name: "Maison Sora", description: "Small rituals for the table.", category: "Ceramics & home", products: 18, palette: "sora" },
  { name: "Field Theory", description: "Objects that hold a room together.", category: "Lighting & furniture", products: 24, palette: "field" },
  { name: "Onda Goods", description: "Useful things with soft edges.", category: "Textiles & accessories", products: 31, palette: "onda" },
];

const categories = ["All", "Home", "Accessories", "Tech", "Stationery"];

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function ProductVisual({ product }: { product: Product }) {
  const { Icon } = product;
  return (
    <div className={`product-visual ${product.imageClass}`} aria-label={`${product.name} product artwork`}>
      <img className="product-photo" src={product.image} style={{ objectPosition: product.imagePosition }} alt="" />
      <div className="photo-vignette" />
      <div className="visual-orbit" />
      <span className="product-icon-badge"><Icon aria-hidden="true" /></span>
      <span className="visual-shadow" />
    </div>
  );
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [activeVendor, setActiveVendor] = useState<(typeof vendors)[number] | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const searchMatch = !normalized || [product.name, product.vendor, product.category].some((value) => value.toLowerCase().includes(normalized));
      const categoryMatch = category === "All" || product.category === category;
      return searchMatch && categoryMatch;
    });

    return [...result].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return a.id - b.id;
    });
  }, [category, query, sort]);

  const addToCart = (product: Product) => {
    setCart((current) => {
      const line = current.find((item) => item.id === product.id);
      if (line) return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      return [...current, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} is in your cart`);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((current) => current.flatMap((item) => {
      if (item.id !== id) return [item];
      const nextQuantity = item.quantity + delta;
      return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
    }));
  };

  const handleCheckout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cart.length) return;
    setShowCheckout(false);
    setShowCart(false);
    setCart([]);
    toast.success("Order request saved — sellers will confirm availability next.");
  };

  const moveCollection = (direction: "left" | "right") => {
    const rail = document.getElementById("product-rail");
    rail?.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
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
          <button className="bag-button" onClick={() => setShowCart(true)} aria-label={`Open cart with ${cartCount} item${cartCount === 1 ? "" : "s"}`}>
            <ShoppingBag size={19} />
            <span>{cartCount}</span>
          </button>
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
            <h1 id="hero-heading">The good kind <em>of too much.</em></h1>
            <p className="hero-description">A living market of thoughtful finds, independent studios, and objects with a point of view.</p>
            <div className="hero-cta-row">
              <a className="button primary-button" href="#shop">Browse the market <ArrowDownRight size={18} /></a>
              <a className="text-link" href="#makers">Meet the makers <ArrowRight size={16} /></a>
            </div>
            <div className="hero-stat"><strong>38</strong><span>independent sellers<br />now in the arcade</span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-ring ring-a" />
            <div className="hero-ring ring-b" />
            <div className="hero-image-frame"><img src="/manus-storage/luma-hero-market_87349503.jpg" alt="Curated homeware, accessories and daily objects arranged in a sunlit gallery" /></div>
            <div className="hero-sticker">NEW<br /><b>THIS WEEK</b></div>
            <div className="hero-note"><span className="note-dot" /> Open studio edition</div>
          </div>
        </section>

        <section className="category-ribbon" aria-label="Product categories">
          <p>Find your next useful obsession</p>
          <div className="category-links">
            {categories.slice(1).map((item) => <button key={item} onClick={() => { setCategory(item); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>{item}</button>)}
          </div>
        </section>

        <section className="market-section" id="shop" aria-labelledby="shop-heading">
          <div className="section-kicker"><span>01</span> THE MARKET FLOOR</div>
          <div className="shop-heading-row">
            <div>
              <h2 id="shop-heading">Made to become <em>yours.</em></h2>
              <p>Small-run finds from independent sellers, ready to take home.</p>
            </div>
            <div className="rail-controls" aria-label="Browse products">
              <button onClick={() => moveCollection("left")} aria-label="Scroll products left"><ChevronLeft size={19} /></button>
              <button onClick={() => moveCollection("right")} aria-label="Scroll products right"><ChevronRight size={19} /></button>
            </div>
          </div>

          <div className="shop-tools">
            <label className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search objects or sellers" aria-label="Search objects or sellers" /></label>
            <div className="filter-row">
              <div className="category-pills" aria-label="Filter by category">
                {categories.map((item) => <button className={category === item ? "selected" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}
              </div>
              <label className="sort-select"><SlidersHorizontal size={16} /><span className="sr-only">Sort products</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
            </div>
          </div>

          <div className="product-rail" id="product-rail">
            {filteredProducts.map((product, index) => (
              <article className="product-card" style={{ "--index": index } as React.CSSProperties} key={product.id}>
                <button className="product-visual-button" onClick={() => setActiveProduct(product)} aria-label={`View ${product.name}`}><ProductVisual product={product} /></button>
                <div className="product-meta">
                  <button className="product-name" onClick={() => setActiveProduct(product)}>{product.name}</button>
                  <p>{product.vendor} <span>·</span> {product.category}</p>
                  <div className="product-price-row"><strong>{money.format(product.price)}</strong><button onClick={() => addToCart(product)} className="circle-add" aria-label={`Add ${product.name} to cart`}><Plus size={17} /></button></div>
                </div>
                {product.badge && <span className="product-badge">{product.badge}</span>}
              </article>
            ))}
            {!filteredProducts.length && <div className="empty-products"><Search size={21} /><p>No market finds match that search yet.</p><button onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button></div>}
          </div>
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
            <p>Explore a handpicked collection from newer sellers building useful, beautiful things in small numbers.</p>
            <button className="button dark-button" onClick={() => { setCategory("Accessories"); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>See the edit <ArrowRight size={18} /></button>
          </div>
          <div className="promo-image"><img src="/manus-storage/luma-promo-arch_a2f778e9.jpg" alt="Curated accessories styled within a cream architectural arch" /><span className="promo-sticker">SAVE<br /><b>15%</b></span></div>
        </section>

        <section className="vendors-section" id="makers" aria-labelledby="makers-heading">
          <div className="section-kicker"><span>02</span> SELLER STALLS</div>
          <div className="vendors-heading"><h2 id="makers-heading">The people behind <em>the good stuff.</em></h2><p>Independent studios, all in one welcoming place.</p></div>
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
        <p>Find a new favourite seller.</p>
        <div><a href="#shop">Shop</a><a href="#makers">Makers</a><a href="mailto:hello@lumamarket.example">Contact</a></div>
      </footer>

      {showCart && (
        <div className="overlay" role="presentation" onMouseDown={() => setShowCart(false)}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart" onMouseDown={(event) => event.stopPropagation()}>
            <div className="drawer-header"><div><p className="eyebrow"><span /> YOUR FINDINGS</p><h3>Shopping bag <sup>{cartCount}</sup></h3></div><button onClick={() => setShowCart(false)} aria-label="Close shopping cart"><X size={21} /></button></div>
            <div className="cart-lines">
              {cart.length ? cart.map((item) => <div className="cart-line" key={item.id}><div className={`cart-thumb ${item.imageClass}`}><item.Icon size={22} /></div><div><b>{item.name}</b><p>{item.vendor}</p><div className="quantity"><button onClick={() => updateQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} aria-label={`Add one ${item.name}`}><Plus size={13} /></button></div></div><strong>{money.format(item.price * item.quantity)}</strong></div>) : <div className="cart-empty"><ShoppingBag size={26} /><p>Your bag is ready when you are.</p><button onClick={() => setShowCart(false)}>Keep browsing</button></div>}
            </div>
            <div className="cart-footer"><div><span>Subtotal</span><b>{money.format(cartTotal)}</b></div><p>Delivery and tax are shown at checkout.</p><button className="button primary-button full-width" disabled={!cart.length} onClick={() => setShowCheckout(true)}>Continue to delivery <ArrowRight size={18} /></button></div>
          </aside>
        </div>
      )}

      {showCheckout && (
        <div className="overlay checkout-overlay" role="presentation">
          <section className="checkout-modal" role="dialog" aria-modal="true" aria-label="Delivery details">
            <button className="modal-close" onClick={() => setShowCheckout(false)} aria-label="Close checkout"><X size={20} /></button>
            <p className="eyebrow"><span /> DELIVERY DETAILS</p><h3>Nearly there.</h3><p className="checkout-intro">Add your information so the right sellers can prepare your order request.</p>
            <form onSubmit={handleCheckout}>
              <label>Full name<input required name="name" placeholder="Jordan Lee" /></label>
              <label>Email address<input required type="email" name="email" placeholder="you@example.com" /></label>
              <label>Delivery address<textarea required name="address" placeholder="Street, city, postal code" rows={3} /></label>
              <div className="checkout-total"><span>Order request</span><b>{money.format(cartTotal)}</b></div>
              <button className="button primary-button full-width" type="submit">Save order request <Check size={18} /></button>
            </form>
          </section>
        </div>
      )}

      {activeProduct && (
        <div className="overlay" role="presentation" onMouseDown={() => setActiveProduct(null)}>
          <section className="product-modal" role="dialog" aria-modal="true" aria-label={activeProduct.name} onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveProduct(null)} aria-label="Close product details"><X size={20} /></button>
            <ProductVisual product={activeProduct} />
            <div className="product-detail-copy"><p className="eyebrow"><span /> {activeProduct.vendor.toUpperCase()}</p><h3>{activeProduct.name}</h3><p className="detail-price">{money.format(activeProduct.price)}</p><p>{activeProduct.description}</p><ul>{activeProduct.specs.map((spec) => <li key={spec}><Check size={15} />{spec}</li>)}</ul><button className="button primary-button full-width" onClick={() => { addToCart(activeProduct); setActiveProduct(null); }}>Add to bag <Plus size={18} /></button></div>
          </section>
        </div>
      )}

      {activeVendor && (
        <div className="overlay" role="presentation" onMouseDown={() => setActiveVendor(null)}>
          <section className="vendor-modal" role="dialog" aria-modal="true" aria-label={`${activeVendor.name} store`} onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveVendor(null)} aria-label="Close seller details"><X size={20} /></button>
            <div className={`vendor-modal-mark ${activeVendor.palette}`}>{activeVendor.name.charAt(0)}</div><p className="eyebrow"><span /> INDEPENDENT SELLER</p><h3>{activeVendor.name}</h3><p>{activeVendor.description} Discover {activeVendor.products} pieces across {activeVendor.category.toLowerCase()}.</p><div className="vendor-modal-actions"><button className="button primary-button" onClick={() => { setQuery(activeVendor.name); setActiveVendor(null); document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" }); }}>View available pieces <ArrowRight size={17} /></button><button className="text-link" onClick={() => setActiveVendor(null)}>Back to stalls</button></div>
          </section>
        </div>
      )}
    </div>
  );
}
