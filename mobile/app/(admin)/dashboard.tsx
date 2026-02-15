import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  ShieldAlert, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronRight, 
  ArrowLeftRight, 
  MessageSquare,
  Clock,
  ShieldCheck,
  FileSearch
} from 'lucide-react-native';
import { VictoryChart, VictoryArea, VictoryAxis, VictoryTooltip, VictoryVoronoiContainer } from 'victory-native';
import { QUERY_KEYS } from '../../src/constants/queryKeys';
import { adminService } from '../../src/services/api/admin';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const StatCard = ({ label, value, change, trend, icon: Icon, color }: any) => {
  const isUp = trend === 'up';
  const isDown = trend === 'down';

  return (
    <View className="bg-white p-6 rounded-[32px] mb-4 shadow-sm border border-gray-100">
      <View className="flex-row items-center justify-between mb-4">
        <View className="p-3 rounded-2xl bg-primary/10">
          <Icon size={24} color="#014D9F" />
        </View>
        <View className={`flex-row items-center px-2.5 py-1 rounded-full ${isUp ? 'bg-success/10' : isDown ? 'bg-error/10' : 'bg-gray-100'}`}>
          {isUp && <ArrowUpRight size={12} color="#10B981" className="mr-1" />}
          {isDown && <ArrowDownRight size={12} color="#EF4444" className="mr-1" />}
          <Text className={`text-[10px] font-black uppercase tracking-wider ${isUp ? 'text-success' : isDown ? 'text-error' : 'text-gray-500'}`}>
            {change || '0%'}
          </Text>
        </View>
      </View>
      <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{label}</Text>
      <Text className="text-3xl font-black text-gray-900">{value?.toLocaleString() || '0'}</Text>
    </View>
  );
};

