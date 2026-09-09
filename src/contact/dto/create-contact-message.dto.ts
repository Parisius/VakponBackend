import { IsEmail, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

const REASONS = ['general', 'trip', 'press', 'partnership', 'other'] as const;

export class CreateContactMessageDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsIn(REASONS)
  reason?: (typeof REASONS)[number];

  @IsString()
  @MaxLength(4000)
  message: string;
}
