import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  MapPin, Target, Navigation, Clock, ChevronLeft, ChevronRight,
  CheckCircle, Send, AlertCircle,
} from 'lucide-react-native';

import { CustomerPageHeader } from '../components/CustomerPageHeader';
import PackageDetails, { PackageDetails as PackageDetailsType } from '../components/PackageDetails';
import ParcelCart from '../components/ParcelCart';
import DeliveryServiceSelector from '../components/DeliveryServiceSelector';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import LocationPickerModal from '../components/LocationPickerModal';
import BookingConfirmationModal from '../components/BookingConfirmationModal';
import OnboardingModal from '../components/OnboardingModal';
import DropOffPointSelector from '../components/DropOffPointSelector';
import DropOffQRModal from '../components/DropOffQRModal';

interface CartItem extends PackageDetailsType { id: string; }

const stepTitles = ['Where to?', 'Add Parcels', 'Your Cart', 'Select Service', 'Contact Info'];

export default function SendParcel() {
  const router = useRouter();
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
  const [showOnboarding] = useState(false);

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
      <CustomerPageHeader
        stepTitles={stepTitles}
        currentStep={currentStep}
        subtitle={`Step ${currentStep} of ${stepTitles.length}`}
        onBack={() => currentStep === 1 ? router.back() : setCurrentStep(currentStep - 1)}
        icon={Send as any}
      />

      {/* Progress dots */}
      <View style={styles.progressRow}>
        {[1,2,3,4,5].map(s => (
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
        {/* Step 1: Location */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepHeading}>Route Details</Text>
            <TouchableOpacity style={styles.locationBtn} onPress={() => { setSelectingFor('pickup'); setShowLocationPicker(true); }}>
              <MapPin size={18} color="#39B5A8" />
              <View style={{ flex: 1 }}>
                <Text style={styles.locationLabel}>PICKUP ADDRESS</Text>
                <Text style={[styles.locationValue, !pickupLocation && styles.locationPlaceholder]}>
                  {pickupLocation?.address || 'Tap to set pickup location'}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.locationBtn} onPress={() => { setSelectingFor('delivery'); setShowLocationPicker(true); }}>
              <Target size={18} color="#FDB833" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.locationLabel, { color: '#FDB833' }]}>DROP-OFF ADDRESS</Text>
                <Text style={[styles.locationValue, !deliveryLocation && styles.locationPlaceholder]}>
                  {deliveryLocation?.address || 'Tap to set destination'}
                </Text>
              </View>
            </TouchableOpacity>
            {pickupLocation && deliveryLocation && (
              <View style={styles.routeInfo}>
                <Navigation size={14} color="#39B5A8" />
                <Text style={styles.routeText}>12.5 km</Text>
                <Clock size={14} color="#FDB833" />
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
            <Text style={styles.stepHeading}>Contact Info</Text>
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
        <View style={styles.footer}>
          {currentStep === 5 ? (
            <View style={styles.footerRow}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setCurrentStep(4)}>
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
      {showOnboarding && <OnboardingModal onComplete={() => {}} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9F8' },
  progressRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 10, backgroundColor: 'rgba(240,249,248,0.8)' },
  dot: { height: 4, borderRadius: 4 },
  dotActive: { width: 28, backgroundColor: '#39B5A8' },
  dotDone: { width: 8, backgroundColor: '#1A5D56' },
  dotInactive: { width: 8, backgroundColor: 'rgba(57,181,168,0.2)' },
  errorToast: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderLeftWidth: 4, borderLeftColor: '#ef4444', marginHorizontal: 16, borderRadius: 12, padding: 12, marginBottom: 4 },
  errorText: { flex: 1, fontSize: 12, fontWeight: '700', color: '#374151' },
  stepContainer: { padding: 16, gap: 12 },
  stepHeading: { fontSize: 18, fontWeight: '900', color: '#041614', marginBottom: 8 },
  locationBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(57,181,168,0.2)' },
  locationLabel: { fontSize: 9, fontWeight: '900', color: '#39B5A8', letterSpacing: 1.5, marginBottom: 2 },
  locationValue: { fontSize: 13, fontWeight: '700', color: '#041614' },
  locationPlaceholder: { color: '#aaa' },
  routeInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#1A5D56', borderRadius: 30, paddingHorizontal: 16, paddingVertical: 8, alignSelf: 'flex-start' },
  routeText: { fontSize: 11, fontWeight: '800', color: '#fff' },
  input: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: 'rgba(57,181,168,0.2)', paddingHorizontal: 16, height: 48, fontSize: 14, fontWeight: '700', color: '#041614' },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  summaryLabel: { fontSize: 14, fontWeight: '700', color: '#555' },
  summaryPrice: { fontSize: 22, fontWeight: '900', color: '#39B5A8' },
  footer: { backgroundColor: 'rgba(255,255,255,0.95)', borderTopWidth: 1, borderTopColor: 'rgba(57,181,168,0.1)', padding: 16 },
  footerRow: { flexDirection: 'row', gap: 12 },
  primaryBtn: { flex: 1, height: 52, backgroundColor: '#39B5A8', borderRadius: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  primaryBtnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  secondaryBtn: { flex: 1, height: 52, backgroundColor: '#fff', borderRadius: 20, borderWidth: 2, borderColor: 'rgba(57,181,168,0.25)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 },
  secondaryBtnText: { color: '#39B5A8', fontWeight: '800', fontSize: 16 },
});
