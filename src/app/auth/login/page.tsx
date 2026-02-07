import { Suspense } from "react";
import { UnifiedAuth } from "@/components/auth/unified-auth";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin text-primary" /></div>}>
      <UnifiedAuth initialMode="login" />
    </Suspense>
  );
}
