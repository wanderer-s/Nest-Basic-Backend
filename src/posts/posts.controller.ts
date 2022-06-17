import { Body, Controller, DefaultValuePipe, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { PostCreateDto } from './dto/post.create.dto';
import { PostUpdateDto } from './dto/post.update.dto';
import { PostsResponseDto } from './dto/posts.response.dto';
import { PostResponseDto } from './dto/post.response.dto';
import { PostsService } from './posts.service';
import { Posts } from '@prisma/client';

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
    required: false,
    schema: {
      default: 1
    }
  })
  @ApiQuery({
    name: 'count',
    type: 'integer',
    required: false,
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
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('count', new DefaultValuePipe(10)) count: number
  ): Promise<PostsResponseDto> {
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
  @ApiCreatedResponse({
    type: PostResponseDto
  })
  //
  @Post()
  async createPost(@Body() dto: PostCreateDto, @Req() req): Promise<Posts> {
    return await this.postsService.createPost(dto, req.user.id);
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
  @ApiOkResponse({
    type: PostResponseDto
  })
  //
  @Get(':id')
  async getPostById(@Param('id') id: number) {
    return await this.postsService.postViewUpdate(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  //
  @ApiOperation({
    description: '## 게시글 수정\n- 제목\n- 내용\n- 공개여부',
    summary: '게시글 수정'
  })
  @ApiParam({
    name: 'id',
    description: '게시글 id',
    schema: {
      type: 'integer',
      example: 1
    }
  })
  @ApiUnauthorizedResponse({
    description: '- `Unauthorized`'
  })
  @ApiForbiddenResponse({
    description: '- `Access is denied` 잘못된 접근'
  })
  @ApiNotFoundResponse({
    description: "- `Couldn't find post` 주어진 id로 게시글을 찾을 수 없음"
  })
  @ApiOkResponse({
    type: PostResponseDto
  })
  //
  @Patch(':id')
  async updatePostById(@Param('id') id: number, @Body() dto: PostUpdateDto, @Req() req): Promise<Posts> {
    return await this.postsService.updatePost(dto, id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  //
  @ApiOperation({
    summary: '게시글 삭제',
    description: '## 게시글 삭제'
  })
  @ApiParam({
    name: 'id',
    description: '게시글 id',
    schema: {
      type: 'integer',
      example: 1
    }
  })
  @ApiUnauthorizedResponse({
    description: '- `Unauthorized`'
  })
  @ApiForbiddenResponse({
    description: '- `Access is denied` 잘못된 접근'
  })
  @ApiNotFoundResponse({
    description: "- `Couldn't find post` 주어진 id로 게시글을 찾을 수 없음"
  })
  //
  @Delete(':id')
  async deletePost(@Param('id') id: number, @Req() req) {
    await this.postsService.deletePost(id, req.user.id);
  }

  @ApiOperation({
    summary: '특정 사용자가 게시한 게시글 호출',
    description: '## 특정 사용자가 게시한 게시글 호출'
  })
  @ApiParam({
    name: 'id',
    description: '사용자 id',
    schema: {
      type: 'integer',
      example: 1
    }
  })
  @ApiQuery({
    name: 'page',
    type: 'integer',
    required: false,
    schema: {
      default: 1
    }
  })
  @ApiQuery({
    name: 'count',
    type: 'integer',
    required: false,
    schema: {
      default: 10
    }
  })
  @ApiOkResponse({
    type: PostsResponseDto
  })
  @ApiNotFoundResponse({
    description: '- `Could not find user`'
  })
  //
  @Get('byuser/:id')
  async getPostsByUser(
    @Param('id') id: number,
    @Query('page', new DefaultValuePipe(1)) page: number,
    @Query('count', new DefaultValuePipe(10)) count: number
  ): Promise<PostsResponseDto> {
    return await this.postsService.getPublishedPostsByUserId(id, page, count);
  }
}
