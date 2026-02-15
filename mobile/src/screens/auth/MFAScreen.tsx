import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { apiClient } from '../../services/api/client';
import { ShieldCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export const MFAScreen = () => {
  const { showSuccess, showError } = useToast();
  const { updateUserData } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onVerify = async () => {
    if (otp.length !== 6) return showError('Error', 'Please enter the 6-digit code.');
    setLoading(true);
    try {
      await apiClient.post('/auth/mfa/verify', { otp });
      await updateUserData({ mfaComplete: true });
      showSuccess('MFA Verified', 'Access granted to admin panel.');
      router.replace('/(admin)/dashboard');
    } catch (error: any) {
      showError('Verification Failed', error.response?.data?.message || 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    try {
      await apiClient.post('/auth/mfa/resend');
      showSuccess('Success', 'A new code has been sent to your email.');
    } catch (error: any) {
      showError('Error', 'Failed to resend code.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-light"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-12 items-center">
        <View className="bg-primary/10 p-6 rounded-full mb-8">
          <ShieldCheck size={48} color="#014D9F" />
        </View>

        <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">Admin MFA</Text>
        <Text className="text-gray-500 text-center mb-10">
          Enter the 6-digit verification code sent to your admin email address.
        </Text>

        <Input
          placeholder="000000"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          className="text-center text-2xl tracking-[10px]"
          autoFocus
        />

        <Button
          title="Verify & Continue"
          onPress={onVerify}
          loading={loading}
          className="w-full mb-6"
        />

        <Button
          title="Resend OTP"
          onPress={onResend}
          variant="ghost"
          textClassName="text-primary font-bold"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
