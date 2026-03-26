import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CreditCard, Wallet, Banknote } from 'lucide-react-native';

const METHODS = [
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
  { id: 'gcash', label: 'GCash', icon: Wallet },
  { id: 'card', label: 'Debit / Credit Card', icon: CreditCard },
];

interface Props {
  selectedMethod: string;
  onSelect: (id: string) => void;
  selectedServiceId?: string;
  receiverName?: string;
  receiverPhone?: string;
  onReceiverChange?: (data: { name: string; phone: string }) => void;
}

export default function PaymentMethodSelector({ selectedMethod, onSelect }: Props) {
  return (
    <View>
      <Text style={styles.label}>Payment Method</Text>
      {METHODS.map(m => {
        const Icon = m.icon;
        const selected = selectedMethod === m.id;
        return (
          <TouchableOpacity key={m.id} style={[styles.row, selected && styles.rowActive]} onPress={() => onSelect(m.id)}>
            <Icon size={18} color={selected ? '#39B5A8' : '#aaa'} />
            <Text style={[styles.text, selected && styles.textActive]}>{m.label}</Text>
            {selected && <View style={styles.dot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 11, fontWeight: '800', color: '#39B5A8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: 'rgba(57,181,168,0.15)', marginBottom: 8, backgroundColor: '#fff' },
  rowActive: { borderColor: '#39B5A8', backgroundColor: '#F0F9F8' },
  text: { flex: 1, fontSize: 14, fontWeight: '700', color: '#888' },
  textActive: { color: '#1A5D56' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#39B5A8' },
});
