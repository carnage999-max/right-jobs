import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, MapPin } from 'lucide-react-native';
import { jobsService } from '../../src/services/api/jobs';
import { QUERY_KEYS } from '../../src/constants/queryKeys';

export default function JobsScreen() {
  const [search, setSearch] = useState('');
  
  const { data: jobs, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.JOBS, search],
    queryFn: () => jobsService.getJobs({ search }),
  });

  const renderJobItem = ({ item }: { item: any }) => (
    <TouchableOpacity className="bg-white p-5 rounded-2xl mb-4 shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-bold text-gray-900 flex-1 mr-2">{item.title}</Text>
        <Text className="text-primary font-semibold">{item.salary || 'Competitive'}</Text>
      </View>
      <Text className="text-gray-600 mb-3">{item.company}</Text>
      <View className="flex-row items-center">
        <MapPin size={16} color="#94A3B8" />
        <Text className="text-gray-400 text-sm ml-1">{item.location}</Text>
        <View className="bg-gray-100 px-2 py-1 rounded-md ml-auto">
          <Text className="text-gray-600 text-xs font-medium">{item.type || 'Full-time'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-background-light px-6 pt-16">
      <Text className="text-2xl font-bold text-gray-900 mb-6">Find Jobs</Text>
      
      <View className="flex-row mb-6">
        <View className="flex-1 flex-row items-center bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
          <Search size={20} color="#94A3B8" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-900"
            placeholder="Search roles or companies"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity className="ml-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100 items-center justify-center">
          <Filter size={20} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0EA5E9" />
        </View>
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center py-20">
              <Text className="text-gray-500 text-lg">No jobs found matching your search.</Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
    </View>
  );
}
