import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { IncidentType, IncidentStatus } from '../entities/incident.entity';

export class UpdateIncidentDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(IncidentType)
  @IsOptional()
  type?: IncidentType;

  @IsEnum(IncidentStatus)
  @IsOptional()
  status?: IncidentStatus;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsUUID()
  @IsOptional()
  zoneId?: string;

  @IsUUID()
  @IsOptional()
  reportedBy?: string;
}
