import { PostsService } from './posts.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PostsRepository } from './repository/posts.repository';
import { MockPostsRepository } from './repository/mock.posts.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { EmptyLogger } from '../common/empty.logger';

describe('PostsService', () => {
  let service: PostsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostsRepository,
          useClass: MockPostsRepository
        }
      ]
    }).compile()

    module.useLogger(new EmptyLogger())
    service = module.get<PostsService>(PostsService)
  })

  it('Should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('Get Post', () => {
    it('should get post by Id', async () => {
      const foundPost = await service.getPostById(2)
      expect(foundPost).toEqual({id: 2, title: 'Second Post', content: 'This is second dummy data.', userId: 1, published: true, viewed: 0})
    })

    it('If cannot find post with Id, it will throw Not Found Exception', async () => {
      await expect(service.getPostById(10)).rejects.toBeInstanceOf(NotFoundException)
    })
  })

  describe('Get Post list', () => {
    it('Get post list, pagination with skip and count', async () => {
      const page = 1, count = 2
      const result = await service.getPosts(page, count)

      expect(result.pagination).toEqual({page, count, totalPage: 2, totalCount: 4, currCount: count})
      expect(result.posts.length).toEqual(count)
    })

    it('Get post list, pagination with skip, count and userId', async () => {
      const page = 1, count = 1, userId = 2
      const result = await service.getPublishedPostsByUserId(userId, page, count)

      expect(result.pagination).toEqual({page, count, totalPage: 2, totalCount: 2, currCount: count})
      expect(result.posts.length).toEqual(count)
    })
  })

  describe('Create new Post', () => {
    it('should create new Post and return the post',async () => {
      const post = {
        title: 'Fifth Data',
        content: 'This is fifth dummy data.',
        published: true,
        viewed: 0
      }
      const newPost = await service.createPost(post, 5)
      expect(newPost).toEqual({
        id: 5, title: 'Fifth Data', content: 'This is fifth dummy data.', userId: 5, published: true, viewed: 0
      })
    })
  })

  describe('Update Post', () => {
    it('If cannot find post with Id, it will throw Not Found Exception', async () => {
      await expect(service.postViewUpdate(20)).rejects.toBeInstanceOf(NotFoundException)
    })

    it('should update viewed, when post was called', async () => {
      const foundPost = await service.postViewUpdate(1)
      expect(foundPost.viewed).toEqual(1)
    })

    it('If userId is not same post.userId, it will throw Forbidden Exception', async () => {
      await expect(service.updatePost({title: 'update post test'}, 2, 3)).rejects.toBeInstanceOf(ForbiddenException)
    })

    it('should update post', async () => {
      const updatedPost = await service.updatePost({title: 'update post test'}, 2, 1)
      expect(updatedPost.title).toEqual('update post test')
    })
  })

  describe('Delete Post', () => {
    it('If cannot find post with Id, it will throw Not Found Exception', async () => {
      await expect(service.deletePost(10, 1)).rejects.toBeInstanceOf(NotFoundException)
    })

    it('If userId is not same post.userId, it will throw Forbidden Exception', async () => {
      await expect(service.deletePost(2, 4)).rejects.toBeInstanceOf(ForbiddenException)
    })

    it('should delete post', async () => {
      const postId = 1
      const postWithPostId1 = await service.getPostById(postId, false)
      expect(postWithPostId1.id).toEqual(postId)
      await service.deletePost(postId, 1)
      await expect(service.getPostById(postId, false)).rejects.toBeInstanceOf(NotFoundException)
    })
  })
})