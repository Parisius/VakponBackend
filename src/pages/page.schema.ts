import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// One section = one topic card (e.g. "Formalités d'entrée", "Nos valeurs").
// Plain text in/out on purpose — rendered on the public site via textContent
// or an escapeHtml()+<br> pass, never innerHTML with raw admin input, so
// there's no HTML-sanitization surface to get wrong here (unlike
// translations.ts, which genuinely needs to hold small bits of markup).
@Schema({ _id: false })
export class PageSection {
  @Prop({ default: '' })
  icon: string;

  @Prop({ required: true })
  titleFr: string;

  @Prop({ default: '' })
  titleEn: string;

  @Prop({ default: '' })
  bodyFr: string;

  @Prop({ default: '' })
  bodyEn: string;
}
export const PageSectionSchema = SchemaFactory.createForClass(PageSection);

// One document per static content page editable from the back office
// (Guide du voyageur, À propos, ...). Keyed by slug rather than a separate
// collection per page since both share the same hero + topic-card shape.
@Schema({ timestamps: true })
export class Page extends Document {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ default: '' })
  heroTitleFr: string;

  @Prop({ default: '' })
  heroTitleEn: string;

  @Prop({ default: '' })
  heroSubtitleFr: string;

  @Prop({ default: '' })
  heroSubtitleEn: string;

  @Prop({ type: [PageSectionSchema], default: [] })
  sections: PageSection[];
}

export const PageSchema = SchemaFactory.createForClass(Page);
