import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('users')
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: 'tourist' })
  role: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;
}
