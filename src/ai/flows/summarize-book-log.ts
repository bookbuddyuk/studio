'use server';
/**
 * @fileOverview Summarizes a student's reading log to understand their reading habits and preferences.
 *
 * - summarizeBookLog - A function that handles the summarization process.
 * - SummarizeBookLogInput - The input type for the summarizeBookLog function.
 * - SummarizeBookLogOutput - The return type for the summarizeBookLog function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeBookLogInputSchema = z.object({
  bookLog: z.string().describe('A detailed log of books read by the student, including titles, dates read, and any notes.'),
});
export type SummarizeBookLogInput = z.infer<typeof SummarizeBookLogInputSchema>;

const SummarizeBookLogOutputSchema = z.object({
  summary: z.string().describe('A summary of the student reading log, highlighting key reading habits and preferences.'),
});
export type SummarizeBookLogOutput = z.infer<typeof SummarizeBookLogOutputSchema>;

export async function summarizeBookLog(input: SummarizeBookLogInput): Promise<SummarizeBookLogOutput> {
  return summarizeBookLogFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeBookLogPrompt',
  input: {schema: SummarizeBookLogInputSchema},
  output: {schema: SummarizeBookLogOutputSchema},
  prompt: `You are an AI assistant helping teachers understand student reading habits.

  Summarize the following book log, highlighting the student's reading preferences, common themes, and any notable patterns.

  Book Log:
  {{bookLog}}`,
});

const summarizeBookLogFlow = ai.defineFlow(
  {
    name: 'summarizeBookLogFlow',
    inputSchema: SummarizeBookLogInputSchema,
    outputSchema: SummarizeBookLogOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
