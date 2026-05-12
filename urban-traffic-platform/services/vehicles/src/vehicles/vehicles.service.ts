import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { GpsPosition } from './entities/gps-position.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { CreateGpsPositionDto } from './dto/create-gps-position.dto';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(GpsPosition)
    private readonly gpsRepository: Repository<GpsPosition>,
  ) {}

  async create(dto: CreateVehicleDto): Promise<Vehicle> {
    const vehicle = this.vehicleRepository.create(dto);
    return this.vehicleRepository.save(vehicle);
  }

  async findAll(): Promise<Vehicle[]> {
    return this.vehicleRepository.find({ relations: ['gpsPositions'] });
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepository.findOne({ where: { id }, relations: ['gpsPositions'] });
    if (!vehicle) {
      throw new NotFoundException(`Vehicle with id ${id} not found`);
    }
    return vehicle;
  }

  async update(id: string, dto: UpdateVehicleDto): Promise<Vehicle> {
    const vehicle = await this.findOne(id);
    this.vehicleRepository.merge(vehicle, dto);
    return this.vehicleRepository.save(vehicle);
  }

  async remove(id: string): Promise<void> {
    const vehicle = await this.findOne(id);
    await this.vehicleRepository.remove(vehicle);
  }

  async addGpsPosition(dto: CreateGpsPositionDto): Promise<GpsPosition> {
    const vehicle = await this.findOne(dto.vehicleId); // Ensure vehicle exists
    const position = this.gpsRepository.create({ ...dto, vehicle });
    return this.gpsRepository.save(position);
  }

  async getHistory(vehicleId: string): Promise<GpsPosition[]> {
    await this.findOne(vehicleId); // Throws if doesn't exist
    return this.gpsRepository.find({
      where: { vehicleId },
      order: { timestamp: 'DESC' },
    });
  }

  async simulateGps(vehicleId: string): Promise<GpsPosition[]> {
    const vehicle = await this.findOne(vehicleId);
    
    // Tunis approx coords: 36.8, 10.18
    const baseLat = 36.8;
    const baseLng = 10.18;
    
    const positionsToCreate = Array.from({ length: 10 }).map((_, i) => {
      // Small random variations for movement
      const latOffset = (Math.random() - 0.5) * 0.05;
      const lngOffset = (Math.random() - 0.5) * 0.05;
      const speed = Math.floor(Math.random() * 80) + 10; // Random speed 10-90 km/h
      
      return this.gpsRepository.create({
        vehicle,
        vehicleId: vehicle.id,
        latitude: baseLat + latOffset,
        longitude: baseLng + lngOffset,
        speed,
        timestamp: new Date(Date.now() - i * 60000), // Simulated points every minute looking backwards
      });
    });

    return this.gpsRepository.save(positionsToCreate);
  }
}
