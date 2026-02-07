"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Briefcase, Loader2, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof forgotPasswordSchema>) {
    setIsLoading(true);
    try {
      // API call to request reset
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      });

      // Always show success to prevent email leaking
      setIsSubmitted(true);
      toast.success("Reset link sent!");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md ios-card">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
             </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Forgot Password?</CardTitle>
          <CardDescription className="text-center">
            {isSubmitted 
              ? "If an account exists, you will receive an email shortly with reset instructions."
              : "Enter your email address and we'll send you a link to reset your password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="name@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full ios-button" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Reset Link
                </Button>
              </form>
            </Form>
          ) : (
            <div className="text-center py-4">
               <p className="text-sm text-slate-500 mb-6">
                 Check your inbox and follow the instructions in the email. Don't forget to check your spam folder.
               </p>
               <Button variant="outline" className="w-full ios-button" onClick={() => setIsSubmitted(false)}>
                  Didn't receive an email? Try again
               </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-muted-foreground w-full">
            <Link href="/auth/login" className="flex items-center justify-center gap-2 text-primary hover:underline font-semibold">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
