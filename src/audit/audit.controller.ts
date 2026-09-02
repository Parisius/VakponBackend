import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { LOGS_ROLES } from '../common/roles';

@Controller('admin/logs')
export class AuditController {
  constructor(private auditLogService: AuditLogService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...LOGS_ROLES)
  @Get()
  findAll() {
    return this.auditLogService.findAll();
  }
}
