import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {googleSearchTool} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({
    googleSearchTool: true,
  })],
  model: 'googleai/gemini-2.0-flash',
});
