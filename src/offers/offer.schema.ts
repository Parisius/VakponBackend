import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class PriceTier {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  amount: string; // kept as display string, e.g. "2 232€"
}
export const PriceTierSchema = SchemaFactory.createForClass(PriceTier);

@Schema({ timestamps: true })
export class Offer extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  quote: string;

  @Prop()
  description: string;

  @Prop({ type: [String], default: [] })
  includedItems: string[];

  @Prop({ type: [PriceTierSchema], default: [] })
  priceTiers: PriceTier[];

  @Prop()
  durationLabel: string; // e.g. "7 jours · 6 nuits"

  @Prop()
  routeLabel: string; // e.g. "Cotonou · Ganvié · Ouidah · Porto-Novo"

  @Prop({ type: [String], default: [] })
  images: string[]; // URLs, e.g. "/images/route-des-captifs.jpg"

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  // Shown as the highlighted green/blue card at the top of "Nos Offres"
  @Prop({ default: false })
  featured: boolean;

  // Toggle without deleting
  @Prop({ default: true })
  active: boolean;

  @Prop({ default: 0 })
  sortOrder: number;

  createdAt: Date;
  updatedAt: Date;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
