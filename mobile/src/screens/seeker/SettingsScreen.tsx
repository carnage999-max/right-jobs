import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Lock, Key, HelpCircle, Loader2, ChevronLeft, ShieldCheck, LogOut, Trash2, Download, Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { tw } from '../../lib/tailwind';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { profileService } from '../../services/api/profile';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../constants/queryKeys';
import { Button } from '../../components/ui/Button';

export const SettingsScreen = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Fetch profile data to get verification status
  const { data: profileData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => profileService.getProfile(),
  });

  const profile = profileData?.data;
  const isVerified = profile?.verificationStatus === 'VERIFIED';

  const requestPasswordReset = async () => {
    setIsChangingPassword(true);
    try {
      if (!user?.email) {
        showError('Error', 'Email not found');
        return;
      }
      
      await profileService.requestPasswordReset();
      showSuccess('Success', 'Check your email for password reset instructions.');
    } catch (error) {
      showError('Error', 'Failed to request password reset');
    } finally {
      setIsChangingPassword(false);
    }
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
            <Text style={tw`text-xl font-black text-slate-900 tracking-tight`}>Settings</Text>
            <Text style={tw`text-slate-400 text-xs font-bold uppercase tracking-widest mt-1`}>Security & Account</Text>
          </View>
        </View>
        <Lock size={24} color="#014D9F" />
      </View>

      <ScrollView style={tw`flex-1`} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Login & Authentication Section */}
        <View style={tw`px-6 pt-8 pb-6`}>
          <View style={tw`flex-row items-center gap-2 mb-4`}>
            <Lock size={20} color="#014D9F" />
            <Text style={tw`text-lg font-black text-slate-900`}>Login & Authentication</Text>
          </View>
          
          <View style={tw`bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden`}>
            <View style={tw`p-6 border-b border-slate-100 flex-row items-start justify-between`}>
              <View style={tw`flex-1 pr-4`}>
                <Text style={tw`font-bold text-slate-900 text-base mb-1`}>Change Password</Text>
                <Text style={tw`text-slate-500 text-sm leading-relaxed`}>
                  For security, we'll send a confirmation link to your email {user?.email}
                </Text>
              </View>
            </View>
            
            <View style={tw`p-6`}>
              <Button
                title={isChangingPassword ? "Sending..." : "Request Link"}
                icon={isChangingPassword && <Loader2 size={18} color="#FFF" style={tw`mr-2`} />}
                onPress={requestPasswordReset}
                disabled={isChangingPassword}
                style={tw`w-full bg-primary rounded-xl h-12`}
                textStyle={tw`font-bold text-white`}
              />
            </View>
          </View>
        </View>

        {/* Account Verification Section */}
        <View style={tw`px-6 pb-6`}>
          <View style={tw`flex-row items-center gap-2 mb-4`}>
            <ShieldCheck size={20} color={isVerified ? "#10B981" : "#64748B"} />
            <Text style={tw`text-lg font-black ${isVerified ? 'text-green-600' : 'text-slate-900'}`}>
              Account Verification
            </Text>
          </View>

          {isVerified ? (
            <View style={tw`bg-green-50 rounded-[2rem] border border-green-100 overflow-hidden shadow-sm`}>
              <View style={tw`p-6 flex-row items-center gap-4 border-b border-green-100`}>
                <View style={tw`h-12 w-12 rounded-xl bg-white flex items-center justify-center shadow-sm border border-green-100`}>
                  <ShieldCheck size={24} color="#10B981" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-bold text-green-800 text-base`}>Identity Verified</Text>
                  <Text style={tw`text-green-600 text-xs font-bold uppercase tracking-wide`}>Your account is fully verified</Text>
                </View>
              </View>

              <View style={tw`p-6 bg-white`}>
                <Text style={tw`text-sm text-slate-600 font-medium mb-4 leading-relaxed`}>
                  Your verified account has access to premium features including:
                </Text>
                
                <View style={tw`space-y-3`}>
                  {[
                    "Trust Badge on Profile",
                    "Priority Application Sorting",
                    "Unlimited Skills Listing",
                    "Direct Messages to HR"
                  ].map((feature, idx) => (
                    <View key={idx} style={tw`flex-row items-center gap-3`}>
                      <View style={tw`h-1.5 w-1.5 rounded-full bg-green-500`} />
                      <Text style={tw`text-sm text-slate-700 font-medium flex-1`}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={tw`bg-slate-100 rounded-[2rem] border border-slate-200 p-6 items-center shadow-sm`}>
              <ShieldCheck size={40} color="#94A3B8" style={tw`mb-4`} />
              <Text style={tw`font-bold text-slate-900 text-lg mb-2 text-center`}>Verification Not Required</Text>
              <Text style={tw`text-slate-600 text-sm text-center leading-relaxed`}>
                Identity verification helps you get verified badge and unlock premium features.
              </Text>
              <Button
                title="Learn More"
                variant="outline"
                onPress={() => router.push('/profile/compliance' as any)}
                style={tw`w-full mt-6 bg-white border border-slate-300 rounded-xl h-11`}
                textStyle={tw`font-bold text-slate-900`}
              />
            </View>
          )}
        </View>

        {/* Help Section */}
        <View style={tw`px-6 pb-6`}>
          <View style={tw`bg-slate-100 rounded-[2rem] border border-slate-200 p-6 flex-row items-center gap-4 shadow-sm`}>
            <HelpCircle size={32} color="#94A3B8" />
            <View style={tw`flex-1`}>
              <Text style={tw`font-bold text-slate-900 mb-1`}>Need help with security?</Text>
              <Text style={tw`text-xs text-slate-600 font-medium`}>Our security team is here 24/7</Text>
            </View>
          </View>
        </View>

        {/* More Actions Section */}
        <View style={tw`px-6 pb-6`}>
          <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-1`}>More Actions</Text>
          
          <View style={tw`bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden`}>
            {/* Download Data */}
            <TouchableOpacity style={tw`p-4 border-b border-slate-100 flex-row items-center justify-between`}>
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`h-10 w-10 rounded-xl bg-blue-100 items-center justify-center`}>
                  <Download size={20} color="#3B82F6" />
                </View>
                <View>
                  <Text style={tw`font-bold text-slate-900`}>Download My Data</Text>
                  <Text style={tw`text-xs text-slate-500 font-medium`}>Get a copy of your information</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Referral Program */}
            <TouchableOpacity style={tw`p-4 border-b border-slate-100 flex-row items-center justify-between`}>
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`h-10 w-10 rounded-xl bg-purple-100 items-center justify-center`}>
                  <Share2 size={20} color="#A855F7" />
                </View>
                <View>
                  <Text style={tw`font-bold text-slate-900`}>Referral Program</Text>
                  <Text style={tw`text-xs text-slate-500 font-medium`}>Invite friends & earn rewards</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity 
              onPress={() => {
                Alert.alert(
                  'Sign Out',
                  'Are you sure you want to sign out?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Sign Out',
                      style: 'destructive',
                      onPress: async () => {
                        await logout();
                        router.push('/auth/login' as any);
                      }
                    }
                  ]
                );
              }}
              style={tw`p-4 border-b border-slate-100 flex-row items-center justify-between`}
            >
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`h-10 w-10 rounded-xl bg-orange-100 items-center justify-center`}>
                  <LogOut size={20} color="#F97316" />
                </View>
                <View>
                  <Text style={tw`font-bold text-slate-900`}>Sign Out</Text>
                  <Text style={tw`text-xs text-slate-500 font-medium`}>Sign out from this device</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Delete Account */}
            <TouchableOpacity 
              onPress={() => {
                Alert.alert(
                  'Delete Account',
                  'This action cannot be undone. All your data will be permanently deleted.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => {
                        showError('Error', 'Account deletion is not available in mobile yet. Contact support.');
                      }
                    }
                  ]
                );
              }}
              style={tw`p-4 flex-row items-center justify-between`}
            >
              <View style={tw`flex-row items-center gap-3`}>
                <View style={tw`h-10 w-10 rounded-xl bg-red-100 items-center justify-center`}>
                  <Trash2 size={20} color="#EF4444" />
                </View>
                <View>
                  <Text style={tw`font-bold text-red-600`}>Delete Account</Text>
                  <Text style={tw`text-xs text-slate-500 font-medium`}>Permanently delete your account</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
