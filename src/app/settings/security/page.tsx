"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Mail, 
  Smartphone, 
  History,
  Loader2,
  AlertCircle,
  HelpCircle,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function SecuritySettingsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async () => {
    setIsLoading(true);
    try {
      const resp = await fetch("/api/auth/change-password/initiate", {
        method: "POST"
      });
      const data = await resp.json();
      
      if (data.ok) {
        toast.success("A confirmation link has been sent to your email.");
      } else {
        toast.error(data.message || "Failed to initiate password change");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Security & Privacy</h1>
        <p className="text-slate-500">Manage your account security, passwords, and sessions.</p>
      </div>

      <div className="grid gap-8">
        {/* Passwords & Authentication */}
        <section className="space-y-4">
           <h2 className="text-lg font-bold flex items-center gap-2"><Lock className="h-5 w-5 text-primary" /> Login & Authentication</h2>
           <Card className="ios-card">
              <CardContent className="p-0 divide-y">
                 <div className="p-6">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                       <div className="space-y-1">
                          <p className="font-bold text-slate-900">Change Password</p>
                          <p className="text-sm text-slate-500">
                             For security, changing your password will trigger a confirmation link to your email <span className="font-semibold text-slate-700">{session?.user?.email || "loading..."}</span>.
                          </p>
                       </div>
                       <Button onClick={handlePasswordChange} disabled={isLoading} className="ios-button min-w-[180px]">
                          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Request Link"}
                       </Button>
                    </div>
                 </div>

                 <div className="p-6">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                       <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <p className="font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
                             <span className="bg-slate-100 text-slate-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md self-center">Coming Soon</span>
                          </div>
                          <p className="text-sm text-slate-500">
                             Add an extra layer of security to your account with email OTP or an authenticator app.
                          </p>
                       </div>
                       <Button disabled variant="outline" className="ios-button min-w-[180px]">
                          Setup 2FA
                       </Button>
                    </div>
                 </div>
              </CardContent>
           </Card>
        </section>

        {/* Global Security Settings */}
        <section className="space-y-4">
           <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900"><ShieldCheck className="h-5 w-5 text-green-600" /> Account Verification</h2>
           <Card className="ios-card overflow-hidden">
              <div className="bg-green-50 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-green-100">
                 <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                       <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                       <p className="font-bold text-green-800">Identity Verified</p>
                       <p className="text-xs text-green-600">Your account is fully verified. You can apply to all jobs.</p>
                    </div>
                 </div>
                 <Button variant="outline" className="ios-button bg-white text-green-700 hover:bg-green-100/50 border-green-200">
                    View Badge
                 </Button>
              </div>
              <CardContent className="p-6">
                 <p className="text-sm text-slate-500 mb-6 font-medium">Verified accounts have access to premium features including:</p>
                 <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      "Trust Badge on Profile",
                      "Priority Application Sorting",
                      "Unlimited Skills Listing",
                      "Direct Messages to HR"
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        {feature}
                      </div>
                    ))}
                 </div>
              </CardContent>
           </Card>
        </section>

        {/* Session Management */}
        <section className="space-y-4">
           <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900"><History className="h-5 w-5 text-amber-500" /> Active Sessions</h2>
              <Button variant="ghost" className="text-red-600 hover:text-red-700 text-xs font-bold uppercase tracking-wider">Sign out all devices</Button>
           </div>
           <Card className="ios-card">
              <CardContent className="p-0 divide-y">
                 {[
                   { device: "MacBook Pro • NYC, USA", browser: "Chrome", current: true, time: "Active now" },
                   { device: "iPhone 15 Pro • NYC, USA", browser: "Mobile Safari", current: false, time: "Last active 2 hrs ago" },
                 ].map((session, i) => (
                   <div key={i} className="p-6 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/5 transition-colors">
                            {session.device.includes("iPhone") ? <Smartphone className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                         </div>
                         <div>
                            <div className="flex items-center gap-2">
                               <p className="font-bold text-slate-900">{session.device}</p>
                               {session.current && <span className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">Current Session</span>}
                            </div>
                            <p className="text-xs text-slate-400 font-medium">{session.browser} • {session.time}</p>
                         </div>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                         <ChevronRight className="h-4 w-4" />
                      </Button>
                   </div>
                 ))}
              </CardContent>
           </Card>
        </section>

        {/* Help/Inquiry Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-8 rounded-2xl bg-slate-100 border border-slate-200 gap-6">
           <div className="flex items-center gap-4">
              <HelpCircle className="h-10 w-10 text-slate-400" />
              <div>
                 <p className="font-bold text-slate-900">Need help with security?</p>
                 <p className="text-xs text-slate-500">Our security team is here 24/7 if you notice suspicious activity.</p>
              </div>
           </div>
           <Button className="ios-button h-11 px-8">Contact Security</Button>
        </div>
      </div>
    </div>
  );
}
