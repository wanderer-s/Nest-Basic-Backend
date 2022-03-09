import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordUpdateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '현재 비밀번호' })
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '변경할 비밀번호' })
  newPassword: string;

  @IsString()
  @ApiProperty({ description: '변경할 비밀번호 확인' })
  readonly newPasswordCheck: string;
}
