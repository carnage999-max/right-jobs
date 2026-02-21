import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, FileText, Upload, Trash2, Download, Edit2, Star, Check } from 'lucide-react-native';
import { tw } from '../../src/lib/tailwind';
import { Button } from '../../src/components/ui/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../../src/services/api/profile';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import * as DocumentPicker from 'expo-document-picker';

interface Resume {
  id: string;
  url: string;
  filename: string;
  isDefault: boolean;
  createdAt: string;
}

export default function ResumeDocumentsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [isRenaming, setIsRenaming] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newResumeName, setNewResumeName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { data: resumes = [], isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE, 'resumes'],
    queryFn: () => profileService.getResumes(),
  });

  const deleteResumeMutation = useMutation({
    mutationFn: (id: string) => profileService.deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE, 'resumes'] });
      Alert.alert('Success', 'Resume deleted successfully!');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to delete resume');
    }
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => profileService.setDefaultResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE, 'resumes'] });
      Alert.alert('Success', 'Resume set as default!');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to set default resume');
    }
  });

  const handleDownload = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert('Error', 'Failed to download resume.');
    }
  };

  const handlePickFile = async () => {
    if (resumes.length >= 3) {
      Alert.alert('Limit Reached', 'You can upload a maximum of 3 resumes');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf'
      });

      if (result.canceled) return;

      const file = result.assets[0];

      // Validate file type
      if (!file.name?.toLowerCase().endsWith('.pdf')) {
        Alert.alert('Error', 'Please select a PDF file');
        return;
      }

      setIsUploading(true);

      try {
        // Step 1: Get presigned URL
        const presignResult = await profileService.getPresignedUrl(
          file.name,
          'application/pdf',
          'resumes'
        );

        if (!presignResult.ok) {
          throw new Error('Failed to get upload URL');
        }

        // Step 2: Upload to S3
        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          type: 'application/pdf',
          name: file.name
        } as any);

        const uploadResponse = await fetch(presignResult.url, {
          method: 'PUT',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file');
        }

        // Step 3: Create resume record
        const createResult = await profileService.createResume(
          presignResult.publicUrl,
          file.name
        );

        if (createResult) {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE, 'resumes'] });
          Alert.alert('Success', 'Resume uploaded successfully!');
        } else {
          throw new Error('Failed to save resume');
        }
      } catch (error) {
        console.error('Upload error:', error);
        Alert.alert('Error', 'Failed to upload resume: ' + (error instanceof Error ? error.message : 'Unknown error'));
      } finally {
        setIsUploading(false);
      }
    } catch (error) {
      console.error('File picker error:', error);
      Alert.alert('Error', 'Failed to select file');
    }
  };

  const handleDeleteResume = (resume: Resume) => {
    Alert.alert(
      'Delete Resume',
      `Delete "${resume.filename}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteResumeMutation.mutate(resume.id),
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-slate-50 items-center justify-center`}>
        <ActivityIndicator size="large" color="#014D9F" />
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      {/* Header */}
      <View style={tw`bg-white pt-12 pb-4 px-6 border-b border-slate-100 flex-row items-center`}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={tw`p-2 -ml-2 mr-4 rounded-full`}
        >
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-black text-slate-900 tracking-tight`}>Resume & Files</Text>
      </View>

      <ScrollView style={tw`flex-1 p-6`}>
        {/* Header Text */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-slate-600 text-sm leading-relaxed`}>
            Upload up to 3 resumes. Select which one to send with each application.
          </Text>
        </View>

        {/* Resumes List */}
        {resumes.length > 0 ? (
          <View style={tw`gap-4 mb-8`}>
            {resumes.map((resume: Resume) => (
              <View key={resume.id} style={tw`bg-white p-5 rounded-2xl border border-slate-100 shadow-sm`}>
                <View style={tw`flex-row items-start justify-between mb-3`}>
                  <View style={tw`flex-row items-center flex-1`}>
                    <View style={tw`bg-primary/10 p-3 rounded-xl mr-3`}>
                      <FileText size={20} color="#014D9F" />
                    </View>
                    <View style={tw`flex-1`}>
                      <Text style={tw`font-black text-sm text-slate-900 mb-0.5`}>{resume.filename}</Text>
                      <Text style={tw`text-xs text-slate-400`}>
                        {new Date(resume.createdAt).toLocaleDateString()} • PDF
                      </Text>
                    </View>
                  </View>
                  {resume.isDefault && (
                    <View style={tw`bg-green-50 px-2 py-1 rounded-full border border-green-100`}>
                      <Text style={tw`text-xs font-bold text-green-700`}>Default</Text>
                    </View>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={tw`flex-row gap-2`}>
                  <TouchableOpacity 
                    onPress={() => handleDownload(resume.url)}
                    style={tw`flex-1 bg-slate-50 py-2.5 rounded-lg flex-row items-center justify-center border border-slate-200`}
                  >
                    <Download size={16} color="#475569" style={tw`mr-1.5`} />
                    <Text style={tw`text-sm font-bold text-slate-600`}>Download</Text>
                  </TouchableOpacity>

                  {!resume.isDefault && (
                    <TouchableOpacity 
                      onPress={() => setDefaultMutation.mutate(resume.id)}
                      disabled={setDefaultMutation.isPending}
                      style={tw`flex-1 bg-primary/10 py-2.5 rounded-lg flex-row items-center justify-center border border-primary/20`}
                    >
                      <Star size={16} color="#014D9F" style={tw`mr-1.5`} />
                      <Text style={tw`text-sm font-bold text-primary`}>Set Default</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity 
                    onPress={() => handleDeleteResume(resume)}
                    disabled={deleteResumeMutation.isPending}
                    style={tw`w-10 bg-red-50 py-2.5 rounded-lg items-center justify-center border border-red-100`}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* Upload Button */}
        {resumes.length < 3 && (
          <TouchableOpacity 
            onPress={handlePickFile}
            disabled={isUploading}
            style={tw`bg-slate-900 p-6 rounded-2xl flex-row items-center justify-center shadow-lg shadow-slate-300 ${isUploading ? 'opacity-60' : ''}`}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#FFF" style={tw`mr-3`} />
            ) : (
              <Upload size={20} color="#FFF" style={tw`mr-3`} />
            )}
            <Text style={tw`text-white font-black text-base uppercase tracking-wide`}>
              {isUploading ? 'Uploading...' : 'Upload Resume'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Info Box */}
        {resumes.length === 0 && (
          <View style={tw`items-center py-12`}>
            <View style={tw`bg-slate-100 p-8 rounded-full items-center justify-center mb-6`}>
              <FileText size={40} color="#CBD5E1" />
            </View>
            <Text style={tw`text-lg font-black text-slate-900 mb-2`}>No Resumes Yet</Text>
            <Text style={tw`text-slate-500 text-center text-sm mb-6`}>
              Upload your first resume to get started applying to jobs.
            </Text>
          </View>
        )}

        {resumes.length > 0 && (
          <View style={tw`bg-blue-50 p-4 rounded-xl border border-blue-100 flex-row gap-3 mt-4`}>
            <FileText size={14} color="#3B82F6" style={tw`mt-0.5 flex-shrink-0`} />
            <Text style={tw`text-xs text-blue-900 flex-1 leading-relaxed`}>
              You can upload up to {3 - resumes.length} more resume{3 - resumes.length !== 1 ? 's' : ''}. The default resume will be used by default when applying.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

