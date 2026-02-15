"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Key } from "lucide-react";
import { toast } from "sonner";

function ChangePasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (password !== confirmPassword) {
        return toast.error("Passwords do not match");
      }
  
      setIsLoading(true);
      try {
        const resp = await fetch("/api/auth/change-password/verify", {
          method: "POST",
          body: JSON.stringify({ token, password }),
          headers: { "Content-Type": "application/json" },
        });
        const data = await resp.json();
        
        if (data.ok) {
          toast.success("Password updated successfully!");
          router.push("/settings/security");
        } else {
          toast.error(data.message);
        }
      } catch (e) {
        toast.error("An error occurred");
      } finally {
        setIsLoading(false);
      }
    };
  
    if (!token) return <div className="p-8 text-center text-red-500 font-bold">Invalid or missing token.</div>;
  
    return (
      <Card className="ios-card w-full max-w-md mx-auto mt-20">
        <CardHeader className="text-center">
           <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Key className="h-6 w-6" />
           </div>
           <CardTitle className="text-2xl font-black">Set New Password</CardTitle>
           <CardDescription>Enter a strong password to secure your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-xl h-11"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full ios-button h-11 text-lg">
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
}

export default function ChangePasswordPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-start justify-center px-4">
            <Suspense fallback={<Loader2 className="mt-20 h-10 w-10 animate-spin text-primary opacity-20" />}>
                <ChangePasswordForm />
            </Suspense>
        </div>
    );
}
