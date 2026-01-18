
import { GoogleGenerativeAI } from "@google/generative-ai";
import { YouTubeVideo, PolicyAuditResult } from "./types";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const validateKey = () => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 20) {
    throw new Error('Gemini API Key is missing or invalid in your .env file. Please check VITE_GEMINI_API_KEY.');
  }
};

const getAIModel = (config?: any) => {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    ...config
  }, { apiVersion: 'v1beta' });
};


import { YOUTUBE_POLICIES, PROHIBITED_ACTIVITIES } from "./policyData";

export const generateVideoTranscript = async (video: YouTubeVideo, targetLang: string) => {
  validateKey();
  const prompt = `
        Based on the following video metadata, generate a possible voiceover script or detailed transcript for this video.
        Translate it to ${targetLang} language.
        
        Title: ${video.snippet.title}
        Description: ${video.snippet.description}
        Tags: ${video.snippet.tags?.join(', ')}
    `;

  const transcriptModel = getAIModel();
  const result = await transcriptModel.generateContent(prompt);
  return result.response.text();
};

export const auditVideoPolicy = async (video: YouTubeVideo, title: string, desc: string, tags: string[]): Promise<PolicyAuditResult> => {
  validateKey();

  const prompt = `
        Act as an Elite YouTube Policy Auditor. Audit the following video metadata against the 15 core YouTube Ecosystem Policies (Community Guidelines, Monetization, ToS, Copyright, YPP, API, Developer, Privacy, Ads, Live, Shorts, Contests, Spam/Scams, Election Integrity, Child Safety/COPPA).
        
        STRICTLY PROHIBITED: Paid watch, Bot traffic, Fake engagement (views/likes), Misleading earning apps, Automated scams.

        TASK:
        1. Examine Title, Description, and Tags for policy violations.
        2. Identify specific risks (e.g., deceptive metadata, spam, reused content).
        3. Provide 100% compliant, high-CTR SEO metadata recommendations.

        Return ONLY a JSON object:
        {
            "riskLevel": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
            "violations": ["list specific policy titles breached and reason"],
            "flaggedContent": [{ "text": "flagged part", "location": "Title/Desc/Tags", "reason": "Specific violation" }],
            "suggestedTitle": "SEO optimized compliant title",
            "suggestedDescription": "Safe SEO description",
            "suggestedTags": ["tag1", "tag2"],
            "policyReasoning": "Audit summary referencing relevant policies",
            "isPerfect": boolean,
            "videoMonetizationStatus": "ELIGIBLE" | "RESTRICTED" | "UNKNOWN"
        }

        METADATA:
        Current Title: ${title}
        Current Desc: ${desc}
        Current Tags: ${tags.join(', ')}
        Status: ${video.status ? JSON.stringify(video.status) : 'N/A'}
    `;

  const chatModel = getAIModel();
  try {
    const result = await chatModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2 }
    });
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Format error in AI response.");
    return JSON.parse(jsonMatch[0]);
  } catch (error: any) {
    console.error("Policy Audit Error:", error);
    if (error.message?.includes('RECITATION')) {
      throw new Error("Audit blocked by safety filter. Please use a more neutral title.");
    }
    // Show the actual error message to the user for debugging
    throw new Error(`Gemini Error: ${error.message || 'Unknown Error'}`);
  }
};

export const startAIChat = (context: string) => {
  validateKey();
  const chatModel = getAIModel();
  const chat = chatModel.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: `You are a YouTube Data Analyst. Here is the context about the channel/video we are discussing: ${context}` }],
      },
      {
        role: "model",
        parts: [{ text: "Understood. I'm ready to analyze this data and provide strategic insights. What would you like to know?" }],
      },
    ],
  });

  return {
    sendMessage: async ({ message }: { message: string }) => {
      const result = await chat.sendMessage(message);
      return { text: result.response.text() };
    }
  };
};


export const generateVideoIdeas = async (niche: string) => {
  validateKey();
  const prompt = `
        As a YouTube Content Strategist, generate 3 highly viral video ideas for the niche: "${niche}".
        For each idea, provide:
        1. "title": A click-worthy title.
        2. "concept": A brief explanation of the video flow.
        3. "thumbnailIdea": A description of how the thumbnail should look.
        4. "targetAudience": Who is this video for.
        
        Return ONLY a JSON array of 3 objects matching these keys.
    `;

  const chatModel = getAIModel();
  try {
    const result = await chatModel.generateContent(prompt);
    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Format error");
    return JSON.parse(jsonMatch[0]);
  } catch (err) {
    throw new Error("Ideas generator busy. Try again.");
  }
};
