# Project Progress & Changelog

## Session: February 2025

### What Was Done

#### 1. Research Phase
- Analyzed how SMS/call bombers work
- Cloned and studied 3 bomber repositories:
  - `pa1n-dev/SMS-Bomber` (C#) - 30+ Ukrainian services
  - `LordOfPolls/EBomber` (Python) - 100+ international services
  - `Denishnc/b0mb3r` (Python) - 42 services
- Extracted working API endpoints and request formats

#### 2. Service Collection
Created comprehensive service databases:

| File | Services | Description |
|------|----------|-------------|
| `verified-services.js` | 29 | Endpoints extracted directly from working bombers |
| `all-services.js` | 113 | All Ukrainian services (verified + additional) |
| `international-services.js` | 89 | International services (social, dating, e-commerce, etc.) |
| `call-services.js` | 14 | Services that make phone calls |

#### 3. Testing Tool Development
Created `master-tester.js` - comprehensive testing tool:
- Tests all 222 services in parallel
- Supports multiple phone number formats
- Handles different Content-Types (JSON, form-urlencoded)
- Color-coded output for easy reading
- Saves results to JSON file
- Configurable timeout, concurrency, delay

#### 4. Live Testing on +380506648076
**Results:**
```
Total services: 211
HTTP 200 (success): 41
Blocked (403/429): 32
Not Found (404): 70+
Errors: 21
Timeout: 8
```

**Confirmed SMS received from:**
- Vodafone
- Helsi
- Multiplex

**Needs verification:** 38 more services returned HTTP 200

---

### What Needs To Be Done Next

#### Immediate (Phase 1)
1. **Verify actual SMS delivery**
   - Check phone after each test
   - Document which services ACTUALLY sent SMS/call
   - Note sender name and message format
   - Update `verified-services.js` with confirmed working services

2. **Clean up service lists**
   - Remove services that return 404 (endpoint changed/dead)
   - Remove services with DNS errors (domain gone)
   - Update endpoints for services that moved

#### Short-term (Phase 2)
3. **Expand service coverage**
   - Scrape Ukrainian websites for "callback" forms
   - Find registration forms that trigger SMS
   - Analyze popular Ukrainian apps for SMS auth APIs
   - Monitor bomber repos for new services added

4. **Improve testing**
   - Add retry logic for failed requests
   - Add proxy support to avoid IP blocks
   - Create continuous monitoring mode
   - Track success rate over time

#### Medium-term (Phase 3)
5. **Build detection patterns**
   - Create database of OTP sender names (HELSI, VODAFONE, etc.)
   - Build regex patterns for OTP message formats
   - Define burst detection thresholds
   - Create scoring system for spam likelihood

6. **Create anti-spam API**
   - Endpoint to report incoming SMS
   - Real-time analysis of SMS patterns
   - Return spam score / block recommendation
   - Webhook for detected attacks

#### Long-term (Phase 4)
7. **Build user-facing platform**
   - Mobile app for spam protection
   - Dashboard to view attack statistics
   - One-click report to affected services
   - Community-driven service database

---

### Technical Notes

#### Phone Number Formats
Different services expect different formats:
```javascript
{phone}           = 380501234567
{phoneLocal}      = 501234567
{phoneNoCode}     = 0501234567
{phoneFormatted1} = +38(050)-123-45-67
{phoneFormatted2} = +38 (050) 123-45-67
{phoneFormatted3} = 38 (050) 123 45 67
```

#### Common API Patterns
Most services use one of these patterns:

**JSON body:**
```javascript
POST /api/auth/send-code
Content-Type: application/json
{"phone": "+380501234567"}
```

**Form data:**
```javascript
POST /api/auth/sms
Content-Type: application/x-www-form-urlencoded
phone=380501234567
```

**With additional fields:**
```javascript
POST /api/v1/registration
{"phone": "501234567", "phone_prefix": "+380", "type": "register"}
```

#### Response Interpretation
- `200/201/202` - Request accepted (may or may not send SMS)
- `400` - Bad request (wrong format)
- `401` - Auth required (needs token/session)
- `403` - Blocked (rate limit or IP ban)
- `404` - Endpoint not found (API changed)
- `429` - Too many requests
- `500+` - Server error

**Important:** HTTP 200 doesn't guarantee SMS was sent! Must verify with actual phone.

---

### Files Created This Session

| File | Purpose |
|------|---------|
| `master-tester.js` | Main testing tool |
| `master-results.json` | Test results |
| `all-services.js` | 113 Ukrainian services |
| `international-services.js` | 89 international services |
| `verified-services.js` | 29 bomber-verified services |
| `README.md` | Updated documentation |
| `PROGRESS.md` | This file |

---

### Commands Reference

```bash
# Full test (all services)
node master-tester.js 380XXXXXXXXX --save

# Verified only (faster, more reliable)
node master-tester.js 380XXXXXXXXX --verified --save

# Custom settings
node master-tester.js 380XXXXXXXXX --timeout=15000 --concurrency=5 --delay=500 --save

# Generate detection patterns
node analyzer.js
```

---

### Contact / Notes

- Test number: +380506648076
- Last successful test: Feb 2025
- Services confirmed working: Vodafone, Helsi, Multiplex
- More services likely work but need phone verification

---

*This file should be updated after each work session.*
