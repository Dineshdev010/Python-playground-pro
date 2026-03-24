// ============================================================
// AUTH PAGE — src/pages/AuthPage.tsx
// Handles user authentication: Login, Signup, and Forgot Password.
// Contains Butter Smooth Password Strength Validation & Feedback
// ============================================================

import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, CheckCircle2, Circle, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

type AuthMode = "login" | "signup" | "forgot";

// Requirement row component extracted to prevent React unmount loops
const ReqItem = ({ met, text }: { met: boolean; text: string }) => (
  <motion.div 
    initial={false}
    animate={{ color: met ? "rgb(34, 197, 94)" : "rgb(156, 163, 175)" }}
    className="flex items-center gap-1.5 text-xs transition-colors"
  >
    {met ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
    <span>{text}</span>
  </motion.div>
);

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, signup, resetPassword } = useAuth();

  // Instant password validation memoized for maximum performance
  const reqs = useMemo(() => ({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  }), [password]);

  const strengthScore = Object.values(reqs).filter(Boolean).length;
  const isPasswordValid = strengthScore === 5;
  const doPasswordsMatch = password === confirmPassword && password.length > 0;

  // Determine strength color
  const strengthColor = 
    strengthScore <= 2 ? "bg-red-500" : 
    strengthScore <= 4 ? "bg-python-yellow" : 
    "bg-green-500";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "signup") {
      if (!isPasswordValid) {
        toast({ title: "Weak Password", description: "Please meet all password requirements before signing up.", variant: "destructive" });
        return;
      }
      if (!doPasswordsMatch) {
        toast({ title: "Passwords Don't Match", description: "Your passwords must exactly match.", variant: "destructive" });
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const result = await login(email, password);
        toast({ title: "Welcome back!", description: "You've signed in successfully." });
        navigate(result.profile?.profileComplete ? "/dashboard" : "/complete-profile");
      } else if (mode === "signup") {
        await signup(email, password, name);
        toast({ title: "Account created!", description: "Welcome to PyMaster!" });
        navigate("/complete-profile");
      } else {
        await resetPassword(email);
        toast({ title: "Reset link sent!", description: "Check your email for a password reset link." });
        setMode("login");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 hover:scale-105 transition-transform">
            <img src="/logo.png" alt="PyMaster" className="w-10 h-10 rounded-xl shadow-lg" />
            <span className="font-bold text-2xl text-foreground">PyMaster</span>
          </Link>
          <p className="text-muted-foreground text-sm font-medium">
            {mode === "login" && "Welcome back! Sign in to continue learning."}
            {mode === "signup" && "Create your secure account and start coding."}
            {mode === "forgot" && "Enter your email to reset your password."}
          </p>
        </div>

        {/* Animated Auth Card */}
        <motion.div 
          layout
          className="rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-5"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Input */}
            <AnimatePresence mode="popLayout">
              {mode === "signup" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, filter: "blur(4px)" }} 
                  animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }} 
                  exit={{ opacity: 0, height: 0, filter: "blur(4px)" }}
                  className="space-y-1.5"
                >
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} className="pl-9" required />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" required />
              </div>
            </div>

            {/* Password Sections */}
            <AnimatePresence mode="popLayout">
              {mode !== "forgot" && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* Main Password Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      {mode === "login" && (
                        <button type="button" onClick={() => switchMode("forgot")} className="text-xs text-primary hover:underline font-medium">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={mode === "signup" ? "Create a strong password" : "••••••••"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-9 pr-9"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Password Strength & Confirm for Signup */}
                  <AnimatePresence mode="popLayout">
                    {mode === "signup" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: "auto" }} 
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 pt-1 overflow-hidden"
                      >
                        {/* Butter-smooth Strength Meter */}
                        <div className="space-y-2 bg-secondary/30 p-3 rounded-lg border border-border/50">
                          <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                            <span className="text-muted-foreground flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5"/> Password Strength</span>
                            <span className={isPasswordValid ? "text-green-500" : "text-muted-foreground"}>
                              {strengthScore}/5
                            </span>
                          </div>
                          
                          <div className="flex gap-1 h-1.5 w-full">
                            {[1, 2, 3, 4, 5].map((block) => (
                              <motion.div 
                                key={block}
                                className={`h-full flex-1 rounded-full ${strengthScore >= block ? strengthColor : "bg-secondary"}`}
                                layout
                              />
                            ))}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-y-1.5 pt-2">
                            <ReqItem met={reqs.length} text="8+ characters" />
                            <ReqItem met={reqs.upper} text="Uppercase letter" />
                            <ReqItem met={reqs.lower} text="Lowercase letter" />
                            <ReqItem met={reqs.number} text="Contains number" />
                            <ReqItem met={reqs.special} text="Special character" />
                          </div>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            {confirmPassword.length > 0 && (
                              <span className={`text-xs font-bold ${doPasswordsMatch ? "text-green-500" : "text-red-500"}`}>
                                {doPasswordsMatch ? "Matches!" : "Does not match"}
                              </span>
                            )}
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Retype password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className={`pl-9 pr-9 ${confirmPassword.length > 0 && (doPasswordsMatch ? "border-green-500 focus-visible:ring-green-500" : "border-red-500 focus-visible:ring-red-500")}`}
                              required
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            <Button 
              type="submit" 
              className={`w-full h-11 gap-2 mt-2 transition-all ${mode === "signup" && isPasswordValid && doPasswordsMatch ? "bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(22,163,74,0.4)]" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              ) : (
                <>
                  {mode === "login" && "Sign In"}
                  {mode === "signup" && "Create Secure Account"}
                  {mode === "forgot" && "Send Reset Link"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Mode Toggles */}
          <p className="text-center text-sm text-muted-foreground font-medium">
            {mode === "login" && (
              <>Don't have an account? <button onClick={() => switchMode("signup")} className="text-primary hover:underline font-bold">Sign up</button></>
            )}
            {mode === "signup" && (
              <>Already have an account? <button onClick={() => switchMode("login")} className="text-primary hover:underline font-bold">Sign in</button></>
            )}
            {mode === "forgot" && (
              <>Remember your password? <button onClick={() => switchMode("login")} className="text-primary hover:underline font-bold">Back to sign in</button></>
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
