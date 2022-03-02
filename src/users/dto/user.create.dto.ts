import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: '사용자 email 이자 곧 사용자 id' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '사용자 닉네임' })
  readonly nickname: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '사용자 비밀번호' })
  readonly password: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ description: '사용자 비밀번호 확인' })
  readonly passwordCheck: string;
}
