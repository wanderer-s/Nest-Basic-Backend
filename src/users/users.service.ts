import { BadRequestException, Injectable } from '@nestjs/common';
import { UserCreateDto } from './dto/user.create.dto';
import { PrismaService } from 'prisma/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  validatePassword(password: string, passwordCheck: string) {
    if (!/^(?=.*\D)(?=.*\d)[\d\D\W]{8,20}$/.test(password)) {
      throw new BadRequestException('Password must follow the rule');
    }

    if (password !== passwordCheck) {
      throw new BadRequestException('password and passwordCheck must be same');
    }
  }

  async signUp(data: UserCreateDto) {
    const { email, nickname, password, passwordCheck } = data;

    const userByEmail = await this.prisma.users.findUnique({ where: { email } });

    if (userByEmail) {
      throw new BadRequestException('Email already exists');
    }

    const userByNickname = await this.prisma.users.findUnique({ where: { nickname } });

    if (userByNickname) {
      throw new BadRequestException('Nickname already exists');
    }

    this.validatePassword(password, passwordCheck);

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.users.create({ data: { email, nickname, password: hashedPassword } });
  }
}
