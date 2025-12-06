import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { AUDIT_METADATA_KEY, AuditMetadata } from '../decorators/audit.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    @InjectQueue('audit') private readonly auditQueue: Queue,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const handler = context.getHandler();
    const auditMetadata = this.reflector.get<AuditMetadata>(AUDIT_METADATA_KEY, handler);
    
    if (!auditMetadata) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as any;

    const beforeState = auditMetadata.captureChanges ? 
      this.extractStateFromRequest(request, auditMetadata) : null;

    const startTime = Date.now();

    return next.handle().pipe(
      tap(async (response) => {
        try {
          const executionTime = Date.now() - startTime;
          const afterState = auditMetadata.captureChanges ? 
            this.extractStateFromResponse(response, auditMetadata) : null;

          let changes = null;
          if (beforeState && afterState) {
            changes = this.calculateChanges(beforeState, afterState, auditMetadata.sensitiveFields);
          }

          await this.auditQueue.add('log-action', {
            adminId: user?.id,
            adminEmail: user?.email,
            actionType: auditMetadata.action,
            resourceType: auditMetadata.resource,
            resourceId: this.extractResourceId(request, response),
            changes,
            ipAddress: request.ip,
            userAgent: request.headers['user-agent'],
            requestMethod: request.method,
            requestUrl: request.url,
            requestBody: auditMetadata.captureChanges ? this.sanitizeBody(request.body, auditMetadata.sensitiveFields) : null,
            statusCode: context.switchToHttp().getResponse().statusCode,
            executionTime,
            timestamp: new Date(),
          });
        } catch (error) {
          console.error('Error logging audit:', error);
        }
      }),
    );
  }

  private extractStateFromRequest(request: Request, metadata: AuditMetadata): any {
    return request.body;
  }

  private extractStateFromResponse(response: any, metadata: AuditMetadata): any {
    return response;
  }

  private calculateChanges(before: any, after: any, sensitiveFields: string[]): any {
    const changes: any = {};
    
    Object.keys(before).forEach(key => {
      if (sensitiveFields.includes(key)) {
        changes[key] = { old: '***MASKED***', new: '***MASKED***' };
      } else if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        changes[key] = { old: before[key], new: after[key] };
      }
    });

    return changes;
  }

  private extractResourceId(request: Request, response: any): string | null {
    return request.params.id || response?.id || null;
  }

  private sanitizeBody(body: any, sensitiveFields: string[]): any {
    if (!body) return body;
    
    const sanitized = { ...body };
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***MASKED***';
      }
    });
    
    return sanitized;
  }
}