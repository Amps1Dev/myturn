"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SupabaseConnectionTest() {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testConnection = async () => {
    setTesting(true);
    setResult(null);

    try {
      // Check if supabase client exists
      if (!supabase) {
        setResult({
          success: false,
          message: "Supabase client not initialized",
          details: "Check if @/lib/supabase exists and is properly configured"
        });
        setTesting(false);
        return;
      }

      // Test 1: Try to connect to institutions table
      const { data, error } = await supabase
        .from('institutions')
        .select('count')
        .limit(1);

      if (error) {
        setResult({
          success: false,
          message: "Connection failed",
          error: error.message,
          details: error
        });
      } else {
        setResult({
          success: true,
          message: "Successfully connected to Supabase!",
          data: data,
          tableExists: true
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: "Unexpected error",
        error: err.message,
        details: err
      });
    }

    setTesting(false);
  };

  const checkEnvVariables = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    return {
      urlExists: !!url,
      keyExists: !!key,
      url: url ? url : "Not found",
      keyPreview: key ? `${key.substring(0, 20)}...` : "Not found"
    };
  };

  const envVars = checkEnvVariables();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>

      <div className="space-y-4">
        {/* Environment Variables Check */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              {envVars.urlExists ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
              <span className="text-sm text-gray-600 break-all">{envVars.url}</span>
            </div>
            <div className="flex items-center gap-2">
              {envVars.keyExists ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
              <span className="text-sm text-gray-600">{envVars.keyPreview}</span>
            </div>

            {(!envVars.urlExists || !envVars.keyExists) && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-sm font-medium text-yellow-800 mb-2">Missing Environment Variables!</p>
                <p className="text-xs text-yellow-700">
                  Create a <code>.env.local</code> file in your project root with:
                </p>
                <pre className="mt-2 p-2 bg-yellow-100 rounded text-xs">
{`NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key`}
                </pre>
                <p className="text-xs text-yellow-700 mt-2">
                  Restart your dev server after adding these!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connection Test */}
        <Card>
          <CardHeader>
            <CardTitle>Database Connection Test</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testConnection} 
              disabled={testing || !envVars.urlExists || !envVars.keyExists}
              className="mb-4"
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                "Test Connection"
              )}
            </Button>

            {result && (
              <div className={`p-4 rounded border ${
                result.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-start gap-2">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className={`font-medium ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.message}
                    </p>
                    {result.error && (
                      <p className="text-sm text-red-700 mt-1">Error: {result.error}</p>
                    )}
                    {result.details && (
                      <details className="mt-2">
                        <summary className="text-xs cursor-pointer">View details</summary>
                        <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>1.</strong> Make sure you have a <code>.env.local</code> file in your project root</p>
            <p><strong>2.</strong> Add your Supabase credentials (get them from supabase.com → Project Settings → API)</p>
            <p><strong>3.</strong> Restart your development server completely</p>
            <p><strong>4.</strong> Make sure the <code>institutions</code> table exists in your Supabase database</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}