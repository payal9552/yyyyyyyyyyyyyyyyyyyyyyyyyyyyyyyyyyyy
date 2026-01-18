
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const key = process.env.VITE_GEMINI_API_KEY;
    console.log("Using Key:", key ? key.slice(-5) : "MISSING");

    if (!key) return;

    const genAI = new GoogleGenerativeAI(key);

    console.log("\n--- Attempting to list models (v1beta) ---");
    // There is no direct listModels on genAI client in some versions, 
    // but let's try to just hit a known model with v1beta

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1beta' });
        await model.generateContent("test");
        console.log("FOUND: gemini-1.5-flash (v1beta)");
    } catch (e) { console.log("gemini-1.5-flash (v1beta) failed:", e.message.split('[')[0]); }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }, { apiVersion: 'v1beta' });
        await model.generateContent("test");
        console.log("FOUND: gemini-pro (v1beta)");
    } catch (e) { console.log("gemini-pro (v1beta) failed:", e.message.split('[')[0]); }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" }, { apiVersion: 'v1' });
        await model.generateContent("test");
        console.log("FOUND: gemini-pro (v1)");
    } catch (e) { console.log("gemini-pro (v1) failed:", e.message.split('[')[0]); }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" }, { apiVersion: 'v1beta' });
        await model.generateContent("test");
        console.log("FOUND: gemini-1.0-pro (v1beta)");
    } catch (e) { console.log("gemini-1.0-pro (v1beta) failed:", e.message.split('[')[0]); }
}

listModels();
