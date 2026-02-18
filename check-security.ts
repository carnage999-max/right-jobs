import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const latestLogs = await prisma.auditLog.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
        actorAdmin: {
            select: { email: true }
        }
    }
  });

  console.log('Latest Audit Logs:');
  console.log(JSON.stringify(latestLogs, null, 2));

  const adminUsers = await prisma.user.findMany({
    where: { role: 'ADMIN' },
    select: { id: true, email: true, name: true, createdAt: true }
  });

  console.log('\nAdmin Users:');
  console.log(JSON.stringify(adminUsers, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
