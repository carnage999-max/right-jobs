"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Camera, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck,
  Plus,
  X,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

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
        body: JSON.stringify({ name, bio, location, skills }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await resp.json();
      if (data.ok) {
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

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Your Identity</h1>
          <p className="text-slate-500 font-medium">Your professional profile is how you stand out from the crowd.</p>
        </div>
        <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold shadow-sm transition-all",
            isVerified 
              ? "bg-green-50 border-green-100 text-green-700" 
              : "bg-amber-50 border-amber-100 text-amber-700"
        )}>
           {isVerified ? <ShieldCheck className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
           {isVerified ? "Trusted & Verified" : "Verification Pending"}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Avatar & Quick Info */}
        <div className="space-y-6">
           <Card className="ios-card overflow-hidden shadow-xl shadow-slate-200/50">
              <CardContent className="p-8 text-center bg-gradient-to-b from-primary/5 to-transparent">
                 <div className="relative mx-auto mb-6 h-32 w-32">
                    <Avatar className="h-full w-full border-4 border-white shadow-2xl">
                       <AvatarImage src={profileData?.user?.avatarUrl} />
                       <AvatarFallback className="bg-primary/10 text-primary text-3xl font-black">
                          {name?.[0] || session?.user?.email?.[0]?.toUpperCase()}
                       </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95">
                       <Camera className="h-5 w-5" />
                    </button>
                 </div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">{name || "Unnamed"}</h3>
                 <p className="text-sm text-slate-400 font-bold mt-1">{session?.user?.email}</p>
              </CardContent>
           </Card>

           <Card className="ios-card bg-slate-900 text-white border-none shadow-2xl shadow-slate-900/20">
              <CardHeader className="pb-2">
                 <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Platform Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="flex items-end gap-2">
                    <span className="text-5xl font-black tracking-tighter text-white">{isVerified ? "98%" : "45%"}</span>
                    <span className="mb-2 text-xs font-bold text-slate-500 uppercase">Trusted</span>
                 </div>
                 <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className={cn("h-full transition-all duration-1000", isVerified ? "w-[98%] bg-primary" : "w-[45%] bg-amber-500")}></div>
                 </div>
                 <div className="flex gap-2 items-start bg-slate-800/50 p-4 rounded-xl">
                    <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider">
                        {isVerified 
                          ? "You are appearing in the top segment of candidate searches."
                          : "Complete ID verification to reach 100% visibility."}
                    </p>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Right: Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
           <Card className="ios-card shadow-lg border-slate-100">
              <CardHeader className="px-8 pt-8">
                 <CardTitle className="text-2xl font-black tracking-tight text-slate-900">Professional Dossier</CardTitle>
                 <CardDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Updates are visible immediately to recruiters</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-8">
                 <div className="grid gap-6 sm:grid-cols-2 mt-4">
                    <div className="space-y-3">
                       <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-400">Display Name</Label>
                       <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                          className="rounded-2xl h-12 font-bold border-2 focus-visible:ring-primary shadow-sm" 
                       />
                    </div>
                    <div className="space-y-3">
                       <Label htmlFor="location" className="text-xs font-black uppercase tracking-widest text-slate-400">Base Location</Label>
                       <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input 
                            id="location" 
                            value={location} 
                            onChange={(e) => setLocation(e.target.value)}
                            className="pl-11 rounded-2xl h-12 font-bold border-2 focus-visible:ring-primary shadow-sm" 
                            placeholder="City, Country"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <Label htmlFor="bio" className="text-xs font-black uppercase tracking-widest text-slate-400">Professional Summary</Label>
                    <Textarea 
                       id="bio" 
                       placeholder="A brief overview of your expertise and aspirations..." 
                       className="min-h-[140px] rounded-[1.5rem] resize-none font-medium p-5 border-2 focus-visible:ring-primary shadow-sm leading-relaxed"
                       value={bio}
                       onChange={(e) => setBio(e.target.value)}
                    />
                 </div>

                 <div className="space-y-5">
                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Core Expertise & Skills</Label>
                    <div className="flex flex-wrap gap-2.5">
                       {skills.map((skill) => (
                         <Badge key={skill} variant="secondary" className="pl-4 pr-2 py-2 flex items-center gap-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border-none group">
                           {skill}
                           <button onClick={() => removeSkill(skill)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                             <X className="h-4 w-4" />
                           </button>
                         </Badge>
                       ))}
                       {skills.length === 0 && (
                           <p className="text-xs font-bold text-slate-400 italic">No skills added yet.</p>
                       )}
                    </div>
                    <div className="flex gap-3">
                       <Input 
                          placeholder="Type skill & press Enter" 
                          className="flex-1 rounded-2xl h-12 font-bold border-2 border-dashed"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                       />
                       <Button variant="outline" className="ios-button h-12 w-12 rounded-2xl border-2 shrink-0" onClick={addSkill}>
                          <Plus className="h-5 w-5" />
                       </Button>
                    </div>
                 </div>

                 <div className="pt-6 border-t flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving} className="ios-button h-14 px-10 min-w-[160px] text-lg font-black shadow-xl shadow-primary/20">
                       {isSaving ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : "Commit Changes"}
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="ios-card bg-primary/5 border-primary/10 overflow-hidden group">
              <CardHeader className="px-8 pt-6">
                 <CardTitle className="text-lg font-black tracking-tight text-slate-900">Career Credentials</CardTitle>
                 <CardDescription className="font-bold text-xs text-primary/70">Secure document cloud storage enabled</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                 <div className="flex items-center justify-between p-5 bg-white rounded-2xl border-2 border-primary/10 shadow-sm transition-all group-hover:shadow-md">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <CheckCircle2 className="h-6 w-6" />
                       </div>
                       <div>
                          <p className="text-sm font-black text-slate-900">Global_Portfolio_Standard.pdf</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Verified System Sync</p>
                       </div>
                    </div>
                    <Button variant="ghost" className="font-black text-primary text-xs tracking-widest uppercase hover:bg-primary/5">Replace</Button>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
