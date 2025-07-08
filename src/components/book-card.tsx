import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Book } from '@/lib/types';

export function BookCard({ book }: { book: Book }) {
  const bookDetailsUrl = new URLSearchParams({
    title: book.title,
    author: book.author,
    description: book.description,
    coverImage: book.coverImage,
    ...(book.ageRange && { ageRange: book.ageRange }),
  });

  return (
    <Link href={`/search/book/${encodeURIComponent(book.title)}?${bookDetailsUrl.toString()}`} className="h-full">
      <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300 h-full">
        <CardHeader>
          <CardTitle className="line-clamp-2 h-14 font-headline">{book.title}</CardTitle>
          <CardDescription>by {book.author}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col space-y-4">
          <div className="aspect-[3/4] relative w-full">
            <Image
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              fill
              className="rounded-md object-cover border"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              data-ai-hint={book.aiHint}
            />
          </div>
          <p className="line-clamp-4 text-sm text-muted-foreground flex-grow">{book.description}</p>
          {book.ageRange && <Badge variant="outline" className="self-start">Age: {book.ageRange}</Badge>}
        </CardContent>
      </Card>
    </Link>
  );
}
