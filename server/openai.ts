import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.AI_INTEGRATIONS_GOOGLE_GENERATIVE_AI_API_KEY || "default_key"
);

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are Cosmic Assistant for the Glimmer app." }],
        },
        {
          role: "model",
          parts: [{ text: "I understand! I'm your Cosmic Assistant for Glimmer. How can I help you today?" }],
        },
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text() || "I'm here to help! What would you like to know about Glimmer?";
  } catch (error) {
    console.error("Gemini API error:", error);
    return "I'm having trouble connecting to my cosmic wisdom right now. Please try again in a moment!";
  }
}

export async function generateMemoryInsight(memories: any[]): Promise<{
  insight: string;
  suggestion: string;
}> {
  try {
    const prompt = `Analyze these memories and provide a personalized insight and suggestion for creating new memories. 
    Respond with only a JSON object in this format: {"insight": "string", "suggestion": "string"}
    
    Memories: ${JSON.stringify(memories.slice(0, 5))}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return {
      insight: parsed.insight || "Your memories shine like stars across the cosmic void.",
      suggestion: parsed.suggestion || "Consider sharing a memory from today to keep your constellation growing!"
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
    const prompt = `Generate a short, cute response for a cosmic virtual pet interaction. Keep it under 50 words and maintain a magical/cosmic theme.
    
    Pet: ${petData.name} (${petData.species}, Level ${petData.level}, Mood: ${petData.mood})
    Action: ${action}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "✨ Your cosmic companion sparkles with joy! ✨";
  } catch (error) {
    console.error("Pet interaction error:", error);
    return "✨ Your cosmic companion sparkles with joy! ✨";
  }
}
