import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Platform } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { Button } from '../../src/components/ui/Button';
import { 
  User as UserIcon, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  ChevronRight, 
  FileText, 
  MapPin, 
  Briefcase,
  Sparkles,
  Zap,
  LayoutDashboard,
  PlusCircle
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { profileService } from '../../src/services/api/profile';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { tw } from '../../src/lib/tailwind';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const { data: profileData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => profileService.getProfile(),
  });

  const profile = profileData?.data;
  const isAdmin = user?.role?.toUpperCase() === 'ADMIN';
  const isEmployer = user?.role?.toUpperCase() === 'EMPLOYER';

  const menuItems = [
    { icon: UserIcon, label: 'Personal Dossier', desc: 'Edit identity & credentials', action: () => router.push('/profile/personal' as any) },
    { icon: FileText, label: 'Resume & Documents', desc: 'Manage your curriculum vitae', action: () => router.push('/profile/documents' as any) },
    { icon: ShieldCheck, label: 'Compliance Status', desc: 'ID Verification & trust score', action: () => router.push('/profile/compliance' as any) },
    { icon: Settings, label: 'Preferences', desc: 'System & notification settings', action: () => router.push('/settings' as any) },
  ];

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-slate-50 justify-center items-center`}>
        <ActivityIndicator size="large" color="#014D9F" />
        <Text style={tw`mt-4 text-[10px] font-black uppercase text-slate-300 tracking-widest`}>Syncing Profile</Text>
      </View>
    );
  }

  return (
    <ScrollView 
        style={tw`flex-1 bg-slate-50`} 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
    >
      {/* Premium Header Background */}
      <View style={tw`bg-slate-900 pt-20 pb-12 px-6 rounded-b-[3rem] shadow-2xl relative overflow-hidden`}>
         <View style={[tw`absolute top--20 right--20 w-80 h-80 rounded-full bg-primary/20`, { filter: 'blur(80px)' } as any]} />
         
         <View style={tw`items-center`}>
            <View style={tw`relative mb-6`}>
              <View style={tw`w-32 h-32 bg-white rounded-[2.5rem] items-center justify-center border-4 border-slate-800 shadow-2xl overflow-hidden`}>
                {user?.avatarUrl ? (
                  <Image source={{ uri: user.avatarUrl }} style={tw`w-full h-full`} resizeMode="cover" />
                ) : (
                  <UserIcon size={56} color="#014D9F" />
                )}
              </View>
              <TouchableOpacity 
                style={tw`absolute bottom-1 right-1 bg-primary p-2.5 rounded-2xl shadow-lg border-2 border-slate-900`}
              >
                <Sparkles size={16} color="#FFF" />
              </TouchableOpacity>
            </View>

            <Text style={tw`text-3xl font-black text-white tracking-tighter mb-1`}>
                {user?.name || 'Full Name'}
            </Text>
            <View style={tw`flex-row items-center gap-2 mb-4`}>
                <View style={tw`bg-primary/20 px-3 py-1 rounded-full border border-primary/30`}>
                    <Text style={tw`text-primary text-[10px] font-black uppercase tracking-widest`}>
                        {user?.role || 'Member'}
                    </Text>
                </View>
                {profile?.verificationStatus === 'VERIFIED' && (
                    <View style={tw`bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30 flex-row items-center gap-1`}>
                        <ShieldCheck size={10} color="#10B981" />
                        <Text style={tw`text-green-400 text-[10px] font-black uppercase tracking-widest`}>Verified</Text>
                    </View>
                )}
            </View>
         </View>

         {/* Completeness Bar */}
         <View style={tw`bg-white/10 p-4 rounded-3xl mt-4 border border-white/5`}>
            <View style={tw`flex-row justify-between mb-2`}>
                <Text style={tw`text-slate-400 text-[10px] font-black uppercase tracking-widest`}>Profile Pulse</Text>
                <Text style={tw`text-white font-black text-[10px]`}>85%</Text>
            </View>
            <View style={tw`bg-white/10 h-2 rounded-full overflow-hidden`}>
                <View style={[tw`bg-primary h-full rounded-full shadow-lg shadow-primary/50`, { width: '85%' }]} />
            </View>
         </View>
      </View>

      <View style={tw`px-6 mt-6`}>
        {isAdmin && (
            <TouchableOpacity 
            onPress={() => router.push('/(admin)/dashboard' as any)}
            style={tw`bg-white rounded-[2rem] p-6 mb-8 flex-row items-center shadow-2xl shadow-slate-200/50 border border-slate-100`}
            >
            <View style={tw`bg-slate-900 p-3 rounded-2xl mr-4`}>
                <LayoutDashboard size={24} color="#FFF" />
            </View>
            <View style={tw`flex-1`}>
                <Text style={tw`text-slate-900 font-black text-lg tracking-tight`}>Admin Command Center</Text>
                <Text style={tw`text-slate-400 font-bold text-xs uppercase tracking-widest`}>System Management</Text>
            </View>
            <View style={tw`bg-slate-50 p-2 rounded-xl`}>
                <ChevronRight size={20} color="#CBD5E1" />
            </View>
            </TouchableOpacity>
        )}

        {isEmployer && (
            <TouchableOpacity 
            onPress={() => router.push('/post-job' as any)}
            style={tw`bg-white rounded-[2rem] p-6 mb-8 flex-row items-center shadow-2xl shadow-slate-200/50 border border-slate-100`}
            >
            <View style={tw`bg-primary p-3 rounded-2xl mr-4`}>
                <PlusCircle size={24} color="#FFF" />
            </View>
            <View style={tw`flex-1`}>
                <Text style={tw`text-slate-900 font-black text-lg tracking-tight`}>Employer Center</Text>
                <Text style={tw`text-slate-400 font-bold text-xs uppercase tracking-widest`}>Post a New Opportunity</Text>
            </View>
            <View style={tw`bg-slate-50 p-2 rounded-xl`}>
                <ChevronRight size={20} color="#CBD5E1" />
            </View>
            </TouchableOpacity>
        )}

        <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1`}>Account Control</Text>
        <View style={tw`bg-white rounded-[2.5rem] p-2 shadow-xl shadow-slate-200/50 border border-slate-50 mb-8`}>
            {menuItems.map((item, idx) => (
            <TouchableOpacity 
                key={idx}
                onPress={item.action}
                style={tw`flex-row items-center p-5 ${idx !== menuItems.length - 1 ? 'border-b border-slate-50' : ''}`}
            >
                <View style={[tw`p-3 rounded-2xl mr-4`, { backgroundColor: idx === 0 ? '#014D9F10' : '#F1F5F9' }]}>
                    <item.icon size={20} color={idx === 0 ? '#014D9F' : '#64748B'} />
                </View>
                <View style={tw`flex-1`}>
                    <Text style={tw`text-slate-900 font-black text-base tracking-tight`}>{item.label}</Text>
                    <Text style={tw`text-slate-400 font-medium text-[10px] mt-0.5`}>{item.desc}</Text>
                </View>
                <ChevronRight size={18} color="#CBD5E1" />
            </TouchableOpacity>
            ))}
        </View>

        <Button
            title="Log Out"
            onPress={signOut}
            variant="ghost"
            icon={<LogOut size={20} color="#EF4444" />}
            style={tw`h-16 rounded-[2rem] border-2 border-red-50 mb-10`}
            textStyle={tw`text-red-600 font-black tracking-tight`}
        />

        <View style={tw`items-center pb-10`}>
            <View style={tw`flex-row items-center gap-2 mb-2`}>
                <Zap size={14} color="#94A3B8" />
                <Text style={tw`text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]`}>RightJobs v1.2</Text>
            </View>
            <Text style={tw`text-slate-400 text-[8px] font-bold`}>Authenticated Secure Connection Established</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
