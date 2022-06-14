import { Prisma, Users } from '@prisma/client';

export abstract class AbstractUsersRepository {
  abstract createUser(data: Prisma.UsersCreateInput): Promise<void>;

  abstract getUserByNickName(nickname: string): Promise<Users | null>;

  abstract getUserById(id: number): Promise<Users | null>;

  abstract getUserByEmail(email: string): Promise<Users | null>;

  abstract updateUser(id: number, data: Prisma.UsersUpdateInput): Promise<Users>;
}
