import "dotenv/config";
import { spawn } from "node:child_process";

if (!process.env.LMNR_PROJECT_API_KEY && process.env.LMNR_API_KEY) {
  process.env.LMNR_PROJECT_API_KEY = process.env.LMNR_API_KEY;
}

const code = await new Promise((resolve) => {
  const child = spawn("npx", ["lmnr", ...process.argv.slice(2)], {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  child.on("exit", (c) => resolve(c ?? 1));
  child.on("error", () => resolve(1));
});

process.exit(code);
