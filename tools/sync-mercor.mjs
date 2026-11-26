// Refreshes the Mercor roles in referrals.json from Mercor's public listings API.
// micro1 roles (and anything else not from Mercor) are kept as they are.
// Usage: node tools/sync-mercor.mjs

import fs from 'node:fs';

const API = 'https://aws.api.mercor.com/work/listings-explore-page';
const REF =
  'referralCode=457ca4a3-06a2-ace1-9b78-eaec677252f2&utm_source=referral&utm_medium=share&utm_campaign=job_referral';
const FILE = new URL('../referrals.json', import.meta.url);

// Mercor's own domains, mapped onto the categories the page already uses for micro1.
const DOMAIN = {
  'Software Engineering': 'Engineering & AI',
  'Other Engineering': 'Engineering & AI',
  'Data Analysis': 'Data & Content',
  Medicine: 'Medical',
  Law: 'Legal',
  'Language and Audio': 'Languages',
  Finance: 'STEM & Finance',
  'Life, Physical, and Social Science': 'STEM & Finance',
  'Business Operations': 'Business & Product',
  'Arts & Design': 'Domain Experts',
  Humanities: 'Domain Experts',
  Miscellaneous: 'Domain Experts',
};

/** For listings with no domain: a best guess from the title. */
function guess(title) {
  const t = title.toLowerCase();
  if (/engineer|developer|software|programm|devops|\bml\b|machine learning|\bai\b|data scien/.test(t)) return 'Engineering & AI';
  if (/doctor|physician|nurse|medical|clinical|pharm|dent|health|radiolog|surgeon|therap/.test(t)) return 'Medical';
  if (/law|legal|attorney|lawyer|paralegal|compliance/.test(t)) return 'Legal';
  if (/finance|financ|account|tax|invest|bank|trader|actuar|econom/.test(t)) return 'STEM & Finance';
  if (/math|physic|chemi|biolog|scien|research/.test(t)) return 'STEM & Finance';
  if (/translat|language|linguist|speaker|native|voice|audio/.test(t)) return 'Languages';
  if (/security|cyber|soc\b|defen|military/.test(t)) return 'Defense & Security';
  if (/support|operations|customer|recruit|sales/.test(t)) return 'Customer & Operations';
  if (/product|marketing|business|consult|strategy/.test(t)) return 'Business & Product';
  return 'Domain Experts';
}

const UNIT = { hourly: '/hr', 'per-task': '/task', yearly: '/yr', 'one-time': ' one-time' };
const money = (n) => `$${Number(n).toLocaleString('en-US')}`;

function pay(x) {
  const lo = x.rateMin ?? x.hourlyPayRate;
  const hi = x.rateMax ?? lo;
  if (lo == null) return '';
  const unit = UNIT[x.payRateFrequency] ?? '';
  return lo === hi || hi == null ? `${money(lo)}${unit}` : `${money(lo)}–${money(hi)}${unit}`;
}

function where(x) {
  const arr = { remote: 'Remote', hybrid: 'Hybrid', onsite: 'On-site' }[x.workArrangement] ?? '';
  const only = (x.eligibleLocation ?? []).filter(Boolean);
  if (only.length && only.length <= 3) return `${arr}${arr ? ', ' : ''}${only.join('/')} only`;
  return arr;
}

const res = await fetch(API, { headers: { accept: 'application/json' } });
if (!res.ok) throw new Error(`Mercor API replied ${res.status}`);
const { listings } = await res.json();

const mercor = listings
  .filter((x) => x.status === 'active' && !x.isPrivate && !x.disableApplications && !x.deletedAt)
  .map((x) => ({
    company: 'Mercor',
    role: x.title.trim(),
    category: DOMAIN[x.listingDomain] ?? guess(x.title),
    pay: pay(x),
    ...(x.remainingSlots > 0 ? { openings: x.remainingSlots } : {}),
    highDemand: false,
    location: where(x),
    link: `https://work.mercor.com/jobs/${x.listingId}?${REF}`,
  }));

const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
const others = (data.roles ?? []).filter((r) => r.company !== 'Mercor');
data.roles = [...others, ...mercor];
const today = new Date().toISOString().slice(0, 10);
for (const board of data.boards ?? []) if (board.company === 'Mercor') board.updated = today;
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + '\n');

const byCat = {};
for (const r of mercor) byCat[r.category] = (byCat[r.category] ?? 0) + 1;
console.log(`Mercor: ${mercor.length} roles; others kept: ${others.length}; total ${data.roles.length}`);
console.log(byCat);
