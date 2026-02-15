import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { apiClient } from '../../services/api/client';
import { ShieldCheck } from 'lucide-react-native';

export const ResetPasswordScreen = ({ navigation }: any) => {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { showSuccess, showError } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!password || password.length < 6) return showError('Error', 'Password must be at least 6 characters.');
    if (password !== confirmPassword) return showError('Error', "Passwords don't match.");
    
    setLoading(true);
    try {
      await apiClient.post('/auth/reset-password', { token, password });
      showSuccess('Success', 'Your password has been reset. You can now log in.');
      navigation.navigate('login');
    } catch (error: any) {
      showError('Error', error.response?.data?.message || 'Failed to reset password. The link may have expired.');
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
        <View className="bg-success/10 p-6 rounded-full mb-8">
          <ShieldCheck size={48} color="#10B981" />
        </View>

        <Text className="text-3xl font-bold text-gray-900 mb-2 text-center">Reset Password</Text>
        <Text className="text-gray-500 text-center mb-10">
          Enter your new password below.
        </Text>

        <Input
          label="New Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Input
          label="Confirm New Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Button
          title="Reset Password"
          onPress={onSubmit}
          loading={loading}
          className="w-full mb-6"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
