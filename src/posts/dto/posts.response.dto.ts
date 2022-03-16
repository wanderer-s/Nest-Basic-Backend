import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
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
class PostofListDto extends OmitType(PostResponseDto, ['content', 'published'] as const) {
  @ApiProperty({ type: 'object', properties: { comments: { type: 'number', description: '댓글 갯수' } } })
  _count;
}
export class PostsResponseDto {
  @ApiProperty({ type: [PostofListDto] })
  posts;

  @ApiProperty()
  pagination: Pagination;
}
