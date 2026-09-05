// Stripe payment rail — card charge in, payout out (after Subly's 20%).
//
// FLOW (all native Stripe Connect — no third party needed):
//   1. Subletter pays rent on their debit/credit card via Stripe PaymentSheet
//      -> a Connect DESTINATION CHARGE.
//   2. Subly's 20% is taken automatically via application_fee_amount.
//   3. The remaining 80% lands in the host's connected account, then pays
//      out to their bank (standard) or eligible debit card (instant payout).
//
// Subly never holds funds itself (Stripe is the licensed party), so there is
// no money-transmitter exposure.
//
// Runs KEYLESS in demo mode (mock) so the app works today. To go live:
// set EXPO_PUBLIC_STRIPE_PK + EXPO_PUBLIC_API_BASE (a small server that
// creates PaymentIntents / Connect payouts with your SECRET key — never in-app).

import { PLATFORM_FEE_RATE } from './types';

const STRIPE_PK = process.env.EXPO_PUBLIC_STRIPE_PK ?? '';
const API_BASE = process.env.EXPO_PUBLIC_API_BASE ?? '';

export const stripeConfigured = Boolean(STRIPE_PK && API_BASE);

export interface RentQuote {
  monthlyRent: number;
  months: number;
  rentTotal: number;
  platformFee: number;   // Subly's 20%
  hostReceives: number;  // 80% paid out to host
}

export function quoteRent(monthlyRent: number, months: number): RentQuote {
  const rentTotal = monthlyRent * months;
  const platformFee = Math.round(rentTotal * PLATFORM_FEE_RATE);
  return { monthlyRent, months, rentTotal, platformFee, hostReceives: rentTotal - platformFee };
}

async function api<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

// 1. Charge the subletter's card. Returns a PaymentSheet client secret in
//    production, or a mock success in demo.
export async function chargeRent(dealId: string, amountCents: number) {
  if (!stripeConfigured) {
    await new Promise((r) => setTimeout(r, 700));
    return { mock: true, status: 'charged' as const, dealId, amountCents };
  }
  return api<{ clientSecret: string }>('/rent/charge', { dealId, amountCents });
}

// 2. Pay the host their 80% (Stripe payout to bank / instant to debit card).
export async function payoutHost(dealId: string) {
  if (!stripeConfigured) {
    await new Promise((r) => setTimeout(r, 500));
    return { mock: true, status: 'paid_out' as const, dealId };
  }
  return api<{ status: string }>('/rent/payout', { dealId });
}

// Refund a rent charge (e.g. cancellation).
export async function refundRent(dealId: string) {
  if (!stripeConfigured) {
    await new Promise((r) => setTimeout(r, 500));
    return { mock: true, status: 'refunded' as const, dealId };
  }
  return api<{ status: string }>('/rent/refund', { dealId });
}

// Onboard the host to receive payouts (Stripe Connect account link).
export async function connectPayoutAccount(email: string) {
  if (!stripeConfigured) {
    await new Promise((r) => setTimeout(r, 600));
    return { mock: true, connected: true, email };
  }
  return api<{ url: string }>('/connect/onboard', { email });
}

// Government-grade identity verification: state ID document + 3rd-party
// facial-recognition liveness match (Stripe Identity does exactly this —
// document + selfie biometric check).
export async function startIdentityCheck(email: string) {
  if (!stripeConfigured) {
    await new Promise((r) => setTimeout(r, 1200)); // simulate ID scan + face match
    return { mock: true, verified: true, email };
  }
  return api<{ url: string }>('/identity/start', { email });
}
