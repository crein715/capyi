# SMS/Call Spam Blocker Research Platform

> **⚠️ For research and defense purposes only.** This tool is designed to help build anti-spam/anti-bomber defenses by understanding how these attacks work.

## 🎯 Project Goal

Create a platform that blocks SMS and call spam by:
1. Understanding how SMS/call bombers work
2. Identifying all services that can be exploited to send SMS/calls
3. Building detection patterns for spam blocking
4. Creating a defense system against bomber attacks

---

## 📊 Current Status (Last Updated: Feb 2025)

### What We Have

| Component | Count | Status |
|-----------|-------|--------|
| Ukrainian Services | 113 | ✅ Collected |
| International Services | 89 | ✅ Collected |
| Verified (from bombers) | 29 | ✅ Tested |
| Call Services | 14 | ✅ Collected |
| **TOTAL SERVICES** | **222** | Ready for testing |

### Test Results on +380506648076

| Result | Count |
|--------|-------|
| HTTP 200 (potential working) | 41 |
| Blocked (403/429) | 32 |
| Not Found (404) | 70+ |
| Errors (DNS/SSL) | 21 |
| Timeout | 8 |

### Confirmed Working (Actually Sent SMS)
Based on testing, these services CONFIRMED to send SMS:
- ✅ **Vodafone** - telecom registration
- ✅ **Helsi** - healthcare platform
- ✅ **Multiplex** - cinema/entertainment

**⚠️ Need verification:** 38 more services returned HTTP 200 but need phone confirmation.

---

## 🗂️ File Structure

```
sms-bomber-tester/
├── master-tester.js      # 🔥 MAIN TOOL - Tests all services
├── master-results.json   # Latest test results
│
├── all-services.js       # 113 Ukrainian services
├── international-services.js  # 89 international services
├── verified-services.js  # 29 verified endpoints from bombers
├── services.js           # Original service definitions
├── call-services.js      # Call bombing services
│
├── analyzer.js           # Pattern generator for anti-spam
├── bomber-patterns.json  # Detection patterns output
├── index.js              # CLI tool (legacy)
├── test-all.js           # Old test script
├── test-verified.js      # Test verified services only
│
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### Installation
```bash
cd sms-bomber-tester
npm install
```

### Run Full Test
```bash
# Test all 222 services on a phone number
node master-tester.js 380XXXXXXXXX --save

# Test only verified services (29)
node master-tester.js 380XXXXXXXXX --verified --save

# Custom settings
node master-tester.js 380XXXXXXXXX --timeout=15000 --concurrency=10 --save
```

### Options
| Flag | Description | Default |
|------|-------------|---------|
| `--timeout=<ms>` | Request timeout | 10000 |
| `--concurrency=<n>` | Parallel requests | 10 |
| `--delay=<ms>` | Delay between batches | 100 |
| `--verified` | Test only verified services | false |
| `--category=<cat>` | Filter by category | all |
| `--quiet` | Minimal output | false |
| `--save` | Save results to JSON | false |

---

## 📱 Service Categories

### Ukrainian Services (113)
| Category | Examples |
|----------|----------|
| Healthcare | Helsi, Doc.ua, Apteka24 |
| Telecom | Vodafone, Kyivstar, Lifecell |
| E-commerce | Rozetka, OLX, Kasta, Allo, Comfy |
| Banking | Monobank, PrivatBank, PUMB |
| Food Delivery | Glovo, Bolt Food, Raketa |
| Restaurants | Sushiya, Smaki Maki, PizzaDay |
| Logistics | Nova Poshta, Meest, Justin |
| Entertainment | Multiplex, Planeta Kino, Megogo |
| Taxi | Uklon, Bolt, OnTaxi, 3040 |
| Jobs | Work.ua, Rabota.ua |
| Government | Diia |

### International Services (89)
| Category | Examples |
|----------|----------|
| Social Networks | Facebook, Instagram, TikTok, VK, Telegram |
| Dating | Tinder, Badoo, Bumble |
| E-commerce | Amazon, eBay, AliExpress, Alibaba |
| Finance | PayPal, Wise, Revolut, Binance |
| Gaming | Steam, Epic Games, PlayStation |
| Streaming | Netflix, Spotify, Disney+ |
| Communication | Zoom, Slack, Discord, WhatsApp |
| Travel | Booking.com, Airbnb |
| Ride-sharing | Uber, Bolt, Lyft |

### Call Services (14)
- DeliveryFlower Callback
- InstaFood Callback
- 3040 Taxi
- Frutalina Callback
- Binotel Callback
- Phonet Call widgets
- CallbackHunter
- Jivosite Callback

---

## 🔬 How It Works

### SMS Bomber Attack Pattern
```
1. Attacker enters victim's phone number
2. Bot sends requests to 100+ services simultaneously
3. Each service sends OTP/verification SMS to victim
4. Victim receives 100+ SMS in minutes = SPAM ATTACK
```

### Our Detection Approach
```javascript
// Burst detection
const BURST_THRESHOLD = 5;        // messages in window
const BURST_WINDOW_MS = 60000;    // 1 minute
const MIN_UNIQUE_SENDERS = 3;     // different services

if (otpCount >= BURST_THRESHOLD && 
    uniqueSenders >= MIN_UNIQUE_SENDERS &&
    timeWindow <= BURST_WINDOW_MS) {
  // SMS BOMBER ATTACK DETECTED
  // Actions: alert user, suppress OTPs, block sources
}
```

---

## 📋 TODO - Next Steps

### Phase 1: Verify Working Services ⏳
- [ ] Test on real number and record which services ACTUALLY send SMS/calls
- [ ] Update `verified-services.js` with confirmed working endpoints
- [ ] Remove dead/non-working services
- [ ] Document exact request format for each working service

### Phase 2: Expand Coverage 📝
- [ ] Find more Ukrainian services (web scraping for callback forms)
- [ ] Add more international services that support +380
- [ ] Reverse engineer mobile app APIs (many apps have SMS auth)
- [ ] Monitor bomber repos for new services

### Phase 3: Build Detection System 🛡️
- [ ] Create SMS pattern database (sender names, message formats)
- [ ] Build real-time burst detection algorithm
- [ ] Create API for spam blocking integration
- [ ] Develop mobile app / browser extension for protection

### Phase 4: Anti-Spam Platform 🚀
- [ ] User dashboard to monitor attacks
- [ ] Automatic blocking of bomber SMS
- [ ] Report system to notify affected services
- [ ] Statistics and analytics

---

## 🔍 Research Sources

### Analyzed Bomber Repos
| Repo | Services | Language |
|------|----------|----------|
| pa1n-dev/SMS-Bomber | 30+ UA | C# |
| LordOfPolls/EBomber | 100+ intl | Python |
| Denishnc/b0mb3r | 42 | Python |

### Service Endpoint Analysis
We extract real working endpoints from:
1. Open-source bomber tools (GitHub)
2. Website registration forms
3. Mobile app traffic analysis
4. API documentation

---

## ⚠️ Legal Disclaimer

This tool is for **educational and defensive security research only**.

- ❌ Do NOT use to harass or spam anyone
- ❌ Do NOT use on numbers you don't own
- ✅ Use to understand attack patterns
- ✅ Use to build better defenses
- ✅ Use to test your own services' security

Misuse may violate laws in your jurisdiction.

---

## 🤝 Contributing

1. Test services and report which actually work
2. Add new service endpoints
3. Improve detection patterns
4. Build the anti-spam platform

---

## 📞 Test Number

For testing purposes: `+380506648076` (project test number)

Last test: Feb 2025 - 41 services returned HTTP 200, 3 confirmed SMS received.
