import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle,
  ActivityIndicator, TextInput, TextInputProps, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, shadow, shadowSoft, type, HMARGIN } from './theme';

/* ---------- iOS large-title header ---------- */
export function LargeTitle({ title, subtitle, eyebrow, style }: {
  title: string; subtitle?: string; eyebrow?: string; style?: ViewStyle;
}) {
  return (
    <View style={[{ paddingHorizontal: HMARGIN, paddingTop: 12, paddingBottom: 10 }, style]}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={type.largeTitle}>{title}</Text>
      {subtitle ? <Text style={[type.subhead, { marginTop: 3 }]}>{subtitle}</Text> : null}
    </View>
  );
}

/* ---------- grouped inset list ---------- */
export function GroupHeader({ children }: { children: React.ReactNode }) {
  return <Text style={styles.groupHeader}>{children}</Text>;
}
export function Group({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const items = React.Children.toArray(children);
  return (
    <View style={[styles.group, style]}>
      {items.map((child, i) => (
        <View key={i} style={i > 0 ? styles.sepTop : undefined}>{child}</View>
      ))}
    </View>
  );
}

/* A settings-style cell: optional colored leading icon, title/subtitle, trailing value/accessory */
export function Cell({ icon, iconBg, title, subtitle, value, valueColor, accessory, onPress }: {
  icon?: keyof typeof Ionicons.glyphMap; iconBg?: string;
  title: string; subtitle?: string; value?: string; valueColor?: string;
  accessory?: 'chevron' | React.ReactNode; onPress?: () => void;
}) {
  const Wrap: any = onPress ? TouchableOpacity : View;
  return (
    <Wrap activeOpacity={0.6} onPress={onPress} style={styles.cell}>
      {icon ? (
        <View style={[styles.lead, { backgroundColor: iconBg || colors.terra }]}>
          <Ionicons name={icon} size={16} color={colors.onFill} />
        </View>
      ) : null}
      <View style={{ flex: 1 }}>
        <Text style={styles.cellTitle}>{title}</Text>
        {subtitle ? <Text style={styles.cellSub}>{subtitle}</Text> : null}
      </View>
      {value ? <Text style={[styles.cellValue, valueColor ? { color: valueColor } : null]}>{value}</Text> : null}
      {accessory === 'chevron' ? (
        <Ionicons name="chevron-forward" size={17} color={colors.faint} style={{ marginLeft: 6 }} />
      ) : accessory ? accessory : null}
    </Wrap>
  );
}

/* Inset text field (iOS grouped form row) */
export function Field({ label, ...props }: { label?: string } & TextInputProps) {
  return (
    <View style={styles.field}>
      {label ? <Text style={styles.fieldKey}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.faint}
        style={[styles.fieldInput, props.multiline && { minHeight: 66, textAlignVertical: 'top' }]}
        {...props}
      />
    </View>
  );
}

/* ---------- iOS search bar ---------- */
export function SearchBar({ placeholder = 'Search' }: { placeholder?: string }) {
  return (
    <View style={styles.search}>
      <Ionicons name="search" size={16} color={colors.muted} />
      <Text style={styles.searchPh}>{placeholder}</Text>
    </View>
  );
}

/* ---------- chips (filter / select) ---------- */
export function ChipRow({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: HMARGIN, gap: 8, paddingBottom: 2 }}>
      {children}
    </ScrollView>
  );
}
export function Chip({ label, icon, active, tint, onPress }: {
  label: string; icon?: keyof typeof Ionicons.glyphMap; active?: boolean; tint?: boolean; onPress?: () => void;
}) {
  const bg = active ? (tint ? colors.terra : colors.ink) : colors.card;
  const fg = active ? colors.onFill : colors.ink2;
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}
      style={[styles.chip, { backgroundColor: bg, borderColor: active ? bg : colors.sep }]}>
      {icon ? <Ionicons name={icon} size={14} color={fg} style={{ marginRight: 5 }} /> : null}
      <Text style={[styles.chipText, { color: fg }]}>{label}</Text>
    </TouchableOpacity>
  );
}

/* ---------- filled iOS button ---------- */
export function Button({ title, onPress, variant = 'terra', loading, disabled, style, icon, small }: {
  title: string; onPress?: () => void;
  variant?: 'terra' | 'teal' | 'gray'; loading?: boolean; disabled?: boolean;
  style?: ViewStyle; icon?: keyof typeof Ionicons.glyphMap; small?: boolean;
}) {
  const bg = { terra: colors.terra, teal: colors.teal, gray: colors.fill }[variant];
  const fg = variant === 'gray' ? colors.ink : colors.onFill;
  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} disabled={disabled || loading}
      style={[styles.btn, { backgroundColor: bg, height: small ? 44 : 50, opacity: disabled ? 0.45 : 1 },
        variant !== 'gray' && shadowSoft, style]}>
      {loading ? <ActivityIndicator color={fg} /> : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {icon ? <Ionicons name={icon} size={18} color={fg} /> : null}
          <Text style={[styles.btnText, { color: fg, fontSize: small ? 15 : 17 }]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

/* ---------- teal verification seal (over photo) ---------- */
export function Seal({ label = 'Verified' }: { label?: string }) {
  return (
    <View style={styles.seal}>
      <Ionicons name="shield-checkmark" size={12} color={colors.onFill} />
      <Text style={styles.sealText}>{label}</Text>
    </View>
  );
}

/* ---------- small status badge ---------- */
export function Badge({ label, tone = 'teal' }: { label: string; tone?: 'teal' | 'terra' | 'gold' }) {
  const map = {
    teal: { fg: colors.teal, bg: colors.tealSoft },
    terra: { fg: colors.terraDeep, bg: colors.terraSoft },
    gold: { fg: colors.gold, bg: colors.goldSoft },
  }[tone];
  return <View style={[styles.badge, { backgroundColor: map.bg }]}><Text style={[styles.badgeText, { color: map.fg }]}>{label}</Text></View>;
}

export function Row({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 1.6, textTransform: 'uppercase', color: colors.terra, marginBottom: 8 },
  groupHeader: { fontSize: 13, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginHorizontal: HMARGIN + 16, marginBottom: 7 },
  group: { marginHorizontal: HMARGIN, marginBottom: 18, backgroundColor: colors.card, borderRadius: radius.card, overflow: 'hidden' },
  sepTop: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.sep },
  cell: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13 },
  lead: { width: 29, height: 29, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  cellTitle: { ...type.body, fontSize: 17 },
  cellSub: { fontSize: 13, color: colors.muted, marginTop: 1 },
  cellValue: { fontSize: 17, color: colors.muted },
  field: { paddingHorizontal: 16, paddingVertical: 11 },
  fieldKey: { fontSize: 12, color: colors.muted, marginBottom: 2 },
  fieldInput: { fontSize: 17, letterSpacing: -0.4, color: colors.ink, padding: 0 },
  search: { marginHorizontal: HMARGIN, marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: colors.fill, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  searchPh: { fontSize: 16, color: colors.muted },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 7, borderRadius: radius.pill, borderWidth: StyleSheet.hairlineWidth },
  chipText: { fontSize: 14, fontWeight: '500' },
  btn: { borderRadius: radius.button, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  btnText: { fontWeight: '600', letterSpacing: -0.4 },
  seal: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(33,94,86,0.94)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  sealText: { color: colors.onFill, fontSize: 11, fontWeight: '700' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '700' },
});

export { styles as uiStyles };
