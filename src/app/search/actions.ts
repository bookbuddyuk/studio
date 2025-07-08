'use server';

import { aiBookFinder, AiBookFinderOutput } from '@/ai/flows/ai-book-finder';

export async function findBooksWithAi(description: string): Promise<AiBookFinderOutput> {
  if (!process.env.GOOGLE_GENAI_API_KEY || !process.env.GOOGLE_BOOKS_API_KEY) {
    throw new Error(
      'An API key is missing. Please make sure both GOOGLE_GENAI_API_KEY and GOOGLE_BOOKS_API_KEY are set in your .env file.'
    );
  }

  if (!description) {
    throw new Error('Description is required.');
  }
  try {
    const result = await aiBookFinder({ description });
    return result;
  } catch (error) {
    console.error('Error finding books with AI:', error);
    throw new Error('Failed to communicate with the AI. This could be due to an invalid API key or a network issue. Please try again later.');
  }
}
