
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
const pageToken = "CiRtb2RlbHMvdmVvLTMuMS1mYXN0LWdlbmVyYXRlLXByZXZpZXc=";

async function list() {
    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models?key=${key}&pageToken=${pageToken}`,
        method: 'GET'
    };
    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (d) => body += d);
        res.on('end', () => {
            fs.writeFileSync('model_list_page2.json', body);
            console.log("Written to model_list_page2.json");
        });
    });
    req.end();
}

list();
