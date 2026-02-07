"use client";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, History, Terminal } from "lucide-react";

const MOCK_LOGS = [
  { id: "1", admin: "admin@rightjobs.com", action: "VERIFY_USER", target: "USER:ck123", ip: "192.168.1.1", createdAt: "2024-02-06 14:20:15" },
  { id: "2", admin: "admin@rightjobs.com", action: "DELETE_JOB", target: "JOB:jb456", ip: "192.168.1.1", createdAt: "2024-02-06 14:15:22" },
  { id: "3", admin: "staff-2@rightjobs.com", action: "MODERATE_REVIEW", target: "REVIEW:rv789", ip: "10.0.0.45", createdAt: "2024-02-06 13:30:10" },
  { id: "4", admin: "admin@rightjobs.com", action: "UPDATE_SETTING", target: "SYSTEM:config", ip: "192.168.1.1", createdAt: "2024-02-06 12:45:00" },
  { id: "5", admin: "staff-3@rightjobs.com", action: "APPROVE_PAYMENT", target: "PAY:tx999", ip: "172.16.0.5", createdAt: "2024-02-06 12:30:45" },
];

export default function AdminAuditLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search logs by action or target..." className="pl-9 ios-button" />
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <History className="h-4 w-4" />
          <span>Last 24 hours of activity</span>
        </div>
      </div>

      <div className="rounded-2xl border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="font-bold">Admin</TableHead>
              <TableHead className="font-bold">Action</TableHead>
              <TableHead className="font-bold">Target Entity</TableHead>
              <TableHead className="font-bold">IP Address</TableHead>
              <TableHead className="font-bold">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_LOGS.map((log) => (
              <TableRow key={log.id} className="hover:bg-slate-50/30 transition-colors">
                <TableCell className="font-medium text-slate-900">{log.admin}</TableCell>
                <TableCell>
                   <Badge variant="outline" className="rounded-md font-mono text-[11px] bg-slate-50">
                      <Terminal className="mr-1.5 h-3 w-3 inline" />
                      {log.action}
                   </Badge>
                </TableCell>
                <TableCell className="text-slate-600 font-medium">{log.target}</TableCell>
                <TableCell className="text-slate-400 font-mono text-xs">{log.ip}</TableCell>
                <TableCell className="text-slate-500 text-sm">{log.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
