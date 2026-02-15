import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { Button } from '../../src/components/ui/Button';
import { Briefcase, Bell, CheckCircle } from 'lucide-react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background-light px-6 pt-16">
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-gray-500 text-base">Welcome back,</Text>
          <Text className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</Text>
        </View>
        <TouchableOpacity className="bg-white p-3 rounded-full shadow-sm">
          <Bell size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      <View className="bg-primary rounded-3xl p-6 mb-8 shadow-lg">
        <Text className="text-white text-lg font-semibold mb-2">Profile Completeness</Text>
        <View className="bg-white/20 h-2 rounded-full mb-4">
          <View className="bg-white h-2 rounded-full w-3/4" />
        </View>
        <Text className="text-white/80 mb-4">You're almost there! Complete your profile to get 2x more job offers.</Text>
        <Button 
          title="Complete Profile" 
          onPress={() => router.push('/onboarding')} 
          variant="secondary" 
          className="bg-white" 
          textClassName="text-primary"
        />
      </View>

      <Text className="text-xl font-bold text-gray-900 mb-4">Quick Actions</Text>
      <View className="flex-row flex-wrap justify-between">
        {[
          { icon: Briefcase, label: 'Search Jobs', color: '#014D9F' },
          { icon: CheckCircle, label: 'ID Verify', color: '#10B981' },
        ].map((action, idx) => (
          <TouchableOpacity 
            key={idx}
            className="bg-white w-[48%] p-4 rounded-2xl shadow-sm mb-4 items-center"
          >
            <View className="p-3 rounded-xl mb-2" style={{ backgroundColor: action.color + '20' }}>
              <action.icon size={24} color={action.color} />
            </View>
            <Text className="font-semibold text-gray-800">{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-xl font-bold text-gray-900 mt-4 mb-4">Recommended Jobs</Text>
      {/* Skeleton / Job List would go here */}
      <View className="bg-white p-4 rounded-2xl shadow-sm mb-32">
        <Text className="text-gray-500 text-center py-8">No recommended jobs yet. Start searching!</Text>
      </View>
    </ScrollView>
  );
}
