import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, MapPin, Briefcase, DollarSign, ChevronRight, Bookmark } from 'lucide-react-native';
import { jobsService } from '../../src/services/api/jobs';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { ImageGallery } from '../../src/components/ImageGallery';
import { tw } from '../../src/lib/tailwind';

export default function SavedJobsScreen() {
  const router = useRouter();
  
  const { data: jobs, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.JOBS, 'saved'],
    queryFn: () => jobsService.getSavedJobs(),
  });

  const renderJobCard = (item: any) => (
    <TouchableOpacity 
      onPress={() => router.push({
        pathname: '/(tabs)/jobs/[id]',
        params: { id: item.id }
      })}
      style={tw`bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 mb-6`}
    >
      <View style={tw`flex-row gap-4`}>
        {item.companyLogoUrl ? (
          <ImageGallery images={[item.companyLogoUrl]}>
            <View style={tw`h-16 w-16 rounded-2xl bg-white border border-slate-100 items-center justify-center shadow-lg shadow-slate-200/50 overflow-hidden shrink-0`}>
              <Image source={{ uri: item.companyLogoUrl }} style={tw`h-full w-full`} resizeMode="cover" />
            </View>
          </ImageGallery>
        ) : (
          <View style={tw`h-16 w-16 rounded-2xl bg-white border border-slate-100 items-center justify-center shadow-lg shadow-slate-200/50 overflow-hidden shrink-0`}>
            <View style={tw`h-full w-full bg-primary/5 flex items-center justify-center`}>
              <Text style={tw`text-primary font-black text-2xl`}>{item.companyName?.[0] || 'J'}</Text>
            </View>
          </View>
        )}
        <View style={tw`flex-1`}>
          <View style={tw`flex-row justify-between items-start mb-1`}>
            <Text style={tw`text-xl font-black text-slate-900 flex-1 mr-2 leading-tight tracking-tight`}>{item.title}</Text>
          </View>
          <View style={tw`flex-row items-center mb-4`}>
            <Briefcase size={14} color="#014D9F" style={tw`mr-1`} />
            <Text style={tw`text-slate-900 font-extrabold text-sm`}>{item.companyName}</Text>
          </View>

          <View style={tw`flex-row flex-wrap gap-2`}>
            <View style={tw`flex-row items-center bg-slate-50 px-3 py-1.5 rounded-xl`}>
              <MapPin size={12} color="#94A3B8" />
              <Text style={tw`text-[10px] font-bold text-slate-500 ml-1 uppercase tracking-tight`}>{item.location}</Text>
            </View>
            {item.salaryRange && (
              <View style={tw`flex-row items-center bg-green-50 px-3 py-1.5 rounded-xl`}>
                <DollarSign size={12} color="#10B981" />
                <Text style={tw`text-[10px] font-bold text-green-700 ml-1`}>{item.salaryRange}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      
      <View style={tw`flex-row justify-between items-center mt-6 pt-6 border-t border-slate-50`}>
        <View style={tw`bg-slate-100 px-3 py-1.5 rounded-full`}>
          <Text style={tw`text-[10px] font-black text-slate-900 uppercase tracking-widest`}>
            {item.type?.replace('_', ' ') || 'Full Time'}
          </Text>
        </View>
        <ChevronRight size={18} color="#94A3B8" />
      </View>
    </TouchableOpacity>
  );

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
            <Text style={[tw`text-xl font-black tracking-tight`, { color: '#0F172A' }]}>Saved Jobs</Text>
            <Text style={[tw`text-slate-400 text-xs font-bold uppercase tracking-widest mt-1`, { color: '#94A3B8' }]}>
              {jobs?.length || 0} total
            </Text>
          </View>
        </View>
        <Bookmark size={24} color="#014D9F" fill="#014D9F" />
      </View>

      {isLoading ? (
        <View style={tw`flex-1 justify-center items-center`}>
          <ActivityIndicator size="large" color="#014D9F" />
        </View>
      ) : !jobs || jobs.length === 0 ? (
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <View style={tw`bg-slate-100 p-4 rounded-full mb-4`}>
            <Bookmark size={40} color="#CBD5E1" />
          </View>
          <Text style={[tw`text-lg font-black mb-2`, { color: '#0F172A' }]}>No Saved Jobs Yet</Text>
          <Text style={[tw`text-center text-slate-500 text-sm`, { color: '#64748B' }]}>
            Bookmark jobs you're interested in to view them later
          </Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderJobCard(item)}
          contentContainerStyle={tw`px-6 pt-6 pb-40`}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
