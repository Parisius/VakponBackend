import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserRole = 'customer' | 'admin' | 'operations' | 'service_client' | 'support' | 'financial' | 'marketing';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  phone: string;

  @Prop({
    enum: ['customer', 'admin', 'operations', 'service_client', 'support', 'financial', 'marketing'],
    default: 'customer',
  })
  role: UserRole;

  // --- CRM fields (admin-managed, not customer-visible) ---
  @Prop({ default: '' })
  adminNotes: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: false })
  mustChangePassword: boolean;

  // --- OTP for staff login 2FA (never set for customers) ---
  @Prop()
  otpCodeHash: string;

  @Prop()
  otpExpiresAt: Date;

  // Brute-force protection: 2 wrong codes locks new attempts/new codes for
  // 3 hours (see OTP_MAX_ATTEMPTS/OTP_LOCKOUT_MS in users.service.ts).
  @Prop({ default: 0 })
  otpFailedAttempts: number;

  @Prop()
  otpBlockedUntil: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
