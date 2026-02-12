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
  History
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

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
        className={cn(
          "relative flex flex-col border-r bg-white transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
             <div className="flex h-8 w-8 min-w-[32px] items-center justify-center rounded-lg bg-primary text-primary-foreground">
               <ShieldCheck className="h-5 w-5" />
             </div>
             {!isCollapsed && <span className="font-bold tracking-tight text-slate-900 truncate">RightAdmin</span>}
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
            >
              <item.icon className="h-5 w-5 min-w-[20px]" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="border-t p-4 space-y-4">
           {!isCollapsed && (
              <div className="flex items-center gap-3 px-2 py-2">
                 <Avatar className="h-9 w-9">
                   <AvatarImage src={session?.user?.image || ""} />
                   <AvatarFallback className="bg-primary/10 text-primary">
                      {session?.user?.name?.[0] || "A"}
                   </AvatarFallback>
                 </Avatar>
                 <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-semibold truncate">{session?.user?.name || "Admin"}</p>
                    <p className="text-xs text-slate-500 truncate">{session?.user?.email}</p>
                 </div>
              </div>
           )}
           <Button variant="ghost" className={cn("w-full justify-start gap-3 rounded-xl", isCollapsed && "px-3")}>
              <LogOut className="h-5 w-5 min-w-[20px]" />
              {!isCollapsed && <span>Logout</span>}
           </Button>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow-sm hover:bg-slate-100"
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-white px-8">
           <h2 className="text-lg font-semibold text-slate-900">
             {menuItems.find(i => i.href === pathname)?.label || "Overview"}
           </h2>
           <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                 <Bell className="h-5 w-5 text-slate-500" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                 <Settings className="h-5 w-5 text-slate-500" />
              </Button>
           </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
