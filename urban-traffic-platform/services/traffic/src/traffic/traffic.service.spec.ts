import { Test, TestingModule } from '@nestjs/testing';
import { TrafficService } from './traffic.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Zone } from './zone.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';

describe('TrafficService', () => {
  let service: TrafficService;
  let repo: Repository<Zone>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrafficService,
        { provide: getRepositoryToken(Zone), useValue: createMock<Repository<Zone>>() },
      ],
    }).compile();

    service = module.get<TrafficService>(TrafficService);
    repo = module.get<Repository<Zone>>(getRepositoryToken(Zone));
  });

  it('should create a zone', async () => {
    const z = { id: 1, name: 'Z1' };
    jest.spyOn(repo, 'create').mockReturnValue(z as any);
    jest.spyOn(repo, 'save').mockResolvedValue(z as any);
    expect(await service.createZone({ name: 'Z1' } as any)).toBe(z);
  });

  it('should compute densityLevel LOW when vehicleCount < 10', async () => {
    const z = { id: 1, vehicleCount: 0 };
    jest.spyOn(repo, 'findOne').mockResolvedValue(z as any);
    jest.spyOn(repo, 'save').mockResolvedValue({ ...z, vehicleCount: 5, densityLevel: 'LOW' } as any);

    const res = await service.updateVehicleCount(1, 5);
    expect(res.densityLevel).toBe('LOW');
  });

  it('should compute densityLevel MEDIUM when vehicleCount between 10 and 30', async () => {
    const z = { id: 1, vehicleCount: 0 };
    jest.spyOn(repo, 'findOne').mockResolvedValue(z as any);
    jest.spyOn(repo, 'save').mockResolvedValue({ ...z, vehicleCount: 20, densityLevel: 'MEDIUM' } as any);

    const res = await service.updateVehicleCount(1, 20);
    expect(res.densityLevel).toBe('MEDIUM');
  });

  it('should compute densityLevel HIGH when vehicleCount > 30', async () => {
    const z = { id: 1, vehicleCount: 0 };
    jest.spyOn(repo, 'findOne').mockResolvedValue(z as any);
    jest.spyOn(repo, 'save').mockResolvedValue({ ...z, vehicleCount: 40, densityLevel: 'HIGH' } as any);

    const res = await service.updateVehicleCount(1, 40);
    expect(res.densityLevel).toBe('HIGH');
  });

  it('should return only HIGH zones in getCongestedZones()', async () => {
    jest.spyOn(repo, 'find').mockResolvedValue([]);
    await service.getCongestedZones();
    expect(repo.find).toHaveBeenCalledWith({ where: { densityLevel: 'HIGH' } });
  });
});
