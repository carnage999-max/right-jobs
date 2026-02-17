import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Users, Search, MoreVertical, Ban, ShieldCheck, Mail, Clock, Trash2 } from 'lucide-react-native';
import { adminService } from '../../src/services/api/admin';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { Input } from '../../src/components/ui/Input';
import { useToast } from '../../src/hooks/useToast';
import { tw } from '../../src/lib/tailwind';
import { useAuth } from '../../src/context/AuthContext';
import { AdminBottomNav } from '../../src/components/AdminBottomNav';

export default function AdminUsersScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_USERS, search, page],
    queryFn: () => adminService.getUsers({ search, page }),
    enabled: !!user?.mfaComplete,
  });

  const actionMutation = useMutation({
    mutationFn: ({ userId, action }: { userId: string, action: string }) => {
      // Map mobile actions to backend enums
      let backendAction = action.toUpperCase();
      if (action === 'ban') backendAction = 'SUSPEND';
      if (action === 'unban') backendAction = 'ACTIVATE';
      if (action === 'suspend') backendAction = 'SUSPEND';
      
      return adminService.actionUser(userId, backendAction);
    },
    onSuccess: (data: any) => {
      showSuccess('Success', data.message || 'Action completed');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_USERS] });
    },
    onError: (err: any) => {
      console.error('[Action Error]', err);
      showError('Error', 'Failed to perform action');
    },
  });

  const showActions = (item: any) => {
    const options = [
      item.isSuspended ? 'Activate User' : 'Suspend User',
      'Force Password Reset',
      'Delete User',
      'Cancel'
    ];
    const destructiveIndex = 2;
    const cancelIndex = 3;

    Alert.alert(
      item.name || item.email,
      'Select administrative action',
      [
        { 
          text: item.isSuspended ? 'Activate User' : 'Suspend User', 
          onPress: () => actionMutation.mutate({ userId: item.id, action: item.isSuspended ? 'unban' : 'ban' }) 
        },
        { 
          text: 'Force Password Reset', 
          onPress: () => actionMutation.mutate({ userId: item.id, action: 'FORCE_PASSWORD_RESET' }) 
        },
        { 
          text: 'Delete User', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm Delete',
              `Are you sure you want to PERMANENTLY delete ${item.name || item.email}?`,
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => actionMutation.mutate({ userId: item.id, action: 'delete' }) }
              ]
            );
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const renderUser = ({ item }: any) => (
    <View style={tw`bg-white p-5 rounded-[32px] mb-4 shadow-sm border border-gray-100`}>
      <View style={tw`flex-row items-center`}>
        <View style={tw`bg-[#014D9F10] w-12 h-12 rounded-2xl items-center justify-center mr-4`}>
          <Users size={24} color="#014D9F" />
        </View>
        <View style={tw`flex-1`}>
          <View style={tw`flex-row items-center gap-2 mb-0.5`}>
            <Text style={tw`text-gray-900 font-bold text-base`}>{item.name || 'Anonymous'}</Text>
            {item.isSuspended && (
              <View style={tw`bg-red-50 px-1.5 py-0.5 rounded-md`}>
                <Text style={tw`text-[8px] font-black text-red-500 uppercase tracking-tighter`}>Suspended</Text>
              </View>
            )}
          </View>
          <Text style={tw`text-gray-400 text-xs font-medium`}>{item.email}</Text>
        </View>
        <View style={tw`flex-row items-center gap-2`}>
          <View style={tw`px-2.5 py-1 rounded-lg ${item.role === 'ADMIN' ? 'bg-[#014D9F10]' : 'bg-gray-100'}`}>
            <Text style={tw`text-[9px] font-black uppercase tracking-widest ${item.role === 'ADMIN' ? 'text-[#014D9F]' : 'text-gray-600'}`}>
              {item.role}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => showActions(item)}
            style={tw`p-2 rounded-xl bg-slate-50 border border-slate-100`}
          >
            <MoreVertical size={18} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={tw`mt-4 flex-row items-center gap-4`}>
        <View style={tw`flex-row items-center gap-1.5`}>
          <Clock size={12} color="#94A3B8" />
          <Text style={tw`text-[10px] font-bold text-slate-400`}>Joined {new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
        {item.emailVerifiedAt && (
          <View style={tw`flex-row items-center gap-1.5`}>
            <ShieldCheck size={12} color="#10B981" />
            <Text style={tw`text-[10px] font-bold text-green-500`}>Verified</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-gray-50 px-6 pt-16`}>
      <View style={tw`flex-row items-center mb-6`}>
        <TouchableOpacity 
          style={tw`p-3 rounded-2xl mr-4 bg-slate-100 border border-slate-200`}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Users size={28} color="#014D9F" />
        </TouchableOpacity>
        <Text style={tw`text-2xl font-bold text-gray-900`}>User Management</Text>
      </View>

      <Input
        placeholder="Search users..."
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
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 150 }}
          ListEmptyComponent={
            <Text style={tw`text-gray-400 text-center py-10`}>No users found</Text>
          }
          ListFooterComponent={data?.pagination && (
            <View style={tw`flex-row justify-between items-center py-6 px-4`}>
              <TouchableOpacity 
                disabled={page === 1}
                onPress={() => setPage(page - 1)}
                style={tw`px-4 py-2 rounded-xl bg-white border border-slate-200 ${page === 1 ? 'opacity-50' : ''}`}
              >
                <Text style={tw`font-bold text-slate-600`}>Previous</Text>
              </TouchableOpacity>
              <Text style={tw`text-slate-400 font-bold`}>Page {page} of {data.pagination.totalPages}</Text>
              <TouchableOpacity 
                disabled={page >= data.pagination.totalPages}
                onPress={() => setPage(page + 1)}
                style={tw`px-4 py-2 rounded-xl bg-white border border-slate-200 ${page >= data.pagination.totalPages ? 'opacity-50' : ''}`}
              >
                <Text style={tw`font-bold text-slate-600`}>Next</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <AdminBottomNav />
    </View>
  );
}
