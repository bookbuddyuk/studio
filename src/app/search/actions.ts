'use server';

import { aiBookFinder, AiBookFinderOutput } from '@/ai/flows/ai-book-finder';
import { randomBookFinder, RandomBookFinderInput, RandomBookFinderOutput } from '@/ai/flows/random-book-finder';

export async function findBooksWithAi(description: string): Promise<AiBookFinderOutput> {
  if (!description) {
    throw new Error('Description is required.');
  }
  try {
    // The AI flow is called here.
    const result = await aiBookFinder({ description });
    return result;
  } catch (error) {
    console.error('Error finding books with AI:', error);
    // Customize the error message returned to the client for security and clarity.
    throw new Error('Failed to communicate with the AI. Please try again later.');
  }
}

export async function findRandomBookWithAi(input: RandomBookFinderInput): Promise<RandomBookFinderOutput> {
  if (!input.category || !input.genre || !input.readingAge) {
    throw new Error('Category, genre, and reading age are required.');
  }
  try {
    const result = await randomBookFinder(input);
    return result;
  } catch (error) {
    console.error('Error finding random book with AI:', error);
    throw new Error('Failed to communicate with the AI for a random suggestion. Please try again later.');
  }
}
