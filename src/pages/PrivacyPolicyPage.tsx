// ============================================================
// PRIVACY POLICY PAGE — src/pages/PrivacyPolicyPage.tsx
// Legal privacy policy page for PyMaster.
// ============================================================

import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/config/site";

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Helmet>
        <title>Privacy Policy | PyMaster</title>
        <meta
          name="description"
          content="Read the PyMaster privacy policy covering account data, progress tracking, local storage, and how the platform handles user information."
        />
      </Helmet>
      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: March 2026</p>
        </div>
      </div>

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            PyMaster is committed to protecting your privacy. We collect minimal information necessary to provide our services:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li><strong className="text-foreground">Account Information:</strong> Email address, display name, and profile picture when you sign up.</li>
            <li><strong className="text-foreground">Learning Progress:</strong> Solved problems, completed lessons, XP, streaks, and wallet balance — stored locally on your device.</li>
            <li><strong className="text-foreground">Usage Data:</strong> Basic analytics to improve the platform (pages visited, features used).</li>
          </ul>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Data</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li>To provide and improve our learning platform</li>
            <li>To track your progress and award achievements</li>
            <li>To display your profile on the leaderboard (if opted in)</li>
            <li>To send important service updates (not marketing emails)</li>
          </ul>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">3. Data Storage</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            PyMaster stores some learning state <strong className="text-foreground">locally on your device</strong> using browser localStorage for speed and convenience.
            Account authentication and synced profile data are managed through <strong className="text-foreground">Supabase</strong>. We do not sell your personal data to third parties.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">4. Cookies & Local Storage</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use localStorage to save your preferences, progress, theme settings, and lightweight cached data. Essential authentication and platform services may use cookies or browser storage where required for sign-in and security.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">5. Your Rights</h2>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
            <li><strong className="text-foreground">Access:</strong> You can view all your data in the Dashboard.</li>
            <li><strong className="text-foreground">Delete:</strong> Clear your browser data to remove all locally stored progress.</li>
            <li><strong className="text-foreground">Export:</strong> Your progress data is available in your browser's developer tools.</li>
            <li><strong className="text-foreground">Account Deletion:</strong> Contact us to permanently delete your account.</li>
          </ul>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">6. Children's Privacy</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            PyMaster is designed for learners of all ages. We do not knowingly collect personal information from children under 13 without parental consent.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">7. Advertising & Sponsor Content</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            PyMaster may show clearly labeled sponsor content or advertising on selected public pages. These placements are intended to stay separate from core learning actions such as code execution, certificate actions, and account security flows.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">8. Contact</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you have privacy questions or want to request account deletion, contact us at <a className="text-primary hover:underline" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">7. Contact Us</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you have questions about this Privacy Policy, please reach out through our{" "}
            <Link to="/about" className="text-primary hover:underline">About page</Link> or email us at{" "}
            <span className="text-foreground font-medium">support@pymaster.dev</span>.
          </p>
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved. Built with ❤️ by {siteConfig.author}.
          </p>
        </div>
      </div>
    </div>
  );
}
