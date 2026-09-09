import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserRole } from '../users/user.schema';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

// The browser never sees the token (it's an httpOnly cookie) — this is only
// read here, server-side. The Bearer-header extractor stays as a fallback
// for API testing tools (curl/Postman/Swagger) that don't carry cookies.
function fromCookie(req: Request): string | null {
  return (req && req.cookies && req.cookies['vakpon_jwt']) || null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken(), fromCookie]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // Attached to request.user for guards/decorators to use
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
