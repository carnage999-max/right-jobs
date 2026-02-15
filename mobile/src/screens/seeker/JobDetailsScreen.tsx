import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { MapPin, Briefcase, DollarSign, Calendar, ChevronLeft, Share2, Heart } from 'lucide-react-native';
import { Button } from '../../components/ui/Button';
import { jobsService } from '../../services/api/jobs';
import { QUERY_KEYS } from '../../constants/queryKeys';
import { useToast } from '../../hooks/useToast';

export default function JobDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.JOB_DETAILS, id],
    queryFn: () => jobsService.getJobDetails(id as string),
    enabled: !!id,
  });

  const saveMutation = useMutation({
    mutationFn: (saved: boolean) => saved ? jobsService.saveJob(id as string) : jobsService.unsaveJob(id as string),
    onSuccess: (data: any, saved: boolean) => {
      setIsSaved(saved);
      showSuccess('Success', saved ? 'Job saved to your profile' : 'Job removed from saved');
    },
    onError: () => showError('Error', 'Failed to update saved jobs'),
  });

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0EA5E9" />
      </View>
    );
  }

  if (!job) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-lg text-gray-500 text-center">Job details not found.</Text>
        <Button title="Go Back" onPress={() => router.back()} className="mt-4" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header Image/Banner placeholder */}
        <View className="h-48 bg-primary/10 items-center justify-center pt-8">
          <View className="bg-white p-6 rounded-3xl shadow-sm">
            <Briefcase size={40} color="#0EA5E9" />
          </View>
        </View>

        <View className="px-6 -mt-10">
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <Text className="text-2xl font-bold text-gray-900 mb-2">{job.title}</Text>
            <Text className="text-lg text-primary font-semibold mb-4">{job.company}</Text>
            
            <View className="flex-row flex-wrap gap-4 mb-6">
              <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-xl">
                <MapPin size={16} color="#64748B" />
                <Text className="text-gray-600 ml-1.5">{job.location}</Text>
              </View>
              <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-xl">
                <DollarSign size={16} color="#64748B" />
                <Text className="text-gray-600 ml-1.5">{job.salary || 'Competitive'}</Text>
              </View>
              <View className="flex-row items-center bg-gray-50 px-3 py-2 rounded-xl">
                <Calendar size={16} color="#64748B" />
                <Text className="text-gray-600 ml-1.5">{job.type || 'Full-time'}</Text>
              </View>
            </View>

            <View className="flex-row gap-x-4">
              <TouchableOpacity 
                onPress={() => saveMutation.mutate(!isSaved)}
                disabled={saveMutation.isPending}
                className={`flex-1 flex-row items-center justify-center py-3 rounded-2xl border ${isSaved ? 'bg-error/10 border-error' : 'bg-transparent border-gray-100'}`}
              >
                <Heart size={20} color={isSaved ? '#EF4444' : '#94A3B8'} fill={isSaved ? '#EF4444' : 'none'} />
                <Text className={`ml-2 font-semibold ${isSaved ? 'text-error' : 'text-gray-500'}`}>
                  {isSaved ? 'Saved' : 'Save Job'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <Share2 size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-8">
            <Text className="text-xl font-bold text-gray-900 mb-4">Job Description</Text>
            <Text className="text-gray-600 leading-6 text-base">
              {job.description || "No description provided."}
            </Text>
          </View>

          {/* More sections like Requirements, Benefits could go here */}
        </View>
      </ScrollView>

      {/* Floating Apply Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-white px-6 pt-4 pb-10 border-t border-gray-100">
        <Button 
          title="Apply Now" 
          onPress={() => router.push(`/apply/${id}`)} 
          size="lg"
        />
      </View>
    </View>
  );
}
