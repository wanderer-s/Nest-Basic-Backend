import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaService } from '../common/prisma.service';
import { PostsRepository } from './repository/posts.repository';

@Module({
  providers: [PostsService, PostsRepository, PrismaService],
  controllers: [PostsController],
  exports: [PostsRepository]
})
export class PostsModule {}
