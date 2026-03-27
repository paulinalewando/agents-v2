import type {
  EvalData,
  SingleTurnResult,
  MultiTurnEvalData,
  MultiTurnResult,
} from "./types.ts";

import { generateText, stepCountIs, tool, type ToolSet } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { buildMessages } from "./utils.ts";

const TOOL_DEFINITIONS: any = {
  readFile: {
    description:
      "Read the contents of a file at the specified path. Use this to examine file contents.",
    parameters: z.object({
      path: z.string().describe("The path to the file to read"),
    }),
  },
  writeFile: {
    description:
      "Write the contents of a file at the specified path. Use this to write to files.",
    parameters: z.object({
      path: z.string().describe("The path to the file to write"),
      content: z.string().describe("The content to write to the file"),
    }),
  },
  listFiles: {
    description:
      "List all files and directories in the specified directory path.",
    parameters: z.object({
      directory: z.string().describe("The directory path to list contents of"),
    }),
  },
  deleteFile: {
    description:
      "Delete a file at the specified path. Use this to delete files.",
    parameters: z.object({
      path: z.string().describe("The path to the file to delete"),
    }),
  },
  runCommand: {
    description:
      "Execute a shell command and return its output. Use this for system operations.",
    parameters: z.object({
      command: z.string().describe("The shell command to execute"),
    }),
  },
};

export const singleTurnExecutorWithMocks = async (
  data: EvalData,
): Promise<SingleTurnResult> => {
  const messages = buildMessages(data);
  const tools: ToolSet = {};
  for (const toolName of data.tools) {
    const def = TOOL_DEFINITIONS[toolName as keyof typeof TOOL_DEFINITIONS];
    if (def) {
      tools[toolName] = tool({
        description: def.description,
        inputSchema: def.parameters,
      });
    }
  }

  const { toolCalls } = await generateText({
    model: openai("gpt-5-mini"),
    messages,
    tools,
    stopWhen: stepCountIs(1),
    temperature: data.config?.temperature ?? undefined,
  });

  const normalizedCalls: Array<{ toolName: string; args: unknown }> =
    toolCalls.map((call) => ({
      toolName: call.toolName,
      args: "args" in call ? call.args : undefined,
    }));

  const toolNames = normalizedCalls.map((call) => call.toolName);

  return {
    toolCalls: normalizedCalls,
    toolNames,
    selectedAny: toolNames.length > 0,
  };
};
