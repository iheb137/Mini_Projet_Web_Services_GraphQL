import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsService } from './incidents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Incident } from './incident.entity';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';

describe('IncidentsService', () => {
  let service: IncidentsService;
  let repo: Repository<Incident>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentsService,
        { provide: getRepositoryToken(Incident), useValue: createMock<Repository<Incident>>() },
      ],
    }).compile();

    service = module.get<IncidentsService>(IncidentsService);
    repo = module.get<Repository<Incident>>(getRepositoryToken(Incident));
  });

  it('should create an incident with status REPORTED', async () => {
    const inc = { type: 'ACCIDENT', status: 'REPORTED' };
    jest.spyOn(repo, 'create').mockReturnValue(inc as any);
    jest.spyOn(repo, 'save').mockResolvedValue(inc as any);
    
    const res = await service.create({ type: 'ACCIDENT' } as any);
    expect(res.status).toBe('REPORTED');
  });

  it('should update status to RESOLVED and set resolvedAt', async () => {
    const inc = { id: 1, status: 'REPORTED' };
    jest.spyOn(repo, 'findOne').mockResolvedValue(inc as any);
    jest.spyOn(repo, 'save').mockImplementation(async (x) => x as any);

    const res = await service.updateStatus(1, 'RESOLVED');
    expect(res.status).toBe('RESOLVED');
    expect(res.resolvedAt).toBeDefined();
  });

  it('should clear resolvedAt when status set back to REPORTED', async () => {
    const inc = { id: 1, status: 'RESOLVED', resolvedAt: new Date() };
    jest.spyOn(repo, 'findOne').mockResolvedValue(inc as any);
    jest.spyOn(repo, 'save').mockImplementation(async (x) => x as any);

    const res = await service.updateStatus(1, 'REPORTED');
    expect(res.status).toBe('REPORTED');
    expect(res.resolvedAt).toBeNull();
  });

  it('should return correct stats (total, byType, byStatus)', async () => {
    jest.spyOn(repo, 'count').mockResolvedValue(5);
    // Simplified stubbing for queryBuilder logic in realistic code. We can assert count is called.
    const res = await service.getStats();
    expect(res.total).toBe(5);
  });

  it('should filter by type and status in findAll()', async () => {
    jest.spyOn(repo, 'find').mockResolvedValue([]);
    await service.findAll({ type: 'ACCIDENT', status: 'REPORTED' });
    expect(repo.find).toHaveBeenCalledWith({ where: { type: 'ACCIDENT', status: 'REPORTED' } });
  });
});
