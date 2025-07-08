"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { findBooksWithAi } from '@/app/search/actions';
import { BookCard } from '@/components/book-card';
import type { Book } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const aiSearchSchema = z.object({
  description: z.string().min(10, { message: 'Please describe the book in a little more detail.' }),
});

export function SearchPageClient() {
  const { toast } = useToast();
  const [isSearching, setIsSearching] = React.useState(false);
  const [results, setResults] = React.useState<Book[]>([]);

  const form = useForm<z.infer<typeof aiSearchSchema>>({
    resolver: zodResolver(aiSearchSchema),
    defaultValues: { description: '' },
  });

  const handleAiSearch = async (values: z.infer<typeof aiSearchSchema>) => {
    setIsSearching(true);
    setResults([]);
    try {
      const result = await findBooksWithAi(values.description);
      setResults(result.suggestions || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: error.message,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const renderResults = () => {
    if (isSearching) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
             <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (results.length > 0) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((book, index) => (
            <BookCard key={`${book.title}-${index}`} book={book} />
          ))}
        </div>
      );
    }

    return <p className="text-muted-foreground">Your AI-powered book suggestions will appear here.</p>;
  };

  return (
    <div className="container py-8">
      <div className="rounded-lg border bg-card p-6 shadow-sm mb-8">
        <h2 className="text-2xl font-bold font-headline mb-2">AI Book Finder</h2>
        <p className="text-muted-foreground mb-4">Describe the kind of book you're looking for, and our AI will find suggestions for you!</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAiSearch)} className="space-y-4">
            <FormField
              control={form.control}
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
            <Button type="submit" disabled={isSearching} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {isSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Find Books
            </Button>
          </form>
        </Form>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">AI Suggestions</h3>
        {renderResults()}
      </div>
    </div>
  );
}
