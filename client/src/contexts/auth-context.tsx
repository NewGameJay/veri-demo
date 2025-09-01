import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  completeProfile: () => Promise<void>;
  isLoading: boolean;
  needsOnboarding: boolean;
}

interface SignupData {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
  profileType?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const needsOnboarding = user && !user.hasCompletedOnboarding;

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      console.log('🔍 AUTH CHECK: Starting auth check...');
      try {
        const response = await fetch("/api/auth/me", {
          credentials: 'include' // Include cookies for JWT authentication
        });
        console.log('🔍 AUTH CHECK: /api/auth/me response status:', response.status);
        
        if (response.ok) {
          const userData = await response.json();
          console.log('✅ AUTH CHECK: User authenticated from /api/auth/me:', userData.username);
          setUser(userData);
        } else if (response.status === 401) {
          console.log('🔍 AUTH CHECK: /api/auth/me failed, trying refresh token...');
          // Try refresh token
          const refreshResponse = await fetch("/api/auth/refresh", {
            credentials: 'include'
          });
          console.log('🔍 AUTH CHECK: /api/auth/refresh response status:', refreshResponse.status);
          
          if (refreshResponse.ok) {
            console.log('✅ AUTH CHECK: Refresh token successful, retrying /api/auth/me...');
            // Try getting user again after refresh
            const retryResponse = await fetch("/api/auth/me", {
              credentials: 'include'
            });
            console.log('🔍 AUTH CHECK: Retry /api/auth/me response status:', retryResponse.status);
            
            if (retryResponse.ok) {
              const userData = await retryResponse.json();
              console.log('✅ AUTH CHECK: User authenticated after refresh:', userData.username);
              setUser(userData);
            } else {
              console.log('❌ AUTH CHECK: Retry /api/auth/me failed');
            }
          } else {
            console.log('❌ AUTH CHECK: Refresh token failed');
          }
        }
      } catch (error) {
        console.error("❌ AUTH CHECK: Auth check failed:", error);
      } finally {
        console.log('🔍 AUTH CHECK: Completed, isLoading = false');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Include cookies for JWT authentication
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error("Login failed");
      }
      
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Include cookies for JWT authentication
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Signup failed");
      }
      
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: 'include', // Include cookies for JWT authentication
      });
      setUser(null);
      // Clear all cached queries to prevent data leakage between accounts
      queryClient.clear();
      // Clear local storage to remove any persisted data
      localStorage.clear();
      // Force a page refresh to ensure clean state
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state and redirect
      setUser(null);
      queryClient.clear();
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: 'include' // Include cookies for JWT authentication
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else if (response.status === 401) {
        // Try refresh token
        const refreshResponse = await fetch("/api/auth/refresh", {
          credentials: 'include'
        });
        if (refreshResponse.ok) {
          // Try getting user again after refresh
          const retryResponse = await fetch("/api/auth/me", {
            credentials: 'include'
          });
          if (retryResponse.ok) {
            const userData = await retryResponse.json();
            setUser(userData);
          }
        }
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  const completeOnboarding = async () => {
    try {
      const response = await fetch("/api/auth/complete-onboarding", {
        method: "POST",
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error("Failed to complete onboarding");
      }
      
      const userData = await response.json();
      setUser(userData);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      throw error;
    }
  };

  const completeProfile = async () => {
    try {
      const response = await fetch("/api/auth/complete-profile", {
        method: "POST",
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error("Failed to complete profile");
      }
      
      const userData = await response.json();
      setUser(userData);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    } catch (error) {
      console.error("Failed to complete profile:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout, 
      refreshUser, 
      completeOnboarding, 
      completeProfile, 
      isLoading, 
      needsOnboarding: !!needsOnboarding 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}