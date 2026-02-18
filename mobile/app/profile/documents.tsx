import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, FileText, Upload, Trash2, Download, Edit2 } from 'lucide-react-native';
import { tw } from '../../src/lib/tailwind';
import { Button } from '../../src/components/ui/Button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../../src/services/api/profile';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import * as DocumentPicker from 'expo-document-picker';

export default function ResumeDocumentsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [isRenaming, setIsRenaming] = useState(false);
  const [newResumeName, setNewResumeName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { data: profileData, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => profileService.getProfile(),
  });

  const profile = profileData?.data;
  const resumeUrl = profile?.resumeUrl;
  const resumeFilename = profile?.resumeFilename || 'My_Resume.pdf';

  // Update filename mutation
  const updateFilenameMutation = useMutation({
    mutationFn: (filename: string) => profileService.updateResumeFilename(filename),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
      setIsRenaming(false);
      Alert.alert('Success', 'Resume renamed successfully!');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to rename resume');
    }
  });

  const handleDownload = async () => {
    try {
      const result = await profileService.getResumeDownloadUrl();
      if (result.ok && result.url) {
        await Linking.openURL(result.url);
      } else {
        Alert.alert('Error', 'Could not retrieve download link.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to download resume.');
    }
  };

  const handlePickFile = async () => {
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

      // For mobile, we need to handle file size differently
      // We'll let the server validate and reject if too large
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
        // Read file and upload
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

        // Step 3: Update profile with new resume URL
        const updateResult = await profileService.updateProfile({
          resumeUrl: presignResult.publicUrl,
          resumeFilename: file.name
        });

        if (updateResult.ok) {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
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

  const handleRenameResume = () => {
    if (!newResumeName.trim()) return;

    let finalName = newResumeName.trim();
    if (!finalName.toLowerCase().endsWith('.pdf')) {
      finalName += '.pdf';
    }

    updateFilenameMutation.mutate(finalName);
  };

  const handleDeleteResume = () => {
    Alert.alert(
      'Delete Resume',
      'Are you sure you want to delete your resume?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Update profile to remove resume
              await profileService.updateProfile({
                resumeUrl: null,
                resumeFilename: null
              });
              queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
              Alert.alert('Success', 'Resume deleted successfully!');
            } catch {
              Alert.alert('Error', 'Failed to delete resume');
            }
          }
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

      <ScrollView style={tw`flex-1 p-6`} contentContainerStyle={{ paddingBottom: 40 }}>
        {!resumeUrl ? (
          // Empty State
          <View style={tw`items-center py-20`}>
            <View style={tw`bg-slate-100 p-6 rounded-full items-center justify-center mb-6`}>
              <FileText size={40} color="#CBD5E1" />
            </View>
            <Text style={tw`text-lg font-black text-slate-900 mb-2`}>No documents yet</Text>
            <Text style={tw`text-slate-500 text-center px-10 mb-8`}>Upload your resume to increase your visibility to employers.</Text>
            <Button 
              title={isUploading ? "Uploading..." : "Upload Resume"}
              icon={!isUploading && <Upload size={20} color="#FFF" />}
              style={tw`w-full`}
              textStyle={tw`text-white font-black`}
              onPress={handlePickFile}
              disabled={isUploading}
            />
          </View>
        ) : (
          // Resume Exists
          <View style={tw`space-y-4`}>
            {/* Resume Card */}
            <View style={tw`bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-4`}>
              <View style={tw`flex-row items-center mb-4`}>
                <View style={tw`bg-red-50 p-3 rounded-2xl mr-4`}>
                  <FileText size={24} color="#EF4444" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-black text-slate-900 text-base mb-0.5`}>{resumeFilename}</Text>
                  <Text style={tw`text-slate-400 text-xs font-bold uppercase tracking-widest`}>Resume • PDF</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={tw`flex-row gap-3`}>
                <TouchableOpacity 
                  onPress={handleDownload}
                  style={tw`flex-1 bg-slate-50 py-3 rounded-xl flex-row items-center justify-center border border-slate-200`}
                >
                  <Download size={16} color="#475569" style={tw`mr-2`} />
                  <Text style={tw`font-bold text-slate-600 text-xs uppercase tracking-wide`}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setIsRenaming(true);
                    setNewResumeName(resumeFilename.replace('.pdf', ''));
                  }}
                  style={tw`w-12 bg-blue-50 py-3 rounded-xl flex-row items-center justify-center border border-blue-100`}
                >
                  <Edit2 size={16} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleDeleteResume}
                  style={tw`w-12 bg-red-50 py-3 rounded-xl flex-row items-center justify-center border border-red-100`}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Rename Modal */}
            {isRenaming && (
              <View style={tw`bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-4`}>
                <Text style={tw`text-lg font-black text-slate-900 mb-4`}>Rename Resume</Text>
                <TextInput
                  style={tw`bg-slate-50 p-4 rounded-xl border border-slate-200 font-bold text-slate-900 mb-4`}
                  value={newResumeName}
                  onChangeText={setNewResumeName}
                  placeholder="Resume name (without .pdf)"
                  placeholderTextColor="#CBD5E1"
                />
                <View style={tw`flex-row gap-3`}>
                  <TouchableOpacity 
                    onPress={() => setIsRenaming(false)}
                    style={tw`flex-1 bg-slate-100 py-3 rounded-xl items-center justify-center`}
                  >
                    <Text style={tw`font-bold text-slate-900`}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={handleRenameResume}
                    disabled={updateFilenameMutation.isPending}
                    style={tw`flex-1 bg-primary py-3 rounded-xl items-center justify-center`}
                  >
                    {updateFilenameMutation.isPending ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <Text style={tw`font-bold text-white`}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Update Resume Button */}
            <TouchableOpacity 
              onPress={handlePickFile}
              disabled={isUploading}
              style={tw`bg-slate-900 p-6 rounded-[2rem] flex-row items-center justify-center shadow-xl shadow-slate-200/50 mt-4 ${isUploading ? 'opacity-60' : ''}`}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="#FFF" style={tw`mr-3`} />
              ) : (
                <Upload size={20} color="#FFF" style={tw`mr-3`} />
              )}
              <Text style={tw`font-black text-white uppercase tracking-tight`}>
                {isUploading ? 'Uploading...' : 'Update Resume'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default function ResumeDocumentsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [isRenaming, setIsRenaming] = useState(false);
  const [newResumeName, setNewResumeName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { data: profileData, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => profileService.getProfile(),
  });

  const profile = profileData?.data;
  const resumeUrl = profile?.resumeUrl;
  const resumeFilename = profile?.resumeFilename || 'My_Resume.pdf';

  // Update filename mutation
  const updateFilenameMutation = useMutation({
    mutationFn: (filename: string) => profileService.updateResumeFilename(filename),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
      setIsRenaming(false);
      Alert.alert('Success', 'Resume renamed successfully!');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to rename resume');
    }
  });

  const handleDownload = async () => {
    try {
      const result = await profileService.getResumeDownloadUrl();
      if (result.ok && result.url) {
        await Linking.openURL(result.url);
      } else {
        Alert.alert('Error', 'Could not retrieve download link.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to download resume.');
    }
  };

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf'
      });

      if (result.canceled) return;

      const file = result.assets[0];

      // Validate file type
      if (file.mimeType !== 'application/pdf') {
        Alert.alert('Error', 'Please select a PDF file');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size && file.size > 10 * 1024 * 1024) {
        Alert.alert('Error', 'Resume must be less than 10MB');
        return;
      }

      setIsUploading(true);

      try {
        // Step 1: Get presigned URL
        const presignResult = await profileService.getPresignedUrl(
          file.name,
          file.mimeType || 'application/pdf',
          'resumes'
        );

        if (!presignResult.ok) {
          throw new Error('Failed to get upload URL');
        }

        // Step 2: Upload to S3 using PUT request
        const uploadResponse = await fetch(presignResult.url, {
          method: 'PUT',
          body: {
            uri: file.uri,
            type: file.mimeType || 'application/pdf',
            name: file.name
          } as any,
          headers: {
            'Content-Type': file.mimeType || 'application/pdf'
          }
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file');
        }

        // Step 3: Update profile with new resume URL
        const updateResult = await profileService.updateProfile({
          resumeUrl: presignResult.publicUrl,
          resumeFilename: file.name
        });

        if (updateResult.ok) {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
          Alert.alert('Success', 'Resume uploaded successfully!');
        } else {
          throw new Error('Failed to save resume');
        }
      } catch (error) {
        console.error('Upload error:', error);
        Alert.alert('Error', 'Failed to upload resume');
      } finally {
        setIsUploading(false);
      }
    } catch (error) {
      console.error('File picker error:', error);
      Alert.alert('Error', 'Failed to select file');
    }
  };

  const handleRenameResume = () => {
    if (!newResumeName.trim()) return;

    let finalName = newResumeName.trim();
    if (!finalName.toLowerCase().endsWith('.pdf')) {
      finalName += '.pdf';
    }

    updateFilenameMutation.mutate(finalName);
  };

  const handleDeleteResume = () => {
    Alert.alert(
      'Delete Resume',
      'Are you sure you want to delete your resume?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Update profile to remove resume
              await profileService.updateProfile({
                resumeUrl: null,
                resumeFilename: null
              });
              queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROFILE] });
              Alert.alert('Success', 'Resume deleted successfully!');
            } catch {
              Alert.alert('Error', 'Failed to delete resume');
            }
          }
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

      <ScrollView style={tw`flex-1 p-6`} contentContainerStyle={{ paddingBottom: 40 }}>
        {!resumeUrl ? (
          // Empty State
          <View style={tw`items-center py-20`}>
            <View style={tw`bg-slate-100 p-6 rounded-full items-center justify-center mb-6`}>
              <FileText size={40} color="#CBD5E1" />
            </View>
            <Text style={tw`text-lg font-black text-slate-900 mb-2`}>No documents yet</Text>
            <Text style={tw`text-slate-500 text-center px-10 mb-8`}>Upload your resume to increase your visibility to employers.</Text>
            <Button 
              title={isUploading ? "Uploading..." : "Upload Resume"}
              icon={!isUploading && <Upload size={20} color="#FFF" />}
              style={tw`w-full`}
              textStyle={tw`text-white font-black`}
              onPress={handlePickFile}
              disabled={isUploading}
            />
          </View>
        ) : (
          // Resume Exists
          <View style={tw`space-y-4`}>
            {/* Resume Card */}
            <View style={tw`bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-4`}>
              <View style={tw`flex-row items-center mb-4`}>
                <View style={tw`bg-red-50 p-3 rounded-2xl mr-4`}>
                  <FileText size={24} color="#EF4444" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-black text-slate-900 text-base mb-0.5`}>{resumeFilename}</Text>
                  <Text style={tw`text-slate-400 text-xs font-bold uppercase tracking-widest`}>Resume • PDF</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={tw`flex-row gap-3`}>
                <TouchableOpacity 
                  onPress={handleDownload}
                  style={tw`flex-1 bg-slate-50 py-3 rounded-xl flex-row items-center justify-center border border-slate-200`}
                >
                  <Download size={16} color="#475569" style={tw`mr-2`} />
                  <Text style={tw`font-bold text-slate-600 text-xs uppercase tracking-wide`}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => {
                    setIsRenaming(true);
                    setNewResumeName(resumeFilename.replace('.pdf', ''));
                  }}
                  style={tw`w-12 bg-blue-50 py-3 rounded-xl flex-row items-center justify-center border border-blue-100`}
                >
                  <Edit2 size={16} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={handleDeleteResume}
                  style={tw`w-12 bg-red-50 py-3 rounded-xl flex-row items-center justify-center border border-red-100`}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Rename Modal */}
            {isRenaming && (
              <View style={tw`bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-4`}>
                <Text style={tw`text-lg font-black text-slate-900 mb-4`}>Rename Resume</Text>
                <TextInput
                  style={tw`bg-slate-50 p-4 rounded-xl border border-slate-200 font-bold text-slate-900 mb-4`}
                  value={newResumeName}
                  onChangeText={setNewResumeName}
                  placeholder="Resume name (without .pdf)"
                  placeholderTextColor="#CBD5E1"
                />
                <View style={tw`flex-row gap-3`}>
                  <TouchableOpacity 
                    onPress={() => setIsRenaming(false)}
                    style={tw`flex-1 bg-slate-100 py-3 rounded-xl items-center justify-center`}
                  >
                    <Text style={tw`font-bold text-slate-900`}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={handleRenameResume}
                    disabled={updateFilenameMutation.isPending}
                    style={tw`flex-1 bg-primary py-3 rounded-xl items-center justify-center`}
                  >
                    {updateFilenameMutation.isPending ? (
                      <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                      <Text style={tw`font-bold text-white`}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Update Resume Button */}
            <TouchableOpacity 
              onPress={handlePickFile}
              disabled={isUploading}
              style={tw`bg-slate-900 p-6 rounded-[2rem] flex-row items-center justify-center shadow-xl shadow-slate-200/50 mt-4 ${isUploading ? 'opacity-60' : ''}`}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="#FFF" style={tw`mr-3`} />
              ) : (
                <Upload size={20} color="#FFF" style={tw`mr-3`} />
              )}
              <Text style={tw`font-black text-white uppercase tracking-tight`}>
                {isUploading ? 'Uploading...' : 'Update Resume'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
