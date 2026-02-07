import { SharedThreeBg } from "@/components/shared-three-bg";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, such as your name, email address, password, resume, and identification documents for verification purposes. We also collect usage data through our platform to improve user experience."
    },
    {
      title: "2. How We Use Your Information",
      content: "We use your information to provide and improve our services, verify your identity, facilitate job applications, and communicate with you about your account and platform updates. Your data is never sold to third parties."
    },
    {
      title: "3. Data Security & Encryption",
      content: "We implement government-grade encryption (AES-256) and secure storage protocols (AWS S3 with strict IAM roles) to protect your sensitive data, including identification documents. Our security team monitors the platform 24/7."
    },
    {
      title: "4. Your Choices & Data Rights",
      content: "You can update your profile information, manage your notification preferences, and request the deletion of your account and associated data (GDPR/CCPA compliant) at any time through your settings."
    },
    {
       title: "5. Cookies & Tracking",
       content: "We use cookies to maintain your session and understand platform performance. For more details, please see our dedicated Cookie Policy."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative overflow-hidden py-24 bg-slate-50 border-b">
        <SharedThreeBg variant="subtle" />
        <div className="container mx-auto max-w-4xl px-4 relative z-10">
          <div className="mb-16">
            <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-6 sm:text-7xl">
               Privacy<span className="text-primary italic">Policy.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium tracking-tight">Last updated: February 7, 2024</p>
          </div>

          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.title} className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50 transition-all hover:border-primary-foreground/20">
                <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{section.title}</h2>
                <p className="text-slate-600 leading-relaxed text-lg font-medium">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
          
          <div className="mt-16 p-8 rounded-3xl bg-primary/5 border border-primary/10 text-center">
             <p className="text-primary font-bold">Have questions about your data?</p>
             <p className="text-slate-600 font-medium">Reach out to our Data Protection Officer at privacy@rightjobs.com</p>
          </div>
        </div>
      </section>
    </div>
  );
}
