"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Loader2,
  LayoutGrid
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Step = "BASIC_INFO" | "DESCRIPTION" | "REVIEW";

export default function PostJobPage() {
  const [step, setStep] = useState<Step>("BASIC_INFO");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "FULL_TIME",
    category: "Engineering",
    salary: "",
    description: ""
  });

  const handleNext = () => {
    if (step === "BASIC_INFO") setStep("DESCRIPTION");
    else if (step === "DESCRIPTION") setStep("REVIEW");
  };

  const handleBack = () => {
    if (step === "DESCRIPTION") setStep("BASIC_INFO");
    else if (step === "REVIEW") setStep("DESCRIPTION");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Job posted successfully!");
      router.push("/admin/jobs");
    } catch (error) {
      toast.error("Failed to post job");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="mb-10 text-center space-y-2">
         <h1 className="text-3xl font-bold tracking-tight">Post a New Job</h1>
         <p className="text-slate-500">Reach thousands of qualified candidates in minutes.</p>
      </div>

      <div className="mb-8 flex items-center justify-between px-4">
         {[
           { id: "BASIC_INFO", label: "Basics" },
           { id: "DESCRIPTION", label: "Details" },
           { id: "REVIEW", label: "Publish" }
         ].map((s, i) => (
           <div key={s.id} className="flex items-center gap-2">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                step === s.id ? "bg-primary text-primary-foreground" : "bg-slate-200 text-slate-500"
              )}>
                {i + 1}
              </div>
              <span className={cn(
                "text-sm font-semibold hidden sm:inline",
                step === s.id ? "text-slate-900" : "text-slate-400"
              )}>{s.label}</span>
              {i < 2 && <div className="hidden sm:block h-px w-12 bg-slate-200 ml-4" />}
           </div>
         ))}
      </div>

      <Card className="ios-card overflow-hidden">
        <CardContent className="p-8">
           {step === "BASIC_INFO" && (
             <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                   <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input 
                        id="title" 
                        placeholder="e.g. Senior Product Designer" 
                        className="rounded-xl"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input 
                        id="company" 
                        placeholder="e.g. TechFlow Systems" 
                        className="rounded-xl"
                        value={formData.company}
                        onChange={(e) => setFormData({...formData, company: e.target.value})}
                      />
                   </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                   <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input 
                        id="location" 
                        placeholder="e.g. New York, NY or Remote" 
                        className="rounded-xl"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                      />
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="salary">Salary Range (Optional)</Label>
                      <Input 
                        id="salary" 
                        placeholder="e.g. $120k - $150k" 
                        className="rounded-xl"
                        value={formData.salary}
                        onChange={(e) => setFormData({...formData, salary: e.target.value})}
                      />
                   </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                   <div className="space-y-2">
                      <Label>Job Type</Label>
                      <Select defaultValue={formData.type} onValueChange={(val) => setFormData({...formData, type: val})}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="FULL_TIME">Full Time</SelectItem>
                          <SelectItem value="PART_TIME">Part Time</SelectItem>
                          <SelectItem value="CONTRACT">Contract</SelectItem>
                          <SelectItem value="REMOTE">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>
                   <div className="space-y-2">
                      <Label>Category</Label>
                      <Select defaultValue={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Management">Management</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>
                </div>

                <Button onClick={handleNext} className="w-full ios-button h-12">
                   Continue to Description
                </Button>
             </div>
           )}

           {step === "DESCRIPTION" && (
             <div className="space-y-6">
                <div className="space-y-2">
                   <Label htmlFor="desc">Job Description</Label>
                   <Textarea 
                      id="desc" 
                      placeholder="Describe the role, requirements, and benefits..." 
                      className="min-h-[300px] rounded-2xl resize-none"
                      value={formData.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
                   />
                </div>
                <div className="flex gap-4">
                   <Button variant="outline" onClick={handleBack} className="flex-1 ios-button h-12">
                      Back
                   </Button>
                   <Button onClick={handleNext} className="flex-[2] ios-button h-12">
                      Review Job Posting
                   </Button>
                </div>
             </div>
           )}

           {step === "REVIEW" && (
             <div className="space-y-8">
                <div className="rounded-2xl bg-slate-50 p-6 space-y-6">
                   <div className="flex items-start justify-between">
                      <div>
                         <h3 className="text-2xl font-bold text-slate-900">{formData.title || "Job Title"}</h3>
                         <p className="text-primary font-semibold">{formData.company || "Company Name"}</p>
                      </div>
                      <Badge variant="secondary" className="rounded-md">{formData.type}</Badge>
                   </div>
                   <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {formData.location || "Location"}</div>
                      <div className="flex items-center gap-1.5"><LayoutGrid className="h-4 w-4" /> {formData.category}</div>
                      <div className="flex items-center gap-1.5"><DollarSign className="h-4 w-4" /> {formData.salary || "Not specified"}</div>
                   </div>
                   <div className="h-px bg-slate-200" />
                   <p className="text-sm text-slate-600 line-clamp-3 italic">
                      {formData.description || "No description provided."}
                   </p>
                </div>

                <div className="flex gap-4">
                   <Button variant="outline" onClick={handleBack} className="flex-1 ios-button h-12" disabled={isLoading}>
                      Back to Edit
                   </Button>
                   <Button onClick={handleSubmit} className="flex-[2] ios-button h-12" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Publish Job Listing"}
                   </Button>
                </div>
             </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
