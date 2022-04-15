import {PrismaService} from '../../common/prisma.service';
import { Users, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}


  async createUser(data: Prisma.UsersCreateInput) {
    await this.prisma.users.create({
      data
    })
  }

  async getUserByNickName(nickname: string): Promise<Users|null> {
    return await this.prisma.users.findFirst({
      where: {
        nickname,
        deactivatedAt: null
      }
    })
  }

  async getUserById(id: number): Promise<Users|null> {
    return await this.prisma.users.findFirst({
      where: {
        id,
        deactivatedAt: null
      }
    })
  }

  async getUserByEmail(email: string): Promise<Users|null> {
    return await this.prisma.users.findFirst({
      where: {
        email,
        deactivatedAt: null
      }
    })
  }

  async updateUser(id: number, data: Prisma.UsersUpdateInput): Promise<void> {
    await this.prisma.users.update({
      where: {
        id
      },
      data
    })
  }
}