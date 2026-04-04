import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ShieldCheck, Copy, Share2, ArrowLeft, BadgeCheck, CalendarDays, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { getPublicUrl } from "@/lib/public-url";

type VerifiedCertificate = {
  id: string;
  user_id: string;
  rank_level: string;
  issued_at: string;
  metadata?: {
    display_name?: string;
    xp?: number;
  } | null;
};

export default function CertificateVerificationPage() {
  const { certificateId } = useParams();
  const { toast } = useToast();
  const [certificate, setCertificate] = useState<VerifiedCertificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!certificateId) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    supabase
      .rpc("verify_certificate", { certificate_uuid: certificateId })
      .then(({ data, error }) => {
        if (!active) return;

        if (error) {
          console.error("Certificate verification failed", error);
          setCertificate(null);
          return;
        }

        const nextCertificate = Array.isArray(data) ? data[0] : data;
        setCertificate(nextCertificate || null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [certificateId]);

  const publicUrl = getPublicUrl(certificateId ? `/certificate/verify/${certificateId}` : "/certificate");
  const publicCertId = useMemo(() => {
    if (!certificate) return "Unavailable";
    return `PY-${certificate.id.replace(/-/g, "").slice(0, 12).toUpperCase()}`;
  }, [certificate]);
  const holderName = certificate?.metadata?.display_name || "PyMaster Learner";
  const issuedOn = certificate
    ? new Date(certificate.issued_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const shareText = certificate
    ? `${holderName}'s PyMaster certificate is verified.\nCertificate ID: ${publicCertId}\nLevel: ${certificate.rank_level}`
    : "";

  const handleShare = async () => {
    if (!certificate) return;

    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: `${holderName}'s PyMaster Certificate`,
          text: shareText,
          url: publicUrl,
        });
        return;
      }

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${shareText}\n${publicUrl}`);
        toast({
          title: "Verification link copied",
          description: "The certificate verification link is ready to share.",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      toast({
        title: "Share failed",
        description: "We couldn't share this certificate right now.",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    if (!certificate) return;

    try {
      if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
        toast({
          title: "Copy not supported",
          description: "Your browser does not support clipboard copy here yet.",
          variant: "destructive",
        });
        return;
      }

      await navigator.clipboard.writeText(`${shareText}\n${publicUrl}`);
      toast({
        title: "Copied",
        description: "Certificate verification details copied to clipboard.",
      });
    } catch {
      toast({
        title: "Copy failed",
        description: "We couldn't copy the certificate details.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="rounded-3xl border border-border bg-card p-8 text-center">
          <div className="text-lg font-semibold text-foreground">Verifying certificate...</div>
          <div className="mt-2 text-sm text-muted-foreground">Checking the certificate ID against PyMaster records.</div>
        </div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Helmet>
          <title>Certificate Not Found | PyMaster</title>
        </Helmet>
        <div className="rounded-3xl border border-border bg-card p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div className="mt-4 text-2xl font-bold text-foreground">Certificate not found</div>
          <div className="mt-2 text-sm text-muted-foreground">
            This certificate ID does not match a verified PyMaster certificate.
          </div>
          <Link to="/" className="mt-5 inline-flex">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Helmet>
        <title>{holderName} Certificate Verification | PyMaster</title>
      </Helmet>

      <div className="rounded-[2rem] border border-primary/15 bg-gradient-to-br from-background via-background to-primary/5 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-streak-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-streak-green">
              <BadgeCheck className="w-4 h-4" />
              Verified Certificate
            </div>
            <h1 className="mt-4 text-3xl font-bold text-foreground">{holderName}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This certificate has been verified against the official PyMaster record.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" className="gap-2" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button type="button" variant="outline" className="gap-2" onClick={handleCopy}>
              <Copy className="w-4 h-4" />
              Copy Link
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card/80 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Award className="w-4 h-4 text-primary" />
              Certificate Level
            </div>
            <div className="mt-2 text-2xl font-bold text-foreground">{certificate.rank_level}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card/80 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="w-4 h-4 text-primary" />
              Issued On
            </div>
            <div className="mt-2 text-lg font-bold text-foreground">{issuedOn}</div>
          </div>
          <div className="rounded-2xl border border-border bg-card/80 p-5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Certificate ID
            </div>
            <div className="mt-2 break-all font-mono text-sm font-bold text-foreground">{publicCertId}</div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card/80 p-6">
          <h2 className="text-lg font-semibold text-foreground">Verification Summary</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            PyMaster confirms that this certificate was issued to <span className="font-semibold text-foreground">{holderName}</span>
            {typeof certificate.metadata?.xp === "number" ? <> after reaching <span className="font-semibold text-foreground">{certificate.metadata.xp.toLocaleString()} XP</span></> : null}
            {" "}and achieving the <span className="font-semibold text-foreground">{certificate.rank_level}</span> level.
          </p>
        </div>
      </div>
    </div>
  );
}
