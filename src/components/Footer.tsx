import { Link } from "react-router-dom";
import { Heart, ArrowUpRight, Github, Linkedin, Youtube, Smartphone, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AddToHomeScreenButton } from "@/components/AddToHomeScreenButton";

export function Footer() {
  const [sawPython, setSawPython] = useState<boolean | null>(null);
  const year = useMemo(() => new Date().getFullYear(), []);
  const { user } = useAuth();
  const certificateLink = user ? "/certificate" : "/auth";

  const socials = useMemo(
    () => ({
      github: (import.meta.env.VITE_SOCIAL_GITHUB as string | undefined) || "",
      linkedin: (import.meta.env.VITE_SOCIAL_LINKEDIN as string | undefined) || "",
      youtube: (import.meta.env.VITE_SOCIAL_YOUTUBE as string | undefined) || "",
    }),
    [],
  );

  return (
    <footer className="relative mt-auto border-t border-border bg-card/70 backdrop-blur-md">
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-primary/30 via-python-yellow/25 to-streak-green/30" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* CTA strip */}
        <div className="mb-10 grid gap-3 rounded-2xl border border-border bg-surface-1/70 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Study smarter. Practice daily. Get job-ready.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Lessons, problems, compiler, aptitude, DSA, and career tracks in one place.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Link
              to="/learn"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Start Learning <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/problems"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-surface-2 transition-colors"
            >
              Practice Problems
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="PyMaster" className="w-9 h-9 rounded-xl shadow-sm" decoding="async" />
              <span className="font-extrabold tracking-tight text-foreground text-lg">PyMaster</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-md">
              Crystal-clear Python learning with real practice: lessons, challenges, a built-in compiler, and a career roadmap.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-[11px] text-muted-foreground">Beginner Friendly</span>
              <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-[11px] text-muted-foreground">Daily Practice</span>
              <span className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-[11px] text-muted-foreground">Job Roadmap</span>
            </div>

            <div className="mt-6 flex items-center gap-2">
              {socials.github ? (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
              ) : null}
              {socials.linkedin ? (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              ) : null}
              {socials.youtube ? (
                <a
                  href={socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/90">Product</h4>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/learn" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Lessons</Link></li>
              <li><Link to="/problems" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Problems</Link></li>
              <li><Link to="/compiler" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Compiler</Link></li>
              <li><Link to="/aptitude" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Aptitude</Link></li>
              <li><Link to="/quick-prep" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Quick Prep</Link></li>
            </ul>
          </div>

          {/* Career */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/90">Career</h4>
            <ul className="mt-4 space-y-2.5">
              <li><Link to="/jobs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Python Jobs</Link></li>
              <li><Link to="/dsa" className="text-sm text-muted-foreground hover:text-foreground transition-colors">DSA Mastery</Link></li>
              <li><Link to="/career/data-analysis" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Job Roadmap</Link></li>
              <li><Link to="/leaderboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Leaderboard</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/90">Support</h4>
            <div className="mt-4 space-y-3">
              <div id="download-app" className="rounded-2xl border border-border bg-card px-4 py-3 scroll-mt-24">
                <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-blue-500/10 to-cyan-500/10 p-4">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_45%)] pointer-events-none" />
                  <div className="relative">
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/60 px-3 py-1">
                      <Smartphone className="h-3.5 w-3.5 text-primary" />
                      <span className="text-[11px] font-semibold text-foreground">Mobile App</span>
                    </div>
                    <p className="text-sm font-semibold text-foreground">Download PyMaster App</p>
                    <p className="text-xs text-muted-foreground mb-3">Install once, open instantly, and continue learning from your home screen.</p>
                    <AddToHomeScreenButton variant="footer" />
                    <div className="mt-3 rounded-xl border border-border/70 bg-background/70 px-3 py-2">
                      <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-streak-green" />
                        Safe to install
                      </p>
                      <ul className="mt-1 space-y-1 text-[11px] text-muted-foreground">
                        <li>No extra permissions requested.</li>
                        <li>Low storage. Uninstall anytime.</li>
                        <li>Your learning data stays private.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/donate"
                className="group flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 hover:bg-surface-2 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">Support PyMaster</p>
                  <p className="text-xs text-muted-foreground">Donate via UPI / GPay</p>
                </div>
                <Heart className="h-4 w-4 text-destructive fill-destructive" />
              </Link>

              <Link
                to={certificateLink}
                className="group flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3 hover:bg-surface-2 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">Certificate</p>
                  <p className="text-xs text-muted-foreground">{user ? "Delivered in 2 business days" : "Sign in to unlock"}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>

              <div className="flex flex-wrap gap-2">
                <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
                <span className="text-xs text-muted-foreground/40">•</span>
                <Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                <span className="text-xs text-muted-foreground/40">•</span>
                <Link to="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">About</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Optional Easter egg (collapsed by default) */}
        <details className="mt-10 rounded-2xl border border-border bg-surface-1/60 p-4">
          <summary className="cursor-pointer select-none text-sm font-semibold text-foreground">
            Easter egg
            <span className="ml-2 text-xs font-normal text-muted-foreground">(optional)</span>
          </summary>
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Did you see the Python slithering across your screen?
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => setSawPython(true)}
                className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  sawPython === true ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                Yes, I saw it
              </button>
              <button
                onClick={() => setSawPython(false)}
                className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  sawPython === false ? "bg-destructive text-destructive-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                Not yet
              </button>
            </div>
            {sawPython === true ? (
              <p className="mt-3 text-xs font-medium text-accent">You have been blessed by the Python. Good luck with your coding.</p>
            ) : null}
            {sawPython === false ? (
              <p className="mt-3 text-xs text-muted-foreground">Keep watching. It visits every hour from a random direction.</p>
            ) : null}
          </div>
        </details>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-border pt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} PyMaster. Built by <span className="font-semibold text-foreground">Dinesh Raja M</span>.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "smooth" })}
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
          >
            Back to top <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
