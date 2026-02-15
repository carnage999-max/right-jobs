import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { Button } from '../../src/components/ui/Button';
import { User, Settings, ShieldCheck, LogOut, ChevronRight, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const isAdmin = user?.role === 'admin' || user?.role === 'ADMIN';

  const menuItems = [
    { icon: User, label: 'Edit Profile', action: () => {} },
    { icon: FileText, label: 'My Resume', action: () => {} },
    { icon: ShieldCheck, label: 'ID Verification', action: () => {} },
    { icon: Settings, label: 'Settings', action: () => router.push('/settings') },
  ];

  return (
    <ScrollView className="flex-1 bg-background-light px-6 pt-16">
      <View className="items-center mb-10">
        <View className="relative mb-4">
          <View className="w-24 h-24 bg-primary/10 rounded-full items-center justify-center border-4 border-white shadow-sm">
            <User size={48} color="#0EA5E9" />
          </View>
          <TouchableOpacity 
            className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-100"
          >
            <Settings size={16} color="#64748B" />
          </TouchableOpacity>
        </View>
        <Text className="text-2xl font-bold text-gray-900">{user?.name || 'Full Name'}</Text>
        <Text className="text-gray-500 mb-2">{user?.email || 'email@example.com'}</Text>
        <View className="bg-success/10 px-3 py-1 rounded-full">
          <Text className="text-success text-xs font-bold uppercase">Verified</Text>
        </View>
      </View>

      {isAdmin && (
        <TouchableOpacity 
          onPress={() => router.push('/(admin)/dashboard')}
          className="bg-secondary rounded-2xl p-4 mb-6 flex-row items-center shadow-lg"
        >
          <View className="bg-white/20 p-2 rounded-xl mr-4">
            <ShieldCheck size={24} color="#FFF" />
          </View>
          <View className="flex-1">
            <Text className="text-white font-bold text-lg">Admin Mode</Text>
            <Text className="text-white/80 text-sm">Manage users, jobs and more</Text>
          </View>
          <ChevronRight size={20} color="#FFF" />
        </TouchableOpacity>
      )}

      <View className="bg-white rounded-3xl p-2 shadow-sm mb-6">
        {menuItems.map((item, idx) => (
          <TouchableOpacity 
            key={idx}
            onPress={item.action}
            className={`flex-row items-center p-4 ${idx !== menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}
          >
            <View className="bg-gray-50 p-2 rounded-xl mr-4">
              <item.icon size={20} color="#64748B" />
            </View>
            <Text className="flex-1 text-gray-800 font-medium text-base">{item.label}</Text>
            <ChevronRight size={20} color="#CBD5E1" />
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Sign Out"
        onPress={signOut}
        variant="ghost"
        icon={<LogOut size={20} color="#EF4444" />}
        textClassName="text-error"
        className="mb-10"
      />

      <View className="items-center pb-32">
        <Text className="text-gray-300 text-xs">RightJobs Mobile v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
