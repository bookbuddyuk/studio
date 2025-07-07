import { SearchPageClient } from '@/components/search-page-client';

export const metadata = {
  title: 'Search Books | BookWise Beginnings',
  description: 'Search for books by keyword or use our AI Book Finder to get personalized suggestions.',
};

export default function SearchPage() {
  return <SearchPageClient />;
}
