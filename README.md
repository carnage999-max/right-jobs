# RightJobs - Production-Grade Job Platform

A modern, full-stack job platform built with Next.js 15, Prisma, and NextAuth. Focused on high-quality user experience, strict anti-fraud measures, and a premium iOS-inspired design system.

## 🚀 Key Features

- **Double-Sided App**: Seamless experience for both Job Seekers and Admins.
- **Identity Verification**: Mandatory ID verification wizard for users and employers to ensure platform trust.
- **NextAuth Integration**: Secure sessions with role-based access control (RBAC).
- **Admin Command Center**: Complete oversight of users, jobs, verifications, and audit logs.
- **Email First**: Transactional email flows using Resend for verification, password resets, and notifications.
- **Premium Design**: iOS-style typography, white-first theme, and glassmorphism.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js v5 (Beta)
- **Styles**: Tailwind CSS 4.0 + shadcn/ui
- **Emails**: Resend
- **Storage**: AWS S3 (Presigned URLs)
- **Infrastructure**: Vercel

## 📦 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/right-jobs.git
cd right-jobs
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up environment variables
Copy `.env.example` to `.env` and fill in the values:
```bash
cp .env.example .env
```

### 4. Database Setup
Ensure you have a PostgreSQL instance running, then:
```bash
npx prisma db push
npx prisma db seed
```

### 5. Run the development server
```bash
pnpm dev
```

## 🔐 Security Standards

- **Audit Logging**: Every admin action is logged with IP tracking for transparency.
- **Rate Limiting**: Protection against brute-force attacks on auth endpoints.
- **Generic Errors**: Never leak account existence or specific failure causes.
- **Encrypted Storage**: Sensitive ID documents are stored with server-side encryption in S3.

## 📄 Documentation

Detailed documentation can be found in the `/docs` directory or at the following links:
- [Build Instructions](./docs/instructions.md)
- [Design System](./docs/style.md)
- [User Flow](./docs/user_flow.md)
- [Admin Flow](./docs/admin_flow.md)

## ⚖️ License

MIT License. See `LICENSE` for more information.
