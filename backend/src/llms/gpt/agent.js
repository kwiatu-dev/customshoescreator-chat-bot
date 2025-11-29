import { createAgent } from "langchain";
import { tools } from "./tools.js";
import { gpt } from "./chat.js";

export const agent = createAgent({
    model: gpt,
    tools: tools
})