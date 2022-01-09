import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: '사용자 email 이자 곧 사용자 id' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '사용자 닉네임' })
  nickname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '사용자 비밀번호' })
  password: string;
}
