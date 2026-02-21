-- CreateTable
CREATE TABLE "Resume" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;

-- MigrateData: Copy existing resumeUrl and resumeFilename to Resume table
INSERT INTO "Resume" ("id", "userId", "url", "filename", "isDefault", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  p."userId",
  p."resumeUrl",
  p."resumeFilename",
  true,
  NOW(),
  NOW()
FROM "Profile" p
WHERE p."resumeUrl" IS NOT NULL;
