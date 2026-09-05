import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, type, HMARGIN } from '../lib/theme';
import { LargeTitle, SearchBar, ChipRow, Chip, Seal, Button, Field } from '../lib/ui';
import { useStore } from '../lib/store';
import { CITIES, cityById, reasonById } from '../lib/places';
import { Listing, monthsBetween } from '../lib/types';
import { startIdentityCheck } from '../lib/payments';

export default function FindPlace() {
  const { user, listings, addRequest, verifyIdentity } = useStore();
  const [filterCity, setFilterCity] = useState('all');
  const [selected, setSelected] = useState<Listing | null>(null);
  const [message, setMessage] = useState('');
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [verifying, setVerifying] = useState(false);

  const verified = listings.filter((l) => l.status === 'verified');
  const shown = filterCity === 'all' ? verified : verified.filter((l) => l.cityId === filterCity);
  const identityOk = !!user?.identityVerified;

  const runVerify = async () => {
    setVerifying(true);
    await startIdentityCheck(user?.email ?? '');
    verifyIdentity();
    setVerifying(false);
    Alert.alert('Identity verified', 'State ID + facial recognition passed. You can now request a place.');
  };

  const send = () => {
    if (!user || !selected) return;
    if (!identityOk) {
      Alert.alert(
        'Verify your identity first',
        'To request a place you must verify with a state ID and facial recognition. This keeps hosts safe.',
        [{ text: 'Not now', style: 'cancel' }, { text: 'Verify now', onPress: runVerify }]
      );
      return;
    }
    addRequest({ listingId: selected.id, takerName: user.name, takerEmail: user.email,
      message: message || `Hi ${selected.ownerName}, I'd love to take over your place.` });
    setMessage(''); setSelected(null);
    Alert.alert('Request sent', `${selected.ownerName} can review and hand you the keys.`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LargeTitle title="Find" />
      <SearchBar placeholder="City, neighborhood, dates" />
      <ChipRow>
        <Chip label="All cities" active={filterCity === 'all'} onPress={() => setFilterCity('all')} />
        {CITIES.filter((c) => c.id !== 'other').map((c) => (
          <Chip key={c.id} label={c.short} active={filterCity === c.id} onPress={() => setFilterCity(c.id)} />
        ))}
      </ChipRow>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}>
        {shown.length === 0 && (
          <View style={styles.empty}><Ionicons name="search" size={28} color={colors.faint} /><Text style={[type.subhead, { marginTop: 10 }]}>No sublets in this city yet.</Text></View>
        )}
        {shown.map((l) => {
          const reason = reasonById(l.reason ?? '');
          const mo = monthsBetween(l.startDate, l.endDate);
          return (
            <TouchableOpacity key={l.id} activeOpacity={0.95} onPress={() => setSelected(l)} style={styles.lc}>
              <View style={styles.ph}>
                {l.roomPhotos[0]
                  ? <Image source={{ uri: l.roomPhotos[0] }} style={styles.phImg} />
                  : <View style={[styles.phImg, styles.phEmpty]}><Ionicons name="home" size={28} color={colors.faint} /></View>}
                <Seal />
                <TouchableOpacity style={styles.save} onPress={() => setSaved((s) => ({ ...s, [l.id]: !s[l.id] }))}>
                  <Ionicons name={saved[l.id] ? 'bookmark' : 'bookmark-outline'} size={17} color={colors.white} />
                </TouchableOpacity>
              </View>
              <View style={styles.top}>
                <Text style={styles.place}>{l.neighborhood}, {cityById(l.cityId)?.short}</Text>
                <Text style={styles.price}>${l.askingPrice.toLocaleString()}<Text style={styles.priceUnit}> /mo</Text></Text>
              </View>
              <Text style={styles.desc} numberOfLines={1}>{l.title}</Text>
              <View style={styles.meta}>
                {reason ? <Text style={styles.rtag}>{reason.label}</Text> : null}
                <Text style={styles.metaDim}> · {fmt(l.startDate)} – {fmt(l.endDate)} · {mo} mo</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Modal visible={!!selected} animationType="slide" transparent>
        <View style={styles.modalWrap}>
          <View style={styles.modal}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selected && (
                <>
                  <View style={styles.hero}>
                    {selected.roomPhotos[0] && <Image source={{ uri: selected.roomPhotos[0] }} style={styles.heroImg} />}
                    <TouchableOpacity style={[styles.glass, { left: 14 }]} onPress={() => setSelected(null)}>
                      <Ionicons name="chevron-down" size={18} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ padding: HMARGIN }}>
                    {reasonById(selected.reason ?? '') ? (
                      <Text style={styles.detailEyebrow}>{reasonById(selected.reason ?? '')!.label.toUpperCase()}</Text>
                    ) : null}
                    <Text style={type.title2}>{selected.neighborhood}, {cityById(selected.cityId)?.short}</Text>
                    <Text style={[type.subhead, { marginTop: 4 }]}>{selected.title} · {selected.address}</Text>
                    <View style={styles.statRow}>
                      <Stat k="Rent" v={`$${selected.askingPrice}`} accent /><Div /><Stat k="For" v={`${monthsBetween(selected.startDate, selected.endDate)} mo`} /><Div /><Stat k="Keeper" v={selected.ownerName.split(' ')[0]} />
                    </View>
                    <Text style={styles.groupHeader}>A note to {selected.ownerName.split(' ')[0]}</Text>
                    <View style={styles.noteBox}>
                      <Field label="" value={message} onChangeText={setMessage} placeholder="Tell them a little about yourself…" multiline />
                    </View>
                    <Button title={identityOk ? 'Ask to take the keys' : 'Verify ID & request'} loading={verifying} onPress={send} />
                    <Text style={styles.escrow}>Renters verify with a state ID + facial recognition.{'\n'}Rent is charged to your card through Stripe — never to a stranger.</Text>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function fmt(iso: string) { return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); }
function Stat({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return <View style={{ flex: 1, alignItems: 'center' }}><Text style={styles.statK}>{k}</Text><Text style={[styles.statV, accent && { color: colors.terraDeep }]}>{v}</Text></View>;
}
function Div() { return <View style={styles.statDiv} />; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  empty: { alignItems: 'center', paddingVertical: spacing(16) },
  lc: { marginHorizontal: HMARGIN, marginBottom: 20 },
  ph: { position: 'relative', aspectRatio: 16 / 10, borderRadius: 14, overflow: 'hidden' },
  phImg: { width: '100%', height: '100%' },
  phEmpty: { backgroundColor: colors.cardAlt, alignItems: 'center', justifyContent: 'center' },
  save: { position: 'absolute', top: 9, right: 9, width: 32, height: 32, borderRadius: 16, backgroundColor: colors.scrim, alignItems: 'center', justifyContent: 'center' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 10, gap: 10 },
  place: { fontSize: 17, fontWeight: '600', letterSpacing: -0.4, color: colors.ink, flex: 1 },
  price: { fontSize: 17, fontWeight: '700', color: colors.terraDeep },
  priceUnit: { fontSize: 13, color: colors.muted, fontWeight: '400' },
  desc: { fontSize: 15, color: colors.ink2, marginTop: 2 },
  meta: { flexDirection: 'row', marginTop: 3 },
  rtag: { fontSize: 13, color: colors.teal, fontWeight: '600' },
  metaDim: { fontSize: 13, color: colors.muted },
  // modal
  modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: colors.bg, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, maxHeight: '92%', overflow: 'hidden' },
  hero: { position: 'relative', height: 260 },
  heroImg: { width: '100%', height: '100%' },
  glass: { position: 'absolute', top: 16, width: 34, height: 34, borderRadius: 17, backgroundColor: colors.scrim, alignItems: 'center', justifyContent: 'center' },
  detailEyebrow: { fontSize: 12, fontWeight: '700', letterSpacing: 1.4, color: colors.terra, marginBottom: 6 },
  statRow: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.card, paddingVertical: 13, marginTop: 16 },
  statDiv: { width: StyleSheet.hairlineWidth, backgroundColor: colors.sep },
  statK: { fontSize: 12, color: colors.muted },
  statV: { fontSize: 17, fontWeight: '600', marginTop: 2, color: colors.ink },
  groupHeader: { fontSize: 13, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.4, marginTop: 22, marginBottom: 7, marginLeft: 4 },
  noteBox: { backgroundColor: colors.card, borderRadius: radius.card, marginBottom: 16 },
  escrow: { fontSize: 13, color: colors.muted, textAlign: 'center', marginTop: 11, lineHeight: 18 },
});
