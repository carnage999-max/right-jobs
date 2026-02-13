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
  MoreHorizontal, 
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  Loader2,
  Clock
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });

  const fetchVerifications = async (page = 1) => {
    setIsLoading(true);
    try {
      const resp = await fetch(`/api/admin/verifications?page=${page}&limit=${pagination.limit}`);
      const data = await resp.json();
      if (data.ok) {
        setVerifications(data.data);
        setPagination(data.pagination);
      }
    } catch (e) {
      toast.error("Failed to fetch verifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications(1);
  }, []);

  const handleAction = async (id: string, action: string) => {
    try {
      const resp = await fetch(`/api/admin/verifications/${id}/action`, {
        method: "POST",
        body: JSON.stringify({ action }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await resp.json();
      if (data.ok) {
        toast.success(data.message);
        fetchVerifications(pagination.page);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col">
           <h1 className="text-2xl font-black text-slate-900 tracking-tight">Identity Trust Center</h1>
           <p className="text-slate-500 font-medium text-sm">Review government ID submissions and verify users.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-xl">
          <AlertTriangle className="h-4 w-4" />
          <span>{pagination.total} awaiting verification</span>
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
                <TableHead className="px-6 py-4 font-bold text-slate-900 min-w-[250px]">Identity / Official Name</TableHead>
                <TableHead className="font-bold text-slate-900">Credential Type</TableHead>
                <TableHead className="font-bold text-slate-900">Submission Status</TableHead>
                <TableHead className="font-bold text-slate-900">Date Logged</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verifications.length > 0 ? verifications.map((v) => (
                <TableRow key={v.id} className="hover:bg-slate-50/30 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                         <AvatarImage src={v.user.avatarUrl} />
                         <AvatarFallback className="bg-primary/10 text-primary font-black uppercase text-xs">
                           {v.user.name?.[0] || v.user.email[0]}
                         </AvatarFallback>
                       </Avatar>
                       <div className="flex flex-col">
                         <span className="font-black text-slate-900 leading-tight">{v.fullName || v.user.name || "Pending Identity"}</span>
                         <span className="text-xs font-medium text-slate-400">{v.user.email}</span>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{v.idType.replace("_", " ")}</span>
                     </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="rounded-md font-black text-[9px] tracking-widest uppercase px-2 py-1 flex items-center w-fit gap-1.5 bg-slate-100 text-slate-500 border-none">
                      <Clock className="h-3 w-3" /> {v.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-500 font-bold text-xs uppercase tracking-tight">
                    {new Date(v.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100">
                          <MoreHorizontal className="h-5 w-5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-60 p-2 rounded-2xl shadow-2xl border-none">
                        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Moderation Suite</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-2.5 flex gap-2 items-center" asChild>
                           <Link href={`/admin/verifications/${v.id}`}>
                              <Eye className="h-4 w-4" /> Comprehensive Review
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuItem 
                          className="text-green-600 cursor-pointer font-bold rounded-lg py-2.5 flex gap-2 items-center"
                          onClick={() => handleAction(v.id, "APPROVE")}
                        >
                           <CheckCircle2 className="h-4 w-4" /> Authorize Identity
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 cursor-pointer font-bold rounded-lg py-2.5 flex gap-2 items-center"
                          onClick={() => handleAction(v.id, "REJECT")}
                        >
                           <XCircle className="h-4 w-4" /> Deny Verification
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                   <TableCell colSpan={5} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-20">
                         <ShieldCheck className="h-12 w-12" />
                         <p className="font-black uppercase tracking-[0.2em] text-sm">No pending trust requests</p>
                      </div>
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50/50">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">
                Queue Depth: <span className="text-slate-900">{pagination.total}</span> pending tasks
             </p>
             <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <Button 
                   variant="outline" size="sm" className="ios-button h-8"
                   disabled={pagination.page === 1}
                   onClick={() => fetchVerifications(pagination.page - 1)}
                >Previous</Button>
                <div className="flex items-center px-4 text-[10px] font-black tracking-widest leading-none">
                   {pagination.page} / {pagination.totalPages}
                </div>
                <Button 
                   variant="outline" size="sm" className="ios-button h-8"
                   disabled={pagination.page === pagination.totalPages}
                   onClick={() => fetchVerifications(pagination.page + 1)}
                >Next</Button>
             </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
