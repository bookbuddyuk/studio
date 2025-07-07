'use server';

import { aiBookFinder, AiBookFinderOutput } from '@/ai/flows/ai-book-finder';
import { randomBookFinder, RandomBookFinderInput, RandomBookFinderOutput } from '@/ai/flows/random-book-finder';
import type { Book } from '@/lib/types';

export async function findBooksWithAi(description: string): Promise<AiBookFinderOutput> {
  if (!description) {
    throw new Error('Description is required.');
  }
  try {
    // The AI flow is called here, which now includes image generation.
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

export async function searchBooksByKeyword(query: string): Promise<Book[]> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey) {
    console.error('Google Books API key is missing.');
    return [];
  }
  if (!query) {
    return [];
  }

  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=20&fields=items(volumeInfo(title,authors,description,imageLinks))`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Google Books API request failed with status ${response.status}`);
    }
    const data = await response.json();

    if (!data.items) {
        return [];
    }
    
    const placeholder = 'https://placehold.co/300x400.png';
    return data.items.map((item: any): Book => {
        const volumeInfo = item.volumeInfo || {};
        const imageLinks = volumeInfo.imageLinks || {};
        const coverImage = imageLinks.thumbnail || imageLinks.smallThumbnail || placeholder;

        return {
            title: volumeInfo.title || 'No Title',
            author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
            description: volumeInfo.description || 'No description available.',
            coverImage: coverImage.replace(/^http:/, 'https:'),
            aiHint: 'book cover',
        };
    });
  } catch (error) {
    console.error('Error searching books by keyword:', error);
    throw new Error('Failed to search for books. Please try again later.');
  }
}
