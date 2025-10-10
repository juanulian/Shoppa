import {genkit} from 'genkit';
import {openAI} from 'genkitx-openai';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI(),
    openAI({
      apiKey: process.env.OPENAI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.5-pro',
});
