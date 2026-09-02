import { IsDateString, IsEmail, IsIn, IsInt, IsMongoId, IsOptional, IsString, Min } from 'class-validator';

// Used by the public landing-page reservation form (no login required)
export class CreatePublicReservationDto {
  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsMongoId()
  offerId?: string;

  // For "Sur-Mesure" or when no fixed offer matches
  @IsOptional()
  @IsString()
  offerName?: string;

  @IsInt()
  @Min(1)
  travelers: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  message?: string;
}

// Used by an already-logged-in customer booking again from espace client
export class CreateAuthedReservationDto {
  @IsOptional()
  @IsMongoId()
  offerId?: string;

  @IsOptional()
  @IsString()
  offerName?: string;

  @IsInt()
  @Min(1)
  travelers: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  message?: string;
}

export class UpdateStatusDto {
  @IsIn(['pending', 'confirmed', 'awaiting_payment', 'paid', 'completed', 'cancelled'])
  status: string;
}

export class AddMessageDto {
  @IsString()
  text: string;
}

export class UpdateAdminNotesDto {
  @IsString()
  adminNotes: string;
}
