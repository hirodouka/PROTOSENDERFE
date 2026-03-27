import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  MapPin, Target, Navigation, Clock, ChevronLeft, ChevronRight,
  CheckCircle, Send, AlertCircle, ArrowLeft,
} from 'lucide-react-native';
import Svg, { Path, Circle, Rect, Line, G, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PackageDetails, { PackageDetails as PackageDetailsType } from '../components/PackageDetails';
import ParcelCart from '../components/ParcelCart';
import DeliveryServiceSelector from '../components/DeliveryServiceSelector';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import LocationPickerModal from '../components/LocationPickerModal';
import BookingConfirmationModal from '../components/BookingConfirmationModal';
import DropOffPointSelector from '../components/DropOffPointSelector';

interface CartItem extends PackageDetailsType { id: string; }

const stepTitles = ['Where to?', 'Add Parcels', 'Your Cart', 'Select Service', 'Contact Info'];
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_WIDTH = SCREEN_WIDTH - 32;
const MAP_HEIGHT = 200;

// Pickup = top-left area, Delivery = bottom-right area
const PICKUP_X = 54;
const PICKUP_Y = 72;
const DELIVERY_X = MAP_WIDTH - 60;
const DELIVERY_Y = MAP_HEIGHT - 60;

function RouteMap({ hasPickup, hasDelivery }: { hasPickup: boolean; hasDelivery: boolean }) {
  const gridStep = 28;
  const gridLines = [];
  for (let x = 0; x < MAP_WIDTH; x += gridStep) {
    gridLines.push(<Line key={`v${x}`} x1={x} y1={0} x2={x} y2={MAP_HEIGHT} stroke="rgba(57,181,168,0.15)" strokeWidth={1} />);
  }
  for (let y = 0; y < MAP_HEIGHT; y += gridStep) {
    gridLines.push(<Line key={`h${y}`} x1={0} y1={y} x2={MAP_WIDTH} y2={y} stroke="rgba(57,181,168,0.15)" strokeWidth={1} />);
  }

  // Bezier curve control points for a natural route feel
  const cp1x = PICKUP_X + 60;
  const cp1y = PICKUP_Y + 20;
  const cp2x = DELIVERY_X - 80;
  const cp2y = DELIVERY_Y - 20;
  const curvePath = `M ${PICKUP_X} ${PICKUP_Y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${DELIVERY_X} ${DELIVERY_Y}`;

  return (
    <View style={styles.mapWrapper}>
      <Svg width={MAP_WIDTH} height={MAP_HEIGHT}>
        {/* Grid background */}
        {gridLines}

        {/* Route line */}
        {hasPickup && hasDelivery && (
          <Path
            d={curvePath}
            stroke="#B0C8C6"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* Pickup point */}
        <G x={PICKUP_X - 22} y={PICKUP_Y - 36}>
          {/* Chip background */}
          <Rect x={0} y={0} width={58} height={22} rx={11} fill="white" />
          <SvgText x={29} y={15} textAnchor="middle" fontSize={9} fontWeight="800" fill="#041614" letterSpacing={0.5}>PICKUP</SvgText>
        </G>
        {/* Blue pickup pin */}
        <Circle cx={PICKUP_X} cy={PICKUP_Y} r={12} fill="#39B5A8" />
        <Circle cx={PICKUP_X} cy={PICKUP_Y} r={5} fill="white" />

        {/* Delivery point */}
        <G x={DELIVERY_X - 32} y={DELIVERY_Y - 36}>
          <Rect x={0} y={0} width={66} height={22} rx={11} fill="#1A5D56" />
          <SvgText x={33} y={15} textAnchor="middle" fontSize={9} fontWeight="800" fill="white" letterSpacing={0.5}>DELIVERY</SvgText>
        </G>
        {/* Dark delivery pin */}
        <Circle cx={DELIVERY_X} cy={DELIVERY_Y} r={12} fill="#1A5D56" />
        <Circle cx={DELIVERY_X} cy={DELIVERY_Y} r={5} fill="white" />
      </Svg>
    </View>
  );
}

export default function SendParcel() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [currentStep, setCurrentStep] = useState(1);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectingFor, setSelectingFor] = useState<'pickup' | 'delivery' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const errorTimer = useRef<any>(null);

  const [pickupLocation, setPickupLocation] = useState<{ address: string } | null>(null);
  const [deliveryLocation, setDeliveryLocation] = useState<{ address: string } | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedService, setSelectedService] = useState('');
  const [servicePrice, setServicePrice] = useState(175);
  const [selectedDropOffPoint, setSelectedDropOffPoint] = useState<any>(null);

  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);
  const [bookingConfirmationData, setBookingConfirmationData] = useState<any>(null);

  const showError = (msg: string) => {
    setErrorMsg(msg);
    if (errorTimer.current) clearTimeout(errorTimer.current);
    errorTimer.current = setTimeout(() => setErrorMsg(null), 4000);
  };

  const handleContinueFromPackageDetails = (details: PackageDetailsType) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.size === details.size && item.itemType === details.itemType
    );
    if (existingIndex !== -1) {
      const newCart = [...cartItems];
      newCart[existingIndex].quantity += details.quantity;
      setCartItems(newCart);
    } else {
      setCartItems([...cartItems, { ...details, id: `${Date.now()}` }]);
    }
    setCurrentStep(3);
  };

  const handleSubmit = () => {
    if (!selectedPaymentMethod) { showError('Please select a payment method.'); return; }
    const trackingNumber = `PKS-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingConfirmationData({ trackingNumber, senderName, receiverName, servicePrice, totalCost: servicePrice });
    setShowBookingConfirmation(true);
  };

  const handleNext = () => {
    if (currentStep === 1 && (!pickupLocation || !deliveryLocation)) { showError('Select both locations first.'); return; }
    if (currentStep === 3 && cartItems.length === 0) { showError('Add at least one parcel.'); return; }
    if (currentStep === 4 && !selectedService) { showError('Select a delivery service.'); return; }
    setCurrentStep(Math.min(currentStep + 1, 5));
  };

  return (
    <View style={styles.container}>
      {/* Custom header matching the reference */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backCircle}
          onPress={() => currentStep === 1 ? router.back() : setCurrentStep(currentStep - 1)}
        >
          <ArrowLeft size={18} color="#041614" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{stepTitles[currentStep - 1]}</Text>
          <Text style={styles.headerSubtitle}>STEP {currentStep} OF {stepTitles.length}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress dots */}
      <View style={styles.progressRow}>
        {[1, 2, 3, 4, 5].map(s => (
          <View key={s} style={[styles.dot, s === currentStep ? styles.dotActive : s < currentStep ? styles.dotDone : styles.dotInactive]} />
        ))}
      </View>

      {/* Error toast */}
      {errorMsg && (
        <View style={styles.errorToast}>
          <AlertCircle size={16} color="#ef4444" />
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>

        {/* Step 1: Location with map */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>

            {/* Section header */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconWrap}>
                <MapPin size={16} color="#39B5A8" />
              </View>
              <Text style={styles.sectionTitle}>Route Details</Text>
            </View>

            {/* Map preview */}
            <RouteMap hasPickup={!!pickupLocation} hasDelivery={!!deliveryLocation} />

            {/* Address card */}
            <View style={styles.addressCard}>
              {/* Pickup */}
              <TouchableOpacity
                style={styles.addressRow}
                onPress={() => { setSelectingFor('pickup'); setShowLocationPicker(true); }}
              >
                <MapPin size={20} color="#39B5A8" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.addressLabel}>PICKUP ADDRESS</Text>
                  <Text style={[styles.addressValue, !pickupLocation && styles.addressPlaceholder]}>
                    {pickupLocation?.address || 'Tap to set pickup location'}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.addressDivider} />

              {/* Drop-off */}
              <TouchableOpacity
                style={styles.addressRow}
                onPress={() => { setSelectingFor('delivery'); setShowLocationPicker(true); }}
              >
                <Target size={20} color="#FDB833" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.addressLabel, { color: '#FDB833' }]}>DROP-OFF ADDRESS</Text>
                  <Text style={[styles.addressValue, !deliveryLocation && styles.addressPlaceholder]}>
                    {deliveryLocation?.address || 'Tap to set destination'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Branding footer */}
              <Text style={styles.brandingText}>PAKISHIP SECURE LOGISTICS</Text>
            </View>

            {/* Route info chip when both set */}
            {pickupLocation && deliveryLocation && (
              <View style={styles.routeInfo}>
                <Navigation size={13} color="#39B5A8" />
                <Text style={styles.routeText}>12.5 km</Text>
                <Clock size={13} color="#FDB833" />
                <Text style={styles.routeText}>25 mins</Text>
              </View>
            )}
          </View>
        )}

        {currentStep === 2 && (
          <PackageDetails onContinue={handleContinueFromPackageDetails} onBack={() => setCurrentStep(1)} />
        )}

        {currentStep === 3 && (
          <ParcelCart
            items={cartItems}
            onUpdateQuantity={(id, q) => setCartItems(prev => prev.map(i => i.id === id ? { ...i, quantity: q } : i))}
            onRemoveItem={(id) => setCartItems(prev => prev.filter(i => i.id !== id))}
            onContinue={() => cartItems.length > 0 ? setCurrentStep(4) : showError('Add a parcel first.')}
          />
        )}

        {currentStep === 4 && (
          <DeliveryServiceSelector
            distanceKm={12.5}
            onSelect={(id, price) => { setSelectedService(id); setServicePrice(price); }}
            selectedService={selectedService}
            totalParcels={cartItems.reduce((s, i) => s + i.quantity, 0)}
            packageSize={cartItems.some(i => i.size === 'xl') ? 'xl' : 'small'}
            onSelectDropOffPoint={setSelectedDropOffPoint}
            selectedDropOffPoint={selectedDropOffPoint}
            isSurgeActive={false}
            cartItems={cartItems}
          />
        )}

        {currentStep === 5 && (
          <View style={styles.stepContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconWrap}>
                <Send size={14} color="#39B5A8" />
              </View>
              <Text style={styles.sectionTitle}>Contact Info</Text>
            </View>
            <TextInput style={styles.input} placeholder="Sender Name" value={senderName} onChangeText={setSenderName} />
            <TextInput style={styles.input} placeholder="Sender Phone (09XX)" value={senderPhone} onChangeText={setSenderPhone} keyboardType="phone-pad" />
            <TextInput style={styles.input} placeholder="Receiver Name" value={receiverName} onChangeText={setReceiverName} />
            <TextInput style={styles.input} placeholder="Receiver Phone (09XX)" value={receiverPhone} onChangeText={setReceiverPhone} keyboardType="phone-pad" />
            <PaymentMethodSelector
              selectedMethod={selectedPaymentMethod}
              onSelect={setSelectedPaymentMethod}
              receiverName={receiverName}
              receiverPhone={receiverPhone}
            />
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Due</Text>
              <Text style={styles.summaryPrice}>₱{servicePrice}.00</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      {currentStep !== 2 && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          {currentStep === 5 ? (
            <View style={styles.footerRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setCurrentStep(4)}>
                <ChevronLeft size={18} color="#39B5A8" />
                <Text style={styles.secondaryBtnText}>Review</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: '#041614' }]} onPress={handleSubmit}>
                <CheckCircle size={18} color="#fff" />
                <Text style={styles.primaryBtnText}>Complete</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.footerRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => currentStep === 1 ? router.back() : setCurrentStep(currentStep - 1)}>
                <ChevronLeft size={18} color="#39B5A8" />
                <Text style={styles.secondaryBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
                <Text style={styles.primaryBtnText}>Continue</Text>
                <ChevronRight size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <LocationPickerModal
        isOpen={showLocationPicker && selectingFor !== null}
        onClose={() => setShowLocationPicker(false)}
        onSelect={selectingFor === 'pickup' ? setPickupLocation : setDeliveryLocation}
        type={selectingFor || 'pickup'}
      />
      <BookingConfirmationModal
        isOpen={showBookingConfirmation}
        onClose={() => router.replace('/')}
        bookingDetails={bookingConfirmationData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9F8' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(57,181,168,0.08)',
  },
  backCircle: {
    width: 40, height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#041614' },
  headerSubtitle: { fontSize: 10, fontWeight: '800', color: '#39B5A8', letterSpacing: 1.2, marginTop: 2 },

  // Progress
  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 10, backgroundColor: '#fff' },
  dot: { height: 4, borderRadius: 4 },
  dotActive: { width: 28, backgroundColor: '#39B5A8' },
  dotDone: { width: 8, backgroundColor: '#1A5D56' },
  dotInactive: { width: 8, backgroundColor: 'rgba(57,181,168,0.2)' },

  // Error
  errorToast: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderLeftWidth: 4, borderLeftColor: '#ef4444', marginHorizontal: 16, borderRadius: 12, padding: 12, marginTop: 8 },
  errorText: { flex: 1, fontSize: 12, fontWeight: '700', color: '#374151' },

  // Step 1
  stepContainer: { padding: 16, gap: 14 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionIconWrap: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: 'rgba(57,181,168,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: '#041614' },

  // Map
  mapWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#EAF6F5',
    borderWidth: 1,
    borderColor: 'rgba(57,181,168,0.15)',
  },

  // Address card
  addressCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(57,181,168,0.15)',
    overflow: 'hidden',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  addressLabel: {
    fontSize: 9,
    fontWeight: '900',
    color: '#39B5A8',
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  addressValue: { fontSize: 13, fontWeight: '700', color: '#041614' },
  addressPlaceholder: { color: '#aaa', fontWeight: '500' },
  addressDivider: { height: 1, backgroundColor: 'rgba(57,181,168,0.1)', marginHorizontal: 18 },
  brandingText: {
    textAlign: 'center',
    fontSize: 8,
    fontWeight: '800',
    color: 'rgba(57,181,168,0.35)',
    letterSpacing: 2,
    paddingVertical: 10,
  },

  // Route info
  routeInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1A5D56', borderRadius: 30, paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start' },
  routeText: { fontSize: 11, fontWeight: '800', color: '#fff' },

  // Inputs (Step 5)
  input: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(57,181,168,0.2)', paddingHorizontal: 16, height: 48, fontSize: 14, fontWeight: '700', color: '#041614' },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  summaryLabel: { fontSize: 14, fontWeight: '700', color: '#555' },
  summaryPrice: { fontSize: 22, fontWeight: '900', color: '#39B5A8' },

  // Footer
  footer: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: 'rgba(57,181,168,0.1)', paddingHorizontal: 16, paddingTop: 14 },
  footerRow: { flexDirection: 'row', gap: 12 },
  primaryBtn: { flex: 1, height: 52, backgroundColor: '#39B5A8', borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  secondaryBtn: { flex: 1, height: 52, backgroundColor: '#fff', borderRadius: 20, borderWidth: 2, borderColor: 'rgba(57,181,168,0.25)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  secondaryBtnText: { color: '#39B5A8', fontWeight: '800', fontSize: 16 },
});
