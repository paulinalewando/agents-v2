import { readFile, writeFile, listFiles, deleteFile } from "./file.ts";

// All tools combined for the agent
export const tools = {
  readFile,
  writeFile,
  listFiles,
  deleteFile,
};

export { readFile, writeFile, listFiles, deleteFile } from "./file.ts";

export const fileTools = {
  readFile,
  writeFile,
  listFiles,
  deleteFile,
};
