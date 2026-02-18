import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { Button } from '../../src/components/ui/Button';
import { Briefcase, Bell, ShieldCheck, Zap, ArrowRight, User as UserIcon } from 'lucide-react-native';
import { tw } from '../../src/lib/tailwind';
import { useQuery } from '@tanstack/react-query';
import { profileService } from '../../src/services/api/profile';
import { QUERY_KEYS } from '../../src/constants/queryKeys';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  // Fetch profile to calculate real visibility score
  const { data: profileData } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => profileService.getProfile(),
  });

  const profile = profileData?.data;

  // Calculate visibility score from actual profile data
  const visibilityScore = useMemo(() => {
    if (!profile) return 10;

    let score = 10; // Base score
    if (profile.user?.name) score += 20;
    if (profile.bio) score += 20;
    if (profile.location) score += 10;
    if (profile.skills?.length > 0) score += 10;
    if (profile.resumeUrl) score += 10;
    if (profile.verificationStatus === 'VERIFIED') score += 20;

    return Math.min(score, 100);
  }, [profile]);

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      {/* Decorative Blurs */}
      <View style={[tw`absolute top-20 right--20 w-80 h-80 rounded-full bg-primary`, { opacity: 0.05, filter: 'blur(100px)' } as any]} />
      <View style={[tw`absolute bottom-40 left--20 w-80 h-80 rounded-full bg-blue-100`, { opacity: 0.05, filter: 'blur(100px)' } as any]} />

      <ScrollView style={tw`flex-1 px-6 pt-16`} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header Section */}
        <View style={tw`flex-row justify-between items-center mb-10`}>
          <View>
            <View style={tw`flex-row items-center gap-1 mb-1`}>
               <Zap size={10} color="#014D9F" fill="#014D9F" />
               <Text style={tw`text-primary font-black text-[10px] uppercase tracking-[0.2em]`}>Live Status</Text>
            </View>
            <Text style={tw`text-3xl font-black text-slate-900 tracking-tighter`}>
               Hello, <Text style={tw`text-primary italic`}>{user?.name?.split(' ')[0] || 'Member'}</Text>
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/notifications')}
            style={tw`bg-white h-12 w-12 rounded-2xl items-center justify-center shadow-lg shadow-slate-200/50 border border-slate-100`}
          >
            <Bell size={22} color="#94A3B8" />
            <View style={tw`absolute top-3 right-3 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white`} />
          </TouchableOpacity>
        </View>

        {/* Profile Stats Card - Premium Style */}
        <View style={tw`bg-slate-900 rounded-[2.5rem] p-8 mb-10 shadow-2xl shadow-slate-900/40 relative overflow-hidden`}>
           <View style={[tw`absolute top--20 right--20 w-48 h-48 rounded-full bg-primary/20`, { filter: 'blur(40px)' } as any]} />
           
           <View style={tw`flex-row items-center justify-between mb-8`}>
              <View>
                 <Text style={tw`text-white text-xl font-black tracking-tight mb-1`}>Visibility Score</Text>
                 <Text style={tw`text-slate-400 font-bold text-xs uppercase tracking-widest`}>
                   {profile?.verificationStatus === 'VERIFIED' 
                     ? 'Identity Verified' 
                     : 'Complete your profile'}
                 </Text>
              </View>
              <View style={tw`h-12 w-12 rounded-2xl bg-white/10 items-center justify-center`}>
                 <ShieldCheck size={24} color="#FFF" />
              </View>
           </View>

           <View style={tw`mb-8`}>
              <View style={tw`flex-row justify-between mb-2`}>
                 <Text style={tw`text-slate-400 text-[10px] font-black uppercase tracking-widest`}>Completeness</Text>
                 <Text style={tw`text-white font-black text-xs`}>{visibilityScore}%</Text>
              </View>
              <View style={tw`bg-white/10 h-2.5 rounded-full overflow-hidden`}>
                 <View 
                   style={[
                     tw`h-full rounded-full shadow-lg shadow-primary/50`,
                     { 
                       backgroundColor: visibilityScore > 70 ? '#014D9F' : '#F59E0B',
                       width: `${visibilityScore}%` 
                     }
                   ]} 
                 />
              </View>
           </View>

           <Button 
             title={visibilityScore === 100 ? "Profile Complete" : "Boost Visibility"} 
             onPress={() => router.push('/(tabs)/profile')} 
             style={tw`bg-white h-14 rounded-2xl`} 
             textStyle={tw`text-slate-900 font-black`}
             icon={<ArrowRight size={18} color="#0F172A" />}
           />
        </View>

        {/* Action Grid */}
        <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6`}>Essential Tools</Text>
        <View style={tw`flex-row flex-wrap justify-between gap-y-4 mb-10`}>
          {[
            { icon: Briefcase, label: 'Discover Jobs', color: '#014D9F', route: '/(tabs)/jobs', desc: 'Curated roles' },
            { icon: ShieldCheck, label: 'Identity Vault', color: '#10B981', route: '/(tabs)/profile', desc: 'Secure data' },
          ].map((action, idx) => (
            <TouchableOpacity 
              key={idx}
              onPress={() => router.push(action.route as any)}
              style={tw`bg-white w-[48%] p-5 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50`}
            >
              <View style={[tw`w-12 h-12 rounded-2xl items-center justify-center mb-4`, { backgroundColor: action.color + '15' }]}>
                <action.icon size={22} color={action.color} />
              </View>
              <Text style={tw`font-black text-slate-900 text-sm tracking-tight`}>{action.label}</Text>
              <Text style={tw`text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1`}>{action.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured Section Preview */}
        <View style={tw`flex-row justify-between items-center mb-6`}>
           <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-[0.2em]`}>Recommended For You</Text>
           <TouchableOpacity onPress={() => router.push('/(tabs)/jobs')}>
              <Text style={tw`text-primary font-black text-[10px] uppercase tracking-widest`}>See All</Text>
           </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={() => router.push('/(tabs)/jobs')}
          style={tw`bg-white p-6 rounded-[2.5rem] border border-dashed border-slate-200 items-center py-10`}
        >
          <View style={tw`h-16 w-16 bg-slate-50 rounded-3xl items-center justify-center mb-4`}>
             <Briefcase size={32} color="#CBD5E1" />
          </View>
          <Text style={tw`text-slate-400 text-sm font-bold text-center`}>No recommended jobs yet.{'\n'}Start searching to see elite matches.</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
