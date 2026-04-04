// ============================================================
// AUTH PAGE — src/pages/AuthPage.tsx
// Handles user authentication: Login, Signup, and Forgot Password.
// Redesigned with a Python-centric, premium coding environment theme.
// ============================================================

import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, CheckCircle2, Circle, ShieldCheck, TerminalSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

type AuthMode = "login" | "signup" | "forgot";
type PasswordRequirements = {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
};

const AUTH_COPY: Record<AuthMode, { subtitle: string; submit: string }> = {
  login: {
    subtitle: "Welcome back! Keep building your Python mastery.",
    submit: "Initialize Session",
  },
  signup: {
    subtitle: "Import your future. Join the elite Python developers.",
    submit: "Compile Account",
  },
  forgot: {
    subtitle: "Exception raised? We'll help you reset your password.",
    submit: "Send Reset Link",
  },
};

const ReqItem = ({ met, text }: { met: boolean; text: string }) => (
  <motion.div 
    initial={false}
    animate={{ color: met ? "rgb(34, 197, 94)" : "rgb(156, 163, 175)" }}
    className="flex items-center gap-2 text-xs transition-colors font-medium"
  >
    {met ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
    <span>{text}</span>
  </motion.div>
);

function getPasswordRequirements(password: string): PasswordRequirements {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

function getStrengthColor(score: number) {
  if (score <= 2) return "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]";
  if (score <= 4) return "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]";
  return "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]";
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
  const { login, signup, resetPassword } = useAuth();

  const reqs = useMemo(() => getPasswordRequirements(password), [password]);

  const strengthScore = Object.values(reqs).filter(Boolean).length;
  const isPasswordValid = strengthScore === 5;
  const doPasswordsMatch = password === confirmPassword && password.length > 0;
  const strengthColor = getStrengthColor(strengthScore);
  const currentCopy = AUTH_COPY[mode];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "signup") {
      if (!isPasswordValid) {
        toast({ title: "Syntax Error", description: "Your password does not meet security requirements.", variant: "destructive" });
        return;
      }
      if (!doPasswordsMatch) {
        toast({ title: "Mismatch", description: "Passwords must exactly match to proceed.", variant: "destructive" });
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const result = await login(email, password);
        toast({ title: "Session active", description: "You've successfully authenticated." });
        navigate(result.profile?.profileComplete ? "/dashboard" : "/complete-profile");
      } else if (mode === "signup") {
        await signup(email, password, name);
        toast({ title: "Account compiled!", description: "Your coding journey begins now." });
        navigate("/complete-profile");
      } else {
        await resetPassword(email);
        toast({ title: "Signal sent", description: "Check your email for a password reset link." });
        setMode("login");
      }
    } catch (error) {
      toast({
        title: "Runtime Warning",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Try again.",
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

  // Matrix / IDE Line Numbers Array for styling effect
  const lineNumbers = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="w-full min-h-screen flex text-foreground bg-[#0a0a0f]">
      
      {/* Left Panel: Python & IDE Visual Section (Hidden on small screens) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#0d0f14] items-center justify-center border-r border-white/5">
        
        {/* Subtle IDE Grid & Python Accent Gradients */}
        <div 
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-600/10 via-[#0d0f14] to-yellow-500/10 mix-blend-screen" />

        {/* Huge Faded Logo Watermark */}
        <div className="absolute -left-32 -bottom-32 opacity-[0.03] pointer-events-none transform -rotate-12 scale-150">
          <img src="/logo.png" alt="Watermark" className="w-[800px] h-auto blur-[2px]" />
        </div>

        {/* Faux IDE Environment elements */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#0a0a0f] border-r border-white/5 flex flex-col items-center py-6 text-xs text-white/20 font-mono gap-1 select-none pointer-events-none">
          {lineNumbers.map(n => <span key={n}>{n}</span>)}
        </div>

        {/* Central Presentation Content */}
        <div className="relative z-10 pl-24 pr-12 max-w-3xl w-full">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Logo Badge Header */}
            <div className="flex items-center gap-5 mb-10">
              <div className="relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-br from-blue-500 to-yellow-400 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative bg-[#0d0f14] border border-white/10 p-2 rounded-2xl">
                  <img src="/logo.png" alt="PyMaster" className="w-20 h-20 rounded-xl object-contain drop-shadow-2xl" decoding="async" />
                </div>
              </div>
              <div>
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-blue-400 font-mono text-sm mb-1 tracking-widest font-semibold uppercase"
                >
                  <span className="text-yellow-500">import</span> PyMaster
                </motion.div>
                <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                  PyMaster <span className="text-blue-500 font-bold">Pro</span>
                </h1>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold leading-tight text-white mb-6">
              Write cleaner code. <br />
              <span className="text-white/40 italic font-medium relative inline-block">
                Build a smarter future.
                <span className="absolute bottom-2 left-0 w-full h-1 bg-yellow-400/40 transform -skew-x-12 -z-10"></span>
              </span>
            </h2>
            
            <p className="text-lg text-white/50 mb-12 max-w-md leading-relaxed">
              Step into the terminal. Master algorithms, conquer code challenges, and deploy your career to the next level.
            </p>

            {/* Syntax Highlighted Faux Code Card Floating */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="group relative bg-[#0a0a0f] border border-blue-500/20 rounded-2xl p-6 shadow-[0_20px_50px_rgba(37,99,235,0.1)] overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-sky-400 to-yellow-400 opacity-80" />
              <div className="flex items-center gap-2 mb-5">
                <div className="flex gap-1.5 border border-white/5 bg-white/5 rounded-full px-2 py-0.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/80"></div>
                </div>
                <span className="text-xs text-blue-300 ml-2 font-mono flex items-center gap-1.5 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                  <TerminalSquare className="w-3.5 h-3.5"/> auth_system.py
                </span>
              </div>
              <div className="font-mono text-[13px] leading-relaxed overflow-x-auto text-gray-300 space-y-1">
                <div><span className="text-blue-400">class</span> <span className="text-green-400 cursor-text">Developer</span>:</div>
                <div className="pl-6"><span className="text-blue-400">def</span> <span className="text-yellow-200">__init__</span>(<span className="text-orange-300">self</span>, name: <span className="text-teal-300">str</span>):</div>
                <div className="pl-12"><span className="text-orange-300">self</span>.name = name</div>
                <div className="pl-12"><span className="text-orange-300">self</span>.level = <span className="text-purple-400">99</span></div>
                <div className="pl-6 mt-2"><span className="text-blue-400">async def</span> <span className="text-yellow-200">authenticate</span>(<span className="text-orange-300">self</span>) {'->'} <span className="text-teal-300">bool</span>:</div>
                <div className="pl-12 text-gray-500">"""Verifies elite status."""</div>
                <div className="pl-12"><span className="text-blue-400">return await</span> <span className="text-green-400">PyMasterSystem</span>.login(<span className="text-orange-300">self</span>)</div>
              </div>
              
              {/* Pulsing cursor effect */}
              <div className="absolute bottom-6 right-6 w-2 h-4 bg-blue-400 animate-pulse"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-background">
        
        {/* Subtle background glow behind form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-900/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-[420px] relative z-10">
          
          {/* Mobile Header (Only visible when Left Panel is hidden) */}
          <div className="lg:hidden flex flex-col items-center text-center mb-10">
             <div className="relative group mb-4">
               <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
               <div className="relative bg-[#0d0f14] border border-white/10 p-2 rounded-2xl">
                 <img src="/logo.png" alt="PyMaster" className="w-16 h-16 rounded-xl object-contain drop-shadow-lg" decoding="async" />
               </div>
             </div>
             <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-white/70 shadow-sm">
                PyMaster
             </h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">
              {mode === 'login' ? 'System Login' : mode === 'signup' ? 'Create Account' : 'Password Recovery'}
            </h2>
            <p className="text-muted-foreground">{currentCopy.subtitle}</p>
          </div>

          <motion.div 
            layout
            className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/40 relative overflow-hidden"
          >
            {/* Top aesthetic border line matching python colors */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500 via-sky-400 to-yellow-400" />
            
            <form onSubmit={handleSubmit} className="space-y-5 pt-2">
              
              <AnimatePresence mode="popLayout">
                {mode === "signup" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }} 
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ ease: "easeInOut", duration: 0.2 }}
                    className="space-y-1.5"
                  >
                    <Label htmlFor="name" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground ml-1">Developer Name</Label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground group-focus-within:text-blue-500 transition-colors">
                        <User className="w-[18px] h-[18px]" />
                      </div>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        className="pl-10 h-11 bg-background/50 border-input hover:border-blue-500/40 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all font-medium rounded-lg" 
                        required 
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground ml-1">Network Email</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground group-focus-within:text-blue-500 transition-colors">
                    <Mail className="w-[18px] h-[18px]" />
                  </div>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    className="pl-10 h-11 bg-background/50 border-input hover:border-blue-500/40 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all font-medium rounded-lg" 
                    required 
                  />
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {mode !== "forgot" && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-5"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between ml-1">
                        <Label htmlFor="password" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Access Key</Label>
                        {mode === "login" && (
                          <button type="button" onClick={() => switchMode("forgot")} className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium hover:underline underline-offset-4">
                            Reset Key?
                          </button>
                        )}
                      </div>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground group-focus-within:text-blue-500 transition-colors">
                          <Lock className="w-[18px] h-[18px]" />
                        </div>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={mode === "signup" ? "Set secure password" : "Enter password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 pr-10 h-11 bg-background/50 border-input hover:border-blue-500/40 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all font-medium rounded-lg tracking-wide"
                          required
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
                          {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence mode="popLayout">
                      {mode === "signup" && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: "auto" }} 
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-5 overflow-hidden"
                        >
                          {/* Python-styled Strength Meter */}
                          <div className="space-y-3 bg-[#0d0f14] p-4 rounded-xl border border-white/5 shadow-inner">
                            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                              <span className="text-muted-foreground flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5"/> Security Level</span>
                              <span className={isPasswordValid ? "text-green-500" : "text-muted-foreground"}>
                                Lvl {strengthScore}
                              </span>
                            </div>
                            
                            <div className="flex gap-1.5 h-1.5 w-full">
                              {[1, 2, 3, 4, 5].map((block) => (
                                <motion.div 
                                  key={block}
                                  className={`h-full flex-1 rounded-full ${strengthScore >= block ? strengthColor : "bg-white/10"}`}
                                  layout
                                />
                              ))}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-y-2 pt-2">
                              <ReqItem met={reqs.length} text="8+ chars" />
                              <ReqItem met={reqs.upper} text="Uppercase" />
                              <ReqItem met={reqs.lower} text="Lowercase" />
                              <ReqItem met={reqs.number} text="Number" />
                              <ReqItem met={reqs.special} text="Special char" />
                            </div>
                          </div>

                          {/* Confirm Password */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                              <Label htmlFor="confirmPassword" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Verify Key</Label>
                              {confirmPassword.length > 0 && (
                                <span className={`text-[10px] uppercase tracking-widest font-extrabold ${doPasswordsMatch ? "text-green-500" : "text-red-500"}`}>
                                  {doPasswordsMatch ? "OK" : "ERR"}
                                </span>
                              )}
                            </div>
                            <div className="relative group">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-muted-foreground group-focus-within:text-blue-500 transition-colors">
                                <Lock className="w-[18px] h-[18px]" />
                              </div>
                              <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Retype password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`pl-10 pr-10 h-11 bg-background/50 transition-all font-medium rounded-lg tracking-wide ${confirmPassword.length > 0 ? (doPasswordsMatch ? "border-green-500/50 focus-visible:ring-green-500/20" : "border-red-500/50 focus-visible:ring-red-500/20") : "border-input hover:border-blue-500/40 focus-visible:ring-blue-500/20 focus-visible:border-blue-500"}`}
                                required
                              />
                              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground hover:text-foreground transition-colors focus:outline-none">
                                {showConfirmPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className={`w-full h-12 text-[15px] font-semibold rounded-lg overflow-hidden relative group transition-all duration-300 border-none
                    ${mode === "signup" && isPasswordValid && doPasswordsMatch 
                      ? "bg-green-600 hover:bg-green-500 text-white shadow-[0_4px_20px_rgba(34,197,94,0.3)]" 
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_20px_rgba(37,99,235,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(37,99,235,0.4)]"
                    }`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2 font-mono uppercase tracking-wide">
                    {loading ? (
                      <>
                        <span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
                        Executing...
                      </>
                    ) : (
                      <>
                        {currentCopy.submit}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center bg-muted/30 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 px-6 py-5 border-t border-border">
              <p className="text-[13px] text-muted-foreground font-medium tracking-wide flex justify-center gap-1.5">
                {mode === "login" && (
                  <>Missing environment? <button onClick={() => switchMode("signup")} className="text-blue-500 hover:text-blue-400 font-bold transition-colors">Compile new account</button></>
                )}
                {mode === "signup" && (
                  <>Environment exists? <button onClick={() => switchMode("login")} className="text-blue-500 hover:text-blue-400 font-bold transition-colors">Initialize session</button></>
                )}
                {mode === "forgot" && (
                  <>Exception resolved? <button onClick={() => switchMode("login")} className="text-blue-500 hover:text-blue-400 font-bold transition-colors">Return to login</button></>
                )}
              </p>
            </div>
            
          </motion.div>
        </div>
      </div>
    </div>
  );
}
