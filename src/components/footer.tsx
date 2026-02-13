"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Mail, MapPin, Facebook, Instagram } from "lucide-react";

// Custom X (Twitter) Icon
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
    <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  const isAuthPage = pathname.startsWith("/auth");
  const isAdminPage = pathname.startsWith("/admin");
  
  if (isAuthPage || isAdminPage) return null;

  const footerLinks = {
    product: [
      { label: "Find Jobs", href: "/jobs" },
      { label: "Post a Job", href: "/auth/signup" },
      { label: "Pricing", href: "/pricing" },
      { label: "Trust & Safety", href: "/trust-safety" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Security", href: "/security" },
    ],
  };

  return (
    <footer className="border-t bg-slate-50/50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-6">
            <Link href="/" className="flex items-center">
              <div className="relative h-20 w-80">
                <Image 
                  src="/right-jobs-logo-nobg.png" 
                  alt="Right Jobs Logo" 
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Link>
            <p className="max-w-xs text-slate-500 leading-relaxed font-medium">
              The modern job platform built for trust and speed. We connect verified talent with verified opportunities.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="X (formerly Twitter)" className="flex h-10 w-10 items-center justify-center rounded-full bg-white border shadow-sm transition-all hover:border-black hover:text-black active:scale-90">
                <XIcon className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-white border shadow-sm transition-all hover:border-blue-600 hover:text-blue-600 active:scale-90">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-white border shadow-sm transition-all hover:border-pink-600 hover:text-pink-600 active:scale-90">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 lg:col-span-3 lg:grid-cols-3">
            <div>
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-400">Platform</h4>
              <ul className="space-y-4">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-slate-600 font-semibold transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-400">Company</h4>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-slate-600 font-semibold transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <h4 className="mb-6 text-sm font-bold uppercase tracking-widest text-slate-400">Support</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-600 font-semibold">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="truncate">info@rightjob.net</span>
                </li>
                <li className="flex items-start gap-3 text-slate-600 font-semibold">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-1" />
                  <span>PO Box 52<br/>Detroit, ME 04929</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <p className="text-sm font-medium text-slate-400">
              © {currentYear} Right Jobs Inc. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {footerLinks.legal.map((link) => (
                <Link key={link.label} href={link.href} className="text-xs font-bold text-slate-400 uppercase tracking-wider transition-colors hover:text-primary">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
