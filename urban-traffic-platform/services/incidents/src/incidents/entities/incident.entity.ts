import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum IncidentType {
  ACCIDENT = 'ACCIDENT',
  ROADWORK = 'ROADWORK',
  ROAD_CLOSED = 'ROAD_CLOSED',
  TRAFFIC_JAM = 'TRAFFIC_JAM',
}

export enum IncidentStatus {
  REPORTED = 'REPORTED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
}

@Entity('incidents')
export class Incident {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'enum', enum: IncidentType })
  type: IncidentType;

  @Column({ type: 'enum', enum: IncidentStatus, default: IncidentStatus.REPORTED })
  status: IncidentStatus;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column({ nullable: true })
  zoneId: string;

  @Column('uuid')
  reportedBy: string;

  @Column({ nullable: true })
  resolvedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
