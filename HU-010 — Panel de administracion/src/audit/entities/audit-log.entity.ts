import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('audit_logs')
@Index(['actionType'])
@Index(['adminId'])
@Index(['resourceId'])
@Index(['createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  adminId: string;

  @Column()
  actionType: string;

  @Column('uuid', { nullable: true })
  resourceId: string;

  @Column('jsonb', { nullable: true })
  changes: any;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column('jsonb', { nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;

  @Column('uuid', { nullable: true })
  targetUserId: string;
}