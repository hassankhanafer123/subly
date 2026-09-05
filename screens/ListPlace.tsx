import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, type, HMARGIN } from '../lib/theme';
import { LargeTitle, Group, GroupHeader, Field, Cell, Button, Badge, Row } from '../lib/ui';
import { useStore } from '../lib/store';
import { cityById } from '../lib/places';
import { monthsBetween, platformFee } from '../lib/types';

export default function LendPlace() {
  const { user, listings, addListing } = useStore();
  const mine = listings.filter((l) => l.ownerEmail === user?.email);

  const [title, setTitle] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [address, setAddress] = useState('');
  const [startDate, setStart] = useState('2026-06-01');
  const [endDate, setEnd] = useState('2026-08-31');
  const [monthlyRent, setRent] = useState('');
  const [askingPrice, setAsking] = useState('');
  const [roomPhotos, setRoom] = useState<string[]>([]);
  const [commonPhotos, setCommon] = useState<string[]>([]);
  const [proofDocs, setProofDocs] = useState<string[]>([]);

  const pick = async (setter: (u: string[]) => void, current: string[]) => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) { Alert.alert('Permission needed', 'Allow photo access to add photos.'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, quality: 0.7 });
    if (!res.canceled) setter([...current, ...res.assets.map((a) => a.uri)]);
  };

  const submit = () => {
    if (!user) return;
    if (!title || !neighborhood || !monthlyRent || !askingPrice) {
      Alert.alert('Missing info', 'Add a title, neighborhood, rent and asking price.'); return;
    }
    if (proofDocs.length === 0) {
      Alert.alert('Proof of residency required', 'Upload a lease, utility bill, or bank statement showing you live at this address before listing.'); return;
    }
    addListing({
      ownerName: user.name, ownerEmail: user.email, cityId: user.cityId,
      neighborhood, reason: user.reason, title, address, roomPhotos, commonPhotos,
      startDate, endDate, monthlyRent: Number(monthlyRent), askingPrice: Number(askingPrice),
      leasePermits: true, proofOfResidency: proofDocs, repCode: user.repCode,
    });
    setTitle(''); setNeighborhood(''); setAddress(''); setRent(''); setAsking('');
    setRoom([]); setCommon([]); setProofDocs([]);
    Alert.alert('Submitted for review', 'A Subly rep verifies your place and proof of residency, then it goes live to keepers.');
  };

  const months = monthsBetween(startDate, endDate);
  const fee = askingPrice ? platformFee(Number(askingPrice), months) : 0;
  const youKeep = askingPrice ? Number(askingPrice) * months - fee : 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <LargeTitle title="Lend your place" subtitle="We verify it, find a keeper, and hold the money." />

        <GroupHeader>Photos</GroupHeader>
        <Group>
          <PhotoStrip label="YOUR ROOM" photos={roomPhotos} onAdd={() => pick(setRoom, roomPhotos)} />
          <PhotoStrip label="COMMON AREAS" photos={commonPhotos} onAdd={() => pick(setCommon, commonPhotos)} />
        </Group>

        <GroupHeader>Details</GroupHeader>
        <Group>
          <Field label="LISTING TITLE" value={title} onChangeText={setTitle} placeholder="Sunny 1-bed with great light" />
          <Field label="NEIGHBORHOOD" value={neighborhood} onChangeText={setNeighborhood} placeholder="e.g. Fenway" />
          <Field label="ADDRESS" value={address} onChangeText={setAddress} placeholder="123 Main St" />
          <Row>
            <View style={{ flex: 1, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.sep }}>
              <Field label="FROM" value={startDate} onChangeText={setStart} placeholder="YYYY-MM-DD" />
            </View>
            <View style={{ flex: 1 }}><Field label="UNTIL" value={endDate} onChangeText={setEnd} placeholder="YYYY-MM-DD" /></View>
          </Row>
          <Row>
            <View style={{ flex: 1, borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.sep }}>
              <Field label="YOUR RENT" value={monthlyRent} onChangeText={setRent} keyboardType="numeric" placeholder="$1,400" />
            </View>
            <View style={{ flex: 1 }}><Field label="ASKING /MO" value={askingPrice} onChangeText={setAsking} keyboardType="numeric" placeholder="$1,050" /></View>
          </Row>
        </Group>

        <GroupHeader>Proof of residency</GroupHeader>
        <Group>
          <View style={{ padding: HMARGIN, paddingBottom: 4 }}>
            <Text style={[type.footnote, { marginBottom: 2 }]}>Upload a lease, utility bill, or bank statement showing you live at this address. Required — verified before your place goes live.</Text>
          </View>
          <PhotoStrip label="DOCUMENTS" photos={proofDocs} onAdd={() => pick(setProofDocs, proofDocs)} docs />
        </Group>

        <GroupHeader>You'll receive</GroupHeader>
        <Group>
          <Cell title="Sublet term" value={`${months} months`} />
          <Cell title="Subly fee (20%)" value={`−$${fee.toLocaleString()}`} />
          <Cell title="You keep" value={`$${youKeep.toLocaleString()}`} valueColor={colors.teal} />
        </Group>

        <View style={{ paddingHorizontal: HMARGIN }}>
          <Button title="Submit for review" variant="teal" onPress={submit} />
        </View>

        {mine.length > 0 && (
          <>
            <GroupHeader>Your listings</GroupHeader>
            <Group>
              {mine.map((l) => (
                <Cell key={l.id} title={l.title}
                  subtitle={`${l.neighborhood}, ${cityById(l.cityId)?.short} · $${l.askingPrice}/mo`}
                  accessory={<Badge label={l.status.toUpperCase()} tone={l.status === 'verified' ? 'teal' : l.status === 'pending' ? 'gold' : 'terra'} />} />
              ))}
            </Group>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function PhotoStrip({ label, photos, onAdd, docs }: { label: string; photos: string[]; onAdd: () => void; docs?: boolean }) {
  return (
    <View style={{ paddingVertical: 6 }}>
      <Text style={styles.stripLabel}>{label}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingVertical: 8 }}>
        <TouchableOpacity onPress={onAdd} style={styles.add}>
          <Ionicons name={docs ? 'document-attach' : 'add'} size={20} color={colors.terra} />
          <Text style={styles.addText}>{docs ? 'Upload' : 'Add'}</Text>
        </TouchableOpacity>
        {photos.map((uri, i) => <Image key={i} source={{ uri }} style={styles.thumb} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  stripLabel: { fontSize: 11, fontWeight: '600', color: colors.muted, paddingHorizontal: 16, paddingTop: 6 },
  add: { width: 78, height: 78, borderRadius: 12, borderWidth: 1.6, borderColor: colors.terra, borderStyle: 'dashed', backgroundColor: colors.terraSoft, alignItems: 'center', justifyContent: 'center', gap: 3 },
  addText: { fontSize: 11, fontWeight: '600', color: colors.terra },
  thumb: { width: 78, height: 78, borderRadius: 12 },
});
