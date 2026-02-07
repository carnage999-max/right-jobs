"use client";

import { useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Bookmark
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

// Mock data for a single job
const JOB = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "Senior Frontend Engineer",
  companyName: "TechFlow Systems",
  location: "San Francisco, CA",
  type: "FULL_TIME",
  category: "Engineering",
  salaryRange: "$140k - $180k",
  description: `
    ## About the Role
    We are looking for a Senior Frontend Engineer who is passionate about building beautiful, responsive, and high-performance user interfaces. You will be working closely with our design and backend teams to deliver a seamless experience to our users.

    ## Requirements
    - 5+ years of experience with React and modern JavaScript.
    - Deep understanding of CSS and responsive design.
    - Experience with Next.js and Tailwind CSS is a plus.
    - Ability to work in a fast-paced, collaborative environment.

    ## What We Offer
    - Competitive salary and equity.
    - Comprehensive health and dental coverage.
    - Flexible working hours and remote options.
    - A collaborative and inclusive company culture.
  `,
  createdAt: "2024-02-01",
  isVerified: true
};

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

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

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Button variant="ghost" className="mb-6 ios-button text-slate-500 hover:text-primary" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
      </Button>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
           <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <Badge variant="secondary" className="rounded-md font-medium">
                   {JOB.type.replace("_", " ")}
                 </Badge>
                 {JOB.isVerified && (
                   <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none rounded-md font-medium">
                     <CheckCircle2 className="mr-1 h-3 w-3" /> Verified Employer
                   </Badge>
                 )}
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{JOB.title}</h1>
              <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-medium">
                 <div className="flex items-center gap-1.5"><Briefcase className="h-4 w-4 text-primary" /> {JOB.companyName}</div>
                 <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> {JOB.location}</div>
                 <div className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-primary" /> {JOB.salaryRange}</div>
              </div>
           </div>

           <div className="prose prose-slate max-w-none">
              <div dangerouslySetInnerHTML={{ __html: JOB.description.replace(/\n/g, '<br/>') }} />
           </div>
        </div>

        <aside className="space-y-6">
           <Card className="ios-card sticky top-24">
              <CardHeader>
                 <CardTitle className="text-xl font-bold">Interested?</CardTitle>
                 <CardDescription>Apply today to jumpstart your career.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 {isApplied ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-4 bg-green-50 rounded-2xl border border-green-100">
                       <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="font-bold text-green-800">Applied Successfully</p>
                          <p className="text-xs text-green-600">You'll hear from us soon via email.</p>
                       </div>
                       <Button variant="outline" className="w-full ios-button bg-white" asChild>
                          <Link href="/applications">Track Application</Link>
                       </Button>
                    </div>
                 ) : (
                    <Dialog>
                       <DialogTrigger asChild>
                          <Button className="w-full ios-button h-12 text-lg">Apply Now</Button>
                       </DialogTrigger>
                       <DialogContent className="sm:max-w-[500px] rounded-3xl">
                          <DialogHeader>
                             <DialogTitle className="text-2xl font-bold">Apply for {JOB.title}</DialogTitle>
                             <DialogDescription>
                                Tell {JOB.companyName} why you're a great fit for this role.
                             </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                             <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                   <MessageSquare className="h-4 w-4" /> Cover Letter (Optional)
                                </label>
                                <Textarea 
                                   placeholder="I'm excited about this role because..." 
                                   className="min-h-[150px] rounded-2xl resize-none"
                                   value={coverLetter}
                                   onChange={(e) => setCoverLetter(e.target.value)}
                                />
                             </div>
                             <div className="rounded-xl bg-slate-50 p-4 border flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-white border flex items-center justify-center text-slate-400">
                                   <FileText className="h-5 w-5" />
                                </div>
                                <div className="flex-1 text-xs">
                                   <p className="font-semibold text-slate-900">Your Current Resume</p>
                                   <p className="text-slate-500">John_Doe_Resume.pdf</p>
                                </div>
                                <Button variant="ghost" size="sm" className="text-primary h-8" asChild>
                                   <Link href="/profile">Edit</Link>
                                </Button>
                             </div>
                          </div>
                          <DialogFooter>
                             <Button onClick={handleApply} className="w-full ios-button h-12" disabled={isApplying}>
                                {isApplying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit Application"}
                             </Button>
                          </DialogFooter>
                       </DialogContent>
                    </Dialog>
                 )}
                 <Button variant="outline" className="w-full ios-button">
                    <Bookmark className="mr-2 h-4 w-4" /> Save for Later
                 </Button>
              </CardContent>
           </Card>

           <Card className="ios-card bg-slate-50 border-none">
              <CardContent className="p-6">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                       <Lock className="h-5 w-5" />
                    </div>
                    <div>
                       <h4 className="font-bold text-sm">Safe & Secure</h4>
                       <p className="text-xs text-slate-500">Your data is never shared with 3rd parties.</p>
                    </div>
                 </div>
                 <p className="text-xs leading-relaxed text-slate-400">
                    At RightJobs, we strictly monitor all job postings for any signs of fraudulent activity. Every verified employer has passed our identity check.
                 </p>
              </CardContent>
           </Card>
        </aside>
      </div>
    </div>
  );
}
