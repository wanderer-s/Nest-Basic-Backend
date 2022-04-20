import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { CommentsRepository } from './repository/comments.repository';
import { MockCommentsRepository } from './repository/mock.comments.repository';
import { PostsRepository } from '../posts/repository/posts.repository';
import { MockPostsRepository } from '../posts/repository/mock.posts.repository';
import { EmptyLogger } from '../common/empty.logger';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: CommentsRepository,
          useClass: MockCommentsRepository
        },
        {
          provide: PostsRepository,
          useClass: MockPostsRepository
        }
      ]
    }).compile();

    module.useLogger(new EmptyLogger());
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get Comment', () => {
    it('should get comment by Id', async () => {
      const foundComment = await service.getCommentById(1);
      expect(foundComment).toEqual({ id: 1, comment: 'This is first comment', postId: 1, userId: 1 });
    });

    it('If cannot get comment by Id, it will throw Not Found Exception', async () => {
      await expect(service.getCommentById(10)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('Get Comment list', () => {
    it('should get comment list', async () => {
      const comments = await service.getComments(1, 2);
      expect(comments).toEqual([
        { id: 4, comment: 'This is fourth comment', postId: 1, userId: 2 },
        { id: 3, comment: 'This is third comment', postId: 1, userId: 2 }
      ]);
    });

    it('If postId does not exist, it will return empty array', async () => {
      const comments = await service.getComments(10, 2);
      expect(comments.length).toEqual(0);
    });

    it('should get comments after lastCommentId', async () => {
      const comments = await service.getComments(1, 2, 3);
      expect(comments).toEqual([
        { id: 2, comment: 'This is second comment', postId: 1, userId: 1 },
        { id: 1, comment: 'This is first comment', postId: 1, userId: 1 }
      ]);
    });
  });

  describe('Create Comment', () => {
    const createCommentDto = {
      comment: 'This is test'
    };
    it('should create new comment', async () => {
      await service.createComment(1, createCommentDto, 2);
      const getComments = await service.getComments(1, 1);

      expect(getComments[0].comment).toEqual(createCommentDto.comment);
    });

    it('If post does not exist, it will throw Not Found Exception', async () => {
      await expect(service.createComment(10, createCommentDto, 2)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('Update Comment', () => {
    const updateCommentDto = {
      comment: 'This is update test'
    };

    it('If postId and commentId does not match, it will throw Forbidden Exception', async () => {
      await expect(service.updateComment(2, 2, updateCommentDto, 1)).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('If userId and commentId does not match, it will throw Forbidden Exception', async () => {
      await expect(service.updateComment(1, 2, updateCommentDto, 2)).rejects.toBeInstanceOf(ForbiddenException);
    });

    it('should update comment', async () => {
      await service.updateComment(1, 2, updateCommentDto, 1);
      const foundComment = await service.getCommentById(2);

      expect(foundComment.comment).toEqual(updateCommentDto.comment);
    });
  });
});
