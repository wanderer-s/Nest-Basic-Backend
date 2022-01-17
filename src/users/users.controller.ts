import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../auth/dto/login.dto';
import { UserCreateDto } from './dto/user.create.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('User')
@ApiInternalServerErrorResponse({
  description: '**관리자에게 문의하세요**'
})
export class UsersController {
  constructor(
    private readonly usersService: UsersService // private readonly authService: AuthService
  ) {}

  @Get(':id')
  @ApiOperation({
    summary: '사용자 정보',
    description: '## 사용자 정보 호출 API'
  })
  @ApiParam({
    name: 'email',
    description: '사용자 email',
    example: 'test@test.com'
  })
  @ApiOkResponse({
    description: '성공'
  })
  findOne(@Param('id') id: number) {
    return `this is your ${id}`;
  }

  @Post('signin')
  signIn(@Body() data: LoginDto) {
    return 'sign in';
  }

  @Post()
  async signUp(@Body() data: UserCreateDto) {
    return await this.usersService.signUp(data);
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() data) {
    return `This is PUT request id : ${id}`;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return `This is DELETE request id : ${id}`;
  }
}
