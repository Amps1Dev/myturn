"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, Users, Database } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AuthDatabaseTest() {
  const [loading, setLoading] = useState(false);
  const [authUsers, setAuthUsers] = useState<any[]>([]);
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    checkCurrentUser();
  }, []);

  const checkCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
  };

  const checkAuthUsers = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      // Get current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        setTestResult({
          success: false,
          message: "Not authenticated",
          details: authError.message
        });
        setLoading(false);
        return;
      }

      setCurrentUser(user);
      setTestResult({
        success: true,
        message: "User is authenticated!",
        userId: user?.id,
        email: user?.email
      });

    } catch (err: any) {
      setTestResult({
        success: false,
        message: "Error checking auth",
        details: err.message
      });
    }

    setLoading(false);
  };

  const checkUsersTable = async () => {
    setLoading(true);

    try {
      // Check if users table exists and get data
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setTestResult({
          success: false,
          message: "Error accessing users table",
          details: error.message,
          hint: "The 'users' table might not exist or you don't have permission to access it"
        });
      } else {
        setDbUsers(data || []);
        setTestResult({
          success: true,
          message: `Found ${data?.length || 0} users in database`,
          data: data
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: "Unexpected error",
        details: err.message
      });
    }

    setLoading(false);
  };

  const testSignUp = async () => {
    setLoading(true);
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = "TestPassword123!";

    try {
      // Attempt to sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      if (signUpError) {
        setTestResult({
          success: false,
          message: "Sign up failed",
          details: signUpError.message
        });
        setLoading(false);
        return;
      }

      // Wait a moment for data to sync
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if user appears in users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', signUpData.user?.id)
        .single();

      if (userError && userError.code === 'PGRST116') {
        setTestResult({
          success: false,
          message: "User created in Auth but NOT in users table",
          authUser: signUpData.user,
          hint: "You may need a database trigger or manual insert to sync auth users to users table"
        });
      } else if (userError) {
        setTestResult({
          success: false,
          message: "Error checking users table",
          details: userError.message
        });
      } else {
        setTestResult({
          success: true,
          message: "User successfully created in both Auth and Database!",
          authUser: signUpData.user,
          dbUser: userData
        });
      }

      // Sign out the test user
      await supabase.auth.signOut();

    } catch (err: any) {
      setTestResult({
        success: false,
        message: "Test failed",
        details: err.message
      });
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Authentication & Database Test</h1>

      <div className="space-y-4">
        {/* Current User Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Current User Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Logged in as:</span>
                </div>
                <div className="ml-7 text-sm">
                  <p><strong>Email:</strong> {currentUser.email}</p>
                  <p><strong>ID:</strong> {currentUser.id}</p>
                  <p><strong>Created:</strong> {new Date(currentUser.created_at).toLocaleString()}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-gray-400" />
                <span>Not logged in</span>
              </div>
            )}
            <Button onClick={checkCurrentUser} variant="outline" className="mt-4" size="sm">
              Refresh Status
            </Button>
          </CardContent>
        </Card>

        {/* Test Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <Button onClick={checkAuthUsers} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
                Check Auth Status
              </Button>
              <Button onClick={checkUsersTable} disabled={loading} variant="outline">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                Check Users Table
              </Button>
              <Button onClick={testSignUp} disabled={loading} variant="secondary">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Test Sign Up Flow
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              "Test Sign Up Flow" creates a test user to verify the complete registration process
            </p>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded border ${
                testResult.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start gap-2">
                  {testResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${
                      testResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {testResult.message}
                    </p>
                    {testResult.hint && (
                      <p className="text-sm text-yellow-700 mt-2 bg-yellow-50 p-2 rounded">
                        💡 {testResult.hint}
                      </p>
                    )}
                    {testResult.details && (
                      <p className="text-sm mt-1 text-gray-700">
                        Details: {testResult.details}
                      </p>
                    )}
                    {(testResult.authUser || testResult.dbUser || testResult.data) && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer">View full data</summary>
                        <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-60">
                          {JSON.stringify({
                            authUser: testResult.authUser,
                            dbUser: testResult.dbUser,
                            data: testResult.data
                          }, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users in Database */}
        {dbUsers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Users in Database ({dbUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dbUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="p-3 bg-gray-50 rounded text-sm">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
                  </div>
                ))}
                {dbUsers.length > 5 && (
                  <p className="text-xs text-gray-500">...and {dbUsers.length - 5} more</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use This Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>1. Check Auth Status:</strong> Verifies if you're currently logged in</p>
            <p><strong>2. Check Users Table:</strong> Shows all users stored in your database</p>
            <p><strong>3. Test Sign Up Flow:</strong> Creates a test user and checks if it appears in both Auth and Database</p>
            <p className="text-xs text-gray-500 mt-4">
              If sign up creates users in Auth but not in the database, you need to set up a trigger or manually insert users.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}