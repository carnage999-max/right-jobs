import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { jobsService } from '../../src/services/api/jobs';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useToast } from '../../src/hooks/useToast';
import { FileText, Send, ChevronLeft } from 'lucide-react-native';

export default function ApplyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [coverLetter, setCoverLetter] = useState('');

  const { data: job } = useQuery({
    queryKey: ['JOB_DETAILS', id],
    queryFn: () => jobsService.getJobDetails(id as string),
    enabled: !!id,
  });

  const applyMutation = useMutation({
    mutationFn: (data: { coverLetter?: string }) => jobsService.applyForJob(id as string, data),
    onSuccess: () => {
      showSuccess('Application Submitted', 'Your profile and cover letter have been sent.');
      router.dismissAll();
      router.replace('/(tabs)/applications');
    },
    onError: (error: any) => {
      showError('Application Failed', error.response?.data?.message || 'Something went wrong.');
    },
  });

  const onConfirm = () => {
    Alert.alert(
      "Confirm Application",
      "Are you sure you want to apply for this position?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Apply", onPress: () => applyMutation.mutate({ coverLetter }) }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView className="flex-1 px-6 pt-16">
        <View className="flex-row items-center mb-8">
          <Button 
            title=""
            variant="ghost" 
            onPress={() => router.back()} 
            className="p-0 mr-4"
            icon={<ChevronLeft size={24} color="#1F2937" />}
          />
          <Text className="text-2xl font-bold text-gray-900">Apply for Position</Text>
        </View>

        {job && (
          <View className="bg-primary/5 p-6 rounded-3xl mb-8">
            <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-1">Applying to</Text>
            <Text className="text-xl font-bold text-gray-900">{job.title}</Text>
            <Text className="text-primary font-semibold">{job.company}</Text>
          </View>
        )}

        <View className="mb-6">
          <View className="flex-row items-center mb-4">
            <FileText size={20} color="#014D9F" className="mr-2" />
            <Text className="text-lg font-bold text-gray-900">Cover Letter (Optional)</Text>
          </View>
          <Text className="text-gray-500 text-sm mb-4">
            Briefly explain why you're a good fit for this role. Max 500 characters.
          </Text>
          <Input
            placeholder="Introduce yourself..."
            value={coverLetter}
            onChangeText={setCoverLetter}
            multiline
            numberOfLines={8}
            className="h-48 textAlignVertical-top"
            maxLength={500}
          />
        </View>

        <View className="bg-gray-50 p-4 rounded-2xl mb-10">
          <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mb-2">Note</Text>
          <Text className="text-gray-500 text-xs leading-5">
            By applying, your profile details (Skills, Experience, Resume) will be shared with the employer as per our privacy policy.
          </Text>
        </View>

        <Button
          title="Submit Application"
          onPress={onConfirm}
          loading={applyMutation.isPending}
          icon={<Send size={20} color="#FFF" />}
          size="lg"
          className="mb-20"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
