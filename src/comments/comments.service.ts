import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CommentCreateDto } from './dto/comment.create.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPostById(postId: number) {
    const foundPost = await this.prisma.posts.findUnique({where: {id: postId}})
    if(!foundPost) throw new NotFoundException("Couldn't find post")
    
    return foundPost
  }

  async createComment(postId: number, dto: CommentCreateDto, userId: number) {
    await this.getPostById(postId)

    const data = {postId, ...dto, userId}
    await this.prisma.comments.create({data})
  }
}
