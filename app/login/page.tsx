"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Users, UserCheck, Building2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (userType: 'client' | 'company') => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        toast.error(authError.message);
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        toast.error("Login failed. Please try again.");
        setIsLoading(false);
        return;
      }

      // 2. Get user profile from database to check their role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, first_name, last_name')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        toast.error("Error loading user profile. Please contact support.");
        setIsLoading(false);
        return;
      }

      // 3. Verify the user is logging in with the correct account type
      const userRole = profile.role;
      
      // Map roles to account types
      const isClientRole = userRole === 'client';
      const isCompanyRole = userRole === 'company_admin' || userRole === 'branch_manager';

      if (userType === 'client' && !isClientRole) {
        toast.error("This account is not a client account. Please use 'Login as Company'.");
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      if (userType === 'company' && !isCompanyRole) {
        toast.error("This account is not a company account. Please use 'Login as Client'.");
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      // 4. Success! Redirect to appropriate dashboard
      toast.success(`Welcome back, ${profile.first_name}!`);
      
      if (userType === 'client') {
        router.push('/client/dashboard');
      } else {
        router.push('/company/dashboard');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="p-4 flex items-center justify-between border-b border-border/50">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
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

      {/* Login Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your MyTurn account
            </p>
          </div>

          <Card className="myturn-card">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button
                  onClick={() => handleLogin('client')}
                  disabled={isLoading}
                  className="w-full myturn-button-primary h-12 text-base"
                >
                  <UserCheck className="mr-2 h-5 w-5" />
                  {isLoading ? "Signing in..." : "Login as Client"}
                </Button>

                <Button
                  onClick={() => handleLogin('company')}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full h-12 text-base hover:bg-secondary/50"
                >
                  <Building2 className="mr-2 h-5 w-5" />
                  Login as Company
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-primary hover:underline font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}