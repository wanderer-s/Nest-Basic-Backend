import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshStrategy } from './strategy/refresh.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt', session: false }), JwtModule, UsersModule, ConfigModule],
  providers: [AuthService, JwtStrategy, RefreshStrategy, ConfigService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
