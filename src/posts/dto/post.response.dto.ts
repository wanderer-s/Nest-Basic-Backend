import { ApiProperty } from '@nestjs/swagger';
import { PostCreateDto } from './post.create.dto';

export class PostResponseDto extends PostCreateDto {
  @ApiProperty({ description: '게시글 조회수' })
  viewed: number;

  @ApiProperty({ description: '게시글 작성자 id' })
  userId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
