import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(dto);
    const saved = await this.notificationRepository.save(notification);

    if (saved.userId) {
      this.notificationsGateway.sendToUser(saved.userId, saved);
    } else {
      this.notificationsGateway.sendToAll(saved);
    }

    return saved;
  }

  async findAll(userId?: string): Promise<Notification[]> {
    if (userId) {
      return this.notificationRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    }
    return this.notificationRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({ where: { id } });
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.findOne(id);
    notification.isRead = true;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { userId, isRead: false },
      { isRead: true },
    );
  }

  async broadcastToAll(title: string, message: string, type: NotificationType = NotificationType.SYSTEM): Promise<Notification> {
    const notification = this.notificationRepository.create({
      title,
      message,
      type,
      userId: null as any,
    });
    const saved = await this.notificationRepository.save(notification);
    this.notificationsGateway.sendToAll(saved);
    return saved;
  }
}
