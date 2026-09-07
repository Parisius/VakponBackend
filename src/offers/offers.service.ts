import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Offer } from './offer.schema';
import { CreateOfferDto, UpdateOfferDto } from './dto/offer.dto';
import { AuditLogService } from '../audit/audit-log.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name) private offerModel: Model<Offer>,
    private auditLogService: AuditLogService,
  ) {}

  // Public — what the landing page fetches
  findPublic() {
    return this.offerModel.find({ active: true }).sort({ featured: -1, sortOrder: 1, createdAt: 1 });
  }

  // Admin — everything, including inactive
  findAll() {
    return this.offerModel.find().sort({ featured: -1, sortOrder: 1, createdAt: 1 });
  }

  async findOne(id: string) {
    const offer = await this.offerModel.findById(id);
    if (!offer) throw new NotFoundException('Offre introuvable');
    return offer;
  }

  // Only one offer can drive the hero section at a time.
  private async clearOtherHeroes(exceptId?: string) {
    const filter: any = { isHero: true };
    if (exceptId) filter._id = { $ne: exceptId };
    await this.offerModel.updateMany(filter, { isHero: false });
  }

  async create(actor: { email: string; role: string }, dto: CreateOfferDto) {
    const offer = await this.offerModel.create(dto);
    if (offer.isHero) await this.clearOtherHeroes(offer._id.toString());
    await this.auditLogService.log(actor, 'offer.create', offer.title);
    return offer;
  }

  async update(actor: { email: string; role: string }, id: string, dto: UpdateOfferDto) {
    const offer = await this.offerModel.findByIdAndUpdate(id, dto, { new: true });
    if (!offer) throw new NotFoundException('Offre introuvable');
    if (dto.isHero) await this.clearOtherHeroes(id);
    await this.auditLogService.log(actor, 'offer.update', offer.title);
    return offer;
  }

  async remove(actor: { email: string; role: string }, id: string) {
    const res = await this.offerModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Offre introuvable');
    await this.auditLogService.log(actor, 'offer.delete', res.title);
    return { success: true };
  }
}
