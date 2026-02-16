import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { apiClient } from '../../services/api/client';
import { KeyRound } from 'lucide-react-native';

import { tw } from '../../lib/tailwind';

import { useRouter } from 'expo-router';

// @ts-ignore
export const ForgotPasswordScreen = (): any => {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email) return showError('Error', 'Please enter your email.');
    setLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email });
      showSuccess('Email Sent', 'If an account exists, you will receive reset instructions.');
      router.push('/(auth)/login' as any);
    } catch (error: any) {
      showSuccess('Success', 'Check your email for reset instructions.');
      router.push('/(auth)/login' as any);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-white`}
    >
      <ScrollView contentContainerStyle={tw`flex-grow px-6 py-12 items-center`}>
        <View style={tw`bg-primary/5 p-6 rounded-full mb-8`}>
          <KeyRound size={48} color="#014D9F" />
        </View>

        <Text style={tw`text-3xl font-black text-gray-900 mb-2 text-center`}>Forgot Password?</Text>
        <Text style={tw`text-gray-500 font-medium text-center mb-10`}>
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        <Input
          label="Email Address"
          placeholder="name@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Button
          title="Send Instructions"
          onPress={onSubmit}
          loading={loading}
          style={tw`w-full mb-6 shadow-lg shadow-primary/20 h-14`}
        />

        <Button
          title="Back to Login"
          onPress={() => router.push('/(auth)/login' as any)}
          variant="ghost"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
