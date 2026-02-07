"use client";

import { useState } from "react";
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
  MoreHorizontal, 
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_VERIFICATIONS = [
  { id: "1", user: "John Doe", type: "ID Card", status: "PENDING", submittedAt: "2024-02-06 14:20" },
  { id: "2", user: "Jane Smith", type: "Passport", status: "PENDING", submittedAt: "2024-02-06 13:45" },
  { id: "3", user: "Apex Corp", type: "Business License", status: "REVIEWING", submittedAt: "2024-02-06 11:10" },
  { id: "4", user: "Bob Builder", type: "ID Card", status: "PENDING", submittedAt: "2024-02-06 09:30" },
];

export default function AdminVerificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search verifications..." className="pl-9 ios-button" />
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span>8 pending reviews</span>
        </div>
      </div>

      <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="font-bold">User / Entity</TableHead>
              <TableHead className="font-bold">Document Type</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Submitted At</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_VERIFICATIONS.map((v) => (
              <TableRow key={v.id} className="hover:bg-slate-50/30 transition-colors">
                <TableCell>
                  <span className="font-semibold text-slate-900">{v.user}</span>
                </TableCell>
                <TableCell>
                   <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <span className="text-sm">{v.type}</span>
                   </div>
                </TableCell>
                <TableCell>
                  <Badge variant={v.status === "PENDING" ? "secondary" : "default"} className="rounded-md font-medium">
                    {v.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500 text-sm">
                  {v.submittedAt}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="cursor-pointer flex gap-1.5 items-center">
                         <Eye className="h-3.5 w-3.5" /> Review documents
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-green-600 cursor-pointer flex gap-1.5 items-center">
                         <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 cursor-pointer flex gap-1.5 items-center">
                         <XCircle className="h-3.5 w-3.5" /> Reject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
