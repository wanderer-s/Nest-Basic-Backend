import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { PostCreateDto } from './dto/post.create.dto';
import { PostUpdateDto } from './dto/post.update.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getPosts(page: number, count: number) {
    const skip = (page - 1) * count;
    const posts = await this.prisma.posts.findMany({
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
      take: count,
      orderBy: { createdAt: 'desc' }
    });

    const allPosts = await this.prisma.posts.count({ where: { published: true } });

    const pagination = {
      page,
      count,
      totalPage: allPosts % page > 0 ? Math.floor(allPosts / page) + 1 : Math.floor(allPosts / page),
      totalCount: allPosts,
      currCount: posts.length
    };

    return { pagination, posts };
  }

  async createPost(dto: PostCreateDto, userId: number) {
    const data = { ...dto, userId };
    await this.prisma.posts.create({ data });
  }

  async getPostById(id: number) {
    const foundPost = await this.prisma.posts.findUnique({ where: { id } });

    if (!foundPost) throw new NotFoundException("Couldn't find post");

    return foundPost;
  }

  async postViewUpdate(id: number) {
    let foundPost = await this.getPostById(id);

    if (Date.now() - foundPost.updatedAt.getTime() > 300000) {
      foundPost = await this.prisma.posts.update({ where: { id }, data: { viewed: { increment: 1 } } });
    }

    return foundPost;
  }

  async updatePost(dto: PostUpdateDto, postId: number, userId: number) {
    const foundPost = await this.getPostById(postId);

    if (foundPost.userId !== userId) throw new ForbiddenException('Access is denied');

    await this.prisma.posts.update({ where: { id: postId }, data: dto });
  }
}
