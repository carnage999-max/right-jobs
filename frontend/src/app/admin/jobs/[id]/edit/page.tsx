"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft, Save, Briefcase } from "lucide-react";
import { toast } from "sonner";

export default function AdminEditJobPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const resp = await fetch(`/api/jobs/${id}`);
        const data = await resp.json();
        if (data.ok) {
          setJob(data.job);
        } else {
          toast.error(data.message);
          router.push("/admin/jobs");
        }
      } catch (e) {
        toast.error("Failed to load job data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [id, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const resp = await fetch(`/api/jobs/${id}`, {
        method: "PATCH",
        body: JSON.stringify(job),
        headers: { "Content-Type": "application/json" },
      });
      const data = await resp.json();
      if (data.ok) {
        toast.success("Job posting updated successfully");
        router.push("/admin/jobs");
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Failed to update job");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl">
           <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
           <h1 className="text-2xl font-black text-slate-900 tracking-tight">Edit Job Posting</h1>
           <p className="text-slate-400 font-medium text-sm italic">System ID: {id}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
         <div className="grid sm:grid-cols-2 gap-6">
            <Card className="ios-card lg:col-span-2">
               <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-lg font-black flex items-center gap-2">
                     <Briefcase className="h-5 w-5 text-primary" />
                     Primary Details
                  </CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Job Title</Label>
                        <Input 
                           value={job.title} 
                           onChange={(e) => setJob({...job, title: e.target.value})} 
                           className="ios-button h-12 bg-slate-50 border-none rounded-xl font-bold"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Company Name</Label>
                        <Input 
                           value={job.companyName} 
                           onChange={(e) => setJob({...job, companyName: e.target.value})} 
                           className="ios-button h-12 bg-slate-50 border-none rounded-xl font-bold"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Physical Location</Label>
                        <Input 
                           value={job.location} 
                           onChange={(e) => setJob({...job, location: e.target.value})} 
                           className="ios-button h-12 bg-slate-50 border-none rounded-xl font-bold"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Employment Type</Label>
                        <Select 
                           value={job.type} 
                           onValueChange={(val) => setJob({...job, type: val})}
                        >
                           <SelectTrigger className="ios-button h-12 bg-slate-50 border-none rounded-xl font-bold">
                              <SelectValue placeholder="Select type" />
                           </SelectTrigger>
                           <SelectContent className="rounded-2xl border-none shadow-2xl">
                              <SelectItem value="FULL_TIME">Full Time</SelectItem>
                              <SelectItem value="PART_TIME">Part Time</SelectItem>
                              <SelectItem value="CONTRACT">Contract</SelectItem>
                              <SelectItem value="INTERNSHIP">Internship</SelectItem>
                              <SelectItem value="REMOTE">Remote</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Comprehensive Description</Label>
                     <Textarea 
                        value={job.description} 
                        onChange={(e) => setJob({...job, description: e.target.value})} 
                        className="min-h-[250px] bg-slate-50 border-none rounded-2xl p-5 font-medium leading-relaxed resize-none"
                     />
                  </div>
               </CardContent>
            </Card>

            <Card className="ios-card lg:col-span-2">
               <CardHeader className="border-b bg-slate-50/50">
                  <CardTitle className="text-lg font-black">Context & Settings</CardTitle>
               </CardHeader>
               <CardContent className="p-8 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Job Category</Label>
                        <Input 
                           value={job.category} 
                           onChange={(e) => setJob({...job, category: e.target.value})} 
                           className="ios-button h-12 bg-slate-50 border-none rounded-xl font-bold"
                        />
                     </div>
                     <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Salary Indication (Annual)</Label>
                        <Input 
                           value={job.salaryRange || ""} 
                           onChange={(e) => setJob({...job, salaryRange: e.target.value})} 
                           placeholder="e.g. $80k - $120k"
                           className="ios-button h-12 bg-slate-50 border-none rounded-xl font-bold"
                        />
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="flex justify-end pt-4">
            <Button 
               type="submit" 
               disabled={isSaving}
               className="ios-button h-14 px-10 gap-3 font-black text-lg shadow-xl shadow-primary/20"
            >
               {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
               Commit Job Updates
            </Button>
         </div>
      </form>
    </div>
  );
}
