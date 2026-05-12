import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { UseGuards } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentToken } from '../auth/current-token.decorator';
import { VehicleType } from '../graphql/types/vehicle.type';
import { GpsPositionType } from '../graphql/types/gps-position.type';

@Resolver(() => VehicleType)
export class VehiclesResolver {
  constructor(private httpService: HttpService) {}

  private getUrl(path: string) {
    return `${process.env.VEHICLES_SERVICE_URL || 'http://localhost:3002'}${path}`;
  }

  @Query(() => [VehicleType])
  @UseGuards(GqlAuthGuard)
  async vehicles(@CurrentToken() token: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(this.getUrl('/vehicles'), { headers: { Authorization: token } })
    );
    return data;
  }

  @Query(() => VehicleType)
  @UseGuards(GqlAuthGuard)
  async vehicle(@Args('id') id: string, @CurrentToken() token: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(this.getUrl(`/vehicles/${id}`), { headers: { Authorization: token } })
    );
    return data;
  }

  @Mutation(() => VehicleType)
  @UseGuards(GqlAuthGuard)
  async createVehicle(
    @Args('plate') plate: string,
    @Args('type') type: string,
    @Args('brand') brand: string,
    @Args('model') model: string,
    @Args('ownerId') ownerId: string,
    @CurrentToken() token: string
  ) {
    const body = { plate, type, brand, model, ownerId };
    const { data } = await firstValueFrom(
      this.httpService.post(this.getUrl('/vehicles'), body, { headers: { Authorization: token } })
    );
    return data;
  }

  @Mutation(() => GpsPositionType)
  @UseGuards(GqlAuthGuard)
  async addGpsPosition(
    @Args('vehicleId') vehicleId: string,
    @Args('latitude') latitude: number,
    @Args('longitude') longitude: number,
    @Args('speed', { nullable: true }) speed: number,
    @CurrentToken() token: string
  ) {
    const body = { latitude, longitude, speed };
    const { data } = await firstValueFrom(
      this.httpService.post(this.getUrl(`/vehicles/${vehicleId}/gps`), body, { headers: { Authorization: token } })
    );
    return data;
  }

  @Query(() => [GpsPositionType])
  @UseGuards(GqlAuthGuard)
  async vehicleHistory(@Args('vehicleId') vehicleId: string, @CurrentToken() token: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(this.getUrl(`/vehicles/${vehicleId}/history`), { headers: { Authorization: token } })
    );
    return data;
  }

  @Mutation(() => [GpsPositionType])
  @UseGuards(GqlAuthGuard)
  async simulateVehicleGps(@Args('vehicleId') vehicleId: string, @CurrentToken() token: string) {
    const { data } = await firstValueFrom(
      this.httpService.post(this.getUrl(`/vehicles/${vehicleId}/simulate`), {}, { headers: { Authorization: token } })
    );
    return data;
  }
}
