import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      googleSearchTool: true,
    }),
  ],
  model: 'googleai/gemini-1.5-flash',
});
