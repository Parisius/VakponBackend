import { IsOptional, IsString, MaxLength } from 'class-validator';

export class FindTranslationsDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  site?: string;
}
