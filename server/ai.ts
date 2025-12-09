import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// PICK PROVIDER
const PROVIDER = process.env.AI_PROVIDER || "openai";

// OPENAI CLIENT
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// GEMINI CLIENT
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// -------------------------------------
// GENERATE CHATBOT RESPONSE
// -------------------------------------
export async function generateChatbotResponse(
  message: string,
  context?: string
): Promise<string> {
  try {
    if (PROVIDER === "gemini") {
      return await generateGeminiChatResponse(message, context);
    } else {
      return await generateOpenAIChatResponse(message, context);
    }
  } catch (err) {
    console.error("AI Error:", err);
    return "✨ My cosmic connection glitched... try again!";
  }
}

// ----- OPENAI VERSION -----
async function generateOpenAIChatResponse(message: string, context?: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
          You are Glimmer Cosmic Assistant — magical, warm, romantic.
          Help the user navigate memories, pets, friendship, and the universe.
          Keep everything short, friendly, cosmic.
          ${context ? `Context: ${context}` : ""}
        `,
      },
      { role: "user", content: message },
    ],
    max_tokens: 200,
    temperature: 0.7,
  });

  return completion.choices[0].message.content!;
}

// ----- GEMINI VERSION -----
async function generateGeminiChatResponse(message: string, context?: string) {
  const systemPrompt = `
    You are Glimmer Cosmic Assistant — magical, warm, romantic.
    Help the user explore their cosmic memories, pets, friendships, and games.
    Keep replies short, friendly, and cosmic.
    ${context ? `Context: ${context}` : ""}
  `;

  const result = await geminiModel.generateContent([
    systemPrompt,
    `User: ${message}`,
  ]);

  return result.response.text();
}

// -------------------------------------
// MEMORY INSIGHT (works with BOTH)
// -------------------------------------
export async function generateMemoryInsight(memories: any[]) {
  const text = JSON.stringify(memories.slice(0, 5));

  if (PROVIDER === "gemini") {
    const result = await geminiModel.generateContent([
      "Analyze these memories in JSON format: {insight: string, suggestion: string}",
      text,
    ]);

    try {
      return JSON.parse(result.response.text());
    } catch {
      return {
        insight: "Your memories shimmer across the cosmos.",
        suggestion: "Add a new star (memory) to your universe today!",
      };
    }
  }

  // OpenAI fallback
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Analyze user memories and return JSON: { insight: string, suggestion: string }",
      },
      { role: "user", content: text },
    ],
  });

  return JSON.parse(completion.choices[0].message.content!);
}

// -------------------------------------
// PET INTERACTION (BOTH)
// -------------------------------------
export async function generatePetInteraction(pet: any, action: string) {
  const input = `
    Pet: ${pet.name} (${pet.species}), Level ${pet.level}, Mood ${pet.mood}
    Action: ${action}
  `;

  if (PROVIDER === "gemini") {
    const result = await geminiModel.generateContent([
      "Generate a cute cosmic pet response (max 40 words).",
      input,
    ]);

    return result.response.text();
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "Generate a magical cosmic pet response under 40 words.",
      },
      { role: "user", content: input },
    ],
  });

  return completion.choices[0].message.content!;
}
