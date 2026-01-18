
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
console.log("Testing Key:", key);

if (!key) {
    console.error("Key not found");
    process.exit(1);
}

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models?key=${key}`,
    method: 'GET'
};

const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log("Status:", res.statusCode);
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.log("API Error:", json.error.message);
            } else if (json.models) {
                console.log("SUCCESS! Available Models:");
                json.models.forEach(m => console.log(m.name));
            } else {
                console.log("Unexpected response:", data);
            }
        } catch (e) {
            console.log("Raw Body:", data);
        }
    });
});

req.on('error', (e) => {
    console.error("Request Error:", e);
});

req.end();
