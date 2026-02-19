import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert, Image, Modal, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { jobsService } from '../../../src/services/api/jobs';
import { profileService } from '../../../src/services/api/profile';
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
  Camera,
  X,
  Lock,
  Send,
  Edit2,
  Download,
  Upload
} from 'lucide-react-native';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState<string | null>(null);
  const [showResumeSelector, setShowResumeSelector] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.JOB_DETAILS, id],
    queryFn: () => jobsService.getJobDetails(id as string),
    enabled: !!id,
  });

  const { data: profile } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => profileService.getProfile(),
  });

  // Load draft when component mounts
  useEffect(() => {
    if (id && !draftLoaded) {
      loadDraft();
    }
  }, [id, draftLoaded]);

  // Auto-save draft when page loses focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        // Save draft when navigating away
        if (id && (coverLetter || selectedResumeUrl)) {
          jobsService.saveDraft(id, {
            coverLetter,
            selectedResumeUrl
          }).catch(err => console.error('Failed to auto-save draft:', err));
        }
      };
    }, [id, coverLetter, selectedResumeUrl])
  );

  const loadDraft = async () => {
    if (!id) return;
    try {
      const draft = await jobsService.getDraft(id);
      if (draft) {
        setCoverLetter(draft.coverLetter || '');
        setSelectedResumeUrl(draft.selectedResumeUrl);
        setDraftLoaded(true);
        
        // Show draft recovery prompt
        Alert.alert(
          'Draft Found',
          'You have a saved draft for this application. Would you like to continue?',
          [
            { 
              text: 'Start Fresh', 
              style: 'cancel',
              onPress: () => {
                setCoverLetter('');
                setSelectedResumeUrl(null);
                jobsService.deleteDraft(id).catch(() => {});
              }
            },
            { 
              text: 'Continue', 
              onPress: () => {
                // Use the loaded draft
              }
            }
          ]
        );
      } else {
        setDraftLoaded(true);
      }
    } catch (error) {
      console.error('Failed to load draft:', error);
      setDraftLoaded(true);
    }
  };

  const applyMutation = useMutation({
    mutationFn: (data: { coverLetter?: string; selectedResumeUrl?: string | null }) => 
      jobsService.applyForJob(id as string, data),
    onSuccess: () => {
      showSuccess('Success', 'Application submitted!');
      setShowApplyForm(false);
      setCoverLetter('');
      setSelectedResumeUrl(null);
      if (id) {
        jobsService.deleteDraft(id).catch(() => {});
      }
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
          onPress: () => applyMutation.mutate({ coverLetter, selectedResumeUrl })
        }
      ]
    );
  };

  if (isLoading || !draftLoaded) {
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
        contentContainerStyle={tw`pb-32`}
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

        {/* Resume Preview Section */}
        {profile?.data?.resumeUrl ? (
          <View style={tw`mx-6 mb-8`}>
            <View style={tw`flex-row items-center gap-3 mb-4`}>
              <View style={tw`h-10 w-10 rounded-xl bg-green-100 items-center justify-center`}>
                <FileText size={20} color="#10B981" />
              </View>
              <Text style={[tw`text-lg font-black`, { color: '#0F172A' }]}>Your Resume</Text>
            </View>
            
            <View style={tw`bg-green-50 rounded-2xl border border-green-100 p-4 shadow-sm`}>
              <View style={tw`flex-row items-center justify-between`}>
                <View style={tw`flex-1`}>
                  <Text style={[tw`text-sm font-black mb-1`, { color: '#0F172A' }]}>
                    {profile.data.resumeFilename || 'resume.pdf'}
                  </Text>
                  <Text style={[tw`text-xs`, { color: '#64748B' }]}>Ready to send with application</Text>
                </View>
                <View style={tw`flex-row gap-2`}>
                  <TouchableOpacity 
                    onPress={() => setShowResumeSelector(true)}
                    style={tw`bg-white px-3 py-2 rounded-lg border border-slate-200`}
                  >
                    <Edit2 size={16} color="#014D9F" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => profileService.getResumeDownloadUrl().then(r => r?.url && Alert.alert('Download', 'Opening resume...')).catch(() => showError('Error', 'Failed to download'))}
                    style={tw`bg-primary px-3 py-2 rounded-lg`}
                  >
                    <Download size={16} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View style={tw`mx-6 mb-8`}>
            <View style={tw`bg-amber-50 rounded-2xl border border-amber-200 p-4 flex-row items-center gap-3`}>
              <View style={tw`flex-shrink-0`}>
                <FileText size={20} color="#D97706" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={[tw`text-sm font-black mb-1`, { color: '#0F172A' }]}>No Resume</Text>
                <Text style={[tw`text-xs`, { color: '#92400E' }]}>Upload a resume first to apply</Text>
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/profile' as any)}
                style={tw`bg-amber-600 px-3 py-2 rounded-lg`}
              >
                <Text style={tw`text-white font-bold text-xs`}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={tw`h-8`} />
      </ScrollView>

      {/* Fixed Bottom Button Bar */}
      <View style={tw`bg-white border-t border-slate-100 px-6 py-4 pb-6`}>
        <TouchableOpacity
          onPress={() => setShowApplyForm(true)}
          style={tw`bg-primary rounded-2xl py-5 items-center justify-center shadow-lg shadow-primary/20 active:opacity-90`}
        >
          <View style={tw`flex-row items-center justify-center`}>
            <Sparkles size={24} color="#FFF" style={tw`mr-3`} />
            <Text style={tw`text-white font-black text-base uppercase tracking-widest`}>Apply Now</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Apply Modal */}
      <Modal
        visible={showApplyForm}
        transparent={false}
        animationType="slide"
        onRequestClose={() => {
          setShowApplyForm(false);
          setCoverLetter('');
        }}
        presentationStyle="pageSheet"
      >
        <View style={tw`flex-1 bg-white`}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={tw`flex-1`}
          >
            {/* Modal Header - Dark Background */}
            <View style={tw`bg-slate-950 px-6 pt-12 pb-6`}>
              <View style={tw`flex-row items-start justify-between mb-4`}>
                <View style={tw`flex-1 pr-4`}>
                  <View style={tw`bg-white/10 px-3 py-1.5 rounded-full mb-3 w-fit`}>
                    <Text style={tw`text-white text-[10px] font-black uppercase tracking-widest`}>
                      Job Application
                    </Text>
                  </View>
                  <Text style={tw`text-white text-2xl font-black mb-1`}>Ready to Apply?</Text>
                  <Text style={[tw`text-white/60 text-sm italic leading-tight`, { color: '#94A3B8' }]}>
                    <Text style={tw`text-white font-bold`}>{job.title}</Text> at {job.companyName}
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={() => {
                    setShowApplyForm(false);
                    setCoverLetter('');
                  }}
                  style={tw`h-10 w-10 bg-white/10 rounded-xl items-center justify-center ml-2`}
                >
                  <X size={22} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView 
              style={tw`flex-1`} 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={tw`pb-6`}
            >
              {/* Modal Content */}
              <View style={tw`px-6 pt-6 gap-y-6`}>
                {/* Cover Letter Section */}
                <View>
                  <View style={tw`flex-row items-center gap-3 mb-3`}>
                    <FileText size={20} color="#014D9F" />
                    <Text style={[tw`text-base font-black`, { color: '#0F172A' }]}>
                      Why are you a great fit?
                    </Text>
                  </View>
                  <Text style={[tw`text-xs mb-3`, { color: '#64748B' }]}>
                    Optional - Share why you're interested in this role.
                  </Text>
                  <TextInput
                    placeholder="Tell them about yourself..."
                    placeholderTextColor="#CBD5E1"
                    value={coverLetter}
                    onChangeText={setCoverLetter}
                    multiline
                    numberOfLines={5}
                    style={[tw`p-4 rounded-2xl border border-slate-200 text-base font-medium`, { color: '#0F172A', textAlignVertical: 'top', height: 140 }]}
                    maxLength={500}
                  />
                  <Text style={[tw`text-xs mt-2`, { color: '#94A3B8' }]}>
                    {coverLetter.length}/500
                  </Text>
                </View>

                {/* Profile Resume Card */}
                <View style={tw`bg-slate-50 p-4 rounded-2xl border border-slate-100`}>
                  <View style={tw`flex-row items-center justify-between mb-3`}>
                    <View style={tw`flex-row items-center flex-1`}>
                      <View style={tw`bg-white p-2.5 rounded-lg mr-3`}>
                        <FileText size={18} color={selectedResumeUrl ? '#10B981' : '#014D9F'} />
                      </View>
                      <View style={tw`flex-1`}>
                        <Text style={[tw`font-black text-sm`, { color: '#0F172A' }]}>
                          {selectedResumeUrl ? 'Selected Resume' : 'Master Resume'}
                        </Text>
                        <Text style={[tw`text-xs font-semibold mt-0.5`, { color: '#94A3B8' }]}>
                          {profile?.data?.resumeFilename || 'resume.pdf'}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity 
                      onPress={() => setShowResumeSelector(true)}
                      style={tw`bg-white px-3 py-1.5 rounded-lg border border-slate-200`}
                    >
                      <Text style={[tw`text-xs font-black uppercase tracking-wider`, { color: '#014D9F' }]}>Change</Text>
                    </TouchableOpacity>
                  </View>
                  {selectedResumeUrl && (
                    <View style={tw`bg-green-50 p-3 rounded-xl border border-green-100 flex-row items-center`}>
                      <CheckCircle2 size={16} color="#10B981" style={tw`mr-2`} />
                      <Text style={[tw`text-xs font-semibold`, { color: '#059669' }]}>Custom resume selected</Text>
                    </View>
                  )}
                </View>

                {/* Privacy Notice */}
                <View style={tw`bg-slate-50 p-4 rounded-2xl border border-slate-100 flex-row gap-3`}>
                  <Lock size={16} color="#64748B" style={tw`mt-1 flex-shrink-0`} />
                  <View style={tw`flex-1`}>
                    <Text style={[tw`font-black text-sm mb-1`, { color: '#0F172A' }]}>Privacy</Text>
                    <Text style={[tw`text-xs leading-snug`, { color: '#64748B' }]}>
                      Your info is only shared with this hiring manager.
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={tw`px-6 py-4 gap-3 border-t border-slate-100 bg-white`}>
              <TouchableOpacity
                onPress={handleApply}
                disabled={applyMutation.isPending}
                style={[
                  tw`bg-primary px-6 py-4 rounded-2xl flex-row items-center justify-center shadow-lg shadow-primary/20`,
                  applyMutation.isPending && tw`opacity-70`
                ]}
              >
                {applyMutation.isPending ? (
                  <ActivityIndicator size="small" color="#FFF" style={tw`mr-2`} />
                ) : (
                  <Send size={20} color="#FFF" style={tw`mr-2`} />
                )}
                <Text style={tw`text-white font-black uppercase tracking-wider`}>
                  {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => {
                  setShowApplyForm(false);
                  setCoverLetter('');
                }}
                style={tw`bg-white px-6 py-3 rounded-2xl border-2 border-slate-200`}
              >
                <Text style={[tw`text-center font-black uppercase tracking-wider text-sm`, { color: '#0F172A' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Resume Selector Modal */}
      <Modal
        visible={showResumeSelector}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowResumeSelector(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowResumeSelector(false)}>
          <View style={tw`flex-1 bg-black/50 items-end`}>
            <TouchableWithoutFeedback>
              <View style={tw`bg-white rounded-t-[32px] w-full pt-8 pb-8 px-6 gap-y-4`}>
                {/* Header */}
                <View style={tw`flex-row items-center justify-between mb-4 pb-4 border-b border-slate-100`}>
                  <Text style={[tw`text-xl font-black`, { color: '#0F172A' }]}>Select Resume</Text>
                  <TouchableOpacity 
                    onPress={() => setShowResumeSelector(false)}
                    style={tw`h-8 w-8 items-center justify-center`}
                  >
                    <X size={24} color="#0F172A" />
                  </TouchableOpacity>
                </View>

                {/* Master Resume Option */}
                <TouchableOpacity 
                  onPress={() => {
                    setSelectedResumeUrl(null);
                    setShowResumeSelector(false);
                  }}
                  style={[tw`p-4 rounded-2xl flex-row items-center justify-between border-2`, selectedResumeUrl === null ? tw`border-primary bg-primary/5` : tw`border-slate-200 bg-white`]}
                >
                  <View style={tw`flex-row items-center flex-1`}>
                    <View style={tw`bg-primary/10 p-3 rounded-xl mr-3`}>
                      <FileText size={18} color="#014D9F" />
                    </View>
                    <View>
                      <Text style={[tw`font-black text-sm`, { color: '#0F172A' }]}>Master Resume</Text>
                      <Text style={[tw`text-xs mt-1`, { color: '#64748B' }]}>
                        {profile?.data?.resumeFilename || 'resume.pdf'}
                      </Text>
                    </View>
                  </View>
                  {selectedResumeUrl === null && (
                    <CheckCircle2 size={22} color="#014D9F" />
                  )}
                </TouchableOpacity>

                {/* Divider */}
                <View style={tw`h-px bg-slate-200 my-2`} />

                {/* Upload New Resume Option */}
                <TouchableOpacity 
                  onPress={() => {
                    setShowResumeSelector(false);
                    router.push('/profile/documents' as any);
                  }}
                  style={tw`p-4 rounded-2xl flex-row items-center gap-3 bg-slate-50 border border-slate-200`}
                >
                  <View style={tw`bg-slate-200 p-3 rounded-xl`}>
                    <Upload size={18} color="#64748B" />
                  </View>
                  <Text style={[tw`font-black text-sm`, { color: '#0F172A' }]}>Manage Documents</Text>
                </TouchableOpacity>

                {/* Info */}
                <View style={tw`bg-blue-50 p-3 rounded-xl border border-blue-100 flex-row items-start gap-2 mt-2`}>
                  <FileText size={14} color="#3B82F6" style={tw`mt-0.5 flex-shrink-0`} />
                  <Text style={[tw`text-xs flex-1`, { color: '#1E40AF' }]}>
                    The resume you select will be sent with your application. You can change it anytime.
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
