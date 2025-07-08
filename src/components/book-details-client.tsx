'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export function BookDetailsClient() {
  const searchParams = useSearchParams();

  const title = searchParams.get('title');
  const author = searchParams.get('author');
  const description = searchParams.get('description');
  const coverImage = searchParams.get('coverImage');
  const ageRange = searchParams.get('ageRange');

  if (!title || !author || !description || !coverImage) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Could not load book details. Please go back and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Card>
        <CardContent className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="aspect-[3/4] relative w-full max-w-sm mx-auto">
                <Image
                src={coverImage}
                alt={`Cover of ${title}`}
                fill
                className="rounded-lg object-cover border shadow-lg"
                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 33vw, 25vw"
                data-ai-hint="book cover"
                />
            </div>
          </div>
          <div className="md:col-span-2 space-y-6">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold font-headline">{title}</h1>
                <p className="text-xl text-muted-foreground mt-1">by {author}</p>
            </div>
            {ageRange && (
                <Badge variant="secondary" className="text-base">
                    Appropriate for ages: {ageRange}
                </Badge>
            )}
            <div>
                <h2 className="text-xl font-semibold font-headline mb-2">Description</h2>
                <p className="text-foreground/80 leading-relaxed">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
