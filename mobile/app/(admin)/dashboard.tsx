import React, { useState, useEffect } from 'react';
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
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { tw } from '../../src/lib/tailwind';
import { AdminBottomNav } from '../../src/components/AdminBottomNav';
import { useAuth } from '../../src/context/AuthContext';

const { width } = Dimensions.get('window');

const StatCard = ({ label, value, change, trend, icon: Icon }: any) => {
  const isUp = trend === 'up';
  const isDown = trend === 'down';

  return (
    <View style={tw`bg-white p-5 rounded-[2.5rem] mb-4 shadow-xl shadow-slate-200/50 border border-slate-100`}>
      <View style={tw`flex-row items-center justify-between mb-4`}>
        <View style={tw`h-12 w-12 items-center justify-center rounded-2xl bg-primary/10`}>
          <Icon size={24} color="#014D9F" />
        </View>
        <View style={tw`flex-row items-center px-2.5 py-1 rounded-full ${isUp ? 'bg-green-50' : isDown ? 'bg-red-50' : 'bg-slate-50'}`}>
          {isUp && <ArrowUpRight size={10} color="#15803d" style={tw`mr-1`} />}
          {isDown && <ArrowDownRight size={10} color="#b91c1c" style={tw`mr-1`} />}
          <Text style={tw`text-[9px] font-black uppercase tracking-wider ${isUp ? 'text-green-700' : isDown ? 'text-red-700' : 'text-slate-500'}`}>
            {change || '0%'}
          </Text>
        </View>
      </View>
      <View>

        <Text style={tw`text-slate-400 text-[10px] font-black uppercase tracking-[0.1em]`}>{label}</Text>
        <Text style={tw`text-2xl font-black text-slate-900 tracking-tight`}>{value?.toLocaleString() || '0'}</Text>
      </View>
    </View>
  );
};

