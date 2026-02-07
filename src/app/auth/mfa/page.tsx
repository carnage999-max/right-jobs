"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ShieldCheck, Loader2, Send, Lock } from "lucide-react";
import { toast } from "sonner";

export default function AdminMFAPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // If already verified, redirect to dashboard
  useEffect(() => {
    if (session?.user?.mfaComplete) {
      router.push("/admin");
    }
  }, [session, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resp = await fetch("/api/auth/mfa/verify", {
        method: "POST",
        body: JSON.stringify({ otp }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await resp.json();
      
      if (data.ok) {
        toast.success("Identity confirmed");
        // Update session to reflect mfaComplete: true
        await update({ mfaComplete: true });
        router.push("/admin");
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const resp = await fetch("/api/auth/mfa/resend", { method: "POST" });
      const data = await resp.json();
      if (data.ok) {
        toast.success("New code sent to your email");
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Visual flair */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px]" />
         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
      </div>

      <Card className="ios-card w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl">
        <CardHeader className="text-center pt-10">
           <div className="mx-auto h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary mb-6 shadow-inner ring-1 ring-primary/30">
              <Lock className="h-8 w-8" />
           </div>
           <CardTitle className="text-3xl font-black text-white tracking-tight">Security Protocol</CardTitle>
           <CardDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Administrative Multi-Factor</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
           <p className="text-center text-slate-300 font-medium mb-8">
              A 6-digit signature has been sent to your administrative email. Please enter it below to authorize this session.
           </p>
           <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2">
                 <Input 
                   type="text" 
                   maxLength={6}
                   placeholder="000000"
                   className="h-16 text-center text-3xl font-black tracking-[0.5em] bg-slate-800 border-slate-700 text-white rounded-2xl focus-visible:ring-primary"
                   value={otp}
                   onChange={(e) => setOtp(e.target.value)}
                   autoFocus
                 />
              </div>
              <Button type="submit" disabled={isLoading || otp.length !== 6} className="w-full h-14 text-lg font-black ios-button shadow-xl shadow-primary/20">
                 {isLoading ? <Loader2 className="animate-spin" /> : "Authorize Session"}
              </Button>
           </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pb-10">
           <button 
             onClick={handleResend} 
             disabled={isResending}
             className="text-slate-400 hover:text-white transition-colors text-sm font-bold flex items-center gap-2"
           >
              {isResending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Resend verification code
           </button>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest text-center mt-4">
              Authorized access only. All actions are logged under the platform audit protocol.
           </p>
        </CardFooter>
      </Card>
    </div>
  );
}
