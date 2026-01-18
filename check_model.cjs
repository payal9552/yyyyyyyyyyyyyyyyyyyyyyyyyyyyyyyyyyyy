
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const key = process.env.VITE_GEMINI_API_KEY || "AIzaSyDDam_aixUQs72llCWwU-3a8KzPs74DF3g";
    const genAI = new GoogleGenerativeAI(key);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Just a basic check, real list requires access to model manager which might not be exposed easily in this SDK version or requires different call.
        // Actually, the SDK has a way to verify but let's try a simple generation with v1beta

        console.log("Testing gemini-1.5-flash with v1beta...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1beta' });
        const resultFlash = await modelFlash.generateContent("Hi");
        console.log("Success with v1beta:", resultFlash.response.text());

    } catch (e) {
        console.log("Error:", e.message);
    }
}

listModels();
