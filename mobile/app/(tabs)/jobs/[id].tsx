import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { jobsService } from '../../../src/services/api/jobs';
import { QUERY_KEYS } from '../../../src/constants/queryKeys';
import { useToast } from '../../../src/hooks/useToast';
import { Button } from '../../../src/components/ui/Button';
import { ImageGallery } from '../../../src/components/ImageGallery';
import { tw } from '../../../src/lib/tailwind';
import { 
  ChevronLeft, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Globe,
  Clock,
  FileText,
  Flag,
  Bookmark,
  Share2,
  Sparkles,
  CheckCircle2,
  Building2,
  Camera
} from 'lucide-react-native';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.JOB_DETAILS, id],
    queryFn: () => jobsService.getJobDetails(id as string),
    enabled: !!id,
  });

  const applyMutation = useMutation({
    mutationFn: (data: { coverLetter?: string }) => 
      jobsService.applyForJob(id as string, data),
    onSuccess: () => {
      showSuccess('Success', 'Application submitted!');
      setShowApplyForm(false);
      setCoverLetter('');
      router.back();
    },
    onError: (error: any) => {
      showError('Error', error?.response?.data?.message || 'Failed to apply');
    },
  });

  const saveMutation = useMutation({
    mutationFn: (saved: boolean) => 
      saved ? jobsService.saveJob(id as string) : jobsService.unsaveJob(id as string),
    onSuccess: (_, saved: boolean) => {
      setIsSaved(saved);
      showSuccess('Success', saved ? 'Job saved!' : 'Job removed');
    },
    onError: () => {
      showError('Error', 'Failed to update');
    },
  });

  const handleApply = () => {
    Alert.alert(
      'Confirm Application',
      'Are you sure you want to apply for this position?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Apply', 
          onPress: () => applyMutation.mutate({ coverLetter })
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-slate-50 justify-center items-center`}>
        <ActivityIndicator size="large" color="#014D9F" />
        <Text style={tw`mt-4 text-slate-400 font-bold text-xs uppercase tracking-widest`}>
          Loading job details
        </Text>
      </View>
    );
  }

  if (!job) {
    return (
      <View style={tw`flex-1 bg-slate-50 justify-center items-center px-6`}>
        <Text style={tw`text-lg text-slate-500 text-center mb-6`}>Job not found</Text>
        <Button 
          title="Go Back" 
          onPress={() => router.back()}
          style={tw`h-14 rounded-2xl`}
        />
      </View>
    );
  }

  const isVerified = (job as any).createdBy?.idVerification?.status === 'VERIFIED';
  const officeImageUrl = (job as any).officeImageUrl;

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      {/* Header */}
      <View style={tw`bg-white pt-12 pb-4 px-6 border-b border-slate-100 flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center flex-1`}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={tw`p-2 -ml-2 mr-4 rounded-full`}
          >
            <ChevronLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <View style={tw`flex-1`}>
            <Text style={[tw`text-xl font-black tracking-tight`, { color: '#0F172A' }]}>{job.title}</Text>
            <Text style={[tw`text-xs font-bold uppercase tracking-widest mt-1`, { color: '#94A3B8' }]}>{job.companyName}</Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => saveMutation.mutate(!isSaved)}
          disabled={saveMutation.isPending}
          style={tw`ml-4`}
        >
          <Bookmark 
            size={24} 
            color={isSaved ? '#014D9F' : '#CBD5E1'} 
            fill={isSaved ? '#014D9F' : 'none'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={tw`flex-1`}
        contentContainerStyle={tw`pb-40`}
        showsVerticalScrollIndicator={false}
      >
        {/* Job Type & Verification Badge */}
        <View style={tw`px-6 pt-6 pb-4 gap-3 flex-row flex-wrap`}>
          <View style={tw`bg-primary/10 px-4 py-2 rounded-2xl`}>
            <Text style={[tw`text-xs font-black uppercase tracking-widest`, { color: '#014D9F' }]}>
              {job.type?.replace('_', ' ') || 'Full Time'}
            </Text>
          </View>
          {isVerified && (
            <View style={tw`bg-green-50 px-4 py-2 rounded-2xl flex-row items-center gap-1.5 border border-green-100`}>
              <CheckCircle2 size={14} color="#10B981" />
              <Text style={[tw`text-xs font-black uppercase tracking-widest`, { color: '#10B981' }]}>
                Verified Employer
              </Text>
            </View>
          )}
        </View>

        {/* Office Image if available */}
        {officeImageUrl && (
          <ImageGallery images={[officeImageUrl]}>
            <View style={tw`mx-6 mb-6 rounded-3xl overflow-hidden border border-slate-200 shadow-md`}>
              <Image 
                source={{ uri: officeImageUrl }} 
                style={{ width: '100%', height: 240 }}
                resizeMode="cover"
              />
              <View style={tw`absolute bottom-4 left-4 flex-row items-center gap-2 bg-white/90 backdrop-blur px-4 py-2.5 rounded-2xl border border-white/20`}>
                <Camera size={16} color="#014D9F" />
                <Text style={[tw`text-xs font-black uppercase tracking-tight`, { color: '#0F172A' }]}>Workplace Preview</Text>
              </View>
            </View>
          </ImageGallery>
        )}

        {/* Employer Information Card */}
        <View style={tw`mx-6 mb-6`}>
          <View style={tw`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden`}>
            {/* Company Header */}
            <View style={tw`p-6 flex-row items-center gap-4 border-b border-slate-100`}>
              {job.companyLogoUrl ? (
                <ImageGallery images={[job.companyLogoUrl]}>
                  <View style={tw`h-16 w-16 rounded-2xl bg-primary/10 items-center justify-center border border-primary/20 overflow-hidden`}>
                    <Image 
                      source={{ uri: job.companyLogoUrl }} 
                      style={{ width: 64, height: 64 }}
                      resizeMode="cover"
                    />
                  </View>
                </ImageGallery>
              ) : (
                <View style={tw`h-16 w-16 rounded-2xl bg-primary/10 items-center justify-center border border-primary/20`}>
                  <Text style={tw`text-3xl font-black text-primary`}>
                    {job.companyName?.[0] || 'C'}
                  </Text>
                </View>
              )}
              <View style={tw`flex-1`}>
                <Text style={[tw`text-xs font-bold uppercase tracking-widest mb-1`, { color: '#94A3B8' }]}>
                  Hiring Company
                </Text>
                <Text style={[tw`text-lg font-black`, { color: '#0F172A' }]}>{job.companyName}</Text>
                {(job as any).phoneNumber && (
                  <Text style={[tw`text-xs font-medium mt-1`, { color: '#64748B' }]}>{(job as any).phoneNumber}</Text>
                )}
              </View>
            </View>

            {/* Company Details Grid */}
            <View style={tw`p-6 gap-4`}>
              <View>
                <Text style={[tw`text-xs font-bold uppercase tracking-widest mb-2`, { color: '#94A3B8' }]}>
                  Category
                </Text>
                <Text style={[tw`text-base font-bold`, { color: '#0F172A' }]}>{job.category}</Text>
              </View>

              {(job as any).benefits && (
                <View>
                  <Text style={[tw`text-xs font-bold uppercase tracking-widest mb-2`, { color: '#94A3B8' }]}>
                    Key Benefits
                  </Text>
                  <Text style={[tw`text-base font-bold`, { color: '#0F172A' }]}>{(job as any).benefits}</Text>
                </View>
              )}

              {(job as any).requirements && (
                <View>
                  <Text style={[tw`text-xs font-bold uppercase tracking-widest mb-2`, { color: '#94A3B8' }]}>
                    Requirements
                  </Text>
                  <Text style={[tw`text-base font-bold`, { color: '#0F172A' }]}>{(job as any).requirements}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Job Details Grid */}
        <View style={tw`mx-6 mb-6 gap-3`}>
          <View style={tw`flex-row gap-3`}>
            <View style={tw`flex-1 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm`}>
              <View style={tw`flex-row items-center gap-3 mb-2`}>
                <MapPin size={18} color="#014D9F" />
                <Text style={[tw`text-[10px] font-bold uppercase tracking-tight`, { color: '#94A3B8' }]}>
                  Location
                </Text>
              </View>
              <Text style={[tw`text-sm font-black`, { color: '#0F172A' }]}>{job.location}</Text>
            </View>

            <View style={tw`flex-1 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm`}>
              <View style={tw`flex-row items-center gap-3 mb-2`}>
                <Globe size={18} color="#014D9F" />
                <Text style={[tw`text-[10px] font-bold uppercase tracking-tight`, { color: '#94A3B8' }]}>
                  Work Mode
                </Text>
              </View>
              <Text style={[tw`text-sm font-black`, { color: '#0F172A' }]}>{job.workMode || 'Onsite'}</Text>
            </View>
          </View>

          {job.salaryRange && (
            <View style={tw`bg-white rounded-2xl border border-slate-100 p-4 shadow-sm`}>
              <View style={tw`flex-row items-center gap-3 mb-2`}>
                <DollarSign size={18} color="#10B981" />
                <Text style={[tw`text-[10px] font-bold uppercase tracking-tight`, { color: '#94A3B8' }]}>
                  Salary Range
                </Text>
              </View>
              <Text style={[tw`text-sm font-black`, { color: '#0F172A' }]}>{job.salaryRange}</Text>
            </View>
          )}
        </View>

        {/* Posted Date */}
        <View style={tw`mx-6 mb-8 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex-row items-center gap-3`}>
          <Clock size={18} color="#014D9F" />
          <View>
            <Text style={[tw`text-[10px] font-bold uppercase tracking-tight`, { color: '#94A3B8' }]}>
              Posted
            </Text>
            <Text style={[tw`text-sm font-black`, { color: '#0F172A' }]}>
              {new Date(job.createdAt || new Date()).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Job Description Section */}
        <View style={tw`mx-6 mb-8`}>
          <View style={tw`flex-row items-center gap-3 mb-4`}>
            <View style={tw`h-10 w-10 rounded-xl bg-primary/10 items-center justify-center`}>
              <FileText size={20} color="#014D9F" />
            </View>
            <Text style={[tw`text-lg font-black`, { color: '#0F172A' }]}>Job Description</Text>
          </View>
          
          <View style={tw`bg-white rounded-2xl border border-slate-100 p-6 shadow-sm`}>
            <Text style={[tw`text-base leading-relaxed font-medium`, { color: '#475569' }]}>
              {job.description}
            </Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={tw`h-8`} />
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={tw`absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4 pb-8`}>
        {showApplyForm ? (
          <View style={tw`space-y-4 mb-4`}>
            <View style={tw`bg-slate-50 rounded-2xl border border-slate-200 p-4`}>
              <Text style={[tw`text-xs font-bold uppercase tracking-widest mb-3 ml-1`, { color: '#94A3B8' }]}>
                Cover Letter (Optional)
              </Text>
              <TextInput
                placeholder="Tell them why you're a great fit..."
                placeholderTextColor="#94A3B8"
                value={coverLetter}
                onChangeText={setCoverLetter}
                multiline
                numberOfLines={4}
                style={[tw`text-base font-medium p-3 bg-white rounded-xl border border-slate-200`, { color: '#0F172A' }]}
                maxLength={500}
              />
              <Text style={[tw`text-[10px] font-bold mt-3`, { color: '#94A3B8' }]}>
                {coverLetter.length}/500
              </Text>
            </View>
            <View style={tw`flex-row gap-3`}>
              <Button
                title="Cancel"
                onPress={() => {
                  setShowApplyForm(false);
                  setCoverLetter('');
                }}
                variant="outline"
                style={tw`flex-1 h-12 rounded-2xl`}
              />
              <Button
                title="Submit"
                onPress={handleApply}
                loading={applyMutation.isPending}
                style={tw`flex-1 h-12 rounded-2xl shadow-lg shadow-primary/20`}
                icon={<Sparkles size={18} color="#FFF" />}
              />
            </View>
          </View>
        ) : (
          <View style={tw`flex-row gap-3`}>
            <Button
              title="Report"
              onPress={() => showError('Coming Soon', 'Report feature coming soon')}
              variant="outline"
              style={tw`flex-1 h-12 rounded-2xl`}
              icon={<Flag size={18} color="#EF4444" />}
            />
            <Button
              title="Apply Now"
              onPress={() => setShowApplyForm(true)}
              style={tw`flex-[2] h-12 rounded-2xl shadow-lg shadow-primary/20`}
              icon={<Sparkles size={18} color="#FFF" />}
            />
          </View>
        )}
      </View>
    </View>
  );
}
