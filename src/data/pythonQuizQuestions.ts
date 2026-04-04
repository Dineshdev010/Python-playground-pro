export interface PythonQuizQuestion {
  id: number;
  topic: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

function rotateOptions(options: string[], shift: number) {
  const normalized = shift % options.length;
  return [...options.slice(normalized), ...options.slice(0, normalized)];
}

function createQuestion(id: number): PythonQuizQuestion {
  const block = Math.floor((id - 1) / 10) + 1;
  const type = (id - 1) % 10;

  if (type === 0) {
    const a = 2 + block;
    const b = 3 + block;
    const c = 4 + block;
    const answer = String(a + b * c);
    return {
      id,
      topic: "Operators",
      question: `What is the output of \`print(${a} + ${b} * ${c})\`?`,
      options: rotateOptions([answer, String((a + b) * c), String(a * b + c), String(a + b + c)], block),
      answer,
      explanation: "Multiplication runs before addition in Python operator precedence.",
    };
  }

  if (type === 1) {
    const a = 10 + block * 2;
    const b = 3 + (block % 4);
    const answer = String(Math.floor(a / b));
    return {
      id,
      topic: "Numbers",
      question: `What is the output of \`print(${a} // ${b})\`?`,
      options: rotateOptions([answer, String(a / b), String((a % b) + Math.floor(a / b)), String(b)], block),
      answer,
      explanation: "`//` is floor division, so it returns only the integer part.",
    };
  }

  if (type === 2) {
    const nums = [block, block + 2, block + 4, block + 6];
    const idx = block % 4;
    const answer = String(nums[idx]);
    return {
      id,
      topic: "Lists",
      question: `Given \`nums = [${nums.join(", ")}]\`, what is \`nums[${idx}]\`?`,
      options: rotateOptions([answer, String(nums[0]), String(nums[nums.length - 1]), String(nums[1])], block),
      answer,
      explanation: "List indexing starts from 0.",
    };
  }

  if (type === 3) {
    const text = `python${block}`;
    const answer = text.slice(0, 3);
    return {
      id,
      topic: "Strings",
      question: `What is the output of \`"${text}"[:3]\`?`,
      options: rotateOptions([answer, text.slice(1, 4), text.slice(-3), text], block),
      answer,
      explanation: "Slice `[:3]` takes characters from index 0 up to (not including) index 3.",
    };
  }

  if (type === 4) {
    const n = 2 + (block % 5);
    const answer = n % 2 === 0 ? "True" : "False";
    return {
      id,
      topic: "Booleans",
      question: `What is the output of \`print(${n} % 2 == 0)\`?`,
      options: rotateOptions([answer, answer === "True" ? "False" : "True", "0", "1"], block),
      answer,
      explanation: "`n % 2 == 0` checks if a number is even.",
    };
  }

  if (type === 5) {
    const n = 3 + block;
    const answer = String((n * (n - 1)) / 2);
    return {
      id,
      topic: "Loops",
      question: `What is the value of \`total\`?\n\n\`\`\`python\ntotal = 0\nfor i in range(${n}):\n    total += i\nprint(total)\n\`\`\``,
      options: rotateOptions([answer, String(n * (n + 1) / 2), String(n), String(n - 1)], block),
      answer,
      explanation: "range(n) runs from 0 to n-1, so this sums 0+1+...+(n-1).",
    };
  }

  if (type === 6) {
    const key = `k${block}`;
    const answer = String(block * 5);
    return {
      id,
      topic: "Dictionaries",
      question: `Given \`data = {"${key}": ${answer}}\`, what is \`data["${key}"]\`?`,
      options: rotateOptions([answer, String(block), `"${key}"`, "KeyError"], block),
      answer,
      explanation: "Dictionary keys map directly to their values.",
    };
  }

  if (type === 7) {
    const a = block;
    const b = block + 1;
    const answer = "2";
    return {
      id,
      topic: "Sets",
      question: `What is the output of \`len({${a}, ${a}, ${b}})\`?`,
      options: rotateOptions([answer, "3", "1", String(a + b)], block),
      answer,
      explanation: "Sets keep only unique values.",
    };
  }

  if (type === 8) {
    const num = block + 7;
    const answer = String(num);
    return {
      id,
      topic: "Functions",
      question: `What is the output?\n\n\`\`\`python\ndef show(x):\n    return x\nprint(show(${num}))\n\`\`\``,
      options: rotateOptions([answer, "None", String(num + 1), "x"], block),
      answer,
      explanation: "The function returns `x`, so print displays the passed value.",
    };
  }

  const value = 20 + block;
  const answer = String(value + 1);
  return {
    id,
    topic: "Conditionals",
    question: `What gets printed?\n\n\`\`\`python\nx = ${value}\nif x > 10:\n    print(x + 1)\nelse:\n    print(x - 1)\n\`\`\``,
    options: rotateOptions([answer, String(value - 1), String(value), "Nothing"], block),
    answer,
    explanation: "Since x is greater than 10, the first branch runs.",
  };
}

function createTrickyQuestion(id: number, trickyIndex: number): PythonQuizQuestion {
  const block = Math.floor((trickyIndex - 1) / 10) + 1;
  const type = (trickyIndex - 1) % 10;

  if (type === 0) {
    return {
      id,
      topic: "Tricky: Defaults",
      question: "What does this print?\n\n```python\ndef f(a=[]):\n    a.append(1)\n    return a\nprint(f(), f())\n```",
      options: ["[1] [1]", "[1] [1, 1]", "[1, 1] [1]", "[1, 1] [1, 1]"],
      answer: "[1] [1, 1]",
      explanation: "Default mutable arguments are reused across calls.",
    };
  }

  if (type === 1) {
    return {
      id,
      topic: "Tricky: Aliasing",
      question: "What is printed?\n\n```python\na = [1, 2]\nb = a\nb += [3]\nprint(a)\n```",
      options: ["[1, 2]", "[1, 2, 3]", "[3]", "TypeError"],
      answer: "[1, 2, 3]",
      explanation: "`b` and `a` point to the same list, and `+=` mutates it.",
    };
  }

  if (type === 2) {
    return {
      id,
      topic: "Tricky: Scope",
      question: "What is the output?\n\n```python\nx = 5\ndef g():\n    x = x + 1\n    return x\nprint(g())\n```",
      options: ["6", "5", "UnboundLocalError", "NameError"],
      answer: "UnboundLocalError",
      explanation: "Assigning to `x` makes it local in `g`, but it is read before assignment.",
    };
  }

  if (type === 3) {
    return {
      id,
      topic: "Tricky: is vs ==",
      question: "Which statement is correct for lists `a=[1,2]` and `b=[1,2]`?",
      options: ["a is b is True", "a == b is True and a is b is False", "a == b is False", "Both are False"],
      answer: "a == b is True and a is b is False",
      explanation: "`==` compares values, `is` compares object identity.",
    };
  }

  if (type === 4) {
    return {
      id,
      topic: "Tricky: Loop else",
      question: "What prints?\n\n```python\nfor n in [1, 2, 3]:\n    if n == 4:\n        break\nelse:\n    print('done')\n```",
      options: ["done", "nothing", "4", "break"],
      answer: "done",
      explanation: "`else` on loop runs when loop is not terminated by `break`.",
    };
  }

  if (type === 5) {
    const v = 3 + block;
    return {
      id,
      topic: "Tricky: Closures",
      question: `What does this print?\n\n\`\`\`python\nfuncs = []\nfor i in range(${v}):\n    funcs.append(lambda: i)\nprint(funcs[0](), funcs[-1]())\n\`\`\``,
      options: [`${v - 1} ${v - 1}`, `0 ${v - 1}`, `0 0`, "Error"],
      answer: `${v - 1} ${v - 1}`,
      explanation: "Lambdas capture `i` by reference; after loop ends all see final value.",
    };
  }

  if (type === 6) {
    return {
      id,
      topic: "Tricky: Strings",
      question: "What prints?\n\n```python\ns = 'python'\nprint(s[-1:-4:-1])\n```",
      options: ["noh", "noht", "n", ""],
      answer: "noh",
      explanation: "Start at last char and step backward: indexes -1, -2, -3.",
    };
  }

  if (type === 7) {
    return {
      id,
      topic: "Tricky: Dict Keys",
      question: "What is the result?\n\n```python\nd = {True: 'yes', 1: 'no', 1.0: 'maybe'}\nprint(len(d), d[True])\n```",
      options: ["3 yes", "1 maybe", "2 no", "1 yes"],
      answer: "1 maybe",
      explanation: "`True`, `1`, and `1.0` are equal as dict keys, so later values overwrite.",
    };
  }

  if (type === 8) {
    return {
      id,
      topic: "Tricky: Set Order",
      question: "Which statement about Python sets is correct?",
      options: [
        "Sets always preserve insertion order",
        "Set order is not guaranteed for logic and should not be relied on",
        "Sets are indexed like lists",
        "Sets allow duplicate values",
      ],
      answer: "Set order is not guaranteed for logic and should not be relied on",
      explanation: "Sets are unordered collections of unique elements.",
    };
  }

  const base = 10 + block;
  return {
    id,
    topic: "Tricky: Exceptions",
    question: `What prints?\n\n\`\`\`python\ntry:\n    print(1 / 0)\nexcept ZeroDivisionError:\n    print('A')\nfinally:\n    print(${base})\n\`\`\``,
    options: [`A ${base}`, `${base}`, "A", "No output"],
    answer: `A ${base}`,
    explanation: "`except` handles the error, and `finally` always runs.",
  };
}

const baseQuestions = Array.from({ length: 200 }, (_, i) => createQuestion(i + 1));
const trickyQuestions = Array.from({ length: 200 }, (_, i) => createTrickyQuestion(201 + i, i + 1));

export const pythonQuizQuestions: PythonQuizQuestion[] = [...baseQuestions, ...trickyQuestions];
