import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ImageBackground,
  KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, type, HMARGIN, shadow } from '../lib/theme';
import { Group, Field, GroupHeader, ChipRow, Chip, Button } from '../lib/ui';
import { CITIES, REASONS } from '../lib/places';
import { useStore } from '../lib/store';

const { height } = Dimensions.get('window');
const HERO = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80';

export default function Onboarding() {
  const { setUser } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cityId, setCityId] = useState('boston');
  const [reason, setReason] = useState('travel');

  const canContinue = name.trim() && email.trim();

  return (
    <View style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} bounces={false} keyboardShouldPersistTaps="handled">
          <ImageBackground source={{ uri: HERO }} style={[styles.hero, { height: Math.max(320, height * 0.44) }]}>
            <View style={styles.wash} />
            <SafeAreaView edges={['top']}>
              <View style={styles.heroContent}>
                <View style={styles.brandRow}>
                  <View style={styles.mk}><Ionicons name="key" size={17} color={colors.onFill} /></View>
                  <Text style={styles.brand}>subly</Text>
                </View>
                <Text style={styles.eyebrow}>While you're away</Text>
                <Text style={styles.heroTitle}>Someone to hold{'\n'}the keys.</Text>
                <Text style={styles.heroSub}>
                  Traveling, on assignment, or gone for the season? Hand your home to a vetted subletter and keep ~75% of your rent.
                </Text>
              </View>
            </SafeAreaView>
          </ImageBackground>

          <View style={styles.sheet}>
            <View style={styles.grip} />
            <View style={{ paddingHorizontal: HMARGIN, paddingBottom: 10 }}>
              <Text style={type.title2}>Create your profile</Text>
              <Text style={[type.subhead, { marginTop: 3 }]}>Takes 20 seconds. Look around first if you like.</Text>
            </View>

            <Group style={{ marginTop: 8 }}>
              <Field label="NAME" value={name} onChangeText={setName} placeholder="Jordan Rivera" />
              <Field label="EMAIL" value={email} onChangeText={setEmail}
                placeholder="jordan@email.com" autoCapitalize="none" keyboardType="email-address" />
            </Group>

            <GroupHeader>Your city</GroupHeader>
            <ChipRow>
              {CITIES.filter((c) => c.id !== 'other').map((c) => (
                <Chip key={c.id} label={c.short} active={cityId === c.id} onPress={() => setCityId(c.id)} />
              ))}
            </ChipRow>

            <GroupHeader>Why are you away?</GroupHeader>
            <ChipRow>
              {REASONS.filter((r) => r.id !== 'other').map((r) => (
                <Chip key={r.id} label={r.label} icon={r.icon as any} tint active={reason === r.id} onPress={() => setReason(r.id)} />
              ))}
            </ChipRow>

            <View style={{ paddingHorizontal: HMARGIN, marginTop: 10 }}>
              <Button title="Get started" icon="arrow-forward" disabled={!canContinue}
                onPress={() => setUser({ name, email, cityId, reason })} />
            </View>

            <View style={styles.trust}>
              {[['shield-checkmark', 'Vetted takers'], ['lock-closed', 'Escrow-safe'], ['pricetag', 'Keep ~75%']].map(([ic, tx]) => (
                <View key={tx} style={styles.trustItem}>
                  <View style={styles.trustIc}><Ionicons name={ic as any} size={16} color={colors.teal} /></View>
                  <Text style={styles.trustText}>{tx}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  hero: { justifyContent: 'flex-end' },
  wash: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(40,25,15,0.42)' },
  heroContent: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: spacing(3) },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 14 },
  mk: { width: 32, height: 32, borderRadius: 9, backgroundColor: colors.terra, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 20, fontWeight: '700', color: colors.white, letterSpacing: -0.3 },
  eyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 1.9, textTransform: 'uppercase', color: 'rgba(255,255,255,0.82)', marginBottom: 9 },
  heroTitle: { fontSize: 32, fontWeight: '700', color: colors.white, letterSpacing: -0.5, lineHeight: 35 },
  heroSub: { fontSize: 16, color: 'rgba(255,255,255,0.9)', lineHeight: 22, marginTop: 9 },
  sheet: { backgroundColor: colors.bg, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, marginTop: -22, paddingTop: 8, paddingBottom: spacing(10) },
  grip: { width: 40, height: 5, borderRadius: 3, backgroundColor: colors.sep, alignSelf: 'center', marginTop: 8, marginBottom: 12 },
  trust: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: HMARGIN, marginTop: spacing(5) },
  trustItem: { flex: 1, alignItems: 'center', gap: 6 },
  trustIc: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.tealSoft, alignItems: 'center', justifyContent: 'center' },
  trustText: { fontSize: 12, fontWeight: '600', color: colors.ink2 },
});
