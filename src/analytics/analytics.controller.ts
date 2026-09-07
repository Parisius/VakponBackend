import { Body, Controller, Get, Header, HttpCode, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AnalyticsService, AnalyticsRange } from './analytics.service';
import { CollectDto } from './dto/collect.dto';
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

  // Public — fired by the beacon on every pageview, from this site or any
  // future one pointed at this backend.
  @Post('analytics/collect')
  @HttpCode(204)
  async collect(@Body() dto: CollectDto, @Req() req: Request) {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0].trim()) || req.ip || '';
    const userAgent = req.headers['user-agent'] || '';
    await this.analyticsService.collect(dto, ip, userAgent);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...ANALYTICS_ROLES)
  @Get('admin/analytics/summary')
  summary(@Query('site') site = 'vakpon-tours', @Query('range') range: AnalyticsRange = '7d') {
    return this.analyticsService.summary(site, range);
  }
}
