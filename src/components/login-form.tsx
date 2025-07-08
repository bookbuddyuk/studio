"use client";

import Link from "next/link";
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Building2,
  GraduationCap,
  Shield,
  Smile,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { schools } from "@/lib/data";

const loginSchema = z.object({
  email: z.string().optional(),
  school: z.string().optional(),
  username: z.string().optional(),
  password: z.string().min(1, { message: "Password is required." }),
});

type Role = "student" | "teacher" | "parent" | "school" | "admin";

const roles: { id: Role; label: string; icon: React.ElementType }[] = [
  { id: "student", label: "Student", icon: Smile },
  { id: "parent", label: "Parent", icon: Users },
  { id: "teacher", label: "Teacher", icon: GraduationCap },
  { id: "school", label: "School", icon: Building2 },
  { id: "admin", label: "Admin", icon: Shield },
];

export function LoginForm({ className }: { className?: string }) {
  const { toast } = useToast();
  const [role, setRole] = React.useState<Role>('student');
  const router = useRouter();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      school: "",
      username: "",
      password: "",
    },
  });

  const handleRoleChange = (value: string) => {
    setRole(value as Role);
    form.reset();
  }

  function onSubmit(values: z.infer<typeof loginSchema>) {
    // This is a placeholder for actual login logic.
    // In a real app, you would call your authentication service here.
    toast({
      title: "Login Successful",
      description: `Welcome! Redirecting to your dashboard.`,
    });
    router.push('/app');
  }

  const isStudentOrParent = role === 'student' || role === 'parent';

  return (
    <Card className={cn("w-full max-w-md shadow-xl", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Choose your role and enter your credentials.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue={role} onValueChange={handleRoleChange} className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-auto flex-wrap justify-center">
                {roles.map(({ id, label, icon: Icon }) => (
                  <TabsTrigger key={id} value={id} className="flex flex-col h-20 gap-2 p-1 md:p-2">
                    <Icon className="h-6 w-6 md:h-8 md:w-8" />
                    <span className="hidden sm:block text-xs">{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {isStudentOrParent ? (
              <>
                <FormField
                  control={form.control}
                  name="school"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>School</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your school" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {schools.map((school) => (
                            <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
               <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-center gap-4">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              <Link href="/search" className="font-medium text-primary hover:underline">
                Or browse books as a guest
              </Link>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
