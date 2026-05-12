import { Resolver, Query, Mutation, Args, Float } from '@nestjs/graphql';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IncidentType } from '../graphql/types/incident.type';
import { StatsType } from '../graphql/types/stats.type';

@Resolver(() => IncidentType)
export class IncidentsResolver {
  constructor(private httpService: HttpService) {}

  private getUrl(path: string) {
    return `${process.env.INCIDENTS_SERVICE_URL || 'http://localhost:3004'}${path}`;
  }

  @Query(() => [IncidentType])
  async incidents(
    @Args('type', { nullable: true }) type?: string,
    @Args('status', { nullable: true }) status?: string
  ) {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    
    const { data } = await firstValueFrom(
      this.httpService.get(this.getUrl(`/incidents?${params.toString()}`))
    );
    return data;
  }

  @Query(() => IncidentType)
  async incident(@Args('id') id: string) {
    const { data } = await firstValueFrom(this.httpService.get(this.getUrl(`/incidents/${id}`)));
    return data;
  }

  @Query(() => StatsType)
  async incidentStats() {
    const { data } = await firstValueFrom(this.httpService.get(this.getUrl('/incidents/stats')));
    return data;
  }

  @Mutation(() => IncidentType)
  async createIncident(
    @Args('title') title: string,
    @Args('type') type: string,
    @Args('latitude', { type: () => Float }) latitude: number,
    @Args('longitude', { type: () => Float }) longitude: number,
    @Args('reportedBy') reportedBy: string,
    @Args('zoneId', { nullable: true }) zoneId?: string
  ) {
    const body = { title, type, latitude, longitude, zoneId, reportedBy };
    const { data } = await firstValueFrom(this.httpService.post(this.getUrl('/incidents'), body));
    return data;
  }

  @Mutation(() => IncidentType)
  async updateIncidentStatus(
    @Args('id') id: string,
    @Args('status') status: string
  ) {
    const body = { status };
    const { data } = await firstValueFrom(this.httpService.patch(this.getUrl(`/incidents/${id}/status`), body));
    return data;
  }
}
