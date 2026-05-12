import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsString()
  @IsOptional()
  relatedId?: string;
}
