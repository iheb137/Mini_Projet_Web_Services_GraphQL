import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ZoneType } from '../graphql/types/zone.type';

@Resolver(() => ZoneType)
export class TrafficResolver {
  constructor(private httpService: HttpService) {}

  private getUrl(path: string) {
    return `${process.env.TRAFFIC_SERVICE_URL || 'http://localhost:3003'}${path}`;
  }

  @Query(() => [ZoneType])
  async zones() {
    const { data } = await firstValueFrom(this.httpService.get(this.getUrl('/zones')));
    return data;
  }

  @Query(() => [ZoneType])
  async congestedZones() {
    const { data } = await firstValueFrom(this.httpService.get(this.getUrl('/zones/congested')));
    return data;
  }

  @Mutation(() => ZoneType)
  async createZone(
    @Args('name') name: string,
    @Args('centerLat') centerLat: number,
    @Args('centerLng') centerLng: number,
    @Args('radiusMeters') radiusMeters: number
  ) {
    const body = { name, centerLat, centerLng, radiusMeters };
    const { data } = await firstValueFrom(this.httpService.post(this.getUrl('/zones'), body));
    return data;
  }

  @Mutation(() => ZoneType)
  async updateZoneDensity(
    @Args('id') id: string,
    @Args('vehicleCount', { type: () => Int }) vehicleCount: number
  ) {
    const body = { vehicleCount };
    const { data } = await firstValueFrom(this.httpService.patch(this.getUrl(`/zones/${id}/density`), body));
    return data;
  }
}
