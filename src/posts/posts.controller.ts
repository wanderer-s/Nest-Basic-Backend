import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { PostCreateDto } from './dto/post.create.dto';
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  //
  @ApiOperation({
    description: '## 게시물 작성',
    summary: '게시물 작성'
  })
  @ApiUnauthorizedResponse({
    description: '- `Unauthorized`'
  })
  @Post()
  async createPost(@Body() dto: PostCreateDto, @Req() req) {
    await this.postsService.createPost(dto, req.user.id);
  }

  @ApiOperation({
    description: '## 특정 게시글 호출',
    summary: '특정 게시글 호출'
  })
  @ApiParam({
    name: 'id',
    schema: {
      type: 'integer',
      example: 1
    }
  })
  @ApiNotFoundResponse({
    description: "- `Couldn't find post` 주어진 id로 게시글을 찾을 수 없음"
  })
  //
  @Get(':id')
  async getPostById(@Param('id') id: number) {
    return await this.postsService.postViewUpdate(id);
  }
}
