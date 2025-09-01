import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { CelebrationProvider } from "@/contexts/celebration-context";
import { GlobalCelebrationManager } from "@/components/celebrations/global-celebration-manager";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Profile from "@/pages/profile";
import Analytics from "@/pages/analytics";
import Leaderboard from "@/pages/leaderboard";
import AIAgent from "@/pages/ai-agent";
import Settings from "@/pages/settings";
import Campaigns from "@/pages/campaigns";
import OAuthDemo from "@/pages/oauth-demo";
import { DemoOAuth } from "@/components/demo/demo-oauth";
import PublicProfile from "@/pages/public-profile";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  console.log('🔍 APP ROUTER: user =', user ? `${user.username} (ID: ${user.id})` : 'null');
  console.log('🔍 APP ROUTER: isLoading =', isLoading);
  
  return (
    <Switch>
      <Route path="/">
        {user ? (
          <>
            {console.log('🔍 APP ROUTER: Redirecting to Dashboard for user:', user.username)}
            <Dashboard />
          </>
        ) : (
          <>
            {console.log('🔍 APP ROUTER: Showing Home page (no user)')}
            <Home />
          </>
        )}
      </Route>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/ai-agent" component={AIAgent} />
      <Route path="/campaigns" component={Campaigns} />
      <Route path="/settings" component={Settings} />
      <Route path="/oauth-demo" component={OAuthDemo} />
      <Route path="/demo-oauth" component={DemoOAuth} />
      <Route path="/veri.club/:username" component={PublicProfile} />
      <Route path="/profile/:username" component={PublicProfile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="veri-ui-theme">
        <AuthProvider>
          <CelebrationProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
              <GlobalCelebrationManager />
            </TooltipProvider>
          </CelebrationProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
