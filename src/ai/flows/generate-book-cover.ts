'use server';
/**
 * @fileOverview Fetches a book cover image from the Google Books API.
 *
 * - generateBookCover - A function that gets a book cover image.
 * - GenerateBookCoverInput - The input type for the generateBookCover function.
 * - GenerateBookCoverOutput - The return type for the generateBookCover function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookCoverInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  author: z.string().describe('The author of the book.'),
  description: z.string().describe('A short description of the book (not used for cover search).'),
});
export type GenerateBookCoverInput = z.infer<typeof GenerateBookCoverInputSchema>;

const GenerateBookCoverOutputSchema = z.object({
  coverImage: z.string().describe("The book cover image URL from Google Books or a placeholder."),
});
export type GenerateBookCoverOutput = z.infer<typeof GenerateBookCoverOutputSchema>;

export async function generateBookCover(input: GenerateBookCoverInput): Promise<GenerateBookCoverOutput> {
  return generateBookCoverFlow(input);
}

const generateBookCoverFlow = ai.defineFlow(
  {
    name: 'generateBookCoverFlow',
    inputSchema: GenerateBookCoverInputSchema,
    outputSchema: GenerateBookCoverOutputSchema,
  },
  async ({title, author}) => {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const placeholder = 'https://placehold.co/300x400.png';

    if (!apiKey) {
      console.error('Google Books API key is missing.');
      return { coverImage: placeholder };
    }

    const query = encodeURIComponent(`intitle:${title}+inauthor:${author}`);
    const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}&fields=items(volumeInfo/imageLinks)`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Google Books API request failed with status ${response.status}`);
      }
      const data = await response.json();

      const imageLinks = data.items?.[0]?.volumeInfo?.imageLinks;
      const coverUrl = imageLinks?.thumbnail || imageLinks?.smallThumbnail;
      
      if (coverUrl) {
         return { coverImage: coverUrl.replace(/^http:/, 'https:') };
      }
    } catch (error) {
      console.error('Error fetching book cover from Google Books:', error);
    }
    
    return { coverImage: placeholder };
  }
);
