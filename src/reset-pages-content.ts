/**
 * One-time maintenance script: overwrites the Guide du voyageur / À propos
 * page content with the current DEFAULT_PAGES (see pages/default-pages.ts).
 *
 * Unlike PagesService's own seeding (which only fills in a slug the first
 * time it's ever seen), this OVERWRITES existing content — use it after
 * updating default-pages.ts to push that update to an already-seeded
 * database. Any edit made from the admin Pages editor since the last run
 * of this script will be lost for the slugs it touches.
 *
 * Run with: npm run reset:pages
 */
import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { PageSchema } from './pages/page.schema';
import { DEFAULT_PAGES } from './pages/default-pages';
import { PAGE_SLUGS } from './pages/page-slugs';

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const PageModel = mongoose.model('Page', PageSchema);

  for (const slug of PAGE_SLUGS) {
    await PageModel.findOneAndUpdate(
      { slug },
      { $set: { slug, ...DEFAULT_PAGES[slug] } },
      { upsert: true },
    );
    console.log(`Updated content for "${slug}".`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
