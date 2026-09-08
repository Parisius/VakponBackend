import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { UpsertUiStringDto } from './dto/upsert-ui-string.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OFFERS_ROLES } from '../common/roles';

@Controller()
export class TranslationsController {
  constructor(private translationsService: TranslationsService) {}

  // Public — the site fetches this once on load to build its i18n dictionary.
  @Get('translations')
  findAll(@Query('site') site = 'vakpon-tours') {
    return this.translationsService.findAll(site);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...OFFERS_ROLES)
  @Get('admin/translations')
  async findAllForAdmin(@Query('site') site = 'vakpon-tours') {
    const dict = await this.translationsService.findAll(site);
    return Object.entries(dict)
      .map(([key, v]) => ({ key, ...v }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...OFFERS_ROLES)
  @Patch('admin/translations')
  upsert(@CurrentUser() actor: any, @Body() dto: UpsertUiStringDto) {
    return this.translationsService.upsert(actor, dto);
  }
}
