import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, Users, Briefcase, ShieldAlert, MessageSquare, CreditCard, Bell, History } from 'lucide-react-native';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';

function TabBarIcon(props: {
  Icon: any;
  color: string;
}) {
  const { Icon, color } = props;
  return <Icon size={20} color={color} />;
}

export default function AdminTabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#014D9F', 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1E293B' : '#FFFFFF',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          position: 'absolute',
          bottom: 15,
          left: 10,
          right: 10,
          height: 60,
          borderRadius: 30,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
        }
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dash',
          tabBarIcon: ({ color }) => <TabBarIcon Icon={LayoutDashboard} color={color} />,
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: 'Users',
          tabBarIcon: ({ color }) => <TabBarIcon Icon={Users} color={color} />,
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
        name="verifications"
        options={{
          title: 'Verify',
          tabBarIcon: ({ color }) => <TabBarIcon Icon={ShieldAlert} color={color} />,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Pay',
          tabBarIcon: ({ color }) => <TabBarIcon Icon={CreditCard} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reviews"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="audit"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
