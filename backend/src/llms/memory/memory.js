import { pool } from './database.js'
import { PostgresChatMessageHistory } from "@langchain/community/stores/message/postgres";
import { BufferMemory } from "@langchain/classic/memory";

export const createMemory = (conversationId) => {
  const chatHistory = new PostgresChatMessageHistory({
    sessionId: conversationId,
    pool: pool,
    tableName: "chat_messages",
  });

  return new BufferMemory({
    chatHistory,
    returnMessages: true,
    memoryKey: "chat_history",
    inputKey: "input",
  });
};

