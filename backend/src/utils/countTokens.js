import { encoding_for_model } from '@dqbd/tiktoken';

const encoders = new Map();

const getEncoder = (model) => {
  if (!encoders.has(model)) {
    encoders.set(model, encoding_for_model(model));
  }
  return encoders.get(model);
};

const countMessageTokens = (message, model) => {
  const encoder = getEncoder(model);
  let tokensPerMessage, tokensPerName;

  if (model.startsWith("gpt-3.5")) {
    tokensPerMessage = 4;
    tokensPerName = 1;
  } else if (model.startsWith("gpt-4")) {
    tokensPerMessage = 3;
    tokensPerName = 1;
  } else {
    throw new Error('')
  }

  let tokens = tokensPerMessage;
  tokens += encoder.encode(message.content ?? "").length;

  if (message.name) {
    tokens += tokensPerName;
  }

  return tokens;
};

export const countChatTokens = (messages, model) => {
  let total = 0;
  for (const msg of messages) {
    total += countMessageTokens(msg, model);
  }

  total += 3;
  return total;
};


export const estimateChatCost = (messages, model) => {
  const totalTokens = countChatTokens(messages, model);

  let costPer1k;
  if (model.startsWith("gpt-3.5")) {
    costPer1k = 0.002; 
  } else if (model.startsWith("gpt-4")) {
    costPer1k = 0.03; 
  } else {
    throw new Error('')
  }

  return {
    totalTokens,
    estimatedCostUSD: (totalTokens / 1000) * costPer1k,
  };
};
