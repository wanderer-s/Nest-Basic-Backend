import { Injectable } from '@nestjs/common';
import { Prisma, Users } from '@prisma/client';
import { AbstractUsersRepository } from './abstract.users.repository';

@Injectable()
export class MockUsersRepository extends AbstractUsersRepository {
  private readonly usersStorage = [];
  constructor() {
    super();
    this.usersStorage = [
      {
        id: 1,
        nickname: 'tester',
        email: 'test@test.com',
        deactivatedAt: null,
        password: '$2b$10$GPCPQ1lQ4UbuSNwHO/wul.vXKIMZzfmAma8IVOQkEkhtLh4RFRdgW' // hashed (test1test)
      }
    ];
  }

  async createUser(data: Prisma.UsersCreateInput): Promise<void> {
    const userId = this.usersStorage.length + 1;
    const userData = { ...data, id: userId };
    this.usersStorage.push(userData);
  }

  async getUserByNickName(nickname: string): Promise<Users | null> {
    return await this.usersStorage.find((user) => user.nickname === nickname);
  }

  async getUserById(id: number): Promise<Users | null> {
    return await this.usersStorage.find((user) => user.id === id);
  }

  async getUserByEmail(email: string): Promise<Users | null> {
    return await this.usersStorage.find((user) => user.email === email);
  }

  async updateUser(id: number, data: Prisma.UsersUpdateInput): Promise<Users> {
    const foundIndex = this.usersStorage.findIndex((user) => user.id === id);

    for (const [key, value] of Object.entries(data)) {
      this.usersStorage[foundIndex][key] = value;
    }
    return this.usersStorage[foundIndex];
  }
}
