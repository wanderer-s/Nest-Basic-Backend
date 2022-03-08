import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { UserCreateDto } from './dto/user.create.dto';
import { PrismaService } from 'prisma/prisma.service';
import bcrypt from 'bcrypt';
import { PasswordUpdateDto } from './dto/password.update.dto';
import { UserUpdateDto } from './dto/user.update.dto';
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

  async userFind(userId: number) {
    const foundUser = await this.prisma.users.findFirst({
      where: {
        id: userId,
        OR: [{ deactivatedAt: { gt: new Date() } }, { deactivatedAt: null }]
      }
    });
    if (!foundUser) throw new ForbiddenException('Access is denied');

    return foundUser;
  }

  async signUp(data: UserCreateDto) {
    const { email, nickname, password, passwordCheck } = data;

    const userByEmail = await this.prisma.users.findFirst({
      where: {
        email,
        OR: [{ deactivatedAt: { gt: new Date() } }, { deactivatedAt: null }]
      }
    });

    if (userByEmail) {
      throw new BadRequestException('Email already exists');
    }

    const userByNickname = await this.prisma.users.findFirst({
      where: {
        nickname,
        OR: [{ deactivatedAt: { gt: new Date() } }, { deactivatedAt: null }]
      }
    });

    if (userByNickname) {
      throw new BadRequestException('Nickname already exists');
    }

    this.validatePassword(password, passwordCheck);

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.users.create({ data: { email, nickname, password: hashedPassword } });
  }

  async passwordUpdate(userId: number, dto: PasswordUpdateDto) {
    const foundUser = await this.userFind(userId);

    this.validatePassword(dto.newPassword, dto.newPasswordCheck);

    if (!(await bcrypt.compare(dto.password, foundUser.password))) throw new BadRequestException('Wrong password');

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.users.update({ where: { id: userId }, data: { password: hashedPassword } });
  }

  async userUpdate(userId: number, dto: UserUpdateDto) {
    await this.userFind(userId);

    await this.prisma.users.update({ where: { id: userId }, data: dto });
  }

  async deactivateUser(userId: number) {
    await this.userFind(userId);
    // 탈퇴 신청 이후 7일 동안은 사용가능
    // 7일이 ms단위로 604800000
    // setHours 로 7일 후 23시 59분 59초 999밀리초 까지 유효하게 설정
    await this.prisma.users.update({
      where: {
        id: userId
      },
      data: {
        deactivatedAt: new Date(new Date(Date.now() + 604800000).setHours(23, 59, 59, 999))
      }
    });
  }
}
