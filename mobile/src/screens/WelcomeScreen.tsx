import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';
import { ChevronRight, Globe, Lock, Rocket } from 'lucide-react-native';
import { tw } from '../lib/tailwind';

const { width } = Dimensions.get('window');

export const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`flex-1 px-8 justify-between py-10`}>
        {/* Decorative Background Element */}
        <View style={[tw`absolute top-0 right-0 w-64 h-64 rounded-full bg-primary`, { opacity: 0.03, transform: [{ translateX: 100 }, { translateY: -100 }] }]} />
        
        <View style={tw`items-center mt-12`}>
          <Image 
            source={require('../../assets/images/logo-nobg.png')} 
            style={tw`w-48 h-24 mb-10`}
            resizeMode="contain"
          />
          
          <View style={tw`w-full space-y-8 mb-10`}>
             <View style={tw`flex-row items-center gap-x-4 mb-6`}>
                <View style={tw`w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center`}>
                    <Globe size={24} color="#014D9F" />
                </View>
                <View style={tw`flex-1`}>
                   <Text style={tw`text-lg font-bold text-gray-900`}>Global Opportunities</Text>
                   <Text style={tw`text-gray-500`}>Access elite jobs from top companies worldwide.</Text>
                </View>
             </View>

             <View style={tw`flex-row items-center gap-x-4 mb-6`}>
                <View style={tw`w-12 h-12 rounded-2xl bg-secondary/10 items-center justify-center`}>
                    <Lock size={24} color="#EA5D1A" />
                </View>
                <View style={tw`flex-1`}>
                   <Text style={tw`text-lg font-bold text-gray-900`}>Verified Profiles</Text>
                   <Text style={tw`text-gray-500`}>Direct access to decision makers with ID verification.</Text>
                </View>
             </View>

             <View style={tw`flex-row items-center gap-x-4`}>
                <View style={tw`w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center`}>
                    <Rocket size={24} color="#014D9F" />
                </View>
                <View style={tw`flex-1`}>
                   <Text style={tw`text-lg font-bold text-gray-900`}>Fast Application</Text>
                   <Text style={tw`text-gray-500`}>Apply with a single tap using your smart profile.</Text>
                </View>
             </View>
          </View>

          <Text style={tw`text-3xl font-black text-gray-900 text-center leading-tight mb-2`}>
            Find Your <Text style={tw`text-primary`}>Right</Text> Job.
          </Text>
          <Text style={tw`text-gray-400 text-center font-medium px-4`}>
            The most secure and transparent platform for elite hiring.
          </Text>
        </View>

        <View style={tw`w-full gap-y-4 mb-6`}>
          <Button 
            title="Get Started Now" 
            onPress={() => router.push('/(auth)/signup' as any)}
            style={tw`rounded-2xl h-16 shadow-lg shadow-primary/20`}
            icon={<ChevronRight size={20} color="#FFF" />}
          />
          <TouchableOpacity 
            onPress={() => router.push('/(auth)/login' as any)}
            style={tw`py-4 items-center`}
          >
            <Text style={tw`text-gray-600 text-base font-medium`}>
              Already a member? <Text style={tw`text-primary font-black`}>Log In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
