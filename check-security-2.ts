import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Checking for Privilege Escalation ---');
  const roleChanges = await prisma.auditLog.findMany({
    where: {
      action: {
        contains: 'ROLE'
      }
    },
    include: {
      actorAdmin: {
        select: { email: true }
      }
    }
  });

  console.log('Role changes in AuditLog:');
  console.log(JSON.stringify(roleChanges, null, 2));

  console.log('\n--- Checking for suspicious User registrations ---');
  const users = await prisma.user.findMany({
    take: 100,
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, name: true, createdAt: true, role: true }
  });

  const suspicious = users.filter(u => {
    // Basic heuristic: names with no spaces and > 15 chars that look random
    if (!u.name) return false;
    const randomLook = /^[a-zA-Z0-9]{15,}$/.test(u.name);
    return randomLook;
  });

  console.log(`Found ${suspicious.length} suspicious users in latest 100:`);
  console.log(JSON.stringify(suspicious, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
