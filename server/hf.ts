import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_TOKEN || "");

export async function generateFreeChatbotReply(prompt: string) {
  try {
    const response = await hf.textGeneration({
      model: "google/flan-t5-small",
      inputs: prompt,
      parameters: {
        max_new_tokens: 60,
      },
    });

    // HF returns an object with generated_text
    return response.generated_text || "I'm here!";
  } catch (err: any) {
    console.error("HF Chatbot error:", err?.message || err);
    return "The free chatbot is busy right now. Try again!";
  }
}
