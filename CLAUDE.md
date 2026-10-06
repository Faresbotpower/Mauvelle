# Mauvelle

Mauvelle (Arabic: موڤيل) is an upscale brand of disposable, air-activated heat patches for period cramps. Founders: Tala Harmalani and Fares Abou Hassan, Dubai. Product is sourced from a Chinese OEM with our own packaging. First market: UAE. Sales: Shopify first, then Amazon.ae and Noon.

## Where things are

- `brand/` tokens (`tokens.json`, `tokens.css`), fonts, logos (SVG outlined + PNG), `brand-book.md`, `voice-and-copy.md`
- `product/` product spec, supplier RFQ message, claims register (what we can and cannot say)
- `packaging/` box and sachet specs with dielines notes, HTML mockups
- `business/` launch plan, UAE setup and compliance, unit economics, name research
- `site/` static website prototype (HTML, CSS, GSAP scroll story). Open `site/index.html` in a browser
- `shop/` Shopify build plan

Online references (owner access only):
- Brand system: https://claude.ai/artifact/23HE3Ahhdw5Rf1SyFDvzAU
- Logo and packaging canvas: https://claude.ai/artifact/MpyQKaP98o6xgGBZtUokhf

## Rules for every output

1. **No medical claims.** Never write "relieves pain", "treats", "cures", "medical-grade", "clinically proven". Use "soothing warmth", "comfort", "calm". Medical claims can force medical-device registration in the UAE.
2. **Claims need proof.** Before a claim ships on packaging or the live site, check `product/claims-register.md`. "Hypoallergenic" requires the supplier's dermatological test report.
3. **No em dashes** in any customer-facing copy. No exclamation marks. No emoji. Sentence case headlines.
4. **Bilingual.** Packaging and key pages carry English and Arabic. Arabic is clean, formal Modern Standard Arabic, addressed to a woman (feminine forms), never machine-translated without review.
5. **Colors only from tokens.** Lavender is the brand, cream the ground, plum the ink, apricot only as a small heat accent. Never put plum-muted text on lavender.
6. **Type.** Cormorant Garamond for headlines, Manrope for text, Noto Naskh Arabic for Arabic. Font files are in `brand/fonts/`.
7. **Logo.** Use the files in `brand/logo/` as they are. Never retype the wordmark in live text or redraw the crescent.
8. Placeholders in square brackets like `[AED XX]` are unknowns. Do not invent values for them.

## Site prototype notes

- `site/app.js` drives a pinned GSAP ScrollTrigger timeline: box turns, lid opens, sachet rises, strip tears, patch slides out, layers explode with leader-line callouts, back side with peeling liner, 8-hour ring.
- The 3D box is pure CSS (`.box` faces + `.box__hinge` lid). Exploded layers tween CSS variables `--rx`, `--rz`, `--y`.
- Callout leader lines are redrawn every tick from each layer's `.anchor` position.
- GSAP 3.15 is vendored in `site/vendor/` (free license, including ScrollTrigger).
- Test with `npx serve site` or open the file directly. Check 1440px and 390px widths and `prefers-reduced-motion`.

## Next build steps

1. Get supplier samples and test reports (see `product/`), then lock the final claims.
2. Turn `site/` into a Shopify theme (see `shop/shopify-plan.md`).
3. Replace mockup packaging with print-ready dielines from the chosen supplier's templates.
