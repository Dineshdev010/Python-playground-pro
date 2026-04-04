import { Helmet } from "react-helmet-async";
import { Mail, MessageSquare, Globe, HeartHandshake } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Helmet>
        <title>Contact | PyMaster</title>
        <meta
          name="description"
          content="Contact PyMaster for support, feedback, partnerships, or general questions."
        />
      </Helmet>

      <div className="rounded-[2rem] border border-primary/15 bg-gradient-to-br from-background via-background to-primary/5 p-6 sm:p-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            <HeartHandshake className="h-3.5 w-3.5" />
            Contact PyMaster
          </div>
          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-foreground">Get in touch</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Reach out if you have feedback, found a bug, want to collaborate, or need help with the platform.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="rounded-2xl border border-border bg-card/80 p-5 hover:border-primary/30"
          >
            <Mail className="h-5 w-5 text-primary" />
            <div className="mt-3 text-lg font-semibold text-foreground">Email</div>
            <div className="mt-1 text-sm text-muted-foreground break-all">{siteConfig.contact.email}</div>
          </a>

          <a
            href={siteConfig.donations.buyMeACoffee}
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-border bg-card/80 p-5 hover:border-primary/30"
          >
            <MessageSquare className="h-5 w-5 text-primary" />
            <div className="mt-3 text-lg font-semibold text-foreground">Support</div>
            <div className="mt-1 text-sm text-muted-foreground">Support PyMaster or send a quick note through Buy Me a Coffee.</div>
          </a>

          <a
            href="https://pymaster.pro"
            target="_blank"
            rel="noreferrer"
            className="rounded-2xl border border-border bg-card/80 p-5 hover:border-primary/30"
          >
            <Globe className="h-5 w-5 text-primary" />
            <div className="mt-3 text-lg font-semibold text-foreground">Website</div>
            <div className="mt-1 text-sm text-muted-foreground">Use the live site for product feedback and feature requests.</div>
          </a>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card/80 p-5">
          <h2 className="text-lg font-semibold text-foreground">Best message to send</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Include the page you were using, what happened, and what you expected instead. If it is a bug, a screenshot and the browser/device name helps a lot.
          </p>
        </div>
      </div>
    </div>
  );
}
