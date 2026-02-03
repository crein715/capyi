# UASerials Plugin для Lampa

## Огляд

Цей плагін додає підтримку [UASerials.com](https://uaserials.com) — сайту з фільмами та серіалами українською мовою — до медіаплеєра [Lampa](https://github.com/yumata/lampa).

## Архітектура

### Файли
- `uaserials.js` — основний плагін
- `uaserials-loader.js` — завантажувач плагіна (для додавання через URL)

### Як працює плагін

1. **Пошук контенту**: Плагін шукає фільми/серіали на UASerials за назвою з TMDB
2. **Отримання даних**: Парсить HTML сторінки через CORS проксі
3. **Дешифрування**: Розшифровує зашифровані посилання на відео
4. **Відтворення**: Передає посилання на плеєр Lampa

## Технічні деталі

### CORS Проксі

UASerials блокує крос-доменні запити, тому використовується проксі:
```javascript
var PROXY = 'https://corsproxy.io/?';
```

**Альтернативні проксі** (якщо основний не працює):
- `https://api.allorigins.win/raw?url=`
- `https://cors-anywhere.herokuapp.com/`
- Власний проксі сервер

### Шифрування (AES)

UASerials шифрує посилання на відео за допомогою AES-256-CBC.

**Поточні параметри** (станом на лютий 2026):
```javascript
var AES_KEY = '297796CCB81D25512';

// Дешифрування
var salt = CryptoJS.enc.Hex.parse(data.salt);
var iv = CryptoJS.enc.Hex.parse(data.iv);

var key = CryptoJS.PBKDF2(AES_KEY, salt, {
    hasher: CryptoJS.algo.SHA512,
    keySize: 256 / 32,
    iterations: 999
});

var decrypted = CryptoJS.AES.decrypt(data.ciphertext, key, { iv: iv });
```

**⚠️ ВАЖЛИВО**: UASerials періодично змінює ключ шифрування!

### Як знайти новий ключ

1. Відкрити сторінку фільму на UASerials в браузері
2. Відкрити DevTools (F12) → Console
3. Ввести: `dd` або `console.log(dd)`
4. Це і є поточний AES ключ

**Або через Puppeteer:**
```javascript
const puppeteer = require('puppeteer');
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('https://uaserials.com/any-movie.html');
const key = await page.evaluate(() => dd);
console.log('AES Key:', key);
```

### Структура зашифрованих даних

На сторінці фільму є елемент `<player-control>` з атрибутом `data-tag1`:
```html
<player-control data-tag1='{"ciphertext":"...", "iv":"...", "salt":"..."}'>
```

- `ciphertext` — Base64 зашифрований JSON з посиланнями
- `iv` — Initialization Vector (hex)
- `salt` — Сіль для PBKDF2 (hex)

### Розшифрований формат

```json
[{
    "tabName": "Плеєр",
    "seasons": [{
        "title": "1 сезон",
        "episodes": [{
            "title": "1 серія",
            "sounds": [{
                "title": "Озвучка",
                "url": "https://tortuga.tw/vod/123456"
            }]
        }]
    }]
}]
```

## Типові проблеми

### "Відео не знайдено" (tortuga.tw)

**Причина**: tortuga.tw URLs (напр. `https://tortuga.tw/vod/123456`) потребують JavaScript для отримання реального m3u8 URL.

**Технічні деталі**:
- tortuga.tw сторінка виконує API запит для отримання відео URL
- Реальне відео на CDN: `https://calypso.tortuga.tw/content/stream/...`
- CORS проксі не виконує JavaScript

**Можливі рішення**:
1. Використати headless browser (Puppeteer) на сервері
2. Створити власний API proxy що резолвить URLs
3. Знайти альтернативний спосіб отримання m3u8

**Тимчасовий workaround**:
- Відкрити відео на uaserials.com в браузері
- В DevTools (F12) → Network → знайти `.m3u8` запит
- Скопіювати URL і вставити в Lampa вручну

### "Помилка розшифрування"

**Причина**: Змінився AES ключ на сайті.

**Рішення**: Знайти новий ключ (див. вище) та оновити `AES_KEY` в коді.

### "Нічого не знайдено"

**Можливі причини**:
1. CORS проксі не працює
2. UASerials змінив структуру HTML
3. Фільм/серіал відсутній на UASerials

**Діагностика**: Перевірити Console в DevTools на помилки.

### Кнопка не з'являється

**Причина**: Конфлікт з іншими плагінами або помилка в коді.

**Рішення**: Перевірити Console на JavaScript помилки.

## Lampa API

### Основні компоненти

```javascript
// Мережеві запити
var network = new Lampa.Reguest();
network.silent(url, callback, errorCallback);

// Навігація
Lampa.Activity.push({
    component: 'online_mod_uaserials',
    search: 'назва фільму',
    movie: movieObject
});

// Компоненти
Lampa.Component.add('component_name', componentFunction);

// Слухачі подій
Lampa.Listener.follow('full', function(e) {
    if (e.type == 'complite') {
        // Сторінка фільму завантажена
    }
});

// Локалізація
Lampa.Lang.add({
    key: { uk: 'Текст', ru: 'Текст', en: 'Text' }
});
```

### Кнопки на сторінці фільму

```javascript
// Знайти контейнер кнопок
var container = e.object.activity.render().find('.full-start__buttons');

// Додати кнопку першою
container.prepend(btn);

// Або перед існуючою
$('.full-start__button').first().before(btn);
```

## Деплой на GitHub Pages

1. Увімкнути Pages: Settings → Pages → Source: main branch
2. Після кожного push зачекати 1-2 хв на деплой
3. URL: `https://username.github.io/repo/file.js`

### Важливо
- Перший деплой вимагає commit після увімкнення Pages
- GitHub кешує файли — може бути затримка до 10 хв
- Додати `?v=123` до URL щоб обійти кеш

## Додавання плагіна в Lampa

URL для додавання:
```
https://crein715.github.io/capyi/uaserials-loader.js
```

Або повна версія:
```
https://crein715.github.io/capyi/uaserials.js
```

## Інші подібні сайти

При роботі з іншими сайтами перевірте:
1. Чи використовується шифрування
2. Який алгоритм (AES, інший)
3. Як передаються ключі/параметри
4. Формат відповіді (JSON, HTML parsing)

## Корисні інструменти

- **Puppeteer** — автоматизація браузера для отримання ключів
- **CryptoJS** — бібліотека для шифрування/дешифрування
- **DevTools** — дебаг JavaScript в браузері

## Контакти

Репозиторій: https://github.com/crein715/capyi
