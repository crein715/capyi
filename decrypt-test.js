const crypto = require('crypto');
const https = require('https');
const http = require('http');

const AES_KEY = '297796CCB81D25512';

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Accept-Language': 'uk-UA,uk;q=0.9'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });
        req.on('error', reject);
        req.setTimeout(15000, () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

function decryptData(data) {
    try {
        const salt = Buffer.from(data.salt, 'hex');
        const iv = Buffer.from(data.iv, 'hex');
        const iterations = data.iterations || 999;
        
        const key = crypto.pbkdf2Sync(AES_KEY, salt, iterations, 32, 'sha512');
        
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(data.ciphertext, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        
        return JSON.parse(decrypted);
    } catch (e) {
        console.error('Decrypt error:', e.message);
        return null;
    }
}

function extractEncryptedBlocks(html) {
    const regex = /\{"ciphertext":"[^"]+","iv":"[a-f0-9]+","salt":"[a-f0-9]+"\}/g;
    const matches = html.match(regex) || [];
    return matches.map(m => {
        try {
            return JSON.parse(m);
        } catch (e) {
            return null;
        }
    }).filter(Boolean);
}

async function analyzeUASerialsPage(url) {
    console.log('Fetching:', url);
    
    try {
        const html = await fetchUrl(url);
        console.log('Page size:', html.length, 'bytes');
        
        const encryptedBlocks = extractEncryptedBlocks(html);
        console.log('Found', encryptedBlocks.length, 'encrypted blocks\n');
        
        for (let i = 0; i < encryptedBlocks.length; i++) {
            console.log(`\n=== Block ${i + 1} ===`);
            const block = encryptedBlocks[i];
            console.log('IV:', block.iv);
            console.log('Salt length:', block.salt.length);
            console.log('Ciphertext length:', block.ciphertext.length);
            
            const decrypted = decryptData(block);
            if (decrypted) {
                console.log('\nDecrypted structure:');
                console.log(JSON.stringify(decrypted, null, 2).substring(0, 3000));
                
                if (Array.isArray(decrypted)) {
                    decrypted.forEach((item, idx) => {
                        if (item.file) console.log(`\nItem ${idx} file:`, item.file);
                        if (item.url) console.log(`Item ${idx} url:`, item.url);
                        if (item.folder) {
                            console.log(`\nItem ${idx} has folder with`, item.folder.length, 'items');
                            item.folder.forEach((f, fi) => {
                                if (f.file) console.log(`  Folder item ${fi} file:`, f.file.substring(0, 200));
                                if (f.folder) console.log(`  Folder item ${fi} has nested folder`);
                            });
                        }
                    });
                }
            } else {
                console.log('Failed to decrypt');
            }
        }
        
        const tortugaMatches = html.match(/tortuga\.tw[^"'\s]*/g) || [];
        const calypsoMatches = html.match(/calypso\.tortuga\.tw[^"'\s]*/g) || [];
        
        if (tortugaMatches.length) {
            console.log('\n=== Tortuga URLs found ===');
            [...new Set(tortugaMatches)].slice(0, 10).forEach(u => console.log(u));
        }
        if (calypsoMatches.length) {
            console.log('\n=== Calypso URLs found ===');
            [...new Set(calypsoMatches)].slice(0, 10).forEach(u => console.log(u));
        }
        
    } catch (e) {
        console.error('Error:', e.message);
    }
}

const url = process.argv[2] || 'https://uaserials.com/840-gostri-kartuzi.html';
analyzeUASerialsPage(url);
