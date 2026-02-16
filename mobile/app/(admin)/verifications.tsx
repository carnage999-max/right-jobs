import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldAlert, Check, X, Eye } from 'lucide-react-native';
import { adminService } from '../../src/services/api/admin';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { useToast } from '../../src/hooks/useToast';
import { Button } from '../../src/components/ui/Button';
import tw from 'twrnc';

export default function AdminVerificationsScreen() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_VERIFICATIONS],
    queryFn: () => adminService.getVerifications(),
  });

  const decideMutation = useMutation({
    mutationFn: ({ id, decision }: { id: string, decision: 'approve' | 'reject' }) => 
      adminService.decideVerification(id, decision),
    onSuccess: () => {
      showSuccess('Success', 'Verification decision recorded');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_VERIFICATIONS] });
    },
    onError: () => showError('Error', 'Failed to submit decision'),
  });

  const renderItem = ({ item }: any) => (
    <View style={tw`bg-white p-5 rounded-3xl mb-4 shadow-sm border border-gray-100`}>
      <View style={tw`flex-row justify-between items-center mb-4`}>
        <View>
          <Text style={tw`text-gray-900 font-bold text-lg`}>{item.user?.name || 'Pending User'}</Text>
          <Text style={tw`text-gray-500 text-sm`}>{item.user?.email}</Text>
        </View>
        <ShieldAlert size={24} color="#F59E0B" />
      </View>
      
      <View style={tw`flex-row gap-x-2 mb-6`}>
        <View style={tw`flex-1 aspect-[1.6] bg-gray-100 rounded-xl items-center justify-center overflow-hidden`}>
          {item.frontImageUrl ? (
            <Image 
              source={{ uri: item.frontImageUrl }} 
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          ) : (
            <Text style={tw`text-[10px] text-gray-400 font-bold uppercase`}>Front ID</Text>
          )}
        </View>
        <View style={tw`flex-1 aspect-[1.6] bg-gray-100 rounded-xl items-center justify-center overflow-hidden`}>
          {item.backImageUrl ? (
            <Image 
              source={{ uri: item.backImageUrl }} 
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          ) : (
            <Text style={tw`text-[10px] text-gray-400 font-bold uppercase`}>Back ID</Text>
          )}
        </View>
      </View>

      <View style={tw`flex-row gap-x-3`}>
        <TouchableOpacity 
          style={tw`flex-1 bg-green-50 py-3 rounded-2xl flex-row items-center justify-center`}
          onPress={() => decideMutation.mutate({ id: item.id, decision: 'approve' })}
        >
          <Check size={20} color="#10B981" />
          <Text style={tw`text-green-600 font-bold ml-2`}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={tw`flex-1 bg-red-50 py-3 rounded-2xl flex-row items-center justify-center`}
          onPress={() => decideMutation.mutate({ id: item.id, decision: 'reject' })}
        >
          <X size={20} color="#EF4444" />
          <Text style={tw`text-red-500 font-bold ml-2`}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-gray-50 px-6 pt-16`}>
      <View style={tw`flex-row items-center mb-6`}>
        <View style={tw`bg-orange-50 p-3 rounded-2xl mr-4`}>
          <ShieldAlert size={28} color="#F59E0B" />
        </View>
        <Text style={tw`text-2xl font-bold text-gray-900`}>ID Verifications</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#F59E0B" style={tw`mt-20`} />
      ) : (
        <FlatList
          data={data?.data || []}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 150 }}
          ListEmptyComponent={
            <View style={tw`items-center py-20`}>
              <Check size={48} color="#10B981" style={tw`mb-4 opacity-20`} />
              <Text style={tw`text-gray-400 text-center`}>No pending verifications</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
