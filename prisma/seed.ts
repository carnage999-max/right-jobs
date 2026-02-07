import { PrismaClient, UserRole, JobType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.application.deleteMany();
  await prisma.job.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@rightjobs.com",
      name: "Admin User",
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
      emailVerifiedAt: new Date(),
    },
  });

  // Create some Users
  const userPassword = await bcrypt.hash("user123", 10);
  const user1 = await prisma.user.create({
    data: {
      email: "john@example.com",
      name: "John Doe",
      passwordHash: userPassword,
      role: UserRole.USER,
      emailVerifiedAt: new Date(),
      profile: {
        create: {
          bio: "Experienced developer looking for new challenges.",
          location: "New York, NY",
          skills: ["React", "Next.js", "TypeScript"],
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane@example.com",
      name: "Jane Smith",
      passwordHash: userPassword,
      role: UserRole.USER,
      profile: {
        create: {
          bio: "Product designer with a passion for UX.",
          location: "Remote",
          skills: ["Figma", "UI/UX", "Prototyping"],
        },
      },
    },
  });

  // Create Jobs
  const job1 = await prisma.job.create({
    data: {
      title: "Senior Full Stack Developer",
      companyName: "TechFlow Systems",
      location: "San Francisco, CA",
      type: JobType.FULL_TIME,
      category: "Engineering",
      description: "We are looking for a Senior Full Stack Developer to join our core team...",
      salaryRange: "$150k - $200k",
      createdById: admin.id,
    },
  });

  const job2 = await prisma.job.create({
    data: {
      title: "Product Designer",
      companyName: "CreativeBits",
      location: "Remote",
      type: JobType.FULL_TIME,
      category: "Design",
      description: "Join our design team to build the future of creative tools...",
      salaryRange: "$120k - $160k",
      createdById: admin.id,
    },
  });

  const job3 = await prisma.job.create({
    data: {
      title: "Marketing Lead",
      companyName: "GrowthX",
      location: "Austin, TX",
      type: JobType.CONTRACT,
      category: "Marketing",
      description: "Help us scale our user base across 10+ markets...",
      salaryRange: "$80 - $120 / hr",
      createdById: admin.id,
    },
  });

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
