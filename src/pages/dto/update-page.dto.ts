import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

export class PageSectionDto {
  @IsOptional() @IsString() @MaxLength(10) icon?: string;
  @IsString() @MaxLength(200) titleFr: string;
  @IsOptional() @IsString() @MaxLength(200) titleEn?: string;
  @IsOptional() @IsString() @MaxLength(4000) bodyFr?: string;
  @IsOptional() @IsString() @MaxLength(4000) bodyEn?: string;
}

export class UpdatePageDto {
  @IsOptional() @IsString() @MaxLength(200) heroTitleFr?: string;
  @IsOptional() @IsString() @MaxLength(200) heroTitleEn?: string;
  @IsOptional() @IsString() @MaxLength(400) heroSubtitleFr?: string;
  @IsOptional() @IsString() @MaxLength(400) heroSubtitleEn?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PageSectionDto)
  sections?: PageSectionDto[];
}
