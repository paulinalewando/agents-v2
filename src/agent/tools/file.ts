import { tool } from "ai";
import { z } from "zod";
import fs from "node:fs/promises";
import nodePath from "node:path";

export const readFile = tool({
  description:
    "Read the full contents of a file at the specified path, always use this to read files",
  inputSchema: z.object({
    path: z.string().describe("The path to the file to read"),
  }),
  execute: async ({ path }: { path: string }) => {
    try {
      const content = await fs.readFile(path, "utf8");
      return content;
    } catch (error) {
      return `Error reading file ${path}: ${error}`;
    }
  },
});

export const writeFile = tool({
  description:
    "Write the contents of a file at the specified path. Create the file if it doesn't exist and will overwrite the file if it does exist.",
  inputSchema: z.object({
    path: z.string().describe("The path to the file to write"),
    content: z.string().describe("The content to write to the file"),
  }),
  execute: async ({ path, content }: { path: string; content: string }) => {
    try {
      const dir = nodePath.dirname(path);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path, content, "utf8");
      return `Successfully wrote ${content.length} characters to ${path}`;
    } catch (error) {
      return `Error writing file ${path}: ${error}`;
    }
  },
});

export const listFiles = tool({
  description:
    "List all files and directories in the specified directory path.",
  inputSchema: z.object({
    directory: z
      .string()
      .describe("The directory path to list contents of")
      .default("."),
  }),
  execute: async ({ directory }: { directory: string }) => {
    try {
      const files = await fs.readdir(directory, { withFileTypes: true });
      const fileItems = files.map((entry) => {
        const type = entry.isDirectory() ? "[dir]" : "[file]";
        return `${type} ${entry.name}`;
      });

      return fileItems.length > 0
        ? fileItems.join("\n")
        : `No files or directories found in ${directory}`;
    } catch (error) {
      return `Error listing files in directory ${directory}: ${error}`;
    }
  },
});

export const deleteFile = tool({
  description:
    "Delete a file at the specified path. Use with caution as this is irreversible.",
  inputSchema: z.object({
    path: z.string().describe("The path to the file to delete"),
  }),
  execute: async ({ path }: { path: string }) => {
    try {
      await fs.unlink(path);
      return `Successfully deleted ${path}`;
    } catch (error) {
      return `Error deleting file ${path}: ${error}`;
    }
  },
});
