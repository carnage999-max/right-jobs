import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { SharedThreeBg } from "@/components/shared-three-bg";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  const plans = [
    {
      name: "Standard",
      price: "Free",
      desc: "Perfect for small teams and startups testing the platform.",
      features: ["3 active job posts", "Standard visibility", "Basic applicant filtering", "Email support"],
      cta: "Get Started",
      href: "/auth/signup"
    },
    {
      name: "Premium",
      price: "$199",
      period: "/month",
      desc: "For growing companies that need professional hiring tools.",
      features: ["Unlimited job posts", "Priority placement", "Advanced AI filtering", "Direct recruiter chat", "24/7 Priority support", "Verified Talent Badge"],
      cta: "Go Premium",
      href: "/auth/signup",
      featured: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Tailored solutions for large organizations and agencies.",
      features: ["Custom recruitment API", "Dedicated account manager", "White-label options", "Bulk ID verification", "SSO & SAML"],
      cta: "Contact Sales",
      href: "/contact"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative overflow-hidden py-24 lg:py-40 bg-slate-950 text-white">
        <SharedThreeBg className="opacity-40" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 py-1.5 px-6 rounded-full font-bold uppercase tracking-[0.2em] text-[10px]">Pricing Plans</Badge>
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl mb-8 leading-tight">
            Simple, <span className="text-primary italic">Transparent</span> Pricing.
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-400 font-medium leading-relaxed">
            Choose the plan that's right for your business. No hidden fees, no complexity.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white -mt-20">
        <div className="container mx-auto max-w-6xl px-4 relative z-20">
          <div className="grid gap-8 lg:grid-cols-3 items-stretch">
            {plans.map((plan) => (
              <div 
                key={plan.name} 
                className={cn(
                  "relative flex flex-col rounded-[2.5rem] p-10 transition-all duration-500 hover:-translate-y-2",
                  plan.featured 
                    ? "bg-slate-900 text-white shadow-[0_40px_80px_rgba(0,0,0,0.15)] ring-1 ring-white/10 scale-105 z-10" 
                    : "bg-white border border-slate-200 text-slate-900 shadow-xl shadow-slate-100"
                )}
              >
                {plan.featured && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-6 py-2 text-xs font-black uppercase tracking-widest text-white ring-8 ring-slate-900 shadow-xl">
                    Most Popular
                  </div>
                )}
                
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4 text-primary">
                    <Zap className="h-6 w-6" />
                    <h3 className="text-2xl font-black tracking-tight">{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black">{plan.price}</span>
                    {plan.period && <span className="text-slate-400 font-bold ml-1">{plan.period}</span>}
                  </div>
                  <p className={cn(
                    "mt-6 text-lg font-medium leading-relaxed",
                    plan.featured ? "text-slate-400" : "text-slate-500"
                  )}>
                    {plan.desc}
                  </p>
                </div>

                <div className="flex-1">
                  <div className={cn(
                    "h-px w-full my-8",
                    plan.featured ? "bg-white/10" : "bg-slate-100"
                  )} />
                  <ul className="space-y-5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-4">
                        <div className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full shrink-0",
                          plan.featured ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary"
                        )}>
                          <Check className="h-4 w-4" />
                        </div>
                        <span className={cn(
                          "text-md font-bold",
                          plan.featured ? "text-slate-200" : "text-slate-700"
                        )}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-12">
                  <Button asChild className={cn(
                    "w-full h-16 ios-button text-xl font-black shadow-2xl transition-all",
                    plan.featured 
                      ? "bg-primary hover:bg-primary/90 text-white shadow-primary/20" 
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  )}>
                    <Link href={plan.href}>{plan.cta}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Pre-header */}
      <section className="py-24 bg-slate-50 border-t">
         <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Have more questions?</h2>
            <p className="text-slate-500 font-medium mb-10">We're built for teams of all sizes. Let's talk about yours.</p>
            <Button variant="outline" className="h-14 px-10 ios-button border-slate-200 text-slate-700 font-bold" asChild>
               <Link href="/contact">Contact Our Team</Link>
            </Button>
         </div>
      </section>
    </div>
  );
}

import { cn } from "@/lib/utils";
