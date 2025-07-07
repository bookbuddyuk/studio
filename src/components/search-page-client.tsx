
"use client";

import React, { useState, useTransition } from 'react';
import { Search, Sparkles, Frown, Dices } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookCard } from '@/components/book-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { findBooksWithAi, findRandomBookWithAi, searchBooksByKeyword } from '@/app/search/actions';
import type { Book } from '@/lib/types';

const aiSearchSchema = z.object({
  description: z.string().min(10, "Please provide a more detailed description.").max(500),
});

const randomSearchSchema = z.object({
  category: z.string().min(1, "Please select a category."),
  genre: z.string().min(1, "Please select a genre."),
  readingAge: z.string().min(1, "Please select a reading age."),
});

const keywordSearchSchema = z.object({
  query: z.string().min(1, "Please enter a search term."),
});

const categories = ["Fiction", "Non-Fiction", "Picture Book", "Early Reader"];
const genres = ["Adventure", "Fantasy", "Science Fiction", "Mystery", "Humor", "Animals"];
const ageRanges = ["0-2 years", "3-5 years", "6-8 years", "9-12 years"];

const BookCardSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-12 w-3/4" />
    <Skeleton className="h-6 w-1/2" />
    <Skeleton className="aspect-[3/4] w-full" />
    <Skeleton className="h-20 w-full" />
  </div>
);

export function SearchPageClient() {
  const [isAiPending, startAiTransition] = useTransition();
  const [aiResults, setAiResults] = useState<Book[] | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const [isKeywordPending, startKeywordTransition] = useTransition();
  const [keywordResults, setKeywordResults] = useState<Book[] | null>(null);
  const [keywordError, setKeywordError] = useState<string | null>(null);

  const [isRandomPending, startRandomTransition] = useTransition();
  const [randomBookResult, setRandomBookResult] = useState<Book | null>(null);
  const [randomBookError, setRandomBookError] = useState<string | null>(null);

  const aiForm = useForm<z.infer<typeof aiSearchSchema>>({
    resolver: zodResolver(aiSearchSchema),
    defaultValues: { description: "" },
  });

  const randomForm = useForm<z.infer<typeof randomSearchSchema>>({
    resolver: zodResolver(randomSearchSchema),
    defaultValues: { category: "", genre: "", readingAge: "" },
  });

  const keywordForm = useForm<z.infer<typeof keywordSearchSchema>>({
    resolver: zodResolver(keywordSearchSchema),
    defaultValues: { query: "" },
  });

  const handleAiSearch = (values: z.infer<typeof aiSearchSchema>) => {
    startAiTransition(async () => {
      setAiError(null);
      setAiResults(null);
      try {
        const result = await findBooksWithAi(values.description);
        if (result && result.suggestions) {
          const formattedResults: Book[] = result.suggestions.map(s => ({
            ...s,
            coverImage: s.coverImage || `https://placehold.co/300x400.png`,
            aiHint: 'book cover'
          }));
          setAiResults(formattedResults);
        } else {
          setAiResults([]);
        }
      } catch (error) {
        setAiError(error instanceof Error ? error.message : "An unknown error occurred.");
      }
    });
  };

  const handleRandomSearch = (values: z.infer<typeof randomSearchSchema>) => {
    startRandomTransition(async () => {
      setRandomBookError(null);
      setRandomBookResult(null);
      try {
        const result = await findRandomBookWithAi(values);
        if (result) {
          const formattedResult: Book = {
            ...result,
            coverImage: result.coverImage || `https://placehold.co/300x400.png`,
            aiHint: 'book cover'
          };
          setRandomBookResult(formattedResult);
        } else {
          setRandomBookResult(null);
        }
      } catch (error) {
        setRandomBookError(error instanceof Error ? error.message : "An unknown error occurred.");
      }
    });
  };

  const handleKeywordSearch = (values: z.infer<typeof keywordSearchSchema>) => {
    startKeywordTransition(async () => {
      setKeywordError(null);
      setKeywordResults(null);
      try {
        const results = await searchBooksByKeyword(values.query);
        setKeywordResults(results);
      } catch (error) {
        setKeywordError(error instanceof Error ? error.message : "An unknown error occurred.");
      }
    });
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
                <Button type="submit" disabled={isKeywordPending}>
                  {isKeywordPending ? "Searching..." : <><Search className="mr-2 h-4 w-4" /> Search</>}
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Results</h3>
            {(() => {
              if (isKeywordPending) {
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => <BookCardSkeleton key={i} />)}
                  </div>
                );
              }
              if (keywordError) {
                return (
                  <Alert variant="destructive">
                    <Frown className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{keywordError}</AlertDescription>
                  </Alert>
                );
              }
              if (keywordResults === null) {
                return <p className="text-muted-foreground">Enter a search term to find books. Try "Harry Potter".</p>;
              }
              if (keywordResults.length === 0) {
                return <p className="text-muted-foreground">No books found for your search. Try different keywords.</p>;
              }
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {keywordResults.map((book, index) => <BookCard key={`${book.title}-${index}`} book={book} />)}
                </div>
              );
            })()}
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
                <Button type="submit" disabled={isAiPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {isAiPending ? "Thinking..." : <><Sparkles className="mr-2 h-4 w-4" /> Find Books</>}
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">AI Suggestions</h3>
            {(() => {
              if (isAiPending) {
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => <BookCardSkeleton key={i} />)}
                  </div>
                );
              }
              if (aiError) {
                return (
                  <Alert variant="destructive">
                    <Frown className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{aiError}</AlertDescription>
                  </Alert>
                );
              }
              if (aiResults === null) {
                return <p className="text-muted-foreground">Your AI-powered book suggestions will appear here.</p>;
              }
              if (aiResults.length === 0) {
                return <p className="text-muted-foreground">The AI couldn't find any matches. Try a different description.</p>;
              }
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {aiResults.map((book, index) => <BookCard key={`${book.title}-${index}`} book={book} />)}
                </div>
              );
            })()}
          </div>

          <div className="mt-8 rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-bold font-headline mb-2">Random Book Suggester</h2>
            <p className="text-muted-foreground mb-4">Can't decide? Let us pick a random book for you based on your preferences.</p>
            <Form {...randomForm}>
              <form onSubmit={randomForm.handleSubmit(handleRandomSearch)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={randomForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </Trigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={randomForm.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a genre" />
                            </Trigger>
                          </FormControl>
                          <SelectContent>
                            {genres.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={randomForm.control}
                    name="readingAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reading Age</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an age range" />
                            </Trigger>
                          </FormControl>
                          <SelectContent>
                            {ageRanges.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isRandomPending} className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {isRandomPending ? "Picking..." : <><Dices className="mr-2 h-4 w-4" /> Get Random Suggestion</>}
                </Button>
              </form>
            </Form>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Your Random Suggestion</h3>
            {(() => {
              if (isRandomPending) {
                return (
                  <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                    <BookCardSkeleton />
                  </div>
                );
              }
              if (randomBookError) {
                return (
                  <Alert variant="destructive">
                    <Frown className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{randomBookError}</AlertDescription>
                  </Alert>
                );
              }
              if (randomBookResult === null) {
                return <p className="text-muted-foreground">Your random book suggestion will appear here.</p>;
              }
              return (
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                  <BookCard book={randomBookResult} />
                </div>
              );
            })()}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
