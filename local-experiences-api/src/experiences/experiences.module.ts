/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';
import { ExperiencesService } from './experience.service';
import { ExperiencesController } from './expreriences.controller';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Experience, User]),
  ],
  controllers: [ExperiencesController],
  providers: [ExperiencesService],
  exports: [ExperiencesService],
})
export class ExperiencesModule {}
