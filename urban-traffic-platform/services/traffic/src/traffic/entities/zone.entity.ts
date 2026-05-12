import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum DensityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Entity('zones')
export class Zone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('float')
  centerLat: number;

  @Column('float')
  centerLng: number;

  @Column('float')
  radiusMeters: number;

  @Column({ type: 'enum', enum: DensityLevel, default: DensityLevel.LOW })
  densityLevel: DensityLevel;

  @Column({ type: 'int', default: 0 })
  vehicleCount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
