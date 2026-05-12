import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationsGateway } from './notifications.gateway';
import { createMock } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';

describe('NotificationsService', () => {
  let service: NotificationsService;
  let repo: Repository<Notification>;
  let gateway: NotificationsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: getRepositoryToken(Notification), useValue: createMock<Repository<Notification>>() },
        { provide: NotificationsGateway, useValue: createMock<NotificationsGateway>() },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    repo = module.get<Repository<Notification>>(getRepositoryToken(Notification));
    gateway = module.get<NotificationsGateway>(NotificationsGateway);
  });

  it('should create a notification and call gateway emit', async () => {
    const notif = { message: 'Alert' };
    jest.spyOn(repo, 'create').mockReturnValue(notif as any);
    jest.spyOn(repo, 'save').mockResolvedValue(notif as any);

    await service.create({ message: 'Alert' } as any);
    
    expect(repo.save).toHaveBeenCalled();
    expect(gateway.server.emit).toHaveBeenCalled();
  });

  it('should mark notification as read', async () => {
    const notif = { id: 1, isRead: false };
    jest.spyOn(repo, 'findOne').mockResolvedValue(notif as any);
    jest.spyOn(repo, 'save').mockImplementation(async (x) => x as any);

    const res = await service.markAsRead(1);
    expect(res.isRead).toBe(true);
  });

  it('should markAllAsRead for a userId', async () => {
    jest.spyOn(repo, 'update').mockResolvedValue(createMock<any>());
    await service.markAllAsRead(123);
    expect(repo.update).toHaveBeenCalledWith({ userId: 123, isRead: false }, { isRead: true });
  });

  it('should filter notifications by userId', async () => {
    jest.spyOn(repo, 'find').mockResolvedValue([]);
    await service.findByUserId(123);
    expect(repo.find).toHaveBeenCalledWith({
      where: { userId: 123 },
      order: { createdAt: 'DESC' },
    });
  });
});
