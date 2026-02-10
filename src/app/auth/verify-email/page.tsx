"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

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
          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push("/auth/login?verified=true");
          }, 2000);
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
  }, [searchParams, router]);

  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center bg-slate-50/50 px-4 py-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent rounded-full blur-[100px]" />
      </div>

      <Card className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
              status === "loading" 
                ? "bg-primary/10 text-primary" 
                : status === "success"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}>
              {status === "loading" && <Loader2 className="h-7 w-7 animate-spin" />}
              {status === "success" && <CheckCircle2 className="h-7 w-7" />}
              {status === "error" && <XCircle className="h-7 w-7" />}
            </div>
          </div>
          <CardTitle className="text-2xl font-black tracking-tight">
            {status === "loading" && "Verifying Email..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-sm">
            {status === "loading" && "Please wait while we verify your email address."}
            {status === "success" && message}
            {status === "error" && message}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {status === "success" && (
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-4">Redirecting you to login...</p>
              <Button className="w-full h-12 text-lg ios-button shadow-xl shadow-primary/20" asChild>
                <Link href="/auth/login?verified=true">Continue to Login</Link>
              </Button>
            </div>
          )}
          {status === "error" && (
            <div className="space-y-3">
              <Button className="w-full h-12 text-lg ios-button shadow-xl shadow-primary/20" asChild>
                <Link href="/auth/login">Go to Login</Link>
              </Button>
              <Button variant="outline" className="w-full h-12 text-base rounded-xl" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
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
      <div className="flex min-h-[calc(100vh-96px)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
