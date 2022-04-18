import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Posts } from '@prisma/client'
import { PostCreateDto } from './dto/post.create.dto';
import { PostUpdateDto } from './dto/post.update.dto';
import { PostsRepository } from './repository/posts.repository';
import { PostsResponseDto } from './dto/posts.response.dto';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name)
  constructor(private readonly postsRepository: PostsRepository ) {}

  async getPosts(page: number, count: number): Promise<PostsResponseDto> {
    const skip = (page - 1) * count;
    const posts = await this.postsRepository.getPublishedPosts(skip, count)

    const allPosts = await this.postsRepository.getAllPublishedPostsLength()

    const pagination = {
      page,
      count,
      totalPage: allPosts % count > 0 ? Math.floor(allPosts / count) + 1 : Math.floor(allPosts / count),
      totalCount: allPosts,
      currCount: posts.length
    };

    return { pagination, posts };
  }

  async createPost(dto: PostCreateDto, userId: number): Promise<Posts> {
    const data = { ...dto, userId };
    return await this.postsRepository.createPost(data)
  }

  async getPostById(id: number, published= true): Promise<Posts> {

    let foundPost: Posts

    if (published) {
      foundPost = await this.postsRepository.getPublishedPostById(id)
    } else {
      foundPost = await this.postsRepository.getPostById(id)
    }

    if (!foundPost) {
      this.logger.error("Couldn't find post by Id")
      throw new NotFoundException("Couldn't find post");
    }

    return foundPost;
  }

  async validateWriter(postId: number, userId: number): Promise<void> {
    const foundPost = await this.getPostById(postId, false)
    if (foundPost.userId !== userId) {
      this.logger.error('userId is not same with user who wrote post')
      throw new ForbiddenException('Access is denied');
    }
  }

  async postViewUpdate(id: number): Promise<Posts> {
    let foundPost = await this.getPostById(id);

    if (Date.now() - foundPost.updatedAt.getTime() > 300000) {
      foundPost = await this.postsRepository.updatePost(id, { viewed: { increment: 1 }});
    }

    return foundPost;
  }

  async updatePost(dto: PostUpdateDto, postId: number, userId: number): Promise<Posts> {
    await this.validateWriter(postId, userId);

    return await this.postsRepository.updatePost(postId, dto);
  }

  async deletePost(postId: number, userId: number): Promise<void> {
    await this.validateWriter(postId, userId);

    await this.postsRepository.deletePost(postId)
  }

  async getPublishedPostsByUserId(userId: number, page: number, count: number): Promise<PostsResponseDto> {
    const skip = (page - 1) * count;
    const posts = await this.postsRepository.getPublishedPostsByUserId(skip, count, userId)

    const allPosts = await this.postsRepository.getAllPublishedPostsByUserIdLength(userId)

    const pagination = {
      page,
      count,
      totalPage: allPosts % count > 0 ? Math.floor(allPosts / count) + 1 : Math.floor(allPosts / count),
      totalCount: allPosts,
      currCount: posts.length
    };

    return { posts, pagination };
  }
}
