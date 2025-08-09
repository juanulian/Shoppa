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
  questions: z.array(z.string()).describe('A list of 3-5 follow-up questions.'),
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
  prompt: `You are an AI assistant helping to onboard new users to a shopping application.
  Your goal is to generate 3-5 follow-up questions to better understand the user's purchase needs based on their initial answer and prior questions.

  Initial Answer: {{{initialAnswer}}}

  {{#if priorQuestionsAndAnswers}}
  Prior Questions and Answers:
  {{#each priorQuestionsAndAnswers}}
  Question: {{{this.question}}}
  Answer: {{{this.answer}}}
  {{/each}}
  {{/if}}

  Please generate a list of 3-5 follow-up questions that will help to determine the user's specific needs and preferences. Return the questions as a JSON array of strings.
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