export default function AdminDashboardScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth();

  // Check MFA status for admin users
  useEffect(() => {
    if (user?.role?.toUpperCase() === 'ADMIN' && !user.mfaComplete) {
      console.log('[Dashboard] Admin user without MFA, redirecting...');
      router.replace('/(auth)/mfa');
    }
  }, [user]);

  const { data: stats, isLoading: statsLoading, isError: statsError, refetch: refetchStats } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_STATS],
    queryFn: adminService.getStats,
    enabled: !!user?.mfaComplete,
  });

  const { data: chartData, isLoading: chartLoading, isError: chartError, refetch: refetchCharts } = useQuery({
    queryKey: ['ADMIN_CHARTS'],
    queryFn: adminService.getCharts,
    enabled: !!user?.mfaComplete,
  });

  const { data: verifications } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_VERIFICATIONS],
    queryFn: adminService.getVerifications,
    enabled: !!user?.mfaComplete,
  });

  const { data: auditLogs } = useQuery<any>({
    queryKey: ['ADMIN_AUDIT_LOGS'],
    queryFn: () => adminService.getAuditLogs({}),
    enabled: !!user?.mfaComplete,
  });

  if (statsLoading || chartLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-slate-50`}>
        <ActivityIndicator size="large" color="#014D9F" />
      </View>
    );
  }

  // Handle data fetch errors or HTML "ghosting" (status 200 but no .data)
  if (statsError || chartError || !stats?.data) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-slate-50 px-8`}>
        <ShieldAlert size={48} color="#DC2626" style={tw`mb-4`} />
        <Text style={tw`text-xl font-bold text-slate-900 mb-2 text-center`}>System Sync Required</Text>
        <Text style={tw`text-slate-500 text-center mb-6`}>
          The mobile app is receiving an invalid response. This often happens if the API is restricted by server-side security middleware.
        </Text>
        <TouchableOpacity 
          style={tw`bg-[#014D9F] px-8 py-3 rounded-xl`}
          onPress={() => {
            refetchStats();
            refetchCharts();
          }}
        >
          <Text style={tw`text-white font-bold`}>Retry Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const kpis = [
    { label: "Total Users", value: stats?.data?.totalUsers?.value, change: stats?.data?.totalUsers?.change, trend: stats?.data?.totalUsers?.trend, icon: Users },
    { label: "Active Jobs", value: stats?.data?.activeJobs?.value, change: stats?.data?.activeJobs?.change, trend: stats?.data?.activeJobs?.trend, icon: Briefcase },
    { label: "Pending IDs", value: stats?.data?.pendingVerifications?.value, change: stats?.data?.pendingVerifications?.change, trend: stats?.data?.pendingVerifications?.trend, icon: ShieldCheck },
    { label: "Apps Issued", value: stats?.data?.totalApplications?.value, change: stats?.data?.totalApplications?.change, trend: stats?.data?.totalApplications?.trend, icon: ArrowUpRight },
  ];

  // Map backend chart data to Victory format - Ensure values are numbers to avoid NaN errors in SVG paths
  const appsData = chartData?.data?.map((d: any) => ({ 
    x: d.name, 
    y: typeof d.apps === 'number' ? d.apps : 0 
  }))?.filter((d: any) => !isNaN(d.y)) || [];

  const signupsData = chartData?.data?.map((d: any) => ({ 
    x: d.name, 
    y: typeof d.signups === 'number' ? d.signups : 0 
  }))?.filter((d: any) => !isNaN(d.y)) || [];

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      {/* Decorative Blurs */}
      <View style={[tw`absolute top-20 right--20 w-80 h-80 rounded-full bg-primary`, { opacity: 0.05, filter: 'blur(100px)' } as any]} />
      <View style={[tw`absolute bottom-40 left--20 w-80 h-80 rounded-full bg-blue-200`, { opacity: 0.05, filter: 'blur(100px)' } as any]} />

      <ScrollView style={tw`flex-1 px-6 pt-16`} contentContainerStyle={{ paddingBottom: 180 }}>
        {/* Header */}
        <View style={tw`flex-row justify-between items-center mb-10`}>
          <View>
            <Text style={tw`text-primary font-black text-[10px] uppercase tracking-widest mb-1`}>Administrator</Text>
            <View style={tw`flex-row items-center`}>
              <TouchableOpacity 
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                style={tw`p-2 rounded-xl mr-3 bg-slate-100 border border-slate-200`}
              >
                <LayoutDashboard size={22} color="#014D9F" />
              </TouchableOpacity>
              <Text style={tw`text-3xl font-black text-slate-900 tracking-tight`}>Dashboard</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={tw`bg-white px-4 py-2 rounded-full shadow-md flex-row items-center border border-slate-100`}
            onPress={() => router.replace('/(tabs)')}
          >
            <ArrowLeftRight size={16} color="#014D9F" style={tw`mr-2`} />
            <Text style={tw`text-primary font-bold text-xs`}>Seeker</Text>
          </TouchableOpacity>
        </View>

        {/* KPI Grid */}
        <View style={tw`flex-row flex-wrap justify-between`}>
          {kpis.map((kpi, idx) => (
            <View key={idx} style={{ width: (width - 60) / 2 }}>
              <StatCard {...kpi} />
            </View>
          ))}
        </View>

        {/* Chart Section */}
        <View style={tw`bg-white p-6 rounded-[2.5rem] mb-8 shadow-xl shadow-slate-200/40 border border-slate-100`}>
          <Text style={tw`text-lg font-black text-slate-900 mb-6 tracking-tight`}>Application Activity</Text>
          <View style={tw`items-center`}>
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
                  labelComponent={<VictoryTooltip cornerRadius={12} flyoutStyle={{ fill: "white", stroke: "#F1F5F9" }} />}
                />
              }
            >
              <VictoryAxis />
              <VictoryAxis dependentAxis />
              <VictoryArea
                data={appsData}
                style={{ data: { fill: "rgba(1, 77, 159, 0.08)", stroke: "#014D9F", strokeWidth: 3 } }}
                interpolation="monotoneX"
              />
              <VictoryArea
                data={signupsData}
                style={{ data: { fill: "rgba(234, 93, 26, 0.08)", stroke: "#EA5D1A", strokeWidth: 3 } }}
                interpolation="monotoneX"
              />
            </VictoryChart>
          </View>
          <View style={tw`flex-row justify-center gap-x-8 mt-4`}>
            <View style={tw`flex-row items-center`}>
              <View style={tw`w-2 h-2 rounded-full bg-[#014D9F] mr-2`} />
              <Text style={tw`text-[10px] font-black uppercase text-slate-400 tracking-widest`}>Apps</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <View style={tw`w-2 h-2 rounded-full bg-orange-500 mr-2`} />
              <Text style={tw`text-[10px] font-black uppercase text-slate-400 tracking-widest`}>Signups</Text>
            </View>
          </View>
        </View>

        {/* Verification Queue Preview */}
        <View style={tw`bg-white p-7 rounded-[2.5rem] mb-8 shadow-xl shadow-slate-200/40 border border-slate-100`}>
          <View style={tw`flex-row justify-between items-center mb-8`}>
            <Text style={tw`text-xl font-black text-slate-900 tracking-tight`}>Verification Queue</Text>
            <TouchableOpacity 
              onPress={() => router.push('/(admin)/verifications')}
              style={tw`bg-slate-50 px-3 py-1.5 rounded-full`}
            >
              <Text style={tw`text-primary font-black text-[10px] uppercase tracking-widest`}>All</Text>
            </TouchableOpacity>
          </View>
          
          {verifications?.data?.length > 0 ? (
            verifications.data.slice(0, 3).map((item: any, idx: number) => (
              <TouchableOpacity 
                key={idx}
                onPress={() => router.push('/(admin)/verifications')}
                style={tw`flex-row items-center py-4 ${idx !== 2 ? 'border-b border-slate-50' : ''}`}
              >
                <View style={tw`w-14 h-14 bg-slate-50 border border-slate-100 rounded-[1.2rem] items-center justify-center mr-4`}>
                  <Text style={tw`text-slate-400 font-black text-xl`}>{item.user?.name?.[0] || '?'}</Text>
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-slate-900 font-black text-sm`}>{item.user?.name || item.user?.email}</Text>
                  <Text style={tw`text-slate-400 text-[10px] font-bold uppercase tracking-wide mt-1`}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                <View style={tw`bg-slate-50 p-2 rounded-full`}>
                   <ChevronRight size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={tw`items-center py-12`}>
              <View style={tw`h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 mb-4`}>
                 <FileSearch size={32} color="#CBD5E1" />
              </View>
              <Text style={tw`text-slate-400 text-sm font-bold uppercase tracking-widest`}>Queue is empty</Text>
            </View>
          )}
        </View>

        {/* System Audit Preview */}
        <View style={tw`bg-white p-7 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100`}>
          <View style={tw`flex-row justify-between items-center mb-8`}>
            <Text style={tw`text-xl font-black text-slate-900 tracking-tight`}>System Logs</Text>
            <TouchableOpacity 
               onPress={() => router.push('/(admin)/audit')}
               style={tw`bg-slate-50 px-3 py-1.5 rounded-full`}
            >
              <Text style={tw`text-primary font-black text-[10px] uppercase tracking-widest`}>Full Log</Text>
            </TouchableOpacity>
          </View>

          {auditLogs?.data?.length > 0 ? (
            auditLogs.data.slice(0, 5).map((log: any, idx: number) => (
              <View key={idx} style={tw`flex-row items-start mb-6`}>
                <View style={tw`bg-slate-50 p-3 rounded-2xl mr-4 border border-slate-100`}>
                  <ShieldCheck size={16} color="#94A3B8" />
                </View>
                <View style={tw`flex-1`}>
                  <View style={tw`flex-row justify-between mb-1.5`}>
                    <Text style={tw`text-slate-900 font-black text-xs`}>{log.actorAdmin?.email || "System"}</Text>
                    <Text style={tw`text-slate-400 text-[9px] font-black uppercase tracking-tighter`}>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                  <View style={tw`flex-row items-center`}>
                    <View style={tw`bg-white border border-slate-100 px-2 py-0.5 rounded-lg mr-2`}>
                      <Text style={tw`text-[8px] font-black uppercase text-primary tracking-wider`}>{log.action}</Text>
                    </View>
                    <Text style={tw`text-slate-400 text-[10px] font-bold uppercase tracking-tighter`}>on {log.entityType}</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text style={tw`text-slate-400 text-center py-12 font-bold uppercase text-[10px] tracking-widest`}>No recent activity</Text>
          )}
        </View>
      </ScrollView>
      <AdminBottomNav />
    </View>
  );
}
