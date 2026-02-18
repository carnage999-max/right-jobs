import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ShieldCheck, ShieldAlert, CheckCircle2 } from 'lucide-react-native';
import { tw } from '../../src/lib/tailwind';
import { useAuth } from '../../src/context/AuthContext';
import { Button } from '../../src/components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { profileService } from '../../src/services/api/profile';
import { QUERY_KEYS } from '../../src/constants/queryKeys';

export default function ComplianceStatusScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Fetch profile data
  const { data: profileData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => profileService.getProfile(),
  });

  const profile = profileData?.data;

  // Calculate trust/visibility score based on actual profile completion
  // This matches the website's trust score calculation exactly
  const visibilityScore = useMemo(() => {
    if (!profile) return 10;

    let score = 10; // Base score
    if (profile.user?.name) score += 20; // Name filled
    if (profile.bio) score += 20; // Bio filled
    if (profile.location) score += 10; // Location filled
    if (profile.skills?.length > 0) score += 10; // Skills added
    if (profile.resumeUrl) score += 10; // Resume uploaded
    if (profile.verificationStatus === 'VERIFIED') score += 20; // ID verified

    return Math.min(score, 100);
  }, [profile]);

  const isVerified = profile?.verificationStatus === 'VERIFIED';
  const isPending = profile?.verificationStatus === 'PENDING';

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
      <View style={tw`bg-white pt-12 pb-4 px-6 border-b border-slate-100 flex-row items-center`}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={tw`p-2 -ml-2 mr-4 rounded-full`}
        >
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-black text-slate-900 tracking-tight`}>Compliance & Trust</Text>
      </View>

      <ScrollView style={tw`flex-1 p-6`} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Status Banner */}
        {isVerified ? (
          <View style={tw`bg-green-50 p-6 rounded-[2rem] border border-green-100 mb-6 items-center`}>
            <ShieldCheck size={48} color="#10B981" style={tw`mb-4`} />
            <Text style={tw`text-green-900 font-black text-2xl mb-2 text-center`}>Identity Verified</Text>
            <Text style={tw`text-green-700/80 font-medium text-sm leading-relaxed text-center px-4 mb-6`}>
              Your account has passed all security checks. You have full access to premium features.
            </Text>
            <View style={tw`bg-white p-4 rounded-xl shadow-sm w-full flex-row items-center justify-between`}>
              <Text style={tw`text-xs font-bold text-slate-500 uppercase tracking-widest`}>Visibility Score</Text>
              <Text style={tw`font-black text-green-600 text-lg`}>{visibilityScore}%</Text>
            </View>
          </View>
        ) : isPending ? (
          <View style={tw`bg-amber-50 p-6 rounded-[2rem] border border-amber-100 mb-6 items-center`}>
            <ShieldCheck size={48} color="#F59E0B" style={tw`mb-4`} />
            <Text style={tw`text-amber-900 font-black text-2xl mb-2 text-center`}>Verification Pending</Text>
            <Text style={tw`text-amber-700/80 font-medium text-sm leading-relaxed text-center px-4 mb-6`}>
              Our team is reviewing your documents. This usually takes 24-48 hours.
            </Text>
            <Button 
              title="Check Status" 
              variant="outline"
              style={tw`w-full bg-white border-amber-200 h-12 rounded-xl`}
              textStyle={tw`text-amber-700 font-bold`}
              onPress={() => {}}
              disabled
            />
          </View>
        ) : (
          <View style={tw`bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-900/20 mb-8 overflow-hidden relative`}>
            <View style={[tw`absolute top-0 right-0 w-60 h-60 rounded-full bg-primary/10`, { transform: [{ translateY: -30 }, { translateX: 30 }] } as any]} />
            
            <ShieldAlert size={48} color="#FFF" style={tw`mb-6 relative z-10`} />
            <Text style={tw`text-white font-black text-3xl mb-2 tracking-tighter relative z-10`}>Verify Your Identity</Text>
            <Text style={tw`text-slate-400 font-medium text-sm leading-relaxed mb-8 relative z-10`}>
              Secure your account and unlock exclusive job opportunities by completing our ID check.
            </Text>
            
            <Button 
              title="Start Verification"
              style={tw`w-full bg-primary rounded-2xl h-14 shadow-lg shadow-primary/30 relative z-10`}
              textStyle={tw`font-black text-white`}
              icon={<CheckCircle2 size={20} color="#FFF" style={tw`mr-2`} />}
              onPress={() => router.push('/verify-id' as any)}
            />
          </View>
        )}

        {/* Profile Strength Card */}
        <View style={tw`bg-slate-900 text-white p-6 rounded-[2rem] border border-slate-800 mb-6`}>
          <Text style={tw`text-xs font-black uppercase tracking-widest text-slate-400 mb-4`}>Visibility Score</Text>
          <View style={tw`flex-row items-end gap-2 mb-6`}>
            <Text style={tw`text-5xl font-black tracking-tighter text-white`}>{visibilityScore}</Text>
            <Text style={tw`text-xs font-bold text-slate-500 uppercase mb-2`}>%</Text>
          </View>
          
          {/* Progress Bar */}
          <View style={tw`h-3 w-full rounded-full bg-slate-800 overflow-hidden mb-4`}>
            <View 
              style={[
                tw`h-full ${visibilityScore > 70 ? 'bg-primary' : 'bg-amber-500'}`,
                { width: `${visibilityScore}%` }
              ]}
            />
          </View>
          
          <Text style={tw`text-sm text-slate-400 leading-relaxed`}>
            {visibilityScore >= 90 
              ? "You are appearing in the top segment of candidate searches."
              : visibilityScore >= 70
              ? "Complete your profile to increase your visibility to employers."
              : "Complete all profile sections and verify your ID to reach 100% visibility."}
          </Text>
        </View>

        {/* Breakdown of Score */}
        <View style={tw`bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-6`}>
          <Text style={tw`text-lg font-black text-slate-900 mb-4`}>Completion Progress</Text>
          
          <View style={tw`space-y-3`}>
            {/* Name */}
            <View style={tw`flex-row items-center justify-between p-3 bg-slate-50 rounded-xl`}>
              <View style={tw`flex-row items-center flex-1`}>
                <View style={tw`h-5 w-5 rounded-full ${profile?.user?.name ? 'bg-green-100' : 'bg-slate-200'} items-center justify-center mr-3 shrink-0`}>
                  {profile?.user?.name && <CheckCircle2 size={12} color="#10B981" />}
                </View>
                <Text style={tw`font-bold text-slate-900 text-sm`}>Full Name</Text>
              </View>
              <Text style={tw`text-xs font-bold ${profile?.user?.name ? 'text-green-600' : 'text-slate-400'} uppercase tracking-wide`}>
                {profile?.user?.name ? '+20 pts' : 'Pending'}
              </Text>
            </View>

            {/* Bio */}
            <View style={tw`flex-row items-center justify-between p-3 bg-slate-50 rounded-xl`}>
              <View style={tw`flex-row items-center flex-1`}>
                <View style={tw`h-5 w-5 rounded-full ${profile?.bio ? 'bg-green-100' : 'bg-slate-200'} items-center justify-center mr-3 shrink-0`}>
                  {profile?.bio && <CheckCircle2 size={12} color="#10B981" />}
                </View>
                <Text style={tw`font-bold text-slate-900 text-sm`}>Professional Bio</Text>
              </View>
              <Text style={tw`text-xs font-bold ${profile?.bio ? 'text-green-600' : 'text-slate-400'} uppercase tracking-wide`}>
                {profile?.bio ? '+20 pts' : 'Pending'}
              </Text>
            </View>

            {/* Location */}
            <View style={tw`flex-row items-center justify-between p-3 bg-slate-50 rounded-xl`}>
              <View style={tw`flex-row items-center flex-1`}>
                <View style={tw`h-5 w-5 rounded-full ${profile?.location ? 'bg-green-100' : 'bg-slate-200'} items-center justify-center mr-3 shrink-0`}>
                  {profile?.location && <CheckCircle2 size={12} color="#10B981" />}
                </View>
                <Text style={tw`font-bold text-slate-900 text-sm`}>Location</Text>
              </View>
              <Text style={tw`text-xs font-bold ${profile?.location ? 'text-green-600' : 'text-slate-400'} uppercase tracking-wide`}>
                {profile?.location ? '+10 pts' : 'Pending'}
              </Text>
            </View>

            {/* Skills */}
            <View style={tw`flex-row items-center justify-between p-3 bg-slate-50 rounded-xl`}>
              <View style={tw`flex-row items-center flex-1`}>
                <View style={tw`h-5 w-5 rounded-full ${(profile?.skills?.length || 0) > 0 ? 'bg-green-100' : 'bg-slate-200'} items-center justify-center mr-3 shrink-0`}>
                  {(profile?.skills?.length || 0) > 0 && <CheckCircle2 size={12} color="#10B981" />}
                </View>
                <Text style={tw`font-bold text-slate-900 text-sm`}>Skills ({profile?.skills?.length || 0})</Text>
              </View>
              <Text style={tw`text-xs font-bold ${(profile?.skills?.length || 0) > 0 ? 'text-green-600' : 'text-slate-400'} uppercase tracking-wide`}>
                {(profile?.skills?.length || 0) > 0 ? '+10 pts' : 'Pending'}
              </Text>
            </View>

            {/* Resume */}
            <View style={tw`flex-row items-center justify-between p-3 bg-slate-50 rounded-xl`}>
              <View style={tw`flex-row items-center flex-1`}>
                <View style={tw`h-5 w-5 rounded-full ${profile?.resumeUrl ? 'bg-green-100' : 'bg-slate-200'} items-center justify-center mr-3 shrink-0`}>
                  {profile?.resumeUrl && <CheckCircle2 size={12} color="#10B981" />}
                </View>
                <Text style={tw`font-bold text-slate-900 text-sm`}>Resume</Text>
              </View>
              <Text style={tw`text-xs font-bold ${profile?.resumeUrl ? 'text-green-600' : 'text-slate-400'} uppercase tracking-wide`}>
                {profile?.resumeUrl ? '+10 pts' : 'Pending'}
              </Text>
            </View>

            {/* ID Verification */}
            <View style={tw`flex-row items-center justify-between p-3 bg-slate-50 rounded-xl`}>
              <View style={tw`flex-row items-center flex-1`}>
                <View style={tw`h-5 w-5 rounded-full ${isVerified ? 'bg-green-100' : 'bg-slate-200'} items-center justify-center mr-3 shrink-0`}>
                  {isVerified && <CheckCircle2 size={12} color="#10B981" />}
                </View>
                <Text style={tw`font-bold text-slate-900 text-sm`}>ID Verification</Text>
              </View>
              <Text style={tw`text-xs font-bold ${isVerified ? 'text-green-600' : 'text-slate-400'} uppercase tracking-wide`}>
                {isVerified ? '+20 pts' : 'Pending'}
              </Text>
            </View>
          </View>
        </View>

        {/* Why It Matters Card */}
        <View style={tw`bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-6`}>
          <Text style={tw`text-lg font-black text-slate-900 mb-4`}>Why Visibility Matters</Text>
          
          <View style={tw`flex-row gap-3 mb-4`}>
            <View style={tw`h-8 w-8 rounded-full bg-green-100 items-center justify-center shrink-0`}>
              <CheckCircle2 size={16} color="#10B981" />
            </View>
            <Text style={tw`text-sm text-slate-600 flex-1`}>Higher scores rank you higher in recruiter searches.</Text>
          </View>
          
          <View style={tw`flex-row gap-3`}>
            <View style={tw`h-8 w-8 rounded-full bg-blue-100 items-center justify-center shrink-0`}>
              <ShieldCheck size={16} color="#3B82F6" />
            </View>
            <Text style={tw`text-sm text-slate-600 flex-1`}>Verified profiles get 2x more interview requests.</Text>
          </View>
        </View>

        {/* Go to Profile Button */}
        <Button
          title="Complete Your Profile"
          style={tw`w-full bg-primary rounded-2xl h-14 shadow-lg shadow-primary/30`}
          textStyle={tw`font-black text-white`}
          onPress={() => router.push('/profile/personal' as any)}
        />
      </ScrollView>
    </View>
  );
}
