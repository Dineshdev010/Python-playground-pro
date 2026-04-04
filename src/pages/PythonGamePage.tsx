import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Code2, GripVertical, Play, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSound } from "@/contexts/SoundContext";

type Block = {
  id: string;
  label: string;
  snippet: string;
};

type Topic = {
  id: string;
  title: string;
  description: string;
  blocks: Block[];
};

type DroppedBlock = {
  instanceId: string;
  blockId: string;
};

const topics: Topic[] = [
  {
    id: "hello-basics",
    title: "Hello Python",
    description: "Start with greeting, comments, and simple print statements.",
    blocks: [
      { id: "hello", label: 'Print "Hello Python"', snippet: 'print("Hello Python")' },
      { id: "name", label: "Create name variable", snippet: 'name = "Dinesh"' },
      { id: "welcome", label: "Print welcome f-string", snippet: 'print(f"Welcome, {name}")' },
      { id: "comment", label: "Add comment", snippet: "# This is my first Python game program" },
    ],
  },
  {
    id: "variables",
    title: "Variables & Types",
    description: "Drag blocks to create values and inspect data types.",
    blocks: [
      { id: "age", label: "age = 18", snippet: "age = 18" },
      { id: "height", label: "height = 5.9", snippet: "height = 5.9" },
      { id: "student", label: "is_student = True", snippet: "is_student = True" },
      { id: "types", label: "Print types", snippet: "print(type(age), type(height), type(is_student))" },
    ],
  },
  {
    id: "conditionals",
    title: "Conditionals",
    description: "Build if-elif-else logic for decisions.",
    blocks: [
      { id: "score", label: "score = 86", snippet: "score = 86" },
      { id: "if-grade", label: "If-elif-else grade", snippet: 'if score >= 90:\n    print("A")\nelif score >= 75:\n    print("B")\nelse:\n    print("Keep practicing")' },
      { id: "ternary", label: "Ternary result", snippet: 'result = "Pass" if score >= 40 else "Fail"\nprint(result)' },
    ],
  },
  {
    id: "loops",
    title: "Loops",
    description: "Practice for-loops and while-loops.",
    blocks: [
      { id: "for-range", label: "For range loop", snippet: "for i in range(1, 6):\n    print(i)" },
      { id: "while", label: "While loop", snippet: "count = 3\nwhile count > 0:\n    print(count)\n    count -= 1" },
      { id: "sum-loop", label: "Loop sum", snippet: "total = 0\nfor n in [2, 4, 6, 8]:\n    total += n\nprint(total)" },
    ],
  },
  {
    id: "functions",
    title: "Functions",
    description: "Create and call reusable functions.",
    blocks: [
      { id: "add-fn", label: "Create add function", snippet: "def add(a, b):\n    return a + b" },
      { id: "greet-fn", label: "Create greet function", snippet: 'def greet(name):\n    print(f"Hello, {name}")' },
      { id: "call-add", label: "Call add()", snippet: "print(add(10, 5))" },
      { id: "call-greet", label: "Call greet()", snippet: 'greet("Python Learner")' },
    ],
  },
  {
    id: "lists",
    title: "Lists",
    description: "Manipulate list values with key methods.",
    blocks: [
      { id: "make-list", label: "Create list", snippet: "nums = [1, 2, 3]" },
      { id: "append", label: "append()", snippet: "nums.append(4)" },
      { id: "insert", label: "insert()", snippet: "nums.insert(1, 99)" },
      { id: "list-print", label: "Print list", snippet: "print(nums)" },
    ],
  },
  {
    id: "dictionaries",
    title: "Dictionaries",
    description: "Build key-value data and access safely.",
    blocks: [
      { id: "make-dict", label: "Create dictionary", snippet: 'user = {"name": "Ana", "xp": 120}' },
      { id: "set-key", label: "Add key", snippet: 'user["level"] = "Beginner"' },
      { id: "get-name", label: "Get value", snippet: 'print(user.get("name", "Unknown"))' },
      { id: "items", label: "Print items()", snippet: "print(list(user.items()))" },
    ],
  },
  {
    id: "oop",
    title: "OOP Basics",
    description: "Drag class blocks and instantiate objects.",
    blocks: [
      { id: "class", label: "Create class", snippet: "class Student:\n    def __init__(self, name):\n        self.name = name" },
      { id: "method", label: "Add method", snippet: "    def say_hi(self):\n        print(f'Hi, I am {self.name}')" },
      { id: "create-obj", label: "Create object", snippet: "s = Student('Dinesh')" },
      { id: "call-method", label: "Call method", snippet: "s.say_hi()" },
    ],
  },
];

