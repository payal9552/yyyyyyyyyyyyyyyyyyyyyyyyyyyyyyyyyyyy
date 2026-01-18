
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testKey() {
    const key = "AIzaSyDDam_aixUQs72llCWwU-3a8KzPs74DF3g";
    const genAI = new GoogleGenerativeAI(key);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello?");
        console.log("SUCCESS: 1.5-flash is working.");
        console.log("Response:", result.response.text());
    } catch (e) {
        console.log("FAILURE: 1.5-flash error:", e.message);

        try {
            const model2 = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const result2 = await model2.generateContent("Hello?");
            console.log("SUCCESS: 2.0-flash is working.");
        } catch (e2) {
            console.log("FAILURE: 2.0-flash error:", e2.message);
        }
    }
}

testKey();
