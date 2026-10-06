# Shopify plan

## Approach

Build a custom theme from Shopify's current free reference theme, and port the `site/` prototype into it as sections. Keep the scroll story as one custom section.

1. Install Shopify CLI (`npm install -g @shopify/cli`), create a development store from a Shopify Partners account.
2. `shopify theme init mauvelle-theme` (starts from Shopify's reference theme), then `shopify theme dev` for local preview.
3. Add brand tokens to the theme settings and a `mauvelle.css` from `site/styles.css`.
4. Port fonts: upload the woff2 files to theme `assets/`.
5. Sections to build:
   - `mauvelle-hero.liquid` (animated hero)
   - `mauvelle-story.liquid` (pinned GSAP story; vendor GSAP into `assets/`)
   - `mauvelle-details.liquid` (feature grid, blocks editable in the theme editor)
   - `mauvelle-how.liquid`, `mauvelle-faq.liquid`
6. Product template: gallery, price, subscription option, "what is inside" accordion, warnings.
7. Arabic: Shopify Markets + a second language (Arabic), RTL stylesheet for `[dir="rtl"]`.

## Store setup

- Products: Box of 6 · Bundle of 3 boxes · Subscription (box every 28 days) · Gift box (later)
- Apps (pick at setup): subscriptions, reviews with photos, email/SMS (Klaviyo or Shopify Email), WhatsApp chat, Arabic translation
- Pages: About, How it works, FAQ, Shipping and returns, Contact, Privacy, Terms
- Payments: check UAE options at setup (Shopify Payments availability, Tabby / Tamara for BNPL), COD via the courier
- Shipping: UAE flat rate + free above [AED XX]; courier or 3PL in Dubai

## Before go-live checklist

- Every claim on the store matches `product/claims-register.md`
- Warnings and ingredients on the product page
- Mobile check of the scroll story; reduced-motion fallback works
- Lighthouse performance above 85 on mobile
