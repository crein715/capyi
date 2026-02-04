export const callServices = [
  {
    name: "Uklon Call",
    category: "taxi",
    country: "UA",
    method: "POST",
    url: "https://api.uklon.com.ua/api/v1/auth/call",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    type: "call"
  },
  {
    name: "Bolt Call",
    category: "taxi",
    country: "UA",
    method: "POST",
    url: "https://node.bolt.eu/user/v1/phone/requestVoiceConfirmation",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}", phone_prefix: "+380" },
    type: "call"
  },
  {
    name: "Monobank Call",
    category: "banking",
    country: "UA",
    method: "POST",
    url: "https://api.monobank.ua/personal/auth/call",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    type: "call"
  },
  {
    name: "PrivatBank Call",
    category: "banking",
    country: "UA",
    method: "POST",
    url: "https://otp.privatbank.ua/api/v1/otp/call",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    type: "call"
  },
  {
    name: "Glovo Call",
    category: "delivery",
    country: "UA",
    method: "POST",
    url: "https://api.glovoapp.com/v3/auth/voice-call",
    headers: { "Content-Type": "application/json", "Glovo-App-Platform": "web" },
    data: { phoneNumber: "{phone}" },
    type: "call"
  },
  {
    name: "Rozetka Call",
    category: "ecommerce",
    country: "UA",
    method: "POST",
    url: "https://xl-catalog-api.rozetka.com.ua/v2/registration/call",
    headers: { "Content-Type": "application/json" },
    data: { login: "{phone}" },
    type: "call"
  },
  {
    name: "OLX Call",
    category: "ecommerce",
    country: "UA",
    method: "POST",
    url: "https://www.olx.ua/api/open/oauth/phone-call/",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    type: "call"
  },
  {
    name: "Telegram Call",
    category: "messenger",
    country: "INTL",
    method: "POST",
    url: "https://my.telegram.org/auth/send_call",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: { phone: "{phone}" },
    type: "call",
    formEncoded: true
  }
];

export default callServices;
