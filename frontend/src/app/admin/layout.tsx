"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  History,
  Home,
  User
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node) && 
        !isCollapsed && 
        window.innerWidth < 1280 // Only collapse automatically on smaller screens or specific conditions
      ) {
        setIsCollapsed(true);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCollapsed]);

  const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: Briefcase, label: "Jobs", href: "/admin/jobs" },
    { icon: ShieldCheck, label: "ID Verifications", href: "/admin/verifications" },
    { icon: MessageSquare, label: "Review Moderation", href: "/admin/reviews" },
    { icon: CreditCard, label: "Payments", href: "/admin/payments" },
    { icon: Bell, label: "Notifications", href: "/admin/notifications" },
    { icon: History, label: "Audit Logs", href: "/admin/audit-logs" },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-white transition-all duration-300 ease-in-out lg:relative",
          isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-64"
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
             <div className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-lg bg-primary text-primary-foreground">
               <ShieldCheck className="h-5 w-5" />
             </div>
             {(!isCollapsed || (typeof window !== 'undefined' && window.innerWidth < 1024)) && (
               <span className="font-bold tracking-tight text-slate-900 truncate">RightAdmin</span>
             )}
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
              onClick={() => {
                if (window.innerWidth < 1024) setIsCollapsed(true);
              }}
            >
              <item.icon className="h-5 w-5 min-w-[20px]" />
              <span className={cn("truncate", isCollapsed && "lg:hidden")}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t p-4 space-y-4">
           {(!isCollapsed || (typeof window !== 'undefined' && window.innerWidth < 1024)) && (
              <div className="flex items-center gap-3 px-2 py-2">
                 <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                   <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                   <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {session?.user?.name?.[0] || "A"}
                   </AvatarFallback>
                 </Avatar>
                 <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold truncate text-slate-900">{session?.user?.name || "Admin"}</p>
                    <p className="text-[10px] text-slate-500 truncate uppercase font-bold tracking-widest">{session?.user?.role || "SYSTEM"}</p>
                 </div>
              </div>
           )}
           <Button 
            variant="ghost" 
            className={cn("w-full justify-start gap-3 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 font-bold", isCollapsed && "lg:px-3")}
            onClick={() => signOut()}
           >
              <LogOut className="h-5 w-5 min-w-[20px]" />
              <span className={cn(isCollapsed && "lg:hidden")}>Logout</span>
           </Button>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 hidden lg:flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow-sm hover:bg-slate-100"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/20 backdrop-blur-sm lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-8">
           <div className="flex items-center gap-4 text-slate-900">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setIsCollapsed(false)}
              >
                 <LayoutDashboard className="h-5 w-5 text-slate-500" />
              </Button>
              <h2 className="text-lg font-semibold truncate">
                {menuItems.find(i => i.href === pathname)?.label || "Overview"}
              </h2>
           </div>
           <div className="flex items-center gap-2 lg:gap-4">
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 lg:h-10 lg:w-10" asChild title="Return Home">
                 <Link href="/">
                    <Home className="h-5 w-5 text-slate-500" />
                 </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 lg:h-10 lg:w-10" asChild>
                 <Link href="/admin/notifications">
                    <Bell className="h-5 w-5 text-slate-500" />
                 </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 lg:h-10 lg:w-10" asChild>
                 <Link href="/admin/settings">
                    <Settings className="h-5 w-5 text-slate-500" />
                 </Link>
              </Button>

              <div className="hidden sm:block h-8 w-px bg-slate-200 mx-2" />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 lg:h-10 lg:w-10 rounded-full ring-offset-background transition-colors hover:bg-slate-100 p-0">
                    <Avatar className="h-8 w-8 lg:h-9 lg:w-9 border border-primary/20 shadow-sm">
                      <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {session?.user?.name?.[0] || "A"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-2xl z-[80] shadow-2xl border-slate-100" align="end" sideOffset={12} forceMount>
                  <DropdownMenuLabel className="font-normal p-4 pb-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-black tracking-tight text-slate-900">{session?.user?.name}</p>
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">{session?.user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-50" />
                  <div className="p-2 space-y-1">
                    <DropdownMenuItem asChild className="cursor-pointer rounded-xl font-bold text-slate-600 focus:bg-slate-50 focus:text-primary transition-colors">
                      <Link href="/" className="flex w-full items-center">
                        <Home className="mr-3 h-4 w-4" />
                        Main Platform
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-xl font-bold text-slate-600 focus:bg-slate-50 focus:text-primary transition-colors">
                      <Link href="/profile" className="flex w-full items-center">
                        <User className="mr-3 h-4 w-4" />
                        Personal Dossier
                      </Link>
                    </DropdownMenuItem>
                  </div>
                  <DropdownMenuSeparator className="bg-slate-50" />
                  <div className="p-2">
                    <DropdownMenuItem
                      className="cursor-pointer rounded-xl text-red-500 focus:bg-red-50 focus:text-red-600 font-bold transition-colors"
                      onSelect={() => signOut()}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Commit Logout
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
           </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
