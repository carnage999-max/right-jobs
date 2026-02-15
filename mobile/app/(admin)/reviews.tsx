import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Trash2, Flag, User, Star } from 'lucide-react-native';
import { adminService } from '../../src/services/api/admin';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { useToast } from '../../src/hooks/useToast';

export default function AdminReviewsScreen() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_REVIEWS],
    queryFn: () => adminService.getReviews(),
  });

  const actionMutation = useMutation({
    mutationFn: ({ id, action }: { id: string, action: 'delete' | 'flag' }) => 
      adminService.actionReview(id, action),
    onSuccess: () => {
      showSuccess('Success', 'Review action completed');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ADMIN_REVIEWS] });
    },
    onError: () => showError('Error', 'Failed to perform action'),
  });

  const renderItem = ({ item }: any) => (
    <View className="bg-white p-5 rounded-[32px] mb-4 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center flex-1">
          <View className="bg-gray-100 w-10 h-10 rounded-full items-center justify-center mr-3">
            <User size={20} color="#64748B" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-900 font-bold text-sm">{item.author?.name || 'User'}</Text>
            <View className="flex-row items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={10} color={s <= item.rating ? '#F59E0B' : '#E2E8F0'} fill={s <= item.rating ? '#F59E0B' : 'transparent'} />
              ))}
              <Text className="text-gray-400 text-[10px] font-bold ml-2 uppercase tracking-widest">
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
        <Badge variant={item.isFlagged ? 'error' : 'success'} />
      </View>

      <Text className="text-gray-600 text-sm leading-5 mb-4">{item.content}</Text>

      <View className="flex-row gap-x-2">
        <TouchableOpacity 
          className="bg-error/10 p-2.5 rounded-xl flex-1 flex-row items-center justify-center"
          onPress={() => actionMutation.mutate({ id: item.id, action: 'delete' })}
        >
          <Trash2 size={16} color="#EF4444" />
          <Text className="text-error font-bold text-xs ml-2">Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-gray-100 p-2.5 rounded-xl flex-1 flex-row items-center justify-center"
          onPress={() => actionMutation.mutate({ id: item.id, action: 'flag' })}
        >
          <Flag size={16} color="#64748B" />
          <Text className="text-gray-500 font-bold text-xs ml-2">Flag</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background-light px-6 pt-16">
      <View className="flex-row items-center mb-6">
        <View className="bg-indigo-100 p-3 rounded-2xl mr-4">
          <MessageSquare size={28} color="#6366F1" />
        </View>
        <Text className="text-2xl font-black text-gray-900">Reviews</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#6366F1" className="mt-20" />
      ) : (
        <FlatList
          data={data?.data || []}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 150 }}
          ListEmptyComponent={
            <View className="items-center py-20">
              <MessageSquare size={48} color="#E2E8F0" className="mb-4" />
              <Text className="text-gray-400 text-center font-bold">No reviews found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const Badge = ({ variant }: { variant: 'error' | 'success' }) => (
  <View className={`px-2 py-0.5 rounded-lg ${variant === 'error' ? 'bg-error/10' : 'bg-success/10'}`}>
    <Text className={`text-[8px] font-black uppercase tracking-wider ${variant === 'error' ? 'text-error' : 'text-success'}`}>
      {variant === 'error' ? 'Flagged' : 'Active'}
    </Text>
  </View>
);
