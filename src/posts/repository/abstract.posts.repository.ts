import { Posts, Prisma } from '@prisma/client';

export abstract class AbstractPostsRepository {
  abstract getPublishedPosts(skip: number, take: number): Promise<any[]>;

  abstract getAllPublishedPostsLength(): Promise<number>;

  abstract getPostById(id: number): Promise<Posts | null>;

  abstract getPublishedPostById(id: number): Promise<Posts | null>;

  abstract updatePost(id: number, data: Prisma.PostsUpdateInput): Promise<Posts>;

  abstract getPublishedPostsByUserId(skip: number, take: number, userId: number): Promise<any[]>;

  abstract getAllPublishedPostsByUserIdLength(userId: number): Promise<number>;

  abstract createPost(data: Prisma.PostsCreateInput): Promise<Posts>;

  abstract deletePost(id: number): Promise<void>;
}