# RYVT — Shopify theme

This is a Shopify theme, not a website. It has to keep this exact folder
structure at the root — `layout/`, `templates/`, `sections/`, `snippets/`,
`config/`, `assets/`, `locales/` — or Shopify rejects it with
"Branch isn't a valid theme."

## Installing it

**By zip (fastest).** Online Store → Themes → Add theme → Upload zip file.
Pick `ryvt-theme.zip`. Preview it, then Publish.

**By GitHub.** The repository root must be the theme — the folders above sitting
directly in the repo, not inside another folder and not alongside a static
website. Then: Online Store → Themes → Add theme → Connect from GitHub, and pick
the repository and branch.

If Shopify says the branch is not a valid theme, it is looking at a branch whose
root is not a theme. The static marketing site lives in a different repository;
the two cannot share one branch.

## For whoever maintains the store

See `CLIENT-GUIDE.md` — adding products, swapping video and photography,
editing copy, changing fonts and colours. No code required for any of it.

## For a developer

- `config/settings_schema.json` — the global settings, grouped by what a
  merchant is trying to do rather than by data type.
- `layout/theme.liquid` — turns every setting into a CSS custom property, so
  `assets/ryvt.css` reads variables and never hardcodes a merchant's choice.
- `snippets/section-style.liquid` — per-section colour scheme, typography
  override and spacing. Every section renders it.
- `snippets/product-card.liquid` — one card serves every grid. It falls back to
  the global Product cards settings, and any calling section can override any
  option for its own block.
