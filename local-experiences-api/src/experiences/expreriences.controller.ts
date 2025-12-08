/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ExperiencesService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { AuthGuard } from '@nestjs/passport'; 

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createExperienceDto: CreateExperienceDto, @Request() req) {
    // req.user viene del token JWT
    return this.experiencesService.create(createExperienceDto, req.user);
  }

  @Get()
  findAll() {
    return this.experiencesService.findAll();
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Get('my-experiences')
  findMyExperiences(@Request() req) {
    return this.experiencesService.findMyExperiences(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experiencesService.remove(id);
  }
}
