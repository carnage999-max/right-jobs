import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { FileText, Clock, ExternalLink } from 'lucide-react-native';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { apiClient } from '../../src/services/api/client';

export default function ApplicationsScreen() {
  const { data: applications, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.APPLICATIONS],
    queryFn: async () => {
      const resp = await apiClient.get('/applications');
      return resp.data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-success/10 text-success';
      case 'rejected': return 'bg-error/10 text-error';
      case 'under_review': return 'bg-warning/10 text-warning';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity className="bg-white p-5 rounded-2xl mb-4 shadow-sm border border-gray-100 flex-row">
      <View className="bg-gray-50 p-4 rounded-xl mr-4 self-start">
        <FileText size={24} color="#64748B" />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold text-gray-900 mb-1">{item.jobTitle || 'Job Role'}</Text>
        <Text className="text-gray-500 mb-2">{item.company || 'Company Name'}</Text>
        <View className="flex-row items-center">
          <Clock size={14} color="#94A3B8" />
          <Text className="text-gray-400 text-xs ml-1">{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>
      <View className={`px-3 py-1 rounded-full ${getStatusColor(item.status).split(' ')[0]} self-start`}>
        <Text className={`text-xs font-bold uppercase ${getStatusColor(item.status).split(' ')[1]}`}>
          {item.status || 'Pending'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background-light px-6 pt-16">
      <Text className="text-2xl font-bold text-gray-900 mb-6">My Applications</Text>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0EA5E9" />
        </View>
      ) : (
        <FlatList
          data={applications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center py-20">
              <Text className="text-gray-500 text-lg">No applications found.</Text>
              <TouchableOpacity className="mt-4">
                <Text className="text-primary font-bold">Find jobs to apply</Text>
              </TouchableOpacity>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
    </View>
  );
}
