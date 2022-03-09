import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private jwtService: JwtService) {}

  async signIn(data: LoginDto) {
    const { email, password } = data;

    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user) {
      throw new BadRequestException('Check email or password');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Check email or password');
    }

    const payload = { id: user.id, n: user.nickname };

    return {
      token: this.jwtService.sign(payload)
    };
  }
}
