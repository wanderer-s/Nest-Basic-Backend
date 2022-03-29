import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CommentCreateDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({description: '댓글 내용'})
    comment: string
}