import { Body, Controller, Get, Header, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { AnalyticsService, AnalyticsRange } from './analytics.service';
import { CollectDto } from './dto/collect.dto';
import { DurationDto } from './dto/duration.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ANALYTICS_ROLES } from '../common/roles';
import { ANALYTICS_SNIPPET } from './analytics-snippet';

@Controller()
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  // Public — the portable beacon script itself (see analytics-snippet.ts).
  @Get('analytics.js')
  @Header('Content-Type', 'application/javascript; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=3600')
  getSnippet(): string {
    return ANALYTICS_SNIPPET;
  }

  private extractIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    return (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0].trim()) || req.ip || '';
  }

  // Public — fired once per pageview. Returns the record id so the client can
  // later report a durationMs for it (see /analytics/duration).
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Post('analytics/collect')
  async collect(@Body() dto: CollectDto, @Req() req: Request) {
    const doc = await this.analyticsService.collect(dto, this.extractIp(req), req.headers['user-agent'] || '');
    return { id: doc._id };
  }

  // Public — a best-effort follow-up beacon sent on pagehide.
  @Post('analytics/duration')
  async duration(@Body() dto: DurationDto) {
    await this.analyticsService.recordDuration(dto.id, dto.durationMs);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ANALYTICS_ROLES)
  @Get('admin/analytics/summary')
  summary(
    @Query('site') site = 'vakpon-tours',
    @Query('range') range: AnalyticsRange = '7d',
    @Query('path') path?: string,
    @Query('device') device?: string,
  ) {
    return this.analyticsService.summary(site, range, path, device);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ANALYTICS_ROLES)
  @Get('admin/analytics/log')
  log(
    @Query('site') site = 'vakpon-tours',
    @Query('range') range: AnalyticsRange = '7d',
    @Query('path') path?: string,
    @Query('device') device?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.analyticsService.log(site, range, path, device, parseInt(page, 10) || 1, Math.min(parseInt(limit, 10) || 20, 100));
  }
}
