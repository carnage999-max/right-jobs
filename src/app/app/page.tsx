"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Bookmark,
  Loader2,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

export default function AppDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true);
      try {
        const [statsResp, appsResp, jobsResp] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/applications"),
          fetch("/api/jobs")
        ]);

        const statsData = await statsResp.json();
        const appsData = await appsResp.json();
        const jobsData = await jobsResp.json();

        if (statsData.ok) setStats(statsData.stats);
        if (appsData.ok) setApplications(appsData.data.slice(0, 3));
        if (jobsData.ok) setRecommendedJobs(jobsData.jobs.slice(0, 2));
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (session) {
      fetchDashboardData();
    }
  }, [session]);

  const dashboardStats = [
    { label: "Active Applications", value: stats?.applications || 0, icon: Briefcase, color: "text-blue-600" },
    { label: "Skills in Profile", value: stats?.skillsCount || 0, icon: Sparkles, color: "text-orange-600" },
    { label: "Available Positions", value: stats?.availableJobs || 0, icon: CheckCircle2, color: "text-green-600" },
  ];

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 animate-in fade-in duration-500">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Welcome back, <span className="text-primary italic">{session?.user?.name || session?.user?.email?.split('@')[0]}!</span>
          </h1>
          <p className="text-slate-500 font-medium tracking-tight">Here's what's happening with your progression today.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="ios-button" asChild>
             <Link href="/profile">View Profile</Link>
           </Button>
           <Button className="ios-button" asChild>
             <Link href="/jobs">Browse Jobs</Link>
           </Button>
        </div>
      </div>

      {/* Verification Banner */}
      {!stats?.isVerified && (
        <div className="mb-10 rounded-[2rem] bg-amber-50 border border-amber-100 p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 leading-tight">Verify your identity</h3>
              <p className="text-sm text-slate-600 font-medium">Complete verification to unlock premium applications and build trust.</p>
            </div>
          </div>
          <Button size="sm" className="ios-button bg-amber-600 hover:bg-amber-700 text-white" asChild>
            <Link href="/verify-id">Start Verification</Link>
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="mb-10 grid gap-6 sm:grid-cols-3">
        {dashboardStats.map((stat) => (
          <Card key={stat.label} className="ios-card shadow-xl shadow-slate-100/50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn("h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900">{stat.value}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Recent Applications */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight text-slate-900">Recent Applications</h2>
            <Link href="/applications" className="text-sm font-bold text-primary hover:underline">View all activity</Link>
          </div>
          <div className="space-y-4">
            {applications.length > 0 ? applications.map((app) => (
              <Card key={app.id} className="ios-card hover:scale-[1.01] transition-transform">
                <CardContent className="p-5">
                   <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                         <div className="h-12 w-12 rounded-lg bg-primary/5 flex items-center justify-center font-black text-primary text-xl uppercase">
                            {app.job.companyName[0]}
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-900 tracking-tight">{app.job.title}</h4>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{app.job.companyName}</p>
                            <div className="mt-2 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                               <span className="flex items-center gap-1 text-slate-400"><Clock className="h-3.5 w-3.5" /> {formatDate(app.createdAt)}</span>
                               <span className={cn(
                                 "flex items-center gap-1",
                                 app.status === "PENDING" ? "text-amber-500" : "text-primary"
                               )}>
                                 <CheckCircle2 className="h-3.5 w-3.5" /> {app.status}
                               </span>
                            </div>
                         </div>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/jobs/${app.job.id}`}><ArrowRight className="h-4 w-4" /></Link>
                      </Button>
                   </div>
                </CardContent>
              </Card>
            )) : (
              <div className="py-12 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                <Briefcase className="h-10 w-10 mb-3 opacity-20" />
                <p className="font-bold">No applications yet</p>
                <Link href="/jobs" className="text-sm font-bold text-primary mt-1 hover:underline">Find your first job</Link>
              </div>
            )}
          </div>
        </section>

        {/* Recommended Jobs */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight text-slate-900">Hot Openings</h2>
            <Link href="/jobs" className="text-sm font-bold text-primary hover:underline">Explore all</Link>
          </div>
          <div className="space-y-4">
            {recommendedJobs.length > 0 ? recommendedJobs.map((job) => (
              <Card key={job.id} className="ios-card bg-slate-900 text-white border-none shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-colors">
                <CardContent className="p-5">
                   <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                         <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center font-black text-white text-xl uppercase">
                            {job.companyName[0]}
                         </div>
                         <div>
                            <h4 className="font-bold text-white tracking-tight leading-tight">{job.title}</h4>
                            <p className="text-sm font-medium text-slate-400">{job.companyName}</p>
                            <div className="mt-2 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                               <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                               <span className="text-primary">{job.salaryRange || 'Competitive'}</span>
                            </div>
                         </div>
                      </div>
                      <Button asChild variant="ghost" size="sm" className="ios-button hover:bg-white/10 text-white font-bold h-9">
                        <Link href={`/jobs/${job.id}`}>View</Link>
                      </Button>
                   </div>
                </CardContent>
              </Card>
            )) : (
               <div className="py-12 border-2 border-dashed rounded-[2rem] border-slate-700 bg-slate-900/50 flex flex-col items-center justify-center text-slate-600">
                 <Sparkles className="h-10 w-10 mb-3 opacity-20" />
                 <p className="font-bold">Collecting roles...</p>
               </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
