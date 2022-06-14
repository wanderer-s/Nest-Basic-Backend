import { Body, Controller, Delete, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiBadRequestResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../auth/dto/login.dto';
import { RefreshAuthGuard } from './strategy/refresh.guard';
import { UsersRepository } from '../users/repository/users.repository';
import { JwtAuthGuard } from './strategy/jwt.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersRepository: UsersRepository) {}
  @ApiOperation({
    summary: '사용자 로그인'
  })
  @ApiBadRequestResponse({
    description: '- `Check email or password` email 또는 비밀번호 확인필요'
  })
  @ApiOkResponse({
    description: 'signin 성공',
    schema: { type: 'object', properties: { accessToken: { type: 'string', example: 'asdfsdf34234asdfdssakej313' } } }
  })
  @HttpCode(200)
  //
  @Post('signin')
  async signIn(@Body() dto: LoginDto) {
    return await this.authService.signIn(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('logout')
  async logout(@Req() req) {
    await this.authService.logout(req.user.id);
  }

  @ApiOperation({
    summary: 'token 발급',
    description: '## 인증 token 발급 및 갱신'
  })
  @ApiBody({
    schema: {
      properties: {
        refreshToken: {
          type: 'string'
        }
      },
      required: ['refreshToken']
    }
  })
  @ApiOkResponse({
    schema: {
      properties: {
        accessToken: {
          type: 'string'
        },
        refreshToken: {
          type: 'string'
        }
      },
      required: ['accessToken']
    }
  })
  @ApiUnauthorizedResponse({
    description: '유효하지 않은 인증수단'
  })
  //
  @UseGuards(RefreshAuthGuard)
  @Post('token')
  async renewalToken(@Req() req) {
    return await this.authService.renewalTokenProcess(req.user);
  }
}
