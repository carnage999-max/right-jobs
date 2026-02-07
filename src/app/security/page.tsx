import { SharedThreeBg } from "@/components/shared-three-bg";
import { ShieldCheck, Lock, Eye, Database, Globe, Server } from "lucide-react";

export default function SecurityPage() {
  const points = [
    {
      icon: ShieldCheck,
      title: "Mandatory Identity Verification",
      desc: "We require all job posters to undergo strict ID verification. This ensures you're interacting with real representatives from legitimate companies."
    },
    {
      icon: Lock,
      title: "AES-256 Encryption",
      desc: "Every piece of sensitive data is encrypted at rest using military-grade AES-256 encryption protocols on AWS infrastructure."
    },
    {
      icon: Eye,
      title: "Proactive Fraud Detection",
      desc: "Our AI engine constantly monitors for suspicious patterns, automatically flagging and banning sophisticated phishing attempts."
    },
    {
      icon: Database,
      title: "Isolated Document Storage",
      desc: "Identification documents and resumes are stored in secure, isolated S3 buckets with incredibly strict IAM access policies."
    },
    {
      icon: Globe,
      title: "Secure Communication",
      desc: "All data transmitted to and from our platform is encrypted via TLS 1.3, the latest and most secure internet security standard."
    },
    {
      icon: Server,
      title: "Vulnerability Management",
      desc: "We conduct regular penetration tests and maintain a vigorous bug bounty program to ensure our defenses are always one step ahead."
    }
  ];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden py-24 lg:py-40 bg-slate-900 text-white">
        <SharedThreeBg variant="primary" className="opacity-40" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/20 backdrop-blur-xl ring-1 ring-white/10 mb-8 animate-pulse">
             <ShieldCheck className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl mb-8 leading-tight">
            Security is not an option.<br />It's our <span className="text-primary italic">Foundation.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-400 font-medium leading-relaxed">
            We've built RightJobs with a single-minded focus on protecting your professional identity and data.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {points.map((point, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 hover:border-primary/20 transition-all hover:-translate-y-2">
                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-primary/10 text-primary mb-8">
                  <point.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{point.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-lg">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
           <blockquote className="text-3xl font-bold text-slate-900 leading-tight italic">
             "Our goal is to make RightJobs the most secure professional network on the planet. We don't just follow industry standards—we set them."
           </blockquote>
           <div className="mt-8 flex flex-col items-center">
              <div className="h-16 w-16 rounded-full bg-slate-200 mb-4" />
              <p className="font-black text-slate-900">Adam Sterling</p>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Head of Security, RightJobs</p>
           </div>
        </div>
      </section>
    </div>
  );
}
