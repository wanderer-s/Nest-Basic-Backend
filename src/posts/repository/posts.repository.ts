import { PrismaService } from '../../common/prisma.service';
import { Posts, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsRepository {
  constructor(private prisma: PrismaService) {}

  async getPublishedPosts(skip: number, take: number) {
    return await this.prisma.posts.findMany({
      select: {
        id: true,
        title: true,
        viewed: true,
        userId: true,
        content: false,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            comments: true
          }
        }
      },
      where: { published: true },
      skip,
      take,
      orderBy: { createdAt: 'desc'}
    })
  }

  async getAllPublishedPostsLength(): Promise<number> {
    return await this.prisma.posts.count({where: {published: true}})
  }

  async getPostById(id: number): Promise<Posts|null> {
    return await this.prisma.posts.findUnique({where: {id}})
  }

  async getPublishedPostById(id: number): Promise<Posts|null> {
    return await this.prisma.posts.findFirst({where: {id, published: true}})
  }

  async updatePost(id: number, data: Prisma.PostsUpdateInput): Promise<Posts> {
    return await this.prisma.posts.update({ where: {id}, data})
  }

  async getPublishedPostsByUserId(skip: number, take: number, userId: number): Promise<any[]> {
    return await this.prisma.posts.findMany({
      select: {
        id: true,
        title: true,
        viewed: true,
        userId: true,
        content: false,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            comments: true
          }
        }
      },
      where: { userId, published: true },
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    })
  }

  async getAllPublishedPostsByUserIdLength(userId: number): Promise<number> {
    return await this.prisma.posts.count({where: {userId, published: true}})
  }

  async createPost(data: Prisma.PostsCreateInput): Promise<Posts> {
    return await this.prisma.posts.create({data})
  }

  async deletePost(id: number): Promise<void> {
    await this.prisma.posts.delete({where: {id}})
  }
}