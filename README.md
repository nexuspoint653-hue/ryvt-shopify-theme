# RYVT — Shopify Theme

The RYVT redesign as a Shopify Online Store 2.0 theme: slide-in search panel,
full-width mega menu, categorised product rows, inline collection filters,
three-column product page, and a two-panel footer.

---

## Before this can connect

Shopify's GitHub integration syncs a theme **into a store**. There must be a
Shopify store for RYVT first — the theme cannot connect to nothing, and it must
not be connected to the Laya store.

1. Create a Shopify store for RYVT.
2. Push this repo to GitHub (its own repo — not the React components repo).
3. In that store: Online Store → Themes → Add theme → Connect from GitHub → pick
   this repo and the `main` branch.
4. Preview, then Publish when ready.

---

## What the sections do

| Section | Purpose |
| --- | --- |
| `header` | Sticky header, mega menu built from your navigation, search panel, mobile drawer |
| `hero` | Full-bleed image with overlay copy |
| `story-block` | The Renaissance Tee storytelling block — kept close to the original |
| `category-row` | Full-bleed categorised row that never leaves empty cells |
| `editorial-split` | Two-panel footer split |
| `footer` | Newsletter and link columns |
| `main-collection` | Inline filters, adaptive grid, gap filling |
| `main-product` | Three-column PDP with variant picker and trust rows |
| `related-products` | Complete the Look |

## The dead-space rules, in code

`category-row` closes a short row with a promo tile and tightens the column
count, so cards grow instead of leaving grey cells. `main-collection` fills a
thin result set with suggestions rather than white space — turn it off with the
**Fill short rows with suggestions** setting if the owner prefers honest gaps.

## Navigation drives the mega menu

A top-level menu item's children become the flyout columns; their children become
the links. Add a menu item in **Navigation** and the flyout updates. The image
card beside each flyout is a **Mega menu image** block on the Header section,
positioned by menu index.

## Search panel

Popular searches are a comma-separated Header setting. The category tiles are
**Search panel tile** blocks. The fabric links come from a menu you choose.

## Ratings

`snippets/rating.liquid` reads `product.metafields.reviews.rating` and
`rating_count` — the convention used by Shopify Product Reviews and Judge.me.
With no review app installed it renders nothing rather than fake stars. Install a
review app and the stars appear on cards and the PDP automatically.

## Colour swatches

Swatches read from product option values. Set them up under
**Settings → Products → Swatches** so the filter bar and PDP show real colours.

## Local development

```bash
npm i -g @shopify/cli
shopify theme dev --store <your-ryvt-store>.myshopify.com
shopify theme check
```
