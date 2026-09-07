import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { isStaffRole } from '../common/roles';
import { RegisterDto, LoginDto, ChangePasswordDto, ForgotPasswordDto, VerifyOtpDto } from './dto/auth.dto';

const OTP_TTL_MS = 10 * 60 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  private buildToken(user: any) {
    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Un compte existe déjà avec cet email');
    const user = await this.usersService.create({ ...dto, role: 'customer' });
    return this.buildToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Identifiants invalides');
    const valid = await this.usersService.validatePassword(user, dto.password);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');

    // Staff accounts (back-office) require a second factor — an OTP emailed on
    // each login. Customers (espace client) are unaffected.
    if (isStaffRole(user.role)) {
      const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
      await this.usersService.setOtp(user._id.toString(), code, new Date(Date.now() + OTP_TTL_MS));
      await this.mailService.sendOtpCode(user.email, user.fullName, code);
      return { otpRequired: true, email: user.email };
    }

    return this.buildToken(user);
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Code invalide ou expiré');
    const valid = await this.usersService.verifyAndConsumeOtp(user, dto.code);
    if (!valid) throw new UnauthorizedException('Code invalide ou expiré');
    return this.buildToken(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    const valid = await this.usersService.validatePassword(user, dto.currentPassword);
    if (!valid) throw new UnauthorizedException('Mot de passe actuel incorrect');
    await this.usersService.setPassword(userId, dto.newPassword);
    return { success: true };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    await this.usersService.forgotPassword(dto.email);
    // Always the same response, whether or not the email exists — avoids leaking account existence.
    return { success: true };
  }
}
