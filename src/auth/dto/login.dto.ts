import { UserCreateDto } from '../../users/dto/user.create.dto';
import { PickType } from '@nestjs/swagger';

export class LoginDto extends PickType(UserCreateDto, ['email', 'password'] as const) {}
