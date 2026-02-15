import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/ui/Button';
import { ChevronRight } from 'lucide-react-native';

export const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-8 justify-between py-12">
        <View className="items-center mt-10">
          <View className="w-24 h-24 bg-primary/10 rounded-3xl items-center justify-center mb-6">
            <Image 
              source={require('../../assets/images/logo.png')} 
              className="w-16 h-16"
              resizeMode="contain"
            />
          </View>
          <Text className="text-4xl font-bold text-gray-900 text-center mb-4">
            Find Your <Text className="text-primary">Right</Text> Job
          </Text>
          <Text className="text-gray-500 text-center text-lg leading-6 px-4">
            Connecting talented professionals with the best opportunities across the globe.
          </Text>
        </View>

        <View className="w-full gap-y-4">
          <Button 
            title="Get Started" 
            onPress={() => router.push('/(auth)/signup')}
            size="lg"
            className="rounded-2xl"
            icon={<ChevronRight size={20} color="#FFF" />}
          />
          <TouchableOpacity 
            onPress={() => router.push('/(auth)/login')}
            className="py-4 items-center"
          >
            <Text className="text-gray-600 text-base">
              Already have an account? <Text className="text-primary font-bold">Log In</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View className="items-center">
          <Text className="text-gray-400 text-sm font-bold tracking-widest uppercase">
            RightJobs
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
