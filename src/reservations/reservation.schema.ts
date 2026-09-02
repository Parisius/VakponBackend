import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'awaiting_payment'
  | 'paid'
  | 'completed'
  | 'cancelled';

@Schema({ _id: false })
export class ThreadMessage {
  @Prop({ enum: ['customer', 'admin'], required: true })
  from: 'customer' | 'admin';

  @Prop({ required: true })
  text: string;

  @Prop({ default: () => new Date() })
  date: Date;
}
export const ThreadMessageSchema = SchemaFactory.createForClass(ThreadMessage);

@Schema({ timestamps: true })
export class Reservation extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  customer: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Offer' })
  offer: Types.ObjectId;

  // Fallback for "Sur-Mesure" / custom requests with no fixed Offer doc
  @Prop()
  offerNameSnapshot: string;

  @Prop({ required: true, min: 1 })
  travelers: number;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  message: string; // initial "votre projet de voyage" text

  @Prop({
    enum: ['pending', 'confirmed', 'awaiting_payment', 'paid', 'completed', 'cancelled'],
    default: 'pending',
  })
  status: ReservationStatus;

  // Internal only — never sent to the customer
  @Prop({ default: '' })
  adminNotes: string;

  @Prop({ type: [ThreadMessageSchema], default: [] })
  messages: ThreadMessage[];

  createdAt: Date;
  updatedAt: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
