import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from './auth.resolver';
import { HttpService } from '@nestjs/axios';
import { createMock } from '@golevelup/ts-jest';
import { of } from 'rxjs';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        { provide: HttpService, useValue: createMock<HttpService>() },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    httpService = module.get<HttpService>(HttpService);
  });

  it('login mutation should return AuthResponse', async () => {
    const res = { data: { access_token: '123' } };
    jest.spyOn(httpService, 'post').mockReturnValue(of(res) as any);

    const result = await resolver.login({ email: 'a@a.com', password: '123' });
    expect(result.access_token).toBe('123');
  });

  it('register mutation should return AuthResponse', async () => {
    const res = { data: { access_token: '123' } };
    jest.spyOn(httpService, 'post').mockReturnValue(of(res) as any);

    const result = await resolver.register({ email: 'a@a.com', password: '123' });
    expect(result.access_token).toBe('123');
  });

  it('me query should call /auth/profile with Authorization header', async () => {
    const user = { email: 'a@a.com' };
    const context = { req: { headers: { authorization: 'Bearer token' } } };
    
    jest.spyOn(httpService, 'get').mockReturnValue(of({ data: user }) as any);

    const result = await resolver.me(context as any);
    expect(result.email).toBe('a@a.com');
    expect(httpService.get).toHaveBeenCalledWith(expect.any(String), {
      headers: { Authorization: 'Bearer token' },
    });
  });
});
