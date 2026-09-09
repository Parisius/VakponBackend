import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OffersModule } from './offers/offers.module';
import { ReservationsModule } from './reservations/reservations.module';
import { MailModule } from './mail/mail.module';
import { AuditModule } from './audit/audit.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { TranslationsModule } from './translations/translations.module';
import { PagesModule } from './pages/pages.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Default cap for every route; auth-sensitive ones override with a
    // tighter @Throttle(...) (see AuthController). This is IP-based defense
    // in depth — the real OTP brute-force protection is the per-account
    // lockout in UsersService.
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 100 }]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    AuditModule,
    AuthModule,
    UsersModule,
    OffersModule,
    ReservationsModule,
    MailModule,
    AnalyticsModule,
    TranslationsModule,
    PagesModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
