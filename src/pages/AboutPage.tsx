// ============================================================
// ABOUT PAGE — src/pages/AboutPage.tsx
// "About Us" page with team info, mission statement, stats,
// and animated sections using framer-motion.
// ============================================================
import { Link } from "react-router-dom";
import { Users, Target, Heart, Code, BookOpen, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { AboutUsSection } from "@/components/landing/AboutUsSection";
import { Helmet } from "react-helmet-async";
import { siteConfig } from "@/config/site";

import type { Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Helmet>
        <title>About PyMaster | Python Learning Platform</title>
        <meta
          name="description"
          content="Learn about PyMaster, its mission, what the platform offers, and how it helps learners build Python skills through lessons, practice, and projects."
        />
      </Helmet>
      {/* Hero */}
      <section className="relative py-20 px-4">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-4"
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            variants={fadeUp}
            custom={0}
            className="text-4xl md:text-5xl font-bold text-foreground"
          >
            About <span className="text-primary">PyMaster</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            custom={1}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            PyMaster is a free, interactive platform designed to help anyone learn Python programming — from absolute beginners to aspiring professionals.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission */}
      <motion.section
        className="py-16 px-4 bg-secondary/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Our Mission</h2>
          </motion.div>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground leading-relaxed">
            We believe that quality programming education should be accessible to everyone, regardless of their background or financial situation. Our mission is to make learning Python fun, engaging, and effective through hands-on practice, structured lessons, and a supportive learning environment.
          </motion.p>
        </div>
      </motion.section>

      {/* What We Offer */}
      <motion.section
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">What We Offer</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: BookOpen, title: "25+ Structured Lessons", description: "From Python basics to advanced topics, each lesson builds on the last with clear explanations and examples." },
              { icon: Code, title: "180+ Coding Challenges", description: "Practice problems ranging from easy to expert level to sharpen your skills and build confidence." },
              { icon: Trophy, title: "Rewards & Gamification", description: "Earn badges, maintain streaks, and climb the leaderboard as you progress through your learning journey." },
              { icon: Target, title: "Built-in Compiler", description: "Write, run, and test Python code directly in your browser — no setup required." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={scaleIn}
                custom={i}
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-6 rounded-xl border border-border bg-card space-y-3 cursor-default"
              >
                <item.icon className="w-6 h-6 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team */}
      <motion.section
        className="py-16 px-4 bg-secondary/30"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Our Team</h2>
          </motion.div>
          <div className="max-w-sm mx-auto">
            {[
              { name: siteConfig.author, role: siteConfig.role, bio: siteConfig.bio },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                variants={scaleIn}
                custom={i}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-xl border border-border bg-card text-center space-y-2"
              >
                <motion.div
                  className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-2xl font-bold text-primary">{member.name[0]}</span>
                </motion.div>
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-xs text-primary font-medium">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About The Instructor Section */}
      <AboutUsSection />

      {/* Contact / CTA */}
      <motion.section
        className="py-16 px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div variants={fadeUp} custom={0} className="flex items-center justify-center gap-3">
            <Heart className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Get In Touch</h2>
          </motion.div>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground max-w-xl mx-auto">
            Have questions, feedback, or want to collaborate? We'd love to hear from you. Reach out to us anytime!
          </motion.p>
          <motion.div variants={fadeUp} custom={2} className="flex flex-wrap justify-center gap-4">
            <motion.a
              href={`mailto:${siteConfig.contact.email}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Email Us
            </motion.a>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/donate" className="group px-6 py-3 rounded-lg border border-border bg-card text-foreground font-medium hover:bg-secondary transition-colors inline-flex items-center gap-2">
                Support Us ❤️
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-primary"
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
