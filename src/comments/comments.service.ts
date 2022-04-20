import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CommentCreateDto } from './dto/comment.create.dto';
import { Comments, Posts } from '@prisma/client';
import { CommentsRepository } from './repository/comments.repository';
import { PostsRepository } from '../posts/repository/posts.repository';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);
  constructor(private readonly commentsRepository: CommentsRepository, private readonly postsRepository: PostsRepository) {}

  async getPostById(postId: number): Promise<Posts | null> {
    const foundPost = await this.postsRepository.getPostById(postId);
    if (!foundPost) {
      this.logger.error("Couldn't find post by Id");
      throw new NotFoundException("Couldn't find post");
    }

    return foundPost;
  }

  async getCommentById(commentId: number): Promise<Comments> {
    const foundComment = await this.commentsRepository.getCommentById(commentId);

    if (!foundComment) {
      this.logger.error("Couldn't find comment by Id");
      throw new NotFoundException("Couldn't find comment");
    }

    return foundComment;
  }

  async validateCommenter(comment: Comments, userId): Promise<void> {
    if (comment.userId !== userId) {
      this.logger.error('userId is not same with user who wrote comment');
      throw new ForbiddenException('Access is denied');
    }
  }

  async createComment(postId: number, dto: CommentCreateDto, userId: number): Promise<Comments> {
    await this.getPostById(postId);

    const data = { postId, ...dto, userId };
    return await this.commentsRepository.createComment(data);
  }

  async getComments(postId: number, take: number, lastCommentId?: number): Promise<Comments[]> {
    return await this.commentsRepository.getComments(postId, take, lastCommentId);
  }

  async updateComment(postId: number, commentId: number, dto: CommentCreateDto, userId: number): Promise<void> {
    await this.getPostById(postId);
    const foundComment = await this.getCommentById(commentId);
    await this.validateCommenter(foundComment, userId);

    if (postId !== foundComment.postId) {
      this.logger.error('postId is not same with that comment belongs');
      throw new ForbiddenException('Access is denied');
    }

    await this.commentsRepository.updateComment(commentId, dto);
  }
}
