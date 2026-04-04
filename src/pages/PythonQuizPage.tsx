import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, Sparkles, Target } from "lucide-react";
import { pythonQuizQuestions } from "@/data/pythonQuizQuestions";

const canonical = "https://pymaster.pro/python-quiz-100";
const QUIZ_PROGRESS_STORAGE_KEY = "pymaster_quiz_progress_v1";

type QuizProgressSnapshot = {
  allTotal: number;
  allAnswered: number;
  allScore: number;
  trickyTotal: number;
  trickyAnswered: number;
  trickyScore: number;
  updatedAt: string;
};

export default function PythonQuizPage() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [mode, setMode] = useState<"all" | "tricky">("all");
  const trickyPool = useMemo(() => pythonQuizQuestions.filter((q) => q.topic.startsWith("Tricky:")), []);

  const activeQuestions = useMemo(
    () =>
      mode === "tricky"
        ? pythonQuizQuestions.filter((q) => q.topic.startsWith("Tricky:"))
        : pythonQuizQuestions,
    [mode],
  );

  const total = activeQuestions.length;
  const question = activeQuestions[Math.min(current, Math.max(total - 1, 0))];
  const quizTitle = `${total} Python Quiz Questions | PyMaster`;
  const quizDescription = `Practice ${total} Python quiz questions with answers and explanations. Improve Python fundamentals through quick MCQ practice.`;
  const answeredCount = useMemo(
    () => activeQuestions.filter((q) => answers[q.id] !== undefined).length,
    [activeQuestions, answers],
  );
  const completionPercent = Math.round((answeredCount / total) * 100);
  const progressPercent = Math.round(((current + 1) / total) * 100);
  const score = useMemo(
    () => {
      return activeQuestions.reduce((acc, q) => {
        if (answers[q.id] === q.answer) return acc + 1;
        return acc;
      }, 0);
    },
    [activeQuestions, answers],
  );

  const wrongQuestions = useMemo(
    () => {
      return activeQuestions.filter((q) => {
        const picked = answers[q.id];
        return picked && picked !== q.answer;
      });
    },
    [activeQuestions, answers],
  );

  useEffect(() => {
    setCurrent(0);
    setSubmitted(false);
  }, [mode]);

  useEffect(() => {
    const allAnswered = pythonQuizQuestions.filter((q) => answers[q.id] !== undefined).length;
    const allScore = pythonQuizQuestions.reduce((acc, q) => (answers[q.id] === q.answer ? acc + 1 : acc), 0);
    const trickyAnswered = trickyPool.filter((q) => answers[q.id] !== undefined).length;
    const trickyScore = trickyPool.reduce((acc, q) => (answers[q.id] === q.answer ? acc + 1 : acc), 0);

    const snapshot: QuizProgressSnapshot = {
      allTotal: pythonQuizQuestions.length,
      allAnswered,
      allScore,
      trickyTotal: trickyPool.length,
      trickyAnswered,
      trickyScore,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(QUIZ_PROGRESS_STORAGE_KEY, JSON.stringify(snapshot));
    window.dispatchEvent(new CustomEvent("pymaster-quiz-progress-updated", { detail: snapshot }));
  }, [answers, trickyPool]);

  if (!question) return null;

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <Helmet>
        <title>{quizTitle}</title>
        <meta name="description" content={quizDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={quizTitle} />
        <meta property="og:description" content={quizDescription} />
        <meta property="og:image" content="https://pymaster.pro/og-image.png" />
      </Helmet>

      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(ellipse_at_top,_rgba(59,130,246,0.18),transparent_65%)]" />

      <div className="mb-6 overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 shadow-[0_20px_60px_-30px_rgba(59,130,246,0.55)]">
        <div className="flex flex-wrap items-start justify-between gap-4 p-5 sm:p-6">
          <div className="max-w-2xl">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              PyMaster Quiz Arena
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-4xl">{total} Python Quiz</h1>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Not a boring MCQ sheet. This is your rapid-fire Python practice lab with instant feedback.
            </p>
            <div className="mt-4 inline-flex flex-wrap rounded-full border border-border bg-background/70 p-1">
              <button
                type="button"
                onClick={() => setMode("all")}
                className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 ${
                  mode === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Questions
              </button>
              <button
                type="button"
                onClick={() => setMode("tricky")}
                className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 ${
                  mode === "tricky" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Tricky Only
              </button>
            </div>
          </div>
          <Link
            to="/learn"
            className="inline-flex items-center rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
          >
            Back to Learn
          </Link>
        </div>
        <div className="grid gap-3 border-t border-border/70 bg-background/20 p-4 sm:grid-cols-3 sm:p-5">
          <div className="rounded-xl border border-border/70 bg-background/60 p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Question</div>
            <div className="mt-1 text-lg font-bold text-foreground">
              {current + 1} <span className="text-sm font-medium text-muted-foreground">/ {total}</span>
            </div>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/60 p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Answered</div>
            <div className="mt-1 text-lg font-bold text-foreground">
              {answeredCount} <span className="text-sm font-medium text-muted-foreground">({completionPercent}%)</span>
            </div>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/60 p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Score</div>
            <div className="mt-1 inline-flex items-center gap-2 text-lg font-bold text-foreground">
              <Target className="h-4 w-4 text-primary" />
              {score}/{total}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="font-semibold text-foreground">Progress</span>
              <span className="text-muted-foreground">{progressPercent}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-gradient-to-r from-primary via-blue-400 to-cyan-300 transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
            <CircleHelp className="h-3.5 w-3.5" />
            {question.topic}
          </div>

          <h2 className="break-words whitespace-pre-line text-base font-bold leading-7 text-foreground sm:text-2xl sm:leading-8">{question.question}</h2>

          <div className="mt-5 space-y-3">
            {question.options.map((option, idx) => {
              const picked = answers[question.id] === option;
              const isCorrect = option === question.answer;
              const isWrongPicked = submitted && picked && !isCorrect;
              const isRightAfterSubmit = submitted && isCorrect;
              const optionLabel = String.fromCharCode(65 + idx);

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: option }))}
                  className={`group w-full rounded-2xl border px-4 py-3 text-left text-sm transition-all sm:text-base ${
                    isRightAfterSubmit
                      ? "border-green-500 bg-green-500/10 text-foreground"
                      : isWrongPicked
                        ? "border-red-500 bg-red-500/10 text-foreground"
                        : picked
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-bold ${
                        picked ? "border-primary bg-primary/20 text-foreground" : "border-border text-muted-foreground"
                      }`}
                    >
                      {optionLabel}
                    </span>
                    <span className="break-words leading-6">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {submitted && (
            <div className="mt-5 rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Explanation:</span> {question.explanation}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrent((prev) => Math.max(0, prev - 1))}
              disabled={current === 0}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              {!submitted ? (
                <Button variant="outline" onClick={() => setSubmitted(true)} className="w-full sm:w-auto">
                  Show Answers
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setSubmitted(false)} className="w-full sm:w-auto">
                  Hide Answers
                </Button>
              )}

              <Button
                onClick={() => setCurrent((prev) => Math.min(total - 1, prev + 1))}
                disabled={current === total - 1}
                className="w-full gap-1 sm:w-auto"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground">Quick Stats</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Current Score</span>
                <span className="font-semibold text-foreground">{score}/{total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Answered</span>
                <span className="font-semibold text-foreground">{answeredCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Pending</span>
                <span className="font-semibold text-foreground">{total - answeredCount}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Quiz Summary</h3>
                <p className="text-sm text-muted-foreground">
                  Score updates instantly based on your selected answers.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {score} / {total}
                </span>
              </div>
            </div>

            {wrongQuestions.length > 0 && (
              <div className="mt-4">
                <div className="mb-2 text-sm font-semibold text-foreground">Review Wrong Answers</div>
                <div className="space-y-2">
                  {wrongQuestions.slice(0, 5).map((q) => (
                    <div key={q.id} className="rounded-lg border border-border bg-background p-3 text-xs sm:text-sm">
                      <div className="break-words font-medium text-foreground">
                        Q{q.id}. {q.question}
                      </div>
                      <div className="mt-1 text-muted-foreground">
                        Your answer: <span className="text-red-500">{answers[q.id]}</span> | Correct:{" "}
                        <span className="text-green-500">{q.answer}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            Tip: Use this quiz in 20-question sprints for faster retention.
          </p>
          <Button asChild variant="outline">
            <Link to="/learn">Revise Lessons</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
