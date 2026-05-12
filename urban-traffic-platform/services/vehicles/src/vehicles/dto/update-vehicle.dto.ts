import { IsEnum, IsOptional, IsString, IsUUID, IsBoolean } from 'class-validator';
import { VehicleType } from '../entities/vehicle.entity';

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsEnum(VehicleType)
  type?: VehicleType;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsUUID()
  ownerId?: string;
}
