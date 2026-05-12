import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity('gps_positions')
export class GpsPosition {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 7 })
  latitude: number;

  @Column('decimal', { precision: 10, scale: 7 })
  longitude: number;

  @Column('float', { nullable: true })
  speed: number;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.gpsPositions, { onDelete: 'CASCADE' })
  vehicle: Vehicle;

  @Column('uuid')
  vehicleId: string;
}
