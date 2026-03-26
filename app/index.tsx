import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Package, HelpCircle, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const logoImg = require('../assets/logo.png');
const sendParcelIcon = { uri: "https://i.imgur.com/a6gHhtu.png" };
const trackPackageIcon = { uri: "https://i.imgur.com/HHNarFY.png" };
const historyIcon = { uri: "https://i.imgur.com/4Xgmx8D.png" };
const rateReviewIcon = { uri: "https://i.imgur.com/pvzfoIz.png" };

export default function App() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Image source={logoImg} style={styles.logo} resizeMode="contain" />

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn}>
            <Bell size={20} color="#39B5A8" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconBtnSecondary}>
            <HelpCircle size={20} color="#39B5A8" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        
        {/* Navigation Section */}
        <Text style={styles.sectionHeader}>
          Navigation Menu
        </Text>

        <View style={styles.grid}>
          <ActionCard image={sendParcelIcon} title="Send Parcel" desc="Book a delivery" accentColor="rgba(253, 184, 51, 0.1)" onPress={() => router.push('/send-parcel')} />
          <ActionCard image={trackPackageIcon} title="Track Package" desc="Live tracking" accentColor="rgba(84, 160, 204, 0.1)" onPress={() => router.push('/track-package')} />
          <ActionCard image={historyIcon} title="History" desc="Past deliveries" accentColor="rgba(57, 181, 168, 0.1)" onPress={() => router.push('/history')} />
          <ActionCard image={rateReviewIcon} title="Rate & Review" desc="Give feedback" accentColor="rgba(166, 220, 214, 0.2)" onPress={() => router.push('/rate-review')} />
        </View>

        {/* Active Deliveries Section */}
        <View style={styles.deliveriesHeader}>
          <Text style={styles.deliveriesTitle}>Active Deliveries</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllBtn}>View All</Text>
          </TouchableOpacity>
        </View>

        <DeliveryItem id="PKS-2024-001" location="Makati City" time="15 mins away" status="In Transit" statusColor="#54A0CC" statusBg="rgba(84, 160, 204, 0.1)" />
        <DeliveryItem id="PKS-2024-002" location="Quezon City" time="30 mins away" status="Out for Delivery" statusColor="#FDB833" statusBg="rgba(253, 184, 51, 0.1)" />
        
        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

// Sub-components
function ActionCard({ image, title, desc, accentColor, onPress }: any) {
  return (
    <TouchableOpacity style={[styles.actionCard, { backgroundColor: accentColor }]} onPress={onPress} activeOpacity={0.85}>
      {image && (
        <Image source={image} style={styles.actionCardImg} resizeMode="contain" />
      )}
      <View style={styles.actionCardContent}>
        <View style={styles.actionCardIndicator} />
        <Text style={styles.actionCardTitle}>{title}</Text>
        <Text style={styles.actionCardDesc}>{desc}</Text>
      </View>
    </TouchableOpacity>
  );
}

function DeliveryItem({ id, location, time, status, statusColor, statusBg }) {
  return (
    <TouchableOpacity style={styles.deliveryItem}>
      <View style={styles.deliveryInfoRow}>
        <View style={styles.deliveryIconBox}>
          <Package size={24} color="#39B5A8" />
        </View>

        <View>
          <Text style={styles.deliveryId}>{id}</Text>
          <Text style={styles.deliveryLoc}>{location}</Text>
          <Text style={styles.deliveryTime}>{time}</Text>
        </View>
      </View>

      <View style={styles.deliveryStatusCol}>
        <Text style={styles.statusLabel}>Status</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
          <Text style={[styles.statusBadgeText, { color: statusColor }]}>{status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#F0F9F8'
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(57, 181, 168, 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 50
  },
  logo: {
    height: 32, width: 96
  },
  headerActions: {
    flexDirection: 'row', alignItems: 'center', gap: 16
  },
  iconBtn: {
    alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(57, 181, 168, 0.2)', position: 'relative'
  },
  iconBtnSecondary: {
    padding: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(57, 181, 168, 0.2)'
  },
  badge: {
    position: 'absolute', top: -5, right: -5, width: 20, height: 20, backgroundColor: '#ef4444', borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white', zIndex: 10
  },
  badgeText: {
    color: 'white', fontSize: 10, fontWeight: '900'
  },
  scrollContainer: {
    flex: 1, width: '100%', paddingHorizontal: 16, paddingTop: 24
  },
  scrollContent: {
    paddingBottom: 60
  },
  sectionHeader: {
    fontSize: 14, fontWeight: 'bold', color: '#39B5A8', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 24
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 24, marginBottom: 32
  },
  actionCard: {
    width: '47%',
    height: 160,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(57, 181, 168, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 14,
    overflow: 'hidden',
  },
  actionCardImg: {
    width: 88,
    height: 88,
  },
  actionCardContent: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 8,
  },
  actionCardIndicator: {
    width: 24, height: 4, borderRadius: 2, backgroundColor: 'rgba(57, 181, 168, 0.3)', marginBottom: 8
  },
  actionCardTitle: {
    color: '#041614', fontWeight: '900', fontSize: 12
  },
  actionCardDesc: {
    color: '#9ca3af', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 4
  },
  deliveriesHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16
  },
  deliveriesTitle: {
    fontSize: 18, fontWeight: '900', color: '#041614'
  },
  viewAllBtn: {
    color: '#39B5A8', fontWeight: 'bold', fontSize: 12
  },
  deliveryItem: {
    backgroundColor: 'white', borderWidth: 1, borderColor: 'rgba(57, 181, 168, 0.2)', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2
  },
  deliveryInfoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 16
  },
  deliveryIconBox: {
    width: 48, height: 48, backgroundColor: 'rgba(57, 181, 168, 0.1)', borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(57, 181, 168, 0.2)'
  },
  deliveryId: {
    color: '#1A5D56', fontWeight: '900', fontSize: 14
  },
  deliveryLoc: {
    color: '#64748b', fontSize: 11, fontWeight: '500', marginTop: 4
  },
  deliveryTime: {
    color: '#39B5A8', fontSize: 10, fontWeight: 'bold', marginTop: 4
  },
  deliveryStatusCol: {
    alignItems: 'flex-end', gap: 8
  },
  statusLabel: {
    fontSize: 10, color: 'rgba(57, 181, 168, 0.6)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2, paddingBottom: 4
  },
  statusBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6
  },
  statusBadgeText: {
    fontSize: 10, fontWeight: '900', textTransform: 'uppercase'
  },
  spacer: {
    height: 40
  }
});
