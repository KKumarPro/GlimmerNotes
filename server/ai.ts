import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// We will only use Gemini inside functions (no crash on boot)
const AI_PROVIDER = process.env.AI_PROVIDER || "openai";

// ---------------- CHATBOT ----------------
export async function generateChatbotResponse(
  userMessage: string,
  context?: string
): Promise<string> {
  try {
    if (AI_PROVIDER === "gemini" && process.env.GEMINI_API_KEY) {
      // Use Gemini
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `
You are Glimmer, a cosmic romantic assistant inside the Glimmer app.
Keep replies short, warm, magical, and helpful.
${context ? `Context: ${context}` : ""}

User: ${userMessage}
      `.trim();

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return text || "✨ The stars are quiet... try again? ✨";
    }

    // Default: OpenAI
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
      completion.choices[0].message.content ||
      "✨ I’m listening among the stars. Tell me more. ✨"
    );
  } catch (error) {
    console.error("Chatbot error:", error);
    return "✨ My cosmic link glitched. Please try again in a moment. ✨";
  }
}

// ---------------- MEMORY INSIGHT ----------------
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

    // If Gemini is configured, use it
    if (AI_PROVIDER === "gemini" && process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `
Analyze these memories and return ONLY JSON in this shape:
{
  "insight": string,
  "suggestion": string
}

Memories: ${formatted}
      `.trim();

      const result = await model.generateContent(prompt);
      const text = result.response.text() || "{}";

      try {
        const parsed = JSON.parse(text);
        return {
          insight:
            parsed.insight ||
            "Your memories cluster into a gentle constellation of feelings.",
          suggestion:
            parsed.suggestion ||
            "Try adding a new memory about something that made you smile today.",
        };
      } catch {
        // If parsing fails, fallback
        return {
          insight: "Your memories shimmer softly across your sky.",
          suggestion:
            "Share another special moment to brighten your constellation.",
        };
      }
    }

    // Default: OpenAI
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

// ---------------- PET INTERACTION ----------------
export async function generatePetInteraction(
  pet: any,
  action: string
): Promise<string> {
  try {
    const basePrompt = `
Pet: ${pet.name} (${pet.species}), Level ${pet.level}, Mood: ${pet.mood}
Action: ${action}
    `.trim();

    // Use Gemini if configured
    if (AI_PROVIDER === "gemini" && process.env.GEMINI_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(`
Generate a short, cute, cosmic pet reaction under 40 words.

${basePrompt}
      `.trim());

      return (
        result.response.text() ||
        "✨ Your cosmic companion twinkles with stardust happiness! ✨"
      );
    }

    // Default: OpenAI
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
