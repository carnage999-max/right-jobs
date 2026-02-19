import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { FileText, Clock, ChevronRight, Briefcase, AlertCircle, ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { apiClient } from '../../src/services/api/client';
import { tw } from '../../src/lib/tailwind';

interface Application {
  id: string;
  job?: {
    title?: string;
    companyName?: string;
    location?: string;
  };
  status: string;
  createdAt: string;
}

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

  const applications: Application[] = applicationsData?.data || [];

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; bgHex: string }> = {
      PENDING: { bg: '#F3F4F6', text: '#6B7280', bgHex: '#6B7280' },
      REVIEWING: { bg: '#DBEAFE', text: '#1E40AF', bgHex: '#1E40AF' },
      INTERVIEWING: { bg: '#DBEAFE', text: '#014D9F', bgHex: '#014D9F' },
      OFFERED: { bg: '#DCFCE7', text: '#15803D', bgHex: '#15803D' },
      REJECTED: { bg: '#FEE2E2', text: '#DC2626', bgHex: '#DC2626' },
    };
    return statusMap[status] || statusMap.PENDING;
  };

  const renderStatusBadge = (status: string) => {
    const color = getStatusColor(status);
    return (
      <View style={[tw`px-3 py-1.5 rounded-full`, { backgroundColor: color.bg }]}>
        <Text style={[tw`text-xs font-black uppercase tracking-widest`, { color: color.text }]}>
          {status}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Application }) => (
    <TouchableOpacity 
      style={tw`bg-white p-6 rounded-[2.5rem] mb-4 shadow-sm border border-slate-50 flex-row items-center justify-between`}
      onPress={() => router.push({
        pathname: '/(tabs)/jobs/[id]',
        params: { id: item.job?.title || 'Job' }
      })}
    >
      <View style={tw`flex-row items-center flex-1`}>
        <View style={tw`bg-slate-50 p-4 rounded-2xl mr-4`}>
          <Briefcase size={24} color="#64748B" />
        </View>
        <View style={tw`flex-1`}>
          <Text style={[tw`text-lg font-black mb-1`, { color: '#0F172A' }]}>
            {item.job?.title || 'Job Role'}
          </Text>
          <Text style={[tw`text-sm font-bold mb-3`, { color: '#014D9F' }]}>
            {item.job?.companyName || 'Company'}
          </Text>
          <View style={tw`flex-row items-center gap-2`}>
            <Clock size={12} color="#94A3B8" />
            <Text style={[tw`text-xs font-semibold`, { color: '#94A3B8' }]}>
              Applied {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={tw`items-center`}>
        {renderStatusBadge(item.status)}
        <ChevronRight size={20} color="#CBD5E1" style={tw`mt-4`} />
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-slate-50 items-center justify-center`}>
        <ActivityIndicator size="large" color="#014D9F" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      {/* Header */}
      <View style={tw`bg-white pt-12 pb-4 px-6 border-b border-slate-100 flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center flex-1`}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={tw`p-2 -ml-2 mr-4 rounded-full`}
          >
            <ChevronLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <View>
            <Text style={[tw`text-xl font-black tracking-tight`, { color: '#0F172A' }]}>
              Your Applications
            </Text>
            <Text style={[tw`text-xs font-bold uppercase tracking-widest mt-1`, { color: '#94A3B8' }]}>
              {applications.length} total
            </Text>
          </View>
        </View>
        <FileText size={24} color="#014D9F" />
      </View>

      {error || (!applications || applications.length === 0) ? (
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <View style={tw`bg-slate-100 p-4 rounded-full mb-4`}>
            <Briefcase size={40} color="#CBD5E1" />
          </View>
          <Text style={[tw`text-lg font-black mb-2 text-center`, { color: '#0F172A' }]}>
            No Applications Yet
          </Text>
          <Text style={[tw`text-slate-500 text-center text-sm leading-relaxed mb-6`, { color: '#64748B' }]}>
            Start applying to jobs to see your applications here.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/jobs' as any)}
            style={tw`bg-primary px-8 py-3 rounded-xl`}
          >
            <Text style={tw`text-white font-black uppercase tracking-wider`}>Browse Jobs</Text>
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
