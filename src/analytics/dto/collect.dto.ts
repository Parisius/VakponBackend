import { IsOptional, IsString } from 'class-validator';

export class CollectDto {
  @IsOptional() @IsString() site?: string;
  @IsString() path: string;
  @IsOptional() @IsString() referrer?: string;
  @IsOptional() @IsString() utmSource?: string;
  @IsOptional() @IsString() utmMedium?: string;
  @IsOptional() @IsString() utmCampaign?: string;
}
