import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppData, CurrentUser, Listing, SubRequest, Deal,
  ListingStatus, RequestStatus,
} from './types';

const KEY = 'subly:data:v4';

// ---- Seed data so the app demos well on first open ----
const seedListings: Listing[] = [
  {
    id: 'seed-1',
    ownerName: 'Maya Chen',
    ownerEmail: 'maya@example.com',
    cityId: 'boston',
    neighborhood: 'Fenway',
    title: 'Sunny room in a bright Fenway apartment',
    address: '123 Hemenway St, Boston',
    reason: 'assignment',
    roomPhotos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    commonPhotos: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    monthlyRent: 1400,
    askingPrice: 1050,
    leasePermits: true,
    proofOfResidency: [],
    status: 'verified',
    createdAt: Date.now() - 86400000 * 3,
    repCode: 'BOS-AVA',
  },
  {
    id: 'seed-2',
    ownerName: 'Diego Alvarez',
    ownerEmail: 'diego@example.com',
    cityId: 'nyc',
    neighborhood: 'Williamsburg',
    title: 'Cozy Williamsburg 1-bed, steps from the L',
    address: '45 Bedford Ave, Brooklyn',
    reason: 'remote',
    roomPhotos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    commonPhotos: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'],
    startDate: '2026-09-01',
    endDate: '2026-12-20',
    monthlyRent: 2600,
    askingPrice: 1950,
    leasePermits: true,
    proofOfResidency: [],
    status: 'verified',
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    id: 'seed-3',
    ownerName: 'Priya Nair',
    ownerEmail: 'priya@example.com',
    cityId: 'boston',
    neighborhood: 'Back Bay',
    title: 'Furnished studio — traveling for the summer',
    address: '8 Symphony Rd, Boston',
    reason: 'travel',
    roomPhotos: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800'],
    commonPhotos: [],
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    monthlyRent: 1800,
    askingPrice: 1350,
    leasePermits: false,
    proofOfResidency: [],
    status: 'pending',
    createdAt: Date.now() - 86400000 * 1,
  },
];

const emptyData: AppData = {
  user: null,
  listings: seedListings,
  requests: [],
  deals: [],
};

interface StoreCtx extends AppData {
  ready: boolean;
  setUser: (u: CurrentUser) => void;
  verifyIdentity: () => void;
  addListing: (l: Omit<Listing, 'id' | 'createdAt' | 'status'>) => Listing;
  setListingStatus: (id: string, status: ListingStatus) => void;
  addRequest: (r: Omit<SubRequest, 'id' | 'createdAt' | 'status'>) => SubRequest;
  setRequestStatus: (id: string, status: RequestStatus) => void;
  createDealFromRequest: (requestId: string) => Deal | null;
  updateDeal: (id: string, patch: Partial<Deal>) => void;
  resetAll: () => void;
}

const Ctx = createContext<StoreCtx | null>(null);

const uid = () => Math.random().toString(36).slice(2, 10);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(emptyData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setData(JSON.parse(raw));
      } catch {}
      setReady(true);
    })();
  }, []);

  const persist = useCallback((next: AppData) => {
    setData(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const setUser = (u: CurrentUser) => persist({ ...data, user: u });

  const verifyIdentity = () => data.user && persist({ ...data, user: { ...data.user, identityVerified: true } });

  const addListing: StoreCtx['addListing'] = (l) => {
    const listing: Listing = { ...l, id: uid(), createdAt: Date.now(), status: 'pending' };
    persist({ ...data, listings: [listing, ...data.listings] });
    return listing;
  };

  const setListingStatus = (id: string, status: ListingStatus) =>
    persist({ ...data, listings: data.listings.map((l) => (l.id === id ? { ...l, status } : l)) });

  const addRequest: StoreCtx['addRequest'] = (r) => {
    const req: SubRequest = { ...r, id: uid(), createdAt: Date.now(), status: 'pending' };
    persist({ ...data, requests: [req, ...data.requests] });
    return req;
  };

  const setRequestStatus = (id: string, status: RequestStatus) =>
    persist({ ...data, requests: data.requests.map((r) => (r.id === id ? { ...r, status } : r)) });

  const createDealFromRequest: StoreCtx['createDealFromRequest'] = (requestId) => {
    const req = data.requests.find((r) => r.id === requestId);
    if (!req) return null;
    const deal: Deal = {
      id: uid(),
      listingId: req.listingId,
      takerName: req.takerName,
      takerEmail: req.takerEmail,
      rentStatus: 'not_started',
      depositStatus: 'not_started',
      movedOut: false,
      createdAt: Date.now(),
    };
    const requests = data.requests.map((r) =>
      r.id === requestId ? { ...r, status: 'accepted' as RequestStatus } : r
    );
    persist({ ...data, requests, deals: [deal, ...data.deals] });
    return deal;
  };

  const updateDeal = (id: string, patch: Partial<Deal>) =>
    persist({ ...data, deals: data.deals.map((d) => (d.id === id ? { ...d, ...patch } : d)) });

  const resetAll = () => persist(emptyData);

  return (
    <Ctx.Provider
      value={{
        ...data, ready, setUser, verifyIdentity, addListing, setListingStatus,
        addRequest, setRequestStatus, createDealFromRequest, updateDeal, resetAll,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useStore must be used within StoreProvider');
  return c;
}
