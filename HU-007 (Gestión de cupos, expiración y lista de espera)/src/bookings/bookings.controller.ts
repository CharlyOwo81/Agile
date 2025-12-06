import { Controller, Post, Body, Req } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    // Hardcode del usuario (ya que HU-001 es otra rama)
    const userId = 'user-uuid-simulado-123'; 
    
    return this.bookingsService.createBooking(userId, createBookingDto);
  }
}