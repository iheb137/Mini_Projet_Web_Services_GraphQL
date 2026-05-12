import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { GpsPosition } from './gps-position.entity';

export enum VehicleType {
  CAR = 'CAR',
  TRUCK = 'TRUCK',
  BUS = 'BUS',
  MOTORCYCLE = 'MOTORCYCLE',
}

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  plate: string;

  @Column({ type: 'enum', enum: VehicleType })
  type: VehicleType;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column({ default: true })
  isActive: boolean;

  @Column('uuid')
  ownerId: string;

  @OneToMany(() => GpsPosition, (gps) => gps.vehicle)
  gpsPositions: GpsPosition[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
