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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      const resp = await fetch("/api/admin/users");
      const data = await resp.json();
      if (data.ok) setUsers(data.data);
    } catch (e) {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
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
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Action failed");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <Button variant="outline" className="ios-button">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button 
            variant="outline" 
            className="ios-button"
            onClick={() => window.open("/api/admin/export?type=users")}
          >
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                <TableHead className="px-6 py-4 font-bold text-slate-900">User identity</TableHead>
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
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback className="bg-primary/10 text-primary font-black uppercase text-xs">
                          {user.name?.[0] || user.email[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col overflow-hidden max-w-[200px]">
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
                           <CheckCircle2 className="h-4 w-4" />
                           <span className="text-xs font-black uppercase tracking-wider">Verified</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-500">
                           <Clock className="h-4 w-4" />
                           <span className="text-xs font-black uppercase tracking-wider">Pending</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-500 font-bold text-xs uppercase tracking-tight">
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
                          onClick={() => handleAction(user.id, user.isSuspended ? "ACTIVATE" : "SUSPEND")}
                        >
                          {user.isSuspended ? "Activate account" : "Suspend account"}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600 cursor-pointer font-bold rounded-lg py-2.5"
                          onClick={() => handleAction(user.id, "DELETE")}
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
        )}
      </div>
    </div>
  );
}
