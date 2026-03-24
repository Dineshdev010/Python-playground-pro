import { useEffect, useMemo, useState } from "react";
import { useProgress } from "@/contexts/ProgressContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Award, Lock, Download, CheckCircle2, ShieldCheck, Sparkles, Star, FileCheck, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { problems } from "@/data/problems";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";

interface CertificateRecord {
  id: string;
  user_id: string;
  rank_level: string;
  issued_at: string;
  metadata: {
    display_name?: string;
    xp?: number;
  } | null;
}

interface CertificatePaymentProfile {
  certificate_fee_paid: boolean | null;
  certificate_fee_amount: number | null;
  certificate_payment_verified_at: string | null;
}

export default function CertificatePage() {
  const { progress } = useProgress();
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [isIssuing, setIsIssuing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [certificate, setCertificate] = useState<CertificateRecord | null>(null);
  const [loadingCertificate, setLoadingCertificate] = useState(true);
  const [paymentProfile, setPaymentProfile] = useState<CertificatePaymentProfile | null>(null);
  const [loadingPaymentStatus, setLoadingPaymentStatus] = useState(true);

  // Qualification: 100 XP means they have completed at least a few lessons or problems
  const isQualified = progress.xp >= 100;
  const qualificationPct = Math.min((progress.xp / 100) * 100, 100);
  const solvedCount = progress.solvedProblems.length;
  const completedLessonsCount = progress.completedLessons.length;
  const totalProblems = problems.length;
  const solvedPct = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;
  const certificateFee = paymentProfile?.certificate_fee_amount ?? 500;
  const isPaymentVerified = paymentProfile?.certificate_fee_paid === true;

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

  const effectiveLevel = certificate?.rank_level || level;
  const accentClass =
    effectiveLevel === "Advanced"
      ? "text-amber-700"
      : effectiveLevel === "Intermediate"
        ? "text-sky-700"
        : "text-emerald-700";
  const accentBorderClass =
    effectiveLevel === "Advanced"
      ? "border-amber-700/30"
      : effectiveLevel === "Intermediate"
        ? "border-sky-700/30"
        : "border-emerald-700/30";
  const accentBgClass =
    effectiveLevel === "Advanced"
      ? "bg-amber-700"
      : effectiveLevel === "Intermediate"
        ? "bg-sky-700"
        : "bg-emerald-700";
  const profileName =
    profile?.displayName ||
    certificate?.metadata?.display_name ||
    localStorage.getItem("pymaster_name") ||
    user?.displayName ||
    user?.email?.split("@")[0] ||
    "Python Student";
  const dateStr = new Date(certificate?.issued_at || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const certId = useMemo(
    () => (certificate ? `PY-${certificate.id.replace(/-/g, "").slice(0, 12).toUpperCase()}` : "Pending issuance"),
    [certificate],
  );
  const pageStats = [
    { label: "XP Earned", value: progress.xp.toLocaleString(), icon: Sparkles },
    { label: "Problems Solved", value: `${solvedCount}/${totalProblems}`, icon: FileCheck },
    { label: "Lessons Finished", value: completedLessonsCount.toString(), icon: CheckCircle2 },
    { label: "Track Progress", value: `${solvedPct}%`, icon: TrendingUp },
  ];
  const actionChecklist = certificate
    ? [
        "Server-issued certificate record created",
        "Certificate ID locked in and ready to verify",
        "Download the final A4 PDF export anytime",
        "Share the PDF in portfolios, resumes, or applications",
      ]
    : [
        "Reach the qualification threshold",
        "Complete the Rs. 500 certificate payment",
        "Certificate record is created automatically on download",
        "Lock your rank and metadata in Supabase",
        "Download the final A4 PDF export",
      ];

  useEffect(() => {
    if (!user) return;

    let active = true;
    setLoadingCertificate(true);

    supabase
      .from("certificates")
      .select("id, user_id, rank_level, issued_at, metadata")
      .eq("user_id", user.uid)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("Certificate load failed", error);
          toast({
            title: "Certificate Unavailable",
            description: "We couldn't load your certificate record yet.",
            variant: "destructive",
          });
        } else {
          setCertificate(data);
        }
      })
      .finally(() => {
        if (active) setLoadingCertificate(false);
      });

    return () => {
      active = false;
    };
  }, [toast, user]);

  useEffect(() => {
    if (!user) return;

    let active = true;
    setLoadingPaymentStatus(true);

    supabase
      .from("profiles")
      .select("certificate_fee_paid, certificate_fee_amount, certificate_payment_verified_at")
      .eq("id", user.uid)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("Payment status load failed", error);
          toast({
            title: "Payment Status Unavailable",
            description: "We couldn't verify your certificate payment status yet.",
            variant: "destructive",
          });
        } else {
          setPaymentProfile(data);
        }
      })
      .finally(() => {
        if (active) setLoadingPaymentStatus(false);
      });

    return () => {
      active = false;
    };
  }, [toast, user]);

  const ensureCertificateRecord = async () => {
    if (certificate) return certificate;

    setIsIssuing(true);
    try {
      const { data, error } = await supabase.rpc("issue_certificate");
      if (error) throw error;

      const nextRecord = Array.isArray(data) ? data[0] : data;
      setCertificate(nextRecord);
      return nextRecord;
    } finally {
      setIsIssuing(false);
    }
  };

  const handleDownloadPDF = async () => {
    const certElement = document.getElementById("certificate-export-area");
    if (!certElement) return;
    
    setIsDownloading(true);
    toast({
      title: "Generating Verified Certificate...",
      description: "Please wait while we render your custom PDF.",
    });

    try {
      await ensureCertificateRecord();

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
      setIsDownloading(false);
    }
  };

  // --------------------------------------------------------------------------
  // LOCKED STATE
  // --------------------------------------------------------------------------
  if (!isQualified) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-24 h-24 bg-surface-2 rounded-full flex items-center justify-center mb-6 ring-8 ring-primary/5">
          <Lock className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4 text-center">Certificate Locked</h1>
        <p className="text-muted-foreground text-center max-w-lg mb-8">
          You need to complete the basics of Python to unlock your certificate. 
          Gain at least <strong className="text-primary">100 XP</strong> by completing lessons or solving problems to qualify!
        </p>
        
        <div className="bg-surface-1 border border-border rounded-2xl p-6 w-full max-w-md shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Qualification Progress</span>
            <span className="text-sm font-bold text-primary">{Math.min(progress.xp, 100)} / 100 XP</span>
          </div>
          <div className="h-3 bg-surface-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000"
              style={{ width: `${qualificationPct}%` }}
            />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-background/70 p-3 text-center">
              <div className="text-lg font-bold text-foreground">{solvedCount}</div>
              <div className="text-xs text-muted-foreground">Problems Solved</div>
            </div>
            <div className="rounded-xl border border-border bg-background/70 p-3 text-center">
              <div className="text-lg font-bold text-foreground">{completedLessonsCount}</div>
              <div className="text-xs text-muted-foreground">Lessons Complete</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loadingPaymentStatus) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-24 h-24 bg-surface-2 rounded-full flex items-center justify-center mb-6 ring-8 ring-primary/5">
          <ShieldCheck className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4 text-center">Checking Payment Status</h1>
        <p className="text-muted-foreground text-center max-w-lg">
          We are verifying whether your certificate fee has been marked as paid.
        </p>
      </div>
    );
  }

  if (!loadingPaymentStatus && !isPaymentVerified) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Helmet>
          <title>Certificate Payment Required | PyMaster</title>
        </Helmet>

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3 flex items-center justify-center gap-3">
            <Award className="w-8 h-8 text-python-yellow" /> Python Mastery Certificate
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            You are qualified for the certificate. The final verified certificate is provided after the
            certificate fee is paid and marked as verified.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="bg-surface-1 p-2 sm:p-4 rounded-xl border border-border shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none opacity-50 mix-blend-multiply">
              <div className="text-3xl sm:text-6xl font-black text-slate-300 -rotate-12 select-none uppercase tracking-widest border-4 border-slate-300 px-8 py-4 rounded-xl">
                PAY Rs. {certificateFee}
              </div>
            </div>
            <div className="overflow-x-auto rounded-lg">
              <div id="certificate-export-area" className="print-certificate bg-[#fcfbf8] relative overflow-hidden flex flex-col justify-between text-center w-full min-w-[800px] aspect-[1.414/1] shadow-inner opacity-95">
                <div className="absolute inset-5 border border-slate-300 z-20 pointer-events-none" />
                <div className={`absolute inset-8 border ${accentBorderClass} z-20 pointer-events-none`} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,246,240,0.98))] z-0" />
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none z-0">
                  <img src="/logo.png" alt="Watermark" className="w-[52%] h-[52%] object-contain grayscale" />
                </div>

                <div className="relative z-30 pt-10 px-14 flex flex-col items-center">
                  <div className="mb-5 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-300 bg-white">
                      <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-500">PyMaster</div>
                      <div className="text-sm uppercase tracking-[0.22em] text-slate-400">Professional Certification</div>
                    </div>
                  </div>

                  <div className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.45em] ${accentClass}`}>
                    Official Certificate
                  </div>
                  <h1 className="text-[42px] font-serif font-semibold tracking-[0.12em] text-slate-900 uppercase">
                    Certificate of Completion
                  </h1>
                  <div className="mt-4 h-px w-40 bg-slate-300" />
                  <div className="mt-6 grid w-full max-w-3xl grid-cols-3 gap-3 text-left">
                    <div className="rounded-md border border-slate-200 bg-white/80 px-4 py-3">
                      <div className="text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-400">Issue Date</div>
                      <div className="mt-1 text-sm font-semibold text-slate-800">Available after payment</div>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white/80 px-4 py-3 text-center">
                      <div className="text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-400">Official Stamp</div>
                      <div className={`mt-1 text-sm font-semibold ${accentClass}`}>Ready for verified issuance</div>
                    </div>
                    <div className="rounded-md border border-slate-200 bg-white/80 px-4 py-3 text-right">
                      <div className="text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-400">Verification QR</div>
                      <div className="mt-1 text-sm font-semibold text-slate-800">Unlock after payment</div>
                    </div>
                  </div>
                </div>

                <div className="relative z-30 flex-1 px-16 py-6 flex flex-col items-center justify-center">
                  <p className="mb-4 text-base italic text-slate-500">This certifies that</p>
                  <h2 className="mb-6 max-w-[760px] border-b border-slate-300 px-6 pb-4 text-5xl font-serif font-semibold text-slate-900 break-words leading-tight">
                    {profileName}
                  </h2>
                  <p className="max-w-3xl text-lg leading-8 text-slate-700">
                    has successfully completed the PyMaster learning pathway and demonstrated
                    proficiency at the <span className={`font-semibold ${accentClass}`}>{effectiveLevel}</span> level in Python programming.
                  </p>
                  <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600">
                    This preview reflects the final professional certificate format. Complete payment to unlock
                    verified issuance and immediate PDF download.
                  </p>

                  <div className="mt-8 grid max-w-3xl grid-cols-2 gap-x-12 gap-y-3 text-left">
                    {skills.map((skill, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`h-1.5 w-1.5 rounded-full ${accentBgClass}`} />
                        <span className="text-[15px] font-medium text-slate-800">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-30 px-16 pb-10 pt-4">
                  <div className="grid grid-cols-[1.2fr_0.8fr_1.2fr] items-end gap-8">
                    <div className="flex items-end gap-4 text-left">
                      <div className="flex h-20 w-20 items-center justify-center rounded-md border border-slate-300 bg-white p-2">
                        <svg viewBox="0 0 100 100" className="h-full w-full text-slate-800" fill="currentColor">
                          <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 0h20v10H40zM40 20h20v10H40zM0 40h10v20H0zM20 40h10v20H20zM70 40h30v10H70zM80 60h20v10H80zM40 40h20v20H40zM50 70h20v10H50zM40 90h10v10H40zM80 80h20v20H80zM60 90h10v10H60z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Verification QR</div>
                        <div className="mt-1 font-mono text-sm font-semibold tracking-[0.12em] text-slate-800">Available after payment</div>
                        <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">Certificate ID locked until payment</div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <div className={`flex h-28 w-28 flex-col items-center justify-center rounded-full border-[6px] border-double ${accentBorderClass} bg-white text-center shadow-sm`}>
                        <Award className={`mb-1 h-7 w-7 ${accentClass}`} />
                        <div className="text-[9px] font-bold uppercase tracking-[0.24em] text-slate-700">Official</div>
                        <div className="mt-1 text-[8px] uppercase tracking-[0.18em] text-slate-400">Preview Stamp</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 text-center">
                      <div>
                        <div className="mb-3 h-12 border-b border-slate-300 flex items-end justify-center pb-2">
                          <span className="text-sm font-semibold text-slate-800">After payment</span>
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Issue Date</div>
                      </div>
                      <div>
                        <div className="mb-3 h-12 border-b border-slate-300 flex items-end justify-center pb-2">
                          <span className="text-sm font-semibold text-slate-800">Verified</span>
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Verification Status</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full bg-card border border-border rounded-xl p-6 shadow-xl">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-primary/5">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground text-center mb-2">Certificate Fee Required</h3>
            <p className="text-sm text-center text-muted-foreground mb-6">
              Pay <strong className="text-foreground">Rs. {certificateFee}</strong> to receive your verified certificate.
              After payment verification, you can instantly download the certificate.
            </p>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Certificate Fee</span>
                <span className="font-bold text-foreground">Rs. {certificateFee}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {[
                "Verified certificate is unlocked only after payment",
                "The certificate record is created automatically when you download",
                "PDF download unlocks as soon as the payment is marked paid",
                "Use the Donate / UPI payment page to complete the fee",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-streak-green mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <Button asChild className="w-full h-12 text-base font-bold">
                <Link to="/donate">Pay Rs. {certificateFee}</Link>
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                After payment, mark your profile as paid in Supabase to unlock instant download.
              </p>
            </div>
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
          Congratulations on achieving the <strong className="text-foreground">{effectiveLevel}</strong> rank.
          {!certificate && " Your certificate record will be created automatically when you download."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {pageStats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card/80 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* CERTIFICATE PREVIEW - FULL REDESIGN BASED ON PROMPT */}
        <div className="flex-1 max-w-[1000px] w-full bg-surface-1 p-2 sm:p-4 rounded-xl border border-border shadow-2xl relative overflow-hidden group">
          
          {/* Watermark before paying */}
          {!certificate && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none opacity-40 mix-blend-multiply">
              <div className="text-4xl sm:text-7xl font-black text-slate-300 -rotate-12 select-none uppercase tracking-widest border-4 border-slate-300 px-8 py-4 rounded-xl">
                UNISSUED
              </div>
            </div>
          )}

          {/* Actual Certificate Document (Optimized for A4 Print: 297x210 aspect) */}
          <div className="overflow-x-auto rounded-lg">
            <div id="certificate-export-area" className="print-certificate bg-[#fcfbf8] relative overflow-hidden flex flex-col justify-between text-center w-full min-w-[800px] aspect-[1.414/1] shadow-inner">
            <div className="absolute inset-5 border border-slate-300 z-20 pointer-events-none" />
            <div className={`absolute inset-8 border ${accentBorderClass} z-20 pointer-events-none`} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,246,240,0.98))] z-0" />
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none z-0">
               <img src="/logo.png" alt="Watermark" className="w-[52%] h-[52%] object-contain grayscale" />
            </div>

            <div className="relative z-30 pt-10 px-14 flex flex-col items-center">
              <div className="mb-5 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-300 bg-white">
                  <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold uppercase tracking-[0.45em] text-slate-500">PyMaster</div>
                  <div className="text-sm uppercase tracking-[0.22em] text-slate-400">Professional Certification</div>
                </div>
              </div>

              <div className={`mb-3 text-[11px] font-semibold uppercase tracking-[0.45em] ${accentClass}`}>
                Official Certificate
              </div>
              <h1 className="text-[42px] font-serif font-semibold tracking-[0.12em] text-slate-900 uppercase">
                Certificate of Completion
              </h1>
              <div className="mt-4 h-px w-40 bg-slate-300" />
              <div className="mt-6 grid w-full max-w-3xl grid-cols-3 gap-3 text-left">
                <div className="rounded-md border border-slate-200 bg-white/80 px-4 py-3">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-400">Issue Date</div>
                  <div className="mt-1 text-sm font-semibold text-slate-800">{dateStr}</div>
                </div>
                <div className="rounded-md border border-slate-200 bg-white/80 px-4 py-3 text-center">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-400">Official Stamp</div>
                  <div className={`mt-1 text-sm font-semibold ${accentClass}`}>PyMaster verified seal</div>
                </div>
                <div className="rounded-md border border-slate-200 bg-white/80 px-4 py-3 text-right">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-400">Verification QR</div>
                  <div className="mt-1 text-sm font-semibold text-slate-800">Credential attached below</div>
                </div>
              </div>
            </div>

            <div className="relative z-30 flex-1 px-16 py-6 flex flex-col items-center justify-center">
              <p className="mb-4 text-base italic text-slate-500">This certifies that</p>
              <h2 className="mb-6 max-w-[760px] border-b border-slate-300 px-6 pb-4 text-5xl font-serif font-semibold text-slate-900 break-words leading-tight">
                {profileName}
              </h2>
              <p className="max-w-3xl text-lg leading-8 text-slate-700">
                has successfully completed the PyMaster learning pathway and demonstrated
                proficiency at the <span className={`font-semibold ${accentClass}`}>{effectiveLevel}</span> level in Python programming.
              </p>
              <p className="mt-4 max-w-3xl text-[15px] leading-7 text-slate-600">
                This certificate recognizes applied understanding of core programming concepts,
                structured problem solving, and practical competency across the following domains.
              </p>

              <div className="mt-8 grid max-w-3xl grid-cols-2 gap-x-12 gap-y-3 text-left">
                {skills.map((skill, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`h-1.5 w-1.5 rounded-full ${accentBgClass}`} />
                    <span className="text-[15px] font-medium text-slate-800">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-30 px-16 pb-10 pt-4">
              <div className="grid grid-cols-[1.2fr_0.8fr_1.2fr] items-end gap-8">
                <div className="flex items-end gap-4 text-left">
                  <div className="flex h-20 w-20 items-center justify-center rounded-md border border-slate-300 bg-white p-2">
                    <svg viewBox="0 0 100 100" className="h-full w-full text-slate-800" fill="currentColor">
                      <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 0h20v10H40zM40 20h20v10H40zM0 40h10v20H0zM20 40h10v20H20zM70 40h30v10H70zM80 60h20v10H80zM40 40h20v20H40zM50 70h20v10H50zM40 90h10v10H40zM80 80h20v20H80zM60 90h10v10H60z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">Verification QR</div>
                    <div className="mt-1 font-mono text-sm font-semibold tracking-[0.12em] text-slate-800">{certId}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                      {certificate ? "Scan-ready credential reference" : "Auto-issued on download"}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className={`flex h-28 w-28 flex-col items-center justify-center rounded-full border-[6px] border-double ${accentBorderClass} bg-white text-center shadow-sm`}>
                    <Award className={`mb-1 h-7 w-7 ${accentClass}`} />
                    <div className="text-[9px] font-bold uppercase tracking-[0.24em] text-slate-700">Official</div>
                    <div className="mt-1 text-[8px] uppercase tracking-[0.18em] text-slate-400">Seal Stamp</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="mb-3 h-12 border-b border-slate-300 flex items-end justify-center pb-2">
                      <span className="text-sm font-semibold text-slate-800">{dateStr}</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Date Issued</div>
                  </div>
                  <div>
                    <div className="mb-3 h-12 border-b border-slate-300 flex flex-col items-center justify-end">
                      <img
                        src="/signature.png"
                        alt="Signature"
                        className="h-11 object-contain mix-blend-multiply opacity-80"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                      <style>{`
                        img:not([src="/signature.png"]) { display: none; }
                        img[src="/signature.png"][style*="display: none"] ~ .signature-fallback {
                          display: block;
                        }
                      `}</style>
                      <span className="signature-fallback hidden font-serif text-lg italic font-semibold text-slate-700">Dinesh Raja M.</span>
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Authorized Signature</div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* PAYMENT & ACTION PANEL */}
        <div className="w-full lg:w-[340px] shrink-0 bg-card border border-border rounded-xl p-6 shadow-xl relative z-10">
          <h3 className="text-xl font-bold text-foreground mb-2">Verified Certificate</h3>
          <div className="mb-5 rounded-2xl border border-border bg-surface-1 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Current Rank</div>
                <div className="text-lg font-bold text-foreground">{effectiveLevel}</div>
              </div>
              <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {certificate ? "Issued" : "Not Issued"}
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Qualification</span>
                <span>{Math.min(progress.xp, 100)} / 100 XP</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-background">
                <div className="h-full bg-primary transition-all duration-700" style={{ width: `${qualificationPct}%` }} />
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-primary/5">
              {certificate ? <CheckCircle2 className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
            </div>
            <h4 className="text-lg font-bold text-center text-foreground">
              {certificate ? "Certificate Ready" : "Ready to Download"}
            </h4>
            <p className="text-sm text-center text-muted-foreground">
              {certificate
                ? "Your certificate is now backed by a server-side record and ready for export."
                : "Your verified certificate record will be created instantly when you download the PDF."}
            </p>

            <ul className="space-y-3">
              {actionChecklist.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-streak-green mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {certificate && (
              <div className="rounded-lg border border-border bg-surface-1 p-3 text-sm">
                <div className="text-muted-foreground">Certificate ID</div>
                <div className="font-mono font-semibold text-foreground break-all">{certId}</div>
                <div className="mt-2 text-xs text-muted-foreground">Issued on {dateStr}</div>
              </div>
            )}

            <div className="pt-4 border-t border-border space-y-3">
              <Button onClick={handleDownloadPDF} disabled={isDownloading || isIssuing || loadingCertificate} className="w-full gap-2 text-base h-12">
                {isDownloading || isIssuing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Preparing Certificate...
                  </span>
                ) : (
                  <>
                    <Download className="w-5 h-5" /> Download Certificate PDF
                  </>
                )}
              </Button>
            </div>

            {!certificate && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
                Your preview is already personalized. When you click download, PyMaster will create the certificate record first and then export the PDF immediately.
              </div>
            )}
          </motion.div>
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
