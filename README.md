# Luma Market

**Luma Market** is a responsive multi-vendor marketplace for discovering independently made homeware, accessories, technology, and stationery. It pairs an editorial storefront with practical browsing, product comparison, seller pages, wishlist, cart, and a clearly labelled **demo checkout**. The project preserves its static, portfolio-friendly catalog while providing a complete interactive shopping journey.

> The checkout is a demonstration flow. It validates delivery details and saves a local order request, but it never processes a payment or submits a real order.

## Marketplace capabilities

| Area | Included experience |
| --- | --- |
| Discovery | Search objects or makers, optional voice input, recent searches, category filters, visible minimum/maximum price bounds, availability, and featured/popular/rating/price sorting |
| Product detail | Direct product URLs, images with lightbox and zoom, specifications, quantity selector, wishlist, sharing, related products, visitor review form, and honest empty review states |
| Marketplace | Five seller profiles with descriptions, categories, locations, contact email addresses, static product counts, seller search matches, and direct vendor URLs |
| Shopping | Persistent client-side cart, quantity changes, delivery estimate, wishlist, local order history, comparison of up to three products, and saved comparison sets |
| Checkout | A direct `/checkout` demo route with order summary, client-side delivery-form validation, a simulated processing state, local order persistence, and a return-to-market action |
| Accessibility and visual design | Day/night theme, responsive desktop/tablet/mobile layouts, keyboard-accessible buttons, visible labels, lazy/async lower-page imagery, reduced-motion support, and shopper Full/Soft/Still motion controls |

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Marketplace landing page, discovery controls, product rail, seller list, story, cart, and profile |
| `/product/:id` | Direct product-detail experience, including gallery, detail actions, reviews, related finds, and quantity selector |
| `/vendor/:slug` | Direct seller profile with seller facts, contact action, available products, and product-review handoff |
| `/makers/:slug` | Backward-compatible maker-store URL for existing links |
| `/compare` | Side-by-side comparison board with locally saved named comparison sets |
| `/checkout` | Direct demo checkout, delivery validation, simulated confirmation, and return-to-market flow |

## Project structure

```text
client/src/
├── data/
│   ├── products.ts        # Typed static product catalog and product-image records
│   └── vendors.ts         # Typed static seller profile and contact records
├── pages/
│   ├── Home.tsx           # Marketplace, product detail, cart, checkout, profile, and discovery UI
│   ├── VendorStore.tsx    # Individual seller profile pages
│   └── CompareProducts.tsx# Product comparison and saved comparison sets
├── App.tsx                # Client routes
└── index.css              # Responsive editorial visual system and motion rules

server/
├── routers.ts             # Existing tRPC procedures for reviews and discovery enhancements
└── db.ts                  # Existing database helpers
```

## Static data and local persistence

The catalog and seller information live in typed modules under `client/src/data/`. Products include an ID, seller reference, category, price, static availability, descriptive specifications, product image records, featured status, and `null` rating fields. Seller data includes a stable ID/slug, categories, product count, location, contact address, and description. Ratings are never invented: an unrated product or seller displays an honest empty state until a visitor submits a review.

The demo storefront keeps shopper-only state in browser `localStorage` so a refresh does not discard it. `luma-cart`, `luma-wishlist`, `luma-comparison`, `luma-saved-comparisons`, `luma-order-history`, and `luma-search-history` hold the relevant local records. Theme, motion, tour, and preference settings use separate local keys. This state is intentionally device-local and is not a production order system.

## Local development

Install dependencies and start the development server:

```bash
pnpm install
pnpm dev
```

Run the required quality checks before committing:

```bash
pnpm check
pnpm test
pnpm build
```

## Environment and deployment

No secret values are committed. Full-runtime features may use variables including `DATABASE_URL`, `JWT_SECRET`, `BUILT_IN_FORGE_API_URL`, and `BUILT_IN_FORGE_API_KEY`; store them in an ignored local environment file or the deployment secret store.

The `build:pages` script creates the static GitHub Pages presentation build in `dist/public`. The included workflow deploys this build after pushes to `main`. Static Pages presents the client experience, while server-backed review persistence and AI discovery require the full runtime deployment.

## License

This repository is available under the MIT License. Product photography and marketplace copy are demonstration assets created for this project.
