
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

async function test_final() {
    const dataStr = JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] });
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-pro:generateContent?key=${key}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };
    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (d) => body += d);
        res.on('end', () => {
            console.log("STATUS:", res.statusCode);
            console.log("BODY:", body);
        });
    });
    req.write(dataStr);
    req.end();
}

test_final();
