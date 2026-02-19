import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { jobsService } from '../../src/services/api/jobs';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useToast } from '../../src/hooks/useToast';
import { FileText, Send, ChevronLeft, Check, AlertCircle, Lock } from 'lucide-react-native';
import { tw } from '../../src/lib/tailwind';

export default function ApplyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [coverLetter, setCoverLetter] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const { data: job } = useQuery({
    queryKey: ['JOB_DETAILS', id],
    queryFn: () => jobsService.getJobDetails(id as string),
    enabled: !!id,
  });

  const applyMutation = useMutation({
    mutationFn: (data: { coverLetter?: string }) => jobsService.applyForJob(id as string, data),
    onSuccess: () => {
      showSuccess('Application Submitted', 'Your profile and cover letter have been sent.');
      setTimeout(() => {
        router.dismissAll();
        router.replace('/(tabs)/applications');
      }, 1500);
    },
    onError: (error: any) => {
      showError('Application Failed', error.response?.data?.message || 'Something went wrong.');
    },
  });

  const handleApply = () => {
    Alert.alert(
      "Confirm Application",
      "Are you sure you want to apply for this position? Your profile will be shared with the hiring team.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Apply", onPress: () => applyMutation.mutate({ coverLetter }) }
      ]
    );
  };

  if (applyMutation.isSuccess) {
    return (
      <View style={tw`flex-1 bg-white`}>
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
              <Text style={[tw`text-xl font-black tracking-tight`, { color: '#0F172A' }]}>Application Status</Text>
            </View>
          </View>
        </View>

        {/* Success State */}
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <View style={tw`bg-green-500/10 p-6 rounded-full mb-6`}>
            <View style={tw`bg-green-500 p-4 rounded-full`}>
              <Check size={40} color="#FFFFFF" />
            </View>
          </View>
          <Text style={[tw`text-2xl font-black text-center mb-3`, { color: '#0F172A' }]}>
            Application Sent!
          </Text>
          <Text style={[tw`text-center text-slate-600 text-base leading-relaxed mb-8`, { color: '#64748B' }]}>
            The hiring team has been notified. We'll keep you updated on your application status.
          </Text>
          
          <TouchableOpacity 
            onPress={() => router.push('/(tabs)/applications' as any)}
            style={tw`bg-primary px-8 py-4 rounded-2xl w-full`}
          >
            <Text style={tw`text-white font-black text-center uppercase tracking-wider`}>
              Track My Progress
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-white`}
    >
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
            <Text style={[tw`text-xl font-black tracking-tight`, { color: '#0F172A' }]}>Apply for Position</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={tw`px-6 pt-6 pb-10`} showsVerticalScrollIndicator={false}>
        {/* Job Card */}
        {job && (
          <View style={tw`bg-primary/5 p-6 rounded-3xl mb-8 border border-primary/10`}>
            <Text style={[tw`text-xs font-black uppercase tracking-widest mb-2`, { color: '#94A3B8' }]}>
              Applying to
            </Text>
            <Text style={[tw`text-xl font-black mb-1`, { color: '#0F172A' }]}>
              {job.title}
            </Text>
            <Text style={[tw`text-lg font-bold`, { color: '#014D9F' }]}>
              {job.companyName}
            </Text>
          </View>
        )}

        {/* Cover Letter Section */}
        <View style={tw`mb-8`}>
          <View style={tw`flex-row items-center mb-4`}>
            <FileText size={20} color="#014D9F" style={tw`mr-2`} />
            <Text style={[tw`text-lg font-black`, { color: '#0F172A' }]}>Why are you a great fit?</Text>
          </View>
          <Text style={[tw`text-slate-500 text-sm mb-4`, { color: '#64748B' }]}>
            Share a brief introduction and highlight your relevant experience. (Optional)
          </Text>
          <Input
            placeholder="Introduce yourself and highlight your relevant experience..."
            value={coverLetter}
            onChangeText={setCoverLetter}
            multiline
            numberOfLines={6}
            inputStyle={tw`h-40 text-align-vertical-top`}
            maxLength={500}
          />
          <Text style={[tw`text-xs mt-2`, { color: '#94A3B8' }]}>
            {coverLetter.length}/500 characters
          </Text>
        </View>

        {/* Profile Resume Card */}
        <View style={tw`bg-slate-50 p-5 rounded-2xl mb-8 border border-slate-100 flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center flex-1`}>
            <View style={tw`bg-white p-3 rounded-xl mr-4`}>
              <FileText size={20} color="#014D9F" />
            </View>
            <View style={tw`flex-1`}>
              <Text style={[tw`font-black`, { color: '#0F172A' }]}>Your Master Resume</Text>
              <Text style={[tw`text-xs font-semibold mt-1`, { color: '#94A3B8' }]}>
                Auto-syncs from your profile
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/profile' as any)}
            style={tw`bg-white px-4 py-2 rounded-xl`}
          >
            <Text style={[tw`text-sm font-bold`, { color: '#014D9F' }]}>Update</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy Notice */}
        <View style={tw`bg-slate-50 p-5 rounded-2xl mb-8 border border-slate-100`}>
          <View style={tw`flex-row items-start mb-3`}>
            <Lock size={16} color="#64748B" style={tw`mr-2 mt-1`} />
            <Text style={[tw`font-black text-sm`, { color: '#0F172A' }]}>Privacy Guaranteed</Text>
          </View>
          <Text style={[tw`text-xs leading-relaxed`, { color: '#64748B' }]}>
            Your personal information and resume are only visible to the verified hiring manager of this specific job posting.
          </Text>
        </View>

        {/* Apply Button */}
        <TouchableOpacity
          onPress={handleApply}
          disabled={applyMutation.isPending}
          style={[
            tw`bg-primary px-6 py-4 rounded-2xl mb-4 flex-row items-center justify-center`,
            applyMutation.isPending && tw`opacity-70`
          ]}
        >
          {applyMutation.isPending ? (
            <Text style={tw`text-white font-black uppercase tracking-wider`}>Submitting...</Text>
          ) : (
            <>
              <Send size={20} color="#FFFFFF" style={tw`mr-2`} />
              <Text style={tw`text-white font-black uppercase tracking-wider`}>Confirm Application</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={tw`bg-white px-6 py-4 rounded-2xl border-2 border-slate-100`}
        >
          <Text style={[tw`text-center font-black uppercase tracking-wider`, { color: '#0F172A' }]}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
