import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { NotificationType } from '../graphql/types/notification.type';

@Resolver(() => NotificationType)
export class NotificationsResolver {
  constructor(private httpService: HttpService) {}

  private getUrl(path: string) {
    return `${process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3005'}${path}`;
  }

  @Query(() => [NotificationType])
  async notifications(@Args('userId', { nullable: true }) userId?: string) {
    const query = userId ? `?userId=${userId}` : '';
    const { data } = await firstValueFrom(this.httpService.get(this.getUrl(`/notifications${query}`)));
    return data;
  }

  @Mutation(() => NotificationType)
  async createNotification(
    @Args('title') title: string,
    @Args('message') message: string,
    @Args('type') type: string,
    @Args('userId', { nullable: true }) userId?: string
  ) {
    const body = { title, message, type, userId };
    const { data } = await firstValueFrom(this.httpService.post(this.getUrl('/notifications'), body));
    return data;
  }

  @Mutation(() => NotificationType)
  async markNotificationRead(@Args('id') id: string) {
    const { data } = await firstValueFrom(this.httpService.patch(this.getUrl(`/notifications/${id}/read`)));
    return data;
  }

  @Mutation(() => NotificationType)
  async broadcast(
    @Args('title') title: string,
    @Args('message') message: string,
    @Args('type') type: string
  ) {
    const body = { title, message, type };
    const { data } = await firstValueFrom(this.httpService.post(this.getUrl('/notifications/broadcast'), body));
    return data;
  }
}
