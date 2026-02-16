import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';
import { ArrowRight, Globe, ShieldCheck, Zap, Briefcase } from 'lucide-react-native';
import { tw } from '../lib/tailwind';

const { width } = Dimensions.get('window');

export const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tw`flex-grow`}>
        {/* Decorative Background Elements */}
        <View style={[tw`absolute top--20 right--20 w-80 h-80 rounded-full bg-[#014D9F]`, { opacity: 0.1, filter: 'blur(80px)' } as any]} />
        <View style={[tw`absolute top-1/2 left--20 w-64 h-64 rounded-full bg-orange-200`, { opacity: 0.1, filter: 'blur(80px)' } as any]} />
        
        <View style={tw`flex-1 px-6 justify-between py-10`}>
          <View style={tw`items-center mt-6`}>
            {/* Logo Section */}
            <View style={tw`flex-row items-center gap-2 mb-12`}>
              <View style={tw`h-8 w-8 flex items-center justify-center rounded-lg bg-[#014D9F] shadow-lg shadow-[#014D9F40]`}>
                <Briefcase size={16} color="#FFF" />
              </View>
              <Text style={tw`text-lg font-bold tracking-tighter text-slate-900 uppercase`}>RIGHT JOBS</Text>
            </View>

            {/* Hero Text */}
            <View style={tw`items-center mb-10`}>
              <Text style={tw`text-5xl font-black text-slate-900 text-center leading-[1.1] tracking-tighter`}>
                The <Text style={tw`text-[#014D9F] italic`}>Right</Text> Job, {'\n'}Right Now.
              </Text>
              <Text style={tw`mt-6 text-lg text-slate-600 font-medium text-center px-4`}>
                Trust-first hiring for verified talent and serious employers.
              </Text>
            </View>
            
            {/* Feature Cards / List */}
            <View style={tw`w-full space-y-6 mb-10`}>
               {[
                 { icon: Globe, label: 'Global Opportunities', color: '#014D9F', desc: 'Access elite jobs from top companies worldwide.' },
                 { icon: ShieldCheck, label: 'Security You Can Trust', color: '#10B981', desc: 'Mandatory ID verification for all employers.' },
                 { icon: Zap, label: 'Fast Application', color: '#EA5D1A', desc: 'Apply with a single tap using your smart profile.' }
               ].map((feature, idx) => (
                 <View key={idx} style={tw`flex-row items-start gap-x-4 mb-6`}>
                    <View style={[tw`w-12 h-12 rounded-2xl items-center justify-center shadow-sm`, { backgroundColor: feature.color + '15' }]}>
                        <feature.icon size={22} color={feature.color} />
                    </View>
                    <View style={tw`flex-1 pt-1`}>
                       <Text style={tw`text-base font-bold text-slate-900`}>{feature.label}</Text>
                       <Text style={tw`text-slate-500 text-sm mt-0.5 leading-5`}>{feature.desc}</Text>
                    </View>
                 </View>
               ))}
            </View>
          </View>

          <View style={tw`w-full gap-y-4`}>
            <Button 
              title="Browse Elite Jobs" 
              onPress={() => router.push('/(auth)/signup' as any)}
              style={tw`rounded-2xl h-16 bg-[#014D9F] shadow-xl shadow-[#014D9F40]`}
              textStyle={tw`text-xl font-bold text-white`}
              icon={<ArrowRight size={22} color="#FFF" />}
            />
            
            <TouchableOpacity 
              onPress={() => router.push('/(auth)/login' as any)}
              style={tw`py-4 items-center`}
            >
              <Text style={tw`text-slate-500 text-base font-medium`}>
                Already a member? <Text style={tw`text-[#014D9F] font-black`}>Sign In</Text>
              </Text>
            </TouchableOpacity>
            
            <View style={tw`items-center`}>
              <View style={tw`bg-slate-100 px-3 py-1 rounded-full`}>
                <Text style={tw`text-[10px] text-slate-400 font-bold uppercase tracking-widest`}>Authorized Access Only</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
