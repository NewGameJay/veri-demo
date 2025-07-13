import { useEffect } from 'react';
import { useLocation } from 'wouter';

export default function OAuthDemo() {
  const [, navigate] = useLocation();
  
  useEffect(() => {
    // Get URL parameters
    const params = new URLSearchParams(window.location.search);
    const platform = params.get('platform');
    const userId = params.get('userId');
    
    if (!platform || !userId) {
      navigate('/');
      return;
    }
    
    // Simulate OAuth flow completion after 2 seconds
    setTimeout(() => {
      window.location.href = `/api/auth/twitter/callback?userId=${userId}&success=true`;
    }, 2000);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
      <div className="glass-subtle p-8 rounded-xl text-center max-w-md">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </div>
        
        <h2 className="text-xl font-termina text-white mb-2">Connecting to Twitter</h2>
        <p className="text-white/60 font-inter mb-4">
          Please wait while we connect your Twitter account...
        </p>
        
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
        </div>
        
        <p className="text-xs text-white/40 font-inter">
          Demo mode - No real Twitter connection required
        </p>
      </div>
    </div>
  );
}