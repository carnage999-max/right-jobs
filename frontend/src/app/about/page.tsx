import { SharedThreeBg } from "@/components/shared-three-bg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, ShieldCheck, Target, Rocket } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { label: "Verified Users", value: "50k+" },
    { label: "Serious Employers", value: "2.5k" },
    { label: "Job Matches", value: "120k" },
    { label: "Scams Blocked", value: "15k" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <SharedThreeBg variant="subtle" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl mb-8">
            Hiring built on <span className="text-primary italic">Trust.</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-slate-600 font-medium sm:text-2xl leading-relaxed">
            We started Right Jobs with a simple mission: to eliminate the noise, 
            the scams, and the lack of transparency in the modern job market.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Our Story</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                In a world where digital job boards became flooded with automated spam and 
                sophisticated phishing scams, we saw talent losing hope and employers losing time.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Right Jobs was built as a "Trust-First" platform. By mandating ID verification 
                for every job poster and using advanced encryption for all communication, 
                we've created a safe haven for professional growth.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8">
                 {stats.map((stat) => (
                    <div key={stat.label}>
                       <p className="text-3xl font-black text-primary">{stat.value}</p>
                       <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                 ))}
              </div>
            </div>
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-slate-100 shadow-2xl">
               <img 
                 src="https://images.unsplash.com/photo-1522071823991-b9671f9d7f1f?q=80&w=2070&auto=format&fit=crop" 
                 alt="Team working together" 
                 className="absolute inset-0 w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Uncompromising Security", desc: "We protect your data with government-grade encryption." },
              { icon: Users, title: "Radical Transparency", desc: "No hidden salaries, no ghost jobs. Everything is upfront." },
              { icon: Target, title: "Precision Matching", desc: "Quality over quantity. We connect the right talent, every time." },
              { icon: Rocket, title: "User-First Design", desc: "A premium experience built for speed and ease of use." }
            ].map((value, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold sm:text-5xl mb-6">Ready to work with the Best?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-slate-100 ios-button" asChild>
              <Link href="/jobs">Explore Opportunities</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 ios-button" asChild>
              <Link href="/auth/signup">Join the Platform</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
