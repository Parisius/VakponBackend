import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import * as geoip from 'geoip-lite';
import { PageView } from './pageview.schema';
import { CollectDto } from './dto/collect.dto';

export type AnalyticsRange = '7d' | '30d' | 'all';

@Injectable()
export class AnalyticsService {
  constructor(@InjectModel(PageView.name) private pageViewModel: Model<PageView>) {}

  // Groups a referrer URL into a human-readable traffic source, e.g. for a
  // "where do visitors come from" breakdown, without keeping the full URL.
  private resolveSource(referrer?: string): string {
    if (!referrer) return 'Direct';
    let host: string;
    try {
      host = new URL(referrer).hostname.replace(/^www\./, '');
    } catch {
      return 'Direct';
    }
    if (host.includes('google.')) return 'Google';
    if (host.includes('facebook.') || host === 'fb.me') return 'Facebook';
    if (host.includes('instagram.')) return 'Instagram';
    if (host.includes('whatsapp.') || host === 'wa.me') return 'WhatsApp';
    if (host.includes('linkedin.')) return 'LinkedIn';
    if (host.includes('twitter.') || host.includes('x.com')) return 'X (Twitter)';
    if (host.includes('bing.')) return 'Bing';
    if (host.includes('yahoo.')) return 'Yahoo';
    return host;
  }

  // Coarse device/browser detection from the User-Agent — no external
  // dependency, just enough to break down mobile vs desktop and browser family.
  private parseUserAgent(ua: string): { device: string; browser: string } {
    const isTablet = /iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobi/i.test(ua));
    const isMobile = !isTablet && /Mobi|Android|iPhone/i.test(ua);
    const device = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

    let browser = 'Autre';
    if (/Edg\//.test(ua)) browser = 'Edge';
    else if (/OPR\/|Opera/.test(ua)) browser = 'Opera';
    else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) browser = 'Chrome';
    else if (/Firefox\//.test(ua)) browser = 'Firefox';
    else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
    return { device, browser };
  }

  async collect(dto: CollectDto, ip: string, userAgent: string) {
    const today = new Date().toISOString().slice(0, 10);
    const visitorHash = crypto.createHash('sha256').update(`${ip}|${userAgent}|${today}`).digest('hex');
    const geo = ip ? geoip.lookup(ip) : null;
    const { device, browser } = this.parseUserAgent(userAgent || '');

    await this.pageViewModel.create({
      site: dto.site || 'vakpon-tours',
      path: dto.path,
      referrer: dto.referrer,
      source: this.resolveSource(dto.referrer),
      utmSource: dto.utmSource,
      utmMedium: dto.utmMedium,
      utmCampaign: dto.utmCampaign,
      country: geo?.country || 'Inconnu',
      device,
      browser,
      visitorHash,
    });
  }

  async summary(site: string, range: AnalyticsRange) {
    const match: Record<string, any> = { site };
    if (range !== 'all') {
      const since = new Date();
      since.setDate(since.getDate() - (range === '7d' ? 7 : 30));
      match.createdAt = { $gte: since };
    }

    const topBy = (field: string) =>
      this.pageViewModel.aggregate([
        { $match: match },
        { $group: { _id: `$${field}`, views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 10 },
        { $project: { [field]: '$_id', views: 1, _id: 0 } },
      ]);

    const [byDay, topPages, topSources, topCountries, deviceBreakdown, totalsAgg] = await Promise.all([
      this.pageViewModel.aggregate([
        { $match: match },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            views: { $sum: 1 },
            visitors: { $addToSet: '$visitorHash' },
          },
        },
        { $project: { date: '$_id', views: 1, uniqueVisitors: { $size: '$visitors' }, _id: 0 } },
        { $sort: { date: 1 } },
      ]),
      topBy('path'),
      topBy('source'),
      topBy('country'),
      topBy('device'),
      this.pageViewModel.aggregate([
        { $match: match },
        { $group: { _id: null, views: { $sum: 1 }, visitors: { $addToSet: '$visitorHash' } } },
        { $project: { views: 1, uniqueVisitors: { $size: '$visitors' }, _id: 0 } },
      ]),
    ]);

    return {
      totals: totalsAgg[0] || { views: 0, uniqueVisitors: 0 },
      byDay,
      topPages,
      topSources,
      topCountries,
      deviceBreakdown,
    };
  }
}
