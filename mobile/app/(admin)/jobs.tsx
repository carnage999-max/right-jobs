import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, Search, Plus, MapPin, DollarSign, ChevronRight } from 'lucide-react-native';
import { adminService } from '../../src/services/api/admin';
import { jobsService } from '../../src/services/api/jobs';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { Input } from '../../src/components/ui/Input';
import { useRouter } from 'expo-router';
import tw from 'twrnc';

export default function AdminJobsScreen() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_JOBS, search],
    queryFn: () => jobsService.getJobs({ search }), // Admins can use standard job search for preview
  });

  const renderItem = ({ item }: any) => (
    <View style={tw`bg-white p-5 rounded-[32px] mb-4 shadow-sm border border-gray-100`}>
      <View style={tw`flex-row justify-between items-start mb-4`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-gray-900 font-bold text-lg mb-1`}>{item.title}</Text>
          <Text style={tw`text-[#014D9F] font-bold text-sm`}>{item.company}</Text>
        </View>
        <View style={tw`bg-green-50 px-2 py-1 rounded-lg`}>
          <Text style={tw`text-green-600 font-black text-[10px] uppercase tracking-widest`}>{item.type || 'Full-time'}</Text>
        </View>
      </View>

      <View style={tw`flex-row items-center mb-6`}>
        <View style={tw`flex-row items-center mr-4`}>
          <MapPin size={14} color="#94A3B8" style={tw`mr-1`} />
          <Text style={tw`text-gray-400 text-xs font-bold`}>{item.location}</Text>
        </View>
        <View style={tw`flex-row items-center`}>
          <DollarSign size={14} color="#94A3B8" style={tw`mr-1`} />
          <Text style={tw`text-gray-400 text-xs font-bold`}>{item.salary || 'N/A'}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={tw`bg-gray-100 py-3 rounded-2xl flex-row items-center justify-center`}
        onPress={() => {}} // Placeholder for edit
      >
        <Text style={tw`text-gray-600 font-bold text-sm mr-2`}>Manage Listing</Text>
        <ChevronRight size={16} color="#4B5563" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-gray-50 px-6 pt-16`}>
      <View style={tw`flex-row justify-between items-center mb-6`}>
        <View style={tw`flex-row items-center`}>
          <View style={tw`bg-[#014D9F10] p-3 rounded-2xl mr-4`}>
            <Briefcase size={28} color="#014D9F" />
          </View>
          <Text style={tw`text-2xl font-black text-gray-900`}>Job Board</Text>
        </View>
        <TouchableOpacity 
          style={tw`bg-[#014D9F] p-3 rounded-2xl shadow-lg`}
          onPress={() => router.push('/post-job')}
        >
          <Plus size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Input
        placeholder="Filter jobs by title..."
        value={search}
        onChangeText={setSearch}
        containerStyle={tw`mb-6`}
        icon={<Search size={20} color="#94A3B8" />}
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#014D9F" style={tw`mt-20`} />
      ) : (
        <FlatList
          data={data || []}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 150 }}
          ListEmptyComponent={
            <View style={tw`items-center py-20`}>
              <Briefcase size={48} color="#E2E8F0" style={tw`mb-4`} />
              <Text style={tw`text-gray-400 text-center font-bold`}>No jobs to moderate</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
