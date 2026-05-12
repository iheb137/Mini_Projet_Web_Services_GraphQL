import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateGpsPositionDto {
  @IsUUID()
  @IsNotEmpty()
  vehicleId: string;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsOptional()
  @IsNumber()
  speed?: number;
}
