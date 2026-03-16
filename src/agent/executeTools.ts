import { tools } from "./tools/index.ts";

export const executeTools = async (name: string, args: any) => {
  const tool = tools[name as keyof typeof tools];
  if (!tool) {
    return "Unknown tool, this not a valid tool";
  }
  const execute = await tool.execute;
  if (!execute) {
    return "This is not registered as a tool";
  }

  const result = await execute(args, {
    toolCallId: "",
    messages: [],
  });

  return String(result);
};
