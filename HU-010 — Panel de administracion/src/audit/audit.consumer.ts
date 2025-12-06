import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Processor('audit')
@Injectable()
export class AuditConsumer {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  @Process('log-action')
  async handleAuditLog(job: Job) {
    const {
      adminId,
      adminEmail,
      actionType,
      resourceType,
      resourceId,
      changes,
      ipAddress,
      userAgent,
      requestMethod,
      requestUrl,
      requestBody,
      statusCode,
      executionTime,
      timestamp,
    } = job.data;

    const auditLog = this.auditLogRepository.create({
      adminId,
      actionType: `${resourceType}:${actionType}`,
      resourceId,
      changes,
      ipAddress,
      userAgent,
      metadata: {
        adminEmail,
        requestMethod,
        requestUrl,
        requestBody,
        statusCode,
        executionTime,
      },
      createdAt: timestamp,
    });

    await this.auditLogRepository.save(auditLog);
  }
}