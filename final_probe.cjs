
const https = require('https');
const fs = require('fs');
const path = require('path');

function getKey() {
    try {
        const envPath = path.join(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
        return match ? match[1].trim() : null;
    } catch (e) {
        return null;
    }
}

const key = getKey();

async function test(version, model) {
    return new Promise((resolve) => {
        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/${version}/models/${model}:generateContent?key=${key}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`[OK] ${version}/${model}`);
                } else {
                    try {
                        const json = JSON.parse(body);
                        console.log(`[ERR] ${version}/${model}: ${json.error.message}`);
                    } catch (e) { console.log(`[ERR] ${version}/${model}: ${res.statusCode}`); }
                }
                resolve();
            });
        });
        req.write(JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] }));
        req.end();
    });
}

async function run() {
    console.log("Starting final probe...");
    await test('v1', 'gemini-1.5-flash');
    await test('v1beta', 'gemini-1.5-flash');
    await test('v1beta', 'gemini-1.5-pro');
    await test('v1', 'gemini-pro');
    await test('v1beta', 'gemini-pro');
    await test('v1', 'gemini-1.0-pro');
    await test('v1beta', 'gemini-1.5-flash-8b');
    console.log("Probe finished.");
}

run();
