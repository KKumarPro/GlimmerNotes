import { generateLocalReply, generateLocalMemoryInsight } from "./ollama";
import { generateFreeChatbotReply } from "./hf";
import { generateFreeMemoryInsight } from "./hf";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Which provider should we use? "gemini" or "openai"
const AI_PROVIDER = process.env.AI_PROVIDER || "openai";

// ---------- OPENAI CLIENT ----------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// ---------- GEMINI CLIENT (v1) ----------
let geminiModel: ReturnType<GoogleGenerativeAI["getGenerativeModel"]> | null = null;

if (process.env.GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // fast, cheap text model
  geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
}

// Helper: are we allowed to use Gemini?
function canUseGemini() {
  return AI_PROVIDER === "gemini" && !!geminiModel;
}

/* ===========================================================
   CHATBOT RESPONSE
=========================================================== */
export async function generateChatbotResponse(
  userMessage: string,
  context?: string
): Promise<string> {
  try {
    const prompt = `
You are Glimmer, a short warm assistant inside the Glimmer app.
Keep replies short, kind, and practical.
${context ? `Context: ${context}` : ""}

User: ${userMessage}
`.trim();

    const res = await fetch(
      `${process.env.OLLAMA_BASE_URL}/api/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "phi3:mini",
          prompt,
          stream: false,
        }),
      }
    );

    const text = await res.text();

    if (!text) {
      throw new Error("Empty response from Ollama");
    }

    let data: any;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Ollama returned non-JSON:", text);
      throw e;
    }

return data.response || "✨ I’m listening. Tell me more. ✨";

  } catch (err) {
    console.error("Local Ollama chatbot error:", err);
    return "✨ The stars are quiet right now. Try again shortly. ✨";
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
    return await generateLocalMemoryInsight(memories, process.env.OLLAMA_MODEL || "phi3:mini");
  } catch (error) {
    console.error("Memory insight (local) error:", error);
    return {
      insight: "Your memories glitter softly across time.",
      suggestion: "Share a new moment to brighten your constellation.",
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
    const basePrompt = `
Pet: ${pet.name} (${pet.species}), Level ${pet.level}, Mood: ${pet.mood}
Action: ${action}
    `.trim();

    if (canUseGemini()) {
      const prompt = `
Generate a short, cute, cosmic pet reaction under 40 words.

${basePrompt}
      `.trim();

      const result = await geminiModel!.generateContent(prompt);
      const text = result.response.text();
      return (
        text ||
        "✨ Your cosmic companion twinkles with stardust happiness! ✨"
      );
    }

    // Fallback: OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a magical cosmic pet reacting to your human's actions. Be cute, warm and sparkly. Keep it under 40 words.",
        },
        {
          role: "user",
          content: basePrompt,
        },
      ],
      max_tokens: 80,
    });

    return (
      completion.choices[0].message.content ||
      "✨ Your cosmic companion shimmers happily beside you. ✨"
    );
  } catch (error) {
    console.error("Pet interaction error:", error);
    return "✨ Your cosmic companion sparkles softly, staying close by. ✨";
  }
}
