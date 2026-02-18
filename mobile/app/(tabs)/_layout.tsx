import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Briefcase, FileText, User, LayoutDashboard } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  Icon: any;
  color: string;
}) {
  const { Icon, color } = props;
  return <Icon size={24} color={color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: '#94A3B8',
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 10,
          marginBottom: 8,
        },
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#0F172A' : '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: colorScheme === 'dark' ? '#1E293B' : '#F1F5F9',
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 12,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon Icon={Home} color={color} />,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color }) => <TabBarIcon Icon={Briefcase} color={color} />,
        }}
      />
      <Tabs.Screen
        name="applications"
        options={{
          title: 'Apps',
          tabBarIcon: ({ color }) => <TabBarIcon Icon={FileText} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon Icon={User} color={color} />,
        }}
      />
      {/* Hide non-functional and extra tabs */}
      <Tabs.Screen
        name="admin"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
