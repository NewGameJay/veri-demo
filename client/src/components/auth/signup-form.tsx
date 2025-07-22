import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Twitter, Mail } from "lucide-react";

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
}

export function SignupForm({ onSwitchToLogin, onSuccess }: SignupFormProps) {
  const { signup } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    userType: "creator",
    profileType: "creator",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signup(formData);
      toast({
        title: "Account created successfully!",
        description: "Welcome to Veri! You've earned 25 points for signing up.",
      });
      onSuccess?.();
    } catch (error) {
      console.error("Signup error:", error);
      let errorMessage = "Please check your information and try again.";
      
      // Try to get more specific error from response
      if (error instanceof Error && error.message === "Signup failed") {
        errorMessage = "Email or username already exists. Please try different credentials.";
      }
      
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    toast({
      title: "Google signup coming soon!",
      description: "This feature will be available in the next release.",
    });
  };

  const handleTwitterSignup = () => {
    toast({
      title: "Twitter signup coming soon!",
      description: "This feature will be available in the next release.",
    });
  };

  return (
    <Card className="rounded-lg border text-card-foreground shadow-sm transform-gpu w-full max-w-md glass-effect border-white/20 bg-[#0000008a]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-white">Join Veri</CardTitle>
        <CardDescription className="text-white/60">
          Create your account and start earning points
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignup}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleTwitterSignup}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Twitter className="mr-2 h-4 w-4" />
            Twitter
          </Button>
        </div>
        
        

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">Last Name</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="glass-effect border-white/20 bg-white/10 text-white placeholder:text-white/50"
              />
            </div>
          </div>

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
            <Label htmlFor="username" className="text-white">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="johndoe"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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

          <div className="space-y-2">
            <Label htmlFor="userType" className="text-white">I am a...</Label>
            <Select 
              value={formData.userType} 
              onValueChange={(value) => setFormData({ ...formData, userType: value })}
            >
              <SelectTrigger className="glass-effect border-white/20 bg-white/10 text-white">
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="creator">Creator</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="community">Community</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full veri-gradient font-semibold text-white hover-scale transition-all duration-200"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-white/60">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-green-400 hover:text-green-300 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}