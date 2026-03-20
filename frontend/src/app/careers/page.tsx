import CareersClient from "./CareersClient";
import prisma from "@/lib/prisma";

export default async function CareersPage() {
  // Fetch real active jobs from DB without filtering by company name
  const jobs = await prisma.job.findMany({
    where: { 
      isActive: true 
    },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return <CareersClient initialJobs={jobs} />;
}
