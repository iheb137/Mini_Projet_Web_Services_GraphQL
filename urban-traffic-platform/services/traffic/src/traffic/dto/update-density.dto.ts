import { IsInt, Min } from 'class-validator';

export class UpdateDensityDto {
  @IsInt()
  @Min(0)
  vehicleCount: number;
}
