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
import { Search, History, Terminal, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1, total: 0 });

  const fetchLogs = async (page = 1) => {
    setIsLoading(true);
    try {
      const resp = await fetch(`/api/admin/audit-logs?page=${page}&limit=${pagination.limit}`);
      const data = await resp.json();
      if (data.ok) {
        setLogs(data.data);
        setPagination(data.pagination);
      }
    } catch (e) {
      toast.error("Failed to fetch audit logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.entityId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actorAdmin?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search logs by action or target..." 
            className="pl-9 ios-button" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <History className="h-4 w-4" />
          <span>Real-time platform activity monitor</span>
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
                <TableHead className="px-6 py-4 font-bold text-slate-900 border-none">Admin Official</TableHead>
                <TableHead className="font-bold text-slate-900 border-none">Action Command</TableHead>
                <TableHead className="font-bold text-slate-900 border-none">Target Reference</TableHead>
                <TableHead className="font-bold text-slate-900 border-none">Identity Source</TableHead>
                <TableHead className="font-bold text-slate-900 border-none">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-slate-50/30 transition-colors">
                  <TableCell className="px-6 py-4">
                     <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-tight">{log.actorAdmin?.name || "System Process"}</span>
                        <span className="text-xs font-medium text-slate-400">{log.actorAdmin?.email || "internal@rightjobs.com"}</span>
                     </div>
                  </TableCell>
                  <TableCell>
                     <Badge variant="outline" className="rounded-md font-mono text-[10px] bg-slate-50 text-slate-600 px-2 border-slate-200">
                        <Terminal className="mr-1.5 h-3 w-3 inline" />
                        {log.action}
                     </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 font-bold text-xs uppercase tracking-tight">
                    {log.entityType}:<span className="text-primary/60">{log.entityId.substring(0, 8)}...</span>
                  </TableCell>
                  <TableCell className="text-slate-400 font-mono text-xs italic tracking-tighter">{log.ip}</TableCell>
                  <TableCell className="text-slate-500 text-xs font-semibold whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                   <TableCell colSpan={5} className="py-20 text-center font-bold text-slate-400">
                      No matching audit records found.
                   </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50/50">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                Registry Index: <span className="text-slate-900">{pagination.total}</span> total entries
             </p>
             <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ios-button h-8"
                  disabled={pagination.page === 1}
                  onClick={() => fetchLogs(pagination.page - 1)}
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
                  onClick={() => fetchLogs(pagination.page + 1)}
                >
                   Next
                </Button>
             </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
