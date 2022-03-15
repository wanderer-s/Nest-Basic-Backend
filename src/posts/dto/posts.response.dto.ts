import { ApiProperty } from '@nestjs/swagger';
import { PostResponseDto } from './post.response.dto';

class Pagination {
  @ApiProperty({ description: '요청한 page로 가져온 현재 page' })
  page: number;

  @ApiProperty({ description: '요청한 count' })
  count: number;

  @ApiProperty({ description: '총 page 갯수' })
  totalPage: number;

  @ApiProperty({ description: '총 post의 갯수' })
  totalCount: number;

  @ApiProperty({ description: '현재 page의 post 갯수' })
  currCount: number;
}

export class PostsResponseDto {
  @ApiProperty({ type: [PostResponseDto] })
  posts;

  @ApiProperty()
  pagination: Pagination;
}
