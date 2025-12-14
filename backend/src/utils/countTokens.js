import { encoding_for_model } from '@dqbd/tiktoken';

const encoders = new Map();

const getEncoderForModel = (model) => {
  if (!encoders.has(model)) {
    encoders.set(model, encoding_for_model(model));
  }

  return encoders.get(model);
};

export const countTokens = (model, text) => {
  if (typeof text !== 'string') {
    throw new TypeError('text must be a string');
  }

  const encoder = getEncoderForModel(model);
  return encoder.encode(text).length;
};
