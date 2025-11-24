import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';

@Injectable()
export class BookingCleanupService {
  private readonly logger = new Logger(BookingCleanupService.name);

  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
  ) {}

  // Se ejecuta cada minuto
  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredBookings() {
    const now = new Date();

    // Buscar reservas PENDIENTES cuya fecha de expiración ya pasó
    const expiredBookings = await this.bookingRepo.find({
      where: {
        status: BookingStatus.PENDING,
        expiresAt: LessThan(now)
      }
    });

    if (expiredBookings.length > 0) {
      this.logger.log(`Encontradas ${expiredBookings.length} reservas vencidas.`);

      for (const booking of expiredBookings) {
        // 1. Marcar como expirada
        booking.status = BookingStatus.EXPIRED;
        await this.bookingRepo.save(booking);

        // TODO: Llamar al servicio de HU-002 para liberar los cupos
        // await this.experienceService.decreaseCapacity(booking.experienceId, booking.seats);
        
        // TODO: Notificar al siguiente en la lista de espera (Waitlist)
        this.logger.log(`Cupos liberados para reserva ${booking.id}.`);
      }
    }
  }
}