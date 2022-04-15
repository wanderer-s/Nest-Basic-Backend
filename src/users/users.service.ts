import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserCreateDto } from './dto/user.create.dto';
import bcrypt from 'bcrypt';
import { PasswordUpdateDto } from './dto/password.update.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { UsersRepository } from './repository/users.repository';
import { Users } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly usersRepository: UsersRepository) {}

  validatePassword(password: string, passwordCheck: string) {
    if (!/^(?=.*\D)(?=.*\d)[\d\D\W]{8,20}$/.test(password)) {
      this.logger.error('Not meet the password rule');
      throw new BadRequestException('Password must follow the rule');
    }

    if (password !== passwordCheck) {
      this.logger.error('password, passwordCheck did not match');
      throw new BadRequestException('password and passwordCheck must be same');
    }
  }

  async getUserById(userId): Promise<Users> {
    const foundUser = await this.usersRepository.getUserById(userId);

    if (!foundUser) {
      this.logger.error('Cannot find User');
      throw new NotFoundException('Cannot find User');
    }

    return foundUser;
  }

  async signUp(userCreateDto: UserCreateDto): Promise<void> {
    const { email, nickname, password, passwordCheck } = userCreateDto;
    let foundUser = await this.usersRepository.getUserByNickName(nickname);

    if (foundUser) {
      foundUser = null;
      this.logger.error('Nickname already exists');
      throw new BadRequestException('Nickname already exists');
    }

    foundUser = await this.usersRepository.getUserByEmail(email);
    if (foundUser) {
      foundUser = null;
      this.logger.error('Email already exists');
      throw new BadRequestException('Email already exists');
    }

    this.validatePassword(password, passwordCheck);

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usersRepository.createUser({ email, nickname, password: hashedPassword });
  }

  async passwordUpdate(userId: number, dto: PasswordUpdateDto): Promise<void> {
    const foundUser = await this.getUserById(userId);

    this.validatePassword(dto.newPassword, dto.newPasswordCheck);

    if (!(await bcrypt.compare(dto.password, foundUser.password))) {
      this.logger.error('Invalid Password');
      throw new BadRequestException('Invalid Password');
    }

    if (dto.password === dto.newPassword) {
      this.logger.error('password and new password are same');
      throw new BadRequestException('password and new password cannot be same');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.usersRepository.updateUser(userId, { password: hashedPassword });
  }

  async userUpdate(userId: number, userUpdateDto: UserUpdateDto): Promise<void> {
    await this.getUserById(userId);

    await this.usersRepository.updateUser(userId, userUpdateDto);
  }

  async deactivateUser(userId: number): Promise<void> {
    const foundUser = await this.getUserById(userId);

    await this.usersRepository.updateUser(userId, {
      email: `${foundUser.email}_${new Date().toISOString()}`,
      nickname: `${foundUser.nickname}_${new Date().toISOString()}`,
      deactivatedAt: new Date()
    });
  }
}
