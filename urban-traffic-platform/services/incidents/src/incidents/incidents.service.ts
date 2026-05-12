import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident, IncidentStatus, IncidentType } from './entities/incident.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
  ) {}
  async create(dto: CreateIncidentDto): Promise<Incident> {
    const incident = this.incidentRepository.create({
      ...dto,
      status: IncidentStatus.REPORTED,
    });
    return this.incidentRepository.save(incident);
  }
  async findAll(filters?: { type?: IncidentType; status?: IncidentStatus }): Promise<Incident[]> {
    const query: any = {};
    if (filters?.type) query.type = filters.type;
    if (filters?.status) query.status = filters.status;
    
    return this.incidentRepository.find({ where: query, order: { createdAt: 'DESC' } });
  }
  async findOne(id: string): Promise<Incident> {
    const incident = await this.incidentRepository.findOne({ where: { id } });
    if (!incident) {
      throw new NotFoundException(`Incident with ID ${id} not found`);
    }
    return incident;
  }
  async updateStatus(id: string, status: IncidentStatus): Promise<Incident> {
    const incident = await this.findOne(id);
    incident.status = status;
    if (status === IncidentStatus.RESOLVED) {
      incident.resolvedAt = new Date();
    } else if (status === IncidentStatus.REPORTED) {
      incident.resolvedAt = null as any;
    }
    return this.incidentRepository.save(incident);
  }
  async update(id: string, dto: UpdateIncidentDto): Promise<Incident> {
    const incident = await this.findOne(id);
    this.incidentRepository.merge(incident, dto);
    return this.incidentRepository.save(incident);
  }
  async remove(id: string): Promise<void> {
    const incident = await this.findOne(id);
    await this.incidentRepository.remove(incident);
  }
  async getStats() {
    const incidents = await this.incidentRepository.find();
    
    const byType = incidents.reduce((acc, inc) => {
      acc[inc.type] = (acc[inc.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const byStatus = incidents.reduce((acc, inc) => {
      acc[inc.status] = (acc[inc.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const resolvedToday = incidents.filter(
      (inc) => inc.status === IncidentStatus.RESOLVED && inc.resolvedAt && inc.resolvedAt >= today
    ).length;
    return {
      total: incidents.length,
      byType,
      byStatus,
      resolvedToday,
    };
  }
}
