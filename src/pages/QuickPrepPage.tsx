import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { BookOpen, Brain, Briefcase, Clock3, Code2, Sparkles, Target, Terminal } from "lucide-react";

const prepTracks = [
  {
    title: "15-Minute Warmup",
    duration: "15 min",
    description: "Wake up your Python brain with one quick lesson, one code run, and one easy problem.",
    steps: [
      { label: "Read one lesson", to: "/learn", icon: BookOpen },
      { label: "Run one snippet", to: "/compiler", icon: Terminal },
      { label: "Solve one easy problem", to: "/problems", icon: Code2 },
    ],
    accent: "from-sky-500/20 via-cyan-500/10 to-transparent",
  },
  {
    title: "Interview Sprint",
    duration: "30 min",
    description: "Tight, focused practice for arrays, strings, and core DSA patterns before interviews.",
    steps: [
      { label: "Review DSA patterns", to: "/dsa", icon: Brain },
      { label: "Solve two problems", to: "/problems", icon: Target },
      { label: "Test ideas fast", to: "/compiler", icon: Terminal },
    ],
    accent: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
  {
    title: "Career Prep Stack",
    duration: "25 min",
    description: "Mix practical coding with role-focused learning to stay sharp for real job applications.",
    steps: [
      { label: "Explore a career track", to: "/career/data-engineering", icon: Sparkles },
      { label: "Practice one problem", to: "/problems", icon: Code2 },
      { label: "Check job listings", to: "/jobs", icon: Briefcase },
    ],
    accent: "from-emerald-500/20 via-lime-500/10 to-transparent",
  },
];

const quickTips = [
  "Start with the shortest track if you're low on energy.",
  "Use the compiler to test one idea before opening a full problem.",
  "A small daily streak beats one huge weekend grind.",
];

const cheatSheetSections = [
  {
    title: "Python Basics",
    cards: [
      {
        title: "Variables and Input",
        snippet: `name = input("Name: ")
age = int(input("Age: "))
pi = 3.14
print(name, age, pi)`,
      },
      {
        title: "Conditionals",
        snippet: `score = 82
if score >= 90:
    print("A")
elif score >= 75:
    print("B")
else:
    print("Keep going")`,
      },
      {
        title: "Loops",
        snippet: `for i in range(5):
    print(i)

count = 3
while count > 0:
    count -= 1`,
      },
      {
        title: "Functions",
        snippet: `def add(a, b=0):
    return a + b

total = add(4, 7)`,
      },
    ],
  },
  {
    title: "Collections",
    cards: [
      {
        title: "Lists",
        snippet: `nums = [2, 4, 6]
nums.append(8)              # add one
nums.extend([10, 12])       # add many
nums.insert(1, 3)           # insert at index
nums.remove(10)             # remove by value
last = nums.pop()           # remove last or nums.pop(i)

print(nums.index(6))        # first index of value
print(nums.count(4))        # frequency

nums.sort()                 # in-place sort
nums.sort(reverse=True)
nums.reverse()              # reverse in-place

clone = nums.copy()         # shallow copy
nums.clear()                # remove all`,
      },
      {
        title: "Tuples",
        snippet: `point = (2, 5, 5, 9)
print(point[0])             # indexing
print(point[1:3])           # slicing
print(point.count(5))       # count occurrences
print(point.index(9))       # index of value

x, y, *_ = point            # unpacking
single = (42,)              # one-item tuple`,
      },
      {
        title: "Sets",
        snippet: `a = {1, 2, 3}
b = {3, 4, 5}

a.add(7)
a.update([8, 9])
a.discard(2)                # no error if missing
# a.remove(2)               # error if missing

print(a | b)                # union
print(a & b)                # intersection
print(a - b)                # difference
print(a ^ b)                # symmetric difference

print({1, 2}.issubset(a))
print(a.issuperset({1}))
a.clear()`,
      },
      {
        title: "Dictionaries",
        snippet: `user = {"name": "Ana", "xp": 120}
user["streak"] = 5
user.update({"city": "Delhi"})

print(user.get("name", "NA"))
print(list(user.keys()))
print(list(user.values()))
print(list(user.items()))

user.setdefault("level", 1) # add only if missing
removed = user.pop("city", None)
last = user.popitem()       # removes last inserted pair

template = dict.fromkeys(["a", "b"], 0)
squares = {n: n * n for n in range(4)}`,
      },
      {
        title: "Comprehensions",
        snippet: `squares = [n * n for n in range(6)]
evens = [n for n in squares if n % 2 == 0]
lookup = {n: n * n for n in range(4)}
unique = {n % 3 for n in range(10)}
total = sum(n for n in range(100))`,
      },
    ],
  },
  {
    title: "Strings and Files",
    cards: [
      {
        title: "String Methods (Must Know)",
        snippet: `text = "  python,api,prep  "

print(text.strip())         # trim spaces
print(text.lower())
print(text.upper())
print(text.title())
print(text.replace("api", "backend"))

parts = text.strip().split(",")
print("-".join(parts))

print("py" in text)         # membership
print(text.startswith("  py"))
print(text.endswith("prep  "))
print("42".isdigit())
print("alpha".isalpha())`,
      },
      {
        title: "f-Strings",
        snippet: `name = "Mia"
xp = 240
print(f"{name} has {xp} XP")`,
      },
      {
        title: "File Read and Write",
        snippet: `with open("notes.txt", "w") as file:
    file.write("hello")

with open("notes.txt") as file:
    print(file.read())`,
      },
      {
        title: "JSON",
        snippet: `import json

payload = {"name": "Ana", "xp": 120}
text = json.dumps(payload)
data = json.loads(text)`,
      },
    ],
  },
  {
    title: "Errors and OOP",
    cards: [
      {
        title: "Try and Except",
        snippet: `try:
    value = int("42")
except ValueError:
    value = 0
finally:
    print(value)`,
      },
      {
        title: "Classes",
        snippet: `class User:
    def __init__(self, name):
        self.name = name

user = User("Ana")`,
      },
      {
        title: "Inheritance",
        snippet: `class Animal:
    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return "woof"`,
      },
      {
        title: "Dataclasses",
        snippet: `from dataclasses import dataclass

@dataclass
class Task:
    title: str
    done: bool = False`,
      },
    ],
  },
  {
    title: "Useful Imports",
    cards: [
      {
        title: "Math and Random",
        snippet: `import math
import random

print(math.sqrt(81))
print(random.randint(1, 10))`,
      },
      {
        title: "Datetime",
        snippet: `from datetime import datetime

now = datetime.now()
print(now.strftime("%Y-%m-%d"))`,
      },
      {
        title: "Counter and Defaultdict",
        snippet: `from collections import Counter, defaultdict

counts = Counter("banana")
graph = defaultdict(list)`,
      },
      {
        title: "Heapq",
        snippet: `import heapq

nums = [5, 1, 9]
heapq.heapify(nums)
print(heapq.heappop(nums))`,
      },
    ],
  },
  {
    title: "Interview Patterns",
    cards: [
      {
        title: "Enumerate",
        snippet: `items = ["a", "b", "c"]
for idx, value in enumerate(items):
    print(idx, value)`,
      },
      {
        title: "Zip",
        snippet: `names = ["Ana", "Kai"]
scores = [90, 88]
for name, score in zip(names, scores):
    print(name, score)`,
      },
      {
        title: "Sorting",
        snippet: `nums = [5, 2, 9]
print(sorted(nums))

users = [{"xp": 5}, {"xp": 2}]
print(sorted(users, key=lambda x: x["xp"]))`,
      },
      {
        title: "Stack and Queue",
        snippet: `stack = []
stack.append(1)
stack.pop()

from collections import deque
queue = deque([1, 2])`,
      },
    ],
  },
  {
    title: "Shortcuts and Optimized Ways",
    cards: [
      {
        title: "Ternary Shortcut",
        snippet: `status = "pass" if score >= 40 else "fail"
smallest = a if a < b else b`,
      },
      {
        title: "Swap Without Temp",
        snippet: `a, b = b, a
left, right = right, left`,
      },
      {
        title: "Fast Counting",
        snippet: `from collections import Counter

counts = Counter(nums)
most_common = counts.most_common(1)[0]`,
      },
      {
        title: "Safe Dictionary Access",
        snippet: `value = data.get("name", "Unknown")
items = mapping.setdefault("python", [])`,
      },
      {
        title: "Any and All",
        snippet: `has_even = any(n % 2 == 0 for n in nums)
all_positive = all(n > 0 for n in nums)`,
      },
      {
        title: "Fast String Join",
        snippet: `letters = ["P", "y", "t", "h", "o", "n"]
word = "".join(letters)`,
      },
      {
        title: "Enumerate and Zip",
        snippet: `for idx, value in enumerate(items):
    print(idx, value)

for a, b in zip(list1, list2):
    print(a, b)`,
      },
      {
        title: "Reverse and Sort Quickly",
        snippet: `nums.sort(reverse=True)
reversed_nums = nums[::-1]
ordered = sorted(users, key=lambda x: x["xp"])`,
      },
      {
        title: "Set for Fast Lookup",
        snippet: `seen = set(nums)
if target in seen:
    print("found")`,
      },
      {
        title: "Prefix Sum Shortcut",
        snippet: `prefix = [0]
for n in nums:
    prefix.append(prefix[-1] + n)`,
      },
      {
        title: "List Flatten Shortcut",
        snippet: `matrix = [[1, 2], [3, 4]]
flat = [item for row in matrix for item in row]`,
      },
      {
        title: "Two-Pointer Template",
        snippet: `left, right = 0, len(nums) - 1
while left < right:
    total = nums[left] + nums[right]
    if total < target:
        left += 1
    else:
        right -= 1`,
      },
    ],
  },
];

export default function QuickPrepPage() {
  const totalCheatSnippets = cheatSheetSections.reduce((count, section) => count + section.cards.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Quick Prep | PyMaster</title>
        <meta
          name="description"
          content="Quick Python prep routines for daily study, interview practice, and career-focused warmups."
        />
      </Helmet>

      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_32%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.14),transparent_28%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              <Clock3 className="h-3.5 w-3.5" />
              Quick Prep
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Short study runs that keep you moving.
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Pick a prep track when you want momentum without overthinking it. Each route is designed to get you coding fast and leave you with one clear win.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {prepTracks.map((track) => (
            <div
              key={track.title}
              className={`rounded-3xl border border-border/70 bg-gradient-to-br ${track.accent} p-6 shadow-sm`}
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">{track.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{track.description}</p>
                </div>
                <div className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-foreground">
                  {track.duration}
                </div>
              </div>

              <div className="space-y-3">
                {track.steps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <Link
                      key={step.label}
                      to={step.to}
                      className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-4 py-3 transition-colors hover:bg-background"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                            Step {index + 1}
                          </div>
                          <div className="text-sm font-medium text-foreground">{step.label}</div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-primary">Open</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl md:rounded-3xl border border-border/70 bg-card p-5 md:p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Quick Rules</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {quickTips.map((tip) => (
              <div key={tip} className="rounded-xl md:rounded-2xl border border-border/60 bg-background/70 p-4 text-sm text-muted-foreground">
                {tip}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl md:rounded-[2rem] border border-primary/15 bg-[linear-gradient(135deg,rgba(14,165,233,0.08),rgba(245,158,11,0.08),rgba(16,185,129,0.08))] p-5 shadow-[0_18px_60px_rgba(15,23,42,0.12)] sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_28%),radial-gradient(circle_at_bottom,rgba(16,185,129,0.12),transparent_30%)]" />
          <div className="relative mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                <BookOpen className="h-3.5 w-3.5" />
                Must-Know Python
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Python Cheatsheet
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                Keep this section close before interviews, practice rounds, and quick revision sessions. These are the patterns you’ll reach for again and again.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-sky-500/20 bg-background/75 px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-600">Core</div>
                <div className="mt-1 text-lg font-bold text-foreground">{totalCheatSnippets}</div>
                <div className="text-xs text-muted-foreground">key patterns</div>
              </div>
              <div className="rounded-2xl border border-amber-500/20 bg-background/75 px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-600">Focus</div>
                <div className="mt-1 text-lg font-bold text-foreground">Fast</div>
                <div className="text-xs text-muted-foreground">scan blocks</div>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-background/75 px-4 py-3 col-span-2 sm:col-span-1">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-600">Use</div>
                <div className="mt-1 text-lg font-bold text-foreground">Daily</div>
                <div className="text-xs text-muted-foreground">prep reference</div>
              </div>
            </div>
          </div>
          <div className="relative space-y-6 md:space-y-8">
            {cheatSheetSections.map((section) => (
              <div key={section.title} className="rounded-2xl md:rounded-[1.75rem] border border-border/60 bg-background/78 p-4 backdrop-blur-sm sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      High Value Section
                    </div>
                    <h3 className="mt-1 text-lg font-semibold text-foreground sm:text-xl">
                      {section.title}
                    </h3>
                  </div>
                  <div className="rounded-full border border-border/60 bg-secondary/70 px-3 py-1 text-[11px] font-medium text-muted-foreground">
                    {section.cards.length} snippets
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {section.cards.map((card) => (
                    <div
                      key={card.title}
                      className="group rounded-2xl border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.06))] p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_35px_rgba(14,165,233,0.12)]"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h4 className="text-sm font-semibold text-foreground">{card.title}</h4>
                        <span className="rounded-full border border-primary/15 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                          Essential
                        </span>
                      </div>
                      <pre className="overflow-x-auto rounded-xl border border-black/5 bg-slate-950/95 p-3 text-xs leading-6 text-slate-100 shadow-inner">
                        <code>{card.snippet}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
