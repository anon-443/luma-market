# Luma Market

**Luma Market** is an editorial multi-vendor marketplace experience for discovering independent studios and useful, design-led products. The interface combines an expressive storefront with practical browsing, cart, vendor, and checkout flows.

## Highlights

| Area | Included experience |
| --- | --- |
| Discovery | Product search, AI-assisted query suggestions, voice search, history, category, price, colour, popularity, price, and visitor-rating sorting |
| Shopping | Wishlist, quick view, product gallery with touch-friendly zoom, persistent cart, order estimate, checkout validation, and simulated payment state |
| Marketplace | Five vendor profiles, vendor-name search, individual maker pages, availability information, and contact links |
| Reviews | Visitor notes, aggregate rating summaries, and honest empty states when no review has been submitted |
| Visual system | A cream, teal, ink, ochre, and coral light experience with an optional ink-night dark theme, reduced-motion support, and original editorial product imagery |

## Technology

The project uses **React 19**, **TypeScript**, **Vite**, **Tailwind CSS**, **Wouter**, **tRPC**, **Drizzle**, and **Vitest**. The repository includes a full-stack runtime for the interactive marketplace and a static GitHub Pages build for presenting the storefront.

## Local development

Install dependencies and start the local development server:

```bash
pnpm install
pnpm dev
```

Run checks before committing:

```bash
pnpm check
pnpm test
pnpm build
```

## Environment variables

No secret values are committed. Local or hosted runtime features require environment variables such as `DATABASE_URL`, `JWT_SECRET`, `BUILT_IN_FORGE_API_URL`, and `BUILT_IN_FORGE_API_KEY`. Keep those values in an ignored `.env` file or a deployment provider’s secret store.

## GitHub Pages

The `build:pages` script produces a static presentation build under `dist/public`. The included GitHub Actions workflow publishes that build to GitHub Pages after pushes to `main`.

> GitHub Pages is a static showcase. Server-backed services, including authenticated checkout, live review persistence, AI-assisted search, and voice processing, require the full runtime deployment rather than Pages.

## License

This repository is available under the MIT License. Product photography and marketplace content are demonstration assets for this project.
