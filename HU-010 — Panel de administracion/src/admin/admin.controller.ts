import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Audit } from '../audit/decorators/audit.decorator';
import { AuditInterceptor } from '../audit/interceptors/audit.interceptor';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@UseInterceptors(AuditInterceptor)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @Audit('LIST_USERS', 'USER')
  async getUsers(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getUsers(page, limit);
  }

  @Get('users/:id')
  @Audit('VIEW_USER', 'USER')
  async getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Put('users/:id/status')
  @Audit('UPDATE_USER_STATUS', 'USER', { sensitiveFields: ['password'] })
  async updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.adminService.updateUserStatus(id, status);
  }

  @Get('experiences')
  @Audit('LIST_EXPERIENCES', 'EXPERIENCE')
  async getExperiences(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.adminService.getExperiences(page, limit);
  }

  @Get('experiences/:id')
  @Audit('VIEW_EXPERIENCE', 'EXPERIENCE')
  async getExperience(@Param('id') id: string) {
    return this.adminService.getExperience(id);
  }

  @Put('experiences/:id/status')
  @Audit('UPDATE_EXPERIENCE_STATUS', 'EXPERIENCE')
  async updateExperienceStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.adminService.updateExperienceStatus(id, status);
  }

  @Delete('experiences/:id')
  @Audit('DELETE_EXPERIENCE', 'EXPERIENCE')
  async deleteExperience(@Param('id') id: string) {
    return this.adminService.deleteExperience(id);
  }

  @Get('dashboard')
  @Audit('VIEW_DASHBOARD', 'SYSTEM')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }
}