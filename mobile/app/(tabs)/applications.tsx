import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { FileText, Clock, ExternalLink, Briefcase, AlertCircle, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { apiClient } from '../../src/services/api/client';
import { tw } from '../../src/lib/tailwind';

export default function ApplicationsScreen() {
  const router = useRouter();
  const { data: applicationsData, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.APPLICATIONS],
    queryFn: async () => {
      const resp = await apiClient.get('/applications');
      return resp.data;
    },
    retry: 1,
  });

  const applications = applicationsData?.data || [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return { bg: '#DCFCE7', text: '#15803D' };
      case 'rejected':
        return { bg: '#FEE2E2', text: '#DC2626' };
      case 'under_review':
        return { bg: '#FEF3C7', text: '#D97706' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const statusColor = getStatusColor(item.status);
    return (
      <TouchableOpacity style={tw`bg-white p-5 rounded-[2rem] mb-4 shadow-sm border border-slate-100 flex-row`}>
        <View style={tw`bg-slate-50 p-4 rounded-2xl mr-4 self-start`}>
          <Briefcase size={24} color="#64748B" />
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`text-lg font-bold text-slate-900 mb-1`}>{item.job?.title || 'Job Role'}</Text>
          <Text style={tw`text-slate-600 text-sm mb-2`}>{item.job?.company || 'Company'}</Text>
          <View style={tw`flex-row items-center gap-2`}>
            <Clock size={14} color="#94A3B8" />
            <Text style={tw`text-slate-400 text-xs font-medium`}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View
          style={[
            tw`px-3 py-1.5 rounded-lg self-start`,
            { backgroundColor: statusColor.bg }
          ]}
        >
          <Text style={[tw`text-xs font-bold uppercase tracking-wide`, { color: statusColor.text }]}>
            {item.status || 'Pending'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-slate-50 items-center justify-center`}>
        <ActivityIndicator size="large" color="#014D9F" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      {/* System Header */}
      <View style={tw`bg-slate-50 pt-12 pb-3 px-6 border-b border-slate-100 flex-row items-center justify-between`}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={tw`p-2 -ml-2 rounded-full`}
        >
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <FileText size={24} color="#014D9F" />
      </View>

      {/* Custom Header */}
      <View style={tw`bg-white pt-4 pb-4 px-6 border-b border-slate-100`}>
        <Text style={tw`text-2xl font-black text-slate-900 tracking-tighter`}>My Applications</Text>
        <Text style={tw`text-slate-500 text-xs font-bold uppercase tracking-widest mt-1`}>
          {applications.length} total
        </Text>
      </View>

      {error || (!applications || applications.length === 0) ? (
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <View style={tw`bg-slate-100 p-4 rounded-full mb-4`}>
            <Briefcase size={40} color="#CBD5E1" />
          </View>
          <Text style={tw`text-lg font-bold text-slate-900 text-center mb-2`}>
            No Applications Yet
          </Text>
          <Text style={tw`text-slate-500 text-center text-sm leading-relaxed mb-6`}>
            Start applying to jobs to see your applications here.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/jobs' as any)}
            style={tw`bg-primary px-6 py-3 rounded-xl`}
          >
            <Text style={tw`text-white font-bold uppercase tracking-wide`}>Browse Jobs</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={applications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`p-6 pb-20`}
          scrollEnabled={true}
        />
      )}
    </View>
  );
}
