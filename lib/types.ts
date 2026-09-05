// Domain models for Subly. Generic subletting platform.

export type CityId = string;

export interface CurrentUser {
  name: string;
  email: string;
  cityId: CityId;
  reason?: string;         // why they're likely to sublet
  repCode?: string;        // referral code from a local rep, if any
  identityVerified?: boolean; // state ID + facial recognition passed
}

export type ListingStatus = 'pending' | 'verified' | 'rejected';

export interface Listing {
  id: string;
  ownerName: string;
  ownerEmail: string;
  cityId: CityId;
  neighborhood: string;   // e.g. "Fenway", "Williamsburg"
  title: string;
  address: string;
  reason?: string;        // why the host is subletting
  roomPhotos: string[];
  commonPhotos: string[];
  startDate: string;
  endDate: string;
  monthlyRent: number;    // what owner pays landlord
  askingPrice: number;    // what taker pays (the ~75%)
  leasePermits: boolean;  // attestation
  proofOfResidency: string[]; // uploaded docs proving they live here (lease/bill/etc.)
  status: ListingStatus;
  createdAt: number;
  repCode?: string;
}

export type RequestStatus = 'pending' | 'accepted' | 'declined';

export interface SubRequest {
  id: string;
  listingId: string;
  takerName: string;
  takerEmail: string;
  message: string;
  status: RequestStatus;
  createdAt: number;
}

export type PayStatus = 'not_started' | 'held_in_escrow' | 'released' | 'refunded';

export interface Deal {
  id: string;
  listingId: string;
  takerName: string;
  takerEmail: string;
  rentStatus: PayStatus;
  depositStatus: PayStatus;
  movedOut: boolean;
  createdAt: number;
}

export interface AppData {
  user: CurrentUser | null;
  listings: Listing[];
  requests: SubRequest[];
  deals: Deal[];
}

// Platform economics
export const PLATFORM_FEE_RATE = 0.2; // 20% of sublet rent (Subly's cut)
export const DEPOSIT_MULTIPLIER = 1;

export function platformFee(monthlyAsking: number, months: number) {
  return Math.round(monthlyAsking * months * PLATFORM_FEE_RATE);
}

export function monthsBetween(startISO: string, endISO: string) {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const days = Math.max(0, (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.round(days / 30));
}
