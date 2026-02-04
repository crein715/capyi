export const services = [
  // ==================== E-COMMERCE & RETAIL ====================
  {
    name: "Helsi",
    category: "healthcare",
    country: "UA",
    method: "POST",
    url: "https://helsi.me/api/healthy/v2/accounts/send",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}", platform: "PISWeb" },
    successIndicator: "success"
  },
  {
    name: "Rozetka",
    category: "ecommerce",
    country: "UA",
    method: "POST",
    url: "https://xl-catalog-api.rozetka.com.ua/v2/registration/request",
    headers: { "Content-Type": "application/json" },
    data: { login: "{phone}", registration_source: "web" },
    successIndicator: "success"
  },
  {
    name: "Novaposhta",
    category: "logistics",
    country: "UA",
    method: "POST",
    url: "https://api.novaposhta.ua/v2.0/json/",
    headers: { "Content-Type": "application/json" },
    data: {
      apiKey: "",
      modelName: "Counterparty",
      calledMethod: "save",
      methodProperties: { FirstName: "Test", MiddleName: "Test", LastName: "Test", Phone: "{phone}", CounterpartyType: "PrivatePerson" }
    },
    successIndicator: "success"
  },
  {
    name: "OLX",
    category: "ecommerce",
    country: "UA",
    method: "POST",
    url: "https://www.olx.ua/api/open/oauth/phone-auth/",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Prom",
    category: "ecommerce",
    country: "UA",
    method: "POST",
    url: "https://prom.ua/api/v1/auth/phone/send-code",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Kasta",
    category: "ecommerce",
    country: "UA",
    method: "POST",
    url: "https://kasta.ua/api/v2/auth/phone/request",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Allo",
    category: "ecommerce",
    country: "UA",
    method: "POST",
    url: "https://allo.ua/ua/customer/account/sendcode/",
    headers: { "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Foxtrot",
    category: "ecommerce",
    country: "UA",
    method: "POST",
    url: "https://www.foxtrot.com.ua/api/v2/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Comfy",
    category: "ecommerce",
    country: "UA",
    method: "POST",
    url: "https://comfy.ua/api/auth/phone/request",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Moyo",
    category: "ecommerce",
    country: "UA",
    method: "POST",
    url: "https://www.moyo.ua/api/auth/sms",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Citrus",
    category: "ecommerce",
    country: "UA",
    method: "POST",
    url: "https://api.citrus.ua/v2/auth/phone/code",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Epicentr",
    category: "ecommerce",
    country: "UA",
    method: "POST",
    url: "https://epicentrk.ua/api/auth/sms/send",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Hotline",
    category: "ecommerce",
    country: "UA",
    method: "POST",
    url: "https://hotline.ua/api/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },

  // ==================== BANKING & FINANCE ====================
  {
    name: "Monobank",
    category: "banking",
    country: "UA",
    method: "POST",
    url: "https://api.monobank.ua/personal/auth/request",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "PrivatBank",
    category: "banking",
    country: "UA",
    method: "POST",
    url: "https://otp.privatbank.ua/api/v1/otp/send",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Raiffeisen",
    category: "banking",
    country: "UA",
    method: "POST",
    url: "https://online.raiffeisen.ua/api/auth/send-otp",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "PUMB",
    category: "banking",
    country: "UA",
    method: "POST",
    url: "https://online.pumb.ua/api/auth/otp",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Oschadbank",
    category: "banking",
    country: "UA",
    method: "POST",
    url: "https://online.oschadbank.ua/api/auth/sms",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "ABank",
    category: "banking",
    country: "UA",
    method: "POST",
    url: "https://a-bank.com.ua/api/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Sense",
    category: "banking",
    country: "UA",
    method: "POST",
    url: "https://sense.alfabank.ua/api/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Sportbank",
    category: "banking",
    country: "UA",
    method: "POST",
    url: "https://sportbank.ua/api/auth/send-code",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Izibank",
    category: "banking",
    country: "UA",
    method: "POST",
    url: "https://izibank.com.ua/api/auth/otp",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },

  // ==================== LOGISTICS & DELIVERY ====================
  {
    name: "Uklon",
    category: "taxi",
    country: "UA",
    method: "POST",
    url: "https://api.uklon.com.ua/api/v1/auth/send-code",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Bolt",
    category: "taxi",
    country: "UA",
    method: "POST",
    url: "https://node.bolt.eu/user/v1/phone/requestPhoneConfirmation",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}", phone_prefix: "+380" },
    successIndicator: "message"
  },
  {
    name: "Glovo",
    category: "delivery",
    country: "UA",
    method: "POST",
    url: "https://api.glovoapp.com/v3/auth/phone",
    headers: { "Content-Type": "application/json", "Glovo-App-Platform": "web" },
    data: { phoneNumber: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Raketa",
    category: "delivery",
    country: "UA",
    method: "POST",
    url: "https://api.raketa.app/api/v3/auth/request-code",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Meest",
    category: "logistics",
    country: "UA",
    method: "POST",
    url: "https://api.meest.com/v2/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Justin",
    category: "logistics",
    country: "UA",
    method: "POST",
    url: "https://api.justin.ua/auth/send-code",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },

  // ==================== FOOD & RESTAURANTS ====================
  {
    name: "McDonald's UA",
    category: "food",
    country: "UA",
    method: "POST",
    url: "https://ua.mcdonalds.com/api/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Silpo",
    category: "food",
    country: "UA",
    method: "POST",
    url: "https://silpo.ua/api/auth/sms",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Fozzy",
    category: "food",
    country: "UA",
    method: "POST",
    url: "https://fozzy.ua/api/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "ATB",
    category: "food",
    country: "UA",
    method: "POST",
    url: "https://atbmarket.com/api/auth/otp",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },

  // ==================== HEALTHCARE ====================
  {
    name: "Doc.ua",
    category: "healthcare",
    country: "UA",
    method: "POST",
    url: "https://doc.ua/api/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Apteka24",
    category: "healthcare",
    country: "UA",
    method: "POST",
    url: "https://www.apteka24.ua/api/auth/sms",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Tabletki",
    category: "healthcare",
    country: "UA",
    method: "POST",
    url: "https://tabletki.ua/api/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },

  // ==================== REAL ESTATE & JOBS ====================
  {
    name: "Lun",
    category: "realestate",
    country: "UA",
    method: "POST",
    url: "https://api.lun.ua/api/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "DomRia",
    category: "realestate",
    country: "UA",
    method: "POST",
    url: "https://dom.ria.com/api/auth/sms",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Work.ua",
    category: "jobs",
    country: "UA",
    method: "POST",
    url: "https://www.work.ua/api/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Rabota.ua",
    category: "jobs",
    country: "UA",
    method: "POST",
    url: "https://rabota.ua/api/auth/send-code",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Djinni",
    category: "jobs",
    country: "UA",
    method: "POST",
    url: "https://djinni.co/api/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },

  // ==================== MEDIA & ENTERTAINMENT ====================
  {
    name: "Megogo",
    category: "media",
    country: "UA",
    method: "POST",
    url: "https://api.megogo.net/v1/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Sweet.tv",
    category: "media",
    country: "UA",
    method: "POST",
    url: "https://sweet.tv/api/auth/send-code",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Oll.tv",
    category: "media",
    country: "UA",
    method: "POST",
    url: "https://oll.tv/api/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },

  // ==================== TELECOM ====================
  {
    name: "Kyivstar",
    category: "telecom",
    country: "UA",
    method: "POST",
    url: "https://api.kyivstar.ua/auth/otp/send",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Vodafone UA",
    category: "telecom",
    country: "UA",
    method: "POST",
    url: "https://my.vodafone.ua/api/auth/otp",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Lifecell",
    category: "telecom",
    country: "UA",
    method: "POST",
    url: "https://my.lifecell.ua/api/auth/sms",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },

  // ==================== MESSENGERS & SOCIAL ====================
  {
    name: "Telegram",
    category: "messenger",
    country: "INTL",
    method: "POST",
    url: "https://my.telegram.org/auth/send_password",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: { phone: "{phone}" },
    successIndicator: "random_hash",
    formEncoded: true
  },
  {
    name: "Viber",
    category: "messenger",
    country: "INTL",
    method: "POST",
    url: "https://www.viber.com/api/auth/sms",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },

  // ==================== GOVERNMENT & UTILITIES ====================
  {
    name: "Diia",
    category: "government",
    country: "UA",
    method: "POST",
    url: "https://api.diia.gov.ua/api/v1/auth/send-otp",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "DTEK",
    category: "utilities",
    country: "UA",
    method: "POST",
    url: "https://my.dtek.com/api/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Kyivgaz",
    category: "utilities",
    country: "UA",
    method: "POST",
    url: "https://my.kyivgaz.ua/api/auth/sms",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },

  // ==================== TRAVEL & TICKETS ====================
  {
    name: "Tickets.ua",
    category: "travel",
    country: "UA",
    method: "POST",
    url: "https://tickets.ua/api/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Proizd",
    category: "travel",
    country: "UA",
    method: "POST",
    url: "https://proizd.ua/api/auth/send-code",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "Busfor",
    category: "travel",
    country: "UA",
    method: "POST",
    url: "https://busfor.ua/api/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },

  // ==================== FINANCE & PAYMENTS ====================
  {
    name: "Portmone",
    category: "payments",
    country: "UA",
    method: "POST",
    url: "https://www.portmone.com.ua/api/auth/sms",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "EasyPay",
    category: "payments",
    country: "UA",
    method: "POST",
    url: "https://easypay.ua/api/auth/phone",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  },
  {
    name: "iPay",
    category: "payments",
    country: "UA",
    method: "POST",
    url: "https://ipay.ua/api/auth/send-code",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" },
    successIndicator: "success"
  }
];

export const categories = {
  ecommerce: "E-Commerce & Retail",
  banking: "Banking & Finance",
  logistics: "Logistics & Delivery",
  taxi: "Taxi Services",
  delivery: "Food Delivery",
  food: "Food & Groceries",
  healthcare: "Healthcare",
  realestate: "Real Estate",
  jobs: "Jobs & Career",
  media: "Media & Entertainment",
  telecom: "Telecom",
  messenger: "Messengers",
  government: "Government",
  utilities: "Utilities",
  travel: "Travel & Tickets",
  payments: "Payments"
};

export const getServicesByCategory = (category) => {
  return services.filter(s => s.category === category);
};

export const getUkrainianServices = () => {
  return services.filter(s => s.country === "UA");
};

export default services;
