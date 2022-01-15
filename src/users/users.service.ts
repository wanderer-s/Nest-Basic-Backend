import { HttpStatus, Injectable } from '@nestjs/common';
import { Users } from '@prisma/client';
import { UserCreateDto } from './dto/user.create.dto';
import { HttpException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async signUp(data: UserCreateDto) {
    const { email, nickname, password, passwordCheck } = data;

    const userByEmail = await this.usersRepository.findUser({ email });

    if (userByEmail) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const userByNickname = await this.usersRepository.findUser({ nickname });

    if (userByNickname) {
      throw new HttpException('Nickname already exists', HttpStatus.BAD_REQUEST);
    }

    if (!/^(?=.*\D)(?=.*\d)[\d\D\W]{8,20}$/.test(password)) {
      throw new HttpException('You must follow password rule', HttpStatus.BAD_REQUEST);
    }

    if (password !== passwordCheck) {
      throw new HttpException('password and passwordCheck must be same', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.signUp({ email, nickname, password: hashedPassword });
  }

  async getUser(data): Promise<Users> {
    return await this.usersRepository.findUser(data);
  }
}
