import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({tooling: {search: {toolName: 'googleSearch'}}})],
  model: 'googleai/gemini-2.0-flash',
});
