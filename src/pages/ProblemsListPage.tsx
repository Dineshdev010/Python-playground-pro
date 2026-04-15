// ============================================================
// PROBLEMS LIST PAGE — src/pages/ProblemsListPage.tsx
// Displays all coding problems with difficulty filters, search,
// serial numbers, and solved/unsolved indicators.
// ============================================================
import { useState } from "react";
import { Link } from "react-router-dom";
import { problems, getDifficultyColor, getDifficultyBg } from "@/data/problems";
import { useProgress } from "@/contexts/ProgressContext";
import { getRewardForDifficulty } from "@/lib/progress";
import { Code, CheckCircle2, ChevronRight, Wallet, Search } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { CompanyBadge } from "@/components/CompanyBadge";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProblemsListPage() {
  const { progress } = useProgress();
  const { language } = useLanguage();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const canonical = "https://pymaster.pro/problems";

  const companyOptions = ["all", ...Array.from(new Set(problems.flatMap((problem) => problem.companies ?? []))).sort()];

  const filtered = problems
    .filter(p => filter === "all" || p.difficulty === filter)
    .filter(p => companyFilter === "all" || p.companies?.includes(companyFilter))
    .filter((p) => {
      const query = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(query) ||
        p.companies?.some((company) => company.toLowerCase().includes(query))
      );
    });

  // Build a serial number map: each problem gets a global index (1-based)
  const serialMap = new Map<string, number>();
  problems.forEach((p, i) => serialMap.set(p.id, i + 1));

  const difficultyFilters = ["all", "basic", "junior", "intermediate", "advanced", "expert"] as const;
  const filterCounts = {
    all: problems.length,
    basic: problems.filter(p => p.difficulty === "basic").length,
    junior: problems.filter(p => p.difficulty === "junior").length,
    intermediate: problems.filter(p => p.difficulty === "intermediate").length,
    advanced: problems.filter(p => p.difficulty === "advanced").length,
    expert: problems.filter(p => p.difficulty === "expert").length,
  };

  const text = {
    english: {
      title: "Coding Challenges",
      solved: "solved",
      searchPlaceholder: "Search problems...",
      filterByCompany: "Filter by company",
      allCompanies: "All companies",
      resultFor: "result",
      resultsFor: "results",
      noProblems: "No problems found",
      clearFilters: "Clear filters",
      all: "All",
    },
    tamil: {
      title: "கோடிங் சவால்கள்",
      solved: "தீர்வு செய்யப்பட்டவை",
      searchPlaceholder: "பிரச்சினைகளை தேடுங்கள்...",
      filterByCompany: "நிறுவனம் மூலம் வடிகட்டு",
      allCompanies: "அனைத்து நிறுவனங்கள்",
      resultFor: "முடிவு",
      resultsFor: "முடிவுகள்",
      noProblems: "பிரச்சினைகள் கிடைக்கவில்லை",
      clearFilters: "வடிகட்டலை நீக்கு",
      all: "அனைத்தும்",
    },
    kannada: {
      title: "ಕೋಡಿಂಗ್ ಸವಾಲುಗಳು",
      solved: "ಪರಿಹರಿಸಲಾಗಿದೆ",
      searchPlaceholder: "ಪ್ರಶ್ನೆಗಳನ್ನು ಹುಡುಕಿ...",
      filterByCompany: "ಕಂಪನಿ ಪ್ರಕಾರ ಫಿಲ್ಟರ್",
      allCompanies: "ಎಲ್ಲಾ ಕಂಪನಿಗಳು",
      resultFor: "ಫಲಿತಾಂಶ",
      resultsFor: "ಫಲಿತಾಂಶಗಳು",
      noProblems: "ಯಾವ ಪ್ರಶ್ನೆಯೂ ಸಿಕ್ಕಿಲ್ಲ",
      clearFilters: "ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ",
      all: "ಎಲ್ಲಾ",
    },
    telugu: {
      title: "కోడింగ్ ఛాలెంజెస్",
      solved: "పరిష్కరించినవి",
      searchPlaceholder: "సమస్యలను వెతకండి...",
      filterByCompany: "కంపెనీ ఆధారంగా ఫిల్టర్",
      allCompanies: "అన్ని కంపెనీలు",
      resultFor: "ఫలితం",
      resultsFor: "ఫలితాలు",
      noProblems: "సమస్యలు కనబడలేదు",
      clearFilters: "ఫిల్టర్లు తొలగించు",
      all: "అన్ని",
    },
    hindi: {
      title: "कोडिंग चुनौतियां",
      solved: "हल किए गए",
      searchPlaceholder: "समस्याएं खोजें...",
      filterByCompany: "कंपनी के अनुसार फ़िल्टर",
      allCompanies: "सभी कंपनियां",
      resultFor: "परिणाम",
      resultsFor: "परिणाम",
      noProblems: "कोई समस्या नहीं मिली",
      clearFilters: "फ़िल्टर हटाएं",
      all: "सभी",
    },
  } as const;
  const t = text[language];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Helmet>
        <title>Python Problems | Practice Coding Challenges on PyMaster</title>
        <meta
          name="description"
          content="Practice Python coding challenges from basic to expert difficulty with rewards, progress tracking, and built-in problem pages."
        />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content="Python Problems | PyMaster" />
        <meta property="og:description" content="Practice Python coding challenges from basic to expert difficulty with rewards, progress tracking, and built-in problem pages." />
      </Helmet>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {progress.solvedProblems.length}/{problems.length} {t.solved}
          </p>
        </div>
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-surface-1 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-none">
        {difficultyFilters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "all" ? t.all : f}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              filter === f ? "bg-primary-foreground/20" : "bg-muted"
            }`}>
              {filterCounts[f]}
            </span>
          </button>
        ))}
      </div>

      {/* Results count */}
      {search && (
        <p className="text-xs text-muted-foreground mb-3">
          {filtered.length} {filtered.length !== 1 ? t.resultsFor : t.resultFor} for "{search}"
        </p>
      )}

      <div className="mb-6">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {t.filterByCompany}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          <button
            onClick={() => setCompanyFilter("all")}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
              companyFilter === "all"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.allCompanies}
          </button>
          {companyOptions.filter((company) => company !== "all").map((company) => (
            <button
              key={company}
              onClick={() => setCompanyFilter(company)}
              className={`rounded-full transition-transform ${companyFilter === company ? "scale-[1.02]" : ""}`}
            >
              <CompanyBadge
                company={company}
                compact
                className={companyFilter === company ? "ring-2 ring-primary/20" : "opacity-85 hover:opacity-100"}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Problem list */}
      <div className="space-y-2">
        {filtered.map(problem => {
          const solved = progress.solvedProblems.includes(problem.id);
          const serial = serialMap.get(problem.id) || 0;
          return (
            <Link
              key={problem.id}
              to={`/problems/${problem.id}`}
              className="flex items-center gap-3 px-3 sm:px-4 py-3 bg-card border border-border rounded-lg hover:border-primary/40 transition-colors group"
            >
              {/* Serial number */}
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-xs font-mono text-muted-foreground shrink-0">
                {serial}
              </span>

              {/* Status icon */}
              {solved ? (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-streak-green shrink-0" />
              ) : (
                <Code className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0" />
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {problem.title}
                </div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full border capitalize ${getDifficultyBg(problem.difficulty)} ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                  <span className="text-[10px] sm:text-xs text-reward-gold flex items-center gap-1">
                    <Wallet className="w-3 h-3" /> ${getRewardForDifficulty(problem.difficulty)}
                  </span>
                </div>
                {problem.companies?.length ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {problem.companies.slice(0, 3).map((company) => (
                      <CompanyBadge key={company} company={company} compact />
                    ))}
                  </div>
                ) : null}
              </div>

              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
            </Link>
          );
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Code className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">{t.noProblems}</p>
          <button onClick={() => { setFilter("all"); setSearch(""); setCompanyFilter("all"); }} className="text-primary text-sm mt-2 hover:underline">
            {t.clearFilters}
          </button>
        </div>
      )}
    </div>
  );
}
