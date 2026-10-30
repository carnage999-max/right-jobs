"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, CheckCircle2, FileText, Loader2, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trackEvent } from "@/components/analytics";

/** The interactive part of a job page: applying and saving. The page around it is server-rendered. */
export function JobActions({ jobId, title, companyName }: { jobId: string; title: string; companyName: string }) {
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Whether this visitor already saved the job depends on who they are, so it is looked up after the page loads.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/jobs/${jobId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.ok) setIsSaved(Boolean(data.isSaved));
      })
      .catch(() => null);
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, { method: "POST", body: JSON.stringify({ coverLetter }), headers: { "Content-Type": "application/json" } });
      const data = await response.json();
      if (response.ok) {
        setIsApplied(true);
        trackEvent("apply_complete", { job_id: jobId });
        toast.success("Application submitted successfully!");
      } else {
        toast.error(data.message || "Failed to submit application");
      }
    } catch {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsApplying(false);
    }
  };

  const handleSaveJob = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/jobs/${jobId}/save`, { method: isSaved ? "DELETE" : "POST" });
      if (response.ok) {
        setIsSaved(!isSaved);
        if (!isSaved) trackEvent("save_job", { job_id: jobId });
        toast.success(isSaved ? "Job removed from saved list" : "Job saved successfully!");
      } else if (response.status === 401) {
        toast.error("Please sign in to save jobs");
      } else {
        const data = await response.json().catch(() => ({}));
        toast.error(data.message || "Failed to update saved jobs");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <aside className="space-y-8">
      <Card className="rounded-[2.5rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.14)] bg-white overflow-hidden lg:sticky lg:top-32">
        <div className="h-2 bg-primary" />
        <CardHeader className="space-y-2 pt-8">
          <CardTitle className="text-3xl font-black tracking-tighter">Ready to Apply?</CardTitle>
          <CardDescription className="font-medium">Submit your interest for this position directly to the hiring team.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-8">
          {isApplied ? (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 bg-green-500/5 rounded-[2rem] border-2 border-dashed border-green-500/20">
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
            <Dialog onOpenChange={(open) => open && trackEvent("apply_start", { job_id: jobId })}>
              <DialogTrigger asChild>
                <Button className="w-full ios-button h-16 text-xl shadow-2xl shadow-primary/20 font-black tracking-tight group">
                  Apply Now <Sparkles className="ml-2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] rounded-[3rem] border-none p-0 overflow-hidden">
                <div className="bg-slate-950 p-10 text-white space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest mb-2">Application System</div>
                  <DialogTitle className="text-3xl font-black tracking-tighter">Job Application</DialogTitle>
                  <DialogDescription className="text-slate-400 font-medium italic">
                    Applying for <span className="text-white font-bold">{title}</span> at {companyName}
                  </DialogDescription>
                </div>
                <div className="p-10 space-y-8 bg-white">
                  <div className="space-y-4">
                    <Label htmlFor="cover" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                      Why are you a great fit? (Optional)
                    </Label>
                    <Textarea
                      id="cover"
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
          <Button variant="ghost" className="w-full h-14 text-slate-500 font-bold hover:text-slate-900 transition-colors rounded-2xl" onClick={handleSaveJob} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Bookmark className={`mr-2 h-5 w-5 ${isSaved ? "fill-current text-primary" : ""}`} />}
            {isSaving ? "Saving..." : isSaved ? "Saved" : "Save Job for Later"}
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
        <p className="text-sm font-medium leading-relaxed text-slate-500 italic">&ldquo;Your personal information and resume are only visible to the verified hiring manager of this specific job posting.&rdquo;</p>
      </Card>
    </aside>
  );
}
