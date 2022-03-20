import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class PostCreateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '게시글 제목' })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: '게시글 내용' })
  content: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: '게시글 공개여부' })
  published: boolean;
}
