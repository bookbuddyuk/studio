'use server';

/**
 * @fileOverview AI-powered book suggestion flow.
 *
 * - aiBookFinder - A function that suggests books based on user description.
 * - AiBookFinderInput - The input type for the aiBookFinder function.
 * - AiBookFinderOutput - The return type for the aiBookFinder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { generateBookCover } from './generate-book-cover';

const AiBookFinderInputSchema = z.object({
  description: z.string().describe('The description of the book the user is looking for (e.g., \"a book about animals for 5-year-olds\").'),
});
export type AiBookFinderInput = z.infer<typeof AiBookFinderInputSchema>;

const BookSuggestionTextOnlySchema = z.object({
    title: z.string().describe('The title of the suggested book.'),
    author: z.string().describe('The author of the suggested book.'),
    description: z.string().describe('A short description of the book.'),
    ageRange: z.string().describe('The age range the book is appropriate for.'),
});

const AiBookFinderOutputSchema = z.object({
  suggestions: z.array(
    BookSuggestionTextOnlySchema.extend({
        coverImage: z.string().describe("The book cover image URL.").optional(),
    })
  ).describe('An array of book suggestions based on the user input.'),
});
export type AiBookFinderOutput = z.infer<typeof AiBookFinderOutputSchema>;

export async function aiBookFinder(input: AiBookFinderInput): Promise<AiBookFinderOutput> {
  return aiBookFinderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiBookFinderPrompt',
  input: {schema: AiBookFinderInputSchema},
  output: {schema: z.object({suggestions: z.array(BookSuggestionTextOnlySchema)})},
  prompt: `You are a helpful assistant that suggests books based on a description provided by the user.

  The user is looking for books described as: {{{description}}}.

  Suggest books that match the description.  Include the title, author, a short description of the book, and the age range the book is appropriate for. Return the results as JSON.`, 
});

const aiBookFinderFlow = ai.defineFlow(
  {
    name: 'aiBookFinderFlow',
    inputSchema: AiBookFinderInputSchema,
    outputSchema: AiBookFinderOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output?.suggestions) {
      return { suggestions: [] };
    }

    const suggestionsWithCovers = await Promise.all(
      output.suggestions.map(async (suggestion) => {
        const { coverImage } = await generateBookCover({
          title: suggestion.title,
          author: suggestion.author,
          description: suggestion.description,
        });
        return { ...suggestion, coverImage };
      })
    );
    
    return { suggestions: suggestionsWithCovers };
  }
);
