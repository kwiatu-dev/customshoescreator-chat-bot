import { encoding_for_model } from '@dqbd/tiktoken/lite';
import baseEncoding from '@dqbd/tiktoken/encoders/cl100k_base.json';

const encoder = null;

export const countTokens = (model, text) => {
    if (!encoder) {
        encoder = encoding_for_model(model, baseEncoding)
    }

    return encoder.encode(text).length
}