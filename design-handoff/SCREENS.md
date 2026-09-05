# SCREENS — content & layout intent

Real content below — use it verbatim so the mockup isn't lorem. Photos: use
warm, real apartment interiors (Unsplash-style), never gray placeholders.

## 1. Onboarding
- Full-bleed hero photo of a sunlit apartment. Dark scrim bottom.
- Wordmark: key icon in a coral rounded square + "subly" (white, over photo).
- Hero headline: "Away for a while? Sublet it."
- Sub: "Traveling, working remote, or just gone for the season — hand your
  place to a vetted subletter and keep ~75% of your rent."
- Sheet slides up: name, email, city chips (Boston, New York, SF, LA, Chicago,
  Seattle, Austin, DC), "Why might you sublet?" icon-chips (Traveling ✈,
  Working remotely 💻, Internship 💼, Away for summer ☀, Family 🏠, Studying
  abroad 🌍), optional referral code, coral "Get started" CTA.
- Trust row: Vetted takers · Escrow-safe · Keep ~75%.

## 2. Explore (hero screen — make it gorgeous)
- Title "Explore", sub "Vetted sublets you can move into".
- Horizontal city filter pills (active = black).
- Feed of listing cards, each:
  - 4:3 photo, rounded 20px
  - top-left white "✓ Verified" pill, top-right favorite heart
  - line 1 (bold): "Fenway, Boston"   + small reason tag on the right
  - line 2 (dim): "Sunny room in a bright Fenway apartment"
  - line 3 (faint): "Jun 1 – Aug 31"
  - price: "$1,050 / month" (month in dim)
- Example listings:
  1. Fenway, Boston — Sunny room in a bright Fenway apartment — $1,050/mo — Internship
  2. Williamsburg, New York — Cozy 1-bed steps from the L — $1,950/mo — Working remotely
  3. Back Bay, Boston — Furnished studio, away for summer — $1,350/mo — Traveling

## 3. Listing detail (bottom sheet over photo)
- Full-bleed hero photo, circular close (top-left), heart.
- "Fenway, Boston" (H2) · title · address.
- Stat row: Price $1,050/mo · Term 3 months · Host Maya.
- Divider · "Message to host" input.
- Coral "Request to sublet" button.
- Faint line: "Rent & deposit are held in escrow by Subly. You never pay a
  stranger directly."

## 4. List your place
- "List your place" heading, sub "Photos, dates, price. We verify, market it,
  and handle the money."
- Photo upload row (room + common areas), dashed add-tiles.
- Fields: title, address, neighborhood, start/end date, your monthly rent,
  asking price.
- Toggle: "My lease permits subletting" (attestation, faint: you stay liable).
- Live calc card: Term 3 mo · Subly fee (10%) −$315 · You keep $2,835 (green).
- Coral "Submit for review" CTA.

## 5. My deals
- Section "Requests to your place": card with taker name, message, "Pick as
  subletter" (coral) + "Decline" (outline).
- Section "Active deals": card with title, neighborhood, HOST/TAKER tag, and an
  escrow ledger (Rent escrow: Held · Deposit escrow: Held · Subly fee $315),
  then "Confirm move-out & release" (green) → "Completed" state.

## 6. Payments
- "Payments", sub "Money moves through Stripe — Subly never holds your cash."
- Card: Stripe Connect status (DEMO/LIVE badge).
- Two stat cards: Total earned $2,835 (green) · In escrow 1 (coral).
- Identity verification card + "Verify my ID" CTA.
- "How escrow protects you" list: funds held by Stripe, released after move-in,
  deposit auto-refunds, 10% fee auto-taken.

## Tab bar
Explore · List · Deals · Payments — coral active icon+label.
