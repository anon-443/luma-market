import { ArrowLeft, ArrowRight, ExternalLink, Mail, MapPin, ShoppingBag, Star } from "lucide-react";
import { Link, useRoute } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { products } from "@/data/products";
import { vendors } from "@/data/vendors";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function VendorStore() {
  const [, makerParams] = useRoute("/makers/:slug");
  const [, vendorParams] = useRoute("/vendor/:slug");
  const slug = vendorParams?.slug ?? makerParams?.slug;
  const vendor = vendors.find((candidate) => candidate.slug === slug);

  if (!vendor) {
    return <main className="vendor-store-page vendor-store-empty"><p className="eyebrow"><span /> LUMA MAKERS</p><h1>This seller stall has moved on</h1><Link className="text-link" href="/">Return to the market <ArrowRight size={16} /></Link></main>;
  }

  const vendorProducts = products.filter((product) => product.vendor === vendor.name);
  const reviewSummaries = trpc.reviews.summaries.useQuery();
  const productIds = new Set(vendorProducts.map((product) => product.id));
  const relevantSummaries = (reviewSummaries.data ?? []).filter((summary) => productIds.has(summary.productId));
  const reviewCount = relevantSummaries.reduce((total, summary) => total + summary.reviewCount, 0);
  const averageRating = reviewCount ? relevantSummaries.reduce((total, summary) => total + summary.averageRating * summary.reviewCount, 0) / reviewCount : 0;

  return (
    <main className="vendor-store-page">
      <header className="vendor-store-nav">
        <Link href="/" className="vendor-back"><ArrowLeft size={17} /> Back to the market</Link>
        <span className="vendor-store-wordmark">Luma <b>/</b> Maker store</span>
      </header>

      <section className={`vendor-store-hero ${vendor.palette}`}>
        <div className="vendor-store-mark" aria-hidden="true">{vendor.name.charAt(0)}</div>
        <div>
          <p className="eyebrow"><span /> INDEPENDENT SELLER</p>
          <h1>{vendor.name}</h1>
          <p className="vendor-store-tagline">{vendor.description}</p>
          <p className="vendor-store-story">{vendor.story}</p>
        </div>
        <aside className="vendor-store-facts" aria-label={`${vendor.name} store information`}>
          <span><MapPin size={16} />{vendor.location}</span>
          <span><ShoppingBag size={16} />{vendorProducts.length} available finds</span>
          <a href={`mailto:${vendor.contactEmail}?subject=Enquiry%20for%20${encodeURIComponent(vendor.name)}`}><Mail size={16} />Contact this seller</a>
        </aside>
      </section>

      <section className="vendor-store-content">
        <div className="vendor-store-heading"><div><p className="eyebrow"><span /> SHOP THE STALL</p><h2>Available finds</h2></div><a className="vendor-contact-link" href={`mailto:${vendor.contactEmail}?subject=Enquiry%20for%20${encodeURIComponent(vendor.name)}`}><Mail size={15} />{vendor.contactEmail}</a></div>
        {vendorProducts.length ? <div className="vendor-product-grid" id="available-finds">{vendorProducts.map((product) => <article className="vendor-product-card" key={product.id}><img src={product.image} alt={product.name} style={{ objectPosition: product.imagePosition }} /><div><p>{product.category}</p><h3>{product.name}</h3><span>{money.format(product.price)}</span></div><Link href={`/product/${product.id}`} className="vendor-product-link">View product <ArrowRight size={15} /></Link></article>)}</div> : <div className="vendor-products-empty"><ShoppingBag size={22} /><p>New pieces from {vendor.name} are being prepared for the market floor.</p><Link href="/" className="text-link">Browse every seller <ArrowRight size={16} /></Link></div>}

        <section className="vendor-review-handoff" aria-label="Product reviews">
          <Star size={20} />
          <div>
            <p className="eyebrow"><span /> VISITOR NOTES</p>
            <h2>{reviewCount ? `${reviewCount} notes across this stall` : "Reviews stay with the object"}</h2>
            <p>{reviewCount ? `${averageRating.toFixed(1)} / 5 from visitor-submitted product notes. Open any available find to read the original comments and ratings.` : "No visitor notes have been submitted for this seller’s available pieces yet. Reviews will appear here once shoppers add them to a product."}</p>
          </div>
          <a href="#available-finds" onClick={() => toast.info("Choose a product to read its visitor notes")}>Explore product reviews <ExternalLink size={16} /></a>
        </section>
      </section>
    </main>
  );
}
