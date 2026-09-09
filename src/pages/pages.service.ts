import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Page } from './page.schema';
import { PageSlug } from './page-slugs';
import { DEFAULT_PAGES } from './default-pages';
import { UpdatePageDto } from './dto/update-page.dto';
import { AuditLogService } from '../audit/audit-log.service';

@Injectable()
export class PagesService implements OnModuleInit {
  constructor(
    @InjectModel(Page.name) private pageModel: Model<Page>,
    private auditLogService: AuditLogService,
  ) {}

  async onModuleInit() {
    for (const slug of Object.keys(DEFAULT_PAGES) as PageSlug[]) {
      const exists = await this.pageModel.exists({ slug });
      if (!exists) await this.pageModel.create({ slug, ...DEFAULT_PAGES[slug] });
    }
  }

  // Public — the site fetches this to render the page. Falls back to the
  // built-in defaults if the DB row is somehow missing (shouldn't happen
  // after onModuleInit, but never 404 a public content page over it).
  async findBySlug(slug: PageSlug) {
    const doc = await this.pageModel.findOne({ slug }).lean();
    if (doc) return doc;
    return { slug, ...DEFAULT_PAGES[slug] };
  }

  async upsert(actor: { email: string; role: string }, slug: PageSlug, dto: UpdatePageDto) {
    const doc = await this.pageModel.findOneAndUpdate(
      { slug },
      { $set: dto },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
    await this.auditLogService.log(actor, 'page.update', slug);
    return doc;
  }
}
