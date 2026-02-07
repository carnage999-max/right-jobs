"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Briefcase, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  MessageSquare,
  Loader2,
  FileSearch
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

const chartData = [
  { name: 'Mon', apps: 400, jobs: 240 },
  { name: 'Tue', apps: 300, jobs: 138 },
  { name: 'Wed', apps: 200, jobs: 980 },
  { name: 'Thu', apps: 278, jobs: 390 },
  { name: 'Fri', apps: 189, jobs: 480 },
  { name: 'Sat', apps: 239, jobs: 380 },
  { name: 'Sun', apps: 349, jobs: 430 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsResp, verifResp, logsResp, chartResp] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/verifications"),
          fetch("/api/admin/audit-logs"),
          fetch("/api/admin/charts")
        ]);

        const [statsData, verifData, logsData, chartDataJson] = await Promise.all([
          statsResp.json(),
          verifResp.json(),
          logsResp.json(),
          chartResp.json()
        ]);

        if (statsData.ok) setStats(statsData.data);
        if (verifData.ok) setVerifications(verifData.data);
        if (logsData.ok) setAuditLogs(logsData.data);
        if (chartDataJson.ok) setChartData(chartDataJson.data);
      } catch (error) {
        toast.error("Failed to refresh dashboard data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  const kpiCards = [
    { label: "Total Users", value: stats?.totalUsers?.value, change: stats?.totalUsers?.change, trend: stats?.totalUsers?.trend, icon: Users },
    { label: "Active Jobs", value: stats?.activeJobs?.value, change: stats?.activeJobs?.change, trend: stats?.activeJobs?.trend, icon: Briefcase },
    { label: "Pending Verifications", value: stats?.pendingVerifications?.value, change: stats?.pendingVerifications?.change, trend: stats?.pendingVerifications?.trend, icon: ShieldCheck },
    { label: "Total Applications", value: stats?.totalApplications?.value, change: stats?.totalApplications?.change, trend: stats?.totalApplications?.trend, icon: ArrowUpRight },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((stat) => (
          <Card key={stat.label} className="ios-card overflow-hidden shadow-lg shadow-slate-200/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full",
                  stat.trend === "up" ? "bg-green-100 text-green-700" : stat.trend === "down" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"
                )}>
                  {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : stat.trend === "down" ? <ArrowDownRight className="h-3 w-3" /> : null}
                  {stat.change}
                </div>
              </div>
              <div className="space-y-1">
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                 <h3 className="text-3xl font-black tracking-tight text-slate-900">{stat.value?.toLocaleString()}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="ios-card shadow-lg shadow-slate-200/50">
          <CardHeader>
             <CardTitle className="text-lg font-black tracking-tight">Application activity</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#014D9F" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#014D9F" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EA5D1A" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#EA5D1A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px'}} 
                    itemStyle={{fontWeight: 800, fontSize: '12px'}}
                  />
                  <Area type="monotone" dataKey="apps" stroke="#014D9F" name="Applications" fillOpacity={1} fill="url(#colorApps)" strokeWidth={3} dot={{r: 4, fill: '#014D9F', strokeWidth: 2, stroke: '#fff'}} />
                  <Area type="monotone" dataKey="signups" stroke="#EA5D1A" name="New Signups" fillOpacity={1} fill="url(#colorSignups)" strokeWidth={3} dot={{r: 4, fill: '#EA5D1A', strokeWidth: 2, stroke: '#fff'}} />
                </AreaChart>
              </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="ios-card shadow-lg shadow-slate-200/50">
          <CardHeader>
             <CardTitle className="text-lg font-black tracking-tight">Verification Queue</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="space-y-6">
                {verifications.length > 0 ? verifications.map((item) => (
                  <div key={item.id} className="flex items-center justify-between group">
                     <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                           {item.user.name?.[0] || "?"}
                        </div>
                        <div>
                           <p className="text-sm font-black text-slate-900">{item.user.name || item.user.email}</p>
                           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              {new Date(item.createdAt).toLocaleDateString()}
                           </p>
                        </div>
                     </div>
                     <Button size="sm" variant="outline" className="ios-button h-9 px-4 font-bold border-2" asChild>
                        <Link href={`/admin/verifications/${item.id}`}>Review</Link>
                     </Button>
                  </div>
                )) : (
                  <div className="py-10 text-center space-y-4">
                     <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300">
                        <FileSearch className="h-6 w-6" />
                     </div>
                     <p className="text-sm font-bold text-slate-400">Queue is empty</p>
                  </div>
                )}
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card className="ios-card shadow-lg shadow-slate-200/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 py-4">
             <CardTitle className="text-lg font-black tracking-tight">System Audit Logs</CardTitle>
             <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 font-black text-xs uppercase tracking-widest" asChild>
                <Link href="/admin/audit-logs">View full log</Link>
             </Button>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-slate-50/50 text-[10px] uppercase text-slate-400 font-black border-b tracking-[0.2em]">
                      <tr>
                         <th className="px-8 py-4">Administrator</th>
                         <th className="px-8 py-4">Action</th>
                         <th className="px-8 py-4">Entity</th>
                         <th className="px-8 py-4 text-right">Timestamp</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y text-sm">
                      {auditLogs.length > 0 ? auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-5 font-bold text-slate-900">{log.actorAdmin?.email || "System"}</td>
                           <td className="px-8 py-5">
                              <Badge variant="outline" className="rounded-lg font-black text-[9px] uppercase tracking-widest bg-white border-2">{log.action}</Badge>
                           </td>
                           <td className="px-8 py-5 text-slate-500 font-medium">
                              {log.entityType}:<span className="text-slate-900 font-bold ml-1">{log.entityId.slice(0, 8)}</span>
                           </td>
                           <td className="px-8 py-5 text-slate-400 font-bold text-xs text-right">
                              {new Date(log.createdAt).toLocaleString()}
                           </td>
                        </tr>
                      )) : (
                        <tr>
                           <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-bold">No recent activities found.</td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </CardContent>
      </Card>
    </div>
  );
}

