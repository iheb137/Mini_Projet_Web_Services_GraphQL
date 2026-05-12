import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: createMock<UsersService>() },
        { provide: JwtService, useValue: createMock<JwtService>() },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should throw ConflictException if email already exists', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(createMock<any>());
      await expect(service.register('test@test.com', 'password')).rejects.toThrow(ConflictException);
    });

    it('should hash password and return user + token', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(undefined);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      const mockedUser = { id: 1, email: 'test@test.com', password: 'hashed_password' } as any;
      jest.spyOn(usersService, 'create').mockResolvedValue(mockedUser);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await service.register('test@test.com', 'password');
      expect(result.access_token).toBe('token');
      expect(result.user.email).toBe('test@test.com');
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(undefined);
      await expect(service.login('test@test.com', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue({ password: 'hashed' } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login('test@test.com', 'pass')).rejects.toThrow(UnauthorizedException);
    });

    it('should return access_token on valid credentials', async () => {
      const user = { id: 1, email: 'test@test.com', password: 'hashed' } as any;
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('valid_token');

      const result = await service.login('test@test.com', 'pass');
      expect(result.access_token).toBe('valid_token');
    });
  });
});
