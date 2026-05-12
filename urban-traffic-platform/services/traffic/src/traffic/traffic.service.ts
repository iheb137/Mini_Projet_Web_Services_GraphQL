import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone, DensityLevel } from './entities/zone.entity';
import { CreateZoneDto } from './dto/create-zone.dto';

@Injectable()
export class TrafficService {
  constructor(
    @InjectRepository(Zone)
    private readonly zoneRepository: Repository<Zone>,
  ) {}

  async createZone(dto: CreateZoneDto): Promise<Zone> {
    const zone = this.zoneRepository.create(dto);
    return this.zoneRepository.save(zone);
  }

  async findAllZones(): Promise<Zone[]> {
    return this.zoneRepository.find();
  }

  async findZone(id: string): Promise<Zone> {
    const zone = await this.zoneRepository.findOne({ where: { id } });
    if (!zone) {
      throw new NotFoundException(`Zone with id ${id} not found`);
    }
    return zone;
  }

  async updateDensity(id: string, vehicleCount: number): Promise<Zone> {
    const zone = await this.findZone(id);
    
    zone.vehicleCount = vehicleCount;
    
    if (vehicleCount < 10) {
      zone.densityLevel = DensityLevel.LOW;
    } else if (vehicleCount <= 30) {
      zone.densityLevel = DensityLevel.MEDIUM;
    } else {
      zone.densityLevel = DensityLevel.HIGH;
    }
    
    zone.lastUpdated = new Date();
    
    return this.zoneRepository.save(zone);
  }

  async getCongestedZones(): Promise<Zone[]> {
    return this.zoneRepository.find({
      where: { densityLevel: DensityLevel.HIGH },
    });
  }

  async seedTunisZones(): Promise<Zone[]> {
    const tunisZones = [
      { name: 'Centre-ville', description: 'Hyper-centre de Tunis', centerLat: 36.8065, centerLng: 10.1815, radiusMeters: 2000 },
      { name: 'La Marsa', description: 'Banlieue Nord', centerLat: 36.8782, centerLng: 10.3246, radiusMeters: 3000 },
      { name: 'Ariana', description: 'Banlieue Nord-Ouest', centerLat: 36.8625, centerLng: 10.1956, radiusMeters: 2500 },
      { name: 'Ben Arous', description: 'Banlieue Sud', centerLat: 36.7539, centerLng: 10.2189, radiusMeters: 3500 },
      { name: 'Manouba', description: 'Banlieue Ouest', centerLat: 36.8081, centerLng: 10.0972, radiusMeters: 3000 },
    ];

    const createdZones = [];
    for (const zoneData of tunisZones) {
      const zone = this.zoneRepository.create(zoneData);
      createdZones.push(await this.zoneRepository.save(zone));
    }
    
    return createdZones;
  }
}
