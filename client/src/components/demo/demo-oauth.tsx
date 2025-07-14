import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Twitter, Youtube, Instagram } from "lucide-react";
import { Loader2, Check, X } from "lucide-react";

export function DemoOAuth() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [platform, setPlatform] = useState<string>('');

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const platformParam = urlParams.get('platform');
    
    if (platformParam) {
      setPlatform(platformParam);
    }
  }, []);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="w-8 h-8 text-blue-500" />;
      case 'youtube':
        return <Youtube className="w-8 h-8 text-red-500" />;
      case 'instagram':
        return <Instagram className="w-8 h-8 text-purple-500" />;
      default:
        return <Twitter className="w-8 h-8 text-blue-500" />;
    }
  };

  const getPlatformName = (platform: string) => {
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');

    // Simulate OAuth flow with realistic timing
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Create demo social connection
      const response = await fetch('/api/social-connections/demo-connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ platform }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect');
      }

      setConnectionStatus('success');
      
      toast({
        title: "Connection Successful!",
        description: `Your ${getPlatformName(platform)} account has been connected successfully.`,
        variant: "default",
      });

      // Redirect back to dashboard after a short delay
      setTimeout(() => {
        setLocation('/dashboard');
      }, 2000);

    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Connection Failed",
        description: `Failed to connect your ${getPlatformName(platform)} account. Please try again.`,
        variant: "destructive",
      });
    }

    setIsConnecting(false);
  };

  const handleCancel = () => {
    setLocation('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {getPlatformIcon(platform)}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Connect to {getPlatformName(platform)}
          </CardTitle>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Authorize Veri to access your {getPlatformName(platform)} account to earn VeriPoints and unlock features.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {connectionStatus === 'idle' && (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Veri will be able to:
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• View your profile information</li>
                  <li>• Access your follower count</li>
                  <li>• Read your public posts</li>
                  <li>• Calculate engagement metrics</li>
                </ul>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Authorize
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={isConnecting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {connectionStatus === 'connecting' && (
            <div className="text-center space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
              <p className="text-gray-600 dark:text-gray-300">
                Connecting to {getPlatformName(platform)}...
              </p>
            </div>
          )}

          {connectionStatus === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">
                  Connection Successful!
                </h3>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
                <X className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">
                  Connection Failed
                </h3>
                <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                  Something went wrong. Please try again.
                </p>
                <Button
                  onClick={handleConnect}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}