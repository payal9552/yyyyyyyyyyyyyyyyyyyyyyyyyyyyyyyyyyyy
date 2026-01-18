
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function testKey() {
    const key = process.env.VITE_GEMINI_API_KEY;
    console.log("Testing Key Ending in:", key.slice(-5));

    const genAI = new GoogleGenerativeAI(key);

    // Test 1.5-flash
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }, { apiVersion: 'v1beta' });
        const result = await model.generateContent("Hello?");
        console.log("SUCCESS: gemini-1.5-flash is working with v1beta.");
    } catch (e) {
        console.log("FAILURE: gemini-1.5-flash error:", e.message);
    }
}

testKey();
