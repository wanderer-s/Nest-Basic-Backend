import { BadRequestException, Logger, Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcrypt';
import { UsersRepository } from '../users/repository/users.repository';
import { ConfigService } from '@nestjs/config';

type tokenSet = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly usersRepository: UsersRepository, private jwtService: JwtService, private readonly configService: ConfigService) {}

  createAccessToken(payload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRES')
    });
  }

  createRefreshToken(payload): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES')
    });
  }

  async updateUserTokenVersion(userId: number, tokenVersion?: number): Promise<any> {
    return await this.usersRepository.updateUser(userId, { tokenVersion });
  }

  async signIn(data: LoginDto): Promise<tokenSet> {
    const { email, password } = data;

    let user = await this.usersRepository.getUserByEmail(email);
    console.log(user);
    if (!user) {
      this.logger.error('Invalid email');
      throw new BadRequestException('Check email or password');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.error('Invalid password');
      throw new BadRequestException('Check email or password');
    }
    const tokenVersion = user.tokenVersion !== null ? user.tokenVersion + 1 : 1;
    user = await this.updateUserTokenVersion(user.id, tokenVersion);

    const accessTokenPayload = { id: user.id, n: user.nickname };
    const refreshTokenPayload = { id: user.id, v: user.tokenVersion };

    return {
      accessToken: this.createAccessToken(accessTokenPayload),
      refreshToken: this.createRefreshToken(refreshTokenPayload)
    };
  }

  async renewalTokenProcess(userPayload) {
    const accessToken = this.createAccessToken({ id: userPayload.id, n: userPayload.n });
    let refreshToken;
    const day = 86400;
    if (userPayload.exp / day <= 2) {
      // 유효 기간이 이틀 이하일 때
      refreshToken = this.createRefreshToken({ id: userPayload.id, v: userPayload.v + 1 });
      await this.updateUserTokenVersion(userPayload.id, userPayload.v + 1);
    }

    return {
      accessToken,
      refreshToken
    };
  }

  async logout(userId: number) {
    const user = await this.usersRepository.getUserById(userId);
    if (!user) {
      this.logger.error('Access denied');
      throw new ForbiddenException('denied');
    }

    await this.usersRepository.updateUser(userId, { tokenVersion: null });
  }
}
