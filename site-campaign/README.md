# Mauvelle campaign preview

Run `npm run dev` from the Mauvelle project root and open http://localhost:4173.
Node 20 or newer is sufficient; there are no install-time dependencies.

The local server serves this isolated `site-campaign/` design at `/`. The original
`site/` and separately created `site-v2/` remain independent because another
process was editing them during this redesign. Shared logos and fonts are loaded
from `brand/`. GSAP and ScrollTrigger are bundled locally in `vendor/`.

## Interactions

- Photorealistic lavender packaging hero with gentle scroll movement.
- Six photographic scroll chapters, with direct chapter buttons and crossfades.
- Photorealistic five-layer patch concept image.
- Three selectable wearing-ritual photographs: open, place, and settle in.
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
lifestyle image remains in use.

Optimized website files in `assets/`:

- `product-hero.webp`: box, sachet and patch still life; hero, first chapter, signup.
- `sachet-opening.webp`: hands opening the sachet; second chapter and ritual.
- `patch-texture.webp`: fabric detail; third chapter.
- `patch-layers.webp`: five-layer material concept; fourth chapter.
- `patch-peel.webp`: hands peeling the liner; fifth chapter.
- `patch-placement.webp`: patch over opaque clothing; placement ritual.
- `quiet-moment.webp`: existing lifestyle image; editorial and final ritual.

Full-resolution product PNGs are preserved in `references/product-originals/`.
Exact prompts, input references, generation method and source paths are recorded
in `references/photo-prompts.json`. WebP conversion preserves the image content
and reduces transfer size. All assets are served locally; no image CDN is needed.

The photographic update was checked on desktop and at 390px mobile. All six chapter
buttons select their matching photo and caption; the placement control displays
the wearing image. Browser checks found no failed images, horizontal overflow,
or current site JavaScript errors. The local server tests remain unchanged.
