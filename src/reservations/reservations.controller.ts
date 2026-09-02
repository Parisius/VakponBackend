import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import {
  AddMessageDto,
  CreateAuthedReservationDto,
  CreatePublicReservationDto,
  UpdateAdminNotesDto,
  UpdateStatusDto,
} from './dto/reservation.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RESERVATIONS_MANAGE_ROLES, RESERVATIONS_VIEW_ROLES } from '../common/roles';

@Controller()
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}

  // Public — the landing page's reservation form posts here, no login needed
  @Post('reservations/public')
  createPublic(@Body() dto: CreatePublicReservationDto) {
    return this.reservationsService.createPublic(dto);
  }

  // Espace client — logged-in customer booking again
  @UseGuards(JwtAuthGuard)
  @Post('reservations')
  createAuthed(@CurrentUser() user: any, @Body() dto: CreateAuthedReservationDto) {
    return this.reservationsService.createAuthed(user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('reservations/me')
  findMine(@CurrentUser() user: any) {
    return this.reservationsService.findMine(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('reservations/:id')
  findOne(@CurrentUser() user: any, @Param('id') id: string) {
    return this.reservationsService.findOneChecked(id, user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reservations/:id/messages')
  addMessage(@CurrentUser() user: any, @Param('id') id: string, @Body() dto: AddMessageDto) {
    return this.reservationsService.addMessage(id, user, dto.text);
  }

  // --- Admin / back-office ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...RESERVATIONS_VIEW_ROLES)
  @Get('admin/reservations')
  findAllForAdmin(@Query('status') status?: string) {
    return this.reservationsService.findAllForAdmin(status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...RESERVATIONS_MANAGE_ROLES)
  @Patch('admin/reservations/:id/status')
  updateStatus(@CurrentUser() actor: any, @Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.reservationsService.updateStatus(actor, id, dto.status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...RESERVATIONS_MANAGE_ROLES)
  @Patch('admin/reservations/:id/notes')
  updateNotes(@CurrentUser() actor: any, @Param('id') id: string, @Body() dto: UpdateAdminNotesDto) {
    return this.reservationsService.updateAdminNotes(actor, id, dto.adminNotes);
  }
}
