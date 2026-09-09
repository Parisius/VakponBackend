import { Body, Controller, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@Controller()
export class ContactController {
  constructor(private contactService: ContactService) {}

  // Public — the Contact page's simple name/email/message form.
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('contact')
  create(@Body() dto: CreateContactMessageDto) {
    return this.contactService.create(dto);
  }
}
