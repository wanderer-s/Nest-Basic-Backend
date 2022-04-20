import { Comments, Prisma } from '@prisma/client';

export abstract class AbstractCommentsRepository {
  abstract getCommentById(commentId: number): Promise<Comments>;

  abstract createComment(data: Prisma.CommentsUncheckedCreateInput): Promise<Comments>;

  abstract getComments(postId: number, take: number, lastCommentId?: number): Promise<Comments[]>;

  abstract updateComment(commentId: number, data: Prisma.CommentsUpdateInput): Promise<Comments>;
}
