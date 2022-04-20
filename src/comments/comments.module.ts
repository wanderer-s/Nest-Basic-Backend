import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaService } from '../common/prisma.service';
import { PostsModule } from '../posts/posts.module';
import { CommentsRepository } from './repository/comments.repository';

@Module({
  imports: [PostsModule],
  providers: [CommentsService, CommentsRepository, PrismaService],
  controllers: [CommentsController]
})
export class CommentsModule {}
