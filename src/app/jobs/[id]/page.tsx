"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  ArrowLeft, 
  Loader2,
  CheckCircle2,
  Lock,
  MessageSquare,
  FileText,
  Bookmark,
  Building2,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    async function fetchJob() {
      try {
        const response = await fetch(`/api/jobs/${resolvedParams.id}`);
        const data = await response.json();
        if (data.ok) {
          setJob(data.job);
        } else {
          toast.error(data.message || "Job not found");
          router.push("/jobs");
        }
      } catch (error) {
        toast.error("Failed to load job details");
      } finally {
        setIsLoading(false);
      }
    }
    fetchJob();
  }, [resolvedParams.id]);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const response = await fetch(`/api/jobs/${resolvedParams.id}/apply`, {
        method: "POST",
        body: JSON.stringify({ coverLetter }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        setIsApplied(true);
        toast.success("Application submitted successfully!");
      } else {
        toast.error(data.message || "Failed to submit application");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-6">
        <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
        <div className="text-center space-y-2">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Secure Retrieval</p>
           <h2 className="text-xl font-bold text-slate-900">Loading Job Details</h2>
        </div>
      </div>
    );
  }

  if (!job) return null;

  const isVerified = job.createdBy?.idVerification?.status === "VERIFIED";

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl animate-in fade-in slide-in-from-bottom-5 duration-700">
      <Button variant="ghost" className="mb-8 ios-button group font-bold text-slate-500 hover:text-primary transition-all" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Search Results
      </Button>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-12">
           <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                 <Badge className="bg-primary/10 text-primary border-none rounded-xl py-1.5 px-4 text-xs font-black tracking-widest uppercase">
                   {job.type.replace("_", " ")}
                 </Badge>
                 {isVerified && (
                   <Badge className="bg-green-500/10 text-green-600 border-none rounded-xl py-1.5 px-4 text-xs font-black tracking-widest uppercase flex items-center gap-1.5">
                     <CheckCircle2 className="h-3 w-3" /> Verified Employer
                   </Badge>
                 )}
              </div>
              <div className="flex flex-col md:flex-row items-start gap-6">
                 <div className="h-24 w-24 rounded-[2rem] bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center overflow-hidden border border-slate-100 shrink-0">
                    {job.companyLogoUrl ? (
                       <img src={job.companyLogoUrl} alt={job.companyName} className="h-full w-full object-cover" />
                    ) : (
                       <div className="h-full w-full bg-primary/5 flex items-center justify-center text-primary font-black text-4xl">
                          {job.companyName[0]}
                       </div>
                    )}
                 </div>
                 <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-tight">{job.title}</h1>
                    <div className="flex items-center gap-3 text-primary">
                       <Building2 className="h-6 w-6" />
                       <span className="text-2xl font-black italic tracking-tight">{job.companyName}</span>
                    </div>
                 </div>
              </div>
              
              <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4 border-y border-slate-100 py-8">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</p>
                    <div className="flex items-center gap-2 font-bold text-slate-900"><MapPin className="h-4 w-4 text-primary" /> {job.location}</div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</p>
                    <div className="flex items-center gap-2 font-bold text-slate-900"><Sparkles className="h-4 w-4 text-primary" /> {job.category}</div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Salary Range</p>
                    <div className="flex items-center gap-2 font-bold text-slate-900"><DollarSign className="h-4 w-4 text-primary" /> {job.salaryRange || 'Competitive'}</div>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Posted On</p>
                    <div className="flex items-center gap-2 font-bold text-slate-900"><Clock className="h-4 w-4 text-primary" /> {formatDate(job.createdAt)}</div>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                 <FileText className="h-6 w-6 text-primary" /> 
                 Job Description
              </h3>
              <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tight prose-strong:text-slate-900 text-lg">
                 <div dangerouslySetInnerHTML={{ __html: job.description.replace(/\n/g, '<br/>') }} />
              </div>
           </div>
        </div>

        <aside className="space-y-8">
           <Card className="rounded-[2.5rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.14)] bg-white overflow-hidden sticky top-32">
              <div className="h-2 bg-primary" />
              <CardHeader className="space-y-2 pt-8">
                 <CardTitle className="text-3xl font-black tracking-tighter">Ready to Apply?</CardTitle>
                 <CardDescription className="font-medium">Submit your interest for this position directly to the hiring team.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pb-8">
                 {isApplied ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-green-500/5 rounded-[2rem] border-2 border-dashed border-green-500/20 animate-in zoom-in-95">
                       <div className="h-16 w-16 rounded-[2rem] bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/30">
                          <CheckCircle2 className="h-8 w-8" />
                       </div>
                       <div>
                          <p className="font-black text-xl text-green-900">Application Sent!</p>
                          <p className="text-sm font-medium text-green-700">The hiring team has been notified. We wish you the best of luck!</p>
                       </div>
                       <Button variant="outline" className="w-full ios-button bg-white border-green-200 text-green-700 hover:bg-green-50 h-14 font-black tracking-tight" asChild>
                          <Link href="/applications">Track My Progress</Link>
                       </Button>
                    </div>
                 ) : (
                    <Dialog>
                       <DialogTrigger asChild>
                          <Button className="w-full ios-button h-16 text-xl shadow-2xl shadow-primary/20 font-black tracking-tight group">
                            Apply Now <Sparkles className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
                          </Button>
                       </DialogTrigger>
                       <DialogContent className="sm:max-w-[600px] rounded-[3rem] border-none p-0 overflow-hidden">
                          <div className="bg-slate-950 p-10 text-white space-y-2">
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest mb-2">
                                Application System
                             </div>
                             <DialogTitle className="text-3xl font-black tracking-tighter">Job Application</DialogTitle>
                             <DialogDescription className="text-slate-400 font-medium italic">
                                Applying for <span className="text-white font-bold">{job.title}</span> at {job.companyName}
                             </DialogDescription>
                          </div>
                          
                          <div className="p-10 space-y-8 bg-white">
                             <div className="space-y-4">
                                <Label htmlFor="desc" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                                   Why are you a great fit? (Optional)
                                </Label>
                                <Textarea 
                                   placeholder="Introduce yourself and highlight your relevant experience..." 
                                   className="min-h-[200px] rounded-3xl bg-slate-50 border-none focus-visible:ring-primary/20 transition-all p-6 text-lg font-medium resize-none shadow-inner"
                                   value={coverLetter}
                                   onChange={(e) => setCoverLetter(e.target.value)}
                                />
                             </div>
                             
                             <div className="rounded-3xl bg-slate-50 p-6 flex items-center justify-between group hover:bg-slate-100 transition-colors">
                                <div className="flex items-center gap-4">
                                   <div className="h-14 w-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
                                      <FileText className="h-7 w-7" />
                                   </div>
                                   <div>
                                      <p className="font-black text-slate-900">Your Master Resume</p>
                                      <p className="text-xs font-semibold text-slate-400 tracking-tight">Syncs automatically from your profile</p>
                                   </div>
                                </div>
                                <Button variant="ghost" size="sm" className="font-bold text-primary hover:bg-white rounded-xl h-10 px-4" asChild>
                                   <Link href="/profile">Update</Link>
                                </Button>
                             </div>

                             <DialogFooter className="pt-4">
                                <Button onClick={handleApply} className="w-full ios-button h-16 text-xl shadow-2xl shadow-primary/20 font-black tracking-tight" disabled={isApplying}>
                                   {isApplying ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Confirm My Application"}
                                </Button>
                             </DialogFooter>
                          </div>
                       </DialogContent>
                    </Dialog>
                 )}
                 <Button variant="ghost" className="w-full h-14 text-slate-500 font-bold hover:text-slate-900 transition-colors rounded-2xl">
                    <Bookmark className="mr-2 h-5 w-5" /> Save Job for Later
                 </Button>
              </CardContent>
           </Card>

           <Card className="rounded-[2.5rem] border-none bg-slate-100/50 backdrop-blur-sm p-8 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-900">
                    <Lock className="h-6 w-6" />
                 </div>
                 <div>
                    <h4 className="font-black tracking-tight">Privacy Guaranteed</h4>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Secure Link Protocol</p>
                 </div>
              </div>
              <p className="text-sm font-medium leading-relaxed text-slate-500 italic">
                 "Your personal information and resume are only visible to the verified hiring manager of this specific job posting."
              </p>
           </Card>
        </aside>
      </div>
    </div>
  );
}
