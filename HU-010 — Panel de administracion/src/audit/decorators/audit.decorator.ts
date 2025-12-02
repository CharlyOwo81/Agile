import { SetMetadata } from '@nestjs/common';

export const AUDIT_METADATA_KEY = 'audit_metadata';

export interface AuditMetadata {
  action: string;
  resource: string;
  captureChanges?: boolean;
  sensitiveFields?: string[];
}

export const Audit = (action: string, resource: string, options: Partial<Omit<AuditMetadata, 'action' | 'resource'>> = {}) => {
  return SetMetadata(AUDIT_METADATA_KEY, {
    action,
    resource,
    captureChanges: options.captureChanges ?? true,
    sensitiveFields: options.sensitiveFields ?? [],
  });
};