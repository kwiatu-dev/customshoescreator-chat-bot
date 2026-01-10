import { mysqlPool } from './database.js'
import { SQLChatMessageHistory } from "langchain/stores/message/sql";
import { BufferMemory } from "langchain/memory";

const createMemory = (conversationId) => {
  const chatHistory = new SQLChatMessageHistory({
    sessionId: conversationId,
    pool: mysqlPool,
    tableName: "chat_messages",
  });

  return new BufferMemory({
    chatHistory,
    returnMessages: true,
    memoryKey: "chat_history",
    inputKey: "input",
  });
};

