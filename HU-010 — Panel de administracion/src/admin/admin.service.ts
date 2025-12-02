import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Experience } from '../experiences/entities/experience.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
  ) {}

  async getUsers(page = 1, limit = 20) {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUserStatus(id: string, status: string) {
    const user = await this.getUser(id);
    user.status = status;
    await this.userRepository.save(user);
    return { message: 'User status updated successfully' };
  }

  async getExperiences(page = 1, limit = 20) {
    const [experiences, total] = await this.experienceRepository.findAndCount({
      relations: ['provider'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: experiences,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getExperience(id: string) {
    const experience = await this.experienceRepository.findOne({
      where: { id },
      relations: ['provider'],
    });
    if (!experience) {
      throw new NotFoundException('Experience not found');
    }
    return experience;
  }

  async updateExperienceStatus(id: string, status: string) {
    const experience = await this.getExperience(id);
    experience.status = status;
    await this.experienceRepository.save(experience);
    return { message: 'Experience status updated successfully' };
  }

  async deleteExperience(id: string) {
    const experience = await this.getExperience(id);
    await this.experienceRepository.remove(experience);
    return { message: 'Experience deleted successfully' };
  }

  async getDashboardStats() {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);

    const [
      totalUsers,
      totalProviders,
      totalExperiences,
      activeExperiences,
      newUsersThisWeek,
      newExperiencesThisMonth,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { role: 'provider' } }),
      this.experienceRepository.count(),
      this.experienceRepository.count({ where: { status: 'active' } }),
      this.userRepository.count({
        where: { createdAt: Between(weekAgo, today) },
      }),
      this.experienceRepository.count({
        where: { createdAt: Between(monthAgo, today) },
      }),
    ]);

    return {
      overview: {
        totalUsers,
        totalProviders,
        totalExperiences,
        activeExperiences,
        approvalRate: totalExperiences > 0 ? (activeExperiences / totalExperiences) * 100 : 0,
      },
      recentActivity: {
        newUsersThisWeek,
        newExperiencesThisMonth,
      },
    };
  }
}