import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PageSlugDto } from './dto/page-slug.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OFFERS_ROLES } from '../common/roles';

@Controller()
export class PagesController {
  constructor(private pagesService: PagesService) {}

  // Public — Guide du voyageur / À propos fetch their content from here.
  @Get('pages/:slug')
  findOne(@Param() { slug }: PageSlugDto) {
    return this.pagesService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...OFFERS_ROLES)
  @Patch('admin/pages/:slug')
  update(@CurrentUser() actor: any, @Param() { slug }: PageSlugDto, @Body() dto: UpdatePageDto) {
    return this.pagesService.upsert(actor, slug, dto);
  }
}
