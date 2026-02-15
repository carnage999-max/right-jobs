import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { apiClient } from '../../services/api/client';
import { Mail } from 'lucide-react-native';

export const VerifyEmailScreen = ({ route, navigation }: any) => {
  const { email } = route.params || {};
  const { showSuccess, showError } = useToast();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const onVerify = async () => {
    if (!token) return showError('Error', 'Please enter the verification code.');
    setLoading(true);
    try {
      await apiClient.post('/auth/verify-email', { token });
      showSuccess('Email Verified', 'You can now log in to your account.');
      navigation.navigate('Login');
    } catch (error: any) {
      showError('Verification Failed', error.response?.data?.message || 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    try {
      await apiClient.post('/auth/resend-verification', { email });
      showSuccess('Success', 'Verification code resent to your email.');
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
          <Mail size={48} color="#0EA5E9" />
        </View>

        <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">Verify Email</Text>
        <Text className="text-gray-500 text-center mb-10">
          We've sent a 6-digit code to {email || 'your email'}. Enter it below to verify your account.
        </Text>

        <Input
          placeholder="000000"
          value={token}
          onChangeText={setToken}
          keyboardType="number-pad"
          maxLength={6}
          className="text-center text-2xl tracking-[10px]"
          autoFocus
        />

        <Button
          title="Verify Account"
          onPress={onVerify}
          loading={loading}
          className="w-full mb-6"
        />

        <Button
          title="Resend Code"
          onPress={onResend}
          variant="ghost"
          textClassName="text-primary font-bold"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
