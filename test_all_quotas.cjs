
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
if (!key) process.exit(1);

async function testModel(modelName) {
    return new Promise((resolve) => {
        const dataStr = JSON.stringify({
            contents: [{ parts: [{ text: "Hi" }] }]
        });

        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/${modelName}:generateContent?key=${key}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': dataStr.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    console.log(`SUCCESS: ${modelName} is working!`);
                    resolve(true);
                } else {
                    try {
                        const json = JSON.parse(body);
                        console.log(`FAILED: ${modelName} - ${json.error.message}`);
                    } catch (e) {
                        console.log(`FAILED: ${modelName} - Status ${res.statusCode}`);
                    }
                    resolve(false);
                }
            });
        });
        req.on('error', (e) => {
            console.log(`ERROR: ${modelName} req - ${e.message}`);
            resolve(false);
        });
        req.write(dataStr);
        req.end();
    });
}

async function run() {
    await testModel("gemini-1.5-flash");
    await testModel("gemini-1.5-pro");
    await testModel("gemini-pro");
    await testModel("gemini-2.0-flash");
}

run();
