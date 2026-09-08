import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class PriceTier {
  @Prop({ required: true })
  label: string;

  @Prop()
  labelEn: string;

  @Prop({ required: true })
  amount: string; // kept as display string, e.g. "2 232€" — not translated (a price)
}
export const PriceTierSchema = SchemaFactory.createForClass(PriceTier);

@Schema({ _id: false })
export class PricingBreakdownRow {
  @Prop({ required: true })
  label: string;

  @Prop()
  labelEn: string;

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

  @Prop()
  dateLabelEn: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  titleEn: string;

  @Prop()
  description: string;

  @Prop()
  descriptionEn: string;
}
export const ItineraryDaySchema = SchemaFactory.createForClass(ItineraryDay);

@Schema({ timestamps: true })
export class Offer extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  titleEn: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  quote: string;

  @Prop()
  quoteEn: string;

  @Prop()
  description: string;

  @Prop()
  descriptionEn: string;

  @Prop({ type: [String], default: [] })
  includedItems: string[];

  @Prop({ type: [String], default: [] })
  includedItemsEn: string[];

  @Prop({ type: [PriceTierSchema], default: [] })
  priceTiers: PriceTier[];

  @Prop()
  durationLabel: string; // e.g. "7 jours · 6 nuits"

  @Prop()
  durationLabelEn: string;

  @Prop()
  routeLabel: string; // e.g. "Cotonou · Ganvié · Ouidah · Porto-Novo"

  @Prop()
  routeLabelEn: string;

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

  // --- Hero section + its detail modal on the landing page ---
  @Prop({ default: false })
  isHero: boolean;

  @Prop()
  heroWelcomeText: string; // small eyebrow above the headline, e.g. "Offre Spéciale : Places Limitées"

  @Prop()
  heroWelcomeTextEn: string;

  @Prop()
  heroHeadline: string; // big headline; newlines become <br> when rendered

  @Prop()
  heroHeadlineEn: string;

  @Prop()
  heroPinTitle: string; // location chip title, e.g. "Route des Esclaves"

  @Prop()
  heroPinTitleEn: string;

  @Prop()
  heroPinSub: string; // location chip subtitle, e.g. "Ouidah"

  @Prop()
  heroPinSubEn: string;

  @Prop()
  modalHeading: string; // e.g. "Pack Séjour Bénin 7 jours / 6 nuits"

  @Prop()
  modalHeadingEn: string;

  @Prop()
  modalDatesLabel: string; // free-text dates line, e.g. "Du 1er au 7 octobre 2026"

  @Prop()
  modalDatesLabelEn: string;

  @Prop({ type: [PricingBreakdownRowSchema], default: [] })
  modalPricingBreakdown: PricingBreakdownRow[]; // "Prix normal / Prix groupe / Économie réalisée" rows

  @Prop({ type: [ItineraryDaySchema], default: [] })
  itinerary: ItineraryDay[];

  @Prop()
  modalNote: string; // closing note in the modal

  @Prop()
  modalNoteEn: string;

  createdAt: Date;
  updatedAt: Date;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);
