"use client";

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
  Bookmark
} from "lucide-react";
import Link from "next/link";

export default function AppDashboard() {
  const stats = [
    { label: "Active Applications", value: "3", icon: Briefcase, color: "text-blue-600" },
    { label: "Saved Jobs", value: "8", icon: Bookmark, color: "text-orange-600" },
    { label: "Profile Views", value: "24", icon: CheckCircle2, color: "text-green-600" },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back, John!</h1>
          <p className="text-slate-500">Here's what's happening with your job search today.</p>
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
      <div className="mb-10 rounded-2xl bg-primary/5 border border-primary/10 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Verify your identity</h3>
            <p className="text-sm text-slate-600">Complete verification to increase your chances of being hired by 3x.</p>
          </div>
        </div>
        <Button size="sm" className="ios-button" asChild>
          <Link href="/verify-id">Start Verification</Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="mb-10 grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="ios-card">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn("h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center", stat.color)}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Recent Applications */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Applications</h2>
            <Link href="/applications" className="text-sm font-semibold text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="ios-card">
                <CardContent className="p-5">
                   <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                         <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                            C
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-900">Senior Frontend Engineer</h4>
                            <p className="text-sm text-slate-500">TechFlow Systems</p>
                            <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                               <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> 2 days ago</span>
                               <span className="flex items-center gap-1 text-primary font-semibold"><CheckCircle2 className="h-3 w-3" /> Interviewing</span>
                            </div>
                         </div>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/applications/${i}`}><ArrowRight className="h-4 w-4" /></Link>
                      </Button>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recommended Jobs */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recommended Jobs</h2>
            <Link href="/jobs" className="text-sm font-semibold text-primary hover:underline">Browse more</Link>
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Card key={i} className="ios-card">
                <CardContent className="p-5">
                   <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                         <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                            J
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-900">Product Designer</h4>
                            <p className="text-sm text-slate-500">CreativeBits • Remote</p>
                            <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                               <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Worldwide</span>
                               <span className="font-semibold text-slate-700">$100k - $130k</span>
                            </div>
                         </div>
                      </div>
                      <Button variant="outline" size="sm" className="ios-button">View</Button>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
