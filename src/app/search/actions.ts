'use server';

import { aiBookFinder, AiBookFinderOutput } from '@/ai/flows/ai-book-finder';

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
