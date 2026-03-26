import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Package, HelpCircle, Bell, Truck, Gift, AlertCircle, LogOut } from 'lucide-react-native';

const logoImg = require('./assets/logo.png');
const sendParcelIcon = { uri: "https://i.imgur.com/a6gHhtu.png" };
const trackPackageIcon = { uri: "https://i.imgur.com/HHNarFY.png" };
const historyIcon = { uri: "https://i.imgur.com/4Xgmx8D.png" };
const rateReviewIcon = { uri: "https://i.imgur.com/pvzfoIz.png" };

export default function App() {
  return (
    <View className="flex-1 bg-[#F0F9F8]">
      <StatusBar style="auto" />
      
      {/* Header */}
      <View className="h-20 flex-row items-center justify-between px-6 border-b border-[#39B5A8]/10 bg-white/80 shrink-0 pt-8 z-50">
        <Image source={logoImg} className="h-8 w-24" resizeMode="contain" />

        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="relative flex items-center justify-center w-10 h-10 rounded-full border border-[#39B5A8]/20">
            <Bell size={20} color="#39B5A8" />
            <View className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full items-center justify-center border-2 border-white">
              <Text className="text-white text-[10px] font-black">2</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="p-2 rounded-xl border border-[#39B5A8]/20">
            <HelpCircle size={20} color="#39B5A8" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 w-full px-4 pt-6">
        
        {/* Navigation Section */}
        <Text className="text-[14px] font-bold text-[#39B5A8] uppercase tracking-widest mb-6">
          Navigation Menu
        </Text>

        <View className="flex-row flex-wrap justify-between gap-y-6 mb-8">
          <ActionCard image={sendParcelIcon} title="Send Parcel" desc="Book a delivery" accentColor="bg-[#FDB833]/10" />
          <ActionCard image={trackPackageIcon} title="Track Package" desc="Live tracking" accentColor="bg-[#54A0CC]/10" />
          <ActionCard image={historyIcon} title="History" desc="Past deliveries" accentColor="bg-[#39B5A8]/10" />
          <ActionCard image={rateReviewIcon} title="Rate & Review" desc="Give feedback" accentColor="bg-[#A6DCD6]/20" />
        </View>

        {/* Active Deliveries Section */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-black text-[#041614]">Active Deliveries</Text>
          <TouchableOpacity>
            <Text className="text-[#39B5A8] font-bold text-[12px]">View All</Text>
          </TouchableOpacity>
        </View>

        <DeliveryItem id="PKS-2024-001" location="Makati City" time="15 mins away" status="In Transit" statusClass="text-[#54A0CC] bg-[#54A0CC]/10" />
        <DeliveryItem id="PKS-2024-002" location="Quezon City" time="30 mins away" status="Out for Delivery" statusClass="text-[#FDB833] bg-[#FDB833]/10" />
        
        <View className="h-10"></View>
      </ScrollView>
    </View>
  );
}

// Sub-components
function ActionCard({ image, title, desc, accentColor }) {
  return (
    <TouchableOpacity className="relative flex-col items-center justify-end w-[47%] h-36 p-4 bg-white border border-[#39B5A8]/15 rounded-3xl shadow-sm overflow-visible">
      <View className={`absolute inset-0 opacity-10 rounded-3xl ${accentColor}`} />
      
      {image && (
        <View className="absolute -top-6 left-1/2 -ml-10 w-20 h-20 shadow-lg">
          <Image source={image} className="w-full h-full" resizeMode="contain" />
        </View>
      )}

      <View className="items-center w-full mt-auto">
        <View className="w-6 h-1 rounded-full bg-[#39B5A8]/30 mb-2" />
        <Text className="text-[#041614] font-black text-xs">{title}</Text>
        <Text className="text-gray-400 text-[10px] font-bold uppercase mt-1">{desc}</Text>
      </View>
    </TouchableOpacity>
  );
}

function DeliveryItem({ id, location, time, status, statusClass }) {
  return (
    <TouchableOpacity className="bg-white border border-[#39B5A8]/20 rounded-2xl p-4 flex-row items-center justify-between mb-3 shadow-sm">
      <View className="flex-row items-center gap-4">
        <View className="w-12 h-12 bg-[#39B5A8]/10 rounded-xl items-center justify-center border border-[#39B5A8]/20">
          <Package size={24} color="#39B5A8" />
        </View>

        <View>
          <Text className="text-[#1A5D56] font-black text-sm">{id}</Text>
          <Text className="text-slate-500 text-[11px] font-medium mt-1">{location}</Text>
          <Text className="text-[#39B5A8] text-[10px] font-bold mt-1">{time}</Text>
        </View>
      </View>

      <View className="items-end gap-2">
        <Text className="text-[10px] text-[#39B5A8]/60 font-black uppercase tracking-widest">Status</Text>
        <View className={`px-2 py-1 rounded-md ${statusClass}`}>
          <Text className={`text-[10px] font-black uppercase ${statusClass.split(' ')[0]}`}>{status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
