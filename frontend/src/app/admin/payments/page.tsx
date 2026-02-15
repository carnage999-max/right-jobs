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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Download,
  Loader2,
  DollarSign,
  Calendar,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPayments = async () => {
    try {
      const resp = await fetch("/api/admin/payments");
      const data = await resp.json();
      if (data.ok) setPayments(data.data);
    } catch (e) {
      toast.error("Failed to fetch payments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(p => 
    p.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.stripeSessionId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
         <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Transaction Logs</h1>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
               <DollarSign className="h-5 w-5" />
            </div>
         </div>
         <Button 
            variant="outline" 
            className="ios-button h-11"
            onClick={() => window.open("/api/admin/export?type=payments")}
         >
            <Download className="mr-2 h-4 w-4" /> Export CSV
         </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
         <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input 
               placeholder="Search by email or Session ID..." 
               className="pl-9 ios-button h-11" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex items-center gap-2">
             <Button variant="ghost" className="ios-button font-bold text-slate-500">
                <Calendar className="mr-2 h-4 w-4" /> All Time
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
                <TableHead className="px-6 py-4 font-bold text-slate-900">Customer</TableHead>
                <TableHead className="font-bold text-slate-900">Amount</TableHead>
                <TableHead className="font-bold text-slate-900">Status</TableHead>
                <TableHead className="font-bold text-slate-900">Reference</TableHead>
                <TableHead className="font-bold text-slate-900 text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.length > 0 ? filteredPayments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-slate-50/30 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 truncate max-w-[200px]">{payment.user.email}</span>
                      <span className="text-[10px] font-black uppercase text-slate-400 mt-1">{payment.user.name || "Unnamed"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-black text-slate-900">
                      {(payment.amount / 100).toLocaleString('en-US', { style: 'currency', currency: payment.currency || 'USD' })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      payment.status === "COMPLETED" ? "default" : 
                      payment.status === "PENDING" ? "secondary" : "destructive"
                    } className="rounded-md font-bold text-[10px] tracking-widest uppercase">
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-[10px] text-slate-400">
                    {payment.stripeSessionId || "N/A"}
                  </TableCell>
                  <TableCell className="text-slate-500 font-bold text-xs text-right">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                   <TableCell colSpan={5} className="py-20 text-center font-bold text-slate-400 italic">
                      No transactions recorded yet.
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
