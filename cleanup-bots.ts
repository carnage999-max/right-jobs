import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Cleaning up Suspicious Bot Accounts ---');
  
  // Pattern: Name > 12 chars, no spaces, only alphanumeric
  const suspiciousUsers = await prisma.user.findMany({
    where: {
      role: 'USER',
      name: {
        not: null,
      }
    },
    select: { id: true, name: true, email: true }
  });

  const toDelete = suspiciousUsers.filter(u => {
    if (!u.name) return false;
    return u.name.length > 12 && !u.name.includes(' ') && /^[a-zA-Z0-9]+$/.test(u.name);
  });

  console.log(`Found ${toDelete.length} bot accounts.`);

  if (toDelete.length > 0) {
    const ids = toDelete.map(u => u.id);
    const result = await prisma.user.deleteMany({
      where: {
        id: { in: ids }
      }
    });
    console.log(`Successfully deleted ${result.count} accounts.`);
  } else {
    console.log('No suspicious accounts found matching the pattern.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
