import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('experiences')
export class Experience {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column()
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  location: string;

  @Column()
  date: string;

  @Column('int')
  maxCapacity: number;

  @Column('int', { default: 0 })
  currentCapacity: number;

  @Column('simple-array', { nullable: true })
  images: string[];

  @Column({ default: 'active' })
  status: string;

  @ManyToOne(() => User, (user) => user.experiences)
  @JoinColumn({ name: 'providerId' })
  provider: User;

  @Column()
  providerId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
