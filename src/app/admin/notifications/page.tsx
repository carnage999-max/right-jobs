"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  Send, 
  Users, 
  ShieldCheck, 
  Briefcase,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminNotificationsPage() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [target, setTarget] = useState<"ALL" | "JOB_SEEKERS" | "ADMINS">("ALL");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!subject || !content) return toast.error("Please fill in all fields");
    
    setIsSending(true);
    try {
      const resp = await fetch("/api/admin/notifications/broadcast", {
        method: "POST",
        body: JSON.stringify({ subject, content, target }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await resp.json();
      if (data.ok) {
        toast.success(data.message);
        setSubject("");
        setContent("");
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Failed to send broadcast");
    } finally {
      setIsSending(false);
    }
  };

  const targetOptions = [
    { id: "ALL", label: "All Users", icon: Users, color: "bg-blue-100 text-blue-600" },
    { id: "JOB_SEEKERS", label: "Job Seekers", icon: Briefcase, color: "bg-orange-100 text-orange-600" },
    { id: "ADMINS", label: "Administrators", icon: ShieldCheck, color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">System Broadcast</h1>
            <p className="text-slate-500 font-medium">Compose and dispatch critical platform announcements.</p>
         </div>
         <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Bell className="h-6 w-6" />
         </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
         <div className="space-y-4">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Target Segment</Label>
            <div className="flex flex-col gap-3">
               {targetOptions.map((opt) => (
                 <button
                   key={opt.id}
                   onClick={() => setTarget(opt.id as any)}
                   className={cn(
                     "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left",
                     target === opt.id 
                       ? "bg-white border-primary shadow-lg scale-[1.02]" 
                       : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                   )}
                 >
                   <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", opt.color)}>
                      <opt.icon className="h-5 w-5" />
                   </div>
                   <div className="flex-1">
                      <p className="font-bold text-slate-900">{opt.label}</p>
                      <p className="text-[10px] font-black uppercase tracking-wider opacity-60">Recipient Group</p>
                   </div>
                   {target === opt.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                 </button>
               ))}
            </div>
         </div>

         <div className="lg:col-span-2">
            <Card className="ios-card shadow-xl shadow-slate-200/50">
               <CardHeader className="px-8 pt-8">
                  <CardTitle className="text-xl font-black">Message Composer</CardTitle>
               </CardHeader>
               <CardContent className="px-8 pb-8 space-y-6">
                  <div className="space-y-3">
                     <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Email Subject</Label>
                     <Input 
                        placeholder="Urgent Maintenance / Update..."
                        className="rounded-2xl h-12 font-bold border-2 focus-visible:ring-primary shadow-sm"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                     />
                  </div>
                  <div className="space-y-3">
                     <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Content (HTML Supported)</Label>
                     <Textarea 
                        placeholder="Write your announcement here..."
                        className="min-h-[200px] rounded-[1.5rem] resize-none font-medium p-5 border-2 focus-visible:ring-primary shadow-sm leading-relaxed"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                     />
                  </div>
                  <div className="pt-4 border-t flex justify-between items-center">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Dispatching to approximately <span className="text-primary">1.2k</span> active sessions
                     </p>
                     <Button 
                        onClick={handleSend} 
                        disabled={isSending}
                        className="ios-button h-14 px-10 min-w-[200px] text-lg font-black shadow-xl shadow-primary/20"
                     >
                        {isSending ? <Loader2 className="mr-3 h-5 w-5 animate-spin" /> : <Send className="mr-3 h-5 w-5" />}
                        Execute Broadcast
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
