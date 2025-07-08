import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookPlus, Search, Wind } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Your Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what you can do.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-6 h-6" /> Find a New Book
            </CardTitle>
            <CardDescription>Use our AI-powered search to discover your next great read.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/search">Start Searching</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookPlus className="w-6 h-6" /> Log Your Reading
            </CardTitle>
            <CardDescription>Keep track of the books you've read and what you thought of them.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" disabled>Coming Soon</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="w-6 h-6" /> Random Suggester
            </CardTitle>
            <CardDescription>Feeling adventurous? Get a random book suggestion.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" disabled>Coming Soon</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
