'use server';
/**
 * @fileOverview Generates a book cover image using AI.
 *
 * - generateBookCover - A function that generates a book cover image.
 * - GenerateBookCoverInput - The input type for the generateBookCover function.
 * - GenerateBookCoverOutput - The return type for the generateBookCover function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookCoverInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  description: z.string().describe('A short description of the book.'),
});
export type GenerateBookCoverInput = z.infer<typeof GenerateBookCoverInputSchema>;

const GenerateBookCoverOutputSchema = z.object({
  coverImage: z.string().describe("The generated book cover image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
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
  async ({title, description}) => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A beautiful and imaginative children's book cover for a book titled '${title}'. The story is about: ${description}. The style should be vibrant, whimsical, and friendly, suitable for a children's book. Do not include any text or words on the cover. The illustration should fill the entire frame.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });
    
    if (!media?.url) {
      // Fallback to a placeholder if image generation fails
      return { coverImage: 'https://placehold.co/300x400.png' };
    }

    return { coverImage: media.url };
  }
);
