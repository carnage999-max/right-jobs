import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Users, Search, MoreVertical, Ban, ShieldCheck, Mail, Clock, Trash2, Filter, Key, UserCog, History, ShieldAlert } from 'lucide-react-native';
import { adminService } from '../../src/services/api/admin';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { Input } from '../../src/components/ui/Input';
import { useToast } from '../../src/hooks/useToast';
import { tw } from '../../src/lib/tailwind';
import { useAuth } from '../../src/context/AuthContext';
import { AdminBottomNav } from '../../src/components/AdminBottomNav';
import { ActionMenu } from '../../src/components/ui/ActionMenu';
import { EditUserModal } from '../../src/components/ui/EditUserModal';

export default function AdminUsersScreen() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  // Menu States
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_USERS, search, page, roleFilter],
    queryFn: () => adminService.getUsers({ 
      search, 
      page, 
      role: roleFilter === 'ALL' ? undefined : roleFilter 
    }),
    enabled: !!user?.mfaComplete,
  });

  const actionMutation = useMutation({
    mutationFn: ({ userId, action }: { userId: string, action: string }) => {
      let backendAction = action.toUpperCase();
      if (action === 'ban') backendAction = 'SUSPEND';
      if (action === 'unban') backendAction = 'ACTIVATE';
      return adminService.actionUser(userId, backendAction);
    },
    onSuccess: (res: any) => {
      showSuccess('Success', res.message || 'Action completed');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_USERS] });
    },
    onError: (err: any) => {
      console.error('[Action Error]', err);
      showError('Action Failed', 'The server rejected this request. Please check permissions.');
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string, data: { name: string, role: string } }) => 
      adminService.updateUser(userId, data),
    onSuccess: () => {
      showSuccess('Profile Updated', 'User changes have been saved successfully.');
      setEditModalVisible(false);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_USERS] });
    },
    onError: () => showError('Error', 'Failed to update user profile'),
  });

  const menuItems = [
    { 
      label: 'Edit Official Profile', 
      icon: UserCog, 
      onPress: () => setEditModalVisible(true) 
    },
    { 
      label: 'Security Audit History', 
      icon: History, 
      onPress: () => router.push(`/(admin)/audit?userId=${selectedUser?.id}`) 
    },
    { 
      label: 'Force Password Reset', 
      icon: Key, 
      onPress: () => actionMutation.mutate({ userId: selectedUser.id, action: 'FORCE_PASSWORD_RESET' }) 
    },
    { 
      label: selectedUser?.isSuspended ? 'Activate Account' : 'Suspend Account', 
      icon: Clock, 
      variant: selectedUser?.isSuspended ? 'warning' : 'destructive' as any,
      onPress: () => actionMutation.mutate({ userId: selectedUser.id, action: selectedUser.isSuspended ? 'unban' : 'ban' }) 
    },
    { 
      label: 'Permanent Deletion', 
      icon: Trash2, 
      variant: 'destructive' as any,
      onPress: () => {
        Alert.alert(
          'Confirm Deletion',
          `Are you sure you want to PERMANENTLY delete ${selectedUser.name || selectedUser.email}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => actionMutation.mutate({ userId: selectedUser.id, action: 'DELETE' }) }
          ]
        );
      }
    },
  ];

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
              <View style={tw`bg-red-50 px-1.5 py-0.5 rounded-md border border-red-100`}>
                <Text style={tw`text-[7px] font-black text-red-500 uppercase tracking-tighter`}>Suspended</Text>
              </View>
            )}
          </View>
          <Text style={tw`text-gray-400 text-xs font-medium`}>{item.email}</Text>
        </View>
        <View style={tw`flex-row items-center gap-2`}>
          <View style={tw`px-2.5 py-1 rounded-lg ${item.role === 'ADMIN' ? 'bg-[#014D9F10]' : 'bg-slate-50 border border-slate-100'}`}>
            <Text style={tw`text-[9px] font-black uppercase tracking-widest ${item.role === 'ADMIN' ? 'text-[#014D9F]' : 'text-slate-400'}`}>
              {item.role}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => {
              setSelectedUser(item);
              setMenuVisible(true);
            }}
            style={tw`p-2 rounded-xl bg-slate-50 border border-slate-100`}
          >
            <MoreVertical size={18} color="#94A3B8" />
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
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={tw`flex-1 bg-gray-50`}
    >
      <View style={tw`flex-1 px-6 pt-16`}>
        <View style={tw`flex-row justify-between items-center mb-8`}>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity 
              style={tw`p-3 rounded-2xl mr-4 bg-slate-100 border border-slate-200`}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Users size={28} color="#014D9F" />
            </TouchableOpacity>
            <View>
              <Text style={tw`text-2xl font-black text-gray-900`}>Identity Base</Text>
              <Text style={tw`text-xs font-bold text-slate-400 uppercase tracking-widest`}>System Governance</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => setFilterMenuVisible(true)}
            style={tw`p-3 bg-white border border-slate-100 rounded-2xl shadow-sm`}
          >
            <Filter size={20} color={roleFilter === 'ALL' ? '#64748B' : '#014D9F'} />
          </TouchableOpacity>
        </View>

        <Input
          placeholder="Lookup by name or email..."
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
            contentContainerStyle={{ paddingBottom: 160 }}
            ListEmptyComponent={
              <View style={tw`items-center py-20`}>
                 <ShieldAlert size={48} color="#E2E8F0" style={tw`mb-4`} />
                 <Text style={tw`text-gray-400 text-center font-bold`}>No identities found in system</Text>
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

      <ActionMenu 
        visible={menuVisible} 
        onClose={() => setMenuVisible(false)} 
        title="Administrative Controls"
        items={menuItems}
      />

      <ActionMenu 
        visible={filterMenuVisible} 
        onClose={() => setFilterMenuVisible(false)} 
        title="Filter by System Role"
        items={[
          { label: 'All Identities', onPress: () => setRoleFilter('ALL'), icon: Users },
          { label: 'Administrators Only', onPress: () => setRoleFilter('ADMIN'), icon: ShieldCheck },
          { label: 'Platform Users', onPress: () => setRoleFilter('USER'), icon: Mail },
          { label: 'Employer Accounts', onPress: () => setRoleFilter('EMPLOYER'), icon: Trash2 },
        ]}
      />

      {selectedUser && (
        <EditUserModal 
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          user={selectedUser}
          isLoading={editMutation.isPending}
          onSave={(data) => editMutation.mutateAsync({ userId: selectedUser.id, data })}
        />
      )}

      <AdminBottomNav />
    </KeyboardAvoidingView>
  );
}
