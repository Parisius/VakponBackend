import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// One row per static piece of site chrome (nav labels, buttons, footer,
// form labels...) that isn't already part of an Offer. Keyed by a dotted
// key (e.g. "nav.about") so a future site can bring its own key set.
@Schema({ timestamps: true })
export class UiString extends Document {
  @Prop({ required: true, default: 'vakpon-tours' })
  site: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true, default: '' })
  fr: string;

  @Prop({ default: '' })
  en: string;
}

export const UiStringSchema = SchemaFactory.createForClass(UiString);
UiStringSchema.index({ site: 1, key: 1 }, { unique: true });
