import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../auth/dto/login.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOperation({
    summary: '사용자 로그인'
  })
  @ApiBadRequestResponse({
    description: '- `Check email or password` email 또는 비밀번호 확인필요'
  })
  @ApiOkResponse({
    description: 'signin 성공',
    schema: { type: 'object', properties: { token: { type: 'string', example: 'asdfsdf34234asdfdssakej313' } } }
  })
  @HttpCode(200)
  //
  @Post('signin')
  async signIn(@Body() dto: LoginDto) {
    return await this.authService.signIn(dto);
  }
}
