import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

const RANGES = ['today', '7d', '30d', 'all'] as const;

export class QueryAnalyticsDto {
  @IsOptional() @IsString() @MaxLength(60) site?: string = 'vakpon-tours';
  @IsOptional() @IsIn(RANGES) range?: (typeof RANGES)[number] = '7d';
  @IsOptional() @IsString() @MaxLength(300) path?: string;
  @IsOptional() @IsString() @MaxLength(40) device?: string;
}

export class QueryAnalyticsLogDto extends QueryAnalyticsDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit?: number = 20;
}
