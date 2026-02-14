"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, DollarSign, Clock, Filter, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

export default function JobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    category: "all"
  });

  async function fetchJobs() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (filters.type !== "all") params.append("type", filters.type);
      if (filters.category !== "all") params.append("category", filters.category);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      if (data.ok) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl animate-in fade-in duration-700">
      <div className="mb-16 space-y-8">
        <div className="space-y-4 max-w-3xl">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              Live Opportunities
           </div>
           <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.9]">
             Find Your Next <span className="text-primary italic">Adventure</span>
           </h1>
           <p className="text-slate-500 text-lg md:text-xl font-medium">
             Discover curated roles from innovative companies around the world.
           </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 max-w-4xl p-2 bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-16 pl-14 pr-6 bg-transparent border-none focus-visible:ring-0 text-lg font-medium placeholder:text-slate-400" 
              placeholder="Job title, company, or keywords..." 
            />
          </div>
          <Button type="submit" className="h-14 px-10 ios-button text-lg shadow-xl shadow-primary/20">Search Jobs</Button>
        </form>
      </div>

      <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
        <aside className="sticky top-32 h-fit space-y-10 hidden lg:block">
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Employment Type</h3>
            <div className="space-y-3">
               {[
                 { label: "All Types", value: "all" },
                 { label: "Full-time", value: "FULL_TIME" },
                 { label: "Part-time", value: "PART_TIME" },
                 { label: "Contract", value: "CONTRACT" },
                 { label: "Remote", value: "REMOTE" }
               ].map(type => (
                 <button 
                   key={type.value}
                   onClick={() => setFilters({ ...filters, type: type.value })}
                   className={cn(
                     "flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                     filters.type === type.value 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-slate-500 hover:bg-slate-100"
                   )}
                 >
                   <div className={cn("h-1.5 w-1.5 rounded-full", filters.type === type.value ? "bg-white" : "bg-slate-300")} />
                   {type.label}
                 </button>
               ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Popular Categories</h3>
            <div className="space-y-3">
               {[
                 { label: "All Categories", value: "all" },
                 { label: "Engineering", value: "Engineering" },
                 { label: "Design", value: "Design" },
                 { label: "Marketing", value: "Marketing" },
                 { label: "Management", value: "Management" }
               ].map(cat => (
                 <button 
                  key={cat.value}
                  onClick={() => setFilters({ ...filters, category: cat.value })}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all",
                    filters.category === cat.value 
                      ? "bg-slate-900 text-white shadow-lg" 
                      : "text-slate-500 hover:bg-slate-100"
                  )}
                 >
                   {cat.label}
                 </button>
               ))}
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">
              {isLoading ? "Fetching records..." : `${jobs.length} Positions found`}
            </h2>
          </div>

          <div className="grid gap-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
                <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Initializing Stream</p>
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <Card key={job.id} className="ios-card bg-white/70 backdrop-blur-sm group hover:scale-[1.01] transition-all duration-500 border-none shadow-xl hover:shadow-2xl">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1 flex flex-col md:flex-row gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-white shadow-lg shadow-slate-200/50 flex items-center justify-center overflow-hidden border border-slate-100 shrink-0">
                           {job.companyLogoUrl ? (
                              <img src={job.companyLogoUrl} alt={job.companyName} className="h-full w-full object-cover" />
                           ) : (
                              <div className="h-full w-full bg-primary/5 flex items-center justify-center text-primary font-black text-2xl">
                                 {job.companyName[0]}
                              </div>
                           )}
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <Link href={`/jobs/${job.id}`} className="inline-block group-hover:text-primary transition-colors">
                              <h3 className="text-2xl font-black tracking-tight text-slate-900 group-hover:underline decoration-4 underline-offset-4">{job.title}</h3>
                            </Link>
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-primary" />
                              <p className="text-lg font-bold text-slate-900">{job.companyName}</p>
                            </div>
                          </div>

                        <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-400">
                          <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location}</div>
                          <div className="flex items-center gap-1.5"><Sparkles className="h-4 w-4" /> {job.category}</div>
                          <div className="flex items-center gap-1.5"><DollarSign className="h-4 w-4" /> {job.salaryRange || 'Competitive'}</div>
                          <div className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {formatDate(job.createdAt)}</div>
                        </div>
                      </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-4 min-w-[140px]">
                        <Badge className="bg-slate-100 text-slate-900 border-none py-1.5 px-4 rounded-xl text-xs font-black tracking-widest uppercase">
                          {job.type.replace("_", " ")}
                        </Badge>
                        <Button asChild className="ios-button h-12 px-8 shadow-lg shadow-primary/20 group/btn">
                          <Link href={`/jobs/${job.id}`} className="flex items-center gap-2">
                            View Details <Sparkles className="h-4 w-4 opacity-0 group-hover/btn:opacity-100 transition-all scale-0 group-hover/btn:scale-100" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-32 rounded-[3rem] bg-white/50 border-2 border-dashed border-slate-200">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-100 text-slate-400 mb-6">
                   <Briefcase className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">No open roles found</h3>
                <p className="text-slate-500 font-medium mt-2">Try adjusting your filters or check back later.</p>
                <Button variant="ghost" className="mt-6 font-bold text-primary" onClick={() => { setSearch(""); setFilters({ type: 'all', category: 'all' }); }}>Clear all filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
