"use client";

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Mail, 
  Clock, 
  ArrowLeft,
  Eye,
  Download,
  ShieldAlert,
  Loader2,
  XCircle,
  ExternalLink
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminVerificationReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verification, setVerification] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVerification() {
      try {
        const resp = await fetch(`/api/admin/verifications/${resolvedParams.id}`);
        const data = await resp.json();
        if (data.ok) {
          setVerification(data.data);
        } else {
          toast.error(data.message);
          router.push("/admin");
        }
      } catch (e) {
        toast.error("Failed to load request");
      } finally {
        setIsLoading(false);
      }
    }
    fetchVerification();
  }, [resolvedParams.id, router]);

  const handleAction = async (status: "VERIFIED" | "REJECTED") => {
    setIsProcessing(true);
    try {
      const resp = await fetch(`/api/admin/verifications/${resolvedParams.id}/review`, {
        method: "POST",
        body: JSON.stringify({ status }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await resp.json();
      if (data.ok) {
        toast.success(data.message);
        router.push("/admin");
        router.refresh();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  const documents = [
    { type: "ID Card (Front)", url: verification?.docFrontUrl, label: "FRONT" },
    { type: "ID Card (Back)", url: verification?.docBackUrl, label: "BACK" },
    { type: "Live Selfie", url: verification?.selfieUrl, label: "SELFIE" },
  ].filter(d => !!d.url);

  return (
  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 md:p-0">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <Button variant="ghost" className="ios-button h-10 px-4 font-bold text-slate-500 hover:bg-slate-100 rounded-xl w-full md:w-auto justify-start" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Queue overview
        </Button>
        <Badge className={cn(
          "px-4 py-1.5 rounded-full font-black tracking-widest text-[10px] w-full md:w-auto text-center justify-center",
          verification.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
        )}>
          {verification.status}
        </Badge>
      </div>

      <div className="grid gap-6 md:gap-8 lg:grid-cols-[1fr_2.5fr]">
        <aside className="space-y-6">
           <Card className="ios-card overflow-hidden shadow-xl shadow-slate-200/50">
              <CardHeader className="bg-slate-50/50 border-b py-4">
                 <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Identity Profile</CardTitle>
              </CardHeader>
              <CardContent className="p-6 md:p-8 space-y-6">
                 <div className="flex items-center gap-5">
                    <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary font-black text-2xl shadow-inner shrink-0">
                       {verification.user.name?.[0] || verification.user.email[0]}
                    </div>
                    <div className="overflow-hidden">
                       <h4 className="font-black text-lg md:text-xl text-slate-900 tracking-tight leading-tight truncate">{verification.user.name || "Unnamed"}</h4>
                       <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mt-1 truncate">
                          <Mail className="h-3 w-3 shrink-0" /> {verification.user.email}
                       </p>
                    </div>
                 </div>
                 <div className="space-y-4 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Registration</span>
                       <span className="text-sm font-black text-slate-900">{new Date(verification.user.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verification ID</span>
                       <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{verification.id.slice(0, 12)}...</span>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="ios-card bg-orange-50/50 border-orange-100 shadow-lg shadow-orange-100/20">
              <CardContent className="p-6 md:p-8 space-y-4">
                 <div className="flex items-center gap-3">
                    <ShieldAlert className="h-6 w-6 text-orange-600" />
                    <h4 className="font-black text-orange-950">Audit Protocol</h4>
                 </div>
                 <ul className="space-y-3 text-xs text-orange-800/80 font-bold leading-relaxed">
                    <li className="flex gap-3">
                       <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px]">1</span>
                       Cross-reference selfie contours with document portrait.
                    </li>
                    <li className="flex gap-3">
                       <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px]">2</span>
                       Ensure MRZ zones or barcodes are fully legible.
                    </li>
                    <li className="flex gap-3">
                       <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px]">3</span>
                       Validate document edges for synthetic manipulation.
                    </li>
                 </ul>
              </CardContent>
           </Card>
        </aside>

        <div className="space-y-6 md:space-y-8">
           <Card className="ios-card shadow-2xl shadow-slate-200/60 overflow-hidden">
              <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between border-b px-6 md:px-8 py-6 gap-4">
                 <div>
                    <CardTitle className="text-xl md:text-2xl font-black tracking-tight text-slate-900">Submission Assets</CardTitle>
                    <CardDescription className="font-bold text-slate-400 mt-1 uppercase text-xs tracking-widest">Received {new Date(verification.createdAt).toLocaleString()}</CardDescription>
                 </div>
                 <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="outline" className="ios-button h-10 px-4 font-bold border-2 w-full md:w-auto" size="sm">
                       <Download className="mr-2 h-4 w-4" /> Batch DL
                    </Button>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-slate-100">
                    {documents.map((doc, i) => (
                       <div key={i} className="p-6 md:p-10 hover:bg-slate-50/30 transition-all group">
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
                             <div className="flex items-center gap-4 md:gap-5 w-full">
                                <div className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                                   <Eye className="h-6 w-6 md:h-7 md:w-7" />
                                </div>
                                <div className="flex-1 min-w-0">
                                   <h5 className="font-black text-base md:text-lg text-slate-900 leading-tight truncate">{doc.type}</h5>
                                   <div className="flex flex-wrap gap-2 mt-1">
                                      <Badge variant="secondary" className="text-[9px] font-black tracking-tighter rounded-sm px-1.5 py-0">{doc.label}</Badge>
                                      <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest truncate">Secure Cloud Storage</span>
                                   </div>
                                </div>
                             </div>
                             <Button variant="outline" className="ios-button h-10 px-5 font-bold border-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-md active:scale-95 w-full md:w-auto" asChild>
                                <a href={doc.url} target="_blank" rel="noreferrer">
                                   Full resolution <ExternalLink className="ml-2 h-4 w-4" />
                                </a>
                             </Button>
                          </div>
                          
                          <div className="relative group/img overflow-hidden rounded-xl md:rounded-[2rem] border-4 border-white shadow-2xl ring-1 ring-slate-100">
                             <img 
                                src={doc.url} 
                                alt={doc.type} 
                                className="w-full h-auto object-cover max-h-[400px] md:max-h-[600px] transition-transform duration-700 group-hover/img:scale-105"
                             />
                             <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center p-4">
                                <Button variant="secondary" className="ios-button font-black rounded-full px-8 h-12 shadow-2xl w-full md:w-auto" asChild>
                                   <a href={doc.url} target="_blank" rel="noreferrer">Inspect Detail</a>
                                </Button>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </CardContent>
           </Card>

           <div className="flex flex-col md:flex-row gap-4 md:gap-6 pb-20">
              <Button 
                variant="outline" 
                className="flex-1 ios-button h-14 md:h-16 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-black text-base md:text-lg shadow-xl shadow-red-100/50 rounded-2xl order-2 md:order-1"
                onClick={() => handleAction("REJECTED")}
                disabled={isProcessing}
              >
                 {isProcessing ? <Loader2 className="animate-spin" /> : <XCircle className="mr-3 h-5 w-5 md:h-6 md:w-6" />} Reject Dossier
              </Button>
              <Button 
                className="flex-1 md:flex-[2] ios-button h-14 md:h-16 font-black text-base md:text-lg shadow-2xl shadow-primary/30 rounded-2xl order-1 md:order-2"
                onClick={() => handleAction("VERIFIED")}
                disabled={isProcessing}
              >
                 {isProcessing ? <Loader2 className="animate-spin" /> : <ShieldCheck className="mr-3 h-5 w-5 md:h-6 md:w-6" />} Authorize & Verify Identity
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