function getBlockById(topic: Topic, blockId: string) {
  return topic.blocks.find((block) => block.id === blockId);
}

export default function PythonGamePage() {
  const { playSound } = useSound();
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0].id);
  const [droppedByTopic, setDroppedByTopic] = useState<Record<string, DroppedBlock[]>>(
    Object.fromEntries(topics.map((topic) => [topic.id, []])),
  );

  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId) || topics[0];
  const dropped = droppedByTopic[selectedTopic.id] || [];

  const generatedCode = useMemo(() => {
    const snippets = dropped
      .map((entry) => getBlockById(selectedTopic, entry.blockId)?.snippet)
      .filter((snippet): snippet is string => Boolean(snippet));

    if (snippets.length === 0) {
      return '# Drag blocks into the canvas to build Python code\nprint("Hello Python")';
    }

    return snippets.join("\n\n");
  }, [dropped, selectedTopic]);

  const handleDropBlock = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const blockId = event.dataTransfer.getData("text/plain");
    if (!blockId) return;

    const block = getBlockById(selectedTopic, blockId);
    if (!block) return;

    const newEntry: DroppedBlock = {
      instanceId: `${blockId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      blockId: block.id,
    };

    setDroppedByTopic((current) => ({
      ...current,
      [selectedTopic.id]: [...(current[selectedTopic.id] || []), newEntry],
    }));
    playSound("drop");
  };

  const removeDropped = (instanceId: string) => {
    setDroppedByTopic((current) => ({
      ...current,
      [selectedTopic.id]: (current[selectedTopic.id] || []).filter((entry) => entry.instanceId !== instanceId),
    }));
    playSound("error");
  };

  const clearCanvas = () => {
    setDroppedByTopic((current) => ({
      ...current,
      [selectedTopic.id]: [],
    }));
    playSound("success");
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Python Game | PyMaster</title>
        <meta
          name="description"
          content="Build Python code by dragging and dropping topic blocks in the Python Game."
        />
      </Helmet>

      <section className="border-b border-border/60 bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Python Game
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Drag, Drop, and Build Python Code
            </h1>
            <p className="text-sm leading-6 text-muted-foreground sm:text-base">
              Pick any topic, drag blocks to the canvas, and instantly see working Python code. Great for beginners and quick revision.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap gap-2">
          {topics.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setSelectedTopicId(topic.id)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                selectedTopic.id === topic.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {topic.title}
            </button>
          ))}
        </div>

        <div className="mb-6 rounded-2xl border border-border bg-card/60 p-4">
          <h2 className="text-lg font-semibold text-foreground">{selectedTopic.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{selectedTopic.description}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Draggable Elements</h3>
              <span className="text-xs text-muted-foreground">{selectedTopic.blocks.length} blocks</span>
            </div>
            <div className="space-y-2">
              {selectedTopic.blocks.map((block) => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData("text/plain", block.id);
                    playSound("click");
                  }}
                  className="flex cursor-grab items-center gap-3 rounded-xl border border-border bg-background px-3 py-2 active:cursor-grabbing"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm text-foreground">{block.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl border border-primary/30 bg-primary/5 p-4"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDropBlock}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-foreground">Drop Canvas</h3>
              <div className="flex items-center gap-2">
                <Button type="button" size="sm" variant="outline" onClick={clearCanvas} className="h-8 gap-1">
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </Button>
              </div>
            </div>

            {dropped.length === 0 ? (
              <div className="rounded-xl border border-dashed border-primary/40 bg-background/70 px-4 py-8 text-center text-sm text-muted-foreground">
                Drop blocks here to generate Python code.
              </div>
            ) : (
              <div className="space-y-2">
                {dropped.map((entry, index) => {
                  const block = getBlockById(selectedTopic, entry.blockId);
                  if (!block) return null;

                  return (
                    <div key={entry.instanceId} className="flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2">
                      <div className="text-sm text-foreground">
                        {index + 1}. {block.label}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDropped(entry.instanceId)}
                        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                        aria-label="Remove dropped block"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Code2 className="h-4 w-4 text-primary" /> Generated Code
            </h3>
            <Button asChild size="sm" className="h-8 gap-1">
              <Link to={`/compiler?code=${encodeURIComponent(generatedCode)}`}>
                <Play className="h-3.5 w-3.5" /> Try in Compiler
              </Link>
            </Button>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-black/5 bg-slate-950 p-4 text-xs leading-6 text-slate-100">
            <code>{generatedCode}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
