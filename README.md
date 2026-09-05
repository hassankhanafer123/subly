# Subly

Student subletting — vetted, marketed, and paid safely. iOS-first (Expo / React Native + TypeScript).

Sublet your student place when you leave for the summer, a co-op, or a semester abroad.
You stay on your lease; a vetted taker covers ~75% of your rent; Subly handles verification,
marketing, and the money (escrow via Stripe). Growth is per-campus through school reps.

## Run it on your iPhone (no Mac needed)
1. Install **Expo Go** from the App Store on your iPhone.
2. On this machine: `cd subly && npx expo start`
3. Scan the QR code with the iPhone Camera → it opens in Expo Go.
   (Phone and PC must be on the same Wi-Fi. If it won't connect, run `npx expo start --tunnel`.)

## The 4 tabs
- **List** — upload room + common-area photos, set dates/rent/asking price, attest the lease
  permits subletting → submits for review. Live fee calculator shows what you keep.
- **Find** — verified-only listings, filter by campus, request a place. Message the host.
- **Deal** — hosts pick their taker from requests; both sides track escrow + confirm move-out.
- **Pay** — Stripe Connect status, earnings, in-escrow count, Stripe Identity verification,
  and how escrow protects both sides.

The shield icon (top-right) opens the **Rep review** flow — the concierge step where a school
rep verifies a place before it goes live. The badge shows how many are pending.

## Architecture
- `App.tsx` — navigation (bottom tabs), rep-review modal, onboarding gate.
- `screens/` — one file per tab + onboarding.
- `lib/theme.ts` — design tokens.  `lib/ui.tsx` — shared components.
- `lib/types.ts` — domain models + economics (10% platform fee).
- `lib/schools.ts` — campus list (generic; add freely).
- `lib/store.tsx` — data layer. **Currently AsyncStorage (on-device) with seed data.**
  Swap this one module for Supabase to go live — nothing else changes.
- `lib/payments.ts` — Stripe Connect + Identity rail. **Runs keyless in demo mode** (mock
  escrow) today. Set `EXPO_PUBLIC_STRIPE_PK` + `EXPO_PUBLIC_API_BASE` to go live; the app
  never holds the secret key (a small server route does).

## Going live checklist
1. Stand up a Supabase project → replace `lib/store.tsx` internals.
2. Stripe: create Connect platform, add a server route for PaymentIntents/transfers/refunds,
   set the two env vars. Payments UI flips from DEMO to LIVE automatically.
3. Apple Developer account ($99/yr) → `eas build -p ios` → TestFlight → App Store.

## Verified
- `npx tsc --noEmit` → clean.
- `npx expo export --platform ios` → 2.3MB iOS bundle, exit 0 (all imports resolve).
