import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, Search, Clock, ShieldAlert, ArrowLeft } from 'lucide-react-native';
import { adminService } from '../../src/services/api/admin';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { Input } from '../../src/components/ui/Input';
import { useRouter, useNavigation, useLocalSearchParams } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { tw } from '../../src/lib/tailwind';
import { useAuth } from '../../src/context/AuthContext';
import { AdminBottomNav } from '../../src/components/AdminBottomNav';

export default function AdminAuditLogsScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const userIdFilter = params.userId as string;
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_AUDIT_LOGS, page, userIdFilter],
    queryFn: () => adminService.getAuditLogs({ page, limit: 15, userId: userIdFilter }),
    enabled: !!user?.mfaComplete,
  });

  const renderItem = ({ item }: any) => {
    const date = new Date(item.createdAt);
    
    return (
      <View style={tw`bg-white p-5 rounded-[32px] mb-4 shadow-sm border border-gray-100`}>
        <View style={tw`flex-row items-start mb-3`}>
          <View style={tw`bg-[#014D9F15] p-3 rounded-2xl mr-4`}>
            <ShieldCheck size={20} color="#014D9F" />
          </View>
          <View style={tw`flex-1`}>
            <View style={tw`flex-row justify-between items-center mb-1`}>
              <Text style={tw`text-gray-900 font-bold text-sm flex-1 mr-2`} numberOfLines={1}>
                {item.actorAdmin?.name || item.actorAdmin?.email || "System Engine"}
              </Text>
              <View style={tw`bg-slate-50 px-2 py-1 rounded-lg border border-slate-100`}>
                <Text style={tw`text-[8px] font-black uppercase text-slate-500 tracking-wider`}>
                  {item.action}
                </Text>
              </View>
            </View>
            <View style={tw`flex-row items-center`}>
              <Clock size={12} color="#94A3B8" style={tw`mr-1`} />
              <Text style={tw`text-gray-400 text-[10px] font-bold`}>
                {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={tw`bg-slate-50 p-4 rounded-2xl border border-slate-100/50`}>
          <Text style={tw`text-slate-600 text-xs leading-5 font-medium`}>
            Triggered <Text style={tw`font-black text-[#014D9F]`}>{item.action}</Text> on {item.entityType} module.
            {item.metaJson && <Text style={tw`text-[10px] text-slate-400 font-bold ml-1`}> (ID: {item.entityId})</Text>}
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
      <View style={tw`flex-row items-center mb-10`}>
        <TouchableOpacity 
          style={tw`p-3 rounded-2xl mr-4 bg-slate-100 border border-slate-200`}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <ShieldAlert size={28} color="#014D9F" />
        </TouchableOpacity>
        <View>
          <Text style={tw`text-2xl font-black text-gray-900`}>Audit Logs</Text>
          <Text style={tw`text-xs font-bold text-slate-400 uppercase tracking-widest`}>Security Monitoring</Text>
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#014D9F" style={tw`mt-20`} />
      ) : (
        <FlatList
          data={data?.data || []}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 160 }}
          ListEmptyComponent={
            <View style={tw`items-center py-20`}>
              <ShieldCheck size={48} color="#E2E8F0" style={tw`mb-4`} />
              <Text style={tw`text-gray-400 text-center font-bold`}>No activity logs found</Text>
            </View>
          }
          ListFooterComponent={data?.pagination && (
            <View style={tw`flex-row justify-between items-center py-6 px-1`}>
              <TouchableOpacity 
                disabled={page === 1}
                onPress={() => setPage(page - 1)}
                style={tw`px-4 py-2 rounded-xl bg-white border border-slate-200 ${page === 1 ? 'opacity-30' : ''}`}
              >
                <Text style={tw`font-bold text-slate-600 text-xs`}>Previous</Text>
              </TouchableOpacity>
              <Text style={tw`text-slate-400 text-[10px] font-black uppercase tracking-widest`}>
                {page} / {data.pagination.totalPages}
              </Text>
              <TouchableOpacity 
                disabled={page >= data.pagination.totalPages}
                onPress={() => setPage(page + 1)}
                style={tw`px-4 py-2 rounded-xl bg-white border border-slate-200 ${page >= data.pagination.totalPages ? 'opacity-30' : ''}`}
              >
                <Text style={tw`font-bold text-slate-600 text-xs`}>Next</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      </View>
      <AdminBottomNav />
    </KeyboardAvoidingView>
  );
}
