import { PartialType, PickType } from '@nestjs/swagger';
import { UserCreateDto } from './user.create.dto';

export class UserUpdateDto extends PartialType(PickType(UserCreateDto, ['nickname'] as const)) {}
