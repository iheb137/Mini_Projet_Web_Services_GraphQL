import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum NotificationType {
  INCIDENT = 'INCIDENT',
  TRAFFIC = 'TRAFFIC',
  SYSTEM = 'SYSTEM',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  message: string;

  @Column({ type: 'enum', enum: NotificationType, default: NotificationType.SYSTEM })
  type: NotificationType;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  relatedId: string;

  @CreateDateColumn()
  createdAt: Date;
}
