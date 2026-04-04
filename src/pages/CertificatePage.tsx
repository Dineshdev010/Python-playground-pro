import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useProgress } from "@/contexts/ProgressContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Award, Lock, Download, CheckCircle2, ShieldCheck, Sparkles, Star, FileCheck, TrendingUp, Share2, Copy, Image as ImageIcon, ArrowUpRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { problems } from "@/data/problems";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";
import { getPublicUrl } from "@/lib/public-url";
import { Link } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import gpayQR from "@/assets/gpay-qr.jpg";
import { siteConfig } from "@/config/site";

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
  const [exportingPreview, setExportingPreview] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const certificateAreaRef = useRef<HTMLDivElement>(null);
  const { width, height } = useWindowSize();
  const [certContainerWidth, setCertContainerWidth] = useState(1000);
  const [containerWrapperEl, setContainerWrapperEl] = useState<HTMLDivElement | null>(null);
  const setContainerWrapperRef = useCallback((node: HTMLDivElement | null) => {
    setContainerWrapperEl(node);
  }, []);

  useEffect(() => {
    if (!containerWrapperEl) return;

    const syncWidth = () => {
      setCertContainerWidth(containerWrapperEl.clientWidth || 1000);
    };
    syncWidth();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", syncWidth);
      return () => window.removeEventListener("resize", syncWidth);
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCertContainerWidth(entry.contentRect.width || 1000);
      }
    });
    observer.observe(containerWrapperEl);
    return () => observer.disconnect();
  }, [containerWrapperEl]);

  const certScale = Math.max(0.2, Math.min(1, certContainerWidth / 1000));

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
  let skills = [
    "Python Syntax",
    "Control Flow",
    "Basic Functions",
    "File I/O",
    "Modules & Packages",
    "Lists and Dictionaries",
    "Debugging Basics",
  ];

  if (hasExpert) {
    level = "Advanced";
    skills = [
      "Data Structures",
      "Algorithms",
      "Object-Oriented Programming",
      "System Design",
      "Advanced APIs",
      "Performance Optimization",
      "Database Integration",
      "Testing and Automation",
    ];
  } else if (hasIntermediate) {
    level = "Intermediate";
    skills = [
      "Data Structures",
      "Object-Oriented Programming",
      "API Integration",
      "Error Handling",
      "Recursion Fundamentals",
      "Code Refactoring",
      "Problem-Solving Patterns",
    ];
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
  const verificationPath = certificate ? `/certificate/verify/${certificate.id}` : "/certificate";
  const certificateUrl = getPublicUrl(verificationPath);
  const certificateShareText = `${profileName} unlocked a ${effectiveLevel} Python certificate on PyMaster.\nCertificate ID: ${certId}\nXP: ${progress.xp.toLocaleString()}`;
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

  const renderCertificateDocument = (
    previewMode: boolean,
    options?: { attachExportRef?: boolean },
  ) => (
    <div
      ref={options?.attachExportRef ? certificateAreaRef : undefined}
      id={options?.attachExportRef ? "certificate-export-area" : undefined}
      className={`print-certificate relative flex flex-col justify-between overflow-hidden text-slate-900 shadow-inner bg-[#fffdf8] ${
        previewMode ? "opacity-95" : ""
      }`}
      style={{ width: "1000px", height: "707px", minWidth: "1000px", minHeight: "707px", boxSizing: "border-box" }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#fffdf8_0%,#f7f1e3_100%)]" />
      <div className="absolute inset-3 border border-[#d6c096]" />
      <div className="absolute inset-6 border border-[#efe2c4]" />
      <div className={`absolute inset-9 border ${accentBorderClass}`} />
      <div className="absolute inset-x-0 top-0 h-6 bg-[linear-gradient(90deg,#b68a3d,#eed7a3,#b68a3d)]" />
      <div className="absolute left-1/2 top-8 h-24 w-[420px] -translate-x-1/2 rounded-full bg-white/45 blur-3xl" />
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <img src="/logo.png" alt="Watermark" className="h-[52%] w-[52%] object-contain grayscale" loading="lazy" decoding="async" />
      </div>
      <div className="absolute left-10 top-10 h-24 w-24 rounded-full border border-[#eadcbc] opacity-70" />
      <div className="absolute right-10 top-10 h-24 w-24 rounded-full border border-[#eadcbc] opacity-70" />
      <div className="absolute bottom-10 left-10 h-24 w-24 rounded-full border border-[#eadcbc] opacity-70" />
      <div className="absolute bottom-10 right-10 h-24 w-24 rounded-full border border-[#eadcbc] opacity-70" />

      <div className="relative z-10 flex flex-1 flex-col justify-between px-16 py-8 text-center">
        <div className="mx-auto flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#d6c096] bg-white shadow-sm">
            <img src="/logo.png" alt="Logo" className="h-9 w-9 object-contain" decoding="async" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold uppercase tracking-[0.48em] text-slate-600">PyMaster</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.28em] text-slate-400">Professional Python Certification</div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.32em] text-slate-400">
          <span>Certificate No. {previewMode ? "Pending" : certId}</span>
          <span className={`${accentClass} font-semibold`}>{effectiveLevel} Track</span>
          <span>{previewMode ? "Preview Copy" : "Verified Issue"}</span>
        </div>

        <div className={`mx-auto mt-5 inline-flex rounded-full border px-6 py-2 text-[10px] font-bold uppercase tracking-[0.38em] ${accentBorderClass} ${accentClass} bg-white/80 shadow-sm`}>
          Corporate Professional Credential
        </div>

        <h1 className="mt-2 font-serif text-[30px] font-semibold uppercase tracking-[0.15em] text-slate-900">
          Professional Certificate of Achievement
        </h1>
        <p className="mt-3 text-[13px] uppercase tracking-[0.34em] text-slate-500">
          Awarded for verified Python capability, applied problem solving, and practical execution
        </p>
        <div className="mx-auto mt-4 flex items-center gap-4">
          <div className="h-px w-28 bg-[#d6c096]" />
          <Star className="h-4 w-4 text-[#b68a3d]" />
          <div className="h-px w-28 bg-[#d6c096]" />
        </div>

        <p className="mt-4 text-base italic text-slate-500">This is to proudly certify that</p>

        <div className="mx-auto mt-2 w-full max-w-[650px] rounded-[20px] border border-[#e6d7b8] bg-white/55 px-8 py-2 shadow-sm">
          <h2 className="break-words font-serif text-[40px] font-semibold leading-tight text-slate-900">
            {profileName}
          </h2>
        </div>

        <p className="mx-auto mt-3 max-w-[780px] text-[16px] leading-7 text-slate-700">
          {previewMode ? (
            <>has completed the PyMaster pathway and is eligible to receive the <span className={`font-semibold ${accentClass}`}>{effectiveLevel}</span> certification in Python programming, problem solving, and practical coding fundamentals.</>
          ) : (
            <>has successfully completed the PyMaster pathway and demonstrated <span className={`font-semibold ${accentClass}`}>{effectiveLevel}</span> proficiency in Python programming, structured problem solving, and practical coding execution.</>
          )}
        </p>

        <div className="mx-auto mt-2 flex max-w-[850px] flex-wrap justify-center gap-2 text-left">
          {skills.map((skill) => (
            <div key={skill} className="flex items-center gap-2 rounded-lg border border-[#eadcbc] bg-white/55 px-3 py-1.5 shadow-sm">
              <div className={`h-2 w-2 rounded-full ${accentBgClass}`} />
              <span className="text-[12px] font-medium text-slate-800">{skill}</span>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="grid grid-cols-[1.15fr_0.8fr_1.15fr] items-end gap-8">
            <div className="text-left">
              <div className="rounded-2xl border border-[#eadcbc] bg-white/55 p-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-slate-400">Credential Reference</div>
                <div className="mt-3 flex items-end gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#d6c096] bg-white p-2 shadow-sm">
                    <svg viewBox="0 0 100 100" className="h-full w-full text-slate-800" fill="currentColor">
                      <path d="M0 0h30v30H0zM10 10h10v10H10zM70 0h30v30H70zM80 10h10v10H80zM0 70h30v30H0zM10 80h10v10H10zM40 0h20v10H40zM40 20h20v10H40zM0 40h10v20H0zM20 40h10v20H20zM70 40h30v10H70zM80 60h20v10H80zM40 40h20v20H40zM50 70h20v10H50zM40 90h10v10H40zM80 80h20v20H80zM60 90h10v10H60z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-mono text-sm font-semibold tracking-[0.12em] text-slate-800">
                      {previewMode ? "Available after payment" : certId}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">
                      {previewMode ? "Generated on final issuance" : "Verification ready"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className={`flex h-24 w-24 flex-col items-center justify-center rounded-full border-[6px] border-double ${accentBorderClass} bg-white/90 text-center shadow-sm`}>
                <Award className={`mb-1 h-6 w-6 ${accentClass}`} />
                <div className="text-[7px] font-bold uppercase tracking-[0.28em] text-slate-700">Official</div>
                <div className="mt-1 text-[6px] uppercase tracking-[0.18em] text-slate-400">
                  {previewMode ? "Preview Seal" : `${effectiveLevel} Level`}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <div className="mb-3 h-12 border-b border-[#d6c096] flex items-end justify-center pb-2">
                  <span className="text-sm font-semibold text-slate-800">{previewMode ? "After payment" : dateStr}</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">Date Issued</div>
              </div>
              <div>
                <div className="mb-3 h-12 border-b border-[#d6c096] flex flex-col items-center justify-end">
                  {!previewMode && (
                    <img
                      src="/signature.png"
                      alt="Signature"
                      className="h-8 object-contain mix-blend-multiply opacity-80"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                  <span className="font-serif text-base italic font-semibold text-slate-700">
                    {previewMode ? "Pending Verification" : "Dinesh Raja M."}
                  </span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">
                  {previewMode ? "Verification Status" : "Authorized Signature"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#e7d2a5] pt-3 text-[10px] uppercase tracking-[0.24em] text-slate-400">
            <span>PyMaster Academy</span>
            <span>Python Certification Board</span>
            <span>{previewMode ? "Preview Draft" : "Official Certificate"}</span>
          </div>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (!user) return;

    let active = true;
    setLoadingCertificate(true);

    const fetchCert = async () => {
      try {
        const { data, error } = await supabase
          .from("certificates")
          .select("id, user_id, rank_level, issued_at, metadata")
          .eq("user_id", user.uid)
          .maybeSingle();
        
        if (!active) return;
        if (error) throw error;
        setCertificate(data);
      } catch (error) {
        if (!active) return;
        console.error("Certificate load failed", error);
        toast({
          title: "Certificate Unavailable",
          description: "We couldn't load your certificate record yet.",
          variant: "destructive",
        });
      } finally {
        if (active) setLoadingCertificate(false);
      }
    };
    fetchCert();

    return () => {
      active = false;
    };
  }, [toast, user]);

  useEffect(() => {
    if (!user) return;

    let active = true;
    setLoadingPaymentStatus(true);

    const fetchPayment = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("certificate_fee_paid, certificate_fee_amount, certificate_payment_verified_at")
          .eq("id", user.uid)
          .maybeSingle();

        if (!active) return;
        if (error) throw error;
        setPaymentProfile(data);
      } catch (error) {
        if (!active) return;
        console.error("Payment status load failed", error);
        toast({
          title: "Payment Status Unavailable",
          description: "We couldn't verify your certificate payment status yet.",
          variant: "destructive",
        });
      } finally {
        if (active) setLoadingPaymentStatus(false);
      }
    };
    fetchPayment();

    return () => {
      active = false;
    };
  }, [toast, user]);

  // Activate Confetti when the user has achieved the certificate!
  useEffect(() => {
    if (isQualified && !loadingPaymentStatus) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 14000); // Stop after 14 seconds
      return () => clearTimeout(timer);
    }
  }, [isQualified, loadingPaymentStatus]);

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
    const certElement = certificateAreaRef.current;
    if (!certElement) return;
    
    setIsDownloading(true);
    toast({
      title: "Generating Verified Certificate...",
      description: "Please wait while we render your custom PDF.",
    });

    try {
      await ensureCertificateRecord();
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const canvas = await html2canvas(certElement, {
        scale: 3, // High resolution
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        removeContainer: true,
        windowWidth: 1000,
        windowHeight: 707,
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

  const handleShareCertificate = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: `${profileName}'s PyMaster Certificate`,
          text: certificateShareText,
          url: certificateUrl,
        });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${certificateShareText}\n${certificateUrl}`);
        toast({
          title: "Certificate copied",
          description: "Your certificate summary and link are ready to share.",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      toast({
        title: "Share failed",
        description: "We couldn't share your certificate right now.",
        variant: "destructive",
      });
    }
  };

  const handleCopyCertificateLink = async () => {
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
        toast({
          title: "Copy not supported",
          description: "Your browser does not support clipboard copy here yet.",
          variant: "destructive",
        });
        return;
      }

      await navigator.clipboard.writeText(`${certificateShareText}\n${certificateUrl}`);
      toast({
        title: "Certificate link copied",
        description: "Your certificate summary is ready to paste.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "We couldn't copy your certificate details.",
        variant: "destructive",
      });
    }
  };

  const handleExportCertificateImage = async () => {
    const certElement = certificateAreaRef.current;
    if (!certElement) return;

    setExportingPreview(true);
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(certElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        removeContainer: true,
        windowWidth: 1000,
        windowHeight: 707,
      });
      const link = document.createElement("a");
      link.download = `${profileName.replace(/\s+/g, "_")}_pymaster_certificate.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast({
        title: "Certificate image ready",
        description: "Your certificate preview has been exported as an image.",
      });
    } catch (error) {
      console.error("Certificate image export failed", error);
      toast({
        title: "Image export failed",
        description: "We couldn't export your certificate image.",
        variant: "destructive",
      });
    } finally {
      setExportingPreview(false);
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

        {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={800} gravity={0.15} style={{ zIndex: 9999, position: 'fixed' }} />}

        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3 flex items-center justify-center gap-3">
              <Award className="w-8 h-8 text-python-yellow" /> Python Mastery Certificate
            </h1>
          </motion.div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            You are qualified for a professional-style certificate. Once payment is completed and verified,
            the certificate will be processed and shared to your email within <strong className="text-foreground">2 business days</strong>.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <motion.div 
            className="bg-surface-1 p-2 sm:p-4 rounded-xl border border-border shadow-2xl relative"
            style={{ perspective: 1500 }}
            initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
          >
            <div ref={setContainerWrapperRef} className="w-full relative overflow-hidden rounded-lg mx-auto" style={{ height: 707 * certScale }}>
              <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${certScale})` }}>
                {renderCertificateDocument(true)}
              </div>
            </div>
            <div className="fixed -left-[10000px] top-0 opacity-0 pointer-events-none" aria-hidden>
              {renderCertificateDocument(true, { attachExportRef: true })}
            </div>
          </motion.div>

          <div className="w-full bg-card border border-border rounded-xl p-6 shadow-xl">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-primary/5">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground text-center mb-2">Certificate Fee Required</h3>
            <p className="text-sm text-center text-muted-foreground mb-6">
              Pay <strong className="text-foreground">Rs. {certificateFee}</strong> to request your professional certificate.
              After payment verification, the certificate will be reviewed and delivered to your registered email within <strong className="text-foreground">2 business days</strong>.
            </p>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Certificate Fee</span>
                <span className="font-bold text-foreground">Rs. {certificateFee}</span>
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-border bg-surface-1 p-4">
              <div className="mb-3 text-center">
                <div className="text-sm font-semibold text-foreground">Scan and pay with GPay / any UPI app</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Use this QR to complete your certificate payment, then mark payment verified to unlock download.
                </div>
              </div>
              <div className="mx-auto w-full max-w-[220px] overflow-hidden rounded-xl border border-border bg-white p-3 shadow-sm">
                <img
                  src={gpayQR}
                  alt="GPay QR code for certificate payment"
                  className="w-full h-auto rounded-lg"
                  loading="lazy"
                />
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {[
                "Professional certificate request starts only after payment",
                "Our team verifies the payment and certificate details",
                "Certificate is shared to your registered email within 2 business days",
                "Scan the QR here using GPay or any UPI app",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-streak-green mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="space-y-3">
              <Button asChild className="w-full h-12 text-base font-bold">
                <Link to="/donate">Open Full Payment Page</Link>
              </Button>
              <Button type="button" variant="outline" className="w-full gap-2" onClick={handleExportCertificateImage} disabled={exportingPreview}>
                <ImageIcon className="w-4 h-4" />
                {exportingPreview ? "Exporting..." : "Export Preview Image"}
              </Button>
              <Button type="button" variant="outline" className="w-full gap-2" onClick={handleCopyCertificateLink}>
                <Copy className="w-4 h-4" />
                Copy Certificate Link
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                After payment, mark your profile as paid in Supabase so your certificate request can be processed.
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
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <Helmet>
        <title>Python Mastery Certificate | PyMaster</title>
      </Helmet>

      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={800} gravity={0.15} style={{ zIndex: 9999, position: 'fixed' }} />}

      <div className="text-center mb-6">
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3 flex items-center justify-center gap-3">
            <Award className="w-8 h-8 text-python-yellow" /> Python Mastery Certificate
          </h1>
        </motion.div>
        <p className="text-muted-foreground">
          Congratulations on achieving the <strong className="text-foreground">{effectiveLevel}</strong> rank.
          {!certificate && " Your professional certificate can be prepared and sent to your email within 2 business days after verification."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 mb-6">
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
        <motion.div 
          className="flex-1 max-w-[1000px] w-full bg-surface-1 p-2 sm:p-4 rounded-xl border border-border shadow-2xl relative"
          style={{ perspective: 1500 }}
          initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
        >
          {/* Actual Certificate Document (Optimized for A4 Print: 297x210 aspect) */}
          <div ref={setContainerWrapperRef} className="w-full relative overflow-hidden rounded-lg mx-auto" style={{ height: 707 * certScale }}>
            <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${certScale})` }}>
              {renderCertificateDocument(false)}
            </div>
          </div>
          <div className="fixed -left-[10000px] top-0 opacity-0 pointer-events-none" aria-hidden>
            {renderCertificateDocument(false, { attachExportRef: true })}
          </div>
        </motion.div>

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
                ? "Your professional certificate record is ready and can be exported or shared."
                : "Once verified, your professional certificate can be delivered to your email within 2 business days."}
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
              <Button type="button" variant="outline" className="w-full gap-2" onClick={handleShareCertificate}>
                <Share2 className="w-4 h-4" />
                Share Certificate
              </Button>
              <Button type="button" variant="outline" className="w-full gap-2" onClick={handleCopyCertificateLink}>
                <Copy className="w-4 h-4" />
                Copy Certificate Link
              </Button>
              <Button type="button" variant="outline" className="w-full gap-2" onClick={handleExportCertificateImage} disabled={exportingPreview}>
                <ImageIcon className="w-4 h-4" />
                {exportingPreview ? "Exporting..." : "Export Preview Image"}
              </Button>
              <a href={certificateUrl} target="_blank" rel="noreferrer" className="inline-flex">
                <Button type="button" variant="ghost" className="w-full gap-2">
                  <ArrowUpRight className="w-4 h-4" />
                  Open Verification Page
                </Button>
              </a>
            </div>

            {!certificate && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
                This preview reflects your personalized certificate style. Final verified delivery can be sent to your registered email within 2 business days.
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
