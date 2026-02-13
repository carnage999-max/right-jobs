import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { ButtonClickEffect } from "@/components/button-click-effect";
import { EmailVerificationBanner } from "@/components/email-verification-banner";

export const metadata: Metadata = {
  title: {
    default: "Right Jobs | Secure Production-Grade Job Platform",
    template: "%s | Right Jobs"
  },
  description: "A high-performance job ecosystem featuring mandatory identity verification, secure MFA administration, and an iOS-inspired focus on trust and transparency.",
  keywords: ["job board", "employment", "verified hiring", "secure careers", "production nextjs"],
  authors: [{ name: "Right Jobs Engineering" }],
  creator: "Right Jobs Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rightjob.net",
    title: "Right Jobs | Find Your Next Opportunity Safely",
    description: "The next generation of employment platforms with a 100% verified user base and administrative transparency.",
    siteName: "Right Jobs",
    images: [{
      url: "/right-jobs-logo.png",
      width: 1200,
      height: 630,
      alt: "Right Jobs Platform Preview"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Right Jobs | Secure Career Marketplace",
    description: "The most trusted way to find jobs and hire talent.",
    images: ["/right-jobs-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Navbar />
          <EmailVerificationBanner />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
