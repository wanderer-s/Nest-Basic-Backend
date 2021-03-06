import { Body, Controller, Delete, Patch, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { PasswordUpdateDto } from './dto/password.update.dto';
import { UserCreateDto } from './dto/user.create.dto';
import { UserUpdateDto } from './dto/user.update.dto';
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
  async signUp(@Body() dto: UserCreateDto): Promise<void> {
    return await this.usersService.signUp(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  //
  @ApiOperation({
    summary: '비밀번호 변경',
    description: '## 사용자 비밀번호 변경'
  })
  @ApiUnauthorizedResponse({
    description: '- `Unauthorized`'
  })
  @ApiBadRequestResponse({
    description:
      '- `Invalid Password` 잘못된 비밀번호\n- `Password must follow the rule` 비밀번호는 8~20자리이며 숫자와 문자 최소 1개 포함\n- `password and passwordCheck must be same` 변경할 비밀번호와 비밀번호확인 불일치\n- `password and new password cannot be same` 기존 비밀번호와 변경할 비밀번호는 같을 수 없음'
  })
  @ApiForbiddenResponse({
    description: '- `Access is denied` 잘못된 접근'
  })
  //
  @Patch('password')
  async passwordUpdate(@Body() dto: PasswordUpdateDto, @Req() req): Promise<void> {
    await this.usersService.passwordUpdate(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  //
  @ApiOperation({
    description: '## 사용자 정보변경',
    summary: '정보변경'
  })
  @ApiUnauthorizedResponse({
    description: '- `Unauthorized`'
  })
  @ApiForbiddenResponse({
    description: '- `Access is denied` 잘못된 접근'
  })
  //
  @Patch()
  async userUpdate(@Body() dto: UserUpdateDto, @Req() req): Promise<void> {
    await this.usersService.userUpdate(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  //
  @ApiOperation({
    description: '## 회원탈퇴',
    summary: '회원탈퇴'
  })
  @ApiUnauthorizedResponse({
    description: '- `Unauthorized`'
  })
  @ApiForbiddenResponse({
    description: '- `Access is denied` 잘못된 접근'
  })
  @Delete()
  async deactivateUser(@Req() req): Promise<void> {
    await this.usersService.deactivateUser(req.user.id);
  }
}
