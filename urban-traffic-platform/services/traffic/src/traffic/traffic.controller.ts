import { Controller, Get, Post, Body, Param, Patch, ValidationPipe } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateDensityDto } from './dto/update-density.dto';

@Controller('zones')
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Post()
  createZone(@Body() createZoneDto: CreateZoneDto) {
    return this.trafficService.createZone(createZoneDto);
  }

  @Post('seed')
  seedTunisZones() {
    return this.trafficService.seedTunisZones();
  }

  @Get()
  findAllZones() {
    return this.trafficService.findAllZones();
  }

  @Get('congested')
  getCongestedZones() {
    return this.trafficService.getCongestedZones();
  }

  @Get(':id')
  findZone(@Param('id') id: string) {
    return this.trafficService.findZone(id);
  }

  @Patch(':id/density')
  updateDensity(
    @Param('id') id: string,
    @Body(new ValidationPipe({ transform: true })) updateDensityDto: UpdateDensityDto,
  ) {
    return this.trafficService.updateDensity(id, updateDensityDto.vehicleCount);
  }
}
