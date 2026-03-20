import { SharedThreeBg } from "@/components/shared-three-bg";
import { Mail, MessageSquare, MapPin, Phone } from "lucide-react";
import { ContactForm } from "./ContactForm";

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
                  { icon: Mail, title: "Email Us", detail: "info@rightjob.net", sub: "General inquiries & support" },
                  { icon: MessageSquare, title: "Direct Chat", detail: "Available in Dashboard", sub: "Fastest response time" },
                  { icon: MapPin, title: "Mailing Address", detail: "PO Box 52, Detroit, ME 04929", sub: "Official Correspondence" },
                  { icon: Phone, title: "Phone", detail: "207-947-1999", sub: "Mon-Fri, 9am - 5pm EST" }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start group">
                    <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-white shrink-0">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{item.title}</h3>
                      {item.title === "Email Us" || item.title === "Mailing Address" || item.title === "Phone" ? (
                        <div className="relative group/link inline-block">
                          <span className="text-primary font-bold cursor-pointer hover:underline decoration-2 underline-offset-4">
                            {item.detail}
                          </span>
                          <div className="absolute left-0 top-full pt-2 hidden group-hover/link:block z-50 min-w-[220px]">
                            <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-1.5 flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
                              {item.title === "Email Us" ? (
                                <a 
                                  href={`mailto:${item.detail}`} 
                                  className="px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-primary text-sm font-bold rounded-lg flex items-center gap-2 transition-colors"
                                >
                                  <Mail className="w-4 h-4" /> Open in Mail App
                                </a>
                              ) : item.title === "Mailing Address" ? (
                                <a 
                                  href={`https://maps.google.com/?q=${encodeURIComponent(item.detail)}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-primary text-sm font-bold rounded-lg flex items-center gap-2 transition-colors"
                                >
                                  <MapPin className="w-4 h-4" /> Open in Google Maps
                                </a>
                              ) : (
                                <a 
                                  href={`tel:${item.detail.replace(/[^0-9+]/g, '')}`} 
                                  className="px-3 py-2 hover:bg-slate-50 text-slate-700 hover:text-primary text-sm font-bold rounded-lg flex items-center gap-2 transition-colors"
                                >
                                  <Phone className="w-4 h-4" /> Call Number
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-primary font-bold">{item.detail}</p>
                      )}
                      <p className="text-sm text-slate-400 font-medium">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
