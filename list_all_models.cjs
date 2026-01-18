
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

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models?key=${key}`,
    method: 'GET'
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.models) {
                console.log("ALL MODELS FOUND:");
                json.models.forEach(m => {
                    console.log(`- ${m.name.replace('models/', '')} (${m.supportedGenerationMethods.join(',')})`);
                });
            } else {
                console.log("No models in response:", data);
            }
        } catch (e) {
            console.log("Parse Error");
        }
    });
});

req.end();
