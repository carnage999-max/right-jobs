"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, MessageSquare, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Application {
  id: string;
  job: {
    title: string;
    companyName: string;
    location: string;
  };
  status: string;
  createdAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchApps() {
      try {
        const response = await fetch("/api/applications");
        const data = await response.json();
        if (response.ok) {
          setApplications(data.data);
        } else {
          toast.error(data.message || "Failed to fetch applications");
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    fetchApps();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="mb-10 space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">Your Applications</h1>
        <p className="text-slate-500 font-medium">Track the status of your job applications in one place.</p>
      </div>

      <div className="grid gap-6">
        {applications.length > 0 ? (
          applications.map((app) => (
            <Card key={app.id} className="ios-card overflow-hidden transition-all hover:border-primary/50 shadow-lg shadow-slate-200/50">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex-1 p-8">
                    <div className="mb-4 flex items-center justify-between md:hidden">
                       <StatusBadge status={app.status} />
                       <span className="text-xs font-semibold text-slate-400">{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{app.job.title}</h3>
                    <p className="mt-1.5 font-bold text-primary text-lg">{app.job.companyName}</p>
                    <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-500 font-semibold">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {app.job.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50/50 p-8 md:w-80 md:border-l md:bg-transparent">
                     <div className="hidden md:block mb-6">
                        <StatusBadge status={app.status} />
                     </div>
                     <div className="space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                           <MessageSquare className="h-4 w-4" />
                           Status updated {new Date(app.createdAt).toLocaleDateString()}
                        </div>
                        <Button className="w-full ios-button justify-between h-12" variant="outline" asChild>
                           <Link href={`/applications/${app.id}`}>
                               View Thread <ChevronRight className="h-4 w-4" />
                           </Link>
                        </Button>
                     </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white p-24 text-center">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 text-slate-400 shadow-xl shadow-slate-100/50">
               <Briefcase className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">No applications yet</h3>
            <p className="mt-3 text-slate-500 font-medium max-w-xs mx-auto text-lg leading-relaxed">
              Your professional journey begins here. Start browsing open roles to find your next match.
            </p>
            <Button className="mt-10 ios-button px-10 h-14 text-lg shadow-xl shadow-primary/20" asChild>
              <Link href="/jobs">Explore All Jobs</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    PENDING: "bg-slate-100 text-slate-700",
    REVIEWING: "bg-blue-50 text-blue-700 border-blue-100",
    INTERVIEWING: "bg-primary/10 text-primary border-primary/20",
    OFFERED: "bg-green-50 text-green-700 border-green-100",
    REJECTED: "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <Badge className={`${variants[status] || "bg-slate-100"} rounded-full px-4 py-1.5 font-black uppercase tracking-[0.15em] text-[10px] border-none`}>
      {status}
    </Badge>
  );
}
