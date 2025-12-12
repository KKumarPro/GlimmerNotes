// server/ollama.ts
export async function generateLocalReply(prompt: string, model = "phi3:mini", max_tokens = 120): Promise<string> {
  try {
    const body = {
      model,
      prompt,
      max_tokens,
      stream: false
    };

    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // no timeout here; leave to your runtime
    });

    // Read as text in case the server responds with NDJSON or newline-delimited JSON chunks.
    const raw = await res.text();

    // Try to parse the entire body as JSON first
    try {
      const parsed = JSON.parse(raw);
      // common shapes:
      // { response: "..." }  OR [{ response: "..." }]
      if (parsed) {
        if (typeof parsed === "string") return parsed;
        if (Array.isArray(parsed) && parsed[0] && parsed[0].response) return String(parsed[0].response).trim();
        if (parsed.response) return String(parsed.response).trim();
        if (parsed.generated_text) return String(parsed.generated_text).trim();
      }
    } catch {
      // not a single JSON chunk — continue to try NDJSON parsing below
    }

    // NDJSON or multiple JSON lines — pick the last JSON line that parses
    const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      try {
        const j = JSON.parse(line);
        if (j && (j.response || j.generated_text)) return String(j.response || j.generated_text).trim();
      } catch {
        // skip
      }
    }

    // fallback: return the raw text truncated
    return raw.slice(0, 1000);
  } catch (err: any) {
    console.error("Local Ollama error:", err?.message || err);
    return "Local chatbot is not available right now.";
  }
}

/**
 * Try to produce a JSON insight from memories using the local model.
 * The function returns { insight, suggestion }.
 */
export async function generateLocalMemoryInsight(memories: any[], model = "phi3:mini") {
  try {
    if (!memories || memories.length === 0) {
      return {
        insight: "No memories yet — your universe is waiting for its first star.",
        suggestion: "Add a small memory from today to begin your constellation.",
      };
    }

    const snippet = JSON.stringify(memories.slice(0, 6));
    const prompt = `Analyze these user memories and respond ONLY in JSON with keys "insight" and "suggestion".\n\nMemories: ${snippet}\n\nReturn strictly JSON only, for example: {"insight":"...","suggestion":"..."}`;

    const text = await generateLocalReply(prompt, model, 200);

    // Extract JSON block from model output
    const m = text.match(/\{[\s\S]*\}/);
    if (m) {
      try {
        const parsed = JSON.parse(m[0]);
        return {
          insight: String(parsed.insight || parsed.summary || "Your memories glitter softly across time."),
          suggestion: String(parsed.suggestion || parsed.recommendation || "Share another special moment to brighten your constellation."),
        };
      } catch (e) {
        // fallthrough
      }
    }

    // fallback
    return {
      insight: text.slice(0, 400),
      suggestion: "Share another special moment to brighten your constellation.",
    };
  } catch (err: any) {
    console.error("Local memory insight error:", err?.message || err);
    return {
      insight: "Your memories glitter softly across time.",
      suggestion: "Share a new moment to brighten your constellation.",
    };
  }
}
