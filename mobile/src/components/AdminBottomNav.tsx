import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useNavigation, usePathname, useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Menu 
} from 'lucide-react-native';
import { tw } from '../lib/tailwind';

export function AdminBottomNav() {
  const navigation = useNavigation();
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { 
      name: 'Dashboard', 
      route: '/(admin)/dashboard', 
      icon: LayoutDashboard 
    },
    { 
      name: 'Users', 
      route: '/(admin)/users', 
      icon: Users 
    },
    { 
      name: 'Jobs', 
      route: '/(admin)/jobs', 
      icon: Briefcase 
    },
    { 
      name: 'Menu', 
      route: null, 
      icon: Menu,
      action: () => navigation.dispatch(DrawerActions.openDrawer())
    },
  ];

  return (
    <View style={tw`absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-6 pt-2 px-4`}>
      <View style={tw`flex-row justify-around items-center`}>
        {tabs.map((tab) => {
          const isActive = pathname === tab.route || pathname.startsWith(tab.route || '');
          const Icon = tab.icon;
          
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => {
                if (tab.action) {
                  tab.action();
                } else if (tab.route) {
                  router.push(tab.route as any);
                }
              }}
              style={tw`flex-1 items-center py-2`}
            >
              <View style={tw`${isActive && tab.route ? 'bg-[#014D9F]/10' : 'bg-transparent'} p-2 rounded-xl`}>
                <Icon 
                  size={24} 
                  color={isActive && tab.route ? '#014D9F' : '#64748B'} 
                />
              </View>
              <Text style={tw`text-[10px] font-bold mt-1 ${isActive && tab.route ? 'text-[#014D9F]' : 'text-slate-500'}`}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
