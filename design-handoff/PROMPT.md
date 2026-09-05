# PROMPT — paste this into OpenDesign

Design a premium iOS app called **Subly** — a subletting marketplace for
**anyone with a lease** who leaves their place for a while (traveling, working
remotely, an internship, away for the season, family reasons, studying abroad).
The leaseholder stays on their lease and sublets their place to a vetted
subletter at ~75% of rent, keeping the difference. Subly vets takers, markets
the place, and holds rent + deposit in escrow.

**Audience: general public, NOT students.** Never mention schools, campuses,
universities, or .edu email. Think Airbnb, not a campus board.

**Design system:** Airbnb. Full-bleed photography, Rausch coral (#FF385C) as
the ONLY accent, Ink Black (#222) text, white canvas, 14–20px photo rounding,
restrained soft shadows, one confident sans-serif. Content-first: the
interface disappears so the rooms breathe. See `airbnb-DESIGN.md`.

**Device frame:** iPhone 15 Pro. Design these screens (details in
`SCREENS.md`), each as a polished, real-content mockup — no lorem, no
placeholder gray boxes; use real room photography:

1. **Onboarding / welcome** — image-led, value prop, quick profile (name,
   email, city, reason-for-subletting chips).
2. **Explore** — the money screen. A feed of large 4:3 listing cards
   (photo, favorite heart, Verified pill, neighborhood + city, dates,
   $/month). City filter row on top. Make this look like Airbnb's home feed.
3. **Listing detail** — full-bleed photo, title, neighborhood, price/term/host
   stats, a "Request to sublet" primary button, escrow reassurance line.
4. **List your place** — clean multi-step form: photo upload, address +
   neighborhood, dates, rent + asking price, a live "you keep $X" calculator.
5. **My deals** — incoming requests (pick your subletter) + active deals with
   an escrow status ledger and a move-out action.
6. **Payments** — Stripe-backed: total earned, in-escrow count, identity
   verification, and an "how escrow protects you" explainer.

**Bottom tab bar:** Explore · List · Deals · Payments, coral active state.

Make it feel expensive and trustworthy. Restraint over decoration. One accent
element per screen. Real photography everywhere.
