import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, DollarSign, Search, Calendar, Download } from 'lucide-react-native';
import { adminService } from '../../src/services/api/admin';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { Input } from '../../src/components/ui/Input';
import { tw } from '../../src/lib/tailwind';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useAuth } from '../../src/context/AuthContext';
import { AdminBottomNav } from '../../src/components/AdminBottomNav';

export default function AdminPaymentsScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_PAYMENTS],
    queryFn: () => adminService.getPayments(),
    enabled: !!user?.mfaComplete,
  });

  const renderItem = ({ item }: any) => {
    const amount = (item.amount / 100).toLocaleString('en-US', { 
      style: 'currency', 
      currency: item.currency || 'USD' 
    });

    return (
      <View style={tw`bg-white p-5 rounded-[32px] mb-4 shadow-sm border border-gray-100`}>
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <View>
            <Text style={tw`text-gray-900 font-bold text-base`}>{item.user?.email}</Text>
            <Text style={tw`text-gray-400 text-[10px] font-black uppercase tracking-widest mt-0.5`}>
              {item.user?.name || "Unnamed"}
            </Text>
          </View>
          <View style={tw`px-2.5 py-1 rounded-lg ${item.status === 'COMPLETED' ? 'bg-green-50' : 'bg-orange-50'}`}>
            <Text style={tw`text-[9px] font-black uppercase tracking-widest ${item.status === 'COMPLETED' ? 'text-green-600' : 'text-orange-500'}`}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={tw`flex-row items-baseline justify-between`}>
          <Text style={tw`text-2xl font-black text-gray-900`}>{amount}</Text>
          <Text style={tw`text-gray-400 text-[10px] font-bold`}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={tw`mt-4 pt-4 border-t border-gray-50 flex-row items-center`}>
          <CreditCard size={14} color="#94A3B8" style={tw`mr-2`} />
          <Text style={tw`text-gray-400 text-[10px] font-mono flex-1`}>
            {item.stripeSessionId || "N/A"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={tw`flex-1 bg-gray-50`}
    >
      <View style={tw`flex-1 px-6 pt-16`}>
      <View style={tw`flex-row items-center mb-6`}>
        <TouchableOpacity 
          style={tw`p-3 rounded-2xl mr-4 bg-slate-100 border border-slate-200`}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <DollarSign size={28} color="#014D9F" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-black text-gray-900`}>Transactions</Text>
      </View>

      <Input
        placeholder="Customer email or ID..."
        value={search}
        onChangeText={setSearch}
        containerStyle={tw`mb-6`}
        icon={<Search size={20} color="#94A3B8" />}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#10B981" style={tw`mt-20`} />
      ) : (
        <FlatList
          data={data?.data || []}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 160 }}
          ListEmptyComponent={
            <View style={tw`items-center py-20`}>
              <CreditCard size={48} color="#E2E8F0" style={tw`mb-4`} />
              <Text style={tw`text-gray-400 text-center font-bold`}>No transactions found</Text>
            </View>
          }
        />
      )}
      </View>
      <AdminBottomNav />
    </KeyboardAvoidingView>
  );
}
