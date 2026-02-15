"use client";

import { useState, useRef } from "react";
import { 
  MessageSquareWarning, 
  X, 
  Camera, 
  Send, 
  Loader2,
  CheckCircle2,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ReportIssue() {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be smaller than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error("Please describe the issue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/report-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, screenshot }),
      });

      const data = await response.json();

      if (data.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          resetForm();
        }, 2000);
      } else {
        toast.error(data.message || "Failed to send report");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setDescription("");
    setScreenshot(null);
    setIsSuccess(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <button 
          className="fixed bottom-6 right-6 z-[100] group flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 hover:bg-slate-800 border border-white/10"
        >
           <MessageSquareWarning className="h-5 w-5 text-white animate-pulse" />
           <span className="max-w-0 overflow-hidden whitespace-nowrap font-bold text-sm tracking-tight transition-all group-hover:max-w-xs group-hover:ml-1 text-white">
              Report Issue
           </span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] w-full max-h-[90vh] overflow-y-auto rounded-[2.5rem] border-none shadow-2xl p-0 bg-white/95 backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary z-10" />
        
        {isSuccess ? (
          <div className="py-20 flex flex-col items-center justify-center text-center px-8 animate-in fade-in zoom-in duration-500">
             <div className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center mb-6 shadow-xl shadow-green-100">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
             </div>
             <h2 className="text-2xl font-black text-slate-900 tracking-tight">Report Received</h2>
             <p className="text-slate-500 mt-2 font-medium">Thank you for helping us improve Right Jobs. Our team will review this immediately.</p>
          </div>
        ) : (
          <>
            <DialogHeader className="p-8 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <MessageSquareWarning className="h-6 w-6" />
                </div>
                <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">Report an Issue</DialogTitle>
              </div>
              <DialogDescription className="text-slate-500 font-medium">
                Found a bug or something isn't working? <br />
                Describe it clearly and we'll fix it ASAP.
              </DialogDescription>
            </DialogHeader>

            <div className="px-8 pb-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="issue-desc" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">What happened?</Label>
                <Textarea 
                  id="issue-desc"
                  placeholder="e.g. The 'Verify ID' button is not responding when clicked on mobile..." 
                  className="min-h-[120px] rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary transition-all resize-none p-4 font-medium"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Visual Evidence (Optional)</Label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "relative h-40 w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden bg-slate-50/50",
                    screenshot ? "border-primary/50" : "border-slate-200 hover:border-primary/30 hover:bg-slate-100/50"
                  )}
                >
                  {screenshot ? (
                    <>
                      <img src={screenshot} alt="Preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                         <Button size="sm" variant="secondary" className="ios-button text-xs" onClick={(e) => { e.stopPropagation(); setScreenshot(null); }}>Remove</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Camera className="h-8 w-8 text-slate-300 mb-2" />
                      <p className="text-xs font-bold text-slate-400">Click to attach screenshot</p>
                    </>
                  )}
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                </div>
                <div className="flex gap-2 items-start bg-blue-50/50 p-3 rounded-xl">
                   <Info className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                   <p className="text-[10px] font-bold text-blue-400 leading-normal uppercase tracking-wider">Reports are sent directly to our development team for priority resolution.</p>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="w-full h-14 ios-button text-lg font-black shadow-xl shadow-primary/20 group"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <>
                      Send Report <Send className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
