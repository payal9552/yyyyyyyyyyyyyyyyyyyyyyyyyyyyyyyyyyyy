
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

async function testModel(modelName) {
    return new Promise((resolve) => {
        const body = JSON.stringify({ contents: [{ parts: [{ text: "echo 'READY'" }] }] });
        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/${modelName}:generateContent?key=${key}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (d) => data += d);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`[WORKING] ${modelName}`);
                    resolve(true);
                } else {
                    console.log(`[FAILED] ${modelName} (${res.statusCode})`);
                    resolve(false);
                }
            });
        });
        req.write(body);
        req.end();
    });
}

async function run() {
    const models = [
        "gemini-2.0-flash-lite",
        "gemini-2.0-flash",
        "gemini-2.5-flash",
        "gemini-flash-latest",
        "gemini-2.0-flash-exp",
        "gemini-3-flash-preview",
        "gemini-2.0-flash-001"
    ];

    for (const m of models) {
        const success = await testModel(m);
        if (success) {
            console.log(`--- SELECTION: ${m} ---`);
            break;
        }
    }
}

run();
