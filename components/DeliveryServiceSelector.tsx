import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Zap, Package, Clock } from 'lucide-react-native';

const SERVICES = [
  { id: 'standard', label: 'Standard', desc: '1-3 days delivery', basePrice: 120, icon: Package },
  { id: 'express', label: 'Express', desc: 'Same day delivery', basePrice: 175, icon: Zap },
  { id: 'scheduled', label: 'Scheduled', desc: 'Choose your time slot', basePrice: 150, icon: Clock },
];

interface Props {
  distanceKm: number;
  onSelect: (id: string, price: number, options?: any) => void;
  selectedService: string;
  totalParcels: number;
  packageSize: string;
  onSelectDropOffPoint: (hub: any) => void;
  selectedDropOffPoint: any;
  isSurgeActive: boolean;
  cartItems: any[];
}

export default function DeliveryServiceSelector({ onSelect, selectedService }: Props) {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Choose a Service</Text>
      {SERVICES.map(svc => {
        const Icon = svc.icon;
        const isSelected = selectedService === svc.id;
        return (
          <TouchableOpacity key={svc.id} style={[styles.card, isSelected && styles.cardActive]} onPress={() => onSelect(svc.id, svc.basePrice)}>
            <View style={[styles.icon, isSelected && styles.iconActive]}>
              <Icon size={22} color={isSelected ? '#fff' : '#39B5A8'} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, isSelected && styles.labelActive]}>{svc.label}</Text>
              <Text style={styles.desc}>{svc.desc}</Text>
            </View>
            <Text style={[styles.price, isSelected && styles.labelActive]}>₱{svc.basePrice}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 18, fontWeight: '900', color: '#041614', marginBottom: 16 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 2, borderColor: 'rgba(57,181,168,0.15)' },
  cardActive: { borderColor: '#39B5A8', backgroundColor: '#F0F9F8' },
  icon: { width: 46, height: 46, borderRadius: 14, backgroundColor: 'rgba(57,181,168,0.1)', alignItems: 'center', justifyContent: 'center' },
  iconActive: { backgroundColor: '#39B5A8' },
  label: { fontSize: 15, fontWeight: '800', color: '#1A5D56' },
  labelActive: { color: '#039B8F' },
  desc: { fontSize: 11, color: '#888', marginTop: 2 },
  price: { fontSize: 16, fontWeight: '900', color: '#1A5D56' },
});
