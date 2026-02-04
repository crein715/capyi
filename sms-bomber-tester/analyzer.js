import chalk from 'chalk';
import { services, categories, getUkrainianServices } from './services.js';

console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════════╗'));
console.log(chalk.cyan('║') + chalk.yellow.bold('          SMS BOMBER PATTERN ANALYZER                           ') + chalk.cyan('║'));
console.log(chalk.cyan('║') + chalk.gray('          For building anti-spam detection                      ') + chalk.cyan('║'));
console.log(chalk.cyan('╚════════════════════════════════════════════════════════════════╝\n'));

const uaServices = getUkrainianServices();

console.log(chalk.cyan('─── KNOWN OTP SENDER NAMES (Alphanumeric) ─────────────────────────\n'));

const senderNames = uaServices.map(s => s.name.toUpperCase().replace(/[^A-Z0-9]/g, ''));
const uniqueSenders = [...new Set(senderNames)].sort();

console.log(chalk.white('These sender names are commonly used for OTP messages:\n'));
console.log(uniqueSenders.map(s => chalk.green(`"${s}"`)).join(', '));

console.log(chalk.cyan('\n\n─── OTP MESSAGE PATTERNS (Regex) ───────────────────────────────────\n'));

const patterns = [
  { name: 'Ukrainian OTP', pattern: /(?:Ваш код|Код підтвердження|Код верифікації)[\s:]+(\d{4,8})/i },
  { name: 'English OTP', pattern: /(?:Your code|Verification code|OTP|PIN)[\s:]+(\d{4,8})/i },
  { name: 'Code only', pattern: /^\d{4,8}$/ },
  { name: 'Link + Code', pattern: /(?:code|код)[\s:]+(\d{4,8}).*(?:https?:\/\/)/i },
  { name: 'Expiry mention', pattern: /(\d{4,8}).*(?:дійсний|valid|expires|минут)/i }
];

console.log(chalk.white('Common OTP message patterns:\n'));
for (const p of patterns) {
  console.log(chalk.green(`• ${p.name}:`));
  console.log(chalk.gray(`  ${p.pattern.toString()}\n`));
}

console.log(chalk.cyan('\n─── DETECTION RULES FOR ANTI-SPAM ─────────────────────────────────\n'));

const detectionRules = `
// Rule 1: Burst Detection
// If user receives 5+ OTP messages from different senders in 60 seconds
const BURST_THRESHOLD = 5;
const BURST_WINDOW_MS = 60000;

function detectBomberAttack(messages) {
  const otpMessages = messages.filter(m => isOtpMessage(m));
  const recentOtps = otpMessages.filter(m => 
    Date.now() - m.timestamp < BURST_WINDOW_MS
  );
  const uniqueSenders = new Set(recentOtps.map(m => m.sender));
  
  return recentOtps.length >= BURST_THRESHOLD && uniqueSenders.size >= 3;
}

// Rule 2: Known Sender Detection
const KNOWN_OTP_SENDERS = ${JSON.stringify(uniqueSenders.slice(0, 30), null, 2)};

function isKnownOtpSender(sender) {
  const normalized = sender.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return KNOWN_OTP_SENDERS.includes(normalized);
}

// Rule 3: OTP Pattern Detection
const OTP_PATTERNS = [
  /(?:Ваш код|Код підтвердження|Код верифікації)[\\s:]+\\d{4,8}/i,
  /(?:Your code|Verification code|OTP|PIN)[\\s:]+\\d{4,8}/i,
  /^\\d{4,8}$/,
  /(?:code|код)[\\s:]+\\d{4,8}/i
];

function isOtpMessage(message) {
  return OTP_PATTERNS.some(p => p.test(message.body));
}

// Rule 4: Attack Response
function handleBomberAttack(userId) {
  // 1. Alert user
  notifyUser(userId, "SMS bomber attack detected!");
  
  // 2. Optionally auto-filter OTP messages for 5 minutes
  enableTemporaryOtpFilter(userId, 5 * 60 * 1000);
  
  // 3. Log for analytics
  logAttack(userId, {
    type: 'sms_bomber',
    timestamp: Date.now(),
    messageCount: getRecentOtpCount(userId)
  });
}
`;

console.log(chalk.white(detectionRules));

console.log(chalk.cyan('\n─── SERVICE ENDPOINT SIGNATURES ───────────────────────────────────\n'));

const endpointPatterns = {};
for (const s of uaServices) {
  const domain = new URL(s.url).hostname;
  if (!endpointPatterns[domain]) {
    endpointPatterns[domain] = [];
  }
  endpointPatterns[domain].push({
    name: s.name,
    path: new URL(s.url).pathname,
    method: s.method
  });
}

console.log(chalk.white('API endpoints exploited by bombers (for monitoring/blocking):\n'));
for (const [domain, endpoints] of Object.entries(endpointPatterns).slice(0, 20)) {
  console.log(chalk.green(`${domain}:`));
  for (const ep of endpoints) {
    console.log(chalk.gray(`  ${ep.method} ${ep.path} (${ep.name})`));
  }
}

console.log(chalk.cyan('\n─── EXPORT DATA FOR ANTI-SPAM PLATFORM ────────────────────────────\n'));

const exportData = {
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  knownOtpSenders: uniqueSenders,
  otpPatterns: patterns.map(p => ({ name: p.name, pattern: p.pattern.toString() })),
  serviceEndpoints: Object.entries(endpointPatterns).map(([domain, eps]) => ({
    domain,
    endpoints: eps
  })),
  detectionThresholds: {
    burstCount: 5,
    burstWindowMs: 60000,
    minUniqueSenders: 3
  },
  categories: Object.keys(categories)
};

console.log(chalk.white('JSON export for integration:\n'));
console.log(chalk.gray(JSON.stringify(exportData, null, 2).substring(0, 1500) + '\n...'));

const fs = await import('fs');
fs.writeFileSync('bomber-patterns.json', JSON.stringify(exportData, null, 2));
console.log(chalk.green('\n✓ Full data exported to bomber-patterns.json'));

console.log(chalk.cyan('\n═══════════════════════════════════════════════════════════════════\n'));
