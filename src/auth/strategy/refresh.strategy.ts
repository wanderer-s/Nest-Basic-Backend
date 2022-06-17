import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersRepository } from '../../users/repository/users.repository';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(private readonly configService: ConfigService, private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET')
    });
  }

  async validate(token: any) {
    const user = await this.usersRepository.getUserById(token.id);
    if (user.tokenVersion !== token.v) {
      throw new UnauthorizedException();
    } else {
      return { id: token.id, n: user.nickname, v: user.tokenVersion, exp: token.exp };
    }
  }
}
