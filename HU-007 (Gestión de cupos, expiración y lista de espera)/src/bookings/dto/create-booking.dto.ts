import { IsString, IsInt, Min, IsOptional, IsBoolean } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  experienceId: string;

  @IsInt()
  @Min(1)
  seats: number;

  @IsOptional()
  @IsBoolean()
  forceWaitlist?: boolean; // Opción por si el usuario quiere ir directo a lista de espera
}