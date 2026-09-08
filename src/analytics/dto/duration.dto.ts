import { IsInt, IsMongoId, Min } from 'class-validator';

export class DurationDto {
  @IsMongoId() id: string;
  @IsInt() @Min(0) durationMs: number;
}
