import { SharedThreeBg } from "@/components/shared-three-bg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, User, Calendar } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      id: "1",
      title: "How to Spot a Fake Job Offer in 2024",
      desc: "Phishing scams are becoming more sophisticated. Learn the red flags every job seeker should know.",
      date: "Feb 5, 2024",
      author: "Trust Discovery Team",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop",
      tag: "Security"
    },
    {
      id: "2",
      title: "Why Salary Transparency is the Future",
      desc: "Revealing pay ranges isn't just ethical—it's a competitive advantage for employers.",
      date: "Jan 28, 2024",
      author: "Finance Ops",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop",
      tag: "Company Culture"
    },
    {
      id: "3",
      title: "Optimizing Your Profile for the RightJobs Algorithm",
      desc: "Our verification engine values more than just keywords. Here's how to stand out.",
      date: "Jan 15, 2024",
      author: "Engineering",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop",
      tag: "Product"
    }
  ];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden py-24 bg-slate-50">
        <SharedThreeBg variant="subtle" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-8 sm:text-7xl">
            The Right<span className="text-primary italic">Blog.</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-500 font-medium leading-relaxed">
            Insights on hiring, security, and the future of professional growth.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
             <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer">
                <img 
                  src={posts[0].image} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt="Featured Post"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                <div className="absolute bottom-0 p-8 lg:p-12">
                   <Badge className="mb-4 bg-primary text-white border-transparent py-1 px-4">{posts[0].tag}</Badge>
                   <h2 className="text-3xl font-black text-white mb-4 leading-tight group-hover:text-primary transition-colors">{posts[0].title}</h2>
                   <p className="text-slate-300 font-medium line-clamp-2 text-lg">{posts[0].desc}</p>
                </div>
             </div>
             
             <div className="flex flex-col justify-center space-y-8">
                <div className="p-2 rounded-2xl bg-primary/10 border border-primary/20 inline-block self-start font-bold text-primary tracking-widest text-xs uppercase">Recent Updates</div>
                <h2 className="text-4xl font-black text-slate-900">Stay informed with the latest insights from our trust team.</h2>
                <div className="space-y-4">
                   <div className="flex items-center gap-4 text-slate-400 font-medium">
                      <span className="flex items-center gap-2"><User className="h-4 w-4" /> {posts[0].author}</span>
                      <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {posts[0].date}</span>
                      <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> 5 min read</span>
                   </div>
                </div>
                <Button className="w-fit h-14 ios-button px-8 text-lg" asChild>
                   <Link href={`/blog/${posts[0].id}`}>Read Featured Story</Link>
                </Button>
             </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(1).map((post) => (
              <div key={post.id} className="ios-card group cursor-pointer overflow-hidden flex flex-col h-full bg-white">
                <div className="relative aspect-video overflow-hidden">
                   <img 
                     src={post.image} 
                     className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                     alt={post.title}
                   />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                   <Badge variant="outline" className="mb-4 self-start border-slate-200 text-slate-500">{post.tag}</Badge>
                   <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
                   <p className="text-slate-500 font-medium mb-8 flex-1 line-clamp-2">{post.desc}</p>
                   <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
                      <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
                      <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-primary transition-all">
                         <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
