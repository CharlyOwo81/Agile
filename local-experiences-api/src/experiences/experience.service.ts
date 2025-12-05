/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './entities/experience.entity';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
  ) {}

  async create(createExperienceDto: CreateExperienceDto, user: User) {
    const experience = this.experienceRepository.create({
      ...createExperienceDto,
      provider: user,
      providerId: user.id,
      currentCapacity: 0,
    });
    return await this.experienceRepository.save(experience);
  }

  async findAll() {
    return await this.experienceRepository.find();
  }
  
  async findMyExperiences(userId: number) {
    return await this.experienceRepository.find({
      where: { providerId: userId },
    });
  }

  async findOne(id: string) {
    const experience = await this.experienceRepository.findOne({ where: { id } });
    if (!experience) throw new NotFoundException('Experiencia no encontrada');
    return experience;
  }

  async remove(id: string) {
    const experience = await this.findOne(id);
    return await this.experienceRepository.remove(experience);
  }
}