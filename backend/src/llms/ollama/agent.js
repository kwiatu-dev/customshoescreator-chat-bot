import { createAgent } from "langchain";
import { tools } from "./tools.js";
import { ollama } from "./chat.js";

export const agent = createAgent({
    model: ollama, 
    tools: tools
})