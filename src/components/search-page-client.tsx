
"use client";

import React from 'react';
import { Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function SearchPageClient() {
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
            <div className="flex items-start gap-4">
              <div className="flex-grow">
                <Input placeholder="Search by title or author..." />
              </div>
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Results</h3>
            <p className="text-muted-foreground">Enter a search term to find books. Try "Harry Potter".</p>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-2xl font-bold font-headline mb-2">AI Book Finder</h2>
            <p className="text-muted-foreground mb-4">Describe the kind of book you're looking for, and our AI will find suggestions for you!</p>
            <div className="space-y-4">
              <div>
                <Textarea placeholder="e.g., 'A funny story about talking animals for a 5-year-old'" />
              </div>
              <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Sparkles className="mr-2 h-4 w-4" /> Find Books
              </Button>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">AI Suggestions</h3>
            <p className="text-muted-foreground">Your AI-powered book suggestions will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
