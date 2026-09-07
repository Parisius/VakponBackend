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

@Schema({ _id: false })
export class PricingBreakdownRow {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  amount: string;

  @Prop({ default: false })
  highlight: boolean;
}
export const PricingBreakdownRowSchema = SchemaFactory.createForClass(PricingBreakdownRow);

@Schema({ _id: false })
export class ItineraryDay {
  @Prop({ required: true })
  dateLabel: string; // e.g. "1er oct. - Arrivée"

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;
}
export const ItineraryDaySchema = SchemaFactory.createForClass(ItineraryDay);

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

  // --- Hero section + its detail modal on the landing page (at most one offer at a time) ---
  @Prop({ default: false })
  isHero: boolean;

  @Prop()
  heroWelcomeText: string; // small eyebrow above the headline, e.g. "Offre Spéciale : Places Limitées"

  @Prop()
  heroHeadline: string; // big headline; newlines become <br> when rendered

  @Prop()
  heroPinTitle: string; // location chip title, e.g. "Route des Esclaves"

  @Prop()
  heroPinSub: string; // location chip subtitle, e.g. "Ouidah"

  @Prop()
  modalHeading: string; // e.g. "Pack Séjour Bénin 7 jours / 6 nuits"

  @Prop()
  modalDatesLabel: string; // free-text dates line, e.g. "Du 1er au 7 octobre 2026"

  @Prop({ type: [PricingBreakdownRowSchema], default: [] })
  modalPricingBreakdown: PricingBreakdownRow[]; // "Prix normal / Prix groupe / Économie réalisée" rows

  @Prop({ type: [ItineraryDaySchema], default: [] })
  itinerary: ItineraryDay[];

  @Prop()
  modalNote: string; // closing note in the modal

  createdAt: Date;
  updatedAt: Date;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
