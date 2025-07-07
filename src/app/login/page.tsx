import { LoginForm } from '@/components/login-form';
import { BookOpenText } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <Link href="/" className="flex items-center gap-3 text-primary">
          <BookOpenText className="h-10 w-10 md:h-12 md:w-12" />
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-foreground">
            BookWise Beginnings
          </h1>
        </Link>
        <p className="max-w-md text-muted-foreground font-body">
          Sign in to your account to continue.
        </p>
      </div>
      <LoginForm className="mt-8" />
    </main>
  );
}
