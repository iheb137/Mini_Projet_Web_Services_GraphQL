import { Controller, Get, Post, Body, Param, Patch, Query, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationType } from './entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Post('broadcast')
  broadcast(@Body() body: { title: string; message: string; type?: NotificationType }) {
    if (!body.title || !body.message) throw new BadRequestException('Title and message are required');
    return this.notificationsService.broadcastToAll(body.title, body.message, body.type);
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  markAllAsRead(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('userId query parameter is required');
    }
    return this.notificationsService.markAllAsRead(userId);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.notificationsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
