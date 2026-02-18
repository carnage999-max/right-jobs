import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, Mail } from 'lucide-react-native';
import { tw } from '../../src/lib/tailwind';
import { useAuth } from '../../src/context/AuthContext';
import { Button } from '../../src/components/ui/Button';

export default function PersonalDossierScreen() {
  const router = useRouter();
  const { user } = useAuth();

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
        <Text style={tw`text-xl font-black text-slate-900 tracking-tight`}>Personal Dossier</Text>
      </View>

      <ScrollView style={tw`flex-1 p-6`} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={tw`bg-white p-6 rounded-[2rem] shadow-sm mb-6 border border-slate-100`}>
           <View style={tw`flex-row items-center mb-6`}>
              <View style={tw`h-16 w-16 bg-primary/10 rounded-2xl items-center justify-center mr-4`}>
                 <User size={32} color="#014D9F" />
              </View>
              <View>
                 <Text style={tw`text-lg font-black text-slate-900`}>Identity Profile</Text>
                 <Text style={tw`text-slate-400 text-xs font-bold uppercase tracking-widest`}>Basic Information</Text>
              </View>
           </View>
           
           <View style={tw`space-y-4`}>
              <View>
                 <Text style={tw`text-xs font-bold text-slate-500 uppercase mb-2 ml-1`}>Full Name</Text>
                 <View style={tw`bg-slate-50 p-4 rounded-xl border border-slate-200`}>
                    <Text style={tw`font-bold text-slate-900`}>{user?.name || 'Not set'}</Text>
                 </View>
              </View>
              <View>
                 <Text style={tw`text-xs font-bold text-slate-500 uppercase mb-2 ml-1`}>Email Address</Text>
                 <View style={tw`bg-slate-50 p-4 rounded-xl border border-slate-200 flex-row items-center`}>
                    <Mail size={16} color="#94A3B8" style={tw`mr-2`} />
                    <Text style={tw`font-bold text-slate-900`}>{user?.email || 'Not set'}</Text>
                 </View>
              </View>
           </View>
        </View>

        <View style={tw`bg-blue-50 p-6 rounded-[2rem] border border-blue-100 mb-6`}>
           <Text style={tw`text-blue-900 font-black text-lg mb-2`}>Verified Credentials</Text>
           <Text style={tw`text-blue-700/80 font-medium text-sm leading-relaxed mb-4`}>
              Your identity has been verified through our secure ID check system. Changing your personal dossier may require re-verification.
           </Text>
           <Button 
             title="Request Update" 
             variant="outline" 
             style={tw`bg-white border-blue-200`} 
             textStyle={tw`text-blue-700`}
             onPress={() => {}} 
           />
        </View>
      </ScrollView>
    </View>
  );
}
