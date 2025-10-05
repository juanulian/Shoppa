import {genkit} from 'genkit';
import {openAI} from 'genkitx-openai';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    openAI({
      apiKey: process.env.OPENAI_API_KEY,
    }),
    googleAI(),
  ],
  model: 'openai/gpt-4o-mini',
});
