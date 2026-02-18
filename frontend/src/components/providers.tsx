import { SessionProvider } from "next-auth/react";
import { CaptchaProvider } from "./providers/captcha-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CaptchaProvider>
        {children}
      </CaptchaProvider>
    </SessionProvider>
  );
}
