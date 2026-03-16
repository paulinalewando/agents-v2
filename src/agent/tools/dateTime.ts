import { tool } from "ai";
import { z } from "zod";

export const dateTimeTool = tool({
  description:
    "Returns the current date and time. Use this tool before making any other decisions.",
  inputSchema: z.object({}),
  execute: async () => {
    return new Date().toISOString();
  },
});
