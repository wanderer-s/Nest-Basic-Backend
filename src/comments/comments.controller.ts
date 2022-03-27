import {Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards} from '@nestjs/common';
import {
  ApiBearerAuth, ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CommentsService } from './comments.service';
import { CommentCreateDto } from './dto/comment.create.dto';
import { CommentsResponseDto } from './dto/comments.response.dto';

@Controller('posts/:id/comments')
@ApiTags('Posts')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  //
  @ApiOperation({
    summary: '댓글 남기기',
    description: '## 게시글에 댓글 남기기'
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
  @ApiNotFoundResponse({
    description: "- `Couldn't find post` 주어진 id로 게시글을 찾을 수 없음"
  })
  //
  @Post()
  async createComment(@Param('id') id: number, @Body() dto: CommentCreateDto, @Req() req) {
    await this.commentsService.createComment(id, dto, req.user.id)
  }

  @ApiOperation({
    summary: '게시글에 달린 댓글 불러오기'
  })
  @ApiParam({
    name: 'id',
    description: '게시글 id',
    schema: {
      type: 'integer',
      example: 1
    }
  })
  @ApiQuery({
    name: 'lastCommentId',
    description: '댓글을 더 불러오기 전 가장 하단에 있던 commentId',
    required: false,
    schema: {
      type: 'integer'
    }
  })
  @ApiOkResponse({
    type: CommentsResponseDto
  })
  //
  @Get()
  async getComments(@Param('id') id: number, @Query('lastCommentId') lastCommentId?: number) {
    return await this.commentsService.getComments(id, lastCommentId)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  //
  @ApiOperation({
    summary: '댓글 수정'
  })
  @ApiParam({
    name: 'id',
    description: '게시글 id',
    schema: {
      type: 'integer',
      example: 1
    }
  })
  @ApiParam({
    name: 'commentId',
    description: '댓글 id',
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
    description: "- `Couldn't find post` 주어진 id로 게시글을 찾을 수 없음\n - `Couldn't find comment` 주어진 id로 댓글을 찾을 수 없음"
  })
  //
  @Patch(':commentId')
  async patchComment(@Param('id') id: number, @Param('commentId') commentId: number, @Body() dto: CommentCreateDto, @Req() req) {
    await this.commentsService.updateComment(id, commentId, dto, req.user.id)
  }
}
