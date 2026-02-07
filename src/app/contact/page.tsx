import { SharedThreeBg } from "@/components/shared-three-bg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MessageSquare, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative overflow-hidden py-24 bg-slate-50">
        <SharedThreeBg variant="subtle" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-8">
                Get in <span className="text-primary italic">Touch.</span>
              </h1>
              <p className="text-xl text-slate-600 font-medium leading-relaxed mb-12">
                Have questions about our platform or need support with your account? 
                Our team is here to help you 24/7.
              </p>

              <div className="space-y-8">
                {[
                  { icon: Mail, title: "Email Us", detail: "support@rightjobs.com", sub: "General inquiries & support" },
                  { icon: MessageSquare, title: "Direct Chat", detail: "Available in Dashboard", sub: "Fastest response time" },
                  { icon: MapPin, title: "Our Office", detail: "San Francisco, CA", sub: "123 Tech Center, Suite 400" },
                  { icon: Phone, title: "Call center", detail: "Coming Soon", sub: "Enterprise clients only" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-white shrink-0">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                      <p className="text-primary font-bold">{item.detail}</p>
                      <p className="text-sm text-slate-400 font-medium">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 lg:p-12 shadow-2xl shadow-slate-200/50">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">First Name</label>
                    <Input placeholder="John" className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Last Name</label>
                    <Input placeholder="Doe" className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <Input type="email" placeholder="john@example.com" className="h-12 bg-slate-50 border-slate-200 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Subject</label>
                  <select className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Billing Question</option>
                    <option>Partnership</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Message</label>
                  <Textarea placeholder="How can we help?" className="min-h-[150px] bg-slate-50 border-slate-200 rounded-xl p-4" />
                </div>
                <Button className="w-full h-14 text-lg ios-button shadow-xl shadow-primary/20">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
