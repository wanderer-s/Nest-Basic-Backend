import { Injectable } from '@nestjs/common';
import { AbstractCommentsRepository } from './abstract.comments.repository';
import { Comments, Prisma } from '@prisma/client';

@Injectable()
export class MockCommentsRepository extends AbstractCommentsRepository {
  private readonly commentsStorage = []
  constructor() {
    super();
    this.commentsStorage = [
      {
        id: 1,
        comment: 'This is first comment',
        postId: 1,
        userId: 1
      },
      {
        id: 2,
        comment: 'This is second comment',
        postId: 1,
        userId: 1
      },
      {
        id: 3,
        comment: 'This is third comment',
        postId: 1,
        userId: 2
      },
      {
        id: 4,
        comment: 'This is fourth comment',
        postId: 1,
        userId: 2
      }
    ]
  }

  async createComment(data: Prisma.CommentsUncheckedCreateInput): Promise<Comments> {
    const commentId = this.commentsStorage.length + 1
    this.commentsStorage.push({commentId, ...data})
    return await this.commentsStorage.find(comment => comment.id === commentId)
  }

  async getComments(postId: number, take: number, lastCommentId?: number): Promise<Comments[]> {
    const filteredCommentsByPostId = this.commentsStorage.filter(comment => comment.postId === postId)
    const result = []
    if(lastCommentId) {
      const idx = filteredCommentsByPostId.findIndex(comment => comment.id === lastCommentId)
      for(let i = idx - 1; i > idx - take; i --) {
        result.push(filteredCommentsByPostId[i])
      }
    } else {
      for(let i = filteredCommentsByPostId.length - 1; i > filteredCommentsByPostId.length - 1 - take; i--) {
        result.push(filteredCommentsByPostId[i])
      }
    }
    return result
  }

  async updateComment(commentId: number, data: Prisma.CommentsUpdateInput): Promise<Comments> {
    const foundIndex = this.commentsStorage.findIndex(comment => comment.id === commentId);

    for (const [key, value] of Object.entries(data)) {
      this.commentsStorage[foundIndex][key] = value;
    }

    return this.commentsStorage[foundIndex]
  }
}