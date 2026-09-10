/**
 * One-time maintenance script: overwrites the "apropos.introEyebrow"
 * translation with its current default (see translations/default-ui-strings.ts).
 *
 * TranslationsService.seedMissing() only fills in a key the first time it's
 * ever seen, so a value change in default-ui-strings.ts made after that key
 * was already seeded never reaches an already-running database on its own
 * — use this to push that one update. Any staff edit made to this specific
 * key from the admin Translations page since the last run of this script
 * will be lost; every other key is untouched.
 *
 * Run with: npm run fix:apropos-eyebrow
 */
import * as dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { UiStringSchema } from './translations/ui-string.schema';
import { DEFAULT_UI_STRINGS } from './translations/default-ui-strings';

const KEY = 'apropos.introEyebrow';

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Missing MONGODB_URI in .env');
    process.exit(1);
  }

  const entry = DEFAULT_UI_STRINGS.find((e) => e.key === KEY);
  if (!entry) {
    console.error(`"${KEY}" not found in DEFAULT_UI_STRINGS`);
    process.exit(1);
  }

  await mongoose.connect(uri);
  const UiStringModel = mongoose.model('UiString', UiStringSchema);

  await UiStringModel.findOneAndUpdate(
    { site: 'vakpon-tours', key: KEY },
    { $set: { fr: entry.fr, en: entry.en } },
    { upsert: true },
  );
  console.log(`Updated "${KEY}".`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
