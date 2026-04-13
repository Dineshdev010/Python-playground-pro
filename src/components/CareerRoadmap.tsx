import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, type Easing } from "framer-motion";
import {
  BarChart3, Globe, Bot, Database, Briefcase, Server,
  ArrowRight, ChevronRight, BookOpen, Code, Zap,
  CheckCircle2, X, Terminal as TerminalIcon, Cloud, Gamepad2, Cpu, Rocket, Target
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
    description: "Learn SQL from scratch to professional analytics patterns using a built-in practice database.",
    skills: ["PostgreSQL & MySQL", "Indexing & Optimization", "Complex Joins", "Window Functions"],
    tools: ["PostgreSQL", "BigQuery", "SQL Server", "dbt"],
    lessons: [
      { label: "SQL Basics", tier: "beginner" },
      { label: "Filtering & Sorting", tier: "beginner" },
      { label: "Aggregates & Group By", tier: "beginner" },
      { label: "Joins & Set Ops", tier: "advanced" },
      { label: "Subqueries & CTEs", tier: "advanced" },
      { label: "Window Functions", tier: "advanced" },
      { label: "Index & Query Plan", tier: "master" },
      { label: "Transactions & ACID", tier: "master" },
      { label: "DB Design & Normalization", tier: "master" },
    ],
    projects: ["Sales Dashboard Data", "Social Media Schema", "Inventory Optimization"],
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
    description: "Derive insights using Python, Pandas, and visualization libraries. From CSVs to Big Data.",
    skills: ["Pandas Mastery", "Data Cleaning", "Matplotlib/Seaborn", "Statistical Inference"],
    tools: ["Pandas", "NumPy", "Jupyter", "Plotly", "PowerBI"],
    lessons: [
      { label: "Python Datatypes", tier: "beginner" },
      { label: "NumPy Arrays", tier: "beginner" },
      { label: "Pandas Loading", tier: "beginner" },
      { label: "EDA Patterns", tier: "advanced" },
      { label: "Data Visualization", tier: "advanced" },
      { label: "Cleaning & Outliers", tier: "advanced" },
      { label: "Hypothesis Testing", tier: "master" },
      { label: "Time Series Analysis", tier: "master" },
      { label: "Real-time Dashboards", tier: "master" },
    ],
    projects: ["Stock Trend Analyzer", "E-commerce Insights", "Sentiment Dashboard"],
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
    description: "Build robust web apps and REST APIs with Django, Flask, and FastAPI.",
    skills: ["API Design", "Authentication/JWT", "Backend Logic", "ORM & Migrations"],
    tools: ["Django", "FastAPI", "Docker", "Redis", "Nginx"],
    lessons: [
      { label: "Flask Basics", tier: "beginner" },
      { label: "HTTP & Routing", tier: "beginner" },
      { label: "SQLite Integration", tier: "beginner" },
      { label: "Django Framework", tier: "advanced" },
      { label: "Auth & Middleware", tier: "advanced" },
      { label: "RESTful API Design", tier: "advanced" },
      { label: "Microservices", tier: "master" },
      { label: "Celery & Task Queues", tier: "master" },
      { label: "WASM & Python", tier: "master" },
    ],
    projects: ["Multi-user CMS", "Real-time Chat App", "Payment Gateway Demo"],
  },
  {
    id: "ai-ml",
    title: "AI & ML",
    icon: Bot,
    color: "from-expert-purple to-expert-purple/60",
    borderColor: "border-expert-purple/40",
    bgColor: "bg-expert-purple/10",
    textColor: "text-expert-purple",
    salary: "$100K — $180K",
    description: "Build intelligent systems from neural networks to LLM integrations.",
    skills: ["Linear Regression", "Neural Networks", "NLP & Transformers", "Deep Learning"],
    tools: ["TensorFlow", "PyTorch", "scikit-learn", "Keras", "HuggingFace"],
    lessons: [
      { label: "Stats for ML", tier: "beginner" },
      { label: "Scikit-Learn Basics", tier: "beginner" },
      { label: "Supervised Models", tier: "beginner" },
      { label: "Unsupervised Learning", tier: "advanced" },
      { label: "Neural Networks", tier: "advanced" },
      { label: "Intro to NLP", tier: "advanced" },
      { label: "Computer Vision", tier: "master" },
      { label: "Generative AI", tier: "master" },
      { label: "RL & Transformers", tier: "master" },
    ],
    projects: ["Image Classifier", "Spam Detector AI", "Text Sum-Bot"],
  },
  {
    id: "automation",
    title: "Automation",
    icon: Server,
    color: "from-python-yellow to-python-yellow/60",
    borderColor: "border-python-yellow/40",
    bgColor: "bg-python-yellow/10",
    textColor: "text-python-yellow",
    salary: "$60K — $100K",
    description: "Automate browser tasks, scrape web data, and build bots.",
    skills: ["Web Scraping", "Browser Automation", "Task Scheduling", "System Admin"],
    tools: ["Selenium", "BeautifulSoup", "Playwright", "Ansible"],
    lessons: [
      { label: "CLI & Scripts", tier: "beginner" },
      { label: "Requests & APIs", tier: "beginner" },
      { label: "BeautifulSoup4", tier: "beginner" },
      { label: "Selenium Driver", tier: "advanced" },
      { label: "RegEx Mastering", tier: "advanced" },
      { label: "Logging & Debugging", tier: "advanced" },
      { label: "Concurrent Scripts", tier: "master" },
      { label: "Cloud Run Tasks", tier: "master" },
      { label: "Custom CLI Tools", tier: "master" },
    ],
    projects: ["Price Drop Tracker", "Automated Daily Report", "Insta-Bot Script"],
  },
  {
    id: "cloud-mlops",
    title: "Cloud & MLOps",
    icon: Cloud,
    color: "from-blue-500 to-blue-400",
    borderColor: "border-blue-500/40",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-500",
    salary: "$110K — $190K",
    description: "Deploy, scale, and monitor Python models and apps in the cloud.",
    skills: ["Docker & K8s", "CI/CD Pipelines", "AWS/Azure/GCP", "Infrastructure as Code"],
    tools: ["Docker", "Kubernetes", "AWS Lambda", "Terraform", "GitHub Actions"],
    lessons: [
      { label: "Intro to Cloud", tier: "beginner" },
      { label: "Linux for Cloud", tier: "beginner" },
      { label: "Virtual Environments", tier: "beginner" },
      { label: "Dockerization", tier: "advanced" },
      { label: "CI/CD for Python", tier: "advanced" },
      { label: "Model Monitoring", tier: "advanced" },
      { label: "Kubernetes Clusters", tier: "master" },
      { label: "Serverless Scaling", tier: "master" },
      { label: "FinOps & Security", tier: "master" },
    ],
    projects: ["Scalable Image API", "Auto-ML Pipeline", "Global Cloud Dashboard"],
  },
  {
    id: "game-dev",
    title: "Game Development",
    icon: Gamepad2,
    color: "from-pink-500 to-rose-400",
    borderColor: "border-rose-500/40",
    bgColor: "bg-rose-500/10",
    textColor: "text-rose-500",
    salary: "$70K — $120K",
    description: "Build 2D/3D games and simulated environments in Python.",
    skills: ["Game Loops", "Physics Engines", "Collision Logic", "Asset Management"],
    tools: ["Pygame", "Ursina", "Panda3D", "Arcade"],
    lessons: [
      { label: "Game Main Loop", tier: "beginner" },
      { label: "Input Controls", tier: "beginner" },
      { label: "Sprites & Art", tier: "beginner" },
      { label: "Collision Detection", tier: "advanced" },
      { label: "Game State Management", tier: "advanced" },
      { label: "Sound & Animations", tier: "advanced" },
      { label: "AI Pathfinding", tier: "master" },
      { label: "Shaders in Ursina", tier: "master" },
      { label: "Multiplayer Engine", tier: "master" },
    ],
    projects: ["Retro Space Shooter", "3D Platformer Demo", "RPG Inventory Engine"],
  },
  {
    id: "iot-robotics",
    title: "IoT & Hardware",
    icon: Cpu,
    color: "from-amber-600 to-amber-500",
    borderColor: "border-amber-600/40",
    bgColor: "bg-amber-600/10",
    textColor: "text-amber-600",
    salary: "$80K — $140K",
    description: "Program hardware, sensors, and bots using MicroPython.",
    skills: ["GPIO Control", "Sensor Integration", "Protocols (I2C/SPI)", "Embedded Systems"],
    tools: ["MicroPython", "Raspberry Pi", "Arduino (Python)", "ESP32"],
    lessons: [
      { label: "Hardware Basics", tier: "beginner" },
      { label: "MicroPython Intro", tier: "beginner" },
      { label: "LED / Switch Logic", tier: "beginner" },
      { label: "Sensor Readings", tier: "advanced" },
      { label: "Serial Communication", tier: "advanced" },
      { label: "OLED Displays", tier: "advanced" },
      { label: "Robotic Arm Control", tier: "master" },
      { label: "Firmware Optimization", tier: "master" },
      { label: "Remote Monitoring", tier: "master" },
    ],
    projects: ["Smart Home Hub", "Weather Station Bot", "Servo-Robot Crawler"],
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
    description: "Build robust data pipelines and scale big data architecture.",
    skills: ["ETL Design", "Workflow Orchestration", "Cloud Warehousing", "Streaming"],
    tools: ["Apache Spark", "Airflow", "Kafka", "Snowflake", "dbt"],
    lessons: [
      { label: "Data Modeling", tier: "beginner" },
      { label: "Batch vs Streaming", tier: "beginner" },
      { label: "Basic ETL Pattern", tier: "beginner" },
      { label: "Airflow Workflows", tier: "advanced" },
      { label: "Distributed NumPy", tier: "advanced" },
      { label: "Delta Lakes", tier: "advanced" },
      { label: "Kafka Real-time", tier: "master" },
      { label: "Advanced Spark SQL", tier: "master" },
      { label: "Data Mesh Principles", tier: "master" },
    ],
    projects: ["Big Data Warehouse", "Real-time Log Processor", "Auto-ETL Service"],
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
    description: "Penetration testing and security automation with Python.",
    skills: ["Network Security", "Crypto Algorithms", "Vulnerability Auth", "Pentesting"],
    tools: ["Scapy", "Nmap", "Metasploit", "Burp Suite"],
    lessons: [
      { label: "Networking Basics", tier: "beginner" },
      { label: "Python Socket lib", tier: "beginner" },
      { label: "Regex for Logs", tier: "beginner" },
      { label: "Packet Forgery", tier: "advanced" },
      { label: "Hashing & Auth", tier: "advanced" },
      { label: "Scan Automation", tier: "advanced" },
      { label: "Exploit Development", tier: "master" },
      { label: "Forensic Scripts", tier: "master" },
      { label: "SIEM Integrations", tier: "master" },
    ],
    projects: ["Port Scanner Tool", "Brute-force Defender", "Encrypted Tunnel"],
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
    description: "Master professional CI/CD and large-scale team collaboration.",
    skills: ["Advanced Branching", "CI/CD Automation", "Conflict Resolution", "Git Hooks"],
    tools: ["Git", "GitHub Actions", "SSH", "Markdown"],
    lessons: [
      { label: "Core Git Loop", tier: "beginner" },
      { label: "Markdown Skills", tier: "beginner" },
      { label: "Feature Branching", tier: "beginner" },
      { label: "Pull Requests", tier: "advanced" },
      { label: "Review workflows", tier: "advanced" },
      { label: "Cherry-pick & Rebase", tier: "advanced" },
      { label: "GitHub Actions", tier: "master" },
      { label: "Self-hosted Runners", tier: "master" },
      { label: "Git Internals (Oid)", tier: "master" },
    ],
    projects: ["Auto-deploy Pipeline", "Open Source Toolkit", "Portfolio Website"],
  },
  {
    id: "linux",
    title: "Linux Mastery",
    icon: TerminalIcon,
    color: "from-streak-green to-streak-green/60",
    borderColor: "border-streak-green/40",
    bgColor: "bg-streak-green/10",
    textColor: "text-streak-green",
    salary: "Dev Essential",
    description: "Professional sysadmin — terminal, permissions, and security.",
    skills: ["Shell Scripting", "User Management", "Networking", "System Security"],
    tools: ["Bash", "systemd", "UFW", "SSH", "cron"],
    lessons: [
      { label: "CLI Fundamentals", tier: "beginner" },
      { label: "File Ops & Perms", tier: "beginner" },
      { label: "Basic Bash Scripting", tier: "beginner" },
      { label: "User Management", tier: "advanced" },
      { label: "SSH & Networking", tier: "advanced" },
      { label: "Cron & Init", tier: "advanced" },
      { label: "Kernel Hardening", tier: "master" },
      { label: "Custom Distro Build", tier: "master" },
      { label: "Advanced I/O Control", tier: "master" },
    ],
    projects: ["Backup Automator", "Server Health Monitor", "Secured SSH Bastion"],
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

function getRoadmapWallpaper(pathId?: string) {
  if (pathId === "web-development") return "linear-gradient(130deg, rgba(14, 23, 42, 0.92), rgba(30, 58, 138, 0.36))";
  if (pathId === "ai-ml") return "linear-gradient(130deg, rgba(17, 24, 39, 0.92), rgba(126, 34, 206, 0.32))";
  if (pathId === "linux") return "linear-gradient(130deg, rgba(10, 20, 16, 0.94), rgba(22, 101, 52, 0.3))";
  if (pathId === "data-engineering") return "linear-gradient(130deg, rgba(32, 26, 12, 0.92), rgba(180, 120, 22, 0.32))";
  if (pathId === "cybersecurity") return "linear-gradient(130deg, rgba(36, 10, 14, 0.92), rgba(185, 28, 28, 0.32))";
  if (pathId === "cloud-mlops") return "linear-gradient(130deg, rgba(15, 23, 42, 0.92), rgba(37, 99, 235, 0.3))";
  if (pathId === "automation") return "linear-gradient(130deg, rgba(38, 31, 12, 0.92), rgba(202, 138, 4, 0.3))";
  if (pathId === "game-dev") return "linear-gradient(130deg, rgba(33, 16, 28, 0.92), rgba(225, 29, 72, 0.3))";
  if (pathId === "iot-robotics") return "linear-gradient(130deg, rgba(39, 26, 13, 0.92), rgba(217, 119, 6, 0.3))";
  if (pathId === "sql") return "linear-gradient(130deg, rgba(11, 24, 29, 0.92), rgba(8, 145, 178, 0.3))";
  if (pathId === "data-analysis") return "linear-gradient(130deg, rgba(16, 21, 35, 0.92), rgba(59, 130, 246, 0.3))";
  if (pathId === "git") return "linear-gradient(130deg, rgba(26, 19, 38, 0.92), rgba(124, 58, 237, 0.3))";
  return "linear-gradient(130deg, rgba(10, 18, 35, 0.92), rgba(59, 130, 246, 0.22))";
}

const roadmapThemeByPathId: Record<string, {
  badgeClass: string;
  pulseClass: string;
  sectionGlowA: string;
  sectionGlowB: string;
  sectionGlowC: string;
  cardIdleClass: string;
  detailPanelClass: string;
}> = {
  sql: {
    badgeClass: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
    pulseClass: "bg-cyan-500",
    sectionGlowA: "bg-[radial-gradient(ellipse_at_20%_50%,hsl(190_85%_45%_/_0.16),transparent_60%)]",
    sectionGlowB: "bg-[radial-gradient(ellipse_at_80%_20%,hsl(212_92%_45%_/_0.09),transparent_50%)]",
    sectionGlowC: "bg-[radial-gradient(ellipse_at_50%_80%,hsl(180_62%_40%_/_0.08),transparent_50%)]",
    cardIdleClass: "hover:border-cyan-500/40 hover:shadow-cyan-500/10",
    detailPanelClass: "bg-gradient-to-br from-card via-card to-cyan-500/5",
  },
  "data-analysis": {
    badgeClass: "bg-primary/10 border-primary/30 text-primary",
    pulseClass: "bg-primary",
    sectionGlowA: "bg-[radial-gradient(ellipse_at_20%_50%,hsl(220_85%_55%_/_0.14),transparent_60%)]",
    sectionGlowB: "bg-[radial-gradient(ellipse_at_80%_20%,hsl(260_62%_52%_/_0.08),transparent_50%)]",
    sectionGlowC: "bg-[radial-gradient(ellipse_at_50%_80%,hsl(210_72%_45%_/_0.08),transparent_50%)]",
    cardIdleClass: "hover:border-primary/40 hover:shadow-primary/10",
    detailPanelClass: "bg-gradient-to-br from-card via-card to-primary/5",
  },
  linux: {
    badgeClass: "bg-streak-green/10 border-streak-green/30 text-streak-green",
    pulseClass: "bg-streak-green",
    sectionGlowA: "bg-[radial-gradient(ellipse_at_20%_50%,hsl(142_72%_29%_/_0.18),transparent_60%)]",
    sectionGlowB: "bg-[radial-gradient(ellipse_at_80%_20%,hsl(210_70%_45%_/_0.1),transparent_50%)]",
    sectionGlowC: "bg-[radial-gradient(ellipse_at_50%_80%,hsl(140_55%_32%_/_0.1),transparent_50%)]",
    cardIdleClass: "hover:border-streak-green/40 hover:shadow-streak-green/10",
    detailPanelClass: "bg-gradient-to-br from-card via-card to-streak-green/5",
  },
  "ai-ml": {
    badgeClass: "bg-expert-purple/10 border-expert-purple/30 text-expert-purple",
    pulseClass: "bg-expert-purple",
    sectionGlowA: "bg-[radial-gradient(ellipse_at_20%_50%,hsl(270_60%_55%_/_0.15),transparent_60%)]",
    sectionGlowB: "bg-[radial-gradient(ellipse_at_80%_20%,hsl(220_85%_55%_/_0.09),transparent_50%)]",
    sectionGlowC: "bg-[radial-gradient(ellipse_at_50%_80%,hsl(280_70%_45%_/_0.09),transparent_50%)]",
    cardIdleClass: "hover:border-expert-purple/40 hover:shadow-expert-purple/10",
    detailPanelClass: "bg-gradient-to-br from-card via-card to-expert-purple/5",
  },
  "web-development": {
    badgeClass: "bg-blue-500/10 border-blue-500/30 text-blue-500",
    pulseClass: "bg-blue-500",
    sectionGlowA: "bg-[radial-gradient(ellipse_at_20%_50%,hsl(212_92%_45%_/_0.15),transparent_60%)]",
    sectionGlowB: "bg-[radial-gradient(ellipse_at_80%_20%,hsl(160_60%_42%_/_0.09),transparent_50%)]",
    sectionGlowC: "bg-[radial-gradient(ellipse_at_50%_80%,hsl(206_72%_40%_/_0.09),transparent_50%)]",
    cardIdleClass: "hover:border-blue-500/40 hover:shadow-blue-500/10",
    detailPanelClass: "bg-gradient-to-br from-card via-card to-blue-500/5",
  },
  automation: {
    badgeClass: "bg-python-yellow/10 border-python-yellow/30 text-python-yellow",
    pulseClass: "bg-python-yellow",
    sectionGlowA: "bg-[radial-gradient(ellipse_at_20%_50%,hsl(45_95%_52%_/_0.13),transparent_60%)]",
    sectionGlowB: "bg-[radial-gradient(ellipse_at_80%_20%,hsl(32_88%_48%_/_0.08),transparent_50%)]",
    sectionGlowC: "bg-[radial-gradient(ellipse_at_50%_80%,hsl(50_85%_48%_/_0.08),transparent_50%)]",
    cardIdleClass: "hover:border-python-yellow/40 hover:shadow-python-yellow/10",
    detailPanelClass: "bg-gradient-to-br from-card via-card to-python-yellow/5",
  },
  "cloud-mlops": {
    badgeClass: "bg-blue-500/10 border-blue-500/30 text-blue-500",
    pulseClass: "bg-blue-500",
    sectionGlowA: "bg-[radial-gradient(ellipse_at_20%_50%,hsl(214_92%_52%_/_0.16),transparent_60%)]",
    sectionGlowB: "bg-[radial-gradient(ellipse_at_80%_20%,hsl(200_80%_50%_/_0.09),transparent_50%)]",
    sectionGlowC: "bg-[radial-gradient(ellipse_at_50%_80%,hsl(222_88%_46%_/_0.08),transparent_50%)]",
    cardIdleClass: "hover:border-blue-500/40 hover:shadow-blue-500/10",
    detailPanelClass: "bg-gradient-to-br from-card via-card to-blue-500/5",
  },
  "game-dev": {
    badgeClass: "bg-rose-500/10 border-rose-500/30 text-rose-400",
    pulseClass: "bg-rose-500",
    sectionGlowA: "bg-[radial-gradient(ellipse_at_20%_50%,hsl(340_82%_58%_/_0.15),transparent_60%)]",
    sectionGlowB: "bg-[radial-gradient(ellipse_at_80%_20%,hsl(320_72%_52%_/_0.1),transparent_50%)]",
    sectionGlowC: "bg-[radial-gradient(ellipse_at_50%_80%,hsl(350_82%_50%_/_0.08),transparent_50%)]",
    cardIdleClass: "hover:border-rose-500/40 hover:shadow-rose-500/10",
    detailPanelClass: "bg-gradient-to-br from-card via-card to-rose-500/5",
  },
  "iot-robotics": {
    badgeClass: "bg-amber-600/10 border-amber-600/30 text-amber-500",
    pulseClass: "bg-amber-600",
    sectionGlowA: "bg-[radial-gradient(ellipse_at_20%_50%,hsl(35_92%_50%_/_0.14),transparent_60%)]",
    sectionGlowB: "bg-[radial-gradient(ellipse_at_80%_20%,hsl(25_90%_45%_/_0.09),transparent_50%)]",
    sectionGlowC: "bg-[radial-gradient(ellipse_at_50%_80%,hsl(42_88%_44%_/_0.08),transparent_50%)]",
    cardIdleClass: "hover:border-amber-600/40 hover:shadow-amber-600/10",
    detailPanelClass: "bg-gradient-to-br from-card via-card to-amber-600/5",
  },
  "data-engineering": {
    badgeClass: "bg-reward-gold/10 border-reward-gold/30 text-reward-gold",
    pulseClass: "bg-reward-gold",
    sectionGlowA: "bg-[radial-gradient(ellipse_at_20%_50%,hsl(42_88%_52%_/_0.15),transparent_60%)]",
    sectionGlowB: "bg-[radial-gradient(ellipse_at_80%_20%,hsl(28_80%_48%_/_0.09),transparent_50%)]",
    sectionGlowC: "bg-[radial-gradient(ellipse_at_50%_80%,hsl(46_85%_46%_/_0.08),transparent_50%)]",
    cardIdleClass: "hover:border-reward-gold/40 hover:shadow-reward-gold/10",
    detailPanelClass: "bg-gradient-to-br from-card via-card to-reward-gold/5",
  },
  cybersecurity: {
    badgeClass: "bg-destructive/10 border-destructive/30 text-destructive",
    pulseClass: "bg-destructive",
    sectionGlowA: "bg-[radial-gradient(ellipse_at_20%_50%,hsl(0_82%_52%_/_0.15),transparent_60%)]",
    sectionGlowB: "bg-[radial-gradient(ellipse_at_80%_20%,hsl(350_78%_48%_/_0.09),transparent_50%)]",
    sectionGlowC: "bg-[radial-gradient(ellipse_at_50%_80%,hsl(10_76%_42%_/_0.08),transparent_50%)]",
    cardIdleClass: "hover:border-destructive/40 hover:shadow-destructive/10",
    detailPanelClass: "bg-gradient-to-br from-card via-card to-destructive/5",
  },
  git: {
    badgeClass: "bg-expert-purple/10 border-expert-purple/30 text-expert-purple",
    pulseClass: "bg-expert-purple",
    sectionGlowA: "bg-[radial-gradient(ellipse_at_20%_50%,hsl(268_62%_54%_/_0.15),transparent_60%)]",
    sectionGlowB: "bg-[radial-gradient(ellipse_at_80%_20%,hsl(230_82%_56%_/_0.09),transparent_50%)]",
    sectionGlowC: "bg-[radial-gradient(ellipse_at_50%_80%,hsl(280_65%_46%_/_0.08),transparent_50%)]",
    cardIdleClass: "hover:border-expert-purple/40 hover:shadow-expert-purple/10",
    detailPanelClass: "bg-gradient-to-br from-card via-card to-expert-purple/5",
  },
  default: {
    badgeClass: "bg-expert-purple/10 border-expert-purple/20 text-expert-purple",
    pulseClass: "bg-primary",
    sectionGlowA: "bg-[radial-gradient(ellipse_at_20%_50%,hsl(212_92%_45%_/_0.06),transparent_60%)]",
    sectionGlowB: "bg-[radial-gradient(ellipse_at_80%_20%,hsl(270_60%_55%_/_0.05),transparent_50%)]",
    sectionGlowC: "bg-[radial-gradient(ellipse_at_50%_80%,hsl(130_55%_42%_/_0.04),transparent_50%)]",
    cardIdleClass: "hover:border-primary/50 hover:shadow-primary/10",
    detailPanelClass: "bg-card",
  },
};

export function CareerRoadmap() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedPath = careerPaths.find((p) => p.id === selected);
  const activeTheme = (selectedPath ? roadmapThemeByPathId[selectedPath.id] : null) || roadmapThemeByPathId.default;
  const activeWallpaper = getRoadmapWallpaper(selectedPath?.id);
  const detailRef = useRef<HTMLDivElement>(null);

  const handleSelect = (id: string) => {
    const newSelected = selected === id ? null : id;
    setSelected(newSelected);
    if (newSelected) {
      // Small delay to let the animation start before scrolling
      setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{
          backgroundImage: activeWallpaper,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.6,
        }}
      />
      {/* Animated mesh gradient bg */}
      <div className={`absolute inset-0 transition-all duration-500 ${activeTheme.sectionGlowA}`} />
      <div className={`absolute inset-0 transition-all duration-500 ${activeTheme.sectionGlowB}`} />
      <div className={`absolute inset-0 transition-all duration-500 ${activeTheme.sectionGlowC}`} />

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={chainFadeIn}
          custom={0}
          className="text-center mb-16"
        >
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm mb-4 transition-colors duration-300 ${activeTheme.badgeClass}`}>
            <Briefcase className="w-3.5 h-3.5" /> Career Paths
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
            Python Job Roadmap
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Tap any career path card to explore the skills, tools, and lessons you need
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2 flex items-center justify-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${activeTheme.pulseClass}`}></span>
            Click any card below to expand details
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
                onClick={() => handleSelect(path.id)}
                className={`group relative text-left rounded-2xl p-5 md:p-6 border transition-all duration-300 cursor-pointer ${
                  selected === path.id
                    ? `${path.borderColor} bg-card shadow-lg shadow-primary/5 -translate-y-1`
                    : `border-border bg-card/60 backdrop-blur-sm hover:bg-card hover:-translate-y-1 hover:shadow-md ${activeTheme.cardIdleClass}`
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Pulsing ring indicator for un-selected cards */}
                {selected !== path.id && (
                  <span className="absolute top-3 left-3 flex h-2.5 w-2.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${activeTheme.pulseClass} opacity-40`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${activeTheme.pulseClass} opacity-70`}></span>
                  </span>
                )}

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

                <ChevronRight className={`absolute top-5 right-4 w-5 h-5 transition-all duration-300 ${
                  selected === path.id
                    ? "rotate-90 " + path.textColor
                    : "text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5"
                }`} />

                {/* 'Tap to explore' label on bottom */}
                <div className={`mt-3 text-[10px] font-medium flex items-center gap-1 transition-opacity duration-200 ${
                  selected === path.id ? "opacity-0" : "opacity-50 group-hover:opacity-100"
                } ${path.textColor}`}>
                  <span>Tap to explore</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Scroll anchor + bounce arrow hint */}
        <div ref={detailRef} className="scroll-mt-8" />

        {/* Expanded Career Detail */}
        <AnimatePresence mode="wait">
          {selectedPath && (
            <motion.div
              key={selectedPath.id}
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" as Easing }}
              className="mt-2 overflow-hidden"
            >
              {/* Bouncing arrow pointing into the panel */}
              <div className="flex justify-center mb-3">
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: 3, duration: 0.5, ease: "easeInOut" }}
                  className="flex flex-col items-center gap-0.5"
                >
                  <span className="text-xs text-muted-foreground">Details below</span>
                  <ChevronRight className="w-5 h-5 text-primary rotate-90" />
                </motion.div>
              </div>
              <div className={`rounded-2xl border ${selectedPath.borderColor} ${activeTheme.detailPanelClass} p-6 md:p-8 relative transition-all duration-500`}>
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
                      <BookOpen className="w-4 h-4 text-primary" /> Learning Journey
                    </h4>
                    <div className="space-y-2 mb-6 max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-border pr-2">
                      {selectedPath.lessons.map((lesson: { label: string; tier: string }, j: number) => (
                        <motion.div
                          key={lesson.label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: j * 0.03 }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-1 border border-border group/lesson"
                        >
                          <span className={`w-5 h-5 shrink-0 rounded-full ${
                            lesson.tier === 'beginner' ? 'bg-streak-green/10 text-streak-green' :
                            lesson.tier === 'advanced' ? 'bg-primary/10 text-primary' : 'bg-expert-purple/10 text-expert-purple'
                          } flex items-center justify-center text-[9px] font-bold border border-current/20`}>
                            {j + 1}
                          </span>
                          <span className="text-[13px] text-foreground flex-1">{lesson.label}</span>
                          <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                            lesson.tier === 'beginner' ? 'border-streak-green/30 text-streak-green bg-streak-green/5' :
                            lesson.tier === 'advanced' ? 'border-primary/30 text-primary bg-primary/5' : 'border-expert-purple/30 text-expert-purple bg-expert-purple/5'
                          }`}>
                            {lesson.tier}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-primary" /> Portfolio Projects
                    </h4>
                    <div className="space-y-1.5 mb-6">
                      {selectedPath.projects.map((proj, k) => (
                        <motion.div
                          key={proj}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (selectedPath.lessons.length * 0.03) + (k * 0.05) }}
                          className="flex items-center gap-2 text-xs text-muted-foreground bg-surface-2/50 p-2 rounded-md border border-border/40"
                        >
                          <Target className="w-3 h-3 text-reward-gold" />
                          <span>{proj}</span>
                        </motion.div>
                      ))}
                    </div>

                    <Button asChild className={`w-full gap-2`}>
                      <Link to={selectedPath.id === 'linux' ? '/linux-learn' : `/career/${selectedPath.id}`}>
                        Master This Path <ArrowRight className="w-4 h-4" />
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
