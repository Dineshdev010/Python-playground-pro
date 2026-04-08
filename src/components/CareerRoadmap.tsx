import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, type Easing } from "framer-motion";
import {
  BarChart3, Globe, Bot, Database, Briefcase, Server,
  ArrowRight, ChevronRight, BookOpen, Code, Zap,
  CheckCircle2, X
} from "lucide-react";
import { Button } from "@/components/ui/button";

const careerPaths = [
  {
    id: "sql",
    title: "SQL & Databases",
    icon: Database,
    color: "from-primary to-primary/60",
    borderColor: "border-primary/40",
    bgColor: "bg-primary/10",
    textColor: "text-primary",
    salary: "Core Skill",
    description: "Learn SQL from scratch with hands-on queries, joins, and analytics patterns using a built-in practice database.",
    skills: ["SELECT Queries", "Joins & Aggregations", "CTEs & Subqueries", "Window Functions", "Indexes & Transactions"],
    tools: ["SQLite (Practice)", "PostgreSQL", "MySQL", "BigQuery", "SQL Server"],
    lessons: ["SQL Basics", "Filtering & Sorting", "Aggregates & Group By", "Joins", "CTEs & Windows", "DDL & Constraints", "Optimization"],
  },
  {
    id: "data-analysis",
    title: "Data Analysis",
    icon: BarChart3,
    color: "from-primary to-primary/60",
    borderColor: "border-primary/40",
    bgColor: "bg-primary/10",
    textColor: "text-primary",
    salary: "$75K — $120K",
    description: "Analyze datasets, create visualizations, and derive insights using Python, Pandas, and Matplotlib.",
    skills: ["Pandas & NumPy", "Data Visualization", "SQL Queries", "Statistical Analysis", "Jupyter Notebooks"],
    tools: ["Pandas", "Matplotlib", "Seaborn", "Jupyter", "SQL"],
    lessons: ["Python Fundamentals", "Variables & Data Types", "Lists & Arrays", "Dictionaries", "File Handling", "Pandas Mastery", "Case Study Portfolio"],
  },
  {
    id: "web-development",
    title: "Web Development",
    icon: Globe,
    color: "from-streak-green to-streak-green/60",
    borderColor: "border-streak-green/40",
    bgColor: "bg-streak-green/10",
    textColor: "text-streak-green",
    salary: "$70K — $130K",
    description: "Build web applications and APIs with Django, Flask, and FastAPI. Full-stack Python development.",
    skills: ["Django / Flask", "REST APIs", "Database Design", "Authentication", "Deployment"],
    tools: ["Django", "Flask", "FastAPI", "PostgreSQL", "Docker"],
    lessons: ["Functions & Modules", "OOP Basics", "Error Handling", "File Handling", "Decorators", "Auth & Security", "Testing & Debugging"],
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    icon: Bot,
    color: "from-expert-purple to-expert-purple/60",
    borderColor: "border-expert-purple/40",
    bgColor: "bg-expert-purple/10",
    textColor: "text-expert-purple",
    salary: "$100K — $180K",
    description: "Build intelligent systems with TensorFlow, PyTorch, and scikit-learn. From models to production.",
    skills: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Model Deployment"],
    tools: ["TensorFlow", "PyTorch", "scikit-learn", "Keras", "OpenCV"],
    lessons: ["Python Fundamentals", "Lists & Arrays", "OOP Advanced", "Lambda & Map/Filter", "Generators", "Feature Engineering", "Model Evaluation"],
  },
  {
    id: "automation",
    title: "Automation & Scripting",
    icon: Server,
    color: "from-python-yellow to-python-yellow/60",
    borderColor: "border-python-yellow/40",
    bgColor: "bg-python-yellow/10",
    textColor: "text-python-yellow",
    salary: "$60K — $100K",
    description: "Automate repetitive tasks, build scripts, and create bots. DevOps and system administration.",
    skills: ["Shell Scripting", "Web Scraping", "Task Automation", "CI/CD Pipelines", "API Integration"],
    tools: ["Selenium", "BeautifulSoup", "Scrapy", "Ansible", "Requests"],
    lessons: ["Control Flow", "Loops", "Functions & Modules", "File Handling", "Regular Expressions", "CLI Tools & Logging", "Concurrency Basics"],
  },
  {
    id: "data-engineering",
    title: "Data Engineering",
    icon: Database,
    color: "from-reward-gold to-reward-gold/60",
    borderColor: "border-reward-gold/40",
    bgColor: "bg-reward-gold/10",
    textColor: "text-reward-gold",
    salary: "$90K — $160K",
    description: "Design data pipelines, ETL processes, and data warehouses. Scale data infrastructure.",
    skills: ["ETL Pipelines", "Data Modeling", "Cloud Platforms", "Streaming Data", "Data Warehousing"],
    tools: ["Apache Spark", "Airflow", "Kafka", "AWS/GCP", "dbt"],
    lessons: ["Data Structures", "File Handling", "OOP Basics", "Modules & Packages", "Error Handling", "Data Modeling", "Data Quality"],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    icon: Briefcase,
    color: "from-destructive to-destructive/60",
    borderColor: "border-destructive/40",
    bgColor: "bg-destructive/10",
    textColor: "text-destructive",
    salary: "$80K — $150K",
    description: "Penetration testing, security automation, and vulnerability analysis with Python.",
    skills: ["Network Security", "Pen Testing", "Cryptography", "Forensics", "Security Automation"],
    tools: ["Scapy", "Nmap", "Metasploit", "Burp Suite", "Wireshark"],
    lessons: ["Python Fundamentals", "Control Flow", "Modules & Packages", "Regular Expressions", "Error Handling", "Secure Coding", "Detection Basics"],
  },
  {
    id: "git",
    title: "GitHub Mastery",
    icon: Code,
    color: "from-expert-purple to-expert-purple/60",
    borderColor: "border-expert-purple/40",
    bgColor: "bg-expert-purple/10",
    textColor: "text-expert-purple",
    salary: "Essential Skill",
    description: "Master Git and GitHub: from local commits to professional CI/CD workflows and collaborative team projects.",
    skills: ["Local Git (Commit, Branch)", "Pull Requests & Review", "GitHub Actions (CI/CD)", "Conflict Resolution", "Forking & Open Source"],
    tools: ["Git", "GitHub Actions", "SSH / GPG Keys", "Markdown"],
    lessons: ["Git Essentials", "Syncing & Remotes", "PR Workflows", "Conflict Basics", "Automation & Actions", "Profile Portfolio"],
  },
];

const chainFadeIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as Easing },
  }),
};

export function CareerRoadmap() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedPath = careerPaths.find((p) => p.id === selected);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated mesh gradient bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,hsl(212_92%_45%_/_0.06),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,hsl(270_60%_55%_/_0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,hsl(130_55%_42%_/_0.04),transparent_50%)]" />

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={chainFadeIn}
          custom={0}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-expert-purple/10 border border-expert-purple/20 text-expert-purple text-sm mb-4">
            <Briefcase className="w-3.5 h-3.5" /> Career Paths
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Python Job Roadmap
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Tap a career path to explore the skills, tools, and lessons you need
          </p>
        </motion.div>

        {/* Chain / Path Grid */}
        <div className="relative">
          {/* Connection lines SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" style={{ zIndex: 0 }}>
            <defs>
              <linearGradient id="chainGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(212 92% 45%)" stopOpacity="0.15" />
                <stop offset="50%" stopColor="hsl(270 60% 55%)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="hsl(130 55% 42%)" stopOpacity="0.15" />
              </linearGradient>
            </defs>
            {/* Horizontal chain lines */}
            <line x1="16.6%" y1="50%" x2="50%" y2="50%" stroke="url(#chainGrad)" strokeWidth="2" strokeDasharray="6 4" />
            <line x1="50%" y1="50%" x2="83.3%" y2="50%" stroke="url(#chainGrad)" strokeWidth="2" strokeDasharray="6 4" />
          </svg>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 relative z-10">
            {careerPaths.map((path, i) => (
              <motion.button
                key={path.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={chainFadeIn}
                custom={i}
                onClick={() => setSelected(selected === path.id ? null : path.id)}
                className={`group relative text-left rounded-2xl p-5 md:p-6 border transition-all duration-300 cursor-pointer ${
                  selected === path.id
                    ? `${path.borderColor} bg-card shadow-lg shadow-primary/5 -translate-y-1`
                    : "border-border bg-card/60 backdrop-blur-sm hover:border-border hover:bg-card hover:-translate-y-1"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Glow effect on selected */}
                {selected === path.id && (
                  <motion.div
                    layoutId="careerGlow"
                    className={`absolute inset-0 rounded-2xl ${path.bgColor} opacity-30`}
                    transition={{ duration: 0.3 }}
                  />
                )}

                <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${path.color} flex items-center justify-center mb-3 shadow-lg`}>
                    <path.icon className="w-6 h-6 text-primary-foreground" />
                  </div>

                  {/* Chain link dot */}
                  <div className={`absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 hidden md:block ${
                    selected === path.id ? path.borderColor + " " + path.bgColor : "border-border bg-surface-2"
                  }`} />

                  <h3 className="font-bold text-foreground text-base md:text-lg mb-1">{path.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2 hidden sm:block">{path.description}</p>
                  <div className={`text-xs font-semibold ${path.textColor}`}>{path.salary}</div>
                </div>

                <ChevronRight className={`absolute top-5 right-4 w-4 h-4 transition-transform duration-300 ${
                  selected === path.id ? "rotate-90 " + path.textColor : "text-muted-foreground/40"
                }`} />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Expanded Career Detail */}
        <AnimatePresence mode="wait">
          {selectedPath && (
            <motion.div
              key={selectedPath.id}
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" as Easing }}
              className="mt-8 overflow-hidden"
            >
              <div className={`rounded-2xl border ${selectedPath.borderColor} bg-card p-6 md:p-8 relative`}>
                {/* Close button */}
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-2 border border-border flex items-center justify-center hover:bg-surface-3 transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>

                <div className="grid md:grid-cols-3 gap-8">
                  {/* Overview */}
                  <div>
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedPath.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <selectedPath.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{selectedPath.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{selectedPath.description}</p>
                    <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full ${selectedPath.bgColor} ${selectedPath.textColor} text-sm font-semibold`}>
                      💰 {selectedPath.salary}
                    </div>
                  </div>

                  {/* Skills & Tools */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" /> Key Skills
                    </h4>
                    <div className="space-y-2 mb-6">
                      {selectedPath.skills.map((skill, j) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.05 }}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle2 className={`w-4 h-4 ${selectedPath.textColor}`} />
                          <span className="text-sm text-foreground">{skill}</span>
                        </motion.div>
                      ))}
                    </div>

                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4 text-primary" /> Tools & Libraries
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPath.tools.map((tool) => (
                        <span key={tool} className="px-2.5 py-1 rounded-lg bg-surface-2 border border-border text-xs text-muted-foreground font-mono">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Related Lessons */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" /> Start Learning
                    </h4>
                    <div className="space-y-2 mb-6">
                      {selectedPath.lessons.map((lesson, j) => (
                        <motion.div
                          key={lesson}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.05 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-1 border border-border"
                        >
                          <span className={`w-5 h-5 rounded-full ${selectedPath.bgColor} flex items-center justify-center text-[10px] font-bold ${selectedPath.textColor}`}>
                            {j + 1}
                          </span>
                          <span className="text-sm text-foreground">{lesson}</span>
                        </motion.div>
                      ))}
                    </div>

                    <Button asChild className={`w-full gap-2`}>
                      <Link to={`/career/${selectedPath.id}`}>
                        Start This Path <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
