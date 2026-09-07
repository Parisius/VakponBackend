import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PageView extends Document {
  @Prop({ required: true, default: 'vakpon-tours' }) site: string;
  @Prop({ required: true }) path: string;
  @Prop() referrer: string;
  @Prop() source: string;
  @Prop() utmSource: string;
  @Prop() utmMedium: string;
  @Prop() utmCampaign: string;
  @Prop() country: string;
  @Prop() device: string;
  @Prop() browser: string;
  @Prop({ required: true }) visitorHash: string;
}

export const PageViewSchema = SchemaFactory.createForClass(PageView);
PageViewSchema.index({ site: 1, createdAt: -1 });
