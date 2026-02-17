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
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_USERS, search],
    queryFn: () => adminService.getUsers({ search }),
    enabled: !!user?.mfaComplete,
  });

  const actionMutation = useMutation({
    mutationFn: ({ userId, action }: { userId: string, action: string }) => 
      adminService.actionUser(userId, action),
    onSuccess: (data: any) => {
      showSuccess('Success', data.message || 'Action completed');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_USERS] });
    },
    onError: () => showError('Error', 'Failed to perform action'),
  });

  const confirmAction = (userId: string, action: string, userName: string) => {
    const actionText = action.charAt(0).toUpperCase() + action.slice(1);
    Alert.alert(
      `${actionText} User`,
      `Are you sure you want to ${action} ${userName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: actionText, 
          style: action === 'delete' || action === 'ban' ? 'destructive' : 'default',
          onPress: () => actionMutation.mutate({ userId, action }) 
        }
      ]
    );
  };

  const renderUser = ({ item }: any) => (
    <View style={tw`bg-white p-5 rounded-[32px] mb-4 shadow-sm border border-gray-100`}>
      <View style={tw`flex-row items-center mb-4`}>
        <View style={tw`bg-[#014D9F10] w-12 h-12 rounded-2xl items-center justify-center mr-4`}>
          <Users size={24} color="#014D9F" />
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`text-gray-900 font-bold text-base`}>{item.name || 'Anonymous'}</Text>
          <Text style={tw`text-gray-400 text-xs font-medium`}>{item.email}</Text>
        </View>
        <View style={tw`px-2.5 py-1 rounded-lg ${item.role === 'ADMIN' ? 'bg-[#014D9F10]' : 'bg-gray-100'}`}>
          <Text style={tw`text-[9px] font-black uppercase tracking-widest ${item.role === 'ADMIN' ? 'text-[#014D9F]' : 'text-gray-600'}`}>
            {item.role}
          </Text>
        </View>
      </View>

      <View style={tw`flex-row gap-x-3`}>
        <TouchableOpacity 
          style={tw`flex-1 flex-row items-center justify-center py-2.5 rounded-xl border ${item.isBanned ? 'bg-red-50 border-red-500' : 'bg-transparent border-gray-100'}`}
          onPress={() => confirmAction(item.id, item.isBanned ? 'unban' : 'ban', item.name || item.email)}
        >
          <Ban size={14} color={item.isBanned ? '#EF4444' : '#64748B'} style={tw`mr-2`} />
          <Text style={tw`text-[11px] font-bold ${item.isBanned ? 'text-red-500' : 'text-gray-500'}`}>
            {item.isBanned ? 'Unban' : 'Ban'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={tw`flex-1 flex-row items-center justify-center py-2.5 rounded-xl border border-gray-100`}
          onPress={() => confirmAction(item.id, 'suspend', item.name || item.email)}
        >
          <Clock size={14} color="#64748B" style={tw`mr-2`} />
          <Text style={tw`text-[11px] font-bold text-gray-500`}>Suspend</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={tw`flex-row items-center justify-center w-12 h-10 rounded-xl bg-red-50 border border-red-100`}
          onPress={() => confirmAction(item.id, 'delete', item.name || item.email)}
        >
          <Trash2 size={16} color="#EF4444" />
        </TouchableOpacity>
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
          contentContainerStyle={{ paddingBottom: 120 }}
          ListEmptyComponent={
            <Text style={tw`text-gray-400 text-center py-10`}>No users found</Text>
          }
        />
      )}
      <AdminBottomNav />
    </View>
  );
}
