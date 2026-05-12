import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { IncidentType } from '../entities/incident.entity';

export class CreateIncidentDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(IncidentType)
  @IsNotEmpty()
  type: IncidentType;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsUUID()
  @IsOptional()
  zoneId?: string;

  @IsUUID()
  @IsNotEmpty()
  reportedBy: string;
}
