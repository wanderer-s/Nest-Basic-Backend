import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
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
  async createComment(@Param('id') postId: number, @Body() dto: CommentCreateDto, @Req() req) {
    await this.commentsService.createComment(postId, dto, req.user.id)
  }
}
