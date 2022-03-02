import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserCreateDto } from './dto/user.create.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('User')
@ApiInternalServerErrorResponse({
  description: '**관리자에게 문의하세요**'
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '회원가입',
    description: '## 사용자 회원 가입'
  })
  @ApiBadRequestResponse({
    description:
      '- `Email already exists` 이미 존재하는 email\n- `Nickname already exists` 이미 존재하는 nickname\n- `Password must follow the rule` 비밀번호 규칙(8~20 숫자 문자 최소 1개포함)위반\n- `password and passwordCheck must be same` 비밀번호와 비밀번호 확인 불일치'
  })
  //
  @Post('')
  async signUp(@Body() dto: UserCreateDto) {
    return await this.usersService.signUp(dto);
  }
}
