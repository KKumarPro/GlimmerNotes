import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("⚠️ GEMINI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

/* ===========================================================
   CHATBOT RESPONSE
=========================================================== */
export async function generateChatbotResponse(
  userMessage: string,
  context?: string
): Promise<string> {
  try {
    const prompt = `
You are Glimmer, a friendly and calm assistant inside the Glimmer app.
Keep replies short, helpful, and simple.
${context ? `Context: ${context}` : ""}

User: ${userMessage}
`.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text || "✨ I’m here. Tell me a little more. ✨";
  } catch (err) {
    console.error("Gemini chatbot error:", err);
    return "✨ The stars are quiet right now. Please try again shortly. ✨";
  }
}

/* ===========================================================
   MEMORY INSIGHT
=========================================================== */
export async function generateMemoryInsight(memories: any[]): Promise<{
  insight: string;
  suggestion: string;
}> {
  try {
    if (!memories || memories.length === 0) {
      return {
        insight:
          "No memories yet — your universe is waiting for its first star.",
        suggestion: "Add a small memory from today to begin your constellation.",
      };
    }

    const prompt = `
Analyze the following memories and respond ONLY in JSON:

{
  "insight": string,
  "suggestion": string
}

Memories:
${JSON.stringify(memories.slice(0, 5))}
`.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let parsed: any;
    try {
      parsed = JSON.parse(text);
    } catch {
      return {
        insight: "Your memories form a gentle constellation of experiences.",
        suggestion:
          "Add another meaningful moment to strengthen your constellation.",
      };
    }

    return {
      insight:
        parsed.insight ||
        "Your memories reflect meaningful moments across your journey.",
      suggestion:
        parsed.suggestion ||
        "Try capturing a small but meaningful moment today.",
    };
  } catch (err) {
    console.error("Gemini memory insight error:", err);
    return {
      insight: "Your memories shimmer quietly for now.",
      suggestion: "Try again later to explore deeper insights.",
    };
  }
}

/* ===========================================================
   PET INTERACTION
=========================================================== */
export async function generatePetInteraction(
  pet: any,
  action: string
): Promise<string> {
  try {
    const prompt = `
Pet: ${pet.name} (${pet.species})
Mood: ${pet.mood}
Action: ${action}

Respond with a short, cute reaction under 30 words.
`.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text || "✨ Your pet sparkles happily beside you. ✨";
  } catch (err) {
    console.error("Gemini pet error:", err);
    return "✨ Your pet wiggles happily. ✨";
  }
}
