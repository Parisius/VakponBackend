import { IsIn } from 'class-validator';
import { PAGE_SLUGS } from '../page-slugs';

export class PageSlugDto {
  @IsIn(PAGE_SLUGS)
  slug: (typeof PAGE_SLUGS)[number];
}
