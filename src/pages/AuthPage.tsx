import { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, Terminal, Code2, Sparkles, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

type AuthMode = "login" | "signup" | "forgot";

const AUTH_COPY: Record<AuthMode, { title: string; subtitle: string; submit: string }> = {
  login: {
    title: "Welcome Back",
    subtitle: "Log in to continue your Python learning journey.",
    submit: "Log In",
  },
  signup: {
    title: "Create Your Account",
    subtitle: "Start learning Python with lessons, quizzes, and practice.",
    submit: "Create Account",
  },
  forgot: {
    title: "Reset Your Password",
    subtitle: "Enter your email and we’ll send a reset link.",
    submit: "Send Reset Link",
  },
};

function getPasswordRequirements(password: string) {
  return [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
}

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
  const { login, signup, resetPassword, signInWithGoogle } = useAuth();

  const reqs = useMemo(() => getPasswordRequirements(password), [password]);
  const strengthScore = reqs.filter(Boolean).length;
  const isPasswordValid = strengthScore === 5;
  const doPasswordsMatch = password === confirmPassword && password.length > 0;
  
  const currentCopy = AUTH_COPY[mode];

  // Background stars
  const stars = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 2,
    }));
  }, []);

  // --- 3D Parallax Tilt Effect ---
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const smoothConfig = { damping: 30, stiffness: 150, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, smoothConfig);
  const smoothMouseY = useSpring(mouseY, smoothConfig);

  const rotateX = useTransform(smoothMouseY, [-1, 1], [6, -6]);
  const rotateY = useTransform(smoothMouseX, [-1, 1], [-6, 6]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || window.innerWidth < 768) return; // Disable parallax on mobile
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Normalize safely to -1 => 1
    mouseX.set((e.clientX - centerX) / (window.innerWidth / 2));
    mouseY.set((e.clientY - centerY) / (window.innerHeight / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "signup") {
      if (!isPasswordValid) {
        toast({ title: "Password is too weak", description: "Use at least 8 characters with uppercase, lowercase, number, and symbol.", variant: "destructive" });
        return;
      }
      if (!doPasswordsMatch) {
        toast({ title: "Passwords do not match", description: "Please make sure both passwords are the same.", variant: "destructive" });
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const result = await login(email, password);
        toast({ title: "Logged in successfully", description: "Welcome back." });
        navigate(result.profile?.profileComplete ? "/dashboard" : "/complete-profile");
      } else if (mode === "signup") {
        await signup(email, password, name);
        toast({ title: "Account created", description: "Your learning journey starts now." });
        navigate("/complete-profile");
      } else {
        await resetPassword(email);
        toast({ title: "Reset link sent", description: "Check your email for the password reset link." });
        setMode("login");
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: error instanceof Error ? error.message : "Please try again in a moment.",
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
    <div 
      className="w-full min-h-screen flex items-center justify-center text-foreground bg-[#0b1220] overflow-hidden relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      
      {/* 🌌 Cinematic Background Animations 🌌 */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Twinkling Stars */}
        {stars.map((star) => (
          <motion.div
            key={star.id}
            animate={{ opacity: [0.1, 0.8, 0.1] }}
            transition={{ duration: star.duration, repeat: Infinity, ease: "easeInOut", delay: star.delay }}
            className="absolute bg-white rounded-full"
            style={{ left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size }}
          />
        ))}

        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[30%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/25 blur-[130px]"
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] -right-[20%] w-[80vw] h-[80vw] rounded-full bg-python-yellow/20 blur-[150px]"
        />
        <motion.div 
          animate={{ y: [0, -60, 0], x: [0, 40, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-amber-500/10 blur-[120px]"
        />

        {/* Floating Icons */}
        <motion.div 
          animate={{ y: [-20, 20, -20], rotate: [0, 15, -15, 0] }} 
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[25%] opacity-10 text-white"
        >
          <Terminal size={80} />
        </motion.div>
        <motion.div 
          animate={{ y: [20, -30, 20], rotate: [0, -20, 20, 0] }} 
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[20%] opacity-10 text-white"
        >
          <Code2 size={120} />
        </motion.div>
        
        {/* Deep grid overlay */}
        <div 
          className="absolute inset-0 z-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      {/* 🚀 Centered Interactive Hub 🚀 */}
      <motion.div
        ref={containerRef}
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        className="w-full max-w-[480px] z-10 p-4 sm:p-6"
      >
        <motion.div 
          layout
          className="bg-[#0f111a]/70 md:bg-[#0f111a]/50 backdrop-blur-xl md:backdrop-blur-3xl border border-primary/20 rounded-3xl md:rounded-[2.5rem] shadow-[0_0_50px_rgba(37,99,235,0.2)] md:shadow-[0_0_80px_rgba(250,204,21,0.15)] relative overflow-hidden"
        >
          {/* Top Edge Glow */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-60" />

          {/* Header Section */}
          <div className="p-6 sm:p-10 pb-4 sm:pb-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary to-python-yellow rounded-2xl blur-lg opacity-50 group-hover:opacity-80 transition duration-500 animate-pulse"></div>
                <div className="relative bg-[#0d0f14] border border-primary/25 p-2.5 rounded-2xl">
                  <img src="/logo.png" alt="PyMaster" className="w-14 h-14 rounded-xl object-contain" />
                </div>
              </div>
            </div>
            <motion.h2 layout="position" className="text-3xl font-black tracking-tight text-white mb-2">
              {currentCopy.title}
            </motion.h2>
            <motion.p layout="position" className="text-white/50 font-medium text-[14px] sm:text-[15px]">
              {currentCopy.subtitle}
            </motion.p>
          </div>

          <div className="px-6 sm:px-10 pb-8 sm:pb-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <AnimatePresence mode="popLayout">
                {mode === "signup" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, height: "auto", scale: 1 }} 
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                  >
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-white/30 group-focus-within:text-blue-400 transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                        <Input 
                        id="name" 
                        placeholder="Your name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="pl-14 h-14 bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.05] focus-visible:bg-white/[0.08] focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 rounded-full transition-all font-medium text-[15px]" 
                        required 
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Input */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-white/30 group-focus-within:text-blue-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Email address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="pl-14 h-14 bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.05] focus-visible:bg-white/[0.08] focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 rounded-full transition-all font-medium text-[15px]" 
                  required 
                />
              </div>

              <AnimatePresence mode="popLayout">
                {mode !== "forgot" && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    {/* Password Input */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-white/30 group-focus-within:text-blue-400 transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={mode === "signup" ? "Create password" : "Password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-14 pr-14 h-14 bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.05] focus-visible:bg-white/[0.08] focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 rounded-full transition-all font-medium tracking-wide text-[15px]"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-5 text-white/30 hover:text-white transition-colors focus:outline-none">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    <AnimatePresence mode="popLayout">
                      {mode === "signup" && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: "auto" }} 
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 overflow-hidden pt-1"
                        >
                          {/* Hyper-Modern Strength Meter */}
                          <div className="flex justify-between items-center px-4">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">Password strength</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((block) => (
                                <motion.div 
                                  key={block}
                                  className={`h-1.5 w-6 rounded-full transition-colors duration-500 ${strengthScore >= block ? (strengthScore === 5 ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]") : "bg-white/5"}`}
                                  layout
                                />
                              ))}
                            </div>
                          </div>

                          {/* Confirm Password Input */}
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none text-white/30 group-focus-within:text-blue-400 transition-colors">
                              <ShieldCheck className="w-5 h-5" />
                            </div>
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className={`pl-14 pr-14 h-14 bg-white/[0.03] text-white hover:bg-white/[0.05] focus-visible:bg-white/[0.08] transition-all font-medium rounded-full tracking-wide text-[15px] ${confirmPassword.length > 0 ? (doPasswordsMatch ? "border border-green-500/50 focus-visible:ring-1 focus-visible:ring-green-500/50" : "border border-red-500/50 focus-visible:ring-1 focus-visible:ring-red-500/50") : "border border-white/10 focus-visible:ring-1 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50"}`}
                              required
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-5 text-white/30 hover:text-white transition-colors focus:outline-none">
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                            
                            {/* Pass Match Indicator */}
                            {confirmPassword.length > 0 && (
                              <div className="absolute right-14 inset-y-0 flex items-center">
                                {doPasswordsMatch 
                                  ? <span className="text-[10px] text-green-400 font-bold tracking-widest uppercase bg-green-500/10 px-2 py-0.5 rounded-full">Valid</span>
                                  : <span className="text-[10px] text-red-400 font-bold tracking-widest uppercase bg-red-500/10 px-2 py-0.5 rounded-full">Mismatch</span>
                                }
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <div className="pt-2">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full h-14 rounded-full text-[16px] font-bold overflow-hidden relative group transition-all duration-300 border-none shadow-[0_0_40px_rgba(59,130,246,0.2)] hover:shadow-[0_0_60px_rgba(59,130,246,0.4)] hover:-translate-y-0.5
                    ${mode === "signup" && isPasswordValid && doPasswordsMatch 
                      ? "bg-gradient-to-r from-streak-green to-primary text-white" 
                      : "bg-gradient-to-r from-primary to-python-yellow text-[#0b1220]"
                    }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 tracking-wide">
                    {loading ? (
                      <>
                        <span className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full" />
                        Please wait...
                      </>
                    ) : (
                      <>
                        {currentCopy.submit}
                        <Sparkles className="w-5 h-5" />
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </form>

            {/* Social Login Separator */}
            <div className="relative flex items-center py-6">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink-0 mx-4 text-white/20 text-[10px] font-bold tracking-[0.2em] uppercase">
                Or continue with
              </span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* Google Login Button */}
            <Button 
              type="button"
              onClick={async () => {
                try {
                  await signInWithGoogle();
                } catch (error) {
                  toast({ title: "Google sign-in failed", description: "Please try again.", variant: "destructive" });
                }
              }}
              variant="outline"
              className="w-full h-14 bg-white/[0.02] hover:bg-white/[0.08] border-white/10 text-white hover:text-white font-semibold text-[15px] rounded-full transition-all flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
          </div>

          {/* Seamless Footer Navigation */}
          <div className="bg-white/[0.02] border-t border-white/5 p-6 flex flex-col items-center justify-center gap-3">
            {mode === "login" && (
              <>
                <button onClick={() => switchMode("signup")} className="text-14 font-medium text-white/50 hover:text-white transition-colors">
                  Don’t have an account? <span className="text-blue-400 font-bold ml-1 border-b border-blue-400/30 hover:border-blue-400">Sign up</span>
                </button>
                <button onClick={() => switchMode("forgot")} className="text-[13px] font-medium text-white/30 hover:text-white/60 transition-colors">
                  Forgot your password?
                </button>
              </>
            )}
            {mode === "signup" && (
              <button onClick={() => switchMode("login")} className="text-14 font-medium text-white/50 hover:text-white transition-colors">
                Already have an account? <span className="text-blue-400 font-bold ml-1 border-b border-blue-400/30 hover:border-blue-400">Log in</span>
              </button>
            )}
            {mode === "forgot" && (
              <button onClick={() => switchMode("login")} className="text-14 font-medium text-white/50 hover:text-white transition-colors">
                Remembered your password? <span className="text-blue-400 font-bold ml-1 border-b border-blue-400/30 hover:border-blue-400">Back to login</span>
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
