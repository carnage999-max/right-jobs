import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center bg-slate-50/50 px-4 py-12 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-accent rounded-full blur-[120px]" />
      </div>

      <div className="text-center max-w-lg">
        {/* Big 404 */}
        <h1 className="text-[10rem] font-black leading-none tracking-tighter text-slate-900/5 select-none">
          404
        </h1>

        <div className="-mt-16 relative z-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-lg shadow-primary/10">
              <Search className="h-8 w-8" />
            </div>
          </div>

          <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-3">
            Page Not Found
          </h2>
          <p className="text-slate-500 font-medium text-lg mb-10 max-w-sm mx-auto">
            The page you're looking for doesn't exist or has been moved to a new location.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="ios-button h-12 px-8 text-base font-bold shadow-xl shadow-primary/20" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base font-bold rounded-xl border-slate-200" asChild>
              <Link href="/jobs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse Jobs
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
