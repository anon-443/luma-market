# Luma Market — Design Exploration

## Three directions considered

| Theme Name | Very Brief Intro | Probability |
| --- | --- | --- |
| Orchard Ledger | A warmly editorial market hall with produce-inspired colors, tactile paper texture, and catalog-like product presentation. It feels considered, local, and human. | 0.07 |
| Solstice Arcade | A vivid, atmospheric digital bazaar framed by celestial day-to-night transitions and oversized commerce objects. It is energetic without feeling like a conventional e-commerce template. | 0.04 |
| Studio Counter | A highly restrained gallery-commerce experience where the products do the talking through quiet typography and broad white space. It is calm, sparse, and premium. | 0.09 |

## Chosen approach: Solstice Arcade

### Design Movement
**Contemporary editorial maximalism** interpreted as a digital bazaar: generous, art-directed imagery; typographic contrast; and an asymmetrical composition that helps discovery feel like browsing a lively market rather than scanning a product table.

### Core Principles
1. **Discovery has a rhythm.** Large visual moments are interrupted by compact, information-rich bands so browsing stays energized.
2. **Warmth creates trust.** Ink, saffron, coral, and paper tones make a multi-vendor marketplace feel curated rather than anonymous.
3. **Motion should clarify.** Products lift, filters expand, and the mode toggle morphs with fast, tactile motion; decoration never delays a task.
4. **Every surface earns its depth.** Grain, layered curves, offset shadows, and soft blur provide material character in both modes.

### Color Philosophy
Day mode begins on **paper cream** with charcoal ink, accented by the ownable **Luma Saffron** (`#F5A524`): optimistic, familiar, and legible against both cream and ink. Coral red marks price and urgency; the cool teal is reserved for trust signals. Night mode changes the market into a deep indigo plaza, retaining saffron as a warm lantern color and adapting the rest into low-luminance, high-contrast variants. The theme never swaps palette blindly: it retains product legibility while the surrounding atmosphere changes.

### Layout Paradigm
The page is a **market promenade** rather than a centered stack. A narrow utility rail anchors the desktop left edge; the hero occupies a tall asymmetric split with a vertical statement column; subsequent sections alternate long horizontal browsing strips with offset editorial blocks. On small screens, this becomes a clear vertical journey with horizontal product scrollers.

### Signature Elements
1. A **sun/moon orbit** around the theme toggle and related circular details.
2. A **spectral arch**: a tall, softly curved product/image frame repeated in cards and promos.
3. **Price stickers**: rotated saffron labels with ink borders, used sparingly for deal signals and live market counts.

### Interaction Philosophy
Interactions should feel like handling a market object: buttons compress slightly on press, cards rise and reveal commerce controls on hover/focus, and search/filter interactions alter the browsing strip rather than throwing the user into a disconnected UI. Theme switching has a short global color transition plus a sunlight/constellation motif inside the hero.

### Animation
Use a sharp `cubic-bezier(0.23, 1, 0.32, 1)` easing at 160–260ms for controls. The hero uses a slow, low-amplitude float for the product collage and an orbiting accent; product collections enter in 55ms staggered increments. On theme switch, surfaces interpolate for 350ms while the theme toggle thumb travels along its orbit. Hover transforms are limited to `translateY`, `rotate`, and opacity; all nonessential motion is disabled with `prefers-reduced-motion`.

### Typography System
**DM Serif Display** provides the expressive, high-contrast headline voice. **Manrope** handles all interface, pricing, metadata, and body copy for a crisp utilitarian counterpoint. Headlines use tight tracking and fluid scale; labels are uppercase, small, tracked, and reserved for navigational context. Product prices use Manrope’s boldest weight to stay practical.

### Brand Essence
**A vivid marketplace for people who want one inspired place to discover independent sellers and everyday essentials.** Personality: **bright, discerning, kinetic**.

### Brand Voice
Headlines are specific and sensory; CTAs are action-led and human, avoiding generic exhortations.

> “The good kind of too much.”

> “Find a new favourite seller.”

### Wordmark & Logo
The wordmark uses a compact custom-feeling serif lockup where the **L** begins with a crescent-like curve. The graphic mark is a bold, textless **split sun**: a saffron disc cut by a deep indigo arc, visually expressing the two market atmospheres and readable at favicon size.

### Signature Brand Color
**Luma Saffron — `#F5A524`**

## Style Decisions

- Product cards prioritize **art-directed object photography** with tactile orbit/sticker overlays; abstract iconography is retained only as a compact secondary marker.
- Every major section carries at least one Solstice Arcade cue: a split-sun/orbit line, spectral arch, saffron sticker, or deep-indigo night-sky surface.
- **Luma Saffron** remains the primary market signal and is deliberately anchored by deep ink/indigo structure instead of soft pastels alone.
