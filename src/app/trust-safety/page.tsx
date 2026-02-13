import { ShieldCheck, Lock, Eye, AlertTriangle, CheckCircle2, FileSearch } from "lucide-react";
import { SharedThreeBg } from "@/components/shared-three-bg";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function TrustSafetyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative overflow-hidden py-24 lg:py-40 bg-slate-950 text-white">
        <SharedThreeBg className="opacity-40" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 py-1.5 px-6 rounded-full font-bold uppercase tracking-[0.2em] text-[10px]">Security Integrity</Badge>
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl mb-8 leading-tight">
            Your Safety, <br /><span className="text-primary italic">Our Priority.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-400 font-medium leading-relaxed">
            Right Jobs is built from the ground up to eliminate job fraud and protect your personal identification.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white -mt-20">
        <div className="container mx-auto px-4 relative z-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
            {[
              {
                icon: Lock,
                title: "Identity Protection",
                desc: "We use government-grade encryption for all uploaded ID documents. Data is isolated and never shared."
              },
              {
                icon: Eye,
                title: "Proactive Monitoring",
                desc: "Our AI systems scan job postings 24/7 for suspicious patterns and common scam tactics."
              },
              {
                icon: ShieldCheck,
                title: "Verified Employers",
                desc: "Every company on Right Jobs must undergo a mandatory video or ID verification call."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-100/50 hover:border-primary/20 transition-all hover:-translate-y-2">
                <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-lg">{item.desc}</p>
              </div>
            ))}
          </div>

          <section className="rounded-[3rem] bg-slate-900 p-10 md:p-20 text-white mb-20 overflow-hidden relative">
             <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]"></div>
             <div className="relative z-10 grid gap-16 lg:grid-cols-2 items-center">
                <div className="space-y-8">
                   <div className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary ring-1 ring-primary/30">
                      Transparency Report
                   </div>
                   <h2 className="text-4xl font-black sm:text-5xl tracking-tight leading-tight">How we handle <br />your data.</h2>
                   <p className="text-slate-400 text-xl font-medium leading-relaxed">
                      We believe in radical transparency. Unlike other platforms, we don't sell your resume data to third-party advertisers.
                   </p>
                   <ul className="space-y-5 pt-4">
                      {[
                        "Resumes are only visible to employers you apply to.",
                        "ID documents are deleted 30 days after verification.",
                        "We use SSL/TLS 1.3 encryption for all data in transit.",
                        "Multi-factor authentication (MFA) is mandatory for admins."
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-4">
                           <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                              <CheckCircle2 className="h-4 w-4 text-primary" />
                           </div>
                           <span className="font-bold text-slate-300">{item}</span>
                        </li>
                      ))}
                   </ul>
                </div>
                <div className="hidden lg:block relative">
                   <div className="aspect-square rounded-full border-[30px] border-slate-800/50 flex items-center justify-center p-16 relative">
                      <div className="absolute inset-0 border border-white/5 rounded-full scale-110"></div>
                      <div className="w-full h-full rounded-full bg-slate-800 flex flex-col items-center justify-center text-center p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                         <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
                            <FileSearch className="h-12 w-12 text-primary opacity-80" />
                         </div>
                         <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Certification</p>
                         <p className="text-lg font-bold text-white leading-tight">SOC2 Compliance In Progress</p>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          <div className="max-w-4xl mx-auto space-y-12">
             <div className="text-center">
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Report a Concern</h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">Seen something suspicious? Help us keep Right Jobs safe.</p>
             </div>
             <div className="rounded-[2.5rem] bg-orange-50/50 border border-orange-200 p-10 lg:p-16 flex flex-col md:flex-row items-center gap-10">
                <div className="h-24 w-24 shrink-0 flex items-center justify-center rounded-[2rem] bg-orange-100 text-orange-600 shadow-xl shadow-orange-200/50">
                   <AlertTriangle className="h-10 w-10" />
                </div>
                <div className="space-y-4">
                   <h4 className="text-3xl font-black text-orange-950 tracking-tight">Zero Tolerance Policy</h4>
                   <p className="text-orange-900/70 text-lg font-medium leading-relaxed">
                      We permanently ban any user or employer found engaging in deceptive practices, phishing, or identity theft. 
                      No warnings, no second chances. Our platform remains a safe haven for talent.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
