import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UiString } from './ui-string.schema';
import { UpsertUiStringDto } from './dto/upsert-ui-string.dto';
import { AuditLogService } from '../audit/audit-log.service';
import { DEFAULT_UI_STRINGS } from './default-ui-strings';

@Injectable()
export class TranslationsService implements OnModuleInit {
  constructor(
    @InjectModel(UiString.name) private uiStringModel: Model<UiString>,
    private auditLogService: AuditLogService,
  ) {}

  async onModuleInit() {
    await this.seedMissing('vakpon-tours', DEFAULT_UI_STRINGS);
  }

  // Public — the site fetches this once on load and builds its i18n dict from it.
  async findAll(site: string) {
    const rows = await this.uiStringModel.find({ site }).lean();
    const dict: Record<string, { fr: string; en: string }> = {};
    rows.forEach((r) => { dict[r.key] = { fr: r.fr, en: r.en || '' }; });
    return dict;
  }

  async upsert(actor: { email: string; role: string }, dto: UpsertUiStringDto) {
    const site = dto.site || 'vakpon-tours';
    const row = await this.uiStringModel.findOneAndUpdate(
      { site, key: dto.key },
      { $set: { fr: dto.fr, en: dto.en ?? '' } },
      { upsert: true, new: true },
    );
    await this.auditLogService.log(actor, 'translation.update', dto.key);
    return row;
  }

  // Fills in any key that doesn't exist yet, without touching ones already
  // saved (so re-running a seed never clobbers a staff edit).
  async seedMissing(site: string, entries: { key: string; fr: string; en: string }[]) {
    const existing = await this.uiStringModel.find({ site }, { key: 1 }).lean();
    const known = new Set(existing.map((e) => e.key));
    const toInsert = entries.filter((e) => !known.has(e.key)).map((e) => ({ site, key: e.key, fr: e.fr, en: e.en }));
    if (toInsert.length) await this.uiStringModel.insertMany(toInsert);
    return { inserted: toInsert.length };
  }
}
