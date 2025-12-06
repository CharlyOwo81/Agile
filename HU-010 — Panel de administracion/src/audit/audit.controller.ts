import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuditFilter } from './audit.service';

@Controller('admin/audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@UseInterceptors(/* Add your audit interceptor here if you want to log audit access */)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async findAll(@Query() filters: AuditFilter) {
    return this.auditService.findAll(filters);
  }

  @Get('stats')
  async getStats(@Query('timeframe') timeframe: 'day' | 'week' | 'month' = 'week') {
    return this.auditService.getStats(timeframe);
  }

  @Get('export')
  async exportLogs(
    @Query('format') format: 'csv' | 'json' = 'json',
    @Query() filters: AuditFilter,
  ) {
    return this.auditService.exportLogs(format, filters);
  }
}