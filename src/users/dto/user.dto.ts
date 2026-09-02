import { IsEmail, IsIn, IsOptional, IsString, IsArray } from 'class-validator';
import { STAFF_ROLES } from '../../common/roles';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateCrmDto {
  @IsOptional()
  @IsString()
  adminNotes?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class CreateAdminDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsIn(STAFF_ROLES)
  role: (typeof STAFF_ROLES)[number];
}
