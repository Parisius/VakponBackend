import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto, UpdateOfferDto } from './dto/offer.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OFFERS_ROLES } from '../common/roles';

@Controller()
export class OffersController {
  constructor(private offersService: OffersService) {}

  // Public — consumed by the landing page (script.js can fetch this
  // instead of hardcoding offer cards)
  @Get('offers')
  findPublic() {
    return this.offersService.findPublic();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...OFFERS_ROLES)
  @Get('admin/offers')
  findAll() {
    return this.offersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...OFFERS_ROLES)
  @Get('admin/offers/:id')
  findOne(@Param('id') id: string) {
    return this.offersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...OFFERS_ROLES)
  @Post('admin/offers')
  create(@CurrentUser() actor: any, @Body() dto: CreateOfferDto) {
    return this.offersService.create(actor, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...OFFERS_ROLES)
  @Patch('admin/offers/:id')
  update(@CurrentUser() actor: any, @Param('id') id: string, @Body() dto: UpdateOfferDto) {
    return this.offersService.update(actor, id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...OFFERS_ROLES)
  @Delete('admin/offers/:id')
  remove(@CurrentUser() actor: any, @Param('id') id: string) {
    return this.offersService.remove(actor, id);
  }
}
