import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, ShieldCheck, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { WhySlider } from "@/components/why-slider";
import { SharedThreeBg } from "@/components/shared-three-bg";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-24 lg:pt-12 lg:pb-32">
        <SharedThreeBg variant="subtle" className="opacity-80" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Full Image Visibility with Balanced Spacing */}
            <div className="mb-6 relative h-48 w-full max-w-[600px] transition-transform hover:scale-105">
              <Image 
                src="/right-jobs-logo-nobg.png" 
                alt="Right Jobs Logo" 
                fill
                className="object-contain" 
                priority
              />
            </div>

            <h1 className="max-w-4xl text-6xl font-black tracking-tight text-slate-900 sm:text-7xl lg:text-8xl">
              The <span className="text-primary italic">Right</span> Job, <br />
              Right Now.
            </h1>
            <p className="mt-8 max-w-xl text-xl text-slate-600 font-medium sm:text-2xl">
              Trust-first hiring for verified talent and serious employers.
            </p>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="ios-button h-16 px-10 text-xl shadow-xl hover:shadow-2xl transition-all" asChild>
                <Link href="/jobs">
                  Browse Jobs <ArrowRight className="ml-2 h-6 w-6" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="ios-button h-16 px-10 text-xl border-slate-200 hover:bg-slate-50" asChild>
                <Link href="/auth/signup">Post a Job (Free)</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">Why Right Jobs?</h2>
            <p className="mt-4 text-xl text-slate-600 font-medium">We reimagined the job search experience with trust at its core.</p>
          </div>
          <WhySlider />
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-12 lg:flex-row">
            <div className="flex-1">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Security you can trust.</h2>
              <p className="mt-4 text-lg text-slate-600">
                Job scams are on the rise. We fight back with mandatory ID verification for all job posters and 
                strict moderation. Your safety is our priority.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Mandatory ID verification for employers",
                  "Encrypted document storage (S3)",
                  "Proactive scam detection algorithms",
                  "Verified-only review system"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="font-medium text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-10 ios-button" size="lg">
                <Link href="/trust-safety">Learn about Trust & Safety</Link>
              </Button>
            </div>
            <div className="flex-1 lg:pl-12">
               <div className="relative aspect-video overflow-hidden rounded-3xl bg-slate-900 shadow-2xl ring-1 ring-white/10">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                     <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-3xl ring-1 ring-white/20 animate-pulse">
                        <ShieldCheck className="h-10 w-10 text-primary" />
                     </div>
                     <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Military-Grade Security</span>
                     <h4 className="mt-2 text-xl font-bold text-white">Advanced Identity Protection</h4>
                     <p className="mt-2 text-sm text-slate-400">Your personal data is encrypted with AES-256 and stored in secure isolation.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Ready to find your Right Job?</h2>
          <p className="mt-4 mb-10 text-primary-foreground/80">Join thousands of others today. It's free (for now).</p>
          <Button size="lg" className="bg-white text-primary hover:bg-slate-100 ios-button" asChild>
            <Link href="/auth/signup">Create Your Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
