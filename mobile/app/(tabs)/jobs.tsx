import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, MapPin, Briefcase, Sparkles, Clock, DollarSign, ChevronRight } from 'lucide-react-native';
import { jobsService } from '../../src/services/api/jobs';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { tw } from '../../src/lib/tailwind';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { label: 'All Roles', value: 'all' },
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Design', value: 'Design' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Management', value: 'Management' }
];

export default function JobsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const { data: jobs, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.JOBS, search, selectedCategory],
    queryFn: () => jobsService.getJobs({ search, category: selectedCategory === 'all' ? undefined : selectedCategory }),
  });

  const renderJobItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      onPress={() => router.push({ pathname: '/(tabs)/jobs', params: { id: item.id } } as any)}
      style={tw`bg-white p-6 rounded-[2.5rem] mb-6 shadow-xl shadow-slate-200/50 border border-slate-50`}
    >
      <View style={tw`flex-row gap-4`}>
        <View style={tw`h-16 w-16 rounded-2xl bg-white border border-slate-100 items-center justify-center shadow-lg shadow-slate-200/50 overflow-hidden shrink-0`}>
          {item.companyLogoUrl ? (
            <Image source={{ uri: item.companyLogoUrl }} style={tw`h-full w-full`} resizeMode="cover" />
          ) : (
            <View style={tw`h-full w-full bg-primary/5 flex items-center justify-center`}>
              <Text style={tw`text-primary font-black text-2xl`}>{item.companyName?.[0] || 'J'}</Text>
            </View>
          )}
        </View>
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
            <View style={tw`flex-row items-center bg-green-50 px-3 py-1.5 rounded-xl`}>
              <DollarSign size={12} color="#10B981" />
              <Text style={tw`text-[10px] font-bold text-green-700 ml-1`}>{item.salaryRange || 'Competitive'}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={tw`flex-row justify-between items-center mt-6 pt-6 border-t border-slate-50`}>
        <View style={tw`bg-slate-100 px-3 py-1.5 rounded-full`}>
          <Text style={tw`text-[10px] font-black text-slate-900 uppercase tracking-widest`}>
            {item.type?.replace('_', ' ') || 'Full Time'}
          </Text>
        </View>
        <TouchableOpacity style={tw`bg-primary px-6 py-2.5 rounded-xl flex-row items-center`}>
          <Text style={tw`text-white font-black text-xs mr-2`}>Apply Now</Text>
          <Sparkles size={12} color="#FFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      {/* Decorative Blurs */}
      <View style={[tw`absolute top-20 right--20 w-80 h-80 rounded-full bg-primary`, { opacity: 0.05, filter: 'blur(100px)' } as any]} />
      <View style={[tw`absolute bottom-40 left--20 w-80 h-80 rounded-full bg-indigo-100`, { opacity: 0.05, filter: 'blur(100px)' } as any]} />

      <View style={tw`flex-1 px-6 pt-16`}>
        {/* Header Heading */}
        <View style={tw`mb-8`}>
          <View style={tw`flex-row items-center gap-2 mb-3 px-3 py-1 bg-primary/10 rounded-full w-44`}>
            <Sparkles size={12} color="#014D9F" />
            <Text style={tw`text-[10px] font-black uppercase text-primary tracking-widest`}>Live Opportunities</Text>
          </View>
          <Text style={tw`text-4xl font-black text-slate-900 tracking-tighter leading-tight`}>
            Find Your Next {'\n'}
            <Text style={tw`text-primary italic`}>Adventure</Text>
          </Text>
        </View>
        
        {/* Search Bar */}
        <View style={tw`flex-row mb-8 p-1.5 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-50 items-center`}>
          <View style={tw`flex-1 flex-row items-center pl-4`}>
            <Search size={22} color="#94A3B8" />
            <TextInput
              style={tw`flex-1 ml-3 text-base text-slate-900 font-medium h-12`}
              placeholder="Roles, companies, or keywords..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity style={tw`bg-primary h-12 w-12 rounded-full items-center justify-center shadow-lg shadow-primary/30 mr-0.5`}>
            <Filter size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Category Pills */}
        <View style={tw`mb-8`}>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`gap-x-3`}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity 
                   key={cat.value}
                   onPress={() => setSelectedCategory(cat.value)}
                   style={tw`px-6 py-3 rounded-2xl border ${selectedCategory === cat.value ? 'bg-slate-900 border-slate-900 shadow-lg' : 'bg-white border-slate-100 shadow-sm'}`}
                >
                   <Text style={tw`font-black text-xs uppercase tracking-widest ${selectedCategory === cat.value ? 'text-white' : 'text-slate-400'}`}>
                      {cat.label}
                   </Text>
                </TouchableOpacity>
              ))}
           </ScrollView>
        </View>

        <View style={tw`flex-row justify-between items-center mb-6 px-1`}>
           <Text style={tw`text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]`}>
              {isLoading ? 'Fetching records...' : `${jobs?.length || 0} Positions Available`}
           </Text>
        </View>

        {isLoading ? (
          <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" color="#014D9F" />
            <Text style={tw`mt-4 text-[10px] font-black uppercase text-slate-300 tracking-widest`}>Initializing Stream</Text>
          </View>
        ) : (
          <FlatList
            data={jobs}
            renderItem={renderJobItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={tw`items-center py-20 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 p-8`}>
                <View style={tw`h-20 w-20 bg-slate-100 rounded-[2rem] items-center justify-center mb-6`}>
                   <Briefcase size={32} color="#CBD5E1" />
                </View>
                <Text style={tw`text-xl font-black text-slate-900 tracking-tight text-center`}>No open roles found</Text>
                <Text style={tw`text-slate-400 font-medium text-center mt-2`}>Try adjusting your filters or search keywords.</Text>
              </View>
            }
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        )}
      </View>
    </View>
  );
}
