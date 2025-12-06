import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { BookingCleanupService } from './tasks/booking-cleanup.service';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]), // Registra la entidad
    ScheduleModule.forRoot(), // Activa los Cron Jobs
  ],
  controllers: [BookingsController],
  providers: [
    BookingsService, 
    BookingCleanupService
  ],
  exports: [BookingsService]
})
export class BookingsModule {}