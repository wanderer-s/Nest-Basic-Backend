import { Injectable } from '@nestjs/common';
import {Prisma, Posts} from '@prisma/client'

@Injectable()
export class MockPostsRepository {
  private readonly postsStorage = []
  constructor() {
    this.postsStorage = [
      {
        id: 1,
        title: 'First Post',
        content: 'This is first dummy data.',
        userId: 1,
        published: true,
        viewed: 0,
        createdAt: new Date(Date.now() - 8.64e+7),
        updatedAt: new Date(Date.now() - 8.64e+7)
      },
      {
        id: 2,
        title: 'Second Post',
        content: 'This is second dummy data.',
        userId: 1,
        published: true,
        viewed: 0
      },
      {
        id: 3,
        title: 'Third Post',
        content: 'This is third dummy data.',
        userId: 2,
        published: true,
        viewed: 0
      },
      {
        id: 4,
        title: 'Fourth Post',
        content: 'This is fourth dummy data.',
        userId: 2,
        published: true,
        viewed: 0
      }
    ]
  }

  filterPublishedPostsByUserId(userId) {
    return this.postsStorage.map(post => {
      if(post.userId === userId && post.published) {
        const {content, ...restOfPost} = post
        return restOfPost
      }
    }).filter(post => post)
  }

  filterPublishedPosts() {
    return this.postsStorage.map(post => {
      if(post.published) {
        const {content, ...restOfPost} = post
        return restOfPost
      }
    }).filter(post => post)
  }

  async getPublishedPosts(skip: number, take: number): Promise<any[]> {
    const filteredPost = this.filterPublishedPosts()
    const posts = []

    for(let i = skip; i < take; i++) {
      posts.push(filteredPost[i])
    }

    return posts
  }

  async getAllPublishedPostsLength(): Promise<number> {
    return this.filterPublishedPosts().length
  }

  async getPostById(id: number): Promise<Posts|null> {
    return await this.postsStorage.find(post => post.id === id)
  }

  async getPublishedPostById(id: number): Promise<Posts|null> {
    return await this.postsStorage.find(post => post.id === id && post.published)
  }

  async updatePost(id: number, data: Prisma.PostsUpdateInput): Promise<Posts> {
    const foundIndex = this.postsStorage.findIndex(post => post.id === id);

    for (const [key, value] of Object.entries(data)) {
      if (key === 'viewed') {
        this.postsStorage[foundIndex][key] += 1
      } else {
        this.postsStorage[foundIndex][key] = value;
      }
    }

    return this.postsStorage[foundIndex]
  }

  async getPublishedPostsByUserId(skip: number, take: number, userId: number) {
    const filteredByUserId = this.filterPublishedPostsByUserId(userId)
    const posts = []
    for(let i = skip; i < take; i++) {
      posts.push(filteredByUserId[i])
    }

    return posts
  }

  async getAllPublishedPostsByUserIdLength(userId: number): Promise<number> {
    return this.filterPublishedPostsByUserId(userId).length
  }

  async createPost(data: Prisma.PostsCreateInput): Promise<Posts> {
    const postId = this.postsStorage.length + 1
    this.postsStorage.push({id: postId, ...data})
    return await this.postsStorage[postId - 1]
  }

  async deletePost(id: number): Promise<void> {
    const foundIndex = this.postsStorage.findIndex(post => post.id === id);

    this.postsStorage.splice(foundIndex, 1)
  }
}