export default function AdminDashboardScreen() {
  const router = useRouter();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_STATS],
    queryFn: adminService.getStats,
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['ADMIN_CHARTS'],
    queryFn: adminService.getCharts,
  });

  const { data: verifications } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_VERIFICATIONS],
    queryFn: adminService.getVerifications,
  });

  const { data: auditLogs } = useQuery({
    queryKey: ['ADMIN_AUDIT_LOGS'],
    queryFn: adminService.getAuditLogs,
  });

  if (statsLoading || chartLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background-light">
        <ActivityIndicator size="large" color="#014D9F" />
      </View>
    );
  }

  const kpis = [
    { label: "Total Users", value: stats?.data?.totalUsers?.value, change: stats?.data?.totalUsers?.change, trend: stats?.data?.totalUsers?.trend, icon: Users },
    { label: "Active Jobs", value: stats?.data?.activeJobs?.value, change: stats?.data?.activeJobs?.change, trend: stats?.data?.activeJobs?.trend, icon: Briefcase },
    { label: "Pending IDs", value: stats?.data?.pendingVerifications?.value, change: stats?.data?.pendingVerifications?.change, trend: stats?.data?.pendingVerifications?.trend, icon: ShieldAlert },
    { label: "Applications", value: stats?.data?.totalApplications?.value, change: stats?.data?.totalApplications?.change, trend: stats?.data?.totalApplications?.trend, icon: ArrowUpRight },
  ];

  // Map backend chart data to Victory format
  const appsData = chartData?.data?.map((d: any) => ({ x: d.name, y: d.apps })) || [];
  const signupsData = chartData?.data?.map((d: any) => ({ x: d.name, y: d.signups })) || [];

  return (
    <ScrollView className="flex-1 bg-background-light px-6 pt-16" contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Header */}
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">Overview</Text>
          <View className="flex-row items-center">
            <View className="bg-indigo-600 p-2 rounded-xl mr-3">
              <LayoutDashboard size={20} color="#FFF" />
            </View>
            <Text className="text-2xl font-black text-gray-900">Dashboard</Text>
          </View>
        </View>
        <TouchableOpacity 
          className="bg-white px-4 py-2 rounded-2xl shadow-sm flex-row items-center border border-gray-100"
          onPress={() => router.replace('/(tabs)/profile')}
        >
          <ArrowLeftRight size={18} color="#014D9F" className="mr-2" />
          <Text className="text-primary font-bold text-sm">Seeker Mode</Text>
        </TouchableOpacity>
      </View>

      {/* KPI Grid - Row-based for better mobile flow */}
      <View className="flex-row flex-wrap justify-between">
        {kpis.map((kpi, idx) => (
          <View key={idx} style={{ width: (width - 60) / 2 }}>
            <StatCard {...kpi} />
          </View>
        ))}
      </View>

      {/* Chart Section */}
      <View className="bg-white p-6 rounded-[32px] mb-8 shadow-sm border border-gray-100">
        <Text className="text-lg font-black text-gray-900 mb-4">Application Activity</Text>
        <View className="items-center">
          <VictoryChart
            width={width - 80}
            height={220}
            padding={{ top: 20, bottom: 40, left: 40, right: 20 }}
            theme={{
              axis: {
                style: {
                  axis: { stroke: "transparent" },
                  grid: { stroke: "#F1F5F9" },
                  tickLabels: { fill: "#94A3B8", fontSize: 10, fontWeight: "bold" }
                }
              }
            }}
            containerComponent={
              <VictoryVoronoiContainer
                labels={({ datum }: { datum: any }) => `${datum.x}: ${datum.y}`}
                labelComponent={<VictoryTooltip cornerRadius={8} flyoutStyle={{ fill: "white", stroke: "#E2E8F0" }} />}
              />
            }
          >
            <VictoryAxis />
            <VictoryAxis dependentAxis />
            <VictoryArea
              data={appsData}
              style={{ data: { fill: "rgba(1, 77, 159, 0.1)", stroke: "#014D9F", strokeWidth: 3 } }}
              interpolation="monotoneX"
            />
            <VictoryArea
              data={signupsData}
              style={{ data: { fill: "rgba(234, 93, 26, 0.1)", stroke: "#EA5D1A", strokeWidth: 3 } }}
              interpolation="monotoneX"
            />
          </VictoryChart>
        </View>
        <View className="flex-row justify-center gap-x-6 mt-2">
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-primary mr-2" />
            <Text className="text-xs font-bold text-gray-500">Apps</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
            <Text className="text-xs font-bold text-gray-500">Signups</Text>
          </View>
        </View>
      </View>

      {/* Verification Queue Preview */}
      <View className="bg-white p-6 rounded-[32px] mb-8 shadow-sm border border-gray-100">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-lg font-black text-gray-900">Verification Queue</Text>
          <TouchableOpacity onPress={() => router.push('/(admin)/verifications')}>
            <Text className="text-primary font-bold text-xs uppercase tracking-widest">View All</Text>
          </TouchableOpacity>
        </View>
        
        {verifications?.data?.length > 0 ? (
          verifications.data.slice(0, 3).map((item: any, idx: number) => (
            <TouchableOpacity 
              key={idx}
              onPress={() => router.push('/(admin)/verifications')}
              className={`flex-row items-center py-4 ${idx !== 2 ? 'border-b border-gray-50' : ''}`}
            >
              <View className="w-12 h-12 bg-gray-100 rounded-2xl items-center justify-center mr-4">
                <Text className="text-gray-400 font-black text-lg">{item.user?.name?.[0] || '?'}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-sm">{item.user?.name || item.user?.email}</Text>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">{new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
              <ChevronRight size={18} color="#CBD5E1" />
            </TouchableOpacity>
          ))
        ) : (
          <View className="items-center py-8">
            <FileSearch size={32} color="#CBD5E1" className="mb-2" />
            <Text className="text-gray-400 text-sm font-bold">Queue is empty</Text>
          </View>
        )}
      </View>

      {/* System Audit Preview */}
      <View className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-lg font-black text-gray-900">System Activity</Text>
          <TouchableOpacity onPress={() => router.push('/(admin)/audit')}>
            <Text className="text-primary font-bold text-xs uppercase tracking-widest">Full Log</Text>
          </TouchableOpacity>
        </View>

        {auditLogs?.data?.length > 0 ? (
          auditLogs.data.slice(0, 5).map((log: any, idx: number) => (
            <View key={idx} className="flex-row items-start mb-6">
              <View className="bg-primary/10 p-2 rounded-xl mr-4">
                <ShieldCheck size={16} color="#014D9F" />
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-gray-900 font-bold text-sm">{log.actorAdmin?.email || "System"}</Text>
                  <Text className="text-gray-400 text-[10px] font-bold mt-1">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
                <View className="flex-row items-center">
                  <View className="bg-gray-100 px-2 py-0.5 rounded-md mr-2">
                    <Text className="text-[9px] font-black uppercase text-gray-500 tracking-wider">{log.action}</Text>
                  </View>
                  <Text className="text-gray-500 text-xs">on {log.entityType}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-gray-400 text-center py-8">No recent activity</Text>
        )}
      </View>
    </ScrollView>
  );
}
