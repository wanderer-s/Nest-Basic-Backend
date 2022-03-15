import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PostsResponseDto } from './dto/posts.response.dto';
import { PostsService } from './posts.service';

@ApiTags('Posts')
@ApiInternalServerErrorResponse({
  description: '**관리자에게 문의하세요**'
})
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    description: '## 게시글 목록',
    summary: '게시글 목록'
  })
  @ApiQuery({
    name: 'page',
    type: 'integer',
    schema: {
      default: 1
    }
  })
  @ApiQuery({
    name: 'count',
    type: 'integer',
    schema: {
      default: 10
    }
  })
  @ApiOkResponse({
    type: PostsResponseDto
  })
  //
  @Get()
  async getPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('count', new DefaultValuePipe(10), ParseIntPipe) count: number
  ) {
    return await this.postsService.getPosts(page, count);
  }
}
