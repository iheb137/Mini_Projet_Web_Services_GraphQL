import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CreateGpsPositionDto } from './dto/create-gps-position.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(id, updateVehicleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(id);
  }

  @Post(':id/gps')
  addGpsPosition(
    @Param('id') id: string,
    @Body() dto: Omit<CreateGpsPositionDto, 'vehicleId'>,
  ) {
    return this.vehiclesService.addGpsPosition({ ...dto, vehicleId: id });
  }

  @Get(':id/history')
  getHistory(@Param('id') id: string) {
    return this.vehiclesService.getHistory(id);
  }

  @Post(':id/simulate')
  simulateGps(@Param('id') id: string) {
    return this.vehiclesService.simulateGps(id);
  }
}
