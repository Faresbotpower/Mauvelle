# Mauvelle campaign preview

Run `npm run dev` from the Mauvelle project root and open http://localhost:4173.
Node 20 or newer is sufficient; there are no install-time dependencies.

The local server serves this isolated `site-campaign/` design at `/`. The original
`site/` and separately created `site-v2/` remain independent because another
process was editing them during this redesign. Shared logos and fonts are loaded
from `brand/`. GSAP and ScrollTrigger are bundled locally in `vendor/`.

## Interactions

- Photorealistic lavender packaging hero with gentle scroll movement.
- Six photographic scroll chapters, with direct chapter buttons and directional image reveals.
- Photorealistic five-layer patch concept image.
- Three selectable wearing-ritual photographs, with previous/next controls and horizontal swipe support.
- An editorial portrait and floating tote photograph, scroll-linked typography, and navigation progress.
- Responsive menu, native FAQ disclosures, keyboard focus and reduced-motion styles.
- Local waitlist with email validation, duplicate handling, pending and error states.

Email entries are saved only to `.local-data/waitlist.jsonl`. No email service is
connected and no messages are sent. This folder is excluded from Git. Pricing,
pack size and duration claims remain unconfirmed, so the campaign does not promise
them. The layer model is presented as a concept.

## Verification

`npm test` verifies local static asset delivery, private-file exclusion, invalid
input, oversized requests, persistence and duplicate handling using an isolated
temporary data directory. Browser checks covered 1440px desktop and 390px mobile,
chapter selection, ritual selection, mobile menu, local form submission, image
loading, anchor targets and returning to the hero after navigation.

## Photorealistic imagery

Six new product images replace every CSS-drawn box, sachet and patch. They were
created with the built-in image-generation tool using the supplied packaging and
logo references. Like the Nashat reference site, these are photorealistic concept
images, not camera photographs of manufactured samples. The existing sunlit
lifestyle image of a woman holding a cup has been removed from every campaign placement.

Optimized website files in `assets/`:

- `product-hero.webp`: box, sachet and patch still life; hero only.
- `unboxed.webp`: open box; first chapter.
- `sachet-opening.webp`: hands opening the sachet; second chapter only.
- `patch-texture.webp`: fabric detail; third chapter.
- `patch-layers.webp`: five-layer material concept; fourth chapter.
- `patch-peel.webp`: hands peeling the liner; fifth chapter.
- `patch-placement.webp`: patch over opaque clothing; placement ritual.
- `morning-stretch.jpg`: sixth chapter.
- `courtyard-walk.jpg`: editorial portrait.
- `on-the-go-branded.webp`: editorial tote inset.
- `opening-ritual-branded.webp`: first ritual step.
- `your-day.jpg`: final ritual step.
- `vanity-still-life-branded.webp`: launch section.

The seven replacement/additional photographs were selected from the existing
`site-v2/assets/` library, with originals retained under `assets-source/`. No new
image generation was needed for this refresh. Each of the 13 campaign images has
exactly one placement. The image-uniqueness test also checks file hashes to catch
renamed duplicates. Repeated brand marks are intentionally retained.

Full-resolution product PNGs are preserved in `references/product-originals/`.
Exact prompts, input references, generation method and source paths are recorded
in `references/photo-prompts.json`. WebP conversion preserves the image content
and reduces transfer size. All assets are served locally; no image CDN is needed.

The photographic update was checked on desktop and at 390px mobile. All six chapter
buttons select their matching photo and caption; the placement control displays
the wearing image. Browser checks found no failed images, horizontal overflow,
or current site JavaScript errors. The local server tests remain unchanged.

The opening-ritual and vanity photographs were subsequently edited with the
built-in image tool to apply the supplied Mauvelle crescent and wordmark, plus
matching product labels. Edit prompts and references are in
`references/branding-edits.json`; full-resolution edits are preserved in
`references/product-originals/`. Original scenes remain archived.

The tote inset also uses the branded sachet edit. Its prompt and source references
are recorded in `references/tote-branding-edit.json`.
