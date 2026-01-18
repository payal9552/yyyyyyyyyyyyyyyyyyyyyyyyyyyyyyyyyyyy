
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

async function check(model) {
    const dataStr = JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] });
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/${model}:generateContent?key=${key}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };
    return new Promise((resolve) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                console.log(`--- ${model} ---`);
                console.log("Status:", res.statusCode);
                try {
                    const json = JSON.parse(body);
                    if (json.error) {
                        console.log("Error Message:", json.error.message);
                        if (json.error.details) {
                            console.log("Details:", JSON.stringify(json.error.details, null, 2));
                        }
                    } else {
                        console.log("SUCCESS!");
                    }
                } catch (e) { console.log("Body:", body); }
                resolve();
            });
        });
        req.write(dataStr);
        req.end();
    });
}

async function run() {
    await check("gemini-1.5-flash");
    await check("gemini-2.0-flash");
}

run();
