import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useAuth } from '../context/AuthContext';
import { useRouter, usePathname } from 'expo-router';
import { tw } from '../../lib/tailwind';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  MessageSquare, 
  CreditCard, 
  Bell, 
  History,
  LogOut,
} from 'lucide-react-native';

const SidebarItem = ({ icon: Icon, label, route, active, onPress }: any) => (
  <TouchableOpacity 
    onPress={onPress}
    style={tw`flex-row items-center gap-3 px-3 py-3 rounded-xl mb-1 ${active ? 'bg-[#014D9F]/10' : 'bg-transparent'}`}
  >
    <Icon size={20} color={active ? '#014D9F' : '#475569'} />
    <Text style={tw`text-sm font-bold ${active ? 'text-[#014D9F]' : 'text-slate-600'}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

export function AdminSidebar(props: any) {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", route: "/(admin)/dashboard" },
    { icon: Users, label: "Users", route: "/(admin)/users" },
    { icon: Briefcase, label: "Jobs", route: "/(admin)/jobs" },
    { icon: ShieldCheck, label: "ID Verifications", route: "/(admin)/verifications" },
    { icon: MessageSquare, label: "Review Moderation", route: "/(admin)/reviews" },
    { icon: CreditCard, label: "Payments", route: "/(admin)/payments" },
    { icon: Bell, label: "Notifications", route: "/(admin)/notifications" },
    { icon: History, label: "Audit Logs", route: "/(admin)/audit" },
  ];

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`px-6 pt-16 pb-6 border-b border-slate-100`}>
        <View style={tw`flex-row items-center gap-3`}>
          <View style={tw`h-8 w-8 items-center justify-center rounded-lg bg-[#014D9F]`}>
            <ShieldCheck size={20} color="white" />
          </View>
          <Text style={tw`text-xl font-bold tracking-tight text-slate-900`}>RightAdmin</Text>
        </View>
      </View>

      {/* Navigation */}
      <DrawerContentScrollView {...props} contentContainerStyle={tw`pt-4 px-4`}>
        {menuItems.map((item) => (
          <SidebarItem
            key={item.route}
            icon={item.icon}
            label={item.label}
            route={item.route}
            active={pathname === item.route.replace('/(admin)', '') || pathname === item.route}
            onPress={() => router.push(item.route as any)}
          />
        ))}
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={tw`p-4 border-t border-slate-100 pb-8`}>
        <View style={tw`flex-row items-center gap-3 mb-4 px-2`}>
            <View style={tw`h-10 w-10 rounded-full bg-[#014D9F]/10 items-center justify-center border-2 border-[#014D9F]/20`}>
                <Text style={tw`text-[#014D9F] font-bold`}>
                    {user?.name?.[0] || 'A'}
                </Text>
            </View>
            <View style={tw`flex-1`}>
                <Text style={tw`text-sm font-bold text-slate-900`} numberOfLines={1}>
                    {user?.name || 'Admin User'}
                </Text>
                <Text style={tw`text-[10px] font-black text-slate-400 uppercase tracking-widest`}>
                    {user?.role || 'ADMIN'}
                </Text>
            </View>
        </View>

        <TouchableOpacity 
            onPress={async () => {
                await signOut();
                router.replace('/(auth)/welcome');
            }}
            style={tw`flex-row items-center gap-3 px-3 py-3 rounded-xl`}
        >
            <LogOut size={20} color="#DC2626" />
            <Text style={tw`text-sm font-bold text-red-600`}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
