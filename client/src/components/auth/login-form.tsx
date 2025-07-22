import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VeriLogo } from "@/components/ui/veri-logo";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Twitter, Mail } from "lucide-react";

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onSuccess?: () => void;
}

export function LoginForm({ onSwitchToSignup, onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast({
      title: "Google login coming soon!",
      description: "This feature will be available in the next release.",
    });
  };

  const handleTwitterLogin = () => {
    toast({
      title: "Twitter login coming soon!",
      description: "This feature will be available in the next release.",
    });
  };

  return (
    <Card className="w-full max-w-md glass-effect border-white/20 bg-black/75">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <VeriLogo size="lg" showText={false} />
        </div>
        <CardTitle className="text-2xl font-bold text-white font-termina">Welcome Back</CardTitle>
        <CardDescription className="text-white/60 font-inter">
          Sign in to your Veri account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleTwitterLogin}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Twitter className="mr-2 h-4 w-4" />
            Twitter
          </Button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gray-800 px-2 text-white/60">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full veri-gradient font-semibold text-white hover-scale transition-all duration-200"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-white/60">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-green-400 hover:text-green-300 font-medium transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}