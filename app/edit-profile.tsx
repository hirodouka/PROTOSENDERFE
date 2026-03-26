import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Modal, Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  User, Mail, Phone, MapPin, Calendar, Save,
  Lock, ShieldCheck, Bell, MessageSquare, RefreshCw, X, Eye, EyeOff,
} from 'lucide-react-native';
import { CustomerPageHeader } from '../components/CustomerPageHeader';

type TabType = 'profile' | 'discount' | 'preferences';

export default function EditProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showPass, setShowPass] = useState({ current: false, new: false });
  const [toast, setToast] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: 'Juan Dela Cruz',
    email: 'guest@pakiship.ph',
    phone: '09123456789',
    address: '123 Ayala Ave, Makati City',
    dob: '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsUpdates: true,
    autoExtend: false,
    twoFactor: false,
  });

  const [passwordData, setPasswordData] = useState({ current: '', new: '' });
  const [discountIdUploaded] = useState(false);

  const userInitials = formData.name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    showToast('Profile updated successfully!');
    setTimeout(() => router.replace('/'), 1500);
  };

  const togglePref = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.container}>
      <CustomerPageHeader title="Profile Settings" subtitle="Edit your account" icon={User as any} onBack={() => router.back()} />

      {/* Toast */}
      {toast && (
        <View style={styles.toast}><Text style={styles.toastText}>{toast}</Text></View>
      )}

      {/* Avatar + name */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{userInitials}</Text></View>
        <View>
          <Text style={styles.avatarName}>{formData.name}</Text>
          <Text style={styles.avatarRole}>Customer Account</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {(['profile', 'discount', 'preferences'] as TabType[]).map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'discount' ? 'Discount' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal Details</Text>
            <FormInput icon={<User size={18} color="#39B5A8" />} label="Full Name" value={formData.name} onChange={(v: string) => setFormData({ ...formData, name: v })} />
            <FormInput icon={<Mail size={18} color="#39B5A8" />} label="Email Address" value={formData.email} onChange={(v: string) => setFormData({ ...formData, email: v })} keyboardType="email-address" />
            <FormInput icon={<Phone size={18} color="#39B5A8" />} label="Phone Number" value={formData.phone} onChange={(v: string) => setFormData({ ...formData, phone: v })} keyboardType="phone-pad" />
            <FormInput icon={<Calendar size={18} color="#39B5A8" />} label="Birth Date" value={formData.dob} onChange={(v: string) => setFormData({ ...formData, dob: v })} placeholder="YYYY-MM-DD" />
            <FormInput icon={<MapPin size={18} color="#39B5A8" />} label="Primary Address" value={formData.address} onChange={(v: string) => setFormData({ ...formData, address: v })} />
          </View>
        )}

        {/* Discount Tab */}
        {activeTab === 'discount' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Special Discount</Text>
            <Text style={styles.cardSubtitle}>Upload valid ID for automatic discounts on deliveries.</Text>
            {discountIdUploaded ? (
              <View style={styles.uploadedBox}>
                <ShieldCheck size={48} color="#39B5A8" />
                <Text style={styles.uploadedTitle}>ID Uploaded Successfully</Text>
                <Text style={styles.uploadedSub}>Pending admin verification.</Text>
              </View>
            ) : (
              <View style={styles.uploadBox}>
                <ShieldCheck size={48} color="#ccc" />
                <Text style={styles.uploadTitle}>Upload ID Document</Text>
                <Text style={styles.uploadSub}>Supports JPG, PNG or PDF (Max 5MB)</Text>
                <TouchableOpacity style={styles.uploadBtn} onPress={() => showToast('File picker coming soon!')}>
                  <Text style={styles.uploadBtnText}>Choose File</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Preferences</Text>
            <PrefRow icon={<Mail size={20} color="#39B5A8" />} label="Email Notifications" desc="Booking confirmations via email" value={preferences.emailNotifications} onChange={() => togglePref('emailNotifications')} />
            <PrefRow icon={<MessageSquare size={20} color="#39B5A8" />} label="SMS Updates" desc="Real-time text alerts for deliveries" value={preferences.smsUpdates} onChange={() => togglePref('smsUpdates')} />
            <PrefRow icon={<RefreshCw size={20} color="#39B5A8" />} label="Auto-Extend Booking" desc="Automatically extend expiring storage" value={preferences.autoExtend} onChange={() => togglePref('autoExtend')} />
            <PrefRow icon={<ShieldCheck size={20} color="#39B5A8" />} label="Two-Factor Auth" desc="Extra security layer for your account" value={preferences.twoFactor} onChange={() => setShow2FAModal(true)} />
          </View>
        )}

        {/* Security section */}
        <View style={styles.securityCard}>
          <Text style={styles.secTitle}>Security</Text>
          <TouchableOpacity style={styles.changePassBtn} onPress={() => setShowPasswordModal(true)}>
            <Lock size={16} color="#39B5A8" />
            <Text style={styles.changePassText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* Save button */}
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Save size={18} color="#fff" />
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Password Modal */}
      <Modal visible={showPasswordModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Security Update</Text>
              <TouchableOpacity onPress={() => setShowPasswordModal(false)}><X size={20} color="#555" /></TouchableOpacity>
            </View>
            <Text style={styles.modalFieldLabel}>Current Password</Text>
            <View style={styles.passRow}>
              <TextInput style={{ flex: 1 }} secureTextEntry={!showPass.current} value={passwordData.current} onChangeText={v => setPasswordData({ ...passwordData, current: v })} placeholder="Enter current password" />
              <TouchableOpacity onPress={() => setShowPass(p => ({ ...p, current: !p.current }))}>
                {showPass.current ? <EyeOff size={18} color="#aaa" /> : <Eye size={18} color="#aaa" />}
              </TouchableOpacity>
            </View>
            <Text style={styles.modalFieldLabel}>New Password</Text>
            <View style={styles.passRow}>
              <TextInput style={{ flex: 1 }} secureTextEntry={!showPass.new} value={passwordData.new} onChangeText={v => setPasswordData({ ...passwordData, new: v })} placeholder="Enter new password" />
              <TouchableOpacity onPress={() => setShowPass(p => ({ ...p, new: !p.new }))}>
                {showPass.new ? <EyeOff size={18} color="#aaa" /> : <Eye size={18} color="#aaa" />}
              </TouchableOpacity>
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowPasswordModal(false)}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={() => { showToast('Password updated!'); setShowPasswordModal(false); }}>
                <Text style={styles.modalSaveText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 2FA Modal */}
      <Modal visible={show2FAModal} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enable 2FA</Text>
              <TouchableOpacity onPress={() => setShow2FAModal(false)}><X size={20} color="#555" /></TouchableOpacity>
            </View>
            <Text style={styles.modalDesc}>Two-factor authentication adds an extra layer of security. Enable it now?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShow2FAModal(false)}><Text style={styles.modalCancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={() => {
                togglePref('twoFactor');
                showToast('2FA enabled!');
                setShow2FAModal(false);
              }}>
                <Text style={styles.modalSaveText}>Enable</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function FormInput({ icon, label, value, onChange, keyboardType = 'default', placeholder }: any) {
  return (
    <View style={fi.wrap}>
      <Text style={fi.label}>{label}</Text>
      <View style={fi.row}>
        <View style={fi.icon}>{icon}</View>
        <TextInput style={fi.input} value={value} onChangeText={onChange} keyboardType={keyboardType} placeholder={placeholder || label} />
      </View>
    </View>
  );
}
const fi = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { fontSize: 9, fontWeight: '900', color: '#39B5A8', letterSpacing: 1.5, marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F9F8', borderRadius: 12, borderWidth: 2, borderColor: 'rgba(57,181,168,0.15)', paddingHorizontal: 12, height: 46 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 14, fontWeight: '700', color: '#041614' },
});

