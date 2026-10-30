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
import { ReportIssue } from "@/components/report-issue";
import { Analytics } from "@/components/analytics";
import { JsonLd } from "@/components/json-ld";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/seo/site";

const DESCRIPTION = `${SITE_TAGLINE} Browse open jobs from verified employers, apply in minutes, and hire with confidence on ${SITE_NAME}.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.webmanifest",
  applicationName: SITE_NAME,
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: DESCRIPTION,
    siteName: SITE_NAME,
    images: [
      {
        url: "/right-jobs-logo.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME}: ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: DESCRIPTION,
    images: ["/right-jobs-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
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
          <ReportIssue />
          <Toaster />
        </Providers>
        <Analytics gaId={process.env.NEXT_PUBLIC_GA_ID?.trim() || undefined} />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/icon.png`, slogan: SITE_TAGLINE },
              { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, inLanguage: "en-US", publisher: { "@id": `${SITE_URL}/#organization` } },
            ],
          }}
        />
      </body>
    </html>
  );
}
