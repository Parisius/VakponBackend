import { IsArray, IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

class PriceTierDto {
  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  labelEn?: string;

  @IsString()
  amount: string;
}

class PricingBreakdownRowDto {
  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  labelEn?: string;

  @IsString()
  amount: string;

  @IsOptional()
  @IsBoolean()
  highlight?: boolean;
}

class ItineraryDayDto {
  @IsString()
  dateLabel: string;

  @IsOptional()
  @IsString()
  dateLabelEn?: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;
}

export class CreateOfferDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  quote?: string;

  @IsOptional()
  @IsString()
  quoteEn?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsArray()
  includedItems?: string[];

  @IsOptional()
  @IsArray()
  includedItemsEn?: string[];

  @IsOptional()
  @IsArray()
  priceTiers?: PriceTierDto[];

  @IsOptional()
  @IsString()
  durationLabel?: string;

  @IsOptional()
  @IsString()
  durationLabelEn?: string;

  @IsOptional()
  @IsString()
  routeLabel?: string;

  @IsOptional()
  @IsString()
  routeLabelEn?: string;

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
  heroWelcomeTextEn?: string;

  @IsOptional()
  @IsString()
  heroHeadline?: string;

  @IsOptional()
  @IsString()
  heroHeadlineEn?: string;

  @IsOptional()
  @IsString()
  heroPinTitle?: string;

  @IsOptional()
  @IsString()
  heroPinTitleEn?: string;

  @IsOptional()
  @IsString()
  heroPinSub?: string;

  @IsOptional()
  @IsString()
  heroPinSubEn?: string;

  @IsOptional()
  @IsString()
  modalHeading?: string;

  @IsOptional()
  @IsString()
  modalHeadingEn?: string;

  @IsOptional()
  @IsString()
  modalDatesLabel?: string;

  @IsOptional()
  @IsString()
  modalDatesLabelEn?: string;

  @IsOptional()
  @IsArray()
  modalPricingBreakdown?: PricingBreakdownRowDto[];

  @IsOptional()
  @IsArray()
  itinerary?: ItineraryDayDto[];

  @IsOptional()
  @IsString()
  modalNote?: string;

  @IsOptional()
  @IsString()
  modalNoteEn?: string;
}

export class UpdateOfferDto extends PartialType(CreateOfferDto) {}
