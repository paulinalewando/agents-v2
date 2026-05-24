import { openai } from "@ai-sdk/openai";
import { z } from "zod";

export const webSearch = openai.tools.webSearch({});
