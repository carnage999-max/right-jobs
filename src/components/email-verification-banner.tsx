"use client";

import { useSession } from "next-auth/react";
import { AlertTriangle, Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function EmailVerificationBanner() {
  const { data: session } = useSession();
  const [dismissed, setDismissed] = useState(false);
  const [resending, setResending] = useState(false);

  // Don't show if not logged in, already verified, or dismissed
  if (!session?.user || session.user.isEmailVerified || dismissed) {
    return null;
  }

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
      });
      if (res.ok) {
        toast.success("Verification email sent! Check your inbox.");
      } else {
        toast.error("Failed to resend. Please try again later.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative bg-amber-50 border-b border-amber-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <Mail className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium text-amber-800 truncate">
            <span className="hidden sm:inline">Please verify your email address to unlock all features. </span>
            <span className="sm:hidden">Verify your email to continue. </span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs font-bold border-amber-300 text-amber-700 hover:bg-amber-100"
            onClick={handleResend}
            disabled={resending}
          >
            {resending ? "Sending..." : "Resend Email"}
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="text-amber-400 hover:text-amber-600 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
