"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  LayoutGrid,
  Zap,
  Camera,
  X
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { countries, getCities } from "@/lib/locations";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Step = "BASIC_INFO" | "DESCRIPTION" | "REVIEW";

export default function UserPostJobPage() {
  const [step, setStep] = useState<Step>("BASIC_INFO");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    country: "",
    city: "",
    location: "", // Keep for backend compatibility
    type: "FULL_TIME",
    workMode: "ONSITE",
    category: "Engineering",
    salaryRange: "",
    salaryType: "YEARLY",
    description: "",
    companyLogoUrl: "",
    officeImageUrl: "",
    phoneNumber: "",
    contractDuration: ""
  });

  const [zipCode, setZipCode] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingOffice, setIsUploadingOffice] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleNext = () => {
    // Basic validation
    if (step === "BASIC_INFO") {
      if (!formData.title || !formData.companyName || !formData.location) {
        toast.error("Please fill in all required fields.");
        return;
      }
      setStep("DESCRIPTION");
    }
    else if (step === "DESCRIPTION") {
      if (formData.description.length < 50) {
        toast.error("Description should be at least 50 characters.");
        return;
      }
      setStep("REVIEW");
    }
  };

  const fetchLocationFromZip = async (zip: string) => {
    if (zip.length === 5) {
      setIsZipping(true);
      try {
        const resp = await fetch(`https://api.zippopotam.us/us/${zip}`);
        if (resp.ok) {
          const data = await resp.json();
          const place = data.places[0];
          setFormData(prev => ({ ...prev, location: `${place['place name']}, ${place['state abbreviation']}` }));
          toast.success(`Location set to ${place['place name']}`);
        }
      } catch (e) {
        console.error("Zip lookup failed");
      } finally {
        setIsZipping(false);
      }
    }
  };

  const handleBack = () => {
    if (step === "DESCRIPTION") setStep("BASIC_INFO");
    else if (step === "REVIEW") setStep("DESCRIPTION");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Job posted successfully!");
        router.push("/jobs");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to post job");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4">
      {/* Background patterns */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-2 duration-500">
              <Zap className="h-3 w-3 fill-primary" />
              Employer Center
           </div>
           <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
             Post a New <span className="text-primary italic">Opportunity</span>
           </h1>
           <p className="text-slate-500 text-lg font-medium max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
             Discover curated roles from innovative companies around the world.
           </p>
        </div>

        <div className="hidden">
           {/* Utility functions */}
        </div>

        {/* Stepper */}
        <div className="mb-12 flex items-center justify-center gap-4 md:gap-8 px-4 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
           {[
             { id: "BASIC_INFO", label: "Basics", icon: Building2 },
             { id: "DESCRIPTION", label: "Details", icon: LayoutGrid },
             { id: "REVIEW", label: "Publish", icon: CheckCircle2 }
           ].map((s, i) => (
             <div key={s.id} className="flex items-center gap-3">
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg transition-all duration-300",
                  step === s.id 
                    ? "bg-primary text-white scale-110 shadow-primary/30" 
                    : "bg-white text-slate-400"
                )}>
                  <s.icon className="h-5 w-5" />
                </div>
                {i < 2 && (
                  <div className={cn(
                    "hidden sm:block h-1 w-12 rounded-full transition-colors",
                    (i === 0 && step !== "BASIC_INFO") || (i === 1 && step === "REVIEW") ? "bg-primary" : "bg-white"
                  )} />
                )}
             </div>
           ))}
        </div>

        <Card className="rounded-[3rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] bg-white/70 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-10 duration-700 delay-400">
          <CardContent className="p-8 md:p-12">
             {step === "BASIC_INFO" && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="grid gap-6 md:grid-cols-2">
                     <div className="space-y-3">
                        <Label htmlFor="title" className="text-sm font-bold ml-1">Job Title</Label>
                        <Input 
                          id="title" 
                          placeholder="e.g. Lead Software Engineer" 
                          className="h-14 rounded-2xl bg-white border-slate-100 focus:ring-primary/20 transition-all font-medium text-lg px-6"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                        />
                     </div>
                      <div className="space-y-3">
                        <Label htmlFor="company" className="text-sm font-bold ml-1">Company Name</Label>
                        <Input 
                          id="company" 
                          placeholder="e.g. TechLabs Global" 
                          className="h-14 rounded-2xl bg-white border-slate-100 focus:ring-primary/20 transition-all font-medium text-lg px-6"
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        />
                     </div>
                  </div>

                  <div className="space-y-4">
                     <Label className="text-sm font-bold ml-1 text-slate-900 flex items-center gap-2">
                        Company Logo <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">(Recommended)</span>
                     </Label>
                     <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 transition-all hover:bg-white hover:border-primary/30 group">
                        <div className="relative h-20 w-20 shrink-0">
                           <div className="h-full w-full rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden border border-slate-100">
                              {formData.companyLogoUrl ? (
                                 <img src={formData.companyLogoUrl} alt="Logo" className="h-full w-full object-cover" />
                              ) : (
                                 <Building2 className="h-8 w-8 text-slate-200" />
                              )}
                           </div>
                           {isUploadingLogo && (
                              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
                                 <Loader2 className="h-5 w-5 animate-spin text-primary" />
                              </div>
                           )}
                        </div>
                        <div className="space-y-2">
                           <div className="flex flex-wrap gap-2">
                              <Button 
                                 variant="outline" 
                                 size="sm" 
                                 className="rounded-xl font-bold text-xs h-9 bg-white"
                                 onClick={() => document.getElementById('logo-upload')?.click()}
                                 disabled={isUploadingLogo}
                                 type="button"
                              >
                                 <Camera className="h-3.5 w-3.5 mr-2" />
                                 {formData.companyLogoUrl ? "Change Logo" : "Upload Logo"}
                              </Button>
                              {formData.companyLogoUrl && (
                                 <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="rounded-xl font-bold text-xs h-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => setFormData({...formData, companyLogoUrl: ""})}
                                    type="button"
                                 >
                                    <X className="h-3.5 w-3.5 mr-2" />
                                    Remove
                                 </Button>
                              )}
                           </div>
                           <p className="text-[10px] font-medium text-slate-400">PNG, JPG or SVG. Max 2MB.</p>
                        </div>
                        <input 
                           id="logo-upload"
                           type="file" 
                           accept="image/*"
                           className="hidden"
                           onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 2 * 1024 * 1024) return toast.error("Logo must be under 2MB");
                              
                              setIsUploadingLogo(true);
                              try {
                                 const presignResp = await fetch("/api/upload/presign", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ filename: file.name, contentType: file.type, folder: "avatars" })
                                 });
                                 const { url, publicUrl } = await presignResp.json();
                                 
                                 await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
                                 setFormData({...formData, companyLogoUrl: publicUrl});
                                 toast.success("Logo uploaded!");
                              } catch (e) {
                                 toast.error("Failed to upload logo");
                              } finally {
                                 setIsUploadingLogo(false);
                              }
                           }}
                        />
                     </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                     <div className="space-y-3">
                        <Label className="text-sm font-bold ml-1 text-slate-900">
                           Country <span className="text-slate-400 font-normal">(Job Location)</span>
                        </Label>
                        <SearchableSelect 
                           options={countries.map(c => c.name)}
                           value={formData.country}
                           onChange={(val) => {
                             setFormData(curr => ({
                               ...curr, 
                               country: val, 
                               city: "", // Reset city when country changes
                               location: val // Default location to just country until city is picked
                             }));
                           }}
                           placeholder="Select Country"
                        />
                     </div>
                     <div className="space-y-3">
                        <Label className="text-sm font-bold ml-1 text-slate-900">
                           City <span className="text-slate-400 font-normal">(Primary Office)</span>
                        </Label>
                        <SearchableSelect 
                           options={getCities(formData.country)}
                           value={formData.city}
                           onChange={(val) => {
                             setFormData(curr => ({
                               ...curr, 
                               city: val,
                               location: `${val}, ${curr.country}` // Combine for backend
                             }));
                           }}
                           placeholder={formData.country ? `Select City in ${formData.country}` : "Select Country First"}
                        />
                     </div>
                  </div>
                  
                  <div className="space-y-3">
                     <Label className="text-sm font-bold ml-1 text-slate-900">Work Mode</Label>
                        <Select value={formData.workMode} onValueChange={(val) => setFormData({...formData, workMode: val as any})}>
                          <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-100 focus:ring-primary/20 transition-all font-medium text-lg px-6">
                            <SelectValue placeholder="Select mode" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-none shadow-2xl">
                             <SelectItem value="ONSITE">On-site (Office)</SelectItem>
                             <SelectItem value="HYBRID">Hybrid (Office & Remote)</SelectItem>
                             <SelectItem value="REMOTE">Fully Remote</SelectItem>
                          </SelectContent>
                        </Select>
                     </div>

                  <div className="space-y-4">
                     <Label className="text-sm font-bold ml-1 text-slate-900 flex items-center gap-2">
                        Office/Building Photo <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">(Optional)</span>
                     </Label>
                     <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-slate-50 border-2 border-dashed border-slate-200 transition-all hover:bg-white hover:border-primary/30 group">
                        <div className="relative h-20 w-32 shrink-0">
                           <div className="h-full w-full rounded-2xl bg-white shadow-sm flex items-center justify-center overflow-hidden border border-slate-100">
                              {formData.officeImageUrl ? (
                                 <img src={formData.officeImageUrl} alt="Office" className="h-full w-full object-cover" />
                              ) : (
                                 <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-300">
                                    <Camera className="h-8 w-8" />
                                 </div>
                              )}
                           </div>
                           {isUploadingOffice && (
                              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl">
                                 <Loader2 className="h-5 w-5 animate-spin text-primary" />
                              </div>
                           )}
                        </div>
                        <div className="space-y-2">
                           <div className="flex flex-wrap gap-2">
                              <Button 
                                 variant="outline" 
                                 size="sm" 
                                 className="rounded-xl font-bold text-xs h-9 bg-white"
                                 onClick={() => document.getElementById('office-upload')?.click()}
                                 disabled={isUploadingOffice}
                                 type="button"
                              >
                                 <Camera className="h-3.5 w-3.5 mr-2" />
                                 {formData.officeImageUrl ? "Change Photo" : "Upload Photo"}
                              </Button>
                              {formData.officeImageUrl && (
                                 <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="rounded-xl font-bold text-xs h-9 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => setFormData({...formData, officeImageUrl: ""})}
                                    type="button"
                                 >
                                    <X className="h-3.5 w-3.5 mr-2" />
                                    Remove
                                 </Button>
                              )}
                           </div>
                           <p className="text-[10px] font-medium text-slate-400">Workspace photo, building, or team shot.</p>
                        </div>
                        <input 
                           id="office-upload"
                           type="file" 
                           accept="image/*"
                           className="hidden"
                           onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setIsUploadingOffice(true);
                              try {
                                 const presignResp = await fetch("/api/upload/presign", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ filename: file.name, contentType: file.type, folder: "avatars" })
                                 });
                                 const { url, publicUrl } = await presignResp.json();
                                 await fetch(url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
                                 setFormData({...formData, officeImageUrl: publicUrl});
                                 toast.success("Office photo uploaded!");
                              } catch (e) {
                                 toast.error("Failed to upload photo");
                              } finally {
                                 setIsUploadingOffice(false);
                              }
                           }}
                        />
                     </div>
                  </div>

                   <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-3">
                         <Label className="text-sm font-bold ml-1">Salary Type</Label>
                         <Select value={formData.salaryType} onValueChange={(val) => setFormData({...formData, salaryType: val as any})}>
                           <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-100 focus:ring-primary/20 transition-all font-medium text-lg px-6">
                             <SelectValue placeholder="Period" />
                           </SelectTrigger>
                           <SelectContent className="rounded-2xl border-none shadow-2xl">
                             <SelectItem value="HOURLY">Per Hour</SelectItem>
                             <SelectItem value="WEEKLY">Weekly</SelectItem>
                             <SelectItem value="MONTHLY">Monthly</SelectItem>
                             <SelectItem value="YEARLY">Yearly</SelectItem>
                           </SelectContent>
                         </Select>
                      </div>
                      <div className="space-y-3">
                         <Label htmlFor="salary" className="text-sm font-bold ml-1">Salary Amount / Range</Label>
                         <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input 
                              id="salary" 
                              placeholder={formData.salaryType === "HOURLY" ? "e.g. 45 - 65" : "e.g. 140k - 180k"} 
                              className="h-14 rounded-2xl bg-white border-slate-100 focus:ring-primary/20 transition-all font-medium text-lg pl-12 pr-6"
                              value={formData.salaryRange}
                              onChange={(e) => setFormData({...formData, salaryRange: e.target.value})}
                            />
                         </div>
                      </div>
                   </div>

                  <div className="grid gap-6 md:grid-cols-2">
                     <div className="space-y-3">
                        <Label className="text-sm font-bold ml-1">Job Type</Label>
                        <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val as any})}>
                          <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-100 focus:ring-primary/20 transition-all font-medium text-lg px-6">
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
                     <div className="space-y-3">
                        <Label className="text-sm font-bold ml-1">Category</Label>
                        <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                          <SelectTrigger className="h-14 rounded-2xl bg-white border-slate-100 focus:ring-primary/20 transition-all font-medium text-lg px-6">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-none shadow-2xl">
                             <SelectItem value="Engineering">Engineering & Tech</SelectItem>
                             <SelectItem value="Design">Design & Creative</SelectItem>
                             <SelectItem value="Product">Product Management</SelectItem>
                             <SelectItem value="Marketing">Marketing & Comms</SelectItem>
                             <SelectItem value="Management">Business Management</SelectItem>
                             <SelectItem value="Customer Support">Customer Support</SelectItem>
                             <SelectItem value="Sales">Sales & Business Dev</SelectItem>
                             <SelectItem value="Finance">Finance & Accounting</SelectItem>
                             <SelectItem value="Human Resources">Human Resources</SelectItem>
                             <SelectItem value="Operations">Operations</SelectItem>
                             <SelectItem value="Legal">Legal & Compliance</SelectItem>
                             <SelectItem value="Healthcare">Healthcare & Medical</SelectItem>
                             <SelectItem value="Education">Education & Training</SelectItem>
                             <SelectItem value="Hospitality">Hospitality & Tourism</SelectItem>
                             <SelectItem value="Construction">Construction & Trades</SelectItem>
                             <SelectItem value="Logistics">Logistics & Transport</SelectItem>
                             <SelectItem value="Arts">Arts & Entertainment</SelectItem>
                             <SelectItem value="Real Estate">Real Estate</SelectItem>
                             <SelectItem value="Science">Data & Life Science</SelectItem>
                          </SelectContent>
                        </Select>
                     </div>
                  </div>

                  <Button onClick={handleNext} className="w-full ios-button h-16 text-xl shadow-2xl shadow-primary/20 font-black tracking-tight group">
                     Continue to Description <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                  </Button>
               </div>
             )}

             {step === "DESCRIPTION" && (
               <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="space-y-3">
                     <div className="flex items-center justify-between ml-1">
                        <Label htmlFor="desc" className="text-sm font-bold">Job Description</Label>
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-black">Proper Markdown Supported</span>
                     </div>
                     <Textarea 
                        id="desc" 
                        placeholder="Detail the role, responsibilities, requirements, and what makes your company special..." 
                        className="min-h-[400px] rounded-[2rem] bg-white border-slate-100 focus:ring-primary/20 transition-all font-medium text-lg p-8 resize-none shadow-inner"
                        value={formData.description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
                     />
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                     <Button variant="ghost" onClick={handleBack} className="flex-1 h-14 text-lg font-bold text-slate-500 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="mr-2 h-5 w-5" /> Back to Basics
                     </Button>
                     <Button onClick={handleNext} className="flex-[2] ios-button h-16 text-xl shadow-2xl shadow-primary/20 font-black tracking-tight group">
                        Review Job Listing <ArrowRight className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1" />
                     </Button>
                  </div>
               </div>
             )}

             {step === "REVIEW" && (
               <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="text-center space-y-2">
                     <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-[2rem] bg-green-100 text-green-600 mb-4 animate-bounce">
                        <Zap className="h-10 w-10 fill-green-600" />
                     </div>
                     <h3 className="text-2xl font-black tracking-tight">Almost Ready!</h3>
                     <p className="text-slate-500 font-medium">Review how your listing will appear to candidates.</p>
                  </div>

                  <div className="rounded-[2.5rem] bg-slate-950 p-10 space-y-8 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110" />
                     
                     <div className="relative flex flex-col md:flex-row items-start justify-between gap-6">
                            <div className="flex items-center gap-4">
                               <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                  {formData.companyLogoUrl ? (
                                     <img src={formData.companyLogoUrl} alt="Logo" className="h-full w-full object-cover" />
                                  ) : (
                                     <Building2 className="h-6 w-6 text-white/20" />
                                  )}
                               </div>
                               <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                     <Building2 className="h-4 w-4 text-primary" />
                                     <p className="text-primary font-bold text-xl">{formData.companyName || "Company Name"}</p>
                                  </div>
                                  <h3 className="text-3xl font-black text-white tracking-tight">{formData.title || "Job Title"}</h3>
                               </div>
                            </div>
                        <Badge className="rounded-2xl bg-white/10 text-white border-none py-1.5 px-6 text-sm font-bold backdrop-blur-md">
                           {formData.type.replace('_', ' ')}
                        </Badge>
                     </div>

                      <div className="relative flex flex-wrap gap-6 text-sm text-slate-400 font-bold uppercase tracking-widest">
                        <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl"><MapPin className="h-4 w-4 text-white" /> 
                          {formData.workMode === 'REMOTE' ? 'Remote' : formData.location || "Location"}
                          {formData.workMode === 'HYBRID' && ' (Hybrid)'}
                        </div>
                        <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl"><LayoutGrid className="h-4 w-4 text-white" /> {formData.category}</div>
                        <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl">
                           <DollarSign className="h-4 w-4 text-white" /> 
                           {formData.salaryRange || "Not specified"}
                           {formData.salaryRange && ` / ${formData.salaryType.replace('LY', '').toLowerCase()}`}
                        </div>
                        {formData.contractDuration && formData.type === 'CONTRACT' && (
                           <div className="flex items-center gap-2 bg-white/5 py-2 px-4 rounded-xl">
                              <Briefcase className="h-4 w-4 text-white" /> 
                              {formData.contractDuration}
                           </div>
                        )}
                     </div>

                     {formData.officeImageUrl && (
                        <div className="relative h-48 w-full rounded-[2rem] overflow-hidden border border-white/10 group/office">
                           <img src={formData.officeImageUrl} alt="Office" className="h-full w-full object-cover transition-transform duration-500 group-hover/office:scale-110" />
                           <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                           <div className="absolute bottom-4 left-6 text-white text-[10px] font-black uppercase tracking-[0.2em]">Office / Workspace</div>
                        </div>
                     )}

                     <div className="h-px bg-white/10" />
                     
                     <div className="relative space-y-4">
                        <p className="text-slate-400 font-medium leading-relaxed">
                           {formData.description ? (
                             formData.description.length > 300 
                               ? formData.description.substring(0, 300) + "..." 
                               : formData.description
                           ) : "No description provided."}
                        </p>
                        <div className="inline-block px-4 py-2 rounded-xl bg-white/5 text-[10px] font-black tracking-[0.2em] text-white">Full Preview Available After Posting</div>
                     </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 pt-4">
                     <Button variant="ghost" onClick={handleBack} className="flex-1 h-14 text-lg font-bold text-slate-500 hover:text-slate-900 transition-colors" disabled={isLoading}>
                        <ArrowLeft className="mr-2 h-5 w-5" /> Back to Edit
                     </Button>
                     <Button onClick={handleSubmit} className="flex-[2] ios-button h-16 text-xl shadow-2xl shadow-primary/20 font-black tracking-tight group" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : "Publish Job Now"}
                        {!isLoading && <Zap className="ml-2 h-6 w-6 fill-white" />}
                     </Button>
                  </div>
               </div>
             )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
