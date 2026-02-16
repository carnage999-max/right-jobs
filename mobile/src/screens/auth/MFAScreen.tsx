import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { apiClient } from '../../services/api/client';
import { Lock, Send, ShieldCheck, Loader2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { tw } from '../../lib/tailwind';

export const MFAScreen = () => {
  const { showSuccess, showError } = useToast();
  const { updateUserData, user, signIn } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();
  
  // No longer sending on mount here since mobile-login already sends it proactively.
  // This avoids redundant emails and potential rate limit issues.
  useEffect(() => {
    console.log('[MFA] Security screen initialized');
  }, []);

  const onVerify = async () => {
    if (otp.length !== 6) return showError('Error', 'Please enter the 6-digit signature.');
    setLoading(true);
    try {
      const response = await apiClient.post('/auth/mfa/verify', { otp });
      const { token } = response.data;
      
      // If server provided a refreshed token, use it
      if (token) {
        await signIn(token, { ...user!, mfaComplete: true } as any);
      } else {
        await updateUserData({ mfaComplete: true });
      }

      showSuccess('Identity Confirmed', 'Administrative session authorized.');
      router.replace('/(admin)/dashboard');
    } catch (error: any) {
      showError('Verification Failed', error.response?.data?.message || 'Invalid signature signature.');
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setResending(true);
    try {
      await apiClient.post('/auth/mfa/resend');
      showSuccess('Success', 'A new signature has been sent to your administrative email.');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to resend signature. Please try again.';
      showError('Error', message);
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-[#020617]`} // slate-950
    >
      <ScrollView 
        contentContainerStyle={tw`flex-grow justify-center px-6`}
      >
        {/* Visual Flair Backgrounds */}
        <View 
          style={[tw`absolute top-10 left--10 w-64 h-64 rounded-full bg-[#014D9F]`, { opacity: 0.15, filter: 'blur(60px)' } as any]} 
        />
        <View 
          style={[tw`absolute bottom-20 right--10 w-64 h-64 rounded-full bg-blue-600`, { opacity: 0.1, filter: 'blur(60px)' } as any]} 
        />

        <View style={tw`bg-[#0f172a] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl`}>
          <View style={tw`items-center mb-10`}>
            <View style={tw`w-20 h-20 rounded-3xl bg-[#014D9F20] items-center justify-center mb-6 border border-[#014D9F30]`}>
              <Lock size={32} color="#014D9F" />
            </View>
            <Text style={tw`text-3xl font-black text-white tracking-tight text-center`}>Security Protocol</Text>
            <Text style={tw`text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 text-center`}>
              Administrative Multi-Factor
            </Text>
          </View>

          <Text style={tw`text-center text-slate-300 font-medium text-base mb-8 px-2`}>
            A 6-digit signature has been sent to your administrative email. Please enter it below to authorize this session.
          </Text>

          <Input
            placeholder="000000"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
            inputStyle={tw`h-20 text-center text-3xl font-black tracking-[0.3em] bg-[#1e293b] border-slate-700 text-white rounded-2xl`}
            containerStyle={tw`mb-8`}
          />

          <Button
            title="Authorize Session"
            onPress={onVerify}
            loading={loading}
            style={tw`h-16 rounded-2xl bg-[#014D9F] shadow-xl shadow-[#014D9F40]`}
            textStyle={tw`text-lg font-black text-white`}
          />

          <View style={tw`mt-8 items-center`}>
            <TouchableOpacity 
              onPress={onResend} 
              disabled={resending}
              style={tw`flex-row items-center gap-2`}
            >
              {resending ? (
                <ActivityIndicator size="small" color="#94A3B8" />
              ) : (
                <Send size={16} color="#94A3B8" />
              )}
              <Text style={tw`text-slate-400 font-bold text-sm ml-2`}>
                Resend verification code
              </Text>
            </TouchableOpacity>

            <Text style={tw`text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center mt-8`}>
              Authorized access only. All actions are logged under the platform audit protocol.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
