"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Camera, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck,
  Plus,
  X,
  AlertCircle,
  Edit2
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeFilename, setResumeFilename] = useState<string | null>(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isRenamingResume, setIsRenamingResume] = useState(false);
  const [newResumeName, setNewResumeName] = useState("");
  const resumeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const resp = await fetch("/api/profile");
        const data = await resp.json();
        if (data.ok) {
          setProfileData(data.data);
          setName(data.data.user.name || "");
          setBio(data.data.bio || "");
          setLocation(data.data.location || "");
          setSkills(data.data.skills || []);
          setAvatarUrl(data.data.user.avatarUrl || null);
          setResumeUrl(data.data.resumeUrl || null);
          setResumeFilename(data.data.resumeFilename || null);
        }
      } catch (e) {
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const resp = await fetch("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({ name, bio, location, skills, resumeUrl }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await resp.json();
      if (data.ok) {
        await update({ name });
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleResumeClick = () => {
    resumeInputRef.current?.click();
  };

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Resume must be less than 10MB");
      return;
    }

    setIsUploadingResume(true);
    try {
      const presignResp = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder: "resumes"
        }),
      });

      const presignData = await presignResp.json();
      if (!presignData.ok) throw new Error("Failed to get upload URL");

      const uploadResp = await fetch(presignData.url, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadResp.ok) throw new Error("Failed to upload file");

      const updateResp = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          resumeUrl: presignData.publicUrl,
          resumeFilename: file.name
        }),
      });

      const updateData = await updateResp.json();
      if (updateData.ok) {
        setResumeUrl(presignData.publicUrl);
        setResumeFilename(file.name);
        toast.success("Resume updated!");
      } else {
        throw new Error("Failed to save resume");
      }
    } catch (error) {
      toast.error("Failed to upload resume");
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      // Step 1: Get presigned URL
      const presignResp = await fetch("/api/upload/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
          folder: "avatars"
        }),
      });

      const presignData = await presignResp.json();
      if (!presignData.ok) {
        throw new Error("Failed to get upload URL");
      }

      // Step 2: Upload to S3
      const uploadResp = await fetch(presignData.url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResp.ok) {
        throw new Error("Failed to upload image");
      }

      // Step 3: Update avatar URL in database
      const updateResp = await fetch("/api/profile/avatar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: presignData.publicUrl }),
      });

      const updateData = await updateResp.json();
      if (updateData.ok) {
        setAvatarUrl(updateData.avatarUrl);
        await update({ image: updateData.avatarUrl });
        toast.success("Profile picture updated!");
      } else {
        throw new Error("Failed to save avatar");
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRenameResume = async () => {
    if (!newResumeName.trim()) return;
    
    // Add .pdf extension if missing
    let finalName = newResumeName.trim();
    if (!finalName.toLowerCase().endsWith(".pdf")) {
      finalName += ".pdf";
    }

    try {
      const resp = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeFilename: finalName }),
      });
      const data = await resp.json();
      if (data.ok) {
        setResumeFilename(finalName);
        setIsRenamingResume(false);
        toast.success("Resume renamed!");
      } else {
        toast.error("Failed to rename resume");
      }
    } catch (e) {
      toast.error("Error renaming resume");
    }
  };

  const handlePreviewResume = async () => {
    try {
      const resp = await fetch("/api/profile/resume-download");
      const data = await resp.json();
      if (data.ok && data.url) {
        window.open(data.url, "_blank");
      } else {
        toast.error("Failed to get preview link");
      }
    } catch (e) {
      toast.error("Error opening resume");
    }
  };

  const addSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

   const isVerified = profileData?.verificationStatus === "VERIFIED";

   const calculateTrustScore = () => {
      let score = 10; // Base score
      if (name) score += 20;
      if (bio) score += 20;
      if (location) score += 10;
      if (skills.length > 0) score += 10;
      if (resumeUrl) score += 10;
      if (isVerified) score += 20;
      return Math.min(score, 100);
   };

   const trustScore = calculateTrustScore();

   return (
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">Your Identity</h1>
          <p className="text-sm text-slate-500 font-medium">Manage your professional presence.</p>
        </div>
        <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold shadow-sm w-fit transition-colors",
            isVerified 
              ? "bg-green-50 border-green-100 text-green-700" 
              : "bg-amber-50 border-amber-100 text-amber-700"
        )}>
           {isVerified ? <ShieldCheck className="h-3.5 w-3.5" /> : <Loader2 className="h-3.5 w-3.5 animate-spin" />}
           {isVerified ? "Verified" : "Pending"}
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100/80 rounded-2xl h-12 sm:h-14">
           <TabsTrigger value="profile" className="rounded-xl font-bold text-xs sm:text-sm h-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              Edit Profile
           </TabsTrigger>
           <TabsTrigger value="visibility" className="rounded-xl font-bold text-xs sm:text-sm h-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all">
              Visibility & Stats
           </TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="space-y-6 outline-none">
           {/* Avatar & Basic Info Card */}
           <Card className="ios-card shadow-lg border-slate-100">
               <CardContent className="p-5 sm:p-8 pt-6 sm:pt-8 space-y-6">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                      <div className="relative group">
                        <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full ring-4 ring-white shadow-xl overflow-hidden bg-slate-100">
                           <Avatar className="h-full w-full">
                              <AvatarImage src={avatarUrl || undefined} className="object-cover" />
                              <AvatarFallback className="bg-primary/10 text-primary text-3xl font-black">
                                 {name?.[0] || session?.user?.email?.[0]?.toUpperCase()}
                              </AvatarFallback>
                           </Avatar>
                        </div>
                        <button 
                          onClick={handleAvatarClick}
                          disabled={isUploadingAvatar}
                          className="absolute bottom-0 right-0 h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-transform active:scale-95"
                        >
                           {isUploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                      </div>
                      
                      <div className="flex-1 w-full space-y-4 text-center sm:text-left">
                         <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                               <Label htmlFor="name" className="text-xs font-black uppercase text-slate-400">Display Name</Label>
                               <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="font-bold border-slate-200 focus:border-primary" />
                            </div>
                            <div className="space-y-2">
                               <Label htmlFor="location" className="text-xs font-black uppercase text-slate-400">Location</Label>
                               <div className="relative">
                                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                  <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="pl-9 font-bold border-slate-200 focus:border-primary" placeholder="City, Country" />
                               </div>
                            </div>
                         </div>
                      </div>
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="bio" className="text-xs font-black uppercase text-slate-400">About Me</Label>
                     <Textarea 
                        id="bio" 
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)} 
                        className="min-h-[100px] resize-none font-medium border-slate-200 focus:border-primary" 
                        placeholder="Share your professional story..."
                     />
                  </div>
               </CardContent>
           </Card>

           {/* Skills Card */}
           <Card className="ios-card shadow-sm">
              <CardHeader className="pb-3">
                 <CardTitle className="text-base font-black">Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="px-3 py-1.5 rounded-lg text-sm bg-slate-100 text-slate-700 group hover:bg-slate-200">
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="ml-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {skills.length === 0 && <span className="text-sm text-slate-400 italic">No skills added.</span>}
                 </div>
                 <div className="flex gap-2">
                    <Input 
                       value={newSkill} 
                       onChange={(e) => setNewSkill(e.target.value)} 
                       onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                       placeholder="Add a skill" 
                       className="h-10"
                    />
                    <Button onClick={addSkill} size="icon" variant="outline" className="h-10 w-10 border-dashed">
                       <Plus className="h-4 w-4" />
                    </Button>
                 </div>
              </CardContent>
           </Card>

           {/* Resume Card */}
           <Card className="ios-card bg-primary/5 border-primary/10">
              <CardContent className="p-5 flex items-center justify-between gap-4">
                 <div className="flex items-center gap-4 overflow-hidden">
                    <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
                       <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div className="overflow-hidden">
                       <p className="font-bold text-sm text-slate-900 truncate">
                          {resumeFilename || (resumeUrl ? "Resume.pdf" : "No Resume")}
                       </p>
                       <p className="text-[10px] uppercase font-bold text-primary/70">
                          {resumeUrl ? "Synced" : "Upload Expected"}
                       </p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                     <input ref={resumeInputRef} type="file" accept=".pdf" onChange={handleResumeChange} className="hidden" />
                     {resumeUrl && (
                        <Button variant="ghost" size="sm" onClick={handlePreviewResume} className="text-xs font-bold">View</Button>
                     )}
                     <Button size="sm" onClick={handleResumeClick} disabled={isUploadingResume} className="text-xs font-bold">
                        {isUploadingResume ? <Loader2 className="h-3 w-3 animate-spin" /> : (resumeUrl ? "Update" : "Upload")}
                     </Button>
                 </div>
              </CardContent>
           </Card>

           <div className="pt-4 flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto ios-button h-12 px-8 shadow-xl shadow-primary/20 text-lg font-black">
                 {isSaving ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Save Changes"}
              </Button>
           </div>
        </TabsContent>

        {/* VISIBILITY TAB */}
        <TabsContent value="visibility" className="space-y-6 outline-none">
            <Card className="ios-card bg-slate-900 text-white border-none shadow-2xl">
               <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Visibility Score</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="flex items-end gap-2">
                     <span className="text-5xl font-black tracking-tighter text-white">{trustScore}%</span>
                     <span className="mb-2 text-xs font-bold text-slate-500 uppercase">Profile Strength</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                     <div className={cn("h-full transition-all duration-1000", trustScore > 70 ? "bg-primary" : "bg-amber-500")} style={{ width: `${trustScore}%` }}></div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                      {trustScore >= 90 
                        ? "You are appearing in the top segment of candidate searches."
                        : "Complete all profile sections and verify your ID to reach 100% visibility."}
                  </p>
               </CardContent>
            </Card>

            <Card className="ios-card">
               <CardHeader>
                  <CardTitle className="text-lg font-bold">Why it matters?</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="flex gap-3">
                     <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0"><CheckCircle2 className="h-4 w-4" /></div>
                     <p className="text-sm text-slate-600">Higher scores rank you higher in recruiter searches.</p>
                  </div>
                  <div className="flex gap-3">
                     <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><ShieldCheck className="h-4 w-4" /></div>
                     <p className="text-sm text-slate-600">Verified profiles get 2x more interview requests.</p>
                  </div>
               </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
   );
}
