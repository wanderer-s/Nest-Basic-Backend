import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';

@Controller('posts/:id/comments')
@ApiTags('Posts')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
}
