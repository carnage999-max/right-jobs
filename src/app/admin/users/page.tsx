"use client";

import { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Download, 
  MoreHorizontal, 
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });
  const [confirmingAction, setConfirmingAction] = useState<{ id: string, action: string, type: "DELETE" | "SUSPEND" | "ACTIVATE" } | null>(null);

  const fetchUsers = async (page = 1) => {
    setIsLoading(true);
    try {
      const resp = await fetch(`/api/admin/users?page=${page}&limit=${pagination.limit}`);
      const data = await resp.json();
      if (data.ok) {
        setUsers(data.data);
        setPagination(data.pagination);
      }
    } catch (e) {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const handleAction = async (userId: string, action: string) => {
    try {
      const resp = await fetch("/api/admin/users/action", {
        method: "POST",
        body: JSON.stringify({ id: userId, action }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await resp.json();
      if (data.ok) {
        toast.success(data.message);
        fetchUsers(pagination.page);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Action failed");
    } finally {
      setConfirmingAction(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search systems..." 
            className="pl-9 ios-button" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ios-button">
                <Filter className="mr-2 h-4 w-4" /> {roleFilter === "ALL" ? "Filter" : roleFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl shadow-xl border-none">
               <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Filter by role</DropdownMenuLabel>
               <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-2" onClick={() => setRoleFilter("ALL")}>All Roles</DropdownMenuItem>
               <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-2" onClick={() => setRoleFilter("ADMIN")}>Administrators</DropdownMenuItem>
               <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-2" onClick={() => setRoleFilter("USER")}>Basic Users</DropdownMenuItem>
               <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-2" onClick={() => setRoleFilter("EMPLOYER")}>Employers</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            variant="outline" 
            className="ios-button hidden sm:flex"
            onClick={() => window.open("/api/admin/export?type=users")}
          >
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white overflow-hidden shadow-sm overflow-x-auto">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
          </div>
        ) : (
          <>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="px-6 py-4 font-bold text-slate-900 min-w-[250px]">User identity</TableHead>
                <TableHead className="font-bold text-slate-900">Access role</TableHead>
                <TableHead className="font-bold text-slate-900">Verification</TableHead>
                <TableHead className="font-bold text-slate-900">Account aging</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/30 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary font-black uppercase text-xs">
                          {user.name?.[0] || user.email[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden">
                        <span className="font-bold text-slate-900 truncate">{user.name || "Unnamed User"}</span>
                        <span className="text-xs font-medium text-slate-400 truncate">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="rounded-md font-bold text-[10px] tracking-widest uppercase px-2 py-1">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.emailVerifiedAt ? (
                        <div className="flex items-center gap-1.5 text-green-600">
                           <CheckCircle2 className="h-4 w-4 shrink-0" />
                           <span className="text-xs font-black uppercase tracking-wider">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-500">
                           <Clock className="h-4 w-4 shrink-0" />
                           <span className="text-xs font-black uppercase tracking-wider">Pending</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 font-bold text-xs uppercase tracking-tight whitespace-nowrap">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-slate-100">
                          <MoreHorizontal className="h-5 w-5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-none">
                        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account Management</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-2.5">Edit Profile</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer font-bold rounded-lg py-2.5">Security Audit</DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer font-bold rounded-lg py-2.5 text-primary"
                          onClick={() => handleAction(user.id, "FORCE_PASSWORD_RESET")}
                        >
                          Force password reset
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuItem 
                          className="text-orange-600 cursor-pointer font-bold rounded-lg py-2.5"
                          onClick={() => setConfirmingAction({ id: user.id, action: user.isSuspended ? "ACTIVATE" : "SUSPEND", type: user.isSuspended ? "ACTIVATE" : "SUSPEND" })}
                        >
                          {user.isSuspended ? "Activate account" : "Suspend account"}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 cursor-pointer font-bold rounded-lg py-2.5"
                          onClick={() => setConfirmingAction({ id: user.id, action: "DELETE", type: "DELETE" })}
                        >
                          Permanent deletion
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                   <TableCell colSpan={5} className="py-20 text-center font-bold text-slate-400">
                      No users found matching your criteria.
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50/50">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                Showing <span className="text-slate-900">{users.length}</span> of <span className="text-slate-900">{pagination.total}</span> users
             </p>
             <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ios-button h-8"
                  disabled={pagination.page === 1}
                  onClick={() => fetchUsers(pagination.page - 1)}
                >
                   Previous
                </Button>
                <div className="flex items-center px-4 text-xs font-black">
                   {pagination.page} / {pagination.totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ios-button h-8"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => fetchUsers(pagination.page + 1)}
                >
                   Next
                </Button>
             </div>
          </div>
          </>
        )}
      </div>

      {/* Action Confirmation Modal */}
      {confirmingAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
           <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className={cn(
                "mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-6",
                confirmingAction.type === "DELETE" ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
              )}>
                 {confirmingAction.type === "DELETE" ? <XCircle className="h-8 w-8" /> : <Clock className="h-8 w-8" />}
              </div>
              <h3 className="text-xl font-black text-center text-slate-900 mb-2">
                {confirmingAction.type === "DELETE" ? "Confirm Delete?" : confirmingAction.type === "SUSPEND" ? "Suspend Account?" : "Activate Account?"}
              </h3>
              <p className="text-sm font-medium text-slate-500 text-center mb-8">
                 {confirmingAction.type === "DELETE" 
                    ? "This action is irreversible. All user data, applications, and history will be permanently erased." 
                    : confirmingAction.type === "SUSPEND" 
                       ? "The user will be immediately logged out and blocked from accessing any platform features." 
                       : "The user will regain full access to their account and platform features immediately."}
              </p>
              <div className="flex gap-3">
                 <Button variant="outline" className="flex-1 ios-button h-12" onClick={() => setConfirmingAction(null)}>Cancel</Button>
                 <Button 
                   variant={confirmingAction.type === "DELETE" ? "destructive" : "default"} 
                   className={cn("flex-1 ios-button h-12", confirmingAction.type === "SUSPEND" && "bg-orange-600 hover:bg-orange-700 border-none")}
                   onClick={() => handleAction(confirmingAction.id, confirmingAction.action)}
                 >
                    Confirm {confirmingAction.type === "DELETE" ? "Delete" : confirmingAction.type === "SUSPEND" ? "Suspend" : "Activate"}
                 </Button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
