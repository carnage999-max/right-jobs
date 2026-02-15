import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { apiClient } from '../../services/api/client';
import { KeyRound } from 'lucide-react-native';

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email) return showError('Error', 'Please enter your email.');
    setLoading(true);
    try {
      await apiClient.post('/auth/forgot-password', { email });
      showSuccess('Email Sent', 'If an account exists, you will receive reset instructions.');
      navigation.navigate('Login');
    } catch (error: any) {
      // Per instructions: "do not reveal whether an email exists"
      showSuccess('Success', 'Check your email for reset instructions.');
      navigation.navigate('Login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-light"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-12 items-center">
        <View className="bg-warning/10 p-6 rounded-full mb-8">
          <KeyRound size={48} color="#F59E0B" />
        </View>

        <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">Forgot Password?</Text>
        <Text className="text-gray-500 text-center mb-10">
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
          className="w-full mb-6"
        />

        <Button
          title="Back to Login"
          onPress={() => navigation.navigate('Login')}
          variant="ghost"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
