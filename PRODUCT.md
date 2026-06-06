# Product

## Register

brand

<!-- Note: collection.html and blog.html are product-register sub-surfaces (browsable data UI, article reading).
     When working on those pages specifically, treat them as product register. -->

## Users

Three overlapping groups, all arriving with low patience:

- **Recruiters and hiring managers** — scanning for role fit in under 30 seconds. They need credentials, stack, and a contact path without friction.
- **Research community** — ML peers and academics checking publications and technical depth. They want specifics, not summaries.
- **Professional contacts** — people who met Egemen at a conference or via LinkedIn, verifying he's credible before following up.

All three are evaluating competence. None are here to be entertained.

## Product Purpose

A personal site that functions as both a professional credential and a working hub. The homepage earns trust fast; the collection page and blog carry the personality and depth. Success means a visitor leaves with a clear picture of what Egemen does, why it matters, and how to reach him — without having read everything.

## Brand Personality

Anchored in the DHL identity (yellow `#FFCC00`, red `#D40511`) but personally owned — not a corporate clone. The DHL palette is a feature, not a constraint: it signals that Egemen's work and employer are the same thing.

Three words: **credible, precise, grounded.**

Emotional target: confidence, not ambition. The work speaks; the site amplifies it.

## Anti-references

- **Generic SaaS landing page** — hero metrics, gradient text cards, "supercharge your workflow" copy, numbered section eyebrows. None of this.
- **Minimal all-white academic CV** — no personality, no color, a document pretending to be a website.
- **Over-designed agency portfolio** — heavy motion, full-screen reveals, style asserting itself louder than content.

The site is not trying to impress designers. It is trying to impress engineers and hiring managers who have seen too many polished portfolios and too few people who ship.

## Design Principles

1. **Evidence over assertion.** Show specific outputs (paper titles, conference names, tech stacks, statuses) rather than adjectives. "Research published at IEEE UBMK 2025" beats "impactful ML research."

2. **The DHL palette is a claim.** Yellow and red aren't decorative — they signal that Egemen's professional identity and his employer are aligned. Every design decision either reinforces that claim or undermines it.

3. **Skim-first hierarchy.** Recruiters have 20 seconds. Structure every section so the key point is readable without clicking, scrolling into detail, or parsing dense prose.

4. **Sub-pages carry the same craft.** The collection page and blog are not afterthoughts. Quality that appears only on the homepage reads as a facade.

5. **Each element earns its place.** No card grids, no animations, no section dividers added by reflex. If removing it loses nothing, it shouldn't be there.

## Accessibility & Inclusion

- Target WCAG AA (4.5:1 body text, 3:1 large text).
- All interactive elements keyboard-navigable with visible focus rings (already using `--dhl-yellow` outline).
- Reduced motion: all animations must have `@media (prefers-reduced-motion: reduce)` alternatives.
- The DHL red `#D40511` on `--paper` and on white needs contrast verification — red on warm-cream can fall below 4.5:1 for small text.
