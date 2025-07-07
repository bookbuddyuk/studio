"use client";

import React, { useState, useTransition } from 'react';
import { Search, Sparkles, Frown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { BookCard } from '@/components/book-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { findBooksWithAi } from '@/app/search/actions';
import type { Book } from '@/lib/types';

const aiSearchSchema = z.object({
  description: z.string().min(10, "Please provide a more detailed description.").max(500),
});

const keywordSearchSchema = z.object({
  query: z.string().min(1, "Please enter a search term."),
});

const mockBooks: Book[] = [
    { title: "The Very Hungry Caterpillar", author: "Eric Carle", description: "A classic story about a caterpillar's journey to becoming a butterfly.", ageRange: "2-5", coverImage: "https://placehold.co/300x400.png", aiHint: "caterpillar book" },
    { title: "Where the Wild Things Are", author: "Maurice Sendak", description: "A boy named Max imagines a world of wild things.", ageRange: "4-8", coverImage: "https://placehold.co/300x400.png", aiHint: "monster book" },
    { title: "Goodnight Moon", author: "Margaret Wise Brown", description: "A soothing bedtime story saying goodnight to everything in the room.", ageRange: "1-4", coverImage: "https://placehold.co/300x400.png", aiHint: "moon book" },
    { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", description: "A young wizard discovers his magical heritage.", ageRange: "9-12", coverImage: "https://placehold.co/300x400.png", aiHint: "wizard book" },
];

export function SearchPageClient() {
  const [isPending, startTransition] = useTransition();
  const [aiResults, setAiResults] = useState<Book[] | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [keywordResults, setKeywordResults] = useState<Book[]>([]);

  const aiForm = useForm<z.infer<typeof aiSearchSchema>>({
    resolver: zodResolver(aiSearchSchema),
    defaultValues: { description: "" },
  });

  const keywordForm = useForm<z.infer<typeof keywordSearchSchema>>({
    resolver: zodResolver(keywordSearchSchema),
    defaultValues: { query: "" },
  });

  const handleAiSearch = (values: z.infer<typeof aiSearchSchema>) => {
    startTransition(async () => {
      setAiError(null);
      setAiResults(null);
      try {
        const result = await findBooksWithAi(values.description);
        if (result && result.suggestions) {
          const formattedResults: Book[] = result.suggestions.map(s => ({
            ...s,
            coverImage: `https://placehold.co/300x400.png`,
            aiHint: 'book cover'
          }));
          setAiResults(formattedResults);
        }
      } catch (error) {
        setAiError(error instanceof Error ? error.message : "An unknown error occurred.");
      }
    });
  };

  const handleKeywordSearch = (values: z.infer<typeof keywordSearchSchema>) => {
    const filteredBooks = mockBooks.filter(book => 
      book.title.toLowerCase().includes(values.query.toLowerCase()) ||
      book.author.toLowerCase().includes(values.query.toLowerCase())
    );
    setKeywordResults(filteredBooks);
  };
  
  return (
    <div className="container py-8">
      <Tabs defaultValue="keyword" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="keyword">Keyword Search</TabsTrigger>
          <TabsTrigger value="ai">AI Book Finder</TabsTrigger>
        </TabsList>
        <TabsContent value="keyword" className="mt-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-bold font-headline mb-4">Search the Database</h2>
            <Form {...keywordForm}>
              <form onSubmit={keywordForm.handleSubmit(handleKeywordSearch)} className="flex items-start gap-4">
                <FormField
                  control={keywordForm.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input placeholder="Search by title or author..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Results</h3>
            {keywordResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {keywordResults.map((book, index) => <BookCard key={`${book.title}-${index}`} book={book} />)}
                </div>
            ) : (
                <p className="text-muted-foreground">Enter a search term to find books. Try "Harry Potter".</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="ai" className="mt-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-bold font-headline mb-2">AI Book Finder</h2>
            <p className="text-muted-foreground mb-4">Describe the kind of book you're looking for, and our AI will find suggestions for you!</p>
            <Form {...aiForm}>
              <form onSubmit={aiForm.handleSubmit(handleAiSearch)} className="space-y-4">
                <FormField
                  control={aiForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="e.g., 'A funny story about talking animals for a 5-year-old'" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {isPending ? "Thinking..." : <><Sparkles className="mr-2 h-4 w-4" /> Find Books</>}
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">AI Suggestions</h3>
            {isPending && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-56 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ))}
              </div>
            )}
            {aiError && (
              <Alert variant="destructive">
                <Frown className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{aiError}</AlertDescription>
              </Alert>
            )}
            {aiResults && aiResults.length === 0 && (
                <p className="text-muted-foreground">The AI couldn't find any matches. Try a different description.</p>
            )}
            {aiResults && aiResults.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {aiResults.map((book, index) => <BookCard key={`${book.title}-${index}`} book={book} />)}
              </div>
            )}
            {!isPending && !aiResults && !aiError && (
                <p className="text-muted-foreground">Your AI-powered book suggestions will appear here.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
