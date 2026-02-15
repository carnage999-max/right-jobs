import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://rightjob.net'

  // Get all active jobs for the sitemap
  const jobs = await prisma.job.findMany({
    where: { isActive: true },
    select: { id: true, updatedAt: true }
  })

  const jobEntries = jobs.map((job) => ({
    url: `${baseUrl}/jobs/${job.id}`,
    lastModified: job.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
    {
       url: `${baseUrl}/about`,
       lastModified: new Date(),
       changeFrequency: 'monthly',
       priority: 0.5,
    },
    ...jobEntries,
  ]
}
