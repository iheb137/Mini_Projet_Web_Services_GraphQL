import { Controller, Get, Post, Body, Param, Patch, Delete, Query } from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { IncidentType, IncidentStatus } from './entities/incident.entity';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  create(@Body() createIncidentDto: CreateIncidentDto) {
    return this.incidentsService.create(createIncidentDto);
  }

  @Get('stats')
  getStats() {
    return this.incidentsService.getStats();
  }

  @Get()
  findAll(
    @Query('type') type?: IncidentType,
    @Query('status') status?: IncidentStatus,
  ) {
    return this.incidentsService.findAll({ type, status });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIncidentDto: UpdateIncidentDto) {
    return this.incidentsService.update(id, updateIncidentDto);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.incidentsService.updateStatus(id, updateStatusDto.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incidentsService.remove(id);
  }
}
