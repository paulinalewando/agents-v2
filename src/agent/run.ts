import "dotenv/config";
import { generateText, type ModelMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { getTracer, Laminar } from "@lmnr-ai/lmnr";
import { tools } from "./tools/index.ts";
import { SYSTEM_PROMPT } from "./system/prompt.ts";

import type { AgentCallbacks } from "../types.ts";

const MODEL_NAME = "gpt-5-mini";

const laminarApiKey =
  process.env.LMNR_PROJECT_API_KEY ?? process.env.LMNR_API_KEY;
if (laminarApiKey) {
  Laminar.initialize({ projectApiKey: laminarApiKey });
}

export async function runAgent(
  userMessage: string,
  conversationHistory: ModelMessage[],
  callbacks: AgentCallbacks
): Promise<any> {
  const { text } = await generateText({
    model: openai(MODEL_NAME),
    prompt: userMessage,
    system: SYSTEM_PROMPT,
    tools,
    ...(laminarApiKey && {
      experimental_telemetry: { isEnabled: true, tracer: getTracer() },
    }),
  });

  await Laminar.flush();

  console.log(text);
}
