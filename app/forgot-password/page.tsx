"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/theme-toggle";
import { Users, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Password reset email sent!");
      setEmailSent(true);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="p-4 flex items-center justify-between border-b border-border/50">
        <Link href="/login" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <ArrowLeft className="w-5 h-5" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">MyTurn</span>
          </div>
        </Link>
        <ThemeToggle />
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Forgot Password?</h1>
            <p className="text-muted-foreground mt-2">
              {emailSent 
                ? "Check your email for reset instructions"
                : "Enter your email to reset your password"
              }
            </p>
          </div>

          <Card className="myturn-card">
            {emailSent ? (
              <CardContent className="pt-6 text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Email Sent!</h3>
                  <p className="text-muted-foreground text-sm">
                    We've sent a password reset link to <strong>{email}</strong>. 
                    Check your inbox and follow the instructions to reset your password.
                  </p>
                </div>
                <div className="space-y-3 pt-4">
                  <Link href="/login">
                    <Button className="w-full myturn-button-primary">
                      Back to Sign In
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => {
                      setEmailSent(false);
                      setEmail("");
                    }}
                  >
                    Try Different Email
                  </Button>
                </div>
              </CardContent>
            ) : (
              <>
                <CardHeader>
                  <CardTitle>Reset Password</CardTitle>
                  <CardDescription>
                    Enter your email address and we'll send you a link to reset your password
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full myturn-button-primary h-12 text-base"
                    >
                      {isLoading ? "Sending..." : "Send Reset Email"}
                    </Button>

                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Remember your password?{" "}
                        <Link
                          href="/login"
                          className="text-primary hover:underline font-medium"
                        >
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}