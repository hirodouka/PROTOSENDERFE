import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Trash2 } from 'lucide-react-native';

interface CartItem { id: string; size: string; itemType: string; quantity: number; }
interface Props {
  items: CartItem[];
  onUpdateQuantity: (id: string, q: number) => void;
  onRemoveItem: (id: string) => void;
  onContinue: () => void;
}

export default function ParcelCart({ items, onUpdateQuantity, onRemoveItem, onContinue }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Cart ({items.reduce((s,i) => s + i.quantity, 0)} items)</Text>
      <ScrollView style={{ flex: 1 }}>
        {items.map(item => (
          <View key={item.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.itemType} — {item.size.toUpperCase()}</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity style={styles.qBtn} onPress={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                  <Text style={styles.qBtnTxt}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qVal}>{item.quantity}</Text>
                <TouchableOpacity style={styles.qBtn} onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                  <Text style={styles.qBtnTxt}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => onRemoveItem(item.id)}>
              <Trash2 size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
        {items.length === 0 && <Text style={styles.empty}>Your cart is empty.</Text>}
      </ScrollView>
      <TouchableOpacity style={styles.btn} onPress={onContinue}>
        <Text style={styles.btnTxt}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 18, fontWeight: '900', color: '#041614', marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(57,181,168,0.15)' },
  itemTitle: { fontSize: 14, fontWeight: '800', color: '#1A5D56' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  qBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#39B5A8', alignItems: 'center', justifyContent: 'center' },
  qBtnTxt: { color: '#fff', fontWeight: '900', fontSize: 16 },
  qVal: { fontSize: 16, fontWeight: '900', color: '#041614' },
  empty: { textAlign: 'center', color: '#aaa', marginTop: 40 },
  btn: { marginTop: 16, backgroundColor: '#39B5A8', borderRadius: 20, height: 52, alignItems: 'center', justifyContent: 'center' },
  btnTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },
});
