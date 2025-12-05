/* eslint-disable prettier/prettier */
import { IsString, IsNumber, IsNotEmpty, IsOptional, IsArray, Min } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsNumber()
  @Min(1)
  maxCapacity: number;

  @IsArray()
  @IsOptional()
  images?: string[];
  
  @IsString()
  @IsOptional()
  status?: string;
}