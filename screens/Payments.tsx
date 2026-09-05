import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, type, HMARGIN } from '../lib/theme';
import { LargeTitle, Group, GroupHeader, Cell, Badge, Button, Row } from '../lib/ui';
import { useStore } from '../lib/store';
import { cityById } from '../lib/places';
import { Deal, monthsBetween, platformFee } from '../lib/types';
import { stripeConfigured, startIdentityCheck, chargeRent, payoutHost } from '../lib/payments';

export default function Wallet() {
  const { user, listings, requests, deals, setRequestStatus, createDealFromRequest, updateDeal, verifyIdentity } = useStore();
  const [busy, setBusy] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const identityOk = !!user?.identityVerified;

  const myListingIds = listings.filter((l) => l.ownerEmail === user?.email).map((l) => l.id);
  const incoming = requests.filter((r) => myListingIds.includes(r.listingId) && r.status === 'pending');
  const myDeals = deals.filter((d) => myListingIds.includes(d.listingId) || d.takerEmail === user?.email);

  const totalEarned = myDeals.reduce((sum, d) => {
    const l = listings.find((x) => x.id === d.listingId);
    if (!l || d.rentStatus === 'not_started' || !myListingIds.includes(d.listingId)) return sum;
    const mo = monthsBetween(l.startDate, l.endDate);
    return sum + (l.askingPrice * mo - platformFee(l.askingPrice, mo));
  }, 0);
  const active = myDeals.filter((d) => d.rentStatus === 'held_in_escrow').length;

  const verify = async () => {
    setVerifying(true);
    await startIdentityCheck(user?.email ?? '');
    verifyIdentity();
    setVerifying(false);
    Alert.alert('Identity verified', stripeConfigured ? 'State ID + facial recognition passed.' : '(Demo) Scans your state ID and matches your face via 3rd-party facial recognition.');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LargeTitle title="Wallet" subtitle="Rent charged to card, paid out to you after Subly's 20%." />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.grid2}>
          <View style={styles.stat}><Text style={styles.statK}>Earned so far</Text><Text style={[styles.statV, { color: colors.teal }]}>${totalEarned.toLocaleString()}</Text></View>
          <View style={styles.stat}><Text style={styles.statK}>Active deals</Text><Text style={[styles.statV, { color: colors.terraDeep }]}>{active}</Text></View>
        </View>

        {incoming.length > 0 && (
          <>
            <GroupHeader>Asking to take your keys</GroupHeader>
            {incoming.map((r) => {
              const l = listings.find((x) => x.id === r.listingId);
              return (
                <Group key={r.id}>
                  <View style={{ padding: HMARGIN }}>
                    <Row style={{ gap: 11 }}>
                      <View style={styles.avFallback}><Ionicons name="person" size={18} color={colors.muted} /></View>
                      <View><Text style={type.headline}>{r.takerName}</Text><Text style={styles.foot}>for your {l?.neighborhood} place</Text></View>
                    </Row>
                    <Text style={styles.quote}>"{r.message}"</Text>
                    <Row style={{ gap: 10 }}>
                      <Button title="Give the keys" variant="teal" small style={{ flex: 1 }}
                        onPress={() => { createDealFromRequest(r.id); Alert.alert('Keys handed over', 'Next: charge rent to their card below.'); }} />
                      <Button title="Decline" variant="gray" small style={{ flex: 1 }} onPress={() => setRequestStatus(r.id, 'declined')} />
                    </Row>
                  </View>
                </Group>
              );
            })}
          </>
        )}

        {myDeals.length > 0 && (
          <>
            <GroupHeader>Your deals</GroupHeader>
            {myDeals.map((d) => (
              <DealCard key={d.id} deal={d} isOwner={myListingIds.includes(d.listingId)}
                listing={listings.find((l) => l.id === d.listingId)} busy={busy} setBusy={setBusy} updateDeal={updateDeal} />
            ))}
          </>
        )}

        <GroupHeader>Payments</GroupHeader>
        <Group>
          <Cell icon="card" iconBg={colors.terra} title="Payout account"
            subtitle="Where your rent lands — bank or debit card"
            accessory={<Badge label={stripeConfigured ? 'LIVE' : 'DEMO'} tone={stripeConfigured ? 'teal' : 'gold'} />} />
          <Cell icon="scan" iconBg={colors.teal} title={identityOk ? 'Identity verified' : verifying ? 'Verifying…' : 'Verify your identity'}
            subtitle={identityOk ? 'State ID + facial recognition passed' : 'State ID scan + 3rd-party facial recognition'}
            accessory={identityOk ? <Badge label="✓" tone="teal" /> : 'chevron'}
            onPress={identityOk || verifying ? undefined : verify} />
        </Group>

        <Group>
          <Cell icon="card" iconBg={colors.terra} title="Charged to card" subtitle="Subletter pays rent on their debit or credit card via Stripe." />
          <Cell icon="cash" iconBg={colors.teal} title="Paid out to you" subtitle="Your 80% lands in your bank after Subly's 20% — no chasing." />
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function DealCard({ deal, isOwner, listing, busy, setBusy, updateDeal }: {
  deal: Deal; isOwner: boolean; listing?: any; busy: string | null;
  setBusy: (s: string | null) => void; updateDeal: (id: string, p: Partial<Deal>) => void;
}) {
  const months = listing ? monthsBetween(listing.startDate, listing.endDate) : 1;
  const fee = listing ? platformFee(listing.askingPrice, months) : 0;

  const charge = async () => {
    setBusy(deal.id);
    await chargeRent(deal.id, (listing?.askingPrice ?? 0) * 100);
    updateDeal(deal.id, { rentStatus: 'held_in_escrow' });
    setBusy(null);
    Alert.alert('Rent charged', `${deal.takerName}'s card was charged. Confirm move-in to pay you out.`);
  };
  const payout = async () => {
    setBusy(deal.id);
    await payoutHost(deal.id);
    updateDeal(deal.id, { rentStatus: 'released', movedOut: true });
    setBusy(null);
    Alert.alert('Paid out', 'Your 80% is on its way to your bank. Deal closed.');
  };

  return (
    <Group>
      <View style={{ padding: HMARGIN }}>
        <Row style={{ justifyContent: 'space-between' }}>
          <Text style={type.headline}>{listing ? `${listing.neighborhood}, ${cityById(listing.cityId)?.short}` : 'Sublet'}</Text>
          <Badge label={isOwner ? 'YOU LENT IT' : 'YOU TAKE'} tone={isOwner ? 'terra' : 'teal'} />
        </Row>
        <Text style={styles.foot}>{isOwner ? `Keeper: ${deal.takerName}` : 'Your sublet'}</Text>
      </View>
      <Cell title="Rent" accessory={<Badge label={deal.rentStatus === 'not_started' ? 'Pending' : deal.rentStatus === 'released' ? 'Paid out' : 'Charged'} tone="teal" />} />
      {isOwner && listing ? <Cell title="Subly fee (20%)" value={`$${fee.toLocaleString()}`} valueColor={colors.ink} /> : null}
      {isOwner && listing ? <Cell title="You receive" value={`$${(listing.askingPrice * months - fee).toLocaleString()}`} valueColor={colors.teal} /> : null}
      <View style={{ padding: 14 }}>
        {deal.rentStatus === 'not_started' && <Button title="Charge rent to card" variant="teal" loading={busy === deal.id} onPress={charge} />}
        {deal.rentStatus === 'held_in_escrow' && !deal.movedOut && <Button title="Confirm move-in & pay out" variant="teal" loading={busy === deal.id} onPress={payout} />}
        {deal.movedOut && <Row style={{ justifyContent: 'center', gap: 6 }}><Ionicons name="checkmark-circle" size={18} color={colors.teal} /><Text style={{ color: colors.teal, fontWeight: '600' }}>Completed</Text></Row>}
      </View>
    </Group>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  grid2: { flexDirection: 'row', gap: 12, paddingHorizontal: HMARGIN, marginBottom: 18 },
  stat: { flex: 1, backgroundColor: colors.card, borderRadius: radius.card, padding: 15 },
  statK: { fontSize: 13, color: colors.muted },
  statV: { fontSize: 30, fontWeight: '700', letterSpacing: -0.6, marginTop: 3 },
  avFallback: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.cardAlt, alignItems: 'center', justifyContent: 'center' },
  foot: { fontSize: 13, color: colors.muted, marginTop: 3 },
  quote: { ...type.callout, color: colors.ink2, marginVertical: 12 },
});
