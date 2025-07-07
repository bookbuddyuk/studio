'use server';

/**
 * @fileOverview AI-powered random book suggestion flow.
 *
 * - randomBookFinder - A function that suggests a random book based on user criteria.
 * - RandomBookFinderInput - The input type for the randomBookFinder function.
 * - RandomBookFinderOutput - The return type for the randomBookFinder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RandomBookFinderInputSchema = z.object({
  category: z.string().describe('The category of the book (e.g., "Fiction", "Non-Fiction").'),
  genre: z.string().describe('The genre of the book (e.g., "Adventure", "Fantasy").'),
  readingAge: z.string().describe('The target age range for the book (e.g., "6-8").'),
});
export type RandomBookFinderInput = z.infer<typeof RandomBookFinderInputSchema>;

const RandomBookFinderOutputSchema = z.object({
  title: z.string().describe('The title of the suggested book.'),
  author: z.string().describe('The author of the suggested book.'),
  description: z.string().describe('A short description of the book.'),
  ageRange: z.string().describe('The age range the book is appropriate for.'),
});
export type RandomBookFinderOutput = z.infer<typeof RandomBookFinderOutputSchema>;

export async function randomBookFinder(input: RandomBookFinderInput): Promise<RandomBookFinderOutput> {
  return randomBookFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'randomBookFinderPrompt',
  input: {schema: RandomBookFinderInputSchema},
  output: {schema: RandomBookFinderOutputSchema},
  prompt: `You are a helpful assistant that suggests a random book for children.

  Suggest one single book that is in the genre '{{{genre}}}' and the category '{{{category}}}' and is appropriate for the age range '{{{readingAge}}}'.

  Do not suggest more than one book. Return the result as JSON.`,
});

const randomBookFinderFlow = ai.defineFlow(
  {
    name: 'randomBookFinderFlow',
    inputSchema: RandomBookFinderInputSchema,
    outputSchema: RandomBookFinderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
