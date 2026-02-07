"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Upload, FileText, Camera, CheckCircle2, Loader2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

type Step = "INTRO" | "FRONT_DOC" | "BACK_DOC" | "SELFIE" | "SUBMITTED";

export default function VerifyIdPage() {
  const [step, setStep] = useState<Step>("INTRO");
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<{ front?: File; back?: File; selfie?: File }>({});
  const [urls, setUrls] = useState<{ front?: string; back?: string; selfie?: string }>({});

  const steps = {
    INTRO: 0,
    FRONT_DOC: 25,
    BACK_DOC: 50,
    SELFIE: 75,
    SUBMITTED: 100,
  };

  const uploadToS3 = async (file: File) => {
    // 1. Get presigned URL
    const presignResp = await fetch("/api/upload/presign", {
      method: "POST",
      body: JSON.stringify({ filename: file.name, contentType: file.type }),
      headers: { "Content-Type": "application/json" },
    });
    
    if (!presignResp.ok) throw new Error("Failed to get upload slot");
    const { url, publicUrl } = await presignResp.json();

    // 2. Upload to S3
    const uploadResp = await fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    if (!uploadResp.ok) throw new Error("Failed to upload file");
    
    return publicUrl;
  };

  const handleFileChange = (type: "front" | "back" | "selfie", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
    }
  };

  const handleNext = async () => {
    if (step === "INTRO") setStep("FRONT_DOC");
    else if (step === "FRONT_DOC") {
      if (!files.front) {
        toast.error("Please upload the front of your ID");
        return;
      }
      setStep("BACK_DOC");
    }
    else if (step === "BACK_DOC") {
      if (!files.back) {
        toast.error("Please upload the back of your ID");
        return;
      }
      setStep("SELFIE");
    }
    else if (step === "SELFIE") {
      if (!files.selfie) {
        toast.error("Please take or upload a selfie");
        return;
      }

      setIsUploading(true);
      try {
        // 1. Upload all files to S3
        const frontUrl = await uploadToS3(files.front!);
        const backUrl = await uploadToS3(files.back!);
        const selfieUrl = await uploadToS3(files.selfie!);

        // 2. Save to database
        const response = await fetch("/api/verify-id", {
          method: "POST",
          body: JSON.stringify({
            docFrontUrl: frontUrl,
            docBackUrl: backUrl,
            selfieUrl: selfieUrl,
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          setStep("SUBMITTED");
          toast.success("Verification documents submitted!");
        } else {
          toast.error("Failed to save verification data");
        }
      } catch (error) {
        console.error("Upload failed", error);
        toast.error("Failed to upload documents. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-20">
      <div className="mb-8 space-y-2 text-center">
         <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="h-8 w-8" />
         </div>
         <h1 className="text-3xl font-bold tracking-tight">Identity Verification</h1>
         <p className="text-slate-500">Secure your account and gain full access to the platform.</p>
      </div>

      <div className="mb-8">
         <Progress value={steps[step]} className="h-2" />
         <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
            <span>Start</span>
            <span>Documents</span>
            <span>Selfie</span>
            <span>Complete</span>
         </div>
      </div>

      <Card className="ios-card overflow-hidden">
        {step === "INTRO" && (
          <div className="p-8 text-center space-y-6">
            <div className="space-y-4">
               <h3 className="text-xl font-bold">Why verify?</h3>
               <div className="grid gap-4 text-left">
                  <div className="flex gap-3 items-start">
                     <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                     <p className="text-sm text-slate-600">Apply to high-priority jobs instantly.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                     <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                     <p className="text-sm text-slate-600">Gain trust with potential employers.</p>
                  </div>
                  <div className="flex gap-3 items-start">
                     <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                     <p className="text-sm text-slate-600">Help us keep the platform fraud-free.</p>
                  </div>
               </div>
            </div>
            <Button onClick={handleNext} className="w-full ios-button py-6 text-lg shadow-lg shadow-primary/20">
               Start Verification
            </Button>
          </div>
        )}

        {(step === "FRONT_DOC" || step === "BACK_DOC") && (
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
               <h3 className="text-xl font-bold">
                  Upload {step === "FRONT_DOC" ? "Front" : "Back"} of ID
               </h3>
               <p className="text-sm text-slate-500">
                  Please upload a clear photo of your Government-issued ID card or Passport.
               </p>
            </div>
            
            <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-12 transition-all hover:bg-slate-50 hover:border-primary/50 cursor-pointer group">
               {files[step === "FRONT_DOC" ? "front" : "back"] ? (
                 <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                       <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">{files[step === "FRONT_DOC" ? "front" : "back"]?.name}</p>
                    <p className="text-xs text-slate-500 mt-1">Click to replace</p>
                 </div>
               ) : (
                 <>
                    <Upload className="mb-4 h-12 w-12 text-slate-300 group-hover:text-primary transition-colors" />
                    <p className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Click to upload</p>
                    <p className="mt-1 text-xs text-slate-400">PNG, JPG or PDF up to 10MB</p>
                 </>
               )}
               <input 
                 type="file" 
                 className="hidden" 
                 accept="image/*,.pdf"
                 onChange={(e) => handleFileChange(step === "FRONT_DOC" ? "front" : "back", e)} 
               />
            </label>

            <Button onClick={handleNext} className="w-full ios-button py-6 shadow-md shadow-primary/10">
               Next Step
            </Button>
          </div>
        )}

        {step === "SELFIE" && (
          <div className="p-8 space-y-6 text-center">
            <div className="space-y-2">
               <h3 className="text-xl font-bold">Take a Selfie</h3>
               <p className="text-sm text-slate-500">
                  We need to verify that you are the same person as in the documents.
               </p>
            </div>
            
            <label className="mx-auto flex aspect-square w-48 items-center justify-center rounded-full bg-slate-100 text-slate-400 border-4 border-white shadow-xl cursor-pointer hover:bg-slate-200 transition-all overflow-hidden relative group">
               {files.selfie ? (
                 <div className="h-full w-full bg-green-50 flex items-center justify-center">
                    <CheckCircle2 className="h-16 w-16 text-green-500" />
                 </div>
               ) : (
                 <div className="text-center group-hover:text-primary transition-colors">
                    <Camera className="h-12 w-12 mx-auto" />
                    <span className="text-xs font-bold mt-2 block">Upload Selfie</span>
                 </div>
               )}
               <input 
                 type="file" 
                 className="hidden" 
                 accept="image/*"
                 capture="user"
                 onChange={(e) => handleFileChange("selfie", e)} 
               />
            </label>

            <div className="space-y-3">
               <Button onClick={handleNext} className="w-full ios-button py-6 shadow-lg shadow-primary/20" disabled={isUploading}>
                  {isUploading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Verify & Submit"}
               </Button>
               <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5 font-medium">
                 <Lock className="h-3 w-3" /> Your data is encrypted and stored securely.
               </p>
            </div>
          </div>
        )}

        {step === "SUBMITTED" && (
          <div className="p-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 shadow-xl shadow-green-100/50">
               <CheckCircle2 className="h-12 w-12" />
            </div>
            <div className="space-y-2">
               <h3 className="text-2xl font-black text-slate-900">Verification in Review</h3>
               <p className="text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                  Our security team is currently verifying your credentials. This typically takes <span className="text-slate-900 font-bold">2–4 hours</span>. 
               </p>
            </div>
            <Button className="w-full ios-button py-6 shadow-lg shadow-primary/20" asChild>
               <Link href="/app">Return to Dashboard</Link>
            </Button>
          </div>
        )}
      </Card>
      
      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-400">
         <ShieldCheck className="h-4 w-4" />
         <span>End-to-end encrypted verification powered by RightJobs Security</span>
      </div>
    </div>
  );
}
