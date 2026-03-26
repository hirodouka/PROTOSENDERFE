import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface PackageDetails {
  size: string;
  itemType: string;
  quantity: number;
  weight?: string;
}

interface Props {
  onContinue: (details: PackageDetails) => void;
  onBack: () => void;
}

const SIZES = ['small', 'medium', 'large', 'xl'];
const TYPES = ['Documents', 'Electronics', 'Clothing', 'Food', 'Fragile', 'Other'];

export default function PackageDetails({ onContinue, onBack }: Props) {
  const [size, setSize] = useState('small');
  const [itemType, setItemType] = useState('Documents');
  const [quantity, setQuantity] = useState(1);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Package Details</Text>

      <Text style={styles.label}>Size</Text>
      <View style={styles.row}>
        {SIZES.map(s => (
          <TouchableOpacity key={s} style={[styles.chip, size === s && styles.chipActive]} onPress={() => setSize(s)}>
            <Text style={[styles.chipText, size === s && styles.chipTextActive]}>{s.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Item Type</Text>
      <View style={styles.row}>
        {TYPES.map(t => (
          <TouchableOpacity key={t} style={[styles.chip, itemType === t && styles.chipActive]} onPress={() => setItemType(t)}>
            <Text style={[styles.chipText, itemType === t && styles.chipTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Quantity</Text>
      <View style={styles.qtyRow}>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
          <Text style={styles.qtyBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qtyVal}>{quantity}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity(quantity + 1)}>
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.btn} onPress={() => onContinue({ size, itemType, quantity })}>
        <Text style={styles.btnText}>Add to Cart</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 20, fontWeight: '900', color: '#041614', marginBottom: 16 },
  label: { fontSize: 11, fontWeight: '800', color: '#39B5A8', textTransform: 'uppercase', letterSpacing: 1, marginTop: 16, marginBottom: 8 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F0F9F8', borderWidth: 1, borderColor: 'rgba(57,181,168,0.2)' },
  chipActive: { backgroundColor: '#39B5A8', borderColor: '#39B5A8' },
  chipText: { fontSize: 12, fontWeight: '700', color: '#1A5D56' },
  chipTextActive: { color: '#fff' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 8 },
  qtyBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#39B5A8', alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { color: '#fff', fontSize: 20, fontWeight: '900' },
  qtyVal: { fontSize: 22, fontWeight: '900', color: '#041614' },
  btn: { marginTop: 32, backgroundColor: '#39B5A8', borderRadius: 20, height: 52, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
