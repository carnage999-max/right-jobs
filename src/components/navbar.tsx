"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  LayoutDashboard, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { SharedThreeBg } from "@/components/shared-three-bg";

const routes = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Post a Job", href: "/auth/signup" },
  { label: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const dynamicRoutes = routes.map(route => {
    if (route.label === "Post a Job") {
      return {
        ...route,
        href: status === "authenticated" ? "/jobs/post" : "/auth/signup"
      };
    }
    return route;
  });

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <nav className={cn(
        "sticky top-0 z-[60] w-full border-b transition-all duration-500",
        isMenuOpen ? "bg-slate-950 border-white/10" : "bg-white/80 backdrop-blur-md border-slate-200"
      )}>
        <div className="container mx-auto flex h-24 items-center justify-between px-4 relative">
          {/* Left: Navigation Links */}
          <div className="hidden md:flex md:gap-6 items-center flex-1">
            {dynamicRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-primary",
                  pathname === route.href ? "text-primary" : (isMenuOpen ? "text-slate-400" : "text-slate-500")
                )}
              >
                {route.label}
              </Link>
            ))}
          </div>

          {/* Center: Absolute Logo (No Text) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="flex items-center group transition-all hover:scale-105 active:scale-95">
              <div className="relative h-44 w-44">
                <Image 
                  src="/right-jobs-logo-nobg.png" 
                  alt="RightJobs Logo" 
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center justify-end gap-4 flex-1">
            {status === "authenticated" ? (
              <div className="flex items-center gap-3">
                <Button variant="ghost" className={cn(
                  "hidden md:flex font-semibold transition-colors",
                  isMenuOpen ? "text-white hover:bg-white/10" : "text-slate-600"
                )} asChild>
                   <Link href={session?.user?.role === "ADMIN" ? "/admin" : "/app"}>Dashboard</Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-offset-background transition-colors hover:bg-slate-100">
                      <Avatar className="h-10 w-10 border-2 border-primary/20">
                        <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {session?.user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 rounded-xl z-[80]" align="end" sideOffset={12} forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none">{session?.user?.name}</p>
                        <p className="text-xs leading-none text-slate-500">{session?.user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href={session?.user?.role === "ADMIN" ? "/admin" : "/app"} className="flex w-full items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/profile" className="flex w-full items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/settings/security" className="flex w-full items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Security
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:text-red-600 font-medium"
                      onSelect={() => signOut()}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex md:gap-4">
                <Button variant="ghost" className={cn(
                  "font-semibold transition-colors",
                  isMenuOpen ? "text-white hover:bg-white/10" : "text-slate-600"
                )} asChild>
                  <Link href="/auth/login">Login</Link>
                </Button>
                <Button asChild className="ios-button h-11 px-8 transition-all duration-500 font-bold group">
                  <Link href="/auth/signup" className="flex items-center gap-2">
                    Get Started <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            )}
            
            {/* Animated Burger Button */}
            <button
              className="relative z-[70] flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              <span
                className={cn(
                  "h-0.5 w-6 rounded-full transition-all duration-300",
                  isMenuOpen ? "bg-white rotate-45 translate-y-2" : "bg-slate-900"
                )}
              />
              <span
                className={cn(
                  "h-0.5 w-6 rounded-full transition-all duration-300",
                  isMenuOpen ? "bg-white opacity-0" : "bg-slate-900 opacity-100"
                )}
              />
              <span
                className={cn(
                  "h-0.5 w-6 rounded-full transition-all duration-300",
                  isMenuOpen ? "bg-white -rotate-45 -translate-y-2" : "bg-slate-900"
                )}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950 px-4 pt-24 pb-12 animate-in slide-in-from-top-10 fade-in duration-300">
          <div className="relative z-10 flex flex-col items-center gap-6 text-center">
              <div className="mb-4 relative h-32 w-32 shrink-0">
                  <Image 
                    src="/right-jobs-logo-nobg.png" 
                    alt="Logo" 
                    fill
                    className="object-contain"
                  />
              </div>
            <div className="flex flex-col gap-4">
              {dynamicRoutes.map((route, i) => (
                <div
                  key={route.href}
                  className="animate-in slide-in-from-bottom-5 fade-in duration-500 fill-mode-backwards"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Link
                    href={route.href}
                    className="text-4xl font-black tracking-tighter text-white hover:text-primary transition-colors"
                  >
                    {route.label}
                  </Link>
                </div>
              ))}
            </div>
            
            <div 
              className="mt-8 flex flex-col gap-4 w-full min-w-[280px] animate-in zoom-in-95 fade-in duration-500 delay-300 fill-mode-backwards"
            >
                {status === "authenticated" ? (
                  <Button size="lg" className="ios-button h-16 text-xl" asChild>
                    <Link href={session?.user?.role === "ADMIN" ? "/admin" : "/app"}>Go to Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button size="lg" className="ios-button h-16 text-xl" asChild>
                      <Link href="/auth/signup">Join Now</Link>
                    </Button>
                    <Button 
                      size="lg" 
                      variant="ghost" 
                      className="ios-button h-16 text-xl text-white hover:bg-white/10 border border-white/10" 
                      asChild
                    >
                      <Link href="/auth/login">Login</Link>
                    </Button>
                  </>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
