import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createMock<Repository<User>>(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should create a user', async () => {
    const user = { email: 'a@a.com', password: 'pwd' };
    jest.spyOn(repository, 'create').mockReturnValue(user as any);
    jest.spyOn(repository, 'save').mockResolvedValue(user as any);

    const result = await service.create('a@a.com', 'pwd');
    expect(result.email).toBe('a@a.com');
  });

  it('should find user by email', async () => {
    const user = { email: 'test@test.com' } as any;
    jest.spyOn(repository, 'findOne').mockResolvedValue(user);

    const result = await service.findByEmail('test@test.com');
    expect(result).toBe(user);
  });

  it('should return undefined if user not found', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);
    const result = await service.findByEmail('test@test.com');
    expect(result).toBeUndefined();
  });
});
