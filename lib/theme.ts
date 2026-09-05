// Subly design tokens — iOS-native (Apple HIG) + warm identity.
// Palette: sand paper, cream cards, terracotta primary, deep teal secondary.
// Type: SF system scale (LargeTitle 34 / Title2 22 / Body 17 / Subhead 15 / Footnote 13 / Caption 11).

export const colors = {
  // Surfaces (warm iOS grouped background)
  bg: '#F2ECE1',          // grouped background
  card: '#FCFAF5',        // insetGrouped cell background
  cardAlt: '#F6F0E4',
  sep: '#E5DCCB',         // separator / hairline
  sepStrong: '#D8CDB8',

  // Text (iOS label hierarchy, warmed)
  ink: '#1C1B19',         // label
  ink2: '#3C3A36',        // secondaryLabel
  muted: '#8E877C',       // tertiaryLabel
  faint: '#B6AE9F',       // placeholder / quaternary

  // Brand
  terra: '#C25B3A',       // tint / primary
  terraDeep: '#A5462A',
  terraSoft: '#F4DFD3',
  teal: '#215E56',        // secondary
  tealSoft: '#DCE9E4',
  gold: '#A9782F',
  goldSoft: '#F0E4C9',

  onFill: '#FFFFFF',      // text on terra/teal fills
  white: '#FFFFFF',
  // control fills
  fill: 'rgba(120,110,95,0.12)',   // iOS secondarySystemFill (search, segmented)
  scrim: 'rgba(0,0,0,0.32)',       // glass button over photo
};

// iOS continuous corner radii
export const radius = { field: 12, card: 12, button: 14, pill: 999, sheet: 22, screen: 40 };

export const spacing = (n: number) => n * 4;
export const HMARGIN = 16; // iOS horizontal content margin

// Restrained iOS elevation
export const shadow = {
  shadowColor: '#3A2A18',
  shadowOpacity: 0.10,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
};
export const shadowSoft = {
  shadowColor: '#3A2A18',
  shadowOpacity: 0.05,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 1 },
  elevation: 1,
};

// SF system font is the platform default in RN (no fontFamily needed on iOS).
// iOS type scale — weights limited to 400/600/700 per HIG (no light).
export const type = {
  largeTitle: { fontSize: 34, fontWeight: '700' as const, letterSpacing: 0.37, color: colors.ink },
  title1:     { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.4, color: colors.ink },
  title2:     { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.4, color: colors.ink },
  headline:   { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.4, color: colors.ink },
  body:       { fontSize: 17, fontWeight: '400' as const, letterSpacing: -0.4, color: colors.ink, lineHeight: 23 },
  callout:    { fontSize: 16, fontWeight: '400' as const, letterSpacing: -0.3, color: colors.ink },
  subhead:    { fontSize: 15, fontWeight: '400' as const, letterSpacing: -0.2, color: colors.ink2 },
  footnote:   { fontSize: 13, fontWeight: '400' as const, color: colors.muted, lineHeight: 18 },
  caption:    { fontSize: 11, fontWeight: '600' as const, color: colors.muted },
};
