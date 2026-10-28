import { createOpenAI } from "@ai-sdk/openai";
import { NoObjectGeneratedError, Output, streamText } from "ai";
import { z } from "zod";

const RUN = "X-Lovable-AIG-Run-ID";
function runIdFetch() {
  let runId: string | undefined;
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers);
    if (runId && !headers.has(RUN)) headers.set(RUN, runId);
    const res = await fetch(input, { ...init, headers });
    runId ??= res.headers.get(RUN)?.trim() || undefined;
    return res;
  };
}

const schema = z.object({
  tables: z.array(z.object({
    label: z.string(),
    shape: z.enum(["round", "rect"]),
    x: z.number(), y: z.number(), w: z.number(), h: z.number(),
    seats: z.number(),
  })),
  features: z.array(z.object({
    type: z.enum(["stage", "dancefloor", "door", "bar", "wall", "other"]),
    label: z.string(),
    x: z.number(), y: z.number(), w: z.number(), h: z.number(),
  })),
});

const INSTRUCTIONS = `You are a venue-mapping vision system. Look at the photo of an event hall and reconstruct a top-down 2D floor plan.
Coordinate space: width 1000, height 700, origin top-left, as if viewed from above with the camera position at the bottom edge.
Detect every visible table (round or rectangular/long), estimate its seat count (chairs around it; default 8 for round, 6-10 for long), and place it proportionally.
Round tables: w = h between 90 and 140. Long tables: w 120-300, h 60-90. Keep tables inside the room and not overlapping.
Number tables "1","2","3"... left-to-right, front-to-back. Also detect stage, dance floor, entrance doors, bar if visible.
If the photo is not a room, return an empty tables list.`;

export async function analyzeVenuePhoto(dataUrl: string) {
  const apiKey = process.env['LOVABLE_API_KEY'];
  if (!apiKey) throw new Error("AI is not configured");
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch(),
  });
  const result = streamText({
    model: provider.responses("openai/gpt-6-astra"),
    instructions: INSTRUCTIONS,
    messages: [{ role: "user", content: [
      { type: "text", text: "Convert this venue photo into the floor plan." },
      { type: "image", image: new URL(dataUrl) },
    ] }],
    output: Output.object({ schema }),
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  try {
    return await result.output;
  } catch (e) {
    if (NoObjectGeneratedError.isInstance(e) && e.text) {
      try { return schema.parse(JSON.parse(e.text)); } catch { /* fallthrough */ }
    }
    throw e;
  }
}
