import { PrismaClient } from '@prisma/client';
import { users } from './seed/user.seed';
import { posts } from './seed/posts.seed';
import { comments } from './seed/comments.seed';

const prisma = new PrismaClient();

async function main() {
  // for (const user of users) {
  //   await prisma.users.create({
  //     data: user
  //   });
  // }

  for (const post of posts) {
    await prisma.posts.create({
      data: post
    });
  }

  for (const comment of comments) {
    await prisma.comments.create({
      data: comment
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
