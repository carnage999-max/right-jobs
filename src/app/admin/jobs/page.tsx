"use client";

import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Filter,
  Eye,
  Trash2,
  Loader2,
  Power,
  Download
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchJobs = async () => {
    try {
      const resp = await fetch("/api/admin/jobs");
      const data = await resp.json();
      if (data.ok) setJobs(data.data);
    } catch (e) {
      toast.error("Failed to fetch jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAction = async (jobId: string, action: string) => {
    try {
      const resp = await fetch("/api/admin/jobs/action", {
        method: "POST",
        body: JSON.stringify({ id: jobId, action }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await resp.json();
      if (data.ok) {
        toast.success(data.message);
        fetchJobs();
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Action failed");
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    j.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search active jobs..." 
            className="pl-9 ios-button" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="ios-button h-11"
            onClick={() => window.open("/api/admin/export?type=jobs")}
          >
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button className="ios-button h-11" asChild>
            <Link href="/admin/jobs/new">
               <Plus className="mr-2 h-4 w-4" /> Post New Job
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="px-6 py-4 w-[300px] font-bold text-slate-900">Job identity / Company</TableHead>
                <TableHead className="font-bold text-slate-900">Visibility</TableHead>
                <TableHead className="font-bold text-center text-slate-900">Applicants</TableHead>
                <TableHead className="font-bold text-slate-900">Date Posted</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.length > 0 ? filteredJobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-slate-50/30 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 tracking-tight">{job.title}</span>
                      <span className="text-xs text-primary font-black uppercase tracking-wider mt-0.5">{job.companyName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={job.isActive ? "default" : "secondary"} className="rounded-md font-bold text-[10px] tracking-widest uppercase px-2 py-1">
                      {job.isActive ? "ACTIVE" : "INACTIVE"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-black text-slate-900">{job._count.applications}</span>
                  </TableCell>
                  <TableCell className="text-slate-500 font-bold text-xs uppercase tracking-tight">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100">
                          <MoreHorizontal className="h-5 w-5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-none">
                        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Inventory Management</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-2.5 flex gap-2 items-center" asChild>
                           <Link href={`/jobs/${job.id}`} target="_blank">
                              <Eye className="h-4 w-4" /> View listing
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-2.5">Edit posting</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-2.5">Candidate queue</DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuItem 
                          className="text-orange-600 cursor-pointer font-bold rounded-lg py-2.5 flex gap-2 items-center"
                          onClick={() => handleAction(job.id, "TOGGLE_ACTIVE")}
                        >
                          <Power className="h-4 w-4" /> {job.isActive ? "Deactivate Job" : "Activate Job"}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 cursor-pointer font-bold rounded-lg py-2.5 flex gap-2 items-center"
                          onClick={() => handleAction(job.id, "DELETE")}
                        >
                          <Trash2 className="h-4 w-4" /> Permanent Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                   <TableCell colSpan={5} className="py-20 text-center font-bold text-slate-400">
                      No jobs found match your search.
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
