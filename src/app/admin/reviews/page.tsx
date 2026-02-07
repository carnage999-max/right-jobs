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
  MoreHorizontal, 
  CheckCircle2,
  XCircle,
  Trash2,
  Loader2,
  Star,
  MessageSquare
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const resp = await fetch("/api/admin/reviews");
      const data = await resp.json();
      if (data.ok) setReviews(data.data);
    } catch (e) {
      toast.error("Failed to fetch reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleAction = async (reviewId: string, action: string) => {
    try {
      const resp = await fetch("/api/admin/reviews/action", {
        method: "POST",
        body: JSON.stringify({ id: reviewId, action }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await resp.json();
      if (data.ok) {
        toast.success(data.message);
        fetchReviews();
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-black tracking-tight text-slate-900">Review Moderation</h1>
         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100/50 text-orange-600">
            <MessageSquare className="h-5 w-5" />
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
                <TableHead className="px-6 py-4 font-bold text-slate-900">Reviewer / Target</TableHead>
                <TableHead className="font-bold text-slate-900">Rating & Content</TableHead>
                <TableHead className="font-bold text-slate-900">Status</TableHead>
                <TableHead className="font-bold text-slate-900 text-right">Date</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length > 0 ? reviews.map((review) => (
                <TableRow key={review.id} className="hover:bg-slate-50/30 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 truncate max-w-[150px]">{review.reviewer.email}</span>
                      <span className="text-[10px] font-black uppercase text-slate-400 mt-1">Reviewing: {review.targetUser.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md">
                    <div className="flex items-center gap-1 mb-1">
                       {[...Array(5)].map((_, i) => (
                         <Star key={i} className={cn("h-3 w-3", i < review.rating ? "fill-orange-400 text-orange-400" : "fill-slate-200 text-slate-200")} />
                       ))}
                    </div>
                    <p className="text-sm font-medium text-slate-600 italic line-clamp-2">"{review.text}"</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      review.status === "VERIFIED" ? "default" : 
                      review.status === "PENDING" ? "secondary" : "outline"
                    } className="rounded-md font-bold text-[9px] tracking-widest uppercase">
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400 font-bold text-xs text-right">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                          <MoreHorizontal className="h-5 w-5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-xl border-none">
                        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Moderation Tools</DropdownMenuLabel>
                        <DropdownMenuItem 
                          className="text-green-600 cursor-pointer font-bold rounded-lg py-2.5 flex gap-2 items-center"
                          onClick={() => handleAction(review.id, "APPROVE")}
                        >
                          <CheckCircle2 className="h-4 w-4" /> Approve Review
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-orange-600 cursor-pointer font-bold rounded-lg py-2.5 flex gap-2 items-center"
                          onClick={() => handleAction(review.id, "REJECT")}
                        >
                          <XCircle className="h-4 w-4" /> Flag as Substandard
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuItem 
                          className="text-red-600 cursor-pointer font-bold rounded-lg py-2.5 flex gap-2 items-center"
                          onClick={() => handleAction(review.id, "DELETE")}
                        >
                          <Trash2 className="h-4 w-4" /> Delete Permanently
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                   <TableCell colSpan={5} className="py-20 text-center font-bold text-slate-400 italic">
                      No community reviews available for moderation.
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
