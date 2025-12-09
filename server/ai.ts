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
  geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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
    if (canUseGemini()) {
      const prompt = `
You are Glimmer, a cosmic romantic assistant inside the Glimmer app.
Help with memories, pets, friendships, games and feelings.
Keep replies short, warm, magical, and practical.
${context ? `Context: ${context}` : ""}

User: ${userMessage}
      `.trim();

      const result = await geminiModel!.generateContent(prompt);
      const text = result.response.text();
      return text || "✨ The stars are listening. Tell me more. ✨";
    }

    // Default / fallback: OpenAI
    const systemPrompt = `
You are Glimmer, a cosmic romantic assistant inside the Glimmer app.
Help with memories, pets, friendships, and feelings.
Keep answers short, kind, and magical.
${context ? `Context: ${context}` : ""}
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return (
      completion.choices[0].message.content ??
      "✨ I’m listening among the stars. Tell me more. ✨"
    );
  } catch (error) {
    console.error("Chatbot error:", error);
    return "✨ My cosmic link glitched. Please try again in a moment. ✨";
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
    if (!memories.length) {
      return {
        insight: "No memories yet — your universe is waiting for its first star.",
        suggestion: "Add a small memory from today to begin your constellation.",
      };
    }

    const formatted = JSON.stringify(memories.slice(0, 5));

    if (canUseGemini()) {
      const prompt = `
Analyze these user memories and respond ONLY in JSON:

{
  "insight": string,
  "suggestion": string
}

Memories: ${formatted}
      `.trim();

      const result = await geminiModel!.generateContent(prompt);
      const text = result.response.text() || "{}";

      try {
        const parsed = JSON.parse(text);
        return {
          insight:
            parsed.insight ||
            "Your memories cluster into a gentle constellation of experiences.",
          suggestion:
            parsed.suggestion ||
            "Try adding a new memory about something that made you smile today.",
        };
      } catch {
        return {
          insight: "Your memories shimmer softly across your sky.",
          suggestion:
            "Share another special moment to brighten your constellation.",
        };
      }
    }

    // Fallback: OpenAI JSON response
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Analyze these memories and respond ONLY with JSON: { insight: string, suggestion: string }",
        },
        {
          role: "user",
          content: `Memories: ${formatted}`,
        },
      ],
    });

    const parsed = JSON.parse(completion.choices[0].message.content || "{}");

    return {
      insight:
        parsed.insight ||
        "Your memories cluster around a few bright emotional themes.",
      suggestion:
        parsed.suggestion ||
        "Try adding a new memory about something small but meaningful today.",
    };
  } catch (error) {
    console.error("Memory insight error:", error);
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
