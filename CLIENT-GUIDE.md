# Running the RYVT site

Everything on this site is editable without touching code. This guide is written
for whoever maintains the store day to day.

Two places do all the work: **Products** in the Shopify admin, and
**Online Store → Themes → Customize**, which is the visual editor. Nothing in
here requires a developer.

---

## Adding a product

Go to **Products → Add product** in the Shopify admin.

Fill in the title, description and price as normal. Three things are specific to
this theme and worth getting right, because they are what makes the grid look
consistent.

**Photographs.** Upload at least two. The first is what shows in the grid; the
second is what appears when someone hovers over the card. Shoot or crop them
tall — 3:4, so 1500 x 2000 pixels — because that is the shape the grid expects.
Every tile sits on a light grey ground, so a cut-out on a transparent or white
background and a full-bleed studio shot both land on the same surface and the
grid still reads as one thing. If a photo is a different shape it still works;
it just gets cropped to fit.

**Colour options.** If a product comes in more than one colour, add a variant
option named `Color` (or `Colour` — either spelling works). The theme reads
that option and draws the little swatch dots on the card automatically. Give
each value a real colour in **Settings → Products → Swatches** so the dots match
the garment. A product that only comes one way needs no option at all.

**Tags.** Tag a product `New` or `Bestseller` and the card gets a small label in
the corner. Sale badges appear on their own whenever you set a compare-at price,
and Sold Out appears on its own when stock runs out — you do not tag those.

To put a product in front of people, add it to a collection. The shop page shows
everything; the category tiles on the home page each point at one collection.

---

## Adding or changing a video

Two kinds of video live on this site.

**The landing film** — the full-screen video someone lands on. Customize →
the landing page → **Landing film**. Drop an MP4 in the Video field and a still
image in the Poster field. The poster is what shows while the video loads and on
phones where autoplay is blocked, so pick a frame that stands on its own.

**A video band inside a page** — the full-width panels between sections.
Customize → **Add section → Media band**, then upload into the Video field.
It plays silently on a loop. You can lay a heading and a button over it, or
leave the overlay text empty for a silent, edge-to-edge panel.

**A video on a product** — add it as product media in the admin, alongside the
photographs. The product card plays it on hover automatically.

Keep files under about 10 MB. Shopify hosts them, so nothing else is needed.

---

## Changing text

Every headline, caption, button and label is a field in Customize. Click the
section in the preview on the right and its settings open on the left.

The legal pages — terms, privacy, shipping, the social disclaimer — are ordinary
pages under **Online Store → Pages**, so they can be edited like any document.

---

## Changing fonts

Customize → **Theme settings → Typography**.

There are two typefaces. **Heading font** carries page titles, section titles
and product names. **Body font** carries everything you read. Change either and
the whole site follows — you never set a font page by page.

Underneath each are the controls for weight, size, letter spacing and
capitalisation. The size sliders are proportional: 100% is the size the site was
designed at, and everything scales together, so the hierarchy holds no matter
where you put them.

The **Small labels** group governs the spaced-out capitals — eyebrows, buttons,
category names, footer headings. They are treated separately because they behave
differently from body text at small sizes.

If one section needs a different typeface from the rest, open that section and
look under **Section type**. Leave those fields alone and the section inherits
the site's fonts, which is what you want almost always.

---

## Changing colours

Customize → **Theme settings → Colours**.

The palette is black and white by design, and the site is built so that
restraint is what makes the photography carry. Change one value at a time and
look at a product page before you save.

The groups are: **Page** (background, text, hairlines), **Product tiles** (the
grey behind every product photo), **Accents** (hover states, in stock, low
stock, sale price), **Buttons**, **Header** and **Footer**.

The one to be careful with is the product tile ground. Every tile uses it, so
changing it changes the whole grid at once — which is the point, but it means a
warm grey against cool photography shows up everywhere immediately.

Individual sections can override the page colours: open a section and use
**Colour scheme**, which offers white, an off-white band, sand, dark, or your
own two colours.

---

## Changing how product cards look

Customize → **Theme settings → Product cards**. This one panel governs every
grid on the site — shop, home page rails, search results.

You can set the image shape and whether photos fill the tile or fit inside it,
turn the hover photo on or off, and choose what appears on a card: category,
price, colour swatches, badges, the sold-out label, the little 01 / 02 / 03
numbers. You can also decide whether swatches sit there permanently or only
appear when someone hovers, which keeps the grid quiet at rest.

**Image fit** is the setting worth understanding. *Fill the tile* crops the
photo to the tile's shape — right for lifestyle and studio shots. *Fit inside*
shows the whole garment without cropping — right for cut-outs on a plain
background. Pick one and shoot to it; mixing the two is what makes a grid look
untidy.

---

## Layout and motion

**Layout** sets page width, how much space sits between sections, how far apart
the tiles sit, and how many products appear per row on desktop and on phones.

**Motion** turns the site's movement on and off: the fade-in as things scroll
into view, the numbers counting up from zero, and the slight zoom on product
photos. Anyone who has asked their device to reduce motion never sees any of it
regardless — that is handled automatically.

---

## A safe way to work

Before a big change, go to **Online Store → Themes**, open the **⋯** menu on the
live theme and choose **Duplicate**. Edit the copy, look it over, then publish
it. The original stays exactly as it was, so there is always a way back.

Changes in Customize are not live until you press **Save**.

---

## What still needs doing before launch

Every photograph currently on the site is a placeholder and the landing film is
a stand-in — real photography replaces them wherever an image or video field
appears, no code involved. Prices and product copy are provisional. The legal
pages need a lawyer and the real business details filled in.
