import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { SYSTEM_TEMPLATE } from "../templates/system_template.js";

export const MAIN_PROMPT = ChatPromptTemplate.fromMessages([
  ["system", SYSTEM_TEMPLATE],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"]
]);