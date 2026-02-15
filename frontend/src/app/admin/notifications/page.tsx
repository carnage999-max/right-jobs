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
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-4">
         <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">System Broadcast</h1>
            <p className="text-slate-500 font-medium text-xs sm:text-sm">Dispatch critical platform announcements.</p>
         </div>
         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Bell className="h-5 w-5" />
         </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
         <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Segment</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col gap-2">
               {targetOptions.map((opt) => (
                 <button
                   key={opt.id}
                   onClick={() => setTarget(opt.id as any)}
                   className={cn(
                     "flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left",
                     target === opt.id 
                       ? "bg-white border-primary shadow-md" 
                       : "bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100"
                   )}
                 >
                   <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", opt.color)}>
                      <opt.icon className="h-4 w-4" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate text-xs sm:text-sm">{opt.label}</p>
                   </div>
                   {target === opt.id && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                 </button>
               ))}
            </div>
         </div>

         <div className="lg:col-span-2">
            <Card className="ios-card shadow-lg shadow-slate-200/40 border-none sm:border overflow-hidden">
               <CardHeader className="px-5 py-5 text-slate-900 bg-slate-50/30 border-b">
                  <CardTitle className="text-lg font-black">Message Composer</CardTitle>
               </CardHeader>
               <CardContent className="px-5 py-5 space-y-5">
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Email Subject</Label>
                     <Input 
                        placeholder="Urgent Maintenance / Update..."
                        className="rounded-xl h-11 font-bold border-2 focus-visible:ring-primary shadow-sm"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Content (HTML Supported)</Label>
                     <Textarea 
                        placeholder="Write your announcement here..."
                        className="min-h-[120px] sm:min-h-[150px] rounded-xl resize-none font-medium p-4 border-2 focus-visible:ring-primary shadow-sm leading-relaxed"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                     />
                  </div>
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        Reaching <span className="text-primary italic">~1,200</span> active sessions
                     </p>
                     <Button 
                        onClick={handleSend} 
                        disabled={isSending}
                        className="ios-button h-12 px-8 w-full sm:w-auto text-sm font-black shadow-lg shadow-primary/10"
                     >
                        {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
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
