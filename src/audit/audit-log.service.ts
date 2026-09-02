import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog } from './audit-log.schema';

export interface AuditActor {
  email: string;
  role: string;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(@InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>) {}

  async log(actor: AuditActor, action: string, details: string) {
    try {
      await this.auditLogModel.create({ actorEmail: actor.email, actorRole: actor.role, action, details });
    } catch (err) {
      // Never let audit logging break the actual action it's recording
      this.logger.error(`Failed to write audit log: ${err.message}`);
    }
  }

  findAll() {
    return this.auditLogModel.find().sort({ createdAt: -1 }).limit(1000);
  }
}
