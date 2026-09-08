import { IsOptional, IsString } from 'class-validator';

export class UpsertUiStringDto {
  @IsOptional() @IsString() site?: string;
  @IsString() key: string;
  @IsString() fr: string;
  @IsOptional() @IsString() en?: string;
}
