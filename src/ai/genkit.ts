import {genkit} from 'genkit';
import {openAI} from 'genkitx-openai';

export const ai = genkit({
  plugins: [
    openAI({
      apiKey: process.env.OPENAI_API_KEY,
    }),
  ],
  model: 'openai/gpt-5-nano-2025-08-07',
});
