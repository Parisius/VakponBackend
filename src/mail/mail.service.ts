import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: Number(this.config.get<string>('SMTP_PORT') || 587),
      secure: this.config.get<string>('SMTP_SECURE') === 'true',
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });
  }

  private clientUrl(): string {
    return this.config.get<string>('CLIENT_URL') || 'http://localhost:5502';
  }

  private loginButton(): string {
    return `<p style="margin-top:20px;">
      <a href="${this.clientUrl()}" style="display:inline-block;background:#15b568;color:#0b0b0a;font-weight:bold;padding:12px 22px;border-radius:100px;text-decoration:none;">
        Se connecter à mon espace client
      </a>
    </p>`;
  }

  private async send(to: string, subject: string, html: string) {
    try {
      await this.transporter.sendMail({
        from: this.config.get<string>('MAIL_FROM'),
        to,
        subject,
        html,
      });
    } catch (err) {
      // Never let a mail failure break the actual booking flow
      this.logger.error(`Failed to send mail to ${to}: ${err.message}`);
    }
  }

  async sendWelcomeWithTempPassword(to: string, fullName: string, tempPassword: string) {
    await this.send(
      to,
      'Bienvenue chez Vakpon Tours — votre espace client',
      `<p>Bonjour ${fullName},</p>
       <p>Votre espace client Vakpon Tours a été créé pour suivre votre demande de réservation.</p>
       <p><b>Email :</b> ${to}<br/><b>Mot de passe temporaire :</b> ${tempPassword}</p>
       <p>Merci de vous connecter et de changer ce mot de passe dès que possible.</p>
       ${this.loginButton()}
       <p>— L'équipe Vakpon Tours</p>`,
    );
  }

  async sendReservationConfirmation(to: string, fullName: string, offerTitle: string) {
    await this.send(
      to,
      'Votre demande de réservation Vakpon Tours',
      `<p>Bonjour ${fullName},</p>
       <p>Nous avons bien reçu votre demande de réservation pour <b>${offerTitle}</b>.</p>
       <p>Ceci est une demande sans engagement. Notre équipe vous répondra sous 24 heures avec une confirmation et les modalités de paiement.</p>
       <p>Vous pouvez suivre l'avancement depuis votre espace client à tout moment.</p>
       ${this.loginButton()}
       <p>— L'équipe Vakpon Tours</p>`,
    );
  }

  async sendAdminAlert(adminEmail: string, customerName: string, offerTitle: string, reservationId: string) {
    await this.send(
      adminEmail,
      `Nouvelle demande de réservation — ${customerName}`,
      `<p>Nouvelle demande reçue :</p>
       <ul>
         <li><b>Client :</b> ${customerName}</li>
         <li><b>Offre :</b> ${offerTitle}</li>
         <li><b>ID réservation :</b> ${reservationId}</li>
       </ul>
       <p>Connectez-vous au back-office pour répondre.</p>`,
    );
  }

  async sendStatusUpdate(to: string, fullName: string, offerTitle: string, status: string) {
    const labels: Record<string, string> = {
      pending: 'en attente',
      confirmed: 'confirmée',
      awaiting_payment: 'en attente de paiement',
      paid: 'payée',
      completed: 'terminée',
      cancelled: 'annulée',
    };
    await this.send(
      to,
      `Mise à jour de votre réservation — ${offerTitle}`,
      `<p>Bonjour ${fullName},</p>
       <p>Le statut de votre réservation pour <b>${offerTitle}</b> est maintenant : <b>${labels[status] || status}</b>.</p>
       <p>Consultez votre espace client pour plus de détails.</p>
       ${this.loginButton()}
       <p>— L'équipe Vakpon Tours</p>`,
    );
  }

  async sendNewMessageAlert(to: string, fullName: string, offerTitle: string, fromAdmin: boolean) {
    await this.send(
      to,
      `Nouveau message — réservation ${offerTitle}`,
      `<p>Bonjour ${fullName},</p>
       <p>${fromAdmin ? "L'équipe Vakpon Tours" : 'Le client'} a ajouté un message à la réservation <b>${offerTitle}</b>.</p>
       <p>Connectez-vous pour le consulter et y répondre.</p>
       ${fromAdmin ? this.loginButton() : ''}`,
    );
  }

  async sendPasswordReset(to: string, fullName: string, tempPassword: string) {
    await this.send(
      to,
      'Réinitialisation de votre mot de passe — Vakpon Tours',
      `<p>Bonjour ${fullName},</p>
       <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
       <p><b>Email :</b> ${to}<br/><b>Mot de passe temporaire :</b> ${tempPassword}</p>
       <p>Connectez-vous avec ce mot de passe temporaire — vous serez invité(e) à en choisir un nouveau. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
       <p>— L'équipe Vakpon Tours</p>`,
    );
  }

  async sendAdminInvite(to: string, fullName: string, tempPassword: string) {
    await this.send(
      to,
      'Votre accès au back-office Vakpon Tours',
      `<p>Bonjour ${fullName},</p>
       <p>Un accès au back-office Vakpon Tours a été créé pour vous.</p>
       <p><b>Email :</b> ${to}<br/><b>Mot de passe temporaire :</b> ${tempPassword}</p>
       <p>Merci de vous connecter et de changer ce mot de passe dès que possible.</p>
       <p>— L'équipe Vakpon Tours</p>`,
    );
  }
}
