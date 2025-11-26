"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function SignupDebugPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const testSignup = async () => {
    if (!email || !password || !firstName || !lastName) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setResults(null);

    const testResults: any = {
      steps: [],
      success: false
    };

    try {
      // Step 1: Check if profiles table exists and is accessible
      testResults.steps.push({ step: "Checking profiles table access...", status: "pending" });
      
      const { data: tableCheck, error: tableError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (tableError) {
        testResults.steps[0].status = "error";
        testResults.steps[0].error = tableError;
        testResults.steps[0].message = "Cannot access profiles table";
        setResults(testResults);
        setIsLoading(false);
        return;
      }

      testResults.steps[0].status = "success";
      testResults.steps[0].message = "Profiles table is accessible";

      // Step 2: Create user in Supabase Auth
      testResults.steps.push({ step: "Creating user in Supabase Auth...", status: "pending" });
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: 'client',
          }
        }
      });

      if (authError) {
        testResults.steps[1].status = "error";
        testResults.steps[1].error = authError;
        testResults.steps[1].message = authError.message;
        setResults(testResults);
        setIsLoading(false);
        return;
      }

      if (!authData.user) {
        testResults.steps[1].status = "error";
        testResults.steps[1].message = "No user returned from signup";
        setResults(testResults);
        setIsLoading(false);
        return;
      }

      testResults.steps[1].status = "success";
      testResults.steps[1].message = `User created with ID: ${authData.user.id}`;
      testResults.steps[1].userId = authData.user.id;

      // Step 3: Wait a moment for any triggers to execute
      testResults.steps.push({ step: "Waiting for database triggers...", status: "pending" });
      await new Promise(resolve => setTimeout(resolve, 2000));
      testResults.steps[2].status = "success";

      // Step 4: Check if profile was auto-created by trigger
      testResults.steps.push({ step: "Checking if profile auto-created...", status: "pending" });
      
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (existingProfile) {
        testResults.steps[3].status = "success";
        testResults.steps[3].message = "Profile was auto-created by database trigger!";
        testResults.steps[3].profile = existingProfile;
        testResults.success = true;
        setResults(testResults);
        setIsLoading(false);
        return;
      }

      testResults.steps[3].status = "info";
      testResults.steps[3].message = "No auto-created profile found. Attempting manual insert...";

      // Step 5: Manually insert profile
      testResults.steps.push({ step: "Manually inserting profile...", status: "pending" });
      
      const { data: insertedProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: email,
          first_name: firstName,
          last_name: lastName,
          role: 'client',
        })
        .select()
        .single();

      if (profileError) {
        testResults.steps[4].status = "error";
        testResults.steps[4].error = profileError;
        testResults.steps[4].message = profileError.message;
        testResults.steps[4].details = {
          code: profileError.code,
          details: profileError.details,
          hint: profileError.hint,
        };
        setResults(testResults);
        setIsLoading(false);
        return;
      }

      testResults.steps[4].status = "success";
      testResults.steps[4].message = "Profile manually created successfully!";
      testResults.steps[4].profile = insertedProfile;
      testResults.success = true;

      // Step 6: Verify final state
      testResults.steps.push({ step: "Verifying final state...", status: "success" });
      testResults.steps[5].message = "User and profile created successfully!";

      toast.success("Test signup completed successfully!");

    } catch (error: any) {
      testResults.steps.push({
        step: "Unexpected error",
        status: "error",
        error: error,
        message: error.message
      });
    }

    setResults(testResults);
    setIsLoading(false);
  };

  const checkRLSPolicies = async () => {
    setIsLoading(true);
    toast.info("Checking RLS policies...");

    try {
      // Try to insert a test record to see what error we get
      const testId = '00000000-0000-0000-0000-000000000000';
      
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: testId,
          email: 'test@test.com',
          first_name: 'Test',
          last_name: 'User',
          role: 'client',
        });

      if (error) {
        toast.error(`RLS Policy Issue: ${error.message}`);
        console.log("Full error:", error);
      } else {
        toast.success("Insert would succeed (cleaning up test record)");
        await supabase.from('profiles').delete().eq('id', testId);
      }
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }

    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Signup Debug Test</h1>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Test Signup Flow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>First Name</Label>
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={testSignup} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Test Signup
              </Button>
              <Button onClick={checkRLSPolicies} disabled={isLoading} variant="outline">
                Check RLS Policies
              </Button>
            </div>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {results.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.steps.map((step: any, index: number) => (
                <div key={index} className="border-l-4 pl-4 py-2" style={{
                  borderColor: step.status === 'success' ? '#22c55e' : 
                               step.status === 'error' ? '#ef4444' : 
                               step.status === 'info' ? '#3b82f6' : '#94a3b8'
                }}>
                  <div className="flex items-start gap-2">
                    {step.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                    {step.status === 'error' && <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />}
                    {step.status === 'info' && <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />}
                    {step.status === 'pending' && <Loader2 className="h-5 w-5 text-gray-500 mt-0.5 animate-spin" />}
                    
                    <div className="flex-1">
                      <p className="font-medium">{step.step}</p>
                      {step.message && <p className="text-sm text-gray-600 mt-1">{step.message}</p>}
                      
                      {step.error && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm">
                          <p className="font-medium text-red-800">Error Details:</p>
                          <p className="text-red-700">{step.error.message}</p>
                          {step.details && (
                            <details className="mt-2">
                              <summary className="cursor-pointer text-xs text-red-600">View full error</summary>
                              <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
                                {JSON.stringify(step.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      )}

                      {step.profile && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-xs text-blue-600">View profile data</summary>
                          <pre className="mt-2 p-2 bg-blue-50 rounded text-xs overflow-auto">
                            {JSON.stringify(step.profile, null, 2)}
                          </pre>
                        </details>
                      )}

                      {step.userId && (
                        <p className="text-xs text-gray-500 mt-1 font-mono">{step.userId}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Common Issues & Solutions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium">1. RLS Policy Issue</p>
              <p className="text-gray-600">If you see "new row violates row-level security policy", you need to add an INSERT policy to the profiles table.</p>
            </div>
            <div>
              <p className="font-medium">2. Missing Trigger</p>
              <p className="text-gray-600">If no profile is auto-created, you might need to set up a database trigger to create profiles automatically when users sign up.</p>
            </div>
            <div>
              <p className="font-medium">3. Permission Denied</p>
              <p className="text-gray-600">Check that the authenticated users have permission to insert into the profiles table.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}