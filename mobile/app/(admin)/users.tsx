import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Search, MoreVertical, Ban, ShieldCheck, Mail, Clock, Trash2 } from 'lucide-react-native';
import { adminService } from '../../src/services/api/admin';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { Input } from '../../src/components/ui/Input';
import { useToast } from '../../src/hooks/useToast';

export default function AdminUsersScreen() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_USERS, search],
    queryFn: () => adminService.getUsers({ search }),
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
    <View className="bg-white p-5 rounded-[32px] mb-4 shadow-sm border border-gray-100">
      <View className="flex-row items-center mb-4">
        <View className="bg-primary/10 w-12 h-12 rounded-2xl items-center justify-center mr-4">
          <Users size={24} color="#014D9F" />
        </View>
        <View className="flex-1">
          <Text className="text-gray-900 font-bold text-base">{item.name || 'Anonymous'}</Text>
          <Text className="text-gray-400 text-xs font-medium">{item.email}</Text>
        </View>
        <View className={`px-2.5 py-1 rounded-lg ${item.role === 'ADMIN' ? 'bg-primary/10' : 'bg-gray-100'}`}>
          <Text className={`text-[9px] font-black uppercase tracking-widest ${item.role === 'ADMIN' ? 'text-primary' : 'text-gray-600'}`}>
            {item.role}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-x-3">
        <TouchableOpacity 
          className={`flex-1 flex-row items-center justify-center py-2.5 rounded-xl border ${item.isBanned ? 'bg-error/10 border-error' : 'bg-transparent border-gray-100'}`}
          onPress={() => confirmAction(item.id, item.isBanned ? 'unban' : 'ban', item.name || item.email)}
        >
          <Ban size={14} color={item.isBanned ? '#EF4444' : '#64748B'} className="mr-2" />
          <Text className={`text-[11px] font-bold ${item.isBanned ? 'text-error' : 'text-gray-500'}`}>
            {item.isBanned ? 'Unban' : 'Ban'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-1 flex-row items-center justify-center py-2.5 rounded-xl border border-gray-100"
          onPress={() => confirmAction(item.id, 'suspend', item.name || item.email)}
        >
          <Clock size={14} color="#64748B" className="mr-2" />
          <Text className="text-[11px] font-bold text-gray-500">Suspend</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-row items-center justify-center w-12 h-10 rounded-xl bg-error/5 border border-error/10"
          onPress={() => confirmAction(item.id, 'delete', item.name || item.email)}
        >
          <Trash2 size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background-light px-6 pt-16">
      <View className="flex-row items-center mb-6">
        <View className="bg-primary/10 p-3 rounded-2xl mr-4">
          <Users size={28} color="#014D9F" />
        </View>
        <Text className="text-2xl font-bold text-gray-900">User Management</Text>
      </View>

      <Input
        placeholder="Search users..."
        value={search}
        onChangeText={setSearch}
        containerClassName="mb-6"
        icon={<Search size={20} color="#94A3B8" />}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#014D9F" className="mt-20" />
      ) : (
        <FlatList
          data={data?.data || []}
          renderItem={renderUser}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 150 }}
          ListEmptyComponent={
            <Text className="text-gray-400 text-center py-10">No users found</Text>
          }
        />
      )}
    </View>
  );
}
