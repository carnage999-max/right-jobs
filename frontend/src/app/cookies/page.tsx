import { SharedThreeBg } from "@/components/shared-three-bg";

export default function CookiesPage() {
  const sections = [
    {
      title: "What are cookies?",
      content: "Cookies are small text files stored on your device when you browse websites. They help us remember your preferences, keep you logged in, and understand how you use our platform."
    },
    {
      title: "Necessary Cookies",
      content: "These are essential for the operation of our platform. They include, for example, cookies that enable you to log into secure areas of our website (like your dashboard)."
    },
    {
      title: "Analytical Cookies",
      content: "They allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us improve the platform's usability."
    },
    {
      title: "Functional Cookies",
      content: "These are used to recognize you when you return to our website. This enables us to personalize our content for you and remember your preferences (for example, your choice of language or region)."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative overflow-hidden py-24 bg-slate-50">
        <SharedThreeBg variant="subtle" />
        <div className="container mx-auto max-w-4xl px-4 relative z-10">
          <div className="mb-16">
            <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-6 sm:text-7xl">
               Cookie<span className="text-primary italic">Policy.</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium">Last updated: February 7, 2024</p>
          </div>

          <div className="space-y-12">
            {sections.map((section) => (
              <section key={section.title} className="p-10 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl shadow-slate-200/50 transition-all hover:border-primary-foreground/20">
                <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{section.title}</h2>
                <p className="text-slate-600 leading-relaxed text-lg font-medium">
                  {section.content}
                </p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
