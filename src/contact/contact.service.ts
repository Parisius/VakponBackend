import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

const REASON_LABELS: Record<string, string> = {
  general: 'Question générale',
  trip: 'Organiser mon voyage',
  press: 'Presse & médias',
  partnership: 'Partenariat',
  other: 'Autre',
};

@Injectable()
export class ContactService {
  constructor(
    private mailService: MailService,
    private config: ConfigService,
  ) {}

  async create(dto: CreateContactMessageDto) {
    const adminEmail = this.config.get<string>('ADMIN_ALERT_EMAIL') || 'vakpontours@gmail.com';
    await this.mailService.sendContactMessage(
      adminEmail,
      dto.name,
      dto.email,
      REASON_LABELS[dto.reason || 'general'] || dto.reason || '',
      dto.message,
    );
    return { success: true };
  }
}
