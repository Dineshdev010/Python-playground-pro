import { useMemo, useState } from "react";

interface ActivityGraphProps {
  activityMap: Record<string, number>;
}

interface ActivityDay {
  date: string;
  count: number;
  level: number;
  isToday: boolean;
}

type RangeMode = "30d" | "12m";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const weekdayLabels = ["Sun", "", "Tue", "", "Thu", "", "Sat"];
const heatClasses = [
  "bg-muted/45 border-border/40",
  "bg-emerald-500/25 border-emerald-500/20",
  "bg-emerald-500/45 border-emerald-500/30",
  "bg-emerald-400/70 border-emerald-400/40",
  "bg-emerald-300 border-emerald-300/60 shadow-[0_0_10px_rgba(110,231,183,0.35)]",
];

function toLocalDateStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getLevel(count: number) {
  return count === 0 ? 0 : count <= 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4;
}

export function ActivityGraph({ activityMap }: ActivityGraphProps) {
  const [rangeMode, setRangeMode] = useState<RangeMode>("12m");
  const todayStr = useMemo(() => toLocalDateStr(new Date()), []);

  const { weeks, totalCols } = useMemo(() => {
    const result: ActivityDay[][] = [];
    const today = new Date();
    const daysBack = rangeMode === "30d" ? 29 : 364;
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - daysBack);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    let currentWeek: ActivityDay[] = [];
    const d = new Date(startDate);

    while (d <= today) {
      const dateStr = toLocalDateStr(d);
      const count = activityMap[dateStr] || 0;

      currentWeek.push({
        date: dateStr,
        count,
        level: getLevel(count),
        isToday: dateStr === todayStr,
      });

      if (d.getDay() === 6) {
        result.push(currentWeek);
        currentWeek = [];
      }

      d.setDate(d.getDate() + 1);
    }

    if (currentWeek.length > 0) result.push(currentWeek);

    return {
      weeks: result,
      totalCols: result.length,
    };
  }, [activityMap, rangeMode, todayStr]);

  const months = useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, i) => {
      if (week.length === 0) return;
      const [, monthStr] = week[0].date.split("-");
      const monthIndex = parseInt(monthStr, 10) - 1;

      if (monthIndex !== lastMonth) {
        labels.push({ label: monthNames[monthIndex], col: i });
        lastMonth = monthIndex;
      }
    });

    return labels;
  }, [weeks]);

  const visibleDays = useMemo(
    () => weeks.flat().filter((day) => day.date <= todayStr),
    [todayStr, weeks],
  );

  const summary = useMemo(() => {
    const totalSessions = visibleDays.reduce((sum, day) => sum + day.count, 0);
    const activeDays = visibleDays.filter((day) => day.count > 0).length;
    const busiestDay = visibleDays.reduce<ActivityDay | null>(
      (best, day) => (!best || day.count > best.count ? day : best),
      null,
    );

    let longestStreak = 0;
    let currentStreak = 0;
    let previousDate: Date | null = null;

    visibleDays
      .filter((day) => day.count > 0)
      .map((day) => day.date)
      .sort()
      .forEach((dateStr) => {
        const currentDate = new Date(`${dateStr}T00:00:00`);
        if (!previousDate) {
          currentStreak = 1;
        } else {
          const diffDays = Math.round((currentDate.getTime() - previousDate.getTime()) / 86400000);
          currentStreak = diffDays === 1 ? currentStreak + 1 : 1;
        }

        longestStreak = Math.max(longestStreak, currentStreak);
        previousDate = currentDate;
      });

    const weekdayTotals = weekdayNames.map((name, index) => ({
      name,
      count: visibleDays
        .filter((day) => day.count > 0 && new Date(`${day.date}T00:00:00`).getDay() === index)
        .reduce((sum, day) => sum + day.count, 0),
    }));

    const mostActiveWeekday = weekdayTotals.reduce(
      (best, current) => (current.count > best.count ? current : best),
      { name: "None yet", count: 0 },
    );

    return {
      activeDays,
      totalSessions,
      busiestDay: busiestDay?.date ?? "No activity yet",
      busiestCount: busiestDay?.count ?? 0,
      longestStreak,
      mostActiveWeekday,
    };
  }, [visibleDays]);

  const trendPoints = useMemo(() => {
    const days = visibleDays.slice(-14);
    const maxCount = Math.max(1, ...days.map((day) => day.count));

    return days.map((day, index) => {
      const x = days.length === 1 ? 0 : (index / (days.length - 1)) * 100;
      const y = 100 - day.count / maxCount * 100;
      return { ...day, x, y };
    });
  }, [visibleDays]);

  const trendPath = useMemo(() => {
    if (trendPoints.length === 0) return "";
    return trendPoints.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  }, [trendPoints]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 lg:flex-1">
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-600">Active Days</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{summary.activeDays}</div>
            <div className="text-xs text-muted-foreground">Days with coding activity logged</div>
          </div>
          <div className="rounded-2xl border border-sky-500/15 bg-sky-500/5 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600">Sessions</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{summary.totalSessions}</div>
            <div className="text-xs text-muted-foreground">Total activity entries recorded</div>
          </div>
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-600">Best Day</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{summary.busiestCount}</div>
            <div className="text-xs text-muted-foreground truncate">{summary.busiestDay}</div>
          </div>
          <div className="rounded-2xl border border-violet-500/15 bg-violet-500/5 p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-600">Longest Run</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{summary.longestStreak}</div>
            <div className="text-xs text-muted-foreground">Best consecutive coding streak</div>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/70 p-1">
          <button
            type="button"
            onClick={() => setRangeMode("30d")}
            className={`rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
              rangeMode === "30d" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Last 30 Days
          </button>
          <button
            type="button"
            onClick={() => setRangeMode("12m")}
            className={`rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
              rangeMode === "12m" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Last 12 Months
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="rounded-3xl border border-border/70 bg-background/60 p-4 sm:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {rangeMode === "12m" ? "Last 12 Months" : "Last 30 Days"}
              </h3>
              <p className="text-xs text-muted-foreground">Hover each cell to inspect daily activity.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span>Less</span>
              {heatClasses.map((className, index) => (
                <span key={index} className={`h-3 w-3 rounded-[4px] border ${className}`} />
              ))}
              <span>More</span>
            </div>
          </div>

          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-max gap-2">
              <div className="flex flex-col gap-[3px] pt-6">
                {weekdayLabels.map((label, index) => (
                  <div key={index} className="flex h-[12px] items-center text-[10px] text-muted-foreground">
                    {label}
                  </div>
                ))}
              </div>

              <div>
                <div className="relative mb-2 h-4" style={{ width: totalCols * 14 }}>
                  {months.map((month) => (
                    <span
                      key={`${month.label}-${month.col}`}
                      className="absolute top-0 text-[10px] text-muted-foreground"
                      style={{ left: month.col * 14 }}
                    >
                      {month.label}
                    </span>
                  ))}
                </div>

                <div className="flex gap-[3px]">
                  {weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.map((day, di) => (
                        <div
                          key={`${day.date}-${di}`}
                          className={`h-[11px] w-[11px] rounded-[4px] border transition-transform hover:scale-125 ${heatClasses[day.level]} ${
                            day.isToday ? "ring-1 ring-primary/80 ring-offset-1 ring-offset-background" : ""
                          }`}
                          title={`${day.date}: ${day.count} activit${day.count === 1 ? "y" : "ies"}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-border/70 bg-background/60 p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Insight</div>
            <h3 className="mt-1 text-lg font-semibold text-foreground">Most Active Weekday</h3>
            <p className="mt-2 text-2xl font-bold text-foreground">{summary.mostActiveWeekday.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {summary.mostActiveWeekday.count} tracked activit{summary.mostActiveWeekday.count === 1 ? "y" : "ies"} landed here.
            </p>
          </div>

          <div className="rounded-3xl border border-border/70 bg-background/60 p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">Trend</div>
                <h3 className="mt-1 text-lg font-semibold text-foreground">Recent Activity Curve</h3>
              </div>
              <div className="text-[11px] text-muted-foreground">Last 14 days</div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/70 p-3">
              <svg viewBox="0 0 100 100" className="h-32 w-full overflow-visible">
                <defs>
                  <linearGradient id="activityLine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgb(56 189 248)" />
                    <stop offset="100%" stopColor="rgb(52 211 153)" />
                  </linearGradient>
                </defs>
                <path d="M 0 100 L 100 100" stroke="rgba(148,163,184,0.18)" strokeWidth="1" />
                <path
                  d={trendPath}
                  fill="none"
                  stroke="url(#activityLine)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {trendPoints.map((point) => (
                  <circle
                    key={point.date}
                    cx={point.x}
                    cy={point.y}
                    r="2.3"
                    fill="rgb(16 185 129)"
                  >
                    <title>{`${point.date}: ${point.count} activit${point.count === 1 ? "y" : "ies"}`}</title>
                  </circle>
                ))}
              </svg>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              A quick view of your recent consistency instead of just total volume.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
