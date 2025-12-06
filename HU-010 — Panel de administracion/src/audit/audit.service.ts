import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, FindOptionsWhere } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

export interface AuditFilter {
  startDate?: Date;
  endDate?: Date;
  adminId?: string;
  actionType?: string;
  resourceId?: string;
  ipAddress?: string;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async findAll(filters: AuditFilter) {
    const {
      startDate,
      endDate,
      adminId,
      actionType,
      resourceId,
      ipAddress,
      search,
      page = 1,
      limit = 20,
    } = filters;

    const where: FindOptionsWhere<AuditLog> = {};

    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    } else if (startDate) {
      where.createdAt = Between(startDate, new Date());
    }

    if (adminId) where.adminId = adminId;
    if (actionType) where.actionType = actionType;
    if (resourceId) where.resourceId = resourceId;
    if (ipAddress) where.ipAddress = Like(`%${ipAddress}%`);

    if (search) {
      where.metadata = Like(`%${search}%`);
    }

    const [logs, total] = await this.auditLogRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    return this.auditLogRepository.findOne({ where: { id } });
  }

  async getStats(timeframe: 'day' | 'week' | 'month') {
    const now = new Date();
    let startDate = new Date();

    switch (timeframe) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    const logs = await this.auditLogRepository.find({
      where: {
        createdAt: Between(startDate, now),
      },
    });

    const stats = {
      totalActions: logs.length,
      actionsByType: {},
      actionsByAdmin: {},
      averageExecutionTime: 0,
      mostActiveHours: {},
    };

    let totalExecutionTime = 0;

    logs.forEach(log => {
      // Stats by action type
      stats.actionsByType[log.actionType] = (stats.actionsByType[log.actionType] || 0) + 1;
      
      // Stats by admin
      stats.actionsByAdmin[log.adminId] = (stats.actionsByAdmin[log.adminId] || 0) + 1;
      
      // Execution time
      const execTime = log.metadata?.executionTime || 0;
      totalExecutionTime += execTime;
      
      // Active hours
      const hour = new Date(log.createdAt).getHours();
      stats.mostActiveHours[hour] = (stats.mostActiveHours[hour] || 0) + 1;
    });

    stats.averageExecutionTime = logs.length > 0 ? totalExecutionTime / logs.length : 0;

    return stats;
  }

  async exportLogs(format: 'csv' | 'json', filters: AuditFilter) {
    const logs = await this.findAll({ ...filters, limit: 1000 });
    
    if (format === 'csv') {
      return this.convertToCSV(logs.data);
    }
    
    return logs.data;
  }

  private convertToCSV(logs: AuditLog[]): string {
    const headers = ['ID', 'Fecha', 'Admin ID', 'Acción', 'Recurso ID', 'IP', 'User Agent'];
    const rows = logs.map(log => [
      log.id,
      log.createdAt.toISOString(),
      log.adminId,
      log.actionType,
      log.resourceId || '',
      log.ipAddress || '',
      log.userAgent || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    return csv;
  }
}