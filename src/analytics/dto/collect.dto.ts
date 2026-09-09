import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

// Length caps matter here specifically because this endpoint is public and
// unauthenticated — its fields get rendered later in the admin's Analytics
// page. Escaping on render (see admin/modules/analytics.js) is the real XSS
// defense; these caps just stop a caller from stuffing megabytes of junk in.
export class CollectDto {
  @IsOptional() @IsString() @MaxLength(60) site?: string;
  @IsString() @MaxLength(300) path: string;
  @IsOptional() @IsIn(['pageview', 'conversion']) eventType?: string;
  @IsOptional() @IsString() @MaxLength(500) referrer?: string;
  @IsOptional() @IsString() @MaxLength(200) utmSource?: string;
  @IsOptional() @IsString() @MaxLength(200) utmMedium?: string;
  @IsOptional() @IsString() @MaxLength(200) utmCampaign?: string;
  @IsOptional() @IsString() @MaxLength(100) sessionId?: string;
}
