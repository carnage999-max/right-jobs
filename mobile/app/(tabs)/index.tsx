import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { Button } from '../../src/components/ui/Button';
import { Briefcase, Bell, CheckCircle } from 'lucide-react-native';

import { tw } from '../../src/lib/tailwind';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ScrollView style={tw`flex-1 bg-white`} contentContainerStyle={tw`px-6 pt-16`}>
      <View style={tw`flex-row justify-between items-center mb-8`}>
        <View>
          <Text style={tw`text-gray-500 text-base`}>Welcome back,</Text>
          <Text style={tw`text-2xl font-bold text-gray-900`}>{user?.name || 'User'}</Text>
        </View>
        <TouchableOpacity style={tw`bg-white p-3 rounded-full shadow-sm`}>
          <Bell size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      <View style={tw`bg-primary rounded-3xl p-6 mb-8 shadow-lg`}>
        <Text style={tw`text-white text-lg font-semibold mb-2`}>Profile Completeness</Text>
        <View style={tw`bg-white/20 h-2 rounded-full mb-4`}>
          <View style={tw`bg-white h-2 rounded-full w-3/4`} />
        </View>
        <Text style={tw`text-white/80 mb-4`}>You're almost there! Complete your profile to get 2x more job offers.</Text>
        <Button 
          title="Complete Profile" 
          onPress={() => router.push('/onboarding')} 
          variant="secondary" 
          style={tw`bg-white`} 
          textStyle={tw`text-primary`}
        />
      </View>

      <Text style={tw`text-xl font-bold text-gray-900 mb-4`}>Quick Actions</Text>
      <View style={tw`flex-row flex-wrap justify-between`}>
        {[
          { icon: Briefcase, label: 'Search Jobs', color: '#014D9F' },
          { icon: CheckCircle, label: 'ID Verify', color: '#10B981' },
        ].map((action, idx) => (
          <TouchableOpacity 
            key={idx}
            style={tw`bg-white w-[48%] p-4 rounded-2xl shadow-sm mb-4 items-center`}
          >
            <View style={[tw`p-3 rounded-xl mb-2`, { backgroundColor: action.color + '20' }]}>
              <action.icon size={24} color={action.color} />
            </View>
            <Text style={tw`font-semibold text-gray-800`}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={tw`text-xl font-bold text-gray-900 mt-4 mb-4`}>Recommended Jobs</Text>
      {/* Skeleton / Job List would go here */}
      <View style={tw`bg-white p-4 rounded-2xl shadow-sm mb-32`}>
        <Text style={tw`text-gray-500 text-center py-8`}>No recommended jobs yet. Start searching!</Text>
      </View>
    </ScrollView>
  );
}
