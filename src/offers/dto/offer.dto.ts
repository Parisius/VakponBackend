import { IsArray, IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

class PriceTierDto {
  @IsString()
  label: string;

  @IsString()
  amount: string;
}

export class CreateOfferDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  quote?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  includedItems?: string[];

  @IsOptional()
  @IsArray()
  priceTiers?: PriceTierDto[];

  @IsOptional()
  @IsString()
  durationLabel?: string;

  @IsOptional()
  @IsString()
  routeLabel?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class UpdateOfferDto extends CreateOfferDto {}
