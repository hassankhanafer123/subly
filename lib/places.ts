// Generic subletting platform — anyone with a lease, any reason.
// Replaces the old school-based model with cities + reasons.

export interface City {
  id: string;
  name: string;   // "Boston, MA"
  short: string;  // "Boston"
}

export const CITIES: City[] = [
  { id: 'boston', name: 'Boston, MA', short: 'Boston' },
  { id: 'nyc', name: 'New York, NY', short: 'New York' },
  { id: 'sf', name: 'San Francisco, CA', short: 'SF' },
  { id: 'la', name: 'Los Angeles, CA', short: 'LA' },
  { id: 'chicago', name: 'Chicago, IL', short: 'Chicago' },
  { id: 'seattle', name: 'Seattle, WA', short: 'Seattle' },
  { id: 'austin', name: 'Austin, TX', short: 'Austin' },
  { id: 'dc', name: 'Washington, DC', short: 'DC' },
  { id: 'other', name: 'Other city', short: 'Other' },
];

export function cityById(id: string): City | undefined {
  return CITIES.find((c) => c.id === id);
}

// Why someone is away (and subletting) — general audience, away-framing.
export const REASONS: { id: string; label: string; icon: string }[] = [
  { id: 'travel', label: 'Traveling', icon: 'airplane' },
  { id: 'remote', label: 'Working remote', icon: 'laptop' },
  { id: 'assignment', label: 'On assignment', icon: 'briefcase' },
  { id: 'season', label: 'For the season', icon: 'sunny' },
  { id: 'family', label: 'Family / personal', icon: 'home' },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
];

export function reasonById(id: string) {
  return REASONS.find((r) => r.id === id);
}
