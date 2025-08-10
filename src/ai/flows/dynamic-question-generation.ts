'use server';

/**
 * @fileOverview Dynamic question generation flow for onboarding new users.
 *
 * - generateFollowUpQuestions - A function that generates follow-up questions based on the user's initial answer and prior questions.
 * - GenerateFollowUpQuestionsInput - The input type for the generateFollowUpQuestions function.
 * - GenerateFollowUpQuestionsOutput - The return type for the generateFollowUpQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFollowUpQuestionsInputSchema = z.object({
  initialAnswer: z.string().describe('The user\'s initial answer to the onboarding question.'),
  priorQuestionsAndAnswers: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional()
    .describe('A list of prior questions and answers in the onboarding flow.'),
});
export type GenerateFollowUpQuestionsInput = z.infer<typeof GenerateFollowUpQuestionsInputSchema>;

const GenerateFollowUpQuestionsOutputSchema = z.object({
  questions: z.array(z.string()).describe('A list of 1 to 3 follow-up questions.'),
});
export type GenerateFollowUpQuestionsOutput = z.infer<typeof GenerateFollowUpQuestionsOutputSchema>;

export async function generateFollowUpQuestions(
  input: GenerateFollowUpQuestionsInput
): Promise<GenerateFollowUpQuestionsOutput> {
  return generateFollowUpQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFollowUpQuestionsPrompt',
  input: {schema: GenerateFollowUpQuestionsInputSchema},
  output: {schema: GenerateFollowUpQuestionsOutputSchema},
  prompt: `You are an expert shopping assistant. Your goal is to understand the user's needs by asking insightful follow-up questions. Based on the conversation so far, generate 1 to 3 new questions to get the most relevant information for finding the perfect product.

**Your Question Strategy:**
Your questions should be designed to uncover key information in these areas:

1.  **Purpose & Context:** Why does the user need this?
    *   *Example areas:* Is it for work, personal use, a gift, a specific hobby (like gaming, photography, sports)? Who is it for? Where will it be used?
2.  **Priorities & Preferences:** What are the most important factors for the user?
    *   *Example areas:* Is budget the top priority? Or is it quality, specific features, brand, durability, ease of use, or aesthetics?
3.  **Past Experiences:** What have they used before?
    *   *Example areas:* What did they like or dislike about previous products? Are they looking to upgrade from something specific? Are they loyal to any brands?

**Conversation History:**
*Initial Question:* "¿Qué te gustaría comprar hoy?"
*Initial Answer:* {{{initialAnswer}}}

{{#if priorQuestionsAndAnswers}}
*Follow-up Questions & Answers:*
{{#each priorQuestionsAndAnswers}}
Q: {{{this.question}}}
A: {{{this.answer}}}
{{/each}}
{{/if}}

**Your Task:**
- Generate a list of 1-3 new, non-repetitive, conversational questions based on the strategy above.
- Do not ask for information that has already been provided in the conversation history.
- Frame the questions in a friendly, natural way in Spanish.
- Return the questions as a JSON array of strings.

Example of a good question: *"¡Entendido! Y para este nuevo portátil, ¿qué es más importante para ti: la portabilidad para llevarlo a todos lados o la máxima potencia para tareas exigentes?"*
`,
});

const generateFollowUpQuestionsFlow = ai.defineFlow(
  {
    name: 'generateFollowUpQuestionsFlow',
    inputSchema: GenerateFollowUpQuestionsInputSchema,
    outputSchema: GenerateFollowUpQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
