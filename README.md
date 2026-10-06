# Mauvelle

Mauvelle's photographic campaign website and brand kit. The finished local preview includes six scroll chapters, an uncropped five-layer patch view with numbered explanations, responsive layouts, and a local signup form.

## Run locally

Requires Node.js 20 or newer. No dependency installation is needed.

```sh
npm run dev
```

Open http://localhost:4173. The server serves `site-campaign/` by default. Run `npm test` to verify static delivery and the signup endpoint.

## Deploy

`npm run build` creates `dist/`, containing only the public website, its 13 unique photographs, fonts, and logos. `vercel.json` selects static hosting explicitly, avoiding Vercel's automatic detection of the local `server.mjs` as a production function. Connect the repository to Vercel and deploy from its root.

The deployed site shows launch details instead of the local signup form. Connect a persistent email service before enabling production signups; the preview's local file storage is not suitable for Vercel functions.

Signup entries stay in `.local-data/waitlist.jsonl`, which is excluded from Git. No email service is connected. Product visuals are photorealistic concept images; full-resolution originals and prompts are included in `site-campaign/references/`.

## Project files

```
mauvelle/
├── CLAUDE.md                 project rules for Claude Code
├── brand/
│   ├── brand-book.md         colors, type, logo use, imagery, layout
│   ├── voice-and-copy.md     taglines, product copy EN + AR, social bios
│   ├── tokens.json / .css    design tokens
│   ├── fonts/                Cormorant Garamond, Manrope, Noto Naskh Arabic (OFL)
│   └── logo/                 outlined SVGs + png/ exports
├── product/
│   ├── product-spec.md       what we order from the OEM
│   ├── claims-register.md    every claim and the proof it needs
│   ├── supplier-rfq.md       message to send to suppliers
│   └── sample-test.md        how to test samples at home
├── packaging/
│   ├── box-spec.md
│   ├── sachet-spec.md
│   └── mockups/              open the .html files in a browser
├── business/
│   ├── launch-plan.md        step-by-step checklist to launch
│   ├── uae-setup.md          license, trademark, import, compliance
│   ├── unit-economics.csv    open in Google Sheets or Excel
│   └── name-research.md      why Mauvelle, domains, conflicts
├── site-campaign/            current photographic campaign website
├── site/                     original animated website prototype
├── site-v2/                  alternative website design
├── assets-source/            source image assets
├── server.mjs                local preview server and signup endpoint
├── tests/                    local server checks
└── shop/shopify-plan.md      how the prototype becomes the Shopify store
```

## Not decided yet

- Final logo direction (A Moonrise is used everywhere for now; B and C are in `brand/logo/alt-*`)
- Price, box count, supplier, exact specs (temperature, thickness, duration)
- Trademark search result for MAUVELLE in UAE classes 5 and 10
