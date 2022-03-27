import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CommentCreateDto } from './dto/comment.create.dto';
import {Comments} from '@prisma/client'

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPostById(postId: number) {
    const foundPost = await this.prisma.posts.findUnique({where: {id: postId}})
    if(!foundPost) throw new NotFoundException("Couldn't find post")
    
    return foundPost
  }

  async getCommentById(commentId: number): Promise<Comments> {
    const foundComment = await this.prisma.comments.findUnique({where: {id: commentId}})

    if(!foundComment) throw new NotFoundException("Couldn't find comment")

    return foundComment
  }

  async validateCommenter(comment:Comments , userId): Promise<void> {
    if(comment.userId !== userId) throw new ForbiddenException('Access is denied')
  }

  async createComment(postId: number, dto: CommentCreateDto, userId: number): Promise<void> {
    await this.getPostById(postId)

    const data = {postId, ...dto, userId}
    await this.prisma.comments.create({data})
  }

  async getComments(postId: number, lastCommentId?: number) {
    if(lastCommentId) {
      return await this.prisma.comments.findMany(
        {
          take: 10,
          skip: 1,
          cursor: {
            id: lastCommentId
          },
          where: {postId},
          orderBy: {createdAt: 'desc'}
        })
    } else {
      return await this.prisma.comments.findMany(
        {
          take: 10,
          where: {postId},
          orderBy: {createdAt: 'desc'}
        })
    }
  }

  async updateComment(postId: number, commentId: number, dto: CommentCreateDto, userId: number): Promise<void> {
    await this.getPostById(postId)
    const foundComment = await this.getCommentById(commentId)
    await this.validateCommenter(foundComment, userId)

    if(postId !== foundComment.postId) throw new ForbiddenException('Access is denied')

    await this.prisma.comments.update({where: {id: commentId}, data: dto})
  }
}
