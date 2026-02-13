import { SharedThreeBg } from "@/components/shared-three-bg";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing or using Right Jobs, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree, you are prohibited from using the platform."
    },
    {
      title: "2. Identity & Verified Conduct",
      content: "You agree to provide true and accurate information during ID verification. Engagement in any fraudulent activity, misrepresentation of identity, or posting 'ghost' jobs will result in immediate permanent banning."
    },
    {
      title: "3. Account Security",
      content: "You are responsible for maintaining the confidentiality of your account credentials. Multi-factor authentication is highly recommended and may be required for certain sensitive professional actions."
    },
    {
      title: "4. Intellectual Property",
      content: "The content, branding, and proprietary algorithms of Right Jobs are protected by copyright and intellectual property laws. Unauthorized reproduction or reverse engineering is strictly prohibited."
    },
    {
      title: "5. Limitation of Liability",
      content: "Right Jobs is provided 'as is'. While we maintain military-grade security standards, we are not liable for any professional disputes or damages arising from platform use to the fullest extent of the law."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative overflow-hidden py-24 bg-slate-50 border-b">
        <SharedThreeBg variant="subtle" />
        <div className="container mx-auto max-w-4xl px-4 relative z-10">
          <div className="mb-16">
            <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-6 sm:text-7xl">
               Terms of<span className="text-primary italic">Service.</span>
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

          <div className="mt-16 text-center text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">
             End of Agreement
          </div>
        </div>
      </section>
    </div>
  );
}
