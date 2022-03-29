import { ApiProperty } from "@nestjs/swagger"
import { CommentCreateDto } from "./comment.create.dto"

class CommentResponseDto extends CommentCreateDto{
    @ApiProperty({description: '댓글 id'})
    id: number

    @ApiProperty({description: '댓글이 달린 게시글 id'})
    postId: number

    @ApiProperty({description: '댓글을 남긴 사용자 id'})
    userId: number

    @ApiProperty({})
    createdAt: Date

    @ApiProperty({})
    updatedAt: Date
}

export class CommentsResponseDto {
    @ApiProperty({type: [CommentResponseDto]})
    comments: CommentResponseDto[]
}