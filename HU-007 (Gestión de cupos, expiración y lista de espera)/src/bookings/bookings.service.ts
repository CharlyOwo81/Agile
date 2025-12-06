import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Experience } from '../types/Experience'; 

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
  ) {}

  async createBooking(userId: string, dto: CreateBookingDto) {
    // 1. Obtener datos de la experiencia (Simulación HU-002)
    const experience = await this.mockGetExperience(dto.experienceId);
    if (!experience) throw new NotFoundException('Experiencia no encontrada');

    // 2. Calcular disponibilidad real
    // (Capacidad Total - Capacidad Ocupada Actual)
    const availableSlots = experience.maxCapacity - experience.currentCapacity;

    // 3. Decisión: ¿Reserva o Lista de Espera?
    if (availableSlots < dto.seats || dto.forceWaitlist) {
      return this.addToWaitlist(userId, dto, experience);
    }

    // 4. Crear Reserva Temporal (PENDING)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Expira en 15 min

    const booking = this.bookingRepo.create({
      userId,
      experienceId: dto.experienceId,
      seats: dto.seats,
      totalPrice: experience.price * dto.seats,
      status: BookingStatus.PENDING,
      expiresAt: expiresAt
    });

    // TODO: Aquí deberías emitir un evento o llamar al servicio de Experiencias 
    // para aumentar el 'currentCapacity' temporalmente.
    // await this.experienceService.updateCapacity(experience.id, dto.seats);

    return await this.bookingRepo.save(booking);
  }

  private async addToWaitlist(userId: string, dto: CreateBookingDto, experience: Experience) {
    const waitlistEntry = this.bookingRepo.create({
      userId,
      experienceId: dto.experienceId,
      seats: dto.seats,
      totalPrice: experience.price * dto.seats,
      status: BookingStatus.WAITLIST,
      expiresAt: null // La lista de espera no expira
    });

    return await this.bookingRepo.save(waitlistEntry);
  }

  // --- MOCK DE HU-002 (Para que tu código funcione aislado) ---
  private async mockGetExperience(id: string): Promise<Experience | null> {
    // Simula la respuesta que daría el servicio de tu compañero
    return {
      id: id,
      name: 'Tour Mock',
      description: 'Desc',
      category: 'Aventura',
      price: 45.00,
      location: 'Parque',
      date: '2025-11-15T08:00:00',
      maxCapacity: 20,
      currentCapacity: 18, // Simula que quedan 2 lugares
      images: [],
      status: 'active',
      providerId: 'prov-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}