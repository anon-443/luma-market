import { ArrowLeft, Check, Scale, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { availabilityLabel, nextComparisonIds, products } from "./Home";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function CompareProducts() {
  const [, setLocation] = useLocation();
  const [selectedIds, setSelectedIds] = useState<number[]>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("luma-comparison") ?? "[]") as unknown[];
      return stored.filter((id): id is number => typeof id === "number" && products.some((product) => product.id === id)).slice(0, 3);
    } catch { return []; }
  });
  const selectedProducts = useMemo(() => products.filter((product) => selectedIds.includes(product.id)), [selectedIds]);

  useEffect(() => { localStorage.setItem("luma-comparison", JSON.stringify(selectedIds)); }, [selectedIds]);

  const toggleProduct = (productId: number) => {
    setSelectedIds((current) => nextComparisonIds(current, productId));
  };

  return <div className="market-shell atelier-index comparison-page">
    <header className="site-header comparison-header">
      <button className="comparison-back" onClick={() => setLocation("/")}><ArrowLeft size={17} /> Back to market</button>
      <a className="brand" href="/" aria-label="Luma Market home"><span className="brand-disc" aria-hidden="true" /><span>Luma</span></a>
      <span className="comparison-header-note"><Scale size={15} /> OBJECT COMPARISON</span>
    </header>
    <main className="comparison-main">
      <section className="comparison-intro">
        <p className="eyebrow"><span /> A CLEARER LOOK</p>
        <h1>Compare the <em>considered</em> details</h1>
        <p>Keep up to three finds side by side to compare maker, material, colour, availability, and price before you decide.</p>
      </section>

      {!selectedProducts.length ? <section className="comparison-empty"><Scale size={32} /><h2>No products selected</h2><p>Choose up to three products from the market to start a focused comparison.</p><button className="button primary-button" onClick={() => setLocation("/")}>Browse the market <ArrowLeft size={16} /></button></section> : <>
        <section className="comparison-board" aria-label="Selected product comparison">
          <div className="comparison-label-column"><span>Find</span><span>Maker</span><span>Category</span><span>Colour</span><span>Availability</span><span>Details</span><span>Price</span></div>
          <div className="comparison-products" style={{ "--compare-columns": selectedProducts.length } as React.CSSProperties}>{selectedProducts.map((product) => <article key={product.id} className="comparison-product">
            <div className="comparison-image"><img src={product.image} alt={product.name} style={{ objectPosition: product.imagePosition }} /><button onClick={() => toggleProduct(product.id)} aria-label={`Remove ${product.name} from comparison`}><X size={16} /></button></div>
            <div className="comparison-name"><b>{product.name}</b></div>
            <div>{product.vendor}</div>
            <div>{product.category}</div>
            <div>{product.color}</div>
            <div><span className={`comparison-availability ${product.inventoryStatus}`}><i />{availabilityLabel(product)}</span></div>
            <ul>{product.specs.map((spec) => <li key={spec}><Check size={13} />{spec}</li>)}</ul>
            <strong>{money.format(product.price)}</strong>
          </article>)}</div>
        </section>
        <section className="comparison-picker" aria-labelledby="comparison-picker-heading"><div><p className="eyebrow"><span /> CHANGE THE LINEUP</p><h2 id="comparison-picker-heading">Add one more find</h2></div><div>{products.filter((product) => !selectedIds.includes(product.id)).slice(0, 6).map((product) => <button key={product.id} onClick={() => toggleProduct(product.id)} disabled={selectedIds.length >= 3}><img src={product.image} alt="" /><span><b>{product.name}</b><small>{product.vendor} · {money.format(product.price)}</small></span></button>)}</div></section>
      </>}
    </main>
  </div>;
}
