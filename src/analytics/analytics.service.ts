import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as crypto from 'crypto';
import * as geoip from 'geoip-lite';
import { PageView } from './pageview.schema';
import { CollectDto } from './dto/collect.dto';

export type AnalyticsRange = '7d' | '30d' | 'all';

// Vakpon's booking flow ends at a submitted reservation request — payment is
// handled manually by staff afterwards (see backend README), so the funnel
// only tracks Landing -> Réservation soumise, not a third "paid" step.
export const EVENT_LABELS: Record<string, string> = {
  pageview: 'Landing',
  conversion: 'Réservation soumise',
};

@Injectable()
export class AnalyticsService {
  constructor(@InjectModel(PageView.name) private pageViewModel: Model<PageView>) {}

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
    if (host.includes('tiktok.')) return 'TikTok';
    if (host.includes('bing.')) return 'Bing';
    if (host.includes('yahoo.')) return 'Yahoo';
    return host;
  }

  private parseUserAgent(ua: string): { device: string; browser: string; os: string } {
    const isTablet = /iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobi/i.test(ua));
    const isMobile = !isTablet && /Mobi|Android|iPhone/i.test(ua);
    const device = isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop';

    let browser = 'Autre';
    if (/Edg\//.test(ua)) browser = 'Edge';
    else if (/OPR\/|Opera/.test(ua)) browser = 'Opera';
    else if (/TikTok/i.test(ua)) browser = 'TikTok';
    else if (/Snapchat/i.test(ua)) browser = 'Snapchat';
    else if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) browser = 'Chrome';
    else if (/Firefox\//.test(ua)) browser = 'Firefox';
    else if (/Safari\//.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';

    let os = 'Autre';
    if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Mac OS X|Macintosh/i.test(ua)) os = 'macOS';
    else if (/Linux/i.test(ua)) os = 'Linux';

    return { device, browser, os };
  }

  async collect(dto: CollectDto, ip: string, userAgent: string) {
    const today = new Date().toISOString().slice(0, 10);
    const visitorHash = crypto.createHash('sha256').update(`${ip}|${userAgent}|${today}`).digest('hex');
    const geo = ip ? geoip.lookup(ip) : null;
    const { device, browser, os } = this.parseUserAgent(userAgent || '');

    return this.pageViewModel.create({
      site: dto.site || 'vakpon-tours',
      path: dto.path,
      eventType: dto.eventType || 'pageview',
      referrer: dto.referrer,
      source: this.resolveSource(dto.referrer),
      utmSource: dto.utmSource,
      utmMedium: dto.utmMedium,
      utmCampaign: dto.utmCampaign,
      country: geo?.country || 'Inconnu',
      city: geo?.city || undefined,
      device,
      browser,
      os,
      visitorHash,
      sessionId: dto.sessionId,
    });
  }

  async recordDuration(id: string, durationMs: number) {
    await this.pageViewModel.findByIdAndUpdate(id, { durationMs }).exec();
  }

  private buildMatch(site: string, range: AnalyticsRange, path?: string, device?: string) {
    const match: Record<string, any> = { site };
    if (range !== 'all') {
      const since = new Date();
      since.setDate(since.getDate() - (range === '7d' ? 7 : 30));
      match.createdAt = { $gte: since };
    }
    if (path) match.path = path;
    if (device) match.device = device;
    return match;
  }

  async summary(site: string, range: AnalyticsRange, path?: string, device?: string) {
    const match = this.buildMatch(site, range, path, device);
    const pageviewMatch = { ...match, eventType: 'pageview' };

    const topBy = (field: string) =>
      this.pageViewModel.aggregate([
        { $match: pageviewMatch },
        { $group: { _id: `$${field}`, views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 10 },
        { $project: { [field]: '$_id', views: 1, _id: 0 } },
      ]);

    const [byDay, topPages, topSources, topCountries, topCities, deviceBreakdown, totalsAgg, durationAgg, landingSessions, conversionSessions] =
      await Promise.all([
        this.pageViewModel.aggregate([
          { $match: pageviewMatch },
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
        topBy('city'),
        topBy('device'),
        this.pageViewModel.aggregate([
          { $match: pageviewMatch },
          { $group: { _id: null, views: { $sum: 1 }, visitors: { $addToSet: '$visitorHash' } } },
          { $project: { views: 1, uniqueVisitors: { $size: '$visitors' }, _id: 0 } },
        ]),
        this.pageViewModel.aggregate([
          { $match: { ...pageviewMatch, durationMs: { $gt: 0 } } },
          { $group: { _id: null, avgDurationMs: { $avg: '$durationMs' } } },
        ]),
        this.pageViewModel.distinct('sessionId', { ...pageviewMatch, sessionId: { $ne: null } }),
        this.pageViewModel.distinct('sessionId', { ...match, eventType: 'conversion', sessionId: { $ne: null } }),
      ]);

    const landingCount = landingSessions.length;
    const conversionCount = conversionSessions.length;

    return {
      totals: totalsAgg[0] || { views: 0, uniqueVisitors: 0 },
      avgDurationMs: durationAgg[0]?.avgDurationMs || 0,
      funnel: {
        landing: landingCount,
        conversion: conversionCount,
        rate: landingCount ? Math.round((conversionCount / landingCount) * 100) : 0,
      },
      byDay,
      topPages,
      topSources,
      topCountries,
      topCities: topCities.filter((c: any) => c.city),
      deviceBreakdown,
    };
  }

  async log(site: string, range: AnalyticsRange, path: string | undefined, device: string | undefined, page: number, limit: number) {
    const match = this.buildMatch(site, range, path, device);
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      this.pageViewModel.find(match).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      this.pageViewModel.countDocuments(match),
    ]);

    return {
      rows: rows.map((r: any) => ({
        id: r._id,
        date: r.createdAt,
        page: EVENT_LABELS[r.eventType] || r.path,
        path: r.path,
        visitor: String(r.visitorHash).slice(0, 8),
        session: r.sessionId ? String(r.sessionId).slice(0, 8) : '—',
        referrer: r.source || 'Direct',
        utmSource: r.utmSource || '—',
        country: r.country || '—',
        city: r.city || '',
        device: r.device,
        browser: r.browser,
        os: r.os,
        durationMs: r.durationMs || 0,
      })),
      total,
      page,
      limit,
    };
  }
}
