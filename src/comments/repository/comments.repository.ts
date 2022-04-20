import { PrismaService } from '../../common/prisma.service';
import { Prisma, Comments } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { AbstractCommentsRepository } from './abstract.comments.repository';

@Injectable()
export class CommentsRepository extends AbstractCommentsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async getCommentById(id: number): Promise<Comments> {
    return await this.prisma.comments.findUnique({ where: { id } });
  }

  async createComment(data: Prisma.CommentsUncheckedCreateInput): Promise<Comments> {
    return await this.prisma.comments.create({ data });
  }

  async updateComment(id: number, data: Prisma.CommentsUpdateInput): Promise<Comments> {
    return await this.prisma.comments.update({ where: { id }, data });
  }

  async getComments(postId: number, take: number, lastCommentId?: number): Promise<Comments[]> {
    return await this.prisma.comments.findMany({
      take,
      skip: lastCommentId && 1,
      cursor: lastCommentId && {
        id: lastCommentId
      },
      where: {
        postId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
}
