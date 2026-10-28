import { Ut as _enum, in as object, qt as array, rn as number, sn as string } from "../_libs/@ai-sdk/gateway+[...].mjs";
import { t as createOpenAI } from "../_libs/ai-sdk__openai+zod.mjs";
import { n as output_exports, r as streamText, t as NoObjectGeneratedError } from "../_libs/ai.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/venue.server-CjTakOub.js
var RUN = "X-Lovable-AIG-Run-ID";
function runIdFetch() {
	let runId;
	return async (input, init) => {
		const headers = new Headers(init?.headers);
		if (runId && !headers.has(RUN)) headers.set(RUN, runId);
		const res = await fetch(input, {
			...init,
			headers
		});
		runId ??= res.headers.get(RUN)?.trim() || void 0;
		return res;
	};
}
var schema = object({
	tables: array(object({
		label: string(),
		shape: _enum(["round", "rect"]),
		x: number(),
		y: number(),
		w: number(),
		h: number(),
		seats: number()
	})),
	features: array(object({
		type: _enum([
			"stage",
			"dancefloor",
			"door",
			"bar",
			"wall",
			"other"
		]),
		label: string(),
		x: number(),
		y: number(),
		w: number(),
		h: number()
	}))
});
var INSTRUCTIONS = `You are a venue-mapping vision system. Look at the photo of an event hall and reconstruct a top-down 2D floor plan.
Coordinate space: width 1000, height 700, origin top-left, as if viewed from above with the camera position at the bottom edge.
Detect every visible table (round or rectangular/long), estimate its seat count (chairs around it; default 8 for round, 6-10 for long), and place it proportionally.
Round tables: w = h between 90 and 140. Long tables: w 120-300, h 60-90. Keep tables inside the room and not overlapping.
Number tables "1","2","3"... left-to-right, front-to-back. Also detect stage, dance floor, entrance doors, bar if visible.
If the photo is not a room, return an empty tables list.`;
async function analyzeVenuePhoto(dataUrl) {
	const apiKey = processModule.env["LOVABLE_API_KEY"];
	if (!apiKey) throw new Error("AI is not configured");
	const provider = createOpenAI({
		baseURL: "https://ai.gateway.lovable.dev/v1",
		apiKey,
		headers: {
			"Lovable-API-Key": apiKey,
			"X-Lovable-AIG-SDK": "vercel-ai-sdk"
		},
		fetch: runIdFetch()
	});
	const result = streamText({
		model: provider.responses("openai/gpt-6-astra"),
		instructions: INSTRUCTIONS,
		messages: [{
			role: "user",
			content: [{
				type: "text",
				text: "Convert this venue photo into the floor plan."
			}, {
				type: "image",
				image: new URL(dataUrl)
			}]
		}],
		output: output_exports.object({ schema }),
		providerOptions: { openai: {
			forceReasoning: true,
			reasoningEffort: "low",
			reasoningSummary: "auto",
			store: false,
			include: ["reasoning.encrypted_content"]
		} }
	});
	try {
		return await result.output;
	} catch (e) {
		if (NoObjectGeneratedError.isInstance(e) && e.text) try {
			return schema.parse(JSON.parse(e.text));
		} catch {}
		throw e;
	}
}
//#endregion
export { analyzeVenuePhoto };
