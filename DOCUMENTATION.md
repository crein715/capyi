# UASerials Plugin для Lampa

## Швидкий старт

**Додати в Lampa:**
```
https://crein715.github.io/capyi/uaserials.js
```

## Як працює

1. Шукає фільм/серіал на UASerials.com за назвою
2. Розшифровує AES-зашифровані посилання на відео
3. Декодує tortuga.tw URLs (base64 + reverse)
4. Відтворює m3u8 потік

---

## Два рівні шифрування

### 1. AES шифрування (UASerials)

Сторінка містить зашифровані дані:
```html
<player-control data-tag1='{"ciphertext":"...", "iv":"...", "salt":"..."}'>
```

**Дешифрування:**
```javascript
var AES_KEY = '297796CCB81D25512';  // Може змінитись!

var key = CryptoJS.PBKDF2(AES_KEY, salt, {
    hasher: CryptoJS.algo.SHA512,
    keySize: 256/32,
    iterations: 999
});
var decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv });
```

**Знайти новий ключ:** В консолі браузера на uaserials.com: `console.log(dd)`

### 2. Base64 + Reverse (tortuga.tw)

Після AES отримуємо URLs типу `tortuga.tw/vod/42769`.

Ця сторінка містить:
```javascript
new TortugaCore({
    file: "OHUzbS54ZWRuaS9zbGgvOTY3MjRfb3ZtLmljLjIwZTIwcy5zcmVkbmlsYi55a2FlcC9zbGFpcmVzL3NsaC93dC5hZ3V0cm90Lm9zcHlsYWMvLzpzcHR0aA===="
});
```

**Декодування:**
```javascript
function decodeTortugaUrl(encoded) {
    var decoded = atob(encoded.replace(/=+$/, ''));
    return decoded.split('').reverse().join('');
}
// Результат: https://calypso.tortuga.tw/hls/serials/peaky.blinders.s02e02.ci.mvo_42769/hls/index.m3u8
```

---

## Типові проблеми

| Помилка | Причина | Рішення |
|---------|---------|---------|
| "Помилка розшифрування" | Змінився AES ключ | Знайти новий: `console.log(dd)` |
| "Відео не знайдено" | CORS проксі блокує tortuga.tw | Спробувати інший проксі |
| "Нічого не знайдено" | Фільм відсутній на UASerials | — |
| Кнопка не з'являється | Помилка JS | Перевірити Console (F12) |

---

## Корисні команди

**Консоль браузера на uaserials.com:**
```javascript
// AES ключ
console.log(dd)

// Всі tortuga/calypso URLs
performance.getEntriesByType('resource')
  .filter(r => r.name.includes('tortuga') || r.name.includes('calypso'))
  .map(r => r.name)
```

**Тестовий скрипт** — @decrypt-test.js для дебагу без Lampa

---

## Структура проекту

```
capyi/
├── uaserials.js      # Основний плагін
├── uaserials-loader.js   # Завантажувач
├── decrypt-test.js   # Тестування дешифрування
└── DOCUMENTATION.md  # Ця документація
```

## CORS проксі

```javascript
var PROXY = 'https://corsproxy.io/?';
```

Альтернативи якщо не працює:
- `https://api.allorigins.win/raw?url=`
- Власний проксі

---

## Репозиторій

https://github.com/crein715/capyi
