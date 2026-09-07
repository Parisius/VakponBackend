import { IsArray, IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

class PriceTierDto {
  @IsString()
  label: string;

  @IsString()
  amount: string;
}

class PricingBreakdownRowDto {
  @IsString()
  label: string;

  @IsString()
  amount: string;

  @IsOptional()
  @IsBoolean()
  highlight?: boolean;
}

class ItineraryDayDto {
  @IsString()
  dateLabel: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
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

  @IsOptional()
  @IsBoolean()
  isHero?: boolean;

  @IsOptional()
  @IsString()
  heroWelcomeText?: string;

  @IsOptional()
  @IsString()
  heroHeadline?: string;

  @IsOptional()
  @IsString()
  heroPinTitle?: string;

  @IsOptional()
  @IsString()
  heroPinSub?: string;

  @IsOptional()
  @IsString()
  modalHeading?: string;

  @IsOptional()
  @IsString()
  modalDatesLabel?: string;

  @IsOptional()
  @IsArray()
  modalPricingBreakdown?: PricingBreakdownRowDto[];

  @IsOptional()
  @IsArray()
  itinerary?: ItineraryDayDto[];

  @IsOptional()
  @IsString()
  modalNote?: string;
}

export class UpdateOfferDto extends PartialType(CreateOfferDto) {}
