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
import { cn } from "@/lib/utils";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [confirmingAction, setConfirmingAction] = useState<{ id: string, action: string, type: "DELETE" | "TOGGLE" } | null>(null);

  const fetchJobs = async (page = 1) => {
    setIsLoading(true);
    try {
      const resp = await fetch(`/api/admin/jobs?page=${page}&limit=${pagination.limit}`);
      const data = await resp.json();
      if (data.ok) {
        setJobs(data.data);
        setPagination(data.pagination);
      }
    } catch (e) {
      toast.error("Failed to fetch jobs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(1);
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
        fetchJobs(pagination.page);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Action failed");
    } finally {
      setConfirmingAction(null);
    }
  };

  const filteredJobs = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         j.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || (statusFilter === "ACTIVE" ? j.isActive : !j.isActive);
    return matchesSearch && matchesStatus;
  });

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ios-button">
                <Filter className="mr-2 h-4 w-4" /> {statusFilter === "ALL" ? "Filter" : statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl shadow-xl border-none">
               <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Filter by status</DropdownMenuLabel>
               <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-2" onClick={() => setStatusFilter("ALL")}>All Postings</DropdownMenuItem>
               <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-2" onClick={() => setStatusFilter("ACTIVE")}>Active Only</DropdownMenuItem>
               <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-2" onClick={() => setStatusFilter("INACTIVE")}>Inactive Only</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            variant="outline" 
            className="ios-button h-11 hidden sm:flex"
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

      <div className="rounded-2xl border bg-white overflow-hidden shadow-sm overflow-x-auto">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
          </div>
        ) : (
          <>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="px-6 py-4 min-w-[300px] font-bold text-slate-900">Job identity / Company</TableHead>
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
                  <TableCell className="text-center font-black text-slate-900">
                    {job._count.applications}
                  </TableCell>
                  <TableCell className="text-slate-500 font-bold text-xs uppercase tracking-tight whitespace-nowrap">
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
                        <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-2.5 flex gap-2 items-center" asChild>
                           <Link href={`/admin/jobs/${job.id}/edit`}>
                              <Plus className="h-4 w-4 rotate-45" /> Edit posting
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-2.5 flex gap-2 items-center" asChild>
                           <Link href={`/admin/jobs/${job.id}/candidates`}>
                              <Search className="h-4 w-4" /> Candidate queue
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuItem 
                          className="text-orange-600 cursor-pointer font-bold rounded-lg py-2.5 flex gap-2 items-center"
                          onClick={() => setConfirmingAction({ id: job.id, action: "TOGGLE_ACTIVE", type: "TOGGLE" })}
                        >
                          <Power className="h-4 w-4" /> {job.isActive ? "Deactivate Job" : "Activate Job"}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 cursor-pointer font-bold rounded-lg py-2.5 flex gap-2 items-center"
                          onClick={() => setConfirmingAction({ id: job.id, action: "DELETE", type: "DELETE" })}
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

          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50/50">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                Showing <span className="text-slate-900">{jobs.length}</span> of <span className="text-slate-900">{pagination.total}</span> jobs
             </p>
             <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ios-button h-8"
                  disabled={pagination.page === 1}
                  onClick={() => fetchJobs(pagination.page - 1)}
                >
                   Previous
                </Button>
                <div className="flex items-center px-4 text-xs font-black">
                   {pagination.page} / {pagination.totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ios-button h-8"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => fetchJobs(pagination.page + 1)}
                >
                   Next
                </Button>
             </div>
          </div>
          </>
        )}
      </div>

      {/* Action Confirmation Modal */}
      {confirmingAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
           <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className={cn(
                "mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-6",
                confirmingAction.type === "DELETE" ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
              )}>
                 {confirmingAction.type === "DELETE" ? <Trash2 className="h-8 w-8" /> : <Power className="h-8 w-8" />}
              </div>
              <h3 className="text-xl font-black text-center text-slate-900 mb-2">
                {confirmingAction.type === "DELETE" ? "Delete job listing?" : "Modify job visibility?"}
              </h3>
              <p className="text-sm font-medium text-slate-500 text-center mb-8">
                 {confirmingAction.type === "DELETE" 
                    ? "This will permanently remove the job posting and all associated candidate applications. This cannot be undone." 
                    : "This will change the visibility of this job posting on the platform. It can be reversed at any time."}
              </p>
              <div className="flex gap-3">
                 <Button variant="outline" className="flex-1 ios-button h-12" onClick={() => setConfirmingAction(null)}>Cancel</Button>
                 <Button 
                   variant={confirmingAction.type === "DELETE" ? "destructive" : "default"} 
                   className={cn("flex-1 ios-button h-12", confirmingAction.type === "TOGGLE" && "bg-orange-600 hover:bg-orange-700 border-none")}
                   onClick={() => handleAction(confirmingAction.id, confirmingAction.action)}
                 >
                    Confirm {confirmingAction.type === "DELETE" ? "Delete" : "Change"}
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
