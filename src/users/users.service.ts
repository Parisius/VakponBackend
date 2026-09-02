import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { User } from './user.schema';
import { MailService } from '../mail/mail.service';
import { AuditLogService } from '../audit/audit-log.service';
import { STAFF_ROLES, TEAM_ROLES, ROLE_LABELS } from '../common/roles';

function generateTempPassword() {
  return randomBytes(9).toString('base64url');
}

export interface CurrentUserCtx {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private mailService: MailService,
    private auditLogService: AuditLogService,
  ) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase().trim() });
  }

  findById(id: string) {
    return this.userModel.findById(id);
  }

  async create(data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    role?: 'customer' | 'admin';
    mustChangePassword?: boolean;
  }) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.userModel.create({
      email: data.email.toLowerCase().trim(),
      passwordHash,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role || 'customer',
      mustChangePassword: !!data.mustChangePassword,
    });
  }

  async validatePassword(user: User, password: string) {
    return bcrypt.compare(password, user.passwordHash);
  }

  async setPassword(userId: string, newPassword: string) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    const user = await this.userModel.findByIdAndUpdate(userId, {
      passwordHash,
      mustChangePassword: false,
    });
    if (user) {
      await this.auditLogService.log(
        { email: user.email, role: user.role },
        'password.change',
        'Changement de mot de passe personnel',
      );
    }
  }

  // --- Team management (staff accounts, any role in STAFF_ROLES) ---
  listAdmins() {
    return this.userModel.find({ role: { $in: STAFF_ROLES } }).sort({ createdAt: 1 }).select('-passwordHash');
  }

  async createAdmin(actor: CurrentUserCtx, fullName: string, email: string, role: string) {
    const existing = await this.findByEmail(email);
    if (existing) throw new BadRequestException('Un compte existe déjà avec cet email');

    const tempPassword = generateTempPassword();
    const user = await this.create({
      email,
      password: tempPassword,
      fullName,
      role: role as any,
      mustChangePassword: true,
    });

    await this.mailService.sendAdminInvite(user.email, user.fullName, tempPassword);
    await this.auditLogService.log(actor, 'member.create', `${fullName} (${ROLE_LABELS[role] || role})`);

    const { passwordHash, ...safe } = user.toObject();
    return { user: safe, tempPassword };
  }

  async removeAdmin(actor: CurrentUserCtx, id: string) {
    if (id === actor.userId) {
      throw new ForbiddenException('Vous ne pouvez pas retirer votre propre compte');
    }
    const target = await this.userModel.findOne({ _id: id, role: { $in: STAFF_ROLES } });
    if (!target) throw new NotFoundException('Membre introuvable');

    if (TEAM_ROLES.includes(target.role as any)) {
      const managersLeft = await this.userModel.countDocuments({ role: { $in: TEAM_ROLES } });
      if (managersLeft <= 1) {
        throw new BadRequestException("Impossible de retirer le dernier compte pouvant gérer l'équipe");
      }
    }

    await this.userModel.deleteOne({ _id: id });
    await this.auditLogService.log(actor, 'member.remove', `${target.fullName} (${ROLE_LABELS[target.role] || target.role})`);
    return { success: true };
  }

  async resetAdminPassword(actor: CurrentUserCtx, id: string) {
    const target = await this.userModel.findOne({ _id: id, role: { $in: STAFF_ROLES } });
    if (!target) throw new NotFoundException('Membre introuvable');

    const tempPassword = generateTempPassword();
    const passwordHash = await bcrypt.hash(tempPassword, 10);
    await this.userModel.findByIdAndUpdate(id, { passwordHash, mustChangePassword: true });

    await this.mailService.sendAdminInvite(target.email, target.fullName, tempPassword);
    await this.auditLogService.log(actor, 'password.reset', `Mot de passe réinitialisé pour ${target.fullName}`);

    return { tempPassword };
  }

  // --- CRM (admin) ---
  listCustomers(search?: string) {
    const filter: any = { role: 'customer' };
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    return this.userModel.find(filter).sort({ createdAt: -1 }).select('-passwordHash');
  }

  async getCustomer(id: string) {
    const user = await this.userModel.findById(id).select('-passwordHash');
    if (!user) throw new NotFoundException('Client introuvable');
    return user;
  }

  async updateCrm(actor: CurrentUserCtx, id: string, data: { adminNotes?: string; tags?: string[] }) {
    const user = await this.userModel.findByIdAndUpdate(id, data, { new: true }).select('-passwordHash');
    if (!user) throw new NotFoundException('Client introuvable');
    await this.auditLogService.log(actor, 'customer.update', `Fiche client mise à jour — ${user.fullName}`);
    return user;
  }

  async updateProfile(id: string, data: { fullName?: string; phone?: string }) {
    const user = await this.userModel.findByIdAndUpdate(id, data, { new: true }).select('-passwordHash');
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }
}
