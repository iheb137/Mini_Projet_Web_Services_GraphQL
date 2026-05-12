import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { VehicleType } from '../entities/vehicle.entity';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  plate: string;

  @IsEnum(VehicleType)
  @IsNotEmpty()
  type: VehicleType;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsUUID()
  ownerId: string;
}
