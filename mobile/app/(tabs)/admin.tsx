import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard, Users, Briefcase, ShieldAlert, CreditCard, ChevronRight } from 'lucide-react-native';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { adminService } from '../../src/services/api/admin';

export default function AdminDashboardScreen() {
  const { data: stats, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_STATS],
    queryFn: () => adminService.getStats(),
  });

  const cards = [
    { label: 'Active Users', value: stats?.activeUsers || '0', icon: Users, color: '#6366F1' },
    { label: 'Live Jobs', value: stats?.liveJobs || '0', icon: Briefcase, color: '#0EA5E9' },
    { label: 'Pending IDs', value: stats?.pendingVerifications || '0', icon: ShieldAlert, color: '#F59E0B' },
    { label: 'Revenue', value: stats?.revenue || '$0', icon: CreditCard, color: '#10B981' },
  ];

  const adminMenu = [
    { label: 'Manage Users', icon: Users, route: 'AdminUsers' },
    { label: 'Job Moderation', icon: Briefcase, route: 'AdminJobs' },
    { label: 'Verify IDs', icon: ShieldAlert, route: 'AdminVerifications' },
    { label: 'Payment Logs', icon: CreditCard, route: 'AdminPayments' },
  ];

  return (
    <ScrollView className="flex-1 bg-background-light px-6 pt-16">
      <View className="flex-row items-center mb-6">
        <View className="bg-primary/10 p-3 rounded-2xl mr-4">
          <LayoutDashboard size={28} color="#0EA5E9" />
        </View>
        <View>
          <Text className="text-2xl font-bold text-gray-900">Admin Panel</Text>
          <Text className="text-gray-500">System overview & stats</Text>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-between mb-8">
        {cards.map((card, idx) => (
          <View 
            key={idx}
            className="bg-white w-[48%] p-5 rounded-3xl shadow-sm mb-4"
          >
            <View className="p-3 rounded-2xl mb-3 self-start" style={{ backgroundColor: card.color + '10' }}>
              <card.icon size={20} color={card.color} />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-1">{card.value}</Text>
            <Text className="text-gray-400 text-xs font-medium uppercase tracking-wider">{card.label}</Text>
          </View>
        ))}
      </View>

      <Text className="text-xl font-bold text-gray-900 mb-4">Management</Text>
      <View className="bg-white rounded-3xl p-2 shadow-sm mb-32">
        {adminMenu.map((item, idx) => (
          <TouchableOpacity 
            key={idx}
            className={`flex-row items-center p-4 ${idx !== adminMenu.length - 1 ? 'border-b border-gray-50' : ''}`}
          >
            <View className="bg-gray-50 p-2 rounded-xl mr-4">
              <item.icon size={20} color="#64748B" />
            </View>
            <Text className="flex-1 text-gray-800 font-medium text-base">{item.label}</Text>
            <ChevronRight size={20} color="#CBD5E1" />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
