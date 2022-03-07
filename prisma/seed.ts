import { PrismaClient } from '@prisma/client';
import { users } from './seed/user.seed';

const prisma = new PrismaClient();

async function main() {
  for (const user of users) {
    await prisma.users.create({
      data: user
    });
  }
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
