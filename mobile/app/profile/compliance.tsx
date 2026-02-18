import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ShieldCheck, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react-native';
import { tw } from '../../src/lib/tailwind';
import { useAuth } from '../../src/context/AuthContext';
import { Button } from '../../src/components/ui/Button';

export default function ComplianceStatusScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [status, setStatus] = useState<'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_STARTED'>('NOT_STARTED');

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
        <Text style={tw`text-xl font-black text-slate-900 tracking-tight`}>Compliance & Trust</Text>
      </View>

      <ScrollView style={tw`flex-1 p-6`} contentContainerStyle={{ paddingBottom: 40 }}>
         {status === 'VERIFIED' ? (
            <View style={tw`bg-green-50 p-6 rounded-[2rem] border border-green-100 mb-6 items-center text-center`}>
               <ShieldCheck size={48} color="#10B981" />
               <Text style={tw`text-green-900 font-black text-2xl mt-4 mb-2`}>Identity Verified</Text>
               <Text style={tw`text-green-700/80 font-medium text-sm leading-relaxed text-center px-4 mb-6`}>
                  Your account has passed all security checks. You have full access to premium features.
               </Text>
               <View style={tw`bg-white p-4 rounded-xl shadow-sm w-full flex-row items-center justify-between`}>
                  <Text style={tw`text-xs font-bold text-slate-500 uppercase tracking-widest`}>Trust Score</Text>
                  <Text style={tw`font-black text-green-600 text-lg`}>100/100</Text>
               </View>
            </View>
         ) : status === 'PENDING' ? (
            <View style={tw`bg-amber-50 p-6 rounded-[2rem] border border-amber-100 mb-6 items-center text-center`}>
               <ShieldCheck size={48} color="#F59E0B" />
               <Text style={tw`text-amber-900 font-black text-2xl mt-4 mb-2`}>Verification Pending</Text>
               <Text style={tw`text-amber-700/80 font-medium text-sm leading-relaxed text-center px-4 mb-6`}>
                  Our team is reviewing your documents. This usually takes 24-48 hours.
               </Text>
               <Button 
                 title="Check Status" 
                 variant="outline" 
                 style={tw`w-full bg-white border-amber-200`} 
                 textStyle={tw`text-amber-700`}
                 onPress={() => {}}
                 disabled 
               />
            </View>
         ) : (
            <View style={tw`bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 mb-8 overflow-hidden relative`}>
               <View style={[tw`absolute top--20 right--20 w-60 h-60 rounded-full bg-primary/20`, { filter: 'blur(60px)' } as any]} />
               
               <ShieldAlert size={48} color="#FFF" style={tw`mb-6`} />
               <Text style={tw`text-white font-black text-3xl mb-2 tracking-tighter`}>Verify Your Identity</Text>
               <Text style={tw`text-slate-400 font-medium text-sm leading-relaxed mb-8`}>
                  Secure your account and unlock exclusive job opportunities by completing our ID check.
               </Text>
               
               <Button 
                 title="Start Verification" 
                 style={tw`w-full bg-primary rounded-2xl h-14 shadow-lg shadow-primary/30`} 
                 textStyle={tw`font-black text-white`}
                 icon={<CheckCircle2 size={20} color="#FFF" style={tw`mr-2`} />}
                 onPress={() => router.push('/verify-id' as any)}
               />
            </View>
         )}

         <View style={tw`space-y-4`}>
            <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1`}>Trust Requirements</Text>
            
            <View style={tw`bg-white p-4 rounded-2xl border border-slate-100 flex-row items-center opacity-50`}>
               <CheckCircle2 size={20} color="#10B981" style={tw`mr-4`} />
               <View>
                  <Text style={tw`font-bold text-slate-900 text-sm`}>Email Confirmed</Text>
                  <Text style={tw`text-slate-400 text-[10px] font-bold uppercase tracking-wide`}>Completed</Text>
               </View>
            </View>

            <View style={tw`bg-white p-4 rounded-2xl border border-slate-100 flex-row items-center`}>
               <View style={tw`h-5 w-5 rounded-full border-2 border-slate-200 mr-4`} />
               <View>
                  <Text style={tw`font-bold text-slate-900 text-sm`}>Government ID</Text>
                  <Text style={tw`text-slate-400 text-[10px] font-bold uppercase tracking-wide`}>Required</Text>
               </View>
            </View>

            <View style={tw`bg-white p-4 rounded-2xl border border-slate-100 flex-row items-center`}>
               <View style={tw`h-5 w-5 rounded-full border-2 border-slate-200 mr-4`} />
               <View>
                  <Text style={tw`font-bold text-slate-900 text-sm`}>Selfie Verification</Text>
                  <Text style={tw`text-slate-400 text-[10px] font-bold uppercase tracking-wide`}>Required</Text>
               </View>
            </View>
         </View>

      </ScrollView>
    </View>
  );
}
