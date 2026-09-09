import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { randomInt } from 'crypto';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { isStaffRole } from '../common/roles';
import { RegisterDto, LoginDto, ChangePasswordDto, ForgotPasswordDto, VerifyOtpDto } from './dto/auth.dto';

const OTP_TTL_MS = 10 * 60 * 1000;
const JWT_COOKIE_NAME = 'vakpon_jwt';

function lockMessage(retryAt: Date): string {
  const minutes = Math.max(1, Math.ceil((retryAt.getTime() - Date.now()) / 60000));
  const unit = minutes >= 60 ? `${Math.ceil(minutes / 60)} heure(s)` : `${minutes} minute(s)`;
  return `Trop de tentatives échouées. Réessayez dans ${unit}.`;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  // Sets the httpOnly auth cookie and returns the user payload — the raw
  // token itself is never put in a JSON response body, so client-side JS
  // (including anything an XSS bug might run) never has it to read or store.
  // req.secure reflects the real client-facing protocol (trust proxy is on,
  // so it honors X-Forwarded-Proto from Nginx/NPM) rather than assuming
  // "production container" always means "HTTPS reached us" — this is what
  // lets the same code work over plain http in local dev/testing too.
  private issueSession(user: any, req: Request, res: Response) {
    const payload = { sub: user._id.toString(), email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    res.cookie(JWT_COOKIE_NAME, accessToken, {
      httpOnly: true,
      secure: req.secure,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    return {
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        mustChangePassword: user.mustChangePassword,
      },
    };
  }

  clearSession(req: Request, res: Response) {
    res.clearCookie(JWT_COOKIE_NAME, { httpOnly: true, secure: req.secure, sameSite: 'lax', path: '/' });
  }

  async register(dto: RegisterDto, req: Request, res: Response) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new ConflictException('Un compte existe déjà avec cet email');
    const user = await this.usersService.create({ ...dto, role: 'customer' });
    return this.issueSession(user, req, res);
  }

  async login(dto: LoginDto, req: Request, res: Response) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Identifiants invalides');
    const valid = await this.usersService.validatePassword(user, dto.password);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');

    // Staff accounts (back-office) require a second factor — an OTP emailed on
    // each login. Customers (espace client) are unaffected.
    if (isStaffRole(user.role)) {
      const lock = this.usersService.getOtpLockStatus(user);
      if (lock.blocked) throw new UnauthorizedException(lockMessage(lock.retryAt!));

      const code = randomInt(0, 1_000_000).toString().padStart(6, '0');
      await this.usersService.setOtp(user._id.toString(), code, new Date(Date.now() + OTP_TTL_MS));
      await this.mailService.sendOtpCode(user.email, user.fullName, code);
      return { otpRequired: true, email: user.email };
    }

    return this.issueSession(user, req, res);
  }

  async verifyOtp(dto: VerifyOtpDto, req: Request, res: Response) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Code invalide ou expiré');
    const lock = this.usersService.getOtpLockStatus(user);
    if (lock.blocked) throw new UnauthorizedException(lockMessage(lock.retryAt!));
    const valid = await this.usersService.verifyAndConsumeOtp(user, dto.code);
    if (!valid) throw new UnauthorizedException('Code invalide ou expiré');
    return this.issueSession(user, req, res);
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
