
require('dotenv').config();

async function checkModels() {
    const key = process.env.VITE_GEMINI_API_KEY;
    console.log("Checking Key:", key ? "..." + key.slice(-5) : "MISSING");

    if (!key) return;

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", JSON.stringify(data.error, null, 2));
        } else {
            console.log("Available Models:");
            if (data.models) {
                data.models.forEach(m => console.log(`- ${m.name}`));
            } else {
                console.log("No models returned (empty list).");
            }
        }
    } catch (error) {
        console.error("Network Error:", error.message);
    }
}

checkModels();
