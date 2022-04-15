import { BadRequestException, Logger, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import bcrypt from 'bcrypt';
import { UsersRepository } from '../users/repository/users.repository';

type token = {
  token: string;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly usersRepository: UsersRepository, private jwtService: JwtService) {}

  async signIn(data: LoginDto): Promise<token> {
    const { email, password } = data;

    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) {
      this.logger.error('Invalid email');
      throw new BadRequestException('Check email or password');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      this.logger.error('Invalid password');
      throw new BadRequestException('Check email or password');
    }

    const payload = { id: user.id, n: user.nickname };

    return {
      token: this.jwtService.sign(payload)
    };
  }
}
