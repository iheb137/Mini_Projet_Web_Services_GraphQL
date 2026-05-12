import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { UseGuards } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentToken } from '../auth/current-token.decorator';
import { UserType } from '../graphql/types/user.type';
import { AuthResponseType } from '../graphql/types/auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(private httpService: HttpService) {}

  private getUrl(path: string) {
    return `${process.env.AUTH_SERVICE_URL || 'http://localhost:3001'}${path}`;
  }

  @Mutation(() => AuthResponseType)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('role', { nullable: true }) role?: string
  ) {
    const { data } = await firstValueFrom(this.httpService.post(this.getUrl('/auth/register'), { email, password, role }));
    return data;
  }

  @Mutation(() => AuthResponseType)
  async login(
    @Args('email') email: string,
    @Args('password') password: string
  ) {
    const { data } = await firstValueFrom(this.httpService.post(this.getUrl('/auth/login'), { email, password }));
    return data;
  }

  @Query(() => UserType)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentToken() token: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(this.getUrl('/auth/profile'), {
        headers: { Authorization: token },
      })
    );
    return data;
  }
}
