// server/hf.ts
import { HfInference } from "@huggingface/inference";

const HF_TOKEN = process.env.HF_TOKEN || process.env.HF_API_TOKEN || "";
const HF_MODEL = process.env.HF_MODEL || "gpt2";

const hf = new HfInference(HF_TOKEN);

/**
 * Generate a short text reply using HF text-generation.
 */
export async function generateFreeChatbotReply(prompt: string): Promise<string> {
  try {
    const resp: any = await hf.textGeneration({
      model: HF_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 80,
        do_sample: true,
        top_k: 50,
      },
    });

    // hf.textGeneration should return { generated_text: "..." } or similar
    if (resp && typeof resp.generated_text === "string") {
      return resp.generated_text.trim();
    }

    // Some clients return an array
    if (Array.isArray(resp) && resp[0] && typeof resp[0].generated_text === "string") {
      return resp[0].generated_text.trim();
    }

    return String(resp).slice(0, 400);
  } catch (err: any) {
    console.error("HF Chatbot error:", err?.message || err);
    return "The free chatbot is busy right now. Try again!";
  }
}

/**
 * Generate a JSON insight from memories using HF. Returns { insight, suggestion }.
 */
export async function generateFreeMemoryInsight(memories: any[]): Promise<{ insight: string; suggestion: string; }> {
  try {
    if (!memories || memories.length === 0) {
      return {
        insight: "No memories yet — your universe is waiting for its first star.",
        suggestion: "Add a small memory from today to begin your constellation.",
      };
    }

    // Keep prompt short — only include up to 6 memories
    const snippet = JSON.stringify(memories.slice(0, 6));
    const prompt = `Analyze these user memories and respond ONLY in JSON with keys "insight" and "suggestion".

Memories: ${snippet}

Return strictly JSON, for example:
{"insight":"...","suggestion":"..."}
`;

    const resp: any = await hf.textGeneration({
      model: HF_MODEL,
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        do_sample: false,
      },
    });

    let text = "";
    if (resp && typeof resp.generated_text === "string") text = resp.generated_text;
    else if (Array.isArray(resp) && resp[0] && resp[0].generated_text) text = resp[0].generated_text;
    else text = JSON.stringify(resp || "");

    // Extract first {...} JSON block from the model output
    const m = text.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        const parsed = JSON.parse(m[0]);
        return {
          insight: String(parsed.insight || parsed.summary || parsed.insights || "Your memories glitter softly across time."),
          suggestion: String(parsed.suggestion || parsed.recommendation || "Share a new moment to brighten your constellation."),
        };
      } catch (e) {
        // fallthrough to fallback text
      }
    }

    // fallback simple reply if parsing failed
    return {
      insight: text.slice(0, 300),
      suggestion: "Share another special moment to brighten your constellation.",
    };
  } catch (err: any) {
    console.error("HF Memory insight error:", err?.message || err);
    return {
      insight: "Your memories glitter softly across time.",
      suggestion: "Share a new moment to brighten your constellation.",
    };
  }
}
