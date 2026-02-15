import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { CreditCard, DollarSign, Search, Calendar, Download } from 'lucide-react-native';
import { adminService } from '../../src/services/api/admin';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { Input } from '../../src/components/ui/Input';

export default function AdminPaymentsScreen() {
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_PAYMENTS],
    queryFn: () => adminService.getPayments(),
  });

  const renderItem = ({ item }: any) => {
    const amount = (item.amount / 100).toLocaleString('en-US', { 
      style: 'currency', 
      currency: item.currency || 'USD' 
    });

    return (
      <View className="bg-white p-5 rounded-[32px] mb-4 shadow-sm border border-gray-100">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-gray-900 font-bold text-base">{item.user?.email}</Text>
            <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[0.15em] mt-0.5">
              {item.user?.name || "Unnamed"}
            </Text>
          </View>
          <View className={`px-2.5 py-1 rounded-lg ${item.status === 'COMPLETED' ? 'bg-success/10' : 'bg-warning/10'}`}>
            <Text className={`text-[9px] font-black uppercase tracking-widest ${item.status === 'COMPLETED' ? 'text-success' : 'text-warning'}`}>
              {item.status}
            </Text>
          </View>
        </View>

        <View className="flex-row items-baseline justify-between">
          <Text className="text-2xl font-black text-gray-900">{amount}</Text>
          <Text className="text-gray-400 text-[10px] font-bold">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        
        <View className="mt-4 pt-4 border-t border-gray-50 flex-row items-center">
          <CreditCard size={14} color="#94A3B8" className="mr-2" />
          <Text className="text-gray-400 text-[10px] font-mono flex-1 truncate">
            {item.stripeSessionId || "N/A"}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-background-light px-6 pt-16">
      <View className="flex-row items-center mb-6">
        <View className="bg-success/10 p-3 rounded-2xl mr-4">
          <DollarSign size={28} color="#10B981" />
        </View>
        <Text className="text-2xl font-black text-gray-900">Transactions</Text>
      </View>

      <Input
        placeholder="Customer email or ID..."
        value={search}
        onChangeText={setSearch}
        containerClassName="mb-6"
        icon={<Search size={20} color="#94A3B8" />}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#10B981" className="mt-20" />
      ) : (
        <FlatList
          data={data?.data || []}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 150 }}
          ListEmptyComponent={
            <View className="items-center py-20">
              <CreditCard size={48} color="#E2E8F0" className="mb-4" />
              <Text className="text-gray-400 text-center font-bold">No transactions found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
