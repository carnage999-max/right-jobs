import { SharedThreeBg } from "@/components/shared-three-bg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Coffee, Heart, Zap, Globe } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  const jobs = [
    { title: "Senior Product Designer", dept: "Design", type: "Full-time", location: "Remote / SF", id: "1" },
    { title: "Back-end Engineer (Node.js)", dept: "Engineering", type: "Full-time", location: "Remote / London", id: "2" },
    { title: "Customer Success Lead", dept: "Support", type: "Full-time", location: "Global Remote", id: "3" },
    { title: "Visual Designer", dept: "Marketing", type: "Full-time", location: "Remote", id: "4" },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 bg-slate-900 text-white">
        <SharedThreeBg variant="primary" className="opacity-30" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Badge className="bg-primary/20 text-primary border-primary/30 mb-6 py-1 px-4 text-xs font-bold tracking-widest uppercase">We are hiring</Badge>
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl mb-8">
            Build the future<br />of <span className="text-primary italic">Trust.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-400 font-medium sm:text-2xl leading-relaxed">
            Help us build a world where job scams don't exist and professional 
            opportunities are transparent for everyone.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Perks & Benefits</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Globe, title: "Remote First", desc: "Work from anywhere in the world. We value output, not office hours." },
              { icon: Heart, title: "Health & Wellness", desc: "Comprehensive health, dental, and vision insurance for you and your family." },
              { icon: Zap, title: "Latest Tech", desc: "Annual stipend for your home office setup and the latest hardware." },
              { icon: Coffee, title: "Unlimited PTO", desc: "We trust you to manage your time and take the breaks you need." },
              { icon: Globe, title: "Team Retreats", desc: "Twice a year, we fly everyone to a beautiful location to bond and plan." },
              { icon: Heart, title: "Learning Fund", desc: "Stipend for books, courses, and conferences to help you grow." }
            ].map((benefit, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-xl group">
                <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-24 bg-slate-50" id="open-roles">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Current Openings</h2>
              <p className="mt-4 text-lg text-slate-500 font-medium">Find your next challenge and join our mission.</p>
            </div>
            <div className="flex gap-4">
               <Button variant="outline" className="ios-button">Filter by Dept</Button>
               <Button variant="outline" className="ios-button">Filter by Location</Button>
            </div>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-primary group">
                <div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">{job.title}</h3>
                  <div className="flex gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-400 uppercase tracking-widest">
                       <Coffee className="h-4 w-4" /> {job.dept}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-400 uppercase tracking-widest">
                       <MapPin className="h-4 w-4" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-400 uppercase tracking-widest">
                       <Clock className="h-4 w-4" /> {job.type}
                    </span>
                  </div>
                </div>
                <Button className="ios-button shrink-0" asChild>
                   <Link href={`/careers/${job.id}`}>Apply Now</Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
             <p className="text-slate-500 font-medium">Don't see a role that fits? <Link href="/contact" className="text-primary font-bold hover:underline">Contact us</Link> anyway.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
