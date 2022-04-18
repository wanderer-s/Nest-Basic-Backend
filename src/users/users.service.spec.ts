import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MockUsersRepository } from './repository/mock.users.repository';
import { UsersRepository } from './repository/users.repository';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { EmptyLogger } from '../common/empty.logger';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useClass: MockUsersRepository
        }
      ]
    }).compile();

    module.useLogger(new EmptyLogger())
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get User', () => {
    it('should get user by Id', async () => {
      const foundUser = await service.getUserById(1);
      expect(foundUser).toEqual({ id: 1, email: 'test@test.com', nickname: 'tester', password: '$2b$10$GPCPQ1lQ4UbuSNwHO/wul.vXKIMZzfmAma8IVOQkEkhtLh4RFRdgW', deactivatedAt: null });
    });
  });

  describe('Sign Up', () => {
    it('if it does not follow password rule, it will throw Bad Request Exception', async () => {
      const data = {
        email: 'test2@test.com',
        nickname: 'tester2',
        password: 'a',
        passwordCheck: 'a'
      };
      await expect(service.signUp(data)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('if password and passwordCheck are not same, it will throw Bad Request Exception', async () => {
      const data = {
        email: 'test2@test.com',
        nickname: 'tester2',
        password: 'test1test',
        passwordCheck: 'test2test'
      };
      await expect(service.signUp(data)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('If nickname already exists, it will throw Bad Request Exception', async () => {
      const data = {
        email: 'test2@test.com',
        nickname: 'tester',
        password: 'test1test',
        passwordCheck: 'test1test'
      };
      await expect(service.signUp(data)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('If email already exists, it will throw Bad Request Exception', async () => {
      const data = {
        email: 'test@test.com',
        nickname: 'tester1',
        password: 'test1test',
        passwordCheck: 'test1test'
      };
      await expect(service.signUp(data)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should create new user', async() => {
      const data = {
        email: 'test2@test.com',
        nickname: 'tester2',
        password: 'test2test',
        passwordCheck: 'test2test'
      };

      await service.signUp(data)
      const foundUser = await service.getUserById(2)
      expect({ email: data.email, nickname: data.nickname})
        .toEqual({ email: 'test2@test.com', nickname: 'tester2'})
    })
  });

  describe('Update User', () => {
    it('If it cannot find User by Id, it will throw Not Found Exception', async () => {
      await expect(service.userUpdate(10, {nickname: 'update test'})).rejects.toBeInstanceOf(NotFoundException)
    })

    it('It should update User', async () => {
      const userUpdateDto = {
        nickname: 'update test'
      }
      await service.userUpdate(1, userUpdateDto)

      const foundUser = await service.getUserById(1)
      expect(foundUser.nickname).toEqual(userUpdateDto.nickname)
    })
  })

  describe('Update Password', () => {
    it('If password is invalid, it will throw Bad Request Exception', async () => {
      const passwordUpdateDto = {
        password: 'asdfaesadfe2',
        newPassword: 'test2test',
        newPasswordCheck: 'test2test'
      }
      await expect(service.passwordUpdate(1, passwordUpdateDto)).rejects.toBeInstanceOf(BadRequestException)
    })

    it('If newPassword and newPasswordCheck are not same, it will throw Bad Request Exception', async () => {
      const passwordUpdateDto = {
        password: 'test1test',
        newPassword: 'test2test',
        newPasswordCheck: '1q2ddaf32d'
      }
      await expect(service.passwordUpdate(1, passwordUpdateDto)).rejects.toBeInstanceOf(BadRequestException)
    })

    it('if newPassword does not follow password rule, it will throw Bad Request Exception', async() => {
      const passwordUpdateDto = {
        password: 'test1test',
        newPassword: 't',
        newPasswordCheck: 't'
      }
      await expect(service.passwordUpdate(1, passwordUpdateDto)).rejects.toBeInstanceOf(BadRequestException)
    })

    it('If password and newPassword are same, it will throw Bad Request Exception', async () => {
      const passwordUpdateDto = {
        password: 'test1test',
        newPassword: 'test1test',
        newPasswordCheck: 'test13test'
      }
      await expect(service.passwordUpdate(1, passwordUpdateDto)).rejects.toBeInstanceOf(BadRequestException)
    })

    it('should update password', async() => {
      const passwordUpdateDto = {
        password: 'test1test',
        newPassword: 'test2test',
        newPasswordCheck: 'test2test'
      }
      await service.passwordUpdate(1, passwordUpdateDto)
      const foundUser = await service.getUserById(1)
      const compareResult = await service.comparePassword(passwordUpdateDto.newPassword, foundUser.password)
      expect(compareResult).toEqual(true)
    })
  })

  describe('Deactivate User', () => {
    it('If it cannot find User by Id, it will throw Not Found Exception', async () => {
      await expect(service.deactivateUser(10)).rejects.toBeInstanceOf(NotFoundException)
    })

    it('should get user before deactivate process', async () => {
      const foundUser = await service.getUserById(1)

      expect({ email: foundUser.email, nickname: foundUser.nickname})
        .toEqual({ email: 'test@test.com', nickname: 'tester'})
    })

    it('should deactivate user', async () => {
      await service.deactivateUser(1)
      const foundUser = await service.getUserById(1)

      await expect(foundUser.deactivatedAt).toBeTruthy()
    })
  })
});