function PrefRow({ icon, label, desc, value, onChange }: any) {
  return (
    <View style={pr.row}>
      <View style={pr.icon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={pr.label}>{label}</Text>
        <Text style={pr.desc}>{desc}</Text>
      </View>
      <Switch trackColor={{ false: '#e5e7eb', true: '#39B5A8' }} thumbColor="#fff" value={value} onValueChange={onChange} />
    </View>
  );
}
const pr = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', gap: 14 },
  icon: {},
  label: { fontSize: 14, fontWeight: '800', color: '#041614' },
  desc: { fontSize: 11, color: '#888', marginTop: 2 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9F8' },
  toast: { backgroundColor: '#1A5D56', marginHorizontal: 16, borderRadius: 12, padding: 12, marginBottom: 4 },
  toastText: { color: '#fff', fontWeight: '800', fontSize: 13, textAlign: 'center' },
  avatarSection: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(57,181,168,0.1)' },
  avatar: { width: 60, height: 60, borderRadius: 18, backgroundColor: '#1A5D56', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '900', color: '#fff' },
  avatarName: { fontSize: 16, fontWeight: '900', color: '#041614' },
  avatarRole: { fontSize: 11, color: '#39B5A8', fontWeight: '700', marginTop: 2 },
  tabsRow: { flexDirection: 'row', backgroundColor: '#fff', padding: 4, gap: 4, borderBottomWidth: 1, borderBottomColor: 'rgba(57,181,168,0.1)' },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  tabActive: { backgroundColor: '#F0F9F8' },
  tabText: { fontSize: 11, fontWeight: '800', color: '#aaa' },
  tabTextActive: { color: '#39B5A8' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(57,181,168,0.12)' },
  cardTitle: { fontSize: 18, fontWeight: '900', color: '#041614', marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: '#888', marginBottom: 16 },
  uploadedBox: { alignItems: 'center', backgroundColor: '#F0F9F8', borderRadius: 16, padding: 28, borderWidth: 1, borderColor: 'rgba(57,181,168,0.2)' },
  uploadedTitle: { fontSize: 16, fontWeight: '800', color: '#1A5D56', marginTop: 12 },
  uploadedSub: { fontSize: 12, color: '#39B5A8', marginTop: 4 },
  uploadBox: { alignItems: 'center', borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(57,181,168,0.3)', borderRadius: 16, padding: 28, backgroundColor: '#F9FCFC' },
  uploadTitle: { fontSize: 15, fontWeight: '800', color: '#041614', marginTop: 12 },
  uploadSub: { fontSize: 11, color: '#aaa', marginTop: 4 },
  uploadBtn: { marginTop: 16, backgroundColor: '#39B5A8', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 14 },
  uploadBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  securityCard: { backgroundColor: '#fff', borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(57,181,168,0.12)' },
  secTitle: { fontSize: 13, fontWeight: '900', color: '#041614', marginBottom: 10 },
  changePassBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1.5, borderColor: 'rgba(57,181,168,0.2)', borderRadius: 14, padding: 14 },
  changePassText: { fontSize: 14, fontWeight: '800', color: '#1A5D56' },
  saveBtn: { backgroundColor: '#39B5A8', borderRadius: 20, height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, shadowColor: '#39B5A8', shadowOpacity: 0.3, shadowRadius: 12, elevation: 4 },
  saveBtnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 36 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#041614' },
  modalFieldLabel: { fontSize: 10, fontWeight: '900', color: '#39B5A8', letterSpacing: 1.5, marginBottom: 6, marginTop: 12 },
  passRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F9F8', borderRadius: 12, borderWidth: 2, borderColor: 'rgba(57,181,168,0.15)', paddingHorizontal: 14, height: 48, marginBottom: 4 },
  modalDesc: { fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 20 },
  modalCancelBtn: { flex: 1, height: 48, borderRadius: 14, borderWidth: 2, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  modalCancelText: { color: '#888', fontWeight: '800' },
  modalSaveBtn: { flex: 1, height: 48, borderRadius: 14, backgroundColor: '#041614', alignItems: 'center', justifyContent: 'center' },
  modalSaveText: { color: '#fff', fontWeight: '800' },
});
