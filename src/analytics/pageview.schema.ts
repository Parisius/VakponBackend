import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PageView extends Document {
  @Prop({ required: true, default: 'vakpon-tours' }) site: string;
  @Prop({ required: true }) path: string;
  // 'pageview' for a normal visit, 'conversion' for a tracked goal (e.g. a
  // reservation submitted) — see analytics.service.ts's EVENT_LABELS.
  @Prop({ required: true, default: 'pageview' }) eventType: string;
  @Prop() referrer: string;
  @Prop() source: string;
  @Prop() utmSource: string;
  @Prop() utmMedium: string;
  @Prop() utmCampaign: string;
  @Prop() country: string;
  @Prop() city: string;
  @Prop() device: string;
  @Prop() browser: string;
  @Prop() os: string;
  @Prop({ required: true }) visitorHash: string;
  // Client-generated, sessionStorage-scoped (cleared when the tab closes) —
  // groups events into one browsing session without persisting across visits.
  @Prop() sessionId: string;
  // Filled in later by a second beacon call on pagehide (see analytics.js).
  @Prop() durationMs: number;
}

export const PageViewSchema = SchemaFactory.createForClass(PageView);
PageViewSchema.index({ site: 1, createdAt: -1 });
