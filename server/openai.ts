import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/* ---------------------------------------------
   CHATBOT RESPONSE (MAIN AI)
----------------------------------------------*/
export async function generateChatbotResponse(
  userMessage: string,
  context?: string
): Promise<string> {
  try {
    const systemPrompt = `
      You are Cosmic Assistant, an AI helper inside the Glimmer app — a romantic cosmic social world.
      You guide users through:
      • their Memory Orb Universe (memories as stars)
      • cosmic virtual pets
      • friendship streaks & emotional growth
      • multiplayer games and real-time chat
      
      Always be warm, magical, cosmic, supportive.
      Keep replies short and meaningful.
      ${context ? `Context: ${context}` : ""}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return completion.choices[0].message.content ?? 
      "✨ The cosmos is listening. What would you like to know? ✨";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "✨ I lost connection to the cosmic stream. Try again? ✨";
  }
}

/* ---------------------------------------------
   MEMORY INSIGHT
----------------------------------------------*/
export async function generateMemoryInsight(memories: any[]) {
  try {
    const formatted = JSON.stringify(memories.slice(0, 5));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Analyze user memories and respond ONLY in JSON: { insight: string, suggestion: string }",
        },
        {
          role: "user",
          content: `Analyze these memories: ${formatted}`,
        },
      ],
    });

    const data = JSON.parse(completion.choices[0].message.content || "{}");

    return {
      insight:
        data.insight ||
        "Your memories glitter across the cosmic sky in beautiful patterns.",
      suggestion:
        data.suggestion ||
        "Try adding a fresh memory today to nurture your constellation.",
    };
  } catch (error) {
    console.error("Memory insight error:", error);
    return {
      insight: "Your memories shine like distant stars.",
      suggestion: "Add a new memory orb to keep your universe growing.",
    };
  }
}

/* ---------------------------------------------
   PET INTERACTION
----------------------------------------------*/
export async function generatePetInteraction(pet: any, action: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You generate cute cosmic responses from a magical virtual pet. Keep it under 40 words.",
        },
        {
          role: "user",
          content: `Pet: ${pet.name} (${pet.species}), Level ${pet.level}, Mood ${pet.mood}. Action: ${action}`,
        },
      ],
      max_tokens: 100,
    });

    return (
      completion.choices[0].message.content ||
      "✨ Your cosmic companion wiggles with stardust joy! ✨"
    );
  } catch (error) {
    console.error("Pet interaction error:", error);
    return "✨ Your cosmic companion wiggles with stardust joy! ✨";
  }
}
