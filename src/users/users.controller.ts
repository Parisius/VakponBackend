import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateProfileDto, UpdateCrmDto, CreateAdminDto } from './dto/user.dto';
import { CUSTOMERS_ROLES, TEAM_ROLES } from '../common/roles';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  // --- Customer's own profile (espace client) ---
  @UseGuards(JwtAuthGuard)
  @Get('users/me')
  async me(@CurrentUser() user: any) {
    const doc = await this.usersService.findById(user.userId);
    if (!doc) throw new NotFoundException('Utilisateur introuvable');
    const { passwordHash, ...safe } = doc.toObject();
    return safe;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('users/me')
  updateMe(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.userId, dto);
  }

  // --- Admin CRM ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...CUSTOMERS_ROLES)
  @Get('admin/customers')
  listCustomers(@Query('search') search?: string) {
    return this.usersService.listCustomers(search);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...CUSTOMERS_ROLES)
  @Get('admin/customers/:id')
  getCustomer(@Param('id') id: string) {
    return this.usersService.getCustomer(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...CUSTOMERS_ROLES)
  @Patch('admin/customers/:id')
  updateCustomer(@CurrentUser() actor: any, @Param('id') id: string, @Body() dto: UpdateCrmDto) {
    return this.usersService.updateCrm(actor, id, dto);
  }

  // --- Team management (staff accounts) ---
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...TEAM_ROLES)
  @Get('admin/team')
  listTeam() {
    return this.usersService.listAdmins();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...TEAM_ROLES)
  @Post('admin/team')
  createTeamMember(@CurrentUser() actor: any, @Body() dto: CreateAdminDto) {
    return this.usersService.createAdmin(actor, dto.fullName, dto.email, dto.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...TEAM_ROLES)
  @Delete('admin/team/:id')
  removeTeamMember(@CurrentUser() actor: any, @Param('id') id: string) {
    return this.usersService.removeAdmin(actor, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...TEAM_ROLES)
  @Post('admin/team/:id/reset-password')
  resetTeamMemberPassword(@CurrentUser() actor: any, @Param('id') id: string) {
    return this.usersService.resetAdminPassword(actor, id);
  }
}
