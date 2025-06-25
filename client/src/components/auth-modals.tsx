import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { X } from "lucide-react";

interface AuthModalsProps {
  showLogin: boolean;
  showSignup: boolean;
  onCloseLogin: () => void;
  onCloseSignup: () => void;
  onSwitchToSignup: () => void;
  onSwitchToLogin: () => void;
}

export default function AuthModals({
  showLogin,
  showSignup,
  onCloseLogin,
  onCloseSignup,
  onSwitchToSignup,
  onSwitchToLogin,
}: AuthModalsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const loginData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const response = await apiRequest("POST", "/api/auth/login", loginData);
      const user = await response.json();
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.firstName} ${user.lastName}`,
      });
      
      onCloseLogin();
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const signupData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      const response = await apiRequest("POST", "/api/auth/register", signupData);
      const user = await response.json();
      
      toast({
        title: "Account created!",
        description: `Welcome to BRAVENZA, ${user.firstName}!`,
      });
      
      onCloseSignup();
      e.currentTarget.reset();
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "An account with this email already exists or there was an error.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Login Modal */}
      <Dialog open={showLogin} onOpenChange={onCloseLogin}>
        <DialogContent className="max-w-md bg-bravenza-charcoal border-gray-700" aria-describedby="login-description">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="font-playfair text-2xl">Sign In</DialogTitle>
              <button 
                onClick={onCloseLogin}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>
          
          <div id="login-description" className="sr-only">Sign in to your BRAVENZA account</div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
            />
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-bravenza-gold text-black hover:bg-bravenza-light-gold transition-colors duration-300"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
          
          <div className="text-center mt-4">
            <span className="text-gray-400">Don't have an account? </span>
            <button 
              onClick={onSwitchToSignup}
              className="text-bravenza-gold hover:text-white transition-colors duration-300"
            >
              Sign Up
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signup Modal */}
      <Dialog open={showSignup} onOpenChange={onCloseSignup}>
        <DialogContent className="max-w-md bg-bravenza-charcoal border-gray-700" aria-describedby="signup-description">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="font-playfair text-2xl">Sign Up</DialogTitle>
              <button 
                onClick={onCloseSignup}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </DialogHeader>
          
          <div id="signup-description" className="sr-only">Create a new BRAVENZA account</div>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="text"
                name="firstName"
                placeholder="First Name"
                required
                className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
              />
              <Input
                type="text"
                name="lastName"
                placeholder="Last Name"
                required
                className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
              />
            </div>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="bg-bravenza-dark border-gray-600 focus:border-bravenza-gold"
            />
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-bravenza-gold text-black hover:bg-bravenza-light-gold transition-colors duration-300"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
          
          <div className="text-center mt-4">
            <span className="text-gray-400">Already have an account? </span>
            <button 
              onClick={onSwitchToLogin}
              className="text-bravenza-gold hover:text-white transition-colors duration-300"
            >
              Sign In
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
