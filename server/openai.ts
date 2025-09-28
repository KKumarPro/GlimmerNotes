import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function generateChatbotResponse(userMessage: string, context?: string): Promise<string> {
  try {
    const systemPrompt = `You are Cosmic Assistant, an AI helper for the Glimmer app - a romantic cosmic social platform. 
    You help users navigate features like:
    - Memory Orb Universe (sharing memories as stars)
    - Virtual Pet Care (cosmic pets that grow with friendship)
    - Real-time Chat and multiplayer games
    - Friendship streaks and connections
    
    Be helpful, friendly, and maintain the cosmic/romantic theme. Keep responses concise and actionable.
    ${context ? `Context: ${context}` : ''}`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
    });

    return response.choices[0].message.content || "I'm here to help! What would you like to know about Glimmer?";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "I'm having trouble connecting to my cosmic wisdom right now. Please try again in a moment!";
  }
}

export async function generateMemoryInsight(memories: any[]): Promise<{
  insight: string;
  suggestion: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "Analyze user memories and provide a personalized insight and suggestion for creating new memories. Respond with JSON in this format: { 'insight': string, 'suggestion': string }"
        },
        {
          role: "user",
          content: `Analyze these memories: ${JSON.stringify(memories.slice(0, 5))}`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return {
      insight: result.insight || "Your memories shine like stars across the cosmic void.",
      suggestion: result.suggestion || "Consider sharing a memory from today to keep your constellation growing!"
    };
  } catch (error) {
    console.error("Memory insight error:", error);
    return {
      insight: "Your memories create a beautiful constellation of experiences.",
      suggestion: "Share a special moment to add another star to your universe!"
    };
  }
}

export async function generatePetInteraction(petData: any, action: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "Generate a short, cute response for a cosmic virtual pet interaction. Keep it under 50 words and maintain a magical/cosmic theme."
        },
        {
          role: "user",
          content: `Pet: ${petData.name} (${petData.species}, Level ${petData.level}, Mood: ${petData.mood}). Action: ${action}`
        }
      ],
    });

    return response.choices[0].message.content || "✨ Your cosmic companion sparkles with joy! ✨";
  } catch (error) {
    console.error("Pet interaction error:", error);
    return "✨ Your cosmic companion sparkles with joy! ✨";
  }
}
