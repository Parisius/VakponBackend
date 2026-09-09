import { Controller, Get, Patch, Body, Query, UseGuards } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { UpsertUiStringDto } from './dto/upsert-ui-string.dto';
import { FindTranslationsDto } from './dto/find-translations.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OFFERS_ROLES } from '../common/roles';

@Controller()
export class TranslationsController {
  constructor(private translationsService: TranslationsService) {}

  // Public — the site fetches this once on load to build its i18n dictionary.
  // `site` goes through a validated DTO (not a bare @Query() string) so a
  // MongoDB operator object smuggled in via ?site[$ne]=x is rejected before
  // it ever reaches the Mongoose filter.
  @Get('translations')
  findAll(@Query() { site = 'vakpon-tours' }: FindTranslationsDto) {
    return this.translationsService.findAll(site);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...OFFERS_ROLES)
  @Get('admin/translations')
  async findAllForAdmin(@Query() { site = 'vakpon-tours' }: FindTranslationsDto) {
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
