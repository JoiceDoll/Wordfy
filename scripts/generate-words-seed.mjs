/**
 * Rebuilds src/data/database/seed/words.json.
 *
 * Intersection of:
 * - dwyl/english-words words_dictionary.json (challenge source)
 * - first20hours/google-10000-english (common USA English, no swears)
 *
 * Usage (needs network):
 *   node scripts/generate-words-seed.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outPath = path.join(root, 'src/data/database/seed/words.json');

const DWYL_URL =
  'https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json';
const COMMON_URL =
  'https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa-no-swears.txt';

const KEEP_TWO = new Set([
  'of',
  'to',
  'in',
  'on',
  'at',
  'or',
  'an',
  'if',
  'as',
  'be',
  'by',
  'do',
  'go',
  'me',
  'my',
  'no',
  'so',
  'up',
  'us',
  'we',
  'he',
  'it',
  'is',
  'am',
  'ok',
  'hi',
  'oh',
  'ah',
  'um',
  're',
]);

async function main() {
  const [dwylRes, commonRes] = await Promise.all([
    fetch(DWYL_URL),
    fetch(COMMON_URL),
  ]);
  if (!dwylRes.ok || !commonRes.ok) {
    throw new Error('Failed to download word lists');
  }

  const dwyl = await dwylRes.json();
  const common = (await commonRes.text())
    .split(/\r?\n/)
    .map(w => w.trim().toLowerCase())
    .filter(Boolean);

  const dwylSet = new Set(Object.keys(dwyl).map(w => w.toLowerCase()));
  const filtered = [];
  const seen = new Set();

  for (const word of common) {
    if (!/^[a-z]+$/.test(word)) {
      continue;
    }
    if (word.length < 2 || word.length > 14) {
      continue;
    }
    if (word.length === 2 && !KEEP_TWO.has(word)) {
      continue;
    }
    if (/^(.)\1+$/.test(word)) {
      continue;
    }
    if (!dwylSet.has(word) || seen.has(word)) {
      continue;
    }
    seen.add(word);
    filtered.push(word);
  }

  filtered.sort((a, b) => a.localeCompare(b));
  fs.writeFileSync(outPath, JSON.stringify(filtered));
  console.log(`Wrote ${filtered.length} words → ${outPath}`);
  console.log('Remember to bump WORDS_SEED_VERSION in seedWords.ts');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
