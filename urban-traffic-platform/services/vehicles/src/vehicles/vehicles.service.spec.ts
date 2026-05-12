import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vehicle } from './vehicle.entity';
import { Position } from './position.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('VehiclesService', () => {
  let service: VehiclesService;
  let vehicleRepo: Repository<Vehicle>;
  let positionRepo: Repository<Position>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        { provide: getRepositoryToken(Vehicle), useValue: createMock<Repository<Vehicle>>() },
        { provide: getRepositoryToken(Position), useValue: createMock<Repository<Position>>() },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    vehicleRepo = module.get<Repository<Vehicle>>(getRepositoryToken(Vehicle));
    positionRepo = module.get<Repository<Position>>(getRepositoryToken(Position));
  });

  it('should create a vehicle', async () => {
    const v = { id: 'uuid', type: 'CAR' } as any;
    jest.spyOn(vehicleRepo, 'create').mockReturnValue(v);
    jest.spyOn(vehicleRepo, 'save').mockResolvedValue(v);

    expect(await service.create({ type: 'CAR' } as any)).toBe(v);
  });

  it('should return all vehicles', async () => {
    jest.spyOn(vehicleRepo, 'find').mockResolvedValue([]);
    expect(await service.findAll()).toEqual([]);
  });

  it('should return vehicle by id', async () => {
    const v = { id: 'uuid' } as any;
    jest.spyOn(vehicleRepo, 'findOne').mockResolvedValue(v);
    expect(await service.findOne('uuid')).toBe(v);
  });

  it('should throw NotFoundException if vehicle not found', async () => {
    jest.spyOn(vehicleRepo, 'findOne').mockResolvedValue(null);
    await expect(service.findOne('uuid')).rejects.toThrow(NotFoundException);
  });

  it('should add a GPS position', async () => {
    const v = { id: 'uuid' } as any;
    jest.spyOn(vehicleRepo, 'findOne').mockResolvedValue(v);
    jest.spyOn(vehicleRepo, 'save').mockResolvedValue(v);
    
    const pos = { id: 1, lat: 10, lng: 10 } as any;
    jest.spyOn(positionRepo, 'create').mockReturnValue(pos);
    jest.spyOn(positionRepo, 'save').mockResolvedValue(pos);

    expect(await service.addPosition('uuid', 10, 10)).toBe(pos);
  });

  it('should return GPS history sorted by timestamp DESC', async () => {
    jest.spyOn(positionRepo, 'find').mockResolvedValue([]);
    await service.getHistory('uuid');
    expect(positionRepo.find).toHaveBeenCalledWith({
      where: { vehicle: { id: 'uuid' } },
      order: { timestamp: 'DESC' },
    });
  });

  it('simulateGps should generate exactly 10 positions near Tunis', async () => {
    const v = { id: 'uuid' } as any;
    jest.spyOn(service, 'findOne').mockResolvedValue(v);
    jest.spyOn(service, 'addPosition').mockResolvedValue(createMock<any>());

    const res = await service.simulateGps('uuid');
    expect(res).toHaveLength(10);
    expect(service.addPosition).toHaveBeenCalledTimes(10);
    // Tunis check (lat ~36.8, lng ~10.18)
    expect(res[0].lat).toBeGreaterThan(36.7);
    expect(res[0].lat).toBeLessThan(36.9);
  });
});
