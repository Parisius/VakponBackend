import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Reservation } from './reservation.schema';
import { UsersService } from '../users/users.service';
import { OffersService } from '../offers/offers.service';
import { MailService } from '../mail/mail.service';
import { AuditLogService } from '../audit/audit-log.service';
import { isStaffRole } from '../common/roles';
import {
  CreateAuthedReservationDto,
  CreatePublicReservationDto,
} from './dto/reservation.dto';

const STATUS_LABELS_FR: Record<string, string> = {
  pending: 'en attente', confirmed: 'confirmée', awaiting_payment: 'attente paiement',
  paid: 'payée', completed: 'terminée', cancelled: 'annulée',
};

function randomPassword() {
  return Math.random().toString(36).slice(-10);
}

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
    private usersService: UsersService,
    private offersService: OffersService,
    private mailService: MailService,
    private auditLogService: AuditLogService,
    private config: ConfigService,
  ) {}

  private async resolveOfferTitle(offerId?: string, offerName?: string) {
    if (offerId) {
      const offer = await this.offersService.findOne(offerId);
      return offer.title;
    }
    return offerName || 'Offre sur-mesure';
  }

  private adminAlertEmail(): string {
    return this.config.get<string>('ADMIN_ALERT_EMAIL') || 'vakpontours@gmail.com';
  }

  // --- Public landing-page form: finds or creates the customer account ---
  async createPublic(dto: CreatePublicReservationDto) {
    let user = await this.usersService.findByEmail(dto.email);
    let isNewAccount = false;
    let tempPassword: string | null = null;

    if (!user) {
      tempPassword = randomPassword();
      user = await this.usersService.create({
        email: dto.email,
        password: tempPassword,
        fullName: dto.fullName,
        phone: dto.phone,
        role: 'customer',
        mustChangePassword: true,
      });
      isNewAccount = true;
    }

    const offerTitle = await this.resolveOfferTitle(dto.offerId, dto.offerName);

    const reservation = await this.reservationModel.create({
      customer: user._id,
      offer: dto.offerId ? new Types.ObjectId(dto.offerId) : undefined,
      offerNameSnapshot: offerTitle,
      travelers: dto.travelers,
      startDate: dto.startDate,
      endDate: dto.endDate,
      message: dto.message,
      status: 'pending',
    });

    if (isNewAccount && tempPassword) {
      await this.mailService.sendWelcomeWithTempPassword(user.email, user.fullName, tempPassword);
    }
    await this.mailService.sendReservationConfirmation(user.email, user.fullName, offerTitle);
    await this.mailService.sendAdminAlert(
      this.adminAlertEmail(),
      user.fullName,
      offerTitle,
      reservation._id.toString(),
    );

    return { reservation, accountCreated: isNewAccount };
  }

  // --- Authenticated customer booking again from espace client ---
  async createAuthed(userId: string, dto: CreateAuthedReservationDto) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new NotFoundException('Utilisateur introuvable');
    const offerTitle = await this.resolveOfferTitle(dto.offerId, dto.offerName);

    const reservation = await this.reservationModel.create({
      customer: user._id,
      offer: dto.offerId ? new Types.ObjectId(dto.offerId) : undefined,
      offerNameSnapshot: offerTitle,
      travelers: dto.travelers,
      startDate: dto.startDate,
      endDate: dto.endDate,
      message: dto.message,
      status: 'pending',
    });

    await this.mailService.sendReservationConfirmation(user.email, user.fullName, offerTitle);
    await this.mailService.sendAdminAlert(
      this.adminAlertEmail(),
      user.fullName,
      offerTitle,
      reservation._id.toString(),
    );

    return reservation;
  }

  findMine(userId: string) {
    return this.reservationModel
      .find({ customer: userId })
      .populate('offer')
      .sort({ createdAt: -1 });
  }

  findAllForAdmin(status?: string) {
    const filter: any = {};
    if (status) filter.status = status;
    return this.reservationModel
      .find(filter)
      .populate('customer', '-passwordHash')
      .populate('offer')
      .sort({ createdAt: -1 });
  }

  async findOneChecked(id: string, requester: { userId: string; role: string }) {
    const reservation = await this.reservationModel
      .findById(id)
      .populate('customer', '-passwordHash')
      .populate('offer');
    if (!reservation) throw new NotFoundException('Réservation introuvable');
    const ownerId = (reservation.customer as any)._id
      ? (reservation.customer as any)._id.toString()
      : reservation.customer.toString();
    if (!isStaffRole(requester.role) && ownerId !== requester.userId) {
      throw new ForbiddenException("Vous n'avez pas accès à cette réservation");
    }
    return reservation;
  }

  async updateStatus(actor: { email: string; role: string }, id: string, status: string) {
    const before = await this.reservationModel.findById(id);
    if (!before) throw new NotFoundException('Réservation introuvable');
    const previousStatus = before.status;

    const reservation = await this.reservationModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .populate('customer');
    if (!reservation) throw new NotFoundException('Réservation introuvable');
    const customer = reservation.customer as any;
    await this.mailService.sendStatusUpdate(
      customer.email,
      customer.fullName,
      reservation.offerNameSnapshot,
      status,
    );
    await this.auditLogService.log(
      actor,
      'reservation.status',
      `${reservation.offerNameSnapshot} (${customer.fullName}) : ${STATUS_LABELS_FR[previousStatus] || previousStatus} → ${STATUS_LABELS_FR[status] || status}`,
    );
    return reservation;
  }

  async updateAdminNotes(actor: { email: string; role: string }, id: string, adminNotes: string) {
    const reservation = await this.reservationModel
      .findByIdAndUpdate(id, { adminNotes }, { new: true })
      .populate('customer');
    if (!reservation) throw new NotFoundException('Réservation introuvable');
    const customer = reservation.customer as any;
    await this.auditLogService.log(
      actor,
      'reservation.notes',
      `Notes internes mises à jour — ${reservation.offerNameSnapshot} (${customer?.fullName || ''})`,
    );
    return reservation;
  }

  async addMessage(id: string, requester: { userId: string; role: string }, text: string) {
    const reservation = await this.findOneChecked(id, requester);
    const from = isStaffRole(requester.role) ? 'admin' : 'customer';
    reservation.messages.push({ from, text, date: new Date() } as any);
    await reservation.save();

    const customer = reservation.customer as any;
    // Notify the other party
    if (from === 'admin') {
      await this.mailService.sendNewMessageAlert(customer.email, customer.fullName, reservation.offerNameSnapshot, true);
    } else {
      await this.mailService.sendNewMessageAlert(
        this.adminAlertEmail(),
        'Équipe Vakpon Tours',
        reservation.offerNameSnapshot,
        false,
      );
    }
    return reservation;
  }
}
