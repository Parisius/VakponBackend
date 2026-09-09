import { IsIn, IsOptional } from 'class-validator';

const STATUSES = ['pending', 'confirmed', 'awaiting_payment', 'paid', 'completed', 'cancelled'] as const;

export class QueryReservationsDto {
  @IsOptional()
  @IsIn(STATUSES)
  status?: (typeof STATUSES)[number];
}
