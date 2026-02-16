import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { apiClient } from '../../services/api/client';
import { KeyRound, Mail, ArrowLeft, Send } from 'lucide-react-native';
import { tw } from '../../lib/tailwind';
import { useRouter } from 'expo-router';

export const ForgotPasswordScreen = () => {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email) return showError('Error', 'Please enter your email signature.');
    setLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email });
      showSuccess('Security Link Sent', 'If an authorized account exists, instructions will arrive shortly.');
      router.push('/(auth)/login');
    } catch (error: any) {
      // Security best practice: always show success even if user not found
      showSuccess('Success', 'Check your inbox for security recovery instructions.');
      router.push('/(auth)/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-slate-50`}
    >
      <ScrollView contentContainerStyle={tw`flex-grow justify-center px-4 py-10`}>
        {/* Decorative Blurs */}
        <View style={[tw`absolute top-20 right--20 w-80 h-80 rounded-full bg-primary`, { opacity: 0.1, filter: 'blur(80px)' } as any]} />
        <View style={[tw`absolute bottom-20 left--20 w-80 h-80 rounded-full bg-blue-100`, { opacity: 0.1, filter: 'blur(80px)' } as any]} />

        <View style={tw`bg-white/95 rounded-[2.5rem] border border-slate-200 shadow-2xl p-8`}>
          <View style={tw`items-center mb-10`}>
            <View style={tw`w-20 h-20 rounded-3xl bg-primary/10 items-center justify-center mb-6 shadow-inner ring-1 ring-primary/20`}>
              <KeyRound size={32} color="#014D9F" />
            </View>
            <Text style={tw`text-3xl font-black text-slate-900 tracking-tight text-center`}>Account Recovery</Text>
            <Text style={tw`text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 text-center`}>
              Security Protocol
            </Text>
          </View>

          <Text style={tw`text-center text-slate-500 font-medium text-base mb-10 px-2 leading-6`}>
            Enter your administrative email address associated with your Right Jobs profile to receive recovery instructions.
          </Text>

          <Input
            label="Recovery Email"
            placeholder="admin@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Mail size={18} color={!email ? '#94A3B8' : '#014D9F'} />}
            containerStyle={tw`mb-8`}
          />

          <Button
            title="Send Recovery Link"
            onPress={onSubmit}
            loading={loading}
            style={tw`h-16 rounded-2xl bg-primary shadow-xl shadow-primary/20 mb-8`}
            textStyle={tw`text-lg font-bold text-white`}
            icon={<Send size={20} color="#FFF" />}
          />

          <TouchableOpacity 
            onPress={() => router.push('/(auth)/login')}
            style={tw`flex-row items-center justify-center gap-2`}
          >
            <ArrowLeft size={16} color="#014D9F" />
            <Text style={tw`text-primary font-black text-sm`}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={tw`mt-12 items-center px-10`}>
           <Text style={tw`text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center leading-4`}>
              Resetting your password will log you out of all active sessions across all devices for your protection.
           </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
