import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum BookingStatus {
  PENDING = 'PENDING',     // Reserva temporal (15 min para pagar)
  CONFIRMED = 'CONFIRMED', // Pago completado
  EXPIRED = 'EXPIRED',     // Tiempo agotado sin pago
  WAITLIST = 'WAITLIST',   // Lista de espera
  CANCELLED = 'CANCELLED'  // Cancelado manualmente
}

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  experienceId: string; // ID de la experiencia (HU-002)

  @Column()
  userId: string; 

  @Column({ type: 'int' })
  seats: number; // Cantidad de personas

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING
  })
  status: BookingStatus;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date; // Fecha límite para pagar
}