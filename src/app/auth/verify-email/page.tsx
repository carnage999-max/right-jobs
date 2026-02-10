"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status: authStatus, update } = useSession();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link. No token provided.");
      return;
    }

    async function verifyEmail() {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok || data.ok) {
          setStatus("success");
          setMessage("Your email has been verified successfully!");
          
          // Force a session update so the verification banner disappears
          if (authStatus === "authenticated") {
            await update({ emailVerified: true });
          }
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed. The link may have expired.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Something went wrong. Please try again.");
      }
    }

    verifyEmail();
  }, [searchParams, authStatus, update]);

  // Countdown logic for success
  useEffect(() => {
    if (status !== "success") return;

    if (countdown <= 0) {
      const target = authStatus === "authenticated" ? "/app" : "/auth/login?verified=true";
      router.push(target);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [status, countdown, router, authStatus]);

  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center bg-slate-50/50 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="w-full max-w-md rounded-[2.5rem] border-none bg-white/70 backdrop-blur-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] relative overflow-hidden">
        {/* Top Progress bar for success state */}
        {status === "success" && (
           <div className="absolute top-0 left-0 h-1.5 bg-green-500 transition-all duration-1000 ease-linear" style={{ width: `${(countdown / 5) * 100}%` }} />
        )}

        <CardHeader className="space-y-4 text-center pb-2 pt-10">
          <div className="flex justify-center">
            <div className={cn(
                "flex h-20 w-20 items-center justify-center rounded-[2rem] transition-all duration-1000 scale-in",
                status === "loading" && "bg-primary/10 text-primary rotate-slow",
                status === "success" && "bg-green-100 text-green-600 scale-110",
                status === "error" && "bg-red-50 text-red-600"
            )}>
              {status === "loading" && <Loader2 className="h-10 w-10 animate-spin" />}
              {status === "success" && <CheckCircle2 className="h-10 w-10" />}
              {status === "error" && <XCircle className="h-10 w-10" />}
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-black tracking-tighter text-slate-900">
                {status === "loading" && "Securing Account"}
                {status === "success" && "Verified!"}
                {status === "error" && "Access Denied"}
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium px-4">
                {status === "loading" && "Validating your identity through our secure systems..."}
                {status === "success" && message}
                {status === "error" && message}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-10 pb-10 pt-6">
          {status === "success" && (
            <div className="space-y-6 text-center">
              <div className="p-4 rounded-3xl bg-green-50/50 border border-green-100 text-green-800 text-sm font-bold flex items-center justify-center gap-2">
                 <span>Redirecting in {countdown}s</span>
                 <div className="flex gap-1">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-1 w-1 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                 </div>
              </div>
              
              <Button className="w-full h-14 text-lg ios-button shadow-2xl shadow-primary/20 font-black tracking-tight" onClick={() => router.push(authStatus === "authenticated" ? "/app" : "/auth/login?verified=true")}>
                {authStatus === "authenticated" ? "Go to Dashboard" : "Login to Continue"}
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <Button className="w-full h-14 text-lg ios-button shadow-xl shadow-primary/20 font-black tracking-tight" asChild>
                <Link href={authStatus === "authenticated" ? "/app" : "/auth/login"}>
                    {authStatus === "authenticated" ? "Return Home" : "Back to Login"}
                </Link>
              </Button>
              <Button variant="ghost" className="w-full h-12 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors" asChild>
                <Link href="/contact">Need help? Contact support</Link>
              </Button>
            </div>
          )}

          {status === "loading" && (
             <div className="flex flex-col items-center gap-4 mt-4">
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary animate-progress-indefinite w-1/3" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">End-to-end Encrypted</p>
             </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary opacity-30" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Initializing Security</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
