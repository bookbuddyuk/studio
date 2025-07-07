import Link from 'next/link';
import { BookOpenText, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <BookOpenText className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-foreground">BookWise Beginnings</span>
        </Link>
        <Button asChild variant="ghost">
          <Link href="/">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Link>
        </Button>
      </div>
    </header>
  );
}
