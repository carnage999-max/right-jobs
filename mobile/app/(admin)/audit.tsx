import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Search, Clock, ShieldAlert } from 'lucide-react-native';
import { adminService } from '../../src/services/api/admin';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { Input } from '../../src/components/ui/Input';
import tw from 'twrnc';

export default function AdminAuditLogsScreen() {
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_AUDIT_LOGS],
    queryFn: () => adminService.getAuditLogs(),
  });

  const renderItem = ({ item }: any) => {
    const date = new Date(item.createdAt);
    
    return (
      <View style={tw`bg-white p-5 rounded-[32px] mb-4 shadow-sm border border-gray-100`}>
        <View style={tw`flex-row items-start mb-3`}>
          <View style={tw`bg-[#014D9F15] p-2 rounded-xl mr-4`}>
            <ShieldCheck size={18} color="#014D9F" />
          </View>
          <View style={tw`flex-1`}>
            <View style={tw`flex-row justify-between items-center mb-1`}>
              <Text style={tw`text-gray-900 font-bold text-sm flex-1 mr-2`}>
                {item.actorAdmin?.email || "System"}
              </Text>
              <View style={tw`bg-gray-100 px-2 py-0.5 rounded-lg`}>
                <Text style={tw`text-[9px] font-black uppercase text-gray-500 tracking-wider`}>
                  {item.action}
                </Text>
              </View>
            </View>
            <View style={tw`flex-row items-center`}>
              <Clock size={12} color="#94A3B8" style={tw`mr-1`} />
              <Text style={tw`text-gray-400 text-[10px] font-bold`}>
                {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={tw`bg-gray-50 p-3 rounded-2xl`}>
          <Text style={tw`text-gray-600 text-xs leading-5`}>
            Performed <Text style={tw`font-bold text-gray-900`}>{item.action}</Text> on {item.entityType}
            {item.details ? `: ${JSON.stringify(item.details)}` : ''}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={tw`flex-1 bg-gray-50 px-6 pt-16`}>
      <View style={tw`flex-row items-center mb-6`}>
        <View style={tw`bg-[#014D9F20] p-3 rounded-2xl mr-4`}>
          <ShieldAlert size={28} color="#014D9F" />
        </View>
        <Text style={tw`text-2xl font-black text-gray-900`}>Audit Logs</Text>
      </View>

      <Input
        placeholder="Filter by action or admin..."
        value={search}
        onChangeText={setSearch}
        containerStyle={tw`mb-6`}
        icon={<Search size={20} color="#94A3B8" />}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#014D9F" style={tw`mt-20`} />
      ) : (
        <FlatList
          data={data?.data || []}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 150 }}
          ListEmptyComponent={
            <View style={tw`items-center py-20`}>
              <ShieldCheck size={48} color="#E2E8F0" style={tw`mb-4`} />
              <Text style={tw`text-gray-400 text-center font-bold`}>No activity logs found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
