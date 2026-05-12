import { IsEnum, IsNotEmpty } from 'class-validator';
import { IncidentStatus } from '../entities/incident.entity';

export class UpdateStatusDto {
  @IsEnum(IncidentStatus)
  @IsNotEmpty()
  status: IncidentStatus;
}
