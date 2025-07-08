import { BookDetailsClient } from '@/components/book-details-client';
import { Suspense } from 'react';

export default function BookDetailsPage() {
  return (
    <Suspense fallback={<div className="container py-8 text-center">Loading...</div>}>
      <BookDetailsClient />
    </Suspense>
  );
}
