"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Loader2, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  FileText,
  Mail
} from "lucide-react";
import { toast } from "sonner";

export default function AdminJobCandidatesPage() {
  const { id } = useParams();
  const router = useRouter();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const resp = await fetch(`/api/admin/jobs/${id}/applications`);
        const data = await resp.json();
        if (data.ok) {
          setCandidates(data.applications);
          setJob(data.job);
        } else {
          toast.error(data.message);
          router.push("/admin/jobs");
        }
      } catch (e) {
        toast.error("Failed to load candidate data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCandidates();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
             <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
             <h1 className="text-2xl font-black text-slate-900 tracking-tight">Candidate Queue</h1>
             <p className="text-slate-500 font-medium">
                {job?.title} at <span className="text-primary font-bold">{job?.companyName}</span>
             </p>
          </div>
        </div>
        <div className="flex h-12 items-center px-6 rounded-2xl bg-primary/5 border border-primary/10">
           <p className="text-xs font-black uppercase tracking-widest text-primary">
              Total Applicants: <span className="text-slate-900">{candidates.length}</span>
           </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white overflow-hidden shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="px-6 py-4 font-bold text-slate-900">Applicant Identity</TableHead>
              <TableHead className="font-bold text-slate-900">Application Status</TableHead>
              <TableHead className="font-bold text-slate-900">ID Verification</TableHead>
              <TableHead className="font-bold text-slate-900">Submission Date</TableHead>
              <TableHead className="w-[150px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.length > 0 ? candidates.map((app) => (
              <TableRow key={app.id} className="hover:bg-slate-50/30 transition-colors">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                      <AvatarImage src={app.user.avatarUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary font-black uppercase text-xs">
                        {app.user.name?.[0] || app.user.email[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-bold text-slate-900 truncate">{app.user.name || "Unnamed Candidate"}</span>
                      <span className="text-xs font-medium text-slate-400 truncate">{app.user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className="rounded-md font-bold text-[10px] tracking-widest uppercase px-2 py-1 bg-slate-100 text-slate-600 border-none">
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell>
                   {app.user.idVerification?.status === "VERIFIED" ? (
                     <div className="flex items-center gap-1.5 text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Trusted</span>
                     </div>
                   ) : (
                     <div className="flex items-center gap-1.5 text-slate-300">
                        <Clock className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Unverified</span>
                     </div>
                   )}
                </TableCell>
                <TableCell className="text-slate-500 font-bold text-xs uppercase tracking-tight whitespace-nowrap">
                  {new Date(app.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                   <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">
                         <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/5 hover:text-primary transition-colors">
                         <FileText className="h-4 w-4" />
                      </Button>
                   </div>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                 <TableCell colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-20">
                       <FileText className="h-12 w-12" />
                       <p className="font-black uppercase tracking-widest">No applications yet</p>
                    </div>
                 </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
