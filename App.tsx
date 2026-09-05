import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, radius, type, HMARGIN } from './lib/theme';
import { Group, GroupHeader, Cell, Button, Badge, Row, LargeTitle } from './lib/ui';
import { StoreProvider, useStore } from './lib/store';
import { cityById } from './lib/places';

import Onboarding from './screens/Onboarding';
import ListPlace from './screens/ListPlace';
import FindPlace from './screens/FindPlace';
import Payments from './screens/Payments';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg, card: colors.card, border: colors.sep, text: colors.ink, primary: colors.terra },
};

const TAB_ICON: Record<string, [keyof typeof Ionicons.glyphMap, keyof typeof Ionicons.glyphMap]> = {
  Find: ['search', 'search-outline'],
  Lend: ['add-circle', 'add-circle-outline'],
  Wallet: ['card', 'card-outline'],
};

function ReviewerModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { listings, setListingStatus } = useStore();
  const pending = listings.filter((l) => l.status === 'pending');
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['top', 'bottom']}>
        <View style={{ paddingHorizontal: HMARGIN, paddingTop: 8, paddingBottom: 12 }}>
          <Row style={{ justifyContent: 'flex-end' }}>
            <TouchableOpacity onPress={onClose} hitSlop={10} style={styles.modalClose}>
              <Ionicons name="close" size={20} color={colors.muted} />
            </TouchableOpacity>
          </Row>
          <Text style={[type.largeTitle, { marginTop: 4 }]}>Rep review</Text>
          <Text style={[type.subhead, { marginTop: 4 }]}>
            A local rep verifies each place before it goes live to keepers.
          </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing(8) }}>
          {pending.length === 0 && <Group><Cell title="Nothing pending review 🎉" /></Group>}
          {pending.map((l) => (
            <Group key={l.id}>
              <View style={{ padding: HMARGIN }}>
                <Text style={type.headline}>{l.title}</Text>
                <Text style={[type.footnote, { marginTop: 2 }]}>{l.neighborhood}, {cityById(l.cityId)?.short} · {l.address}</Text>
                <Row style={{ gap: 8, marginVertical: 12, flexWrap: 'wrap' }}>
                  <Badge label={`$${l.askingPrice}/mo`} tone="terra" />
                  <Badge label={`${l.roomPhotos.length + l.commonPhotos.length} photos`} tone="gold" />
                  <Badge label={`${l.proofOfResidency?.length ?? 0} proof docs`} tone={(l.proofOfResidency?.length ?? 0) > 0 ? 'teal' : 'gold'} />
                </Row>
                <Row style={{ gap: 10 }}>
                  <Button title="Verify & list" variant="teal" small style={{ flex: 1 }}
                    onPress={() => { setListingStatus(l.id, 'verified'); Alert.alert('Verified', `${l.title} is now live to keepers.`); }} />
                  <Button title="Reject" variant="gray" small style={{ flex: 1 }} onPress={() => setListingStatus(l.id, 'rejected')} />
                </Row>
              </View>
            </Group>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function ReviewFab({ onPress }: { onPress: () => void }) {
  const { listings } = useStore();
  const pending = listings.filter((l) => l.status === 'pending').length;
  return (
    <TouchableOpacity onPress={onPress} style={styles.fab} activeOpacity={0.9}>
      <Ionicons name="shield-checkmark" size={22} color={colors.onFill} />
      {pending > 0 && <View style={styles.dot}><Text style={styles.dotText}>{pending}</Text></View>}
    </TouchableOpacity>
  );
}

function MainTabs() {
  const [reviewer, setReviewer] = useState(false);
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.terra,
          tabBarInactiveTintColor: colors.faint,
          tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
          tabBarStyle: { position: 'absolute', borderTopColor: colors.sep, borderTopWidth: StyleSheet.hairlineWidth, height: 84, paddingTop: 8, backgroundColor: 'transparent' },
          tabBarBackground: () => <BlurView tint="light" intensity={40} style={StyleSheet.absoluteFill} />,
          tabBarIcon: ({ color, focused, size }) => {
            const [on, off] = TAB_ICON[route.name];
            return <Ionicons name={focused ? on : off} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Find" component={FindPlace} />
        <Tab.Screen name="Lend" component={ListPlace} />
        <Tab.Screen name="Wallet" component={Payments} />
      </Tab.Navigator>
      <ReviewFab onPress={() => setReviewer(true)} />
      <ReviewerModal visible={reviewer} onClose={() => setReviewer(false)} />
    </>
  );
}

function Gate() {
  const { user, ready } = useStore();
  if (!ready) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  return user ? <MainTabs /> : <Onboarding />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="dark" />
          <Gate />
        </NavigationContainer>
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  modalClose: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.fill, alignItems: 'center', justifyContent: 'center' },
  fab: { position: 'absolute', right: 16, bottom: 100, width: 48, height: 48, borderRadius: 24, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  dot: { position: 'absolute', top: -4, right: -4, backgroundColor: colors.terra, borderRadius: 999, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, borderWidth: 2, borderColor: colors.bg },
  dotText: { color: '#fff', fontSize: 10, fontWeight: '800' },
});
