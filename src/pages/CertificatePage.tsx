import { useState } from "react";
import { useProgress } from "@/contexts/ProgressContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Award, Lock, Download, CheckCircle2, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { problems } from "@/data/problems";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Helmet } from "react-helmet-async";

export default function CertificatePage() {
  const { progress } = useProgress();
  const { user } = useAuth();
  const { toast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // Qualification: 100 XP means they have completed at least a few lessons or problems
  const isQualified = progress.xp >= 100;

  // Calculate completion level based on problem difficulty
  const solved = problems.filter(p => progress.solvedProblems.includes(p.id));
  const hasExpert = solved.some(p => p.difficulty === "advanced" || p.difficulty === "expert");
  const hasIntermediate = solved.some(p => p.difficulty === "junior" || p.difficulty === "intermediate");

  // Setup styling and data based on 3 distinct levels requested by UI/UX prompt
  let level = "Beginner";
  let skills = ["Python Syntax", "Control Flow", "Basic Functions", "File I/O"];

  if (hasExpert) {
    level = "Advanced";
    skills = ["Data Structures", "Algorithms", "Object-Oriented Programming", "System Design", "Advanced APIs"];
  } else if (hasIntermediate) {
    level = "Intermediate";
    skills = ["Data Structures", "Object-Oriented Programming", "API Integration", "Error Handling"];
  }

  const profileName = localStorage.getItem("pymaster_name") || user?.displayName || user?.email?.split("@")[0] || "Python Student";
  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const certId = "PY-" + Math.abs((progress.xp * 9973) ^ 0xabc).toString(16).toUpperCase().padStart(8, "0");

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment gateway delay (3 seconds)
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ["#22c55e", "#3b82f6", "#eab308"]
      });
      toast({
        title: "Payment Successful!",
        description: "Your Python Mastery Certificate is now unlocked.",
      });
    }, 3000);
  };

  const handleDownloadPDF = async () => {
    const certElement = document.getElementById("certificate-export-area");
    if (!certElement) return;
    
    setIsProcessing(true);
    toast({
      title: "Generating HD Certificate...",
      description: "Please wait while we render your custom PDF.",
    });

    try {
      const canvas = await html2canvas(certElement, {
        scale: 3, // High resolution
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
      });
      
      pdf.addImage(imgData, "JPEG", 0, 0, 297, 210);
      pdf.save(`PyMaster_Certificate_${profileName.replace(/\s+/g, '_')}.pdf`);
      
    } catch (e) {
      console.error("PDF Generation Error", e);
      toast({ title: "Export Failed", description: "Could not generate PDF.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  // --------------------------------------------------------------------------
  // LOCKED STATE
  // --------------------------------------------------------------------------
  if (!isQualified) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-24 h-24 bg-surface-2 rounded-full flex items-center justify-center mb-6">
          <Lock className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4 text-center">Certificate Locked</h1>
        <p className="text-muted-foreground text-center max-w-lg mb-8">
          You need to complete the basics of Python to unlock your certificate. 
          Gain at least <strong className="text-primary">100 XP</strong> by completing lessons or solving problems to qualify!
        </p>
        
        <div className="bg-surface-1 border border-border rounded-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Qualification Progress</span>
            <span className="text-sm font-bold text-primary">{Math.min(progress.xp, 100)} / 100 XP</span>
          </div>
          <div className="h-3 bg-surface-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000"
              style={{ width: `${Math.min((progress.xp / 100) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // UNLOCKED STATE
  // --------------------------------------------------------------------------
  return (
    <div className="max-w-[1400px] mx-auto px-4 py-12">
      <Helmet>
        <title>Python Mastery Certificate | PyMaster</title>
      </Helmet>

      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3 flex items-center justify-center gap-3">
          <Award className="w-8 h-8 text-python-yellow" /> Python Mastery Certificate
        </h1>
        <p className="text-muted-foreground">
          Congratulations on achieving the <strong className="text-foreground">{level}</strong> rank!
          {!isPaid && " Purchase the official high-resolution certificate below."}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* CERTIFICATE PREVIEW - FULL REDESIGN BASED ON PROMPT */}
        <div className="flex-1 max-w-[1000px] w-full bg-surface-1 p-2 sm:p-4 rounded-xl border border-border shadow-2xl relative overflow-hidden group">
          
          {/* Watermark before paying */}
          {!isPaid && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none opacity-40 mix-blend-multiply">
              <div className="text-4xl sm:text-7xl font-black text-slate-300 -rotate-12 select-none uppercase tracking-widest border-4 border-slate-300 px-8 py-4 rounded-xl">
                PREVIEW ONLY
              </div>
            </div>
          )}

          {/* Actual Certificate Document (Optimized for A4 Print: 297x210 aspect) */}
          <div id="certificate-export-area" className="print-certificate bg-white relative overflow-hidden flex flex-col justify-between text-center w-full min-w-[800px] aspect-[1.414/1] shadow-inner">
            {/* Thick Modern Border Frame */}
            <div className={`absolute inset-4 lg:inset-6 border-[3px] rounded-xl z-20 pointer-events-none ${level === 'Advanced' ? 'border-amber-400/60' : level === 'Intermediate' ? 'border-blue-400/60' : 'border-green-400/60'}`} />
            <div className={`absolute inset-5 lg:inset-7 border border-dashed rounded-lg z-20 pointer-events-none ${level === 'Advanced' ? 'border-amber-300/40' : level === 'Intermediate' ? 'border-blue-300/40' : 'border-green-300/40'}`} />

            {/* Background gradient & Watermark */}
            <div className={`absolute inset-0 bg-gradient-to-br ${level === 'Advanced' ? 'from-amber-50/80 via-white to-orange-50/30' : level === 'Intermediate' ? 'from-blue-50/80 via-white to-cyan-50/30' : 'from-green-50/80 via-white to-emerald-50/30'} z-0`} />
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
               <img src="/logo.png" alt="Watermark" className="w-[60%] h-[60%] object-contain grayscale" />
            </div>

            {/* Decorative Corner Elements */}
            <div className={`absolute top-0 left-0 w-64 h-64 mix-blend-multiply rounded-br-full z-0 opacity-40 bg-gradient-to-br ${level === 'Advanced' ? 'from-amber-200 to-transparent' : level === 'Intermediate' ? 'from-blue-200 to-transparent' : 'from-green-200 to-transparent'}`} />
            <div className={`absolute bottom-0 right-0 w-80 h-80 mix-blend-multiply rounded-tl-full z-0 opacity-30 bg-gradient-to-tl ${level === 'Advanced' ? 'from-amber-300 to-transparent' : level === 'Intermediate' ? 'from-blue-300 to-transparent' : 'from-green-300 to-transparent'}`} />

            {/* Top Section */}
            <div className="relative z-30 pt-10 lg:pt-14 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center shadow-lg">
                  <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                </div>
                <span className="font-bold text-2xl tracking-[0.2em] text-slate-900">
                  PYMASTER
                </span>
              </div>
              
              <h1 className={`text-4xl lg:text-[44px] font-black tracking-[0.2em] uppercase mb-2 font-serif drop-shadow-sm ${level === 'Advanced' ? 'text-amber-600' : level === 'Intermediate' ? 'text-blue-600' : 'text-green-600'}`}>
                Certificate of Achievement
              </h1>
              <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] lg:text-xs font-bold">
                Official Credential of Completion
              </p>
            </div>

            {/* Middle Section */}
            <div className="relative z-30 flex-1 flex flex-col justify-center items-center px-12 w-full">
              <p className="text-slate-500 italic mb-5 font-medium text-lg">This proudly acknowledges that</p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 mb-8 font-serif border-b-[3px] border-slate-200/60 pb-3 px-4 sm:px-12 inline-block drop-shadow-sm w-full max-w-[800px] break-words leading-tight">
                {profileName}
              </h2>
              <p className="text-slate-600 text-lg lg:text-xl max-w-2xl leading-relaxed mb-8">
                has successfully completed the <br/>
                <strong className={`font-bold tracking-wide ${level === 'Advanced' ? 'text-amber-600' : level === 'Intermediate' ? 'text-blue-700' : 'text-green-700'}`}>Python Programming – {level} Level</strong> <br/>
                and has demonstrated practical proficiency in the following core competencies:
              </p>

              {/* Skills Container (Structured Bullet Points) */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 max-w-2xl mx-auto text-left">
                {skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${level === 'Advanced' ? 'bg-amber-500' : level === 'Intermediate' ? 'bg-blue-500' : 'bg-green-500'}`} />
                    <span className="text-sm lg:text-base font-bold text-slate-700">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Section */}
            <div className="relative z-30 pb-10 lg:pb-14 px-12 lg:px-20 flex w-full justify-between items-end">
              
              {/* Left Footer: Verification (QR + ID) */}
              <div className="flex items-end gap-5 text-left">
                <div className="w-24 h-24 bg-white p-2 shadow-sm border border-slate-200 rounded-md flex items-center justify-center">
                  {/* Simulated QR code placeholder using SVG blocks */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-800" fill="currentColor">
                    <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 0h20v10H40zM40 20h20v10H40zM0 40h10v20H0zM20 40h10v20H20zM70 40h30v10H70zM80 60h20v10H80zM40 40h20v20H40zM50 70h20v10H50zM40 90h10v10H40zM80 80h20v20H80zM60 90h10v10H60z" />
                  </svg>
                </div>
                <div className="flex flex-col pb-1">
                  <span className="text-[9px] lg:text-[10px] uppercase text-slate-400 font-black tracking-widest mb-1">Certificate ID</span>
                  <span className="text-sm font-mono font-bold text-slate-700 tracking-wider">{certId}</span>
                  <span className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">pymaster.pro</span>
                </div>
              </div>

              {/* Center Footer: Certificate Seal */}
              <div className="absolute left-1/2 bottom-8 lg:bottom-12 -translate-x-1/2 translate-y-4">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-xl relative ${level === 'Advanced' ? 'bg-gradient-to-br from-amber-400 to-yellow-600' : level === 'Intermediate' ? 'bg-gradient-to-br from-blue-500 to-indigo-700' : 'bg-gradient-to-br from-green-500 to-emerald-700'}`}>
                  <div className="absolute inset-1.5 rounded-full border-[1.5px] border-white/50 border-dashed" />
                  <div className="absolute inset-3 rounded-full border border-white/30" />
                  <div className="text-center text-white flex flex-col items-center">
                    <Award className="w-9 h-9 opacity-95 mb-1.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none drop-shadow-sm">PyMaster<br/>Verified</span>
                  </div>
                </div>
              </div>

              {/* Right Footer: Date & Signature */}
              <div className="flex gap-8 text-center pb-1">
                <div className="flex flex-col items-center">
                  <div className="h-12 border-b-2 border-slate-300 w-32 mb-3 flex items-end justify-center pb-2">
                    <span className="text-slate-800 font-bold text-sm tracking-wide">{dateStr}</span>
                  </div>
                  <span className="text-[9px] lg:text-[10px] text-slate-500 uppercase tracking-widest font-black">Date Issued</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="h-12 border-b-2 border-slate-300 w-44 mb-3 flex flex-col items-center justify-end">
                    {/* Signature Display - Image or Fallback Text */}
                    <img 
                      src="/signature.png" 
                      alt="Signature" 
                      className="h-12 object-contain mix-blend-multiply opacity-80"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <style>{`
                      img:not([src="/signature.png"]) { display: none; }
                      img[src="/signature.png"][style*="display: none"] ~ .signature-fallback {
                        display: block;
                      }
                    `}</style>
                    <span className="signature-fallback hidden font-serif text-xl italic font-bold text-slate-700">Dinesh Raja M.</span>
                  </div>
                  <span className="text-[9px] lg:text-[10px] text-slate-500 uppercase tracking-widest font-black">Dinesh Raja M.</span>
                  <span className="text-[8px] text-slate-400 uppercase tracking-widest mt-1">Authorized Signature</span>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* PAYMENT & ACTION PANEL */}
        <div className="w-full lg:w-[340px] shrink-0 bg-card border border-border rounded-xl p-6 shadow-xl relative z-10">
          <h3 className="text-xl font-bold text-foreground mb-2">Certificate Package</h3>
          
          <AnimatePresence mode="wait">
            {!isPaid ? (
              <motion.div
                key="unpaid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-extrabold text-foreground flex items-center">
                    <IndianRupee className="w-7 h-7 -mr-1" /> 499
                  </span>
                  <span className="text-sm text-muted-foreground line-through">₹999</span>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {[
                    "High-resolution PDF download",
                    "Printable format (A4 landscape)",
                    "Official PyMaster Verification QR",
                    "Lifetime validity tracking"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-streak-green mt-0.5 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={handlePayment} 
                  disabled={isProcessing}
                  className="w-full h-12 text-base font-bold bg-gradient-to-r from-primary to-primary/80 transition-all hover:shadow-lg hover:shadow-primary/30"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing Payment...
                    </span>
                  ) : (
                    "Secure Payment — ₹499"
                  )}
                </Button>
                <p className="text-[10px] text-center text-muted-foreground mt-3">
                  100% Secure Encrypted Transaction. UPI, Cards & Netbanking supported.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="paid"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="w-16 h-16 bg-streak-green/20 text-streak-green rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-streak-green/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-center text-foreground">Purchase Successful!</h4>
                <p className="text-sm text-center text-muted-foreground">
                  Your high-resolution elegant certificate is fully unlocked. You can now download or print it.
                </p>
                
                <div className="pt-4 border-t border-border space-y-3">
                  <Button onClick={handleDownloadPDF} disabled={isProcessing} className="w-full gap-2 text-base h-12">
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Generating HD PDF...
                      </span>
                    ) : (
                      <>
                        <Download className="w-5 h-5" /> Download HD PDF
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-certificate, .print-certificate * {
            visibility: visible;
          }
          .print-certificate {
            position: absolute;
            left: 0;
            top: 0;
            width: 297mm; /* A4 landscape width */
            height: 210mm; /* A4 landscape height */
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          header, aside, nav, footer {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
