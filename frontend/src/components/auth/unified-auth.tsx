"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Loader2, 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const authSchema = z.object({
  name: z.string().optional().or(z.literal('')), 
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

export function UnifiedAuth({ initialMode = "login" }: { initialMode?: "login" | "signup" }) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Handle query params like mode and verified status
  useEffect(() => {
    const urlMode = searchParams.get("mode");
    if (urlMode === "login" || urlMode === "signup") {
      setMode(urlMode);
    }

    if (searchParams.get("verified") === "true") {
        toast.success("Email verified! You can now sign in.");
    }
  }, [searchParams]);

  // Handle automatic redirection for authenticated users
  useEffect(() => {
    if (status === "authenticated") {
        const dashboardUrl = session?.user?.role === "ADMIN" ? "/admin" : "/app";
        // Check if we are already at the target or on a public/auth route
        if (pathname.startsWith("/auth")) {
            router.push(dashboardUrl);
        }
    }
  }, [status, session, router, pathname]);

  async function onSubmit(values: AuthFormValues) {
    setIsLoading(true);
    try {
      if (mode === "login") {
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error("Invalid email or password.");
        } else {
          toast.success("Welcome back!");
          // Since we don't have the role in the 'result', we can rely on the middleware 
          // or do a quick session check. For now, let's just push to /admin if we are sure,
          // but better to let a separate check handle it or push to /app and let middleware redirect.
          // Actually, let's just push to /admin if we know they're admin, but we don't here.
          // I will use a clever way: redirect to a generic /dashboard route that we don't have? No.
          // Let's just push to /app and the middleware will fix it for admins.
          // BUT the user said they land on profile.
          
          const callbackUrl = searchParams.get("callbackUrl") || "/app";
          router.push(callbackUrl);
        }
      } else {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify(values),
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (data.ok) {
          toast.success("Account created! Signing you in...");
          // Auto-login after successful signup
          const loginResult = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
          });
          if (loginResult?.error) {
            // Fallback: redirect to login page
            toast.info("Please sign in with your new credentials.");
            setMode("login");
          } else {
            const dashboardUrl = (loginResult as any)?.role === "ADMIN" ? "/admin" : (searchParams.get("callbackUrl") || "/app");
            router.push(dashboardUrl);
          }
        } else {
          toast.error(data.message || "Signup failed");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center bg-slate-50/50 px-4 py-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20">
         <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-[100px]" />
         <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[1000px] grid lg:grid-cols-2 gap-0 overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        {/* Visual Sidebar */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 text-white relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
           
           <div className="relative z-10">
              <Link href="/" className="flex items-center gap-2 mb-12">
                 <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                    <Briefcase className="h-5 w-5 text-white" />
                 </div>
                 <span className="text-xl font-bold tracking-tighter">RIGHT JOBS</span>
              </Link>

              <h2 className="text-4xl font-black tracking-tight mb-6">
                {mode === "login" ? "Welcome back!" : "Join the future of elite hiring."}
              </h2>
              
              <div className="space-y-6">
                 {[
                    { icon: ShieldCheck, text: "Identity Verified Profiles" },
                    { icon: CheckCircle2, text: "Direct Access to Decision Makers" },
                    { icon: ArrowRight, text: "Premium Salary Transparency" }
                 ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 group">
                       <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/10 group-hover:bg-primary/20 transition-colors">
                          <item.icon className="h-4 w-4 text-primary" />
                       </div>
                       <span className="font-medium text-slate-300">{item.text}</span>
                    </div>
                 ))}
              </div>
           </div>

           <div className="relative z-10">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                 <p className="text-sm text-slate-400 italic">
                   "The most secure and transparent platform I've ever used. The ID verification really filters out the noise."
                 </p>
                 <div className="mt-4 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-700" />
                    <div>
                       <p className="text-xs font-bold">Sarah Jenkins</p>
                       <p className="text-[10px] text-slate-500">Sr. Product Designer @ Vercel</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Auth Form */}
        <div className="p-8 lg:p-12">
          <div className="flex flex-col space-y-2 mb-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {mode === "login" ? "Sign In" : "Create Account"}
            </h1>
            <p className="text-slate-500 font-medium">
              {mode === "login" 
                ? "Enter your credentials to access your dashboard." 
                : "Fill in the details to start your journey."}
            </p>
          </div>

          <div className="flex p-1 mb-8 bg-slate-100 rounded-xl">
             <button 
                onClick={() => setMode("login")}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                  mode === "login" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
             >
                Login
             </button>
             <button 
                onClick={() => setMode("signup")}
                className={cn(
                  "flex-1 py-2 text-sm font-bold rounded-lg transition-all",
                  mode === "signup" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
             >
                Register
             </button>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {mode === "signup" && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-bold">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                          <Input 
                            placeholder="John Doe" 
                            className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-bold">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input 
                          placeholder="name@example.com" 
                          type="email" 
                          className="pl-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-slate-700 font-bold">Password</FormLabel>
                        {mode === "login" && (
                          <Link href="/auth/forgot-password" className="text-xs text-primary hover:underline font-bold">
                            Forgot password?
                          </Link>
                        )}
                      </div>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                          <Input 
                            placeholder="••••••••" 
                            type={showPassword ? "text" : "password"} 
                            className="pl-10 pr-10 h-12 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl" 
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <Button type="submit" className="w-full h-12 text-lg ios-button shadow-xl shadow-primary/20" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {mode === "login" ? "Signing In..." : "Creating Account..."}
                  </>
                ) : (
                  mode === "login" ? "Sign In Now" : "Create My Account"
                )}
              </Button>

              {mode === "signup" && (
                <p className="text-[11px] text-center text-slate-500 leading-relaxed px-4">
                  By clicking "Create My Account", you acknowledge and agree to Right Jobs' 
                  <Link href="/terms" className="text-primary hover:underline font-bold mx-1">Terms of Service</Link> 
                  and 
                  <Link href="/privacy" className="text-primary hover:underline font-bold mx-1">Privacy Policy</Link>. 
                  We handle your data with professional precision and care.
                </p>
              )}
            </form>
          </Form>

          <CardFooter className="mt-8 p-0">
            <div className="text-sm text-center text-slate-500 w-full font-medium">
              {mode === "login" ? (
                <>
                  Don't have an account yet?{" "}
                  <button onClick={() => setMode("signup")} className="text-primary hover:underline font-extrabold">
                    Create one here
                  </button>
                </>
              ) : (
                <>
                  Already a member of Right Jobs?{" "}
                  <button onClick={() => setMode("login")} className="text-primary hover:underline font-extrabold">
                    Sign in here
                  </button>
                </>
              )}
            </div>
          </CardFooter>
        </div>
      </div>
    </div>
  );
}
