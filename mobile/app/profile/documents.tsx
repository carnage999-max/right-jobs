import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, FileText, Upload, Trash2, Download, RefreshCw } from 'lucide-react-native';
import { tw } from '../../src/lib/tailwind';
import { Button } from '../../src/components/ui/Button';
import { useQuery } from '@tanstack/react-query';
import { profileService } from '../../src/services/api/profile';
import { QUERY_KEYS } from '../../src/constants/queryKeys';

export default function ResumeDocumentsScreen() {
  const router = useRouter();
  
  const { data: profileData, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => profileService.getProfile(),
  });

  const profile = profileData?.data;
  const resumeUrl = profile?.resumeUrl;
  const resumeFilename = profile?.resumeFilename || 'My_Resume.pdf';

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

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      {/* Header */}
      <View style={tw`bg-white pt-12 pb-4 px-6 border-b border-slate-100 flex-row items-center`}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={tw`p-2 -ml-2 mr-4 rounded-full hover:bg-slate-100`}
        >
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-black text-slate-900 tracking-tight`}>Resume & Files</Text>
      </View>

      <ScrollView style={tw`flex-1 p-6`} contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
           <RefreshCw size={24} color="#014D9F" style={tw`self-center mb-4`} onPress={() => refetch()} />
        }
      >
         {!resumeUrl ? (
            <View style={tw`items-center py-20`}>
               <View style={tw`bg-slate-100 p-6 rounded-full items-center justify-center mb-6`}>
                  <FileText size={40} color="#CBD5E1" />
               </View>
               <Text style={tw`text-lg font-black text-slate-900 mb-2`}>No documents yet</Text>
               <Text style={tw`text-slate-500 text-center px-10 mb-8`}>Upload your resume to increase your visibility to employers.</Text>
               <Button title="Upload Resume" icon={<Upload size={20} color="#FFF" />} style={tw`w-full`} onPress={() => {}} />
            </View>
         ) : (
            <View style={tw`space-y-4`}>
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
                    
                    <View style={tw`flex-row gap-3`}>
                        <TouchableOpacity 
                            onPress={handleDownload}
                            style={tw`flex-1 bg-slate-50 py-3 rounded-xl flex-row items-center justify-center border border-slate-200`}
                        >
                            <Download size={16} color="#475569" style={tw`mr-2`} />
                            <Text style={tw`font-bold text-slate-600 text-xs uppercase tracking-wide`}>Download</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={tw`w-12 bg-red-50 py-3 rounded-xl flex-row items-center justify-center border border-red-100`}>
                            <Trash2 size={16} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={tw`bg-slate-900 p-6 rounded-[2rem] flex-row items-center justify-center shadow-xl shadow-slate-200/50 mt-4`}>
                   <Upload size={20} color="#FFF" style={tw`mr-3`} />
                   <Text style={tw`font-black text-white uppercase tracking-tight`}>Update Resume</Text>
                </TouchableOpacity>
            </View>
         )}
      </ScrollView>
    </View>
  );
}
