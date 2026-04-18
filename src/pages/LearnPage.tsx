// ============================================================
// LEARN PAGE — src/pages/LearnPage.tsx
// Interactive Python lesson viewer with categorized lessons,
// exercise editor, ad-to-unlock, and progress tracking.
// ============================================================
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { lessons } from "@/data/lessons";
import { useProgress } from "@/contexts/ProgressContext";
import { useAuth } from "@/contexts/AuthContext";
import { ExerciseEditor } from "@/components/ExerciseEditor";
import { AdViewModal } from "@/components/AdViewModal";
import { SPONSOR_DESTINATIONS } from "@/data/ads";
import { BookOpen, CheckCircle2, ChevronRight, Terminal, Lock, Play, ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import { triggerTour } from "@/components/TourSystem";
import { useCallback } from "react";

const categoryOrder = ["Beginner", "Intermediate", "Advanced", "Expert"] as const;

const categoryTone: Record<(typeof categoryOrder)[number], { label: string; heading: string; badge: string }> = {
  Beginner: {
    label: "text-streak-green",
    heading: "🟢 Beginner",
    badge: "bg-streak-green/10 text-streak-green border-streak-green/20",
  },
  Intermediate: {
    label: "text-primary",
    heading: "🔵 Intermediate",
    badge: "bg-primary/10 text-primary border-primary/20",
  },
  Advanced: {
    label: "text-expert-purple",
    heading: "🟣 Advanced",
    badge: "bg-expert-purple/10 text-expert-purple border-expert-purple/20",
  },
  Expert: {
    label: "text-reward-gold",
    heading: "🟡 Expert",
    badge: "bg-reward-gold/10 text-reward-gold border-reward-gold/20",
  },
};

const topicCoverage = [
  {
    title: "Core Python",
    items: ["Syntax", "variables", "data types", "strings", "input/output", "numbers", "control flow", "loops"],
  },
  {
    title: "Collections",
    items: ["Lists", "tuples", "sets", "dictionaries", "comprehensions", "sorting", "itertools", "functional tools"],
  },
  {
    title: "Functions To OOP",
    items: ["Functions", "recursion", "modules", "imports", "classes", "inheritance", "decorators", "context managers"],
  },
  {
    title: "Real-World Python",
    items: ["Files", "exceptions", "regex", "testing", "debugging", "APIs", "web scraping", "concurrency"],
  },
];

const beginnerMastery = [
  "Read and write basic Python syntax confidently",
  "Use variables, data types, strings, and numbers correctly",
  "Make decisions with if, elif, else, and boolean logic",
  "Repeat work with for loops, while loops, and range()",
  "Work with lists, tuples, sets, and dictionaries",
  "Write simple reusable functions with parameters and return values",
  "Handle input, formatted output, and common beginner mistakes",
  "Read small programs and explain what each line is doing",
];

function getLessonHeadings(content: string) {
  return content
    .split("\n")
    .filter((line) => line.startsWith("## ") || line.startsWith("### "))
    .map((line) => line.replace(/^###?\s+/, ""))
    .slice(0, 5);
}

type LessonClarityGuide = {
  summary: string;
  analogy: string;
  steps: string[];
  whereToUse: string[];
  commonMistakes: string[];
  quickCheck: string;
};

type LessonNarrative = {
  explanation: string;
  practicalUse: string[];
  implementationFlow: string[];
};

type QuickExample = {
  label: string;
  code: string;
};

type LessonUsagePlaybook = {
  whenToUse: string[];
  howToApply: string[];
  starterPattern: string;
};

type KeywordGuide = {
  howToUse: string;
  whereToUse: string;
  example?: string;
};

const keywordGuides: Record<string, KeywordGuide> = {
  ".upper()": { howToUse: "Call on a string to convert all letters to uppercase.", whereToUse: "Case-insensitive search and standardized display text." },
  ".lower()": { howToUse: "Call on a string to convert all letters to lowercase.", whereToUse: "Normalizing user input like emails/usernames." },
  ".title()": { howToUse: "Converts first letter of each word to uppercase.", whereToUse: "Formatting names and headings in UI." },
  ".strip()": { howToUse: "Removes extra spaces/newlines from both ends.", whereToUse: "Cleaning form inputs and CSV/text data." },
  ".split()": { howToUse: "Splits one string into a list using a separator.", whereToUse: "Parsing comma/space-separated data." },
  ".join()": { howToUse: "Joins list items into one string with a separator.", whereToUse: "Building sentences, paths, CSV rows." },
  ".find()": { howToUse: "Returns index of first match or -1 if not found.", whereToUse: "Keyword checks in logs/messages." },
  ".replace()": { howToUse: "Replaces matching text with new text.", whereToUse: "Data cleanup and formatting corrections." },
  ".count()": { howToUse: "Counts how many times a value appears.", whereToUse: "Frequency checks in strings/lists." },
  ".startswith()": { howToUse: "Checks whether text starts with a prefix.", whereToUse: "Validating URL prefixes or file names." },
  ".endswith()": { howToUse: "Checks whether text ends with a suffix.", whereToUse: "Extension checks like `.py`, `.csv`, `.jpg`." },
  "range()": { howToUse: "Generates a sequence of numbers for loops.", whereToUse: "Index loops, repeated tasks, controlled iteration." },
  "break": { howToUse: "Stops the loop immediately.", whereToUse: "Exit early when target condition is met." },
  "continue": { howToUse: "Skips current iteration and moves to next one.", whereToUse: "Ignore invalid records while processing." },
  "if": { howToUse: "Runs a block only when condition is True.", whereToUse: "Validation and decision branching." },
  "elif": { howToUse: "Adds another condition after `if`.", whereToUse: "Multiple decision paths like grading/status." },
  "else": { howToUse: "Fallback block when all conditions are False.", whereToUse: "Default behavior and error fallback." },
  "int()": { howToUse: "Converts value to integer type.", whereToUse: "Math after reading string input." },
  "float()": { howToUse: "Converts value to decimal number.", whereToUse: "Prices, percentages, measurements." },
  "str()": { howToUse: "Converts value to text.", whereToUse: "Display and string concatenation." },
  "bool()": { howToUse: "Converts value to boolean True/False.", whereToUse: "Condition checks and filters." },
  "dict": { howToUse: "Store key-value pairs like `{name: value}`.", whereToUse: "Structured records and fast lookups." },
  "list": { howToUse: "Ordered collection using square brackets.", whereToUse: "Sequences of tasks, items, users, scores." },
  "set": { howToUse: "Unordered unique collection.", whereToUse: "Removing duplicates and membership tests." },
  "tuple": { howToUse: "Ordered immutable collection.", whereToUse: "Fixed-value groups like coordinates." },
};

function getKeywordExample(token: string): string | undefined {
  const t = token.trim();
  const n = t.toLowerCase();

  const examples: Record<string, string> = {
    ".upper()": `text = "hello"\nprint(text.upper())`,
    ".lower()": `text = "HELLO"\nprint(text.lower())`,
    ".title()": `name = "python learning"\nprint(name.title())`,
    ".strip()": `raw = "  user input  "\nprint(raw.strip())`,
    ".split()": `line = "a,b,c"\nprint(line.split(","))`,
    ".join()": `parts = ["python", "is", "fun"]\nprint(" ".join(parts))`,
    ".find()": `msg = "hello python"\nprint(msg.find("python"))`,
    ".replace()": `text = "I like Java"\nprint(text.replace("Java", "Python"))`,
    ".count()": `text = "banana"\nprint(text.count("a"))`,
    ".startswith()": `url = "https://pymaster.pro"\nprint(url.startswith("https://"))`,
    ".endswith()": `file = "notes.py"\nprint(file.endswith(".py"))`,
    "range()": `for i in range(1, 4):\n    print(i)`,
    "if": `age = 20\nif age >= 18:\n    print("Adult")`,
    "elif": `score = 75\nif score >= 90:\n    print("A")\nelif score >= 70:\n    print("B")`,
    "else": `logged_in = False\nif logged_in:\n    print("Welcome")\nelse:\n    print("Please login")`,
    "int()": `num = "42"\nprint(int(num) + 8)`,
    "float()": `price = "19.99"\nprint(float(price) * 2)`,
    "str()": `age = 21\nprint("Age: " + str(age))`,
    "bool()": `print(bool(0))\nprint(bool(1))`,
    "dict": `user = {"name": "Asha", "xp": 120}\nprint(user["xp"])`,
    "list": `nums = [1, 2, 3]\nnums.append(4)\nprint(nums)`,
    "set": `tags = {"python", "python", "api"}\nprint(tags)`,
    "tuple": `point = (10, 20)\nprint(point[0])`,
    "==": `print(5 == 5)`,
    "!=": `print(5 != 3)`,
    ">": `score = 80\nprint(score > 50)`,
    "<": `temp = 18\nprint(temp < 20)`,
    ">=": `age = 18\nprint(age >= 18)`,
    "<=": `items = 10\nprint(items <= 10)`,
    "and": `age = 20\npaid = True\nprint(age >= 18 and paid)`,
    "or": `is_admin = False\nis_owner = True\nprint(is_admin or is_owner)`,
    "not": `is_blocked = False\nprint(not is_blocked)`,
    "break": `for n in [1, 2, 3, 4]:\n    if n == 3:\n        break\n    print(n)`,
    "continue": `for n in [1, 2, 3, 4]:\n    if n == 3:\n        continue\n    print(n)`,
  };

  if (examples[t]) return examples[t];

  if (n.endsWith("()")) {
    return `# call ${t} in your code\n# Example:\nresult = ${t}\nprint(result)`;
  }
  if (n.startsWith(".")) {
    return `value = "sample"\nprint(value${t})`;
  }
  if (n.includes("[start:stop:step]") || n.includes("[:]")) {
    return `text = "Python"\nprint(text[1:4])\nprint(text[::-1])`;
  }
  return undefined;
}

function withKeywordExample(token: string, guide: KeywordGuide): KeywordGuide {
  if (guide.example) return guide;
  const example = getKeywordExample(token);
  return example ? { ...guide, example } : guide;
}

function getFallbackKeywordGuide(token: string): KeywordGuide | null {
  const normalized = token.trim().toLowerCase();

  const direct: Record<string, KeywordGuide> = {
    "==": { howToUse: "Checks if two values are equal.", whereToUse: "Condition checks in `if` statements and validations." },
    "!=": { howToUse: "Checks if two values are not equal.", whereToUse: "Branching when values should be different." },
    ">": { howToUse: "Checks if left value is greater than right value.", whereToUse: "Score cutoffs, thresholds, and sorting logic." },
    "<": { howToUse: "Checks if left value is less than right value.", whereToUse: "Limit checks and boundary validation." },
    ">=": { howToUse: "Checks if left value is greater than or equal to right value.", whereToUse: "Eligibility and minimum requirement checks." },
    "<=": { howToUse: "Checks if left value is less than or equal to right value.", whereToUse: "Upper-limit and range validations." },
    "+": { howToUse: "Adds numbers or combines strings/lists.", whereToUse: "Totals, counters, and simple concatenation." },
    "-": { howToUse: "Subtracts one value from another.", whereToUse: "Difference calculations and decrement logic." },
    "*": { howToUse: "Multiplies values.", whereToUse: "Scaling values, area calculations, and repeated patterns." },
    "/": { howToUse: "Divides and returns a float result.", whereToUse: "Ratios, averages, and decimal calculations." },
    "//": { howToUse: "Floor division; drops decimal part.", whereToUse: "Page counts, bucket sizing, integer quotient tasks." },
    "%": { howToUse: "Returns remainder after division.", whereToUse: "Even/odd checks, wrap-around logic, cyclic operations." },
    "**": { howToUse: "Raises a value to a power.", whereToUse: "Math formulas and growth calculations." },
    "=": { howToUse: "Assigns a value to a variable.", whereToUse: "Creating and updating program state." },
    "+=": { howToUse: "Adds and stores back in same variable.", whereToUse: "Counters, score updates, cumulative totals." },
    "-=": { howToUse: "Subtracts and stores back in same variable.", whereToUse: "Countdowns and stock/quantity reduction." },
    "*=": { howToUse: "Multiplies and stores back in same variable.", whereToUse: "Scaling values over repeated updates." },
    "/=": { howToUse: "Divides and stores back in same variable.", whereToUse: "Normalizing values and ratio adjustments." },
    "and": { howToUse: "All conditions must be True.", whereToUse: "Multi-rule validation and strict checks." },
    "or": { howToUse: "At least one condition must be True.", whereToUse: "Alternative acceptance conditions." },
    "not": { howToUse: "Reverses boolean value (True <-> False).", whereToUse: "Negation checks like `not is_valid`." },
    "in": { howToUse: "Checks membership or iterates over a collection.", whereToUse: "Loops and contains checks in strings/lists/sets." },
    "is": { howToUse: "Checks object identity.", whereToUse: "Comparing with `None` using `is None`." },
    "def": { howToUse: "Defines a function.", whereToUse: "Reusable logic blocks for cleaner code." },
    "return": { howToUse: "Sends a result back from a function.", whereToUse: "Reusable computations and testable functions." },
    "class": { howToUse: "Defines a class blueprint for objects.", whereToUse: "Modeling entities and organizing larger systems." },
    "try": { howToUse: "Starts a block that may raise errors.", whereToUse: "Safe parsing, file access, API calls." },
    "except": { howToUse: "Handles exceptions raised in `try` block.", whereToUse: "Graceful error handling and recovery paths." },
    "finally": { howToUse: "Runs cleanup code whether error happened or not.", whereToUse: "Closing resources and final state updates." },
    "raise": { howToUse: "Throws an exception explicitly.", whereToUse: "Input validation and enforcing constraints." },
    "with": { howToUse: "Manages resources with automatic cleanup.", whereToUse: "File handling and database/network resources." },
    "as": { howToUse: "Binds alias or context-managed object name.", whereToUse: "Readable imports and `with ... as ...` blocks." },
    "import": { howToUse: "Loads modules so their features can be used.", whereToUse: "Reusing standard library and third-party packages." },
    "from": { howToUse: "Imports specific names from a module.", whereToUse: "Cleaner references and selective imports." },
    "lambda": { howToUse: "Creates a small anonymous function expression.", whereToUse: "Inline transforms in `map`, `filter`, and sorting keys." },
    "yield": { howToUse: "Returns a value from a generator and pauses state.", whereToUse: "Memory-efficient iteration over large datasets." },
  };

  if (direct[normalized]) return direct[normalized];

  if (normalized.includes("[start:stop:step]") || normalized.includes("[:]") || normalized.includes("[::-1]")) {
    return {
      howToUse: "Use slicing as `sequence[start:stop:step]`; `start` inclusive, `stop` exclusive.",
      whereToUse: "Substrings, sublists, reversing, and sampling sequence data.",
    };
  }

  if (normalized.endsWith("()")) {
    return {
      howToUse: "Call this function with required arguments inside parentheses.",
      whereToUse: "Use when this operation needs to run and return a result/value.",
    };
  }

  if (normalized.startsWith(".")) {
    return {
      howToUse: "Call this method on an existing object value (like string/list/dict).",
      whereToUse: "Transforming or querying object data in-place or via return values.",
    };
  }

  return null;
}

function getKeywordGuidesForLine(line: string): Array<{ token: string; guide: KeywordGuide }> {
  const tokens = Array.from(line.matchAll(/`([^`]+)`/g)).map((m) => m[1]?.trim()).filter(Boolean) as string[];
  const matched: Array<{ token: string; guide: KeywordGuide }> = [];

  for (const token of tokens) {
    const exact = keywordGuides[token];
    if (exact) {
      matched.push({ token, guide: withKeywordExample(token, exact) });
      continue;
    }
    const normalized = token.toLowerCase();
    const fuzzy = Object.entries(keywordGuides).find(([k]) => normalized.includes(k.toLowerCase()));
    if (fuzzy) {
      matched.push({ token, guide: withKeywordExample(token, fuzzy[1]) });
      continue;
    }
    const fallback = getFallbackKeywordGuide(token);
    if (fallback) matched.push({ token, guide: withKeywordExample(token, fallback) });
  }

  const dedup = new Map<string, { token: string; guide: KeywordGuide }>();
  for (const item of matched) {
    if (!dedup.has(item.token)) dedup.set(item.token, item);
  }
  return Array.from(dedup.values()).slice(0, 3);
}

type DataTypeUsageItem = {
  name: string;
  whatItStores: string;
  whenToUse: string;
  example: string;
};

function getLocalizedLesson(
  lesson: (typeof lessons)[number] | undefined,
  language: "english" | "tamil" | "kannada" | "telugu" | "hindi",
) {
  if (!lesson) return undefined;
  if (language === "english") return lesson;

  const localized = lesson.translations?.[language];
  if (!localized) return lesson;

  return {
    ...lesson,
    title: localized.title ?? lesson.title,
    description: localized.description ?? lesson.description,
    content: localized.content ?? lesson.content,
    codeExample: localized.codeExample ?? lesson.codeExample,
    category: localized.category ?? lesson.category,
  };
}

type LearnLanguage = "english" | "tamil" | "kannada" | "telugu" | "hindi";

function extractGlossaryTerms(content: string) {
  const terms = new Set<string>();
  const re = /`([^`]+)`/g;
  let match: RegExpExecArray | null = re.exec(content);
  while (match) {
    const value = match[1]?.trim();
    if (value) terms.add(value);
    match = re.exec(content);
  }
  return Array.from(terms).slice(0, 10);
}

function getLessonClarityGuide(lessonId: string, title: string, language: LearnLanguage): LessonClarityGuide {
  if (language !== "english") {
    if (lessonId === "fundamentals") {
      if (language === "tamil") {
        return {
          summary: "Python ஒரு எளிய மற்றும் சக்திவாய்ந்த நிரலாக்க மொழி. இதை அடிப்படையாக கற்றால் மற்ற தலைப்புகள் எளிதாகும்.",
          analogy: "முதலில் எழுத்துக்கள் கற்றால் தான் வாக்கியம் எழுத முடியும்; அதுபோல Python அடிப்படைகள் முதலில் தேவை.",
          steps: [
            "print() மூலம் எளிய output எழுதவும்.",
            "variable உருவாக்கி value சேமிக்கவும்.",
            "if மற்றும் indentation எப்படி வேலை செய்கிறது பார்க்கவும்.",
            "குறுகிய code-ஐ ஓட்டி output சரிபார்க்கவும்.",
          ],
          whereToUse: [
            "முதல் automation scripts எழுத",
            "coding interview தயாரிப்புக்கு",
            "real project தொடங்கும் முன் அடித்தளம் அமைக்க",
          ],
          commonMistakes: [
            "indentation தவறு செய்வது",
            "string-க்கு quotes மறப்பது",
            "code ஓட்டாமல் theory மட்டும் படிப்பது",
          ],
          quickCheck: "`print('Hello')` ஓட்டும் போது என்ன output வரும்? ஏன்?",
        };
      }
      if (language === "kannada") {
        return {
          summary: "Python ಒಂದು ಸರಳ ಮತ್ತು ಶಕ್ತಿಶಾಲಿ ಭಾಷೆ. ಇದರ ಮೂಲಭಾಗ ತಿಳಿದರೆ ಮುಂದಿನ ವಿಷಯಗಳು ಸುಲಭವಾಗುತ್ತವೆ.",
          analogy: "ಅಕ್ಷರಗಳನ್ನು ಕಲಿತ ಮೇಲೆ ವಾಕ್ಯ ಬರೆಯುವಂತೆ, Python ಮೂಲಭಾಗ ಮೊದಲಿಗೆ ಬೇಕಾಗುತ್ತದೆ.",
          steps: [
            "print() ಬಳಸಿ ಸರಳ output ಬರೆಯಿರಿ.",
            "variable ರಚಿಸಿ value ಇಡಿ.",
            "if ಮತ್ತು indentation ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತವೆ ನೋಡಿ.",
            "ಸಣ್ಣ code ಓಡಿಸಿ output ಪರಿಶೀಲಿಸಿ.",
          ],
          whereToUse: [
            "ಮೊದಲ automation script ಬರೆಯಲು",
            "coding interview ತಯಾರಿಗಾಗಿ",
            "project ಶುರು ಮಾಡುವ ಮುನ್ನ foundation ಕಟ್ಟಲು",
          ],
          commonMistakes: [
            "indentation ತಪ್ಪು",
            "string quotes ಮರೆತುವುದು",
            "code ಓಡಿಸದೇ theory ಮಾತ್ರ ಓದುವುದು",
          ],
          quickCheck: "`print('Hello')` ಓಡಿಸಿದಾಗ ಏನು output ಬರುತ್ತದೆ?",
        };
      }
      if (language === "telugu") {
        return {
          summary: "Python సులభమైన మరియు శక్తివంతమైన భాష. దీని బేసిక్స్ బలంగా ఉంటే మిగతా టాపిక్స్ సులభమవుతాయి.",
          analogy: "అక్షరాలు నేర్చుకున్న తర్వాతే వాక్యాలు రాయగలం; అలాగే Pythonలో బేసిక్స్ ముందుగా కావాలి.",
          steps: [
            "print() తో సాధారణ output రాయండి.",
            "variable సృష్టించి value ఇవ్వండి.",
            "if మరియు indentation ఎలా పనిచేస్తాయో చూడండి.",
            "చిన్న code run చేసి output తనిఖీ చేయండి.",
          ],
          whereToUse: [
            "మొదటి automation scripts కోసం",
            "coding interview సిద్ధతలో",
            "project మొదలుపెట్టే ముందు foundation కోసం",
          ],
          commonMistakes: [
            "indentation తప్పులు",
            "string quotes మర్చిపోవడం",
            "code run చేయకుండా theory మాత్రమే చదవడం",
          ],
          quickCheck: "`print('Hello')` రన్ చేస్తే output ఏమిటి?",
        };
      }
      if (language === "hindi") {
        return {
          summary: "Python एक सरल और शक्तिशाली भाषा है। इसकी बुनियाद मजबूत होगी तो आगे के टॉपिक्स आसान होंगे।",
          analogy: "जैसे अक्षर सीखकर ही वाक्य लिखते हैं, वैसे ही Python में पहले fundamentals जरूरी हैं।",
          steps: [
            "print() से सरल output लिखें।",
            "variable बनाकर value रखें।",
            "if और indentation का व्यवहार देखें।",
            "छोटा code चलाकर output जांचें।",
          ],
          whereToUse: [
            "पहले automation scripts लिखने में",
            "coding interview तैयारी में",
            "project शुरू करने से पहले foundation बनाने में",
          ],
          commonMistakes: [
            "indentation गलती करना",
            "string के quotes भूलना",
            "code चलाए बिना सिर्फ theory पढ़ना",
          ],
          quickCheck: "`print('Hello')` चलाने पर output क्या आएगा?",
        };
      }
    }

    return {
      summary:
        language === "tamil"
          ? "இந்த பாடம் ஒரு முக்கிய Python கருத்தை எளிமையாக கற்பிக்கிறது."
          : language === "kannada"
            ? "ಈ ಪಾಠವು ಒಂದು ಮುಖ್ಯ Python ಕಲ್ಪನೆಯನ್ನು ಸರಳವಾಗಿ ಕಲಿಸುತ್ತದೆ."
            : language === "telugu"
              ? "ఈ పాఠం ఒక ముఖ్యమైన Python కాన్సెప్ట్‌ను సులభంగా నేర్పిస్తుంది."
              : "यह पाठ एक महत्वपूर्ण Python concept को सरल तरीके से समझाता है।",
      analogy:
        language === "tamil"
          ? "கருத்தை புரிந்து, உதாரணம் ஓட்டி, சிறிய task-ல் பயன்படுத்துவது சிறந்த வழி."
          : language === "kannada"
            ? "ಕಲ್ಪನೆಯನ್ನು ಅರ್ಥಮಾಡಿ, ಉದಾಹರಣೆ ಓಡಿಸಿ, ಸಣ್ಣ task ನಲ್ಲಿ ಬಳಸಿ."
            : language === "telugu"
              ? "కాన్సెప్ట్ అర్థం చేసుకుని, ఉదాహరణ రన్ చేసి, చిన్న taskలో ఉపయోగించండి."
              : "Concept समझें, example चलाएं, फिर छोटे task में लागू करें।",
      steps:
        language === "tamil"
          ? ["கருத்தை வாசிக்கவும்", "உதாரணம் ஓட்டவும்", "ஒரு value மாற்றி பார்க்கவும்", "பயிற்சியில் பயன்படுத்தவும்"]
          : language === "kannada"
            ? ["ಕಲ್ಪನೆ ಓದಿ", "ಉದಾಹರಣೆ ಓಡಿಸಿ", "ಒಂದು value ಬದಲಿಸಿ ನೋಡಿ", "ಅಭ್ಯಾಸದಲ್ಲಿ ಬಳಸಿ"]
            : language === "telugu"
              ? ["కాన్సెప్ట్ చదవండి", "ఉదాహరణ run చేయండి", "ఒక value మార్చి చూడండి", "వ్యాయామంలో ప్రయోగించండి"]
              : ["Concept पढ़ें", "Example चलाएं", "एक value बदलकर देखें", "Exercise में लागू करें"],
      whereToUse:
        language === "tamil"
          ? ["Coding practice", "Interview preparation", "Real project logic"]
          : language === "kannada"
            ? ["Coding ಅಭ್ಯಾಸ", "Interview ತಯಾರಿ", "Real project logic"]
            : language === "telugu"
              ? ["Coding practice", "Interview preparation", "Real project logic"]
              : ["Coding practice", "Interview preparation", "Real project logic"],
      commonMistakes:
        language === "tamil"
          ? ["code ஓட்டாமல் விடுதல்", "அடிப்படை படிகளை தவிர்த்தல்", "output சரிபார்க்காமல் போதல்"]
          : language === "kannada"
            ? ["code ಓಡಿಸದೇ ಬಿಡುವುದು", "ಮೂಲ ಹಂತಗಳನ್ನು ಬಿಟ್ಟುಹೋಗುವುದು", "output ಪರಿಶೀಲಿಸದೇ ಇರುವುದು"]
            : language === "telugu"
              ? ["code run చేయకుండా వదిలేయడం", "basic steps skip చేయడం", "output check చేయకపోవడం"]
              : ["code चलाए बिना आगे बढ़ना", "basic steps skip करना", "output check न करना"],
      quickCheck:
        language === "tamil"
          ? "இந்த தலைப்பை 2 வரிகளில் விளக்க முடியுமா?"
          : language === "kannada"
            ? "ಈ ವಿಷಯವನ್ನು 2 ಸಾಲುಗಳಲ್ಲಿ ವಿವರಿಸಬಹುದೇ?"
            : language === "telugu"
              ? "ఈ టాపిక్‌ను 2 లైన్లలో వివరించగలరా?"
              : "क्या आप इस topic को 2 लाइनों में समझा सकते हैं?",
    };
  }

  const lower = title.toLowerCase();

  if (lower.includes("variable") || lower.includes("data type")) {
    return {
      summary: "Variables are named boxes that store values like text, numbers, or true/false.",
      analogy: "Think of labeled jars in a kitchen. The label is the variable name and the jar contents are the value.",
      steps: [
        "Pick a clear variable name.",
        "Store a value using `=`.",
        "Print it to verify the value.",
        "Change it and print again to understand updates.",
      ],
      whereToUse: [
        "Forms and profile data (`name`, `age`, `email`)",
        "Counters, scores, XP, wallet totals",
        "Flags like `is_logged_in` and `is_paid`",
      ],
      commonMistakes: [
        "Using unclear names like `x1` for everything.",
        "Mixing text and numbers without conversion.",
        "Forgetting that quotes make a value a string.",
      ],
      quickCheck: "If `age = 12`, what type is `age` and what does `print(age + 1)` output?",
    };
  }

  if (lower.includes("string")) {
    return {
      summary: "A string is text, and Python gives you many tools to clean, split, and format it.",
      analogy: "A string is like a sentence made of letter blocks. You can slice, flip, and join those blocks.",
      steps: [
        "Create a string value.",
        "Use one method at a time (`upper`, `lower`, `strip`).",
        "Try slicing to take only part of the text.",
        "Use `split` and `join` to transform structure.",
      ],
      whereToUse: [
        "User input cleanup (names, emails, messages)",
        "Text formatting in dashboards and reports",
        "Parsing logs, CSV lines, and API text fields",
      ],
      commonMistakes: [
        "Assuming strings can be changed in-place.",
        "Using wrong slice indexes.",
        "Forgetting that methods return a new string.",
      ],
      quickCheck: "What is the output of `'  hi  '.strip().upper()`?",
    };
  }

  if (lower.includes("loop")) {
    return {
      summary: "Loops repeat work so you do not write the same code again and again.",
      analogy: "A loop is like asking a robot to do one step many times until a stop condition is met.",
      steps: [
        "Choose `for` for a known sequence.",
        "Choose `while` for condition-based repetition.",
        "Print inside the loop to observe behavior.",
        "Use `break` and `continue` only when needed.",
      ],
      whereToUse: [
        "Iterating over lists from database/API responses",
        "Generating reports and summaries",
        "Processing many files, rows, or users in bulk",
      ],
      commonMistakes: [
        "Forgetting to update condition in `while` loops.",
        "Infinite loops from missing exit logic.",
        "Off-by-one errors with `range()`.",
      ],
      quickCheck: "What numbers are printed by `for i in range(1, 4): print(i)`?",
    };
  }

  if (lower.includes("function")) {
    return {
      summary: "Functions group reusable logic into one named block.",
      analogy: "A function is like a vending machine: give input, press button, get output.",
      steps: [
        "Define with `def` and a clear name.",
        "Pass input through parameters.",
        "Use `return` for output.",
        "Call it with test values.",
      ],
      whereToUse: [
        "Reusable business logic (`calculate_total`, `validate_user`)",
        "Breaking large files into clean modules",
        "Testing small units of logic independently",
      ],
      commonMistakes: [
        "Confusing `print` with `return`.",
        "Using global variables instead of parameters.",
        "Not testing with different inputs.",
      ],
      quickCheck: "What does `return` do that `print` does not?",
    };
  }

  if (lower.includes("list") || lower.includes("dictionary") || lower.includes("set") || lower.includes("tuple")) {
    return {
      summary: "Collections store multiple values and each type is best for different use cases.",
      analogy: "Think of a toolbox: lists are ordered trays, dictionaries are labeled drawers, sets are unique tokens.",
      steps: [
        "Pick the right collection type for the task.",
        "Add and remove values safely.",
        "Loop through values and inspect output.",
        "Use built-in methods instead of manual work.",
      ],
      whereToUse: [
        "Lists for ordered records and queues",
        "Dictionaries for fast key/value lookups",
        "Sets for unique items like tags or IDs",
      ],
      commonMistakes: [
        "Using list when unique values are needed (use set).",
        "Using wrong key names in dictionaries.",
        "Forgetting tuple values are immutable.",
      ],
      quickCheck: "Which type is best for fast key-value lookup: list, tuple, or dict?",
    };
  }

  if (lower.includes("input") || lower.includes("output") || lower.includes("print")) {
    return {
      summary: "Input and output connect your program to users and display results clearly.",
      analogy: "Input is listening, output is speaking.",
      steps: [
        "Read value from input or predefined variable.",
        "Convert to required type (`int`, `float`, etc.).",
        "Format output with f-strings for readability.",
        "Print clean, predictable output.",
      ],
      whereToUse: [
        "CLI tools and coding challenge programs",
        "Data collection scripts and calculators",
        "User-facing messages and logs",
      ],
      commonMistakes: [
        "Forgetting type conversion after input.",
        "Messy output formatting.",
        "Printing debug text in final answer output.",
      ],
      quickCheck: "Why does `input()` usually need `int()` for numeric math?",
    };
  }

  if (lower.includes("if") || lower.includes("elif") || lower.includes("else") || lower.includes("control flow") || lower.includes("boolean")) {
    return {
      summary: "Control flow lets your program choose different actions based on conditions.",
      analogy: "Like traffic signals deciding which lane can move.",
      steps: [
        "Write a condition that evaluates to True/False.",
        "Use `if` for first check, `elif` for extra checks.",
        "Use `else` as default fallback.",
        "Keep each branch simple and test all branches.",
      ],
      whereToUse: [
        "Validation (`if age >= 18`)",
        "Role/permission logic in apps",
        "Error handling and alternate flows",
      ],
      commonMistakes: [
        "Wrong indentation block.",
        "Using assignment `=` instead of comparison `==`.",
        "Overlapping conditions in wrong order.",
      ],
      quickCheck: "When should you use `elif` instead of another `if`?",
    };
  }

  if (lower.includes("class") || lower.includes("oop") || lower.includes("object") || lower.includes("inheritance")) {
    return {
      summary: "OOP organizes code by modeling real entities with data and behavior.",
      analogy: "A class is a blueprint; objects are real houses built from it.",
      steps: [
        "Define class with clear responsibility.",
        "Store shared data in `__init__`.",
        "Add methods for behavior.",
        "Create objects and call methods.",
      ],
      whereToUse: [
        "Large projects needing structure",
        "User/order/product domain modeling",
        "Reusable SDK/service clients",
      ],
      commonMistakes: [
        "Not using `self` correctly.",
        "Putting too many unrelated methods in one class.",
        "Overusing classes when simple functions are enough.",
      ],
      quickCheck: "What is the difference between a class and an object?",
    };
  }

  if (lower.includes("file") || lower.includes("exception") || lower.includes("error") || lower.includes("debug")) {
    return {
      summary: "This topic helps you build reliable programs that read data and handle failures safely.",
      analogy: "Seatbelts for your program: things can go wrong, but you stay in control.",
      steps: [
        "Use `with open(...)` for safe file handling.",
        "Wrap risky code in `try/except`.",
        "Log useful error messages.",
        "Fail gracefully with clear fallback behavior.",
      ],
      whereToUse: [
        "Reading/writing configs and reports",
        "API calls and parsing untrusted data",
        "Production scripts that must not crash silently",
      ],
      commonMistakes: [
        "Catching all exceptions without logging.",
        "Forgetting to close file handles.",
        "Ignoring edge cases and invalid input.",
      ],
      quickCheck: "Why is `with open(...)` preferred over manual open/close?",
    };
  }

  if (lower.includes("api") || lower.includes("json") || lower.includes("web")) {
    return {
      summary: "You are learning how to exchange data between systems in structured formats.",
      analogy: "APIs are waiters between your app and another app's kitchen.",
      steps: [
        "Send request to endpoint.",
        "Check response status and errors.",
        "Parse JSON data safely.",
        "Extract and use required fields.",
      ],
      whereToUse: [
        "Integrating payment/login/weather services",
        "Backend-to-backend communication",
        "Frontend data loading pipelines",
      ],
      commonMistakes: [
        "Assuming response shape without checks.",
        "Not handling timeout/network errors.",
        "Hardcoding sensitive tokens.",
      ],
      quickCheck: "What should you validate before trusting API response data?",
    };
  }

  if (lower.includes("recursion") || lower.includes("algorithm") || lower.includes("sort") || lower.includes("search")) {
    return {
      summary: "This lesson builds problem-solving speed and structured algorithmic thinking.",
      analogy: "Break a big puzzle into smaller solvable puzzles.",
      steps: [
        "Define the input/output clearly.",
        "Choose a method (iterative/recursive).",
        "Handle edge cases first.",
        "Test with small and tricky examples.",
      ],
      whereToUse: [
        "Interview and coding challenge problems",
        "Optimization and data processing tasks",
        "Backend logic with predictable performance",
      ],
      commonMistakes: [
        "Missing base case in recursion.",
        "Ignoring time complexity.",
        "Writing code before clarifying expected behavior.",
      ],
      quickCheck: "Why test edge cases before large random cases?",
    };
  }

  return {
    summary: "This lesson teaches a practical Python concept you will use in real applications.",
    analogy: "Learn it in three moves: understand idea, run example, apply to a small task.",
    steps: [
      "Read the concept and expected output.",
      "Run the example exactly once.",
      "Change one value and observe behavior.",
      "Solve the three exercises in order.",
    ],
    whereToUse: [
      "Coding interviews and challenge platforms",
      "Automation scripts and utilities",
      "Real backend/business logic in projects",
    ],
    commonMistakes: [
      "Reading without running code.",
      "Skipping basic examples and jumping too fast.",
      "Not checking outputs after each change.",
    ],
    quickCheck: "Can you explain this topic in two lines to a beginner friend?",
  };
}

function getDataTypeUsageGuide(lessonId: string): DataTypeUsageItem[] {
  if (lessonId !== "variables") return [];

  return [
    {
      name: "int",
      whatItStores: "Whole numbers without decimals, like age, count, and score.",
      whenToUse: "Use when you need exact counting or indexing.",
      example: "age = 21",
    },
    {
      name: "float",
      whatItStores: "Decimal numbers, like price, height, and scientific values.",
      whenToUse: "Use when decimal precision is needed.",
      example: "price = 99.95",
    },
    {
      name: "str",
      whatItStores: "Text values such as names, messages, and addresses.",
      whenToUse: "Use for any user-facing text or labels.",
      example: 'username = "PyMaster"',
    },
    {
      name: "bool",
      whatItStores: "Logical values: True or False.",
      whenToUse: "Use for conditions, flags, and decision checks.",
      example: "is_logged_in = True",
    },
    {
      name: "NoneType",
      whatItStores: "A single special value, None, meaning no value yet.",
      whenToUse: "Use when data is optional or not assigned.",
      example: "middle_name = None",
    },
  ];
}

function getLessonNarrative(lessonId: string, title: string, language: LearnLanguage): LessonNarrative {
  if (language !== "english") {
    if (lessonId === "fundamentals") {
      if (language === "tamil") {
        return {
          explanation:
            "இந்த பாடம் Python உலகுக்கான நுழைவாயில். syntax, print, variables, indentation போன்ற அடிப்படைகள் பின்னர் வரும் எல்லா பாடங்களுக்கும் foundation ஆகும்.",
          practicalUse: [
            "சிறிய scripts எழுத ஆரம்பிக்க",
            "Programming logic-ஐ நிதானமாகப் புரிந்துகொள்ள",
            "அடுத்த பாடங்களுக்கு நம்பிக்கையுடன் செல்ல",
          ],
          implementationFlow: [
            "ஒரு simple print program எழுதவும்",
            "variable உருவாக்கி value அச்சிடவும்",
            "if block-ல் indentation முயற்சிக்கவும்",
            "output சரியாக வரும்வரை சிறிய மாற்றங்கள் செய்யவும்",
          ],
        };
      }
      if (language === "kannada") {
        return {
          explanation:
            "ಈ ಪಾಠ Python ಗೆ ಪ್ರವೇಶದ್ವಾರ. syntax, print, variables, indentation ಮುಂತಾದ ಮೂಲಭಾಗಗಳು ಮುಂದಿನ ಪಾಠಗಳಿಗೆ foundation ಆಗುತ್ತವೆ.",
          practicalUse: [
            "ಸಣ್ಣ scripts ಬರೆಯಲು ಆರಂಭಿಸಲು",
            "Programming logic ಅನ್ನು ಸುಲಭವಾಗಿ ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು",
            "ಮುಂದಿನ ಪಾಠಗಳಿಗೆ ಆತ್ಮವಿಶ್ವಾಸದಿಂದ ಹೋಗಲು",
          ],
          implementationFlow: [
            "ಸರಳ print program ಬರೆಯಿರಿ",
            "variable ರಚಿಸಿ value print ಮಾಡಿ",
            "if block ನಲ್ಲಿ indentation ಪ್ರಯತ್ನಿಸಿ",
            "output ಸರಿಯಾಗುವವರೆಗೆ ಸಣ್ಣ ಬದಲಾವಣೆ ಮಾಡಿ",
          ],
        };
      }
      if (language === "telugu") {
        return {
          explanation:
            "ఈ పాఠం Pythonకి ఎంట్రీ పాయింట్. syntax, print, variables, indentation వంటి బేసిక్స్ మిగతా అన్ని పాఠాలకు foundation అవుతాయి.",
          practicalUse: [
            "చిన్న scripts రాయడం ప్రారంభించడానికి",
            "Programming logic ను స్పష్టంగా అర్థం చేసుకోవడానికి",
            "తదుపరి పాఠాలకు ధైర్యంగా వెళ్లడానికి",
          ],
          implementationFlow: [
            "ఒక simple print program రాయండి",
            "variable సృష్టించి value print చేయండి",
            "if block లో indentation ప్రాక్టీస్ చేయండి",
            "output సరిగా వచ్చే వరకు చిన్న మార్పులు చేయండి",
          ],
        };
      }
      if (language === "hindi") {
        return {
          explanation:
            "यह पाठ Python की शुरुआत है। syntax, print, variables और indentation जैसी fundamentals आगे के सभी lessons की foundation बनती हैं।",
          practicalUse: [
            "छोटे scripts लिखना शुरू करने में",
            "Programming logic समझने में",
            "आगे के lessons के लिए confidence बनाने में",
          ],
          implementationFlow: [
            "एक simple print program लिखें",
            "variable बनाकर value print करें",
            "if block में indentation का अभ्यास करें",
            "output सही आने तक छोटे बदलाव करें",
          ],
        };
      }
    }

    return {
      explanation:
        language === "tamil"
          ? "இந்த பாடம் ஒரு நடைமுறை Python கருத்தை அறிமுகப்படுத்துகிறது. கருத்தை புரிந்து, உதாரணத்தை ஓட்டி, அதையே பயிற்சியில் பயன்படுத்துங்கள்."
          : language === "kannada"
            ? "ಈ ಪಾಠವು ಒಂದು practically ಉಪಯೋಗವಾಗುವ Python ಕಲ್ಪನೆಯನ್ನು ಪರಿಚಯಿಸುತ್ತದೆ. ಕಲ್ಪನೆಯನ್ನು ಅರ್ಥಮಾಡಿ, ಉದಾಹರಣೆ ಓಡಿಸಿ, ಅಭ್ಯಾಸದಲ್ಲಿ ಬಳಸಿ."
            : language === "telugu"
              ? "ఈ పాఠం ఒక ప్రాక్టికల్ Python కాన్సెప్ట్‌ను పరిచయం చేస్తుంది. కాన్సెప్ట్ అర్థం చేసుకుని, ఉదాహరణ రన్ చేసి, వ్యాయామాల్లో ఉపయోగించండి."
              : "यह पाठ एक practical Python concept सिखाता है। Concept समझकर example चलाएं और उसी pattern को exercises में लागू करें।",
      practicalUse:
        language === "tamil"
          ? ["Coding challenges", "Project features", "Automation tasks"]
          : language === "kannada"
            ? ["Coding challenges", "Project features", "Automation tasks"]
            : language === "telugu"
              ? ["Coding challenges", "Project features", "Automation tasks"]
              : ["Coding challenges", "Project features", "Automation tasks"],
      implementationFlow:
        language === "tamil"
          ? ["கருத்தை படிக்கவும்", "உதாரணம் ஓட்டவும்", "ஒரு மாற்றம் செய்து output பார்க்கவும்", "exercise-ல் பயன்படுத்தவும்"]
          : language === "kannada"
            ? ["ಕಲ್ಪನೆ ಓದಿ", "ಉದಾಹರಣೆ ಓಡಿಸಿ", "ಒಂದು ಬದಲಾವಣೆ ಮಾಡಿ output ನೋಡಿ", "exercise ನಲ್ಲಿ ಬಳಸಿ"]
            : language === "telugu"
              ? ["కాన్సెప్ట్ చదవండి", "ఉదాహరణ run చేయండి", "ఒక మార్పు చేసి output చూడండి", "exercise లో ప్రయోగించండి"]
              : ["Concept पढ़ें", "Example चलाएं", "एक बदलाव कर output देखें", "Exercise में लागू करें"],
    };
  }

  const lower = title.toLowerCase();

  if (lower.includes("variable") || lower.includes("data type")) {
    return {
      explanation:
        "Variables and data types are the foundation of every Python program. A variable stores data, and the data type tells Python how that value should behave during operations like math, text formatting, and comparisons.",
      practicalUse: [
        "Store user profile fields (`name`, `email`, `age`) safely",
        "Track counters, marks, wallet balances, and flags in app logic",
        "Prevent runtime bugs by converting incoming values to correct types",
      ],
      implementationFlow: [
        "Create descriptive variable names",
        "Assign values and verify using `type()` while learning",
        "Convert values before calculations (`int`, `float`, `str`)",
        "Use booleans for decision logic and `None` for optional data",
      ],
    };
  }

  if (lower.includes("string")) {
    return {
      explanation:
        "String handling is essential because most application data arrives as text. Python string methods help clean, format, search, and transform this data into a structure your program can use.",
      practicalUse: [
        "Normalize user input (trim spaces, standardize case)",
        "Build readable output messages and reports",
        "Extract and parse tokens from logs, CSV, and API responses",
      ],
      implementationFlow: [
        "Read the raw string input",
        "Clean it using methods like `strip()` and `lower()`",
        "Use slicing/find/replace for controlled transformations",
        "Format final output with f-strings",
      ],
    };
  }

  if (lower.includes("loop")) {
    return {
      explanation:
        "Loops let you process repeated tasks efficiently. Instead of duplicating lines, one loop can apply the same logic to many values, users, files, or records.",
      practicalUse: [
        "Process lists of records from database/API calls",
        "Generate repeated outputs such as reports and summaries",
        "Run validation checks over multiple items",
      ],
      implementationFlow: [
        "Choose `for` for sequence-based iteration",
        "Choose `while` when repetition depends on a condition",
        "Add debug prints to verify each iteration result",
        "Use `break` and `continue` only for clear control points",
      ],
    };
  }

  if (lower.includes("function")) {
    return {
      explanation:
        "Functions turn repeated logic into reusable building blocks. They improve readability, reduce duplication, and make testing easier by isolating behavior.",
      practicalUse: [
        "Separate validation, calculation, and formatting logic",
        "Reuse the same logic across multiple screens or modules",
        "Write unit tests for independent behavior blocks",
      ],
      implementationFlow: [
        "Define a clear function name and purpose",
        "Pass input through parameters instead of global variables",
        "Return results so other code can reuse them",
        "Test with multiple input cases",
      ],
    };
  }

  if (lower.includes("class") || lower.includes("oop") || lower.includes("object")) {
    return {
      explanation:
        "Object-oriented programming helps structure large programs by grouping related data and behavior into classes. This keeps code modular and easier to maintain as complexity grows.",
      practicalUse: [
        "Model business entities like User, Product, and Order",
        "Encapsulate service clients and reusable components",
        "Organize large codebases by responsibilities",
      ],
      implementationFlow: [
        "Define a class with one clear responsibility",
        "Store shared state in `__init__`",
        "Add methods that operate on that state",
        "Instantiate objects and interact through methods",
      ],
    };
  }

  if (lower.includes("api") || lower.includes("json") || lower.includes("web")) {
    return {
      explanation:
        "API and JSON topics teach your app to communicate with external systems. This is core for real applications, where data comes from services, not just hardcoded values.",
      practicalUse: [
        "Read live data from external services",
        "Send and receive structured payloads safely",
        "Build integrations with payment, auth, and analytics platforms",
      ],
      implementationFlow: [
        "Call the endpoint and check status",
        "Parse JSON and validate expected fields",
        "Handle failures (timeouts, bad response shapes)",
        "Map response data to internal variables cleanly",
      ],
    };
  }

  if (lower.includes("exception") || lower.includes("debug") || lower.includes("file")) {
    return {
      explanation:
        "Reliable programs must handle unexpected conditions. File handling and exceptions help you build code that fails gracefully instead of crashing unexpectedly.",
      practicalUse: [
        "Safe file read/write in tools and scripts",
        "Resilient API parsing and transformation flows",
        "Production-grade logging and issue diagnosis",
      ],
      implementationFlow: [
        "Use `with open(...)` for safe file operations",
        "Wrap risk points in `try/except` blocks",
        "Add meaningful error messages for debugging",
        "Return fallback behavior when recovery is possible",
      ],
    };
  }

  return {
    explanation:
      "This lesson introduces a practical Python concept used in everyday coding tasks. Focus on understanding the core idea first, then applying it in small examples before moving to larger exercises.",
    practicalUse: [
      "Core interview and challenge problem solving",
      "Automation scripts and backend feature logic",
      "Data handling and application flow control",
    ],
    implementationFlow: [
      "Read the concept and expected behavior",
      "Run the example and inspect output carefully",
      "Modify one line and observe the difference",
      "Implement the same pattern in exercises",
    ],
  };
}

function getLessonQuickExamples(title: string): QuickExample[] {
  const lower = title.toLowerCase();

  if (lower.includes("variable") || lower.includes("data type")) {
    return [
      { label: "Store and print values", code: `name = "Asha"\nage = 21\nprint(name, age)` },
      { label: "Type conversion", code: `price = "199"\nprint(int(price) + 1)` },
      { label: "Boolean check", code: `is_paid = True\nprint("Access" if is_paid else "Blocked")` },
    ];
  }

  if (lower.includes("string")) {
    return [
      { label: "Cleanup + normalize", code: `text = "  PyMaster  "\nprint(text.strip().lower())` },
      { label: "Split and join", code: `line = "python,is,fun"\nprint(" | ".join(line.split(",")))` },
      { label: "Find and replace", code: `msg = "I like Java"\nprint(msg.replace("Java", "Python"))` },
    ];
  }

  if (lower.includes("loop")) {
    return [
      { label: "for loop with range", code: `for i in range(1, 4):\n    print(i)` },
      { label: "while loop", code: `count = 3\nwhile count > 0:\n    print(count)\n    count -= 1` },
      { label: "break usage", code: `for n in [2, 5, 7, 9]:\n    if n == 7:\n        break\n    print(n)` },
    ];
  }

  if (lower.includes("function")) {
    return [
      { label: "Simple function", code: `def greet(name):\n    return f"Hello, {name}"\nprint(greet("PyMaster"))` },
      { label: "Function with math", code: `def square(n):\n    return n * n\nprint(square(6))` },
      { label: "Default argument", code: `def welcome(name="Learner"):\n    print("Welcome", name)\nwelcome()` },
    ];
  }

  if (lower.includes("class") || lower.includes("oop") || lower.includes("object")) {
    return [
      { label: "Create class + object", code: `class User:\n    def __init__(self, name):\n        self.name = name\nu = User("Asha")\nprint(u.name)` },
      { label: "Method call", code: `class Counter:\n    def __init__(self):\n        self.value = 0\n    def inc(self):\n        self.value += 1\nc = Counter(); c.inc(); print(c.value)` },
      { label: "Inheritance basics", code: `class A:\n    def hello(self):\n        print("Hi")\nclass B(A):\n    pass\nB().hello()` },
    ];
  }

  if (lower.includes("if") || lower.includes("elif") || lower.includes("else") || lower.includes("control flow")) {
    return [
      { label: "if/else", code: `score = 72\nif score >= 40:\n    print("Pass")\nelse:\n    print("Fail")` },
      { label: "if/elif/else", code: `marks = 85\nif marks >= 90:\n    print("A")\nelif marks >= 75:\n    print("B")\nelse:\n    print("C")` },
      { label: "Ternary", code: `age = 20\nstatus = "Adult" if age >= 18 else "Minor"\nprint(status)` },
    ];
  }

  if (lower.includes("list") || lower.includes("dictionary") || lower.includes("set") || lower.includes("tuple")) {
    return [
      { label: "List basics", code: `nums = [1, 2, 3]\nnums.append(4)\nprint(nums)` },
      { label: "Dictionary lookup", code: `user = {"name": "Asha", "xp": 120}\nprint(user["xp"])` },
      { label: "Set uniqueness", code: `tags = {"python", "python", "api"}\nprint(tags)` },
    ];
  }

  if (lower.includes("api") || lower.includes("json") || lower.includes("web")) {
    return [
      { label: "JSON encode", code: `import json\ndata = {"name": "PyMaster", "ok": True}\nprint(json.dumps(data))` },
      { label: "JSON decode", code: `import json\ntext = '{"city":"Chennai","pin":600001}'\nprint(json.loads(text)["city"])` },
      { label: "Safe key access", code: `payload = {"status": 200}\nprint(payload.get("message", "No message"))` },
    ];
  }

  return [
    { label: "Run first sample", code: `print("Start with this lesson example")` },
    { label: "Modify one value", code: `x = 10\nprint(x)\nx = 20\nprint(x)` },
    { label: "Check output", code: `result = 5 * 2\nprint("Result:", result)` },
  ];
}

function getLessonUsagePlaybook(title: string): LessonUsagePlaybook {
  const lower = title.toLowerCase();

  if (lower.includes("string")) {
    return {
      whenToUse: ["Cleaning user input", "Formatting UI text", "Searching/replacing keywords in messages"],
      howToApply: ["Normalize with `strip()` and `lower()`", "Transform with methods like `replace()`", "Print final output with clear formatting"],
      starterPattern: `text = "  Hello Python  "\nclean = text.strip().lower()\nprint(clean)\nprint(clean.replace("python", "world"))`,
    };
  }

  if (lower.includes("control flow") || lower.includes("if") || lower.includes("boolean")) {
    return {
      whenToUse: ["Decision making", "Validation checks", "Pass/fail or role-based logic"],
      howToApply: ["Write one clear condition", "Use `elif` for extra branches", "Add `else` as default fallback"],
      starterPattern: `score = 82\nif score >= 90:\n    print("A")\nelif score >= 75:\n    print("B")\nelse:\n    print("C")`,
    };
  }

  if (lower.includes("loop")) {
    return {
      whenToUse: ["Processing list data", "Running repeated checks", "Building reports/summaries"],
      howToApply: ["Pick `for` for sequences", "Use `while` for condition loops", "Use `break/continue` only when needed"],
      starterPattern: `total = 0\nfor n in [10, 20, 30]:\n    total += n\nprint(total)`,
    };
  }

  if (lower.includes("function")) {
    return {
      whenToUse: ["Reusing logic", "Reducing duplicate code", "Making code testable"],
      howToApply: ["Define a clear function name", "Pass parameters instead of globals", "Return the result for reuse"],
      starterPattern: `def calculate_total(price, tax):\n    return price + tax\n\nprint(calculate_total(100, 18))`,
    };
  }

  if (lower.includes("list") || lower.includes("tuple") || lower.includes("set") || lower.includes("dict")) {
    return {
      whenToUse: ["Storing multiple values", "Fast lookups", "Unique-item filtering"],
      howToApply: ["Choose right type (`list/dict/set/tuple`)", "Use built-in methods first", "Loop and print to verify structure"],
      starterPattern: `users = ["Asha", "Raj", "Asha"]\nunique_users = set(users)\nprint(unique_users)\nprofile = {"name": "Asha", "xp": 120}\nprint(profile["xp"])`,
    };
  }

  if (lower.includes("file") || lower.includes("error") || lower.includes("exception")) {
    return {
      whenToUse: ["Reading/writing files", "Handling runtime failures", "Building robust scripts"],
      howToApply: ["Use `with open(...)` for safe resources", "Wrap risk code with `try/except`", "Print useful error context"],
      starterPattern: `try:\n    with open("notes.txt", "r") as f:\n        print(f.read())\nexcept FileNotFoundError:\n    print("File not found")`,
    };
  }

  return {
    whenToUse: ["Coding challenges", "Feature implementation", "Interview problem solving"],
    howToApply: ["Read concept once", "Run mini example", "Modify one value and observe output"],
    starterPattern: `x = 10\nprint("Before:", x)\nx = x + 5\nprint("After:", x)`,
  };
}

export default function LearnPage() {
  const { language } = useLanguage();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { progress, completeLesson, unlockLesson, resetLesson } = useProgress();
  const { user } = useAuth();
  const navigate = useNavigate();
  const categories = categoryOrder.filter((category) => lessons.some((lesson) => lesson.category === category));
  const text = {
    english: {
      lessonsTitle: "Python Lessons",
      completed: "completed",
      unlockInfo: "View a sponsor message or pay $100 to unlock lessons",
      takeQuiz: "Take 200 Python Quiz",
      allLessons: "All Lessons",
      resetLesson: "Reset Lesson",
      reset: "Reset",
      inThisLesson: "In This Lesson",
      keyTerms: "Key Terms In This Lesson",
      exercises: "Exercises",
      complete3: "Complete all 3 to unlock next chapter",
      nextUnlocked: "Next Chapter Unlocked!",
      lockedText: "Locked — complete all 3 exercises, watch an ad, or pay $100",
      sponsor: "Sponsor Message",
      next: "Next",
      selectLesson: "Select a Lesson",
      selectLessonDesc: "Choose a topic from the sidebar to start learning with a broader, clearer Python track.",
      startQuiz: "Start Quiz",
      beginnerMastery: "Beginner Mastery On PyMaster",
    },
    tamil: { lessonsTitle: "Python பாடங்கள்", completed: "முடிந்தது", unlockInfo: "Sponsor செய்தியை பாருங்கள் அல்லது $100 செலுத்தி திறக்கவும்", takeQuiz: "200 Python வினாடி வினா", allLessons: "அனைத்து பாடங்கள்", resetLesson: "பாடத்தை மீட்டமை", reset: "மீட்டமை", inThisLesson: "இந்த பாடத்தில்", keyTerms: "இந்த பாடத்தின் முக்கிய சொற்கள்", exercises: "பயிற்சிகள்", complete3: "அடுத்த அத்தியாயத்திற்காக 3-ஐ முடிக்கவும்", nextUnlocked: "அடுத்த அத்தியாயம் திறந்தது!", lockedText: "பூட்டப்பட்டது — 3 பயிற்சிகளை முடிக்கவும் அல்லது ad பார்க்கவும் அல்லது $100 செலுத்தவும்", sponsor: "Sponsor செய்தி", next: "அடுத்து", selectLesson: "ஒரு பாடத்தை தேர்வு செய்க", selectLessonDesc: "பக்கப்பட்டியலில் ஒரு தலைப்பை தேர்வு செய்து கற்றலை தொடங்குங்கள்.", startQuiz: "வினாடி வினா தொடங்கு", beginnerMastery: "PyMaster தொடக்க நிபுணத்துவம்" },
    kannada: { lessonsTitle: "Python ಪಾಠಗಳು", completed: "ಪೂರ್ಣಗೊಂಡವು", unlockInfo: "ಸ್ಪಾನ್ಸರ್ ಸಂದೇಶ ನೋಡಿ ಅಥವಾ $100 ನೀಡಿ ಅನ್‌ಲಾಕ್ ಮಾಡಿ", takeQuiz: "200 Python ಕ್ವಿಜ್ ತೆಗೆದುಕೊಳ್ಳಿ", allLessons: "ಎಲ್ಲಾ ಪಾಠಗಳು", resetLesson: "ಪಾಠ ಮರುಹೊಂದಿಸಿ", reset: "ಮರುಹೊಂದಿಸಿ", inThisLesson: "ಈ ಪಾಠದಲ್ಲಿ", keyTerms: "ಈ ಪಾಠದ ಮುಖ್ಯ ಪದಗಳು", exercises: "ಅಭ್ಯಾಸಗಳು", complete3: "ಮುಂದಿನ ಅಧ್ಯಾಯಕ್ಕಾಗಿ 3 ಪೂರ್ಣಗೊಳಿಸಿ", nextUnlocked: "ಮುಂದಿನ ಅಧ್ಯಾಯ ತೆರೆದಿದೆ!", lockedText: "ಲಾಕ್ — 3 ಅಭ್ಯಾಸಗಳು ಪೂರ್ಣಗೊಳಿಸಿ ಅಥವಾ ಜಾಹೀರಾತು ನೋಡಿ ಅಥವಾ $100 ಪಾವತಿಸಿ", sponsor: "ಸ್ಪಾನ್ಸರ್ ಸಂದೇಶ", next: "ಮುಂದೆ", selectLesson: "ಒಂದು ಪಾಠ ಆಯ್ಕೆಮಾಡಿ", selectLessonDesc: "ಕಲಿಕೆ ಪ್ರಾರಂಭಿಸಲು ಬದಿಪಟ್ಟಿಯಿಂದ ವಿಷಯ ಆಯ್ಕೆಮಾಡಿ.", startQuiz: "ಕ್ವಿಜ್ ಪ್ರಾರಂಭಿಸಿ", beginnerMastery: "PyMaster ಆರಂಭಿಕ ನಿಪುಣತೆ" },
    telugu: { lessonsTitle: "Python పాఠాలు", completed: "పూర్తయ్యాయి", unlockInfo: "స్పాన్సర్ సందేశం చూడండి లేదా $100 చెల్లించి అన్‌లాక్ చేయండి", takeQuiz: "200 Python క్విజ్ చేయండి", allLessons: "అన్ని పాఠాలు", resetLesson: "పాఠాన్ని రీసెట్ చేయి", reset: "రీసెట్", inThisLesson: "ఈ పాఠంలో", keyTerms: "ఈ పాఠంలోని ముఖ్య పదాలు", exercises: "వ్యాయామాలు", complete3: "తదుపరి అధ్యాయం కోసం 3 పూర్తి చేయండి", nextUnlocked: "తదుపరి అధ్యాయం అన్‌లాక్ అయింది!", lockedText: "లాక్ — 3 వ్యాయామాలు పూర్తి చేయండి లేదా ad చూడండి లేదా $100 చెల్లించండి", sponsor: "స్పాన్సర్ సందేశం", next: "తదుపరి", selectLesson: "ఒక పాఠం ఎంచుకోండి", selectLessonDesc: "సైడ్‌బార్ నుండి టాపిక్ ఎంచుకుని లెర్నింగ్ ప్రారంభించండి.", startQuiz: "క్విజ్ ప్రారంభించండి", beginnerMastery: "PyMaster బిగినర్ మాస్టరీ" },
    hindi: { lessonsTitle: "Python पाठ", completed: "पूरा", unlockInfo: "स्पॉन्सर संदेश देखें या $100 देकर अनलॉक करें", takeQuiz: "200 Python क्विज़ दें", allLessons: "सभी पाठ", resetLesson: "पाठ रीसेट करें", reset: "रीसेट", inThisLesson: "इस पाठ में", keyTerms: "इस पाठ के मुख्य शब्द", exercises: "अभ्यास", complete3: "अगला चैप्टर खोलने के लिए सभी 3 पूरे करें", nextUnlocked: "अगला चैप्टर अनलॉक!", lockedText: "लॉक — 3 अभ्यास पूरे करें, विज्ञापन देखें, या $100 दें", sponsor: "स्पॉन्सर संदेश", next: "अगला", selectLesson: "एक पाठ चुनें", selectLessonDesc: "सीखना शुरू करने के लिए साइडबार से विषय चुनें।", startQuiz: "क्विज़ शुरू करें", beginnerMastery: "PyMaster शुरुआती महारत" },
  } as const;
  // Keep Learn page UI labels fixed; only lesson content is language-dependent.
  const t = text.english;
  const tt = (key: string, fallback: string) => (t as Record<string, string>)[key] ?? fallback;



  const selectedLesson = useMemo(() => {
    const baseLesson = lessons.find((l) => l.id === selectedId);
    return getLocalizedLesson(baseLesson, language);
  }, [selectedId, language]);
  const canonical = "https://pymaster.pro/learn";
  const pageTitle = selectedLesson
    ? `${selectedLesson.title} Lesson | Learn Python on PyMaster`
    : "Learn Python Online for Free | Beginner to Advanced Lessons | PyMaster";
  const pageDescription = selectedLesson
    ? `Learn ${selectedLesson.title} in Python with clear explanation, practical examples, and hands-on exercises on PyMaster.`
    : "Learn Python online with step-by-step beginner to advanced lessons, practical examples, quizzes, and coding exercises on PyMaster.";
  const pageKeywords = selectedLesson
    ? `learn ${selectedLesson.title} python, ${selectedLesson.title} python tutorial, python ${selectedLesson.title} examples, python practice`
    : "learn python, python tutorial, python for beginners, python exercises, python course online, python interview preparation, python coding practice, python lessons";

  const learnStructuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Learn Python Step by Step",
    description: "Structured Python learning path with clear explanations, code examples, exercises, and progression from beginner to expert.",
    provider: {
      "@type": "Organization",
      name: "PyMaster",
      url: "https://pymaster.pro",
    },
    educationalLevel: "Beginner to Advanced",
    inLanguage: "en",
    url: canonical,
  };
  const webpageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: pageTitle,
    description: pageDescription,
    url: canonical,
    inLanguage: "en",
    isPartOf: {
      "@type": "WebSite",
      name: "PyMaster",
      url: "https://pymaster.pro",
    },
    primaryImageOfPage: "https://pymaster.pro/og-image.png",
    about: lessons.slice(0, 12).map((lesson) => ({
      "@type": "Thing",
      name: lesson.title,
    })),
  };
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://pymaster.pro/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Learn Python",
        item: canonical,
      },
    ],
  };
  const lessonsItemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Python Lessons on PyMaster",
    numberOfItems: lessons.length,
    itemListElement: lessons.map((lesson, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: lesson.title,
      description: lesson.description,
    })),
  };
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can beginners learn Python on PyMaster?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Lessons start from fundamentals and provide clear explanations, examples, and exercises for beginners.",
        },
      },
      {
        "@type": "Question",
        name: "Does PyMaster include coding practice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Each lesson includes exercises and you can run Python code in the built-in compiler.",
        },
      },
      {
        "@type": "Question",
        name: "What Python topics are covered?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The platform covers Python basics, data structures, functions, OOP, files, exceptions, APIs, and advanced topics.",
        },
      },
    ],
  };
  const exampleEditorHeight = useMemo(() => {
    if (!selectedLesson) return 220;
    const lineCount = selectedLesson.codeExample.split("\n").length;
    return Math.min(460, Math.max(200, lineCount * 22 + 24));
  }, [selectedLesson]);

  // A lesson is unlocked if:
  // - It's the first one
  // - All 3 exercises of the previous lesson are completed
  // - User paid $100 to unlock it
  const isLessonUnlocked = (index: number): boolean => {
    if (index === 0) return true;
    const lesson = lessons[index];
    if (progress.unlockedLessons.includes(lesson.id)) return true;
    const prevLesson = lessons[index - 1];
    const levels = ["beginner", "intermediate", "advanced"];
    return levels.every(l => progress.completedExercises.includes(`${prevLesson.id}:${l}`));
  };

  const isExerciseUnlocked = (lessonId: string, level: "beginner" | "intermediate" | "advanced"): boolean => {
    if (level === "beginner") return true;
    if (level === "intermediate") return progress.completedExercises.includes(`${lessonId}:beginner`);
    if (level === "advanced") return progress.completedExercises.includes(`${lessonId}:intermediate`);
    return false;
  };

  const getLessonProgress = (lessonId: string) => {
    const levels = ["beginner", "intermediate", "advanced"] as const;
    return levels.filter(l => progress.completedExercises.includes(`${lessonId}:${l}`)).length;
  };

  const [showAdForLesson, setShowAdForLesson] = useState<string | null>(null);

  const handleAdUnlock = (lessonId: string) => {
    setShowAdForLesson(lessonId);
  };

  const handleAdComplete = () => {
    if (showAdForLesson) {
      unlockLesson(showAdForLesson, 0);
      toast.success(tt("chapterUnlocked", "Chapter unlocked! 🔓"), {
        description: tt("sponsorThanks", "Thanks for viewing the sponsor message."),
      });
      setSelectedId(showAdForLesson);
      setShowAdForLesson(null);
    }
  };

  const handleWalletUnlock = (lessonId: string) => {
    const unlocked = unlockLesson(lessonId);
    if (!unlocked) {
      toast.error(tt("notEnoughCash", "Not enough cash"), {
        description: tt("walletNeed100", "You need $100 in your wallet to unlock this lesson instantly."),
      });
      return;
    }

    toast.success(tt("chapterUnlocked", "Chapter unlocked! 🔓"), {
      description: tt("walletSpent100", "You spent $100 to unlock this lesson."),
    });
    setSelectedId(lessonId);
  };

  const handleSelectLesson = (lessonId: string, index: number, unlocked: boolean) => {
    if (index > 0 && !user) {
      toast.info(tt("signInRequired", "Sign in required"), {
        description: tt("signInLessonInfo", "Create an account to continue learning beyond Lesson 1."),
      });
      navigate("/auth");
      return;
    }
    if (unlocked) {
      setSelectedId(lessonId);
    } else {
      handleAdUnlock(lessonId);
    }
  };

  const getLessonsByCategory = (cat: string) => lessons.filter(l => l.category === cat);
  const selectedLessonHeadings = selectedLesson ? getLessonHeadings(selectedLesson.content) : [];
  const selectedLessonGlossary = useMemo(
    () => (selectedLesson ? extractGlossaryTerms(selectedLesson.content) : []),
    [selectedLesson],
  );
  const selectedLessonClarityGuide = useMemo(
    () => (selectedLesson ? getLessonClarityGuide(selectedLesson.id, selectedLesson.title, language) : null),
    [selectedLesson, language],
  );
  const selectedLessonDataTypeGuide = useMemo(
    () => (selectedLesson ? getDataTypeUsageGuide(selectedLesson.id) : []),
    [selectedLesson],
  );
  const selectedLessonNarrative = useMemo(
    () => (selectedLesson ? getLessonNarrative(selectedLesson.id, selectedLesson.title, language) : null),
    [selectedLesson, language],
  );
  const selectedLessonQuickExamples = useMemo(
    () => (selectedLesson ? getLessonQuickExamples(selectedLesson.title) : []),
    [selectedLesson],
  );
  const selectedLessonUsagePlaybook = useMemo(
    () => (selectedLesson ? getLessonUsagePlaybook(selectedLesson.title) : null),
    [selectedLesson],
  );

  useEffect(() => {
    if (!selectedLesson) return;
    const levels = ["beginner", "intermediate", "advanced"] as const;
    const lessonFullyCompleted = levels.every((level) => progress.completedExercises.includes(`${selectedLesson.id}:${level}`));
    if (lessonFullyCompleted) {
      completeLesson(selectedLesson.id);
    }
  }, [completeLesson, progress.completedExercises, selectedLesson]);

  return (
    <>
    <Helmet>
      <title>{pageTitle}</title>
      <meta
        name="description"
        content={pageDescription}
      />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content="PyMaster" />
      <meta name="language" content="en" />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="PyMaster" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content="https://pymaster.pro/og-image.png" />
      <meta property="og:image:alt" content="Learn Python step by step with PyMaster lessons" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content="https://pymaster.pro/og-image.png" />
      <script type="application/ld+json">{JSON.stringify(learnStructuredData)}</script>
      <script type="application/ld+json">{JSON.stringify(webpageStructuredData)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbStructuredData)}</script>
      <script type="application/ld+json">{JSON.stringify(lessonsItemListStructuredData)}</script>
      <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
    </Helmet>
    <AdViewModal
      isOpen={!!showAdForLesson}
      onClose={() => setShowAdForLesson(null)}
      onComplete={handleAdComplete}
      sponsorLink={SPONSOR_DESTINATIONS.lessonUnlock}
      completionTitle={tt("lessonUnlocked", "Lesson unlocked")}
      completionDescription={tt("sponsorThanks", "Thanks for viewing the sponsor message.")}
    />
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col md:h-[calc(100vh-3.5rem)] md:flex-row">
      {/* Sidebar */}
      <aside id="tour-learn-sidebar" className="w-72 border-r border-border bg-surface-1 overflow-y-auto shrink-0 hidden md:block">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-primary" /> {t.lessonsTitle}
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {progress.completedLessons.length}/{lessons.length} {t.completed}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Play className="w-3 h-3" /> {t.unlockInfo}
          </p>
          <Button asChild size="sm" variant="outline" className="mt-3 w-full justify-start">
            <Link to="/python-quiz-100">{t.takeQuiz}</Link>
          </Button>
        </div>
        <nav className="p-2">
          {categories.map(cat => {
            const catLessons = getLessonsByCategory(cat);
            return (
              <div key={cat} className="mb-3">
                <div className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${categoryTone[cat].label}`}>
                  {categoryTone[cat].heading}
                </div>
                {catLessons.map((lesson) => {
                  const localizedLesson = getLocalizedLesson(lesson, language) ?? lesson;
                  const globalIndex = lessons.indexOf(lesson);
                  const unlocked = isLessonUnlocked(globalIndex);
                  const exercisesDone = getLessonProgress(lesson.id);
                  const allDone = exercisesDone === 3;
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleSelectLesson(lesson.id, globalIndex, unlocked)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors mb-0.5 ${
                        !unlocked
                          ? "text-muted-foreground/60 hover:bg-surface-2 cursor-pointer"
                          : selectedId === lesson.id
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {!unlocked ? (
                          <Lock className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                        ) : allDone ? (
                          <CheckCircle2 className="w-4 h-4 text-streak-green shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-border text-[10px] flex items-center justify-center shrink-0">
                            {globalIndex + 1}
                          </span>
                        )}
                        <span className="truncate flex-1">{localizedLesson.title}</span>
                        {!unlocked && (
                          <span className="text-[10px] text-primary flex items-center gap-0.5"><Play className="w-3 h-3" />Sponsor / $100</span>
                        )}
                      </div>
                      {/* Progress bar for unlocked lessons */}
                      {unlocked && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                allDone ? "bg-streak-green" : exercisesDone > 0 ? "bg-python-yellow" : "bg-muted-foreground/20"
                              }`}
                              style={{ width: `${(exercisesDone / 3) * 100}%` }}
                            />
                          </div>
                          <span className={`text-[10px] tabular-nums ${
                            allDone ? "text-streak-green" : exercisesDone > 0 ? "text-python-yellow" : "text-muted-foreground"
                          }`}>
                            {exercisesDone}/3
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedLesson ? (
          <div id="tour-learn-lesson" className="w-full max-w-none px-4 sm:px-6 py-6 md:py-8">
            {/* Mobile back button */}
            <button 
              onClick={() => setSelectedId(null)} 
              className="md:hidden flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> {t.allLessons}
            </button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full border ${categoryTone[selectedLesson.category as keyof typeof categoryTone]?.badge ?? "bg-secondary text-foreground border-border"}`}>
                {selectedLesson.category}
              </span>
              {getLessonProgress(selectedLesson.id) === 3 && (
                <span className="px-2 py-0.5 rounded-full bg-streak-green/10 text-streak-green border border-streak-green/20">
                  {tt("allExercisesComplete", "✓ All exercises complete")}
                </span>
              )}
            </div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{selectedLesson.title}</h1>
              {getLessonProgress(selectedLesson.id) > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-[10px] sm:text-xs gap-1.5 opacity-60 hover:opacity-100 shrink-0 hover:border-destructive/30 hover:text-destructive hover:bg-destructive/10" 
                  onClick={() => {
                    if (window.confirm(tt("resetLessonConfirm", "Reset progress for this lesson? You will need to complete these exercises again."))) {
                      resetLesson(selectedLesson.id);
                    }
                  }}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">{t.resetLesson}</span>
                  <span className="sm:hidden">{t.reset}</span>
                </Button>
              )}
            </div>
            <p className="text-muted-foreground mb-6">{selectedLesson.description}</p>

            {selectedLessonClarityGuide && (
              <div className="mb-6 rounded-2xl border border-primary/25 bg-primary/5 p-4 sm:p-5">
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3">{tt("clearLearningMode", "Crystal Clear Learning Mode")}</h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p><span className="font-semibold text-foreground">Simple summary:</span> {selectedLessonClarityGuide.summary}</p>
                  <p><span className="font-semibold text-foreground">Easy analogy:</span> {selectedLessonClarityGuide.analogy}</p>
                  <div>
                    <div className="font-semibold text-foreground mb-1">Step-by-step</div>
                    <ul className="space-y-1.5">
                      {selectedLessonClarityGuide.steps.map((step) => (
                        <li key={step} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-streak-green mt-0.5 shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground mb-1">Where to use this in real work</div>
                    <ul className="space-y-1.5">
                      {selectedLessonClarityGuide.whereToUse.map((useCase) => (
                        <li key={useCase} className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-primary shrink-0" />
                          <span>{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground mb-1">Common mistakes to avoid</div>
                    <ul className="space-y-1.5">
                      {selectedLessonClarityGuide.commonMistakes.map((mistake) => (
                        <li key={mistake} className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-python-yellow shrink-0" />
                          <span>{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p><span className="font-semibold text-foreground">Quick self-check:</span> {selectedLessonClarityGuide.quickCheck}</p>
                </div>
              </div>
            )}

            {selectedLessonHeadings.length > 0 && (
              <div className="mb-6 rounded-2xl border border-border bg-card/60 p-4">
                <div className="text-sm font-semibold text-foreground mb-3">{t.inThisLesson}</div>
                <div className="flex flex-wrap gap-2">
                  {selectedLessonHeadings.map((heading) => (
                    <span key={heading} className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground">
                      {heading}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedLessonGlossary.length > 0 && (
              <div className="mb-6 rounded-2xl border border-border bg-card/60 p-4">
                <div className="text-sm font-semibold text-foreground mb-3">{t.keyTerms}</div>
                <div className="flex flex-wrap gap-2">
                  {selectedLessonGlossary.map((term) => (
                    <span key={term} className="rounded-full border border-border bg-background px-3 py-1 text-sm text-muted-foreground">
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedLessonDataTypeGuide.length > 0 && (
              <div className="mb-6 rounded-2xl border border-primary/25 bg-primary/5 p-4 sm:p-5">
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3">{tt("howToUseDataTypes", "How To Use Each Data Type")}</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedLessonDataTypeGuide.map((item) => (
                    <div key={item.name} className="rounded-xl border border-border bg-background/80 p-3">
                      <div className="text-sm font-semibold text-foreground mb-1">{item.name}</div>
                      <p className="text-sm text-muted-foreground mb-1">
                        <span className="font-medium text-foreground">Stores:</span> {item.whatItStores}
                      </p>
                      <p className="text-sm text-muted-foreground mb-1">
                        <span className="font-medium text-foreground">Use when:</span> {item.whenToUse}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Example:</span> <code>{item.example}</code>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedLessonNarrative && (
              <div className="mb-6 rounded-2xl border border-border bg-card/70 p-4 sm:p-5">
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3">{tt("fullLessonExplanation", "Full Lesson Explanation")}</h2>
                <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed mb-3">
                  {selectedLessonNarrative.explanation}
                </p>
                <div className="mb-3">
                  <div className="font-semibold text-foreground mb-1">Where you will use this</div>
                  <ul className="space-y-1.5">
                    {selectedLessonNarrative.practicalUse.map((item) => (
                      <li key={item} className="text-[15px] sm:text-base text-muted-foreground leading-relaxed flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-foreground mb-1">How to apply it in code</div>
                  <ul className="space-y-1.5">
                    {selectedLessonNarrative.implementationFlow.map((step) => (
                      <li key={step} className="text-[15px] sm:text-base text-muted-foreground leading-relaxed flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {selectedLessonQuickExamples.length > 0 && (
              <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3">{tt("quickRunnableExamples", "Quick Runnable Examples")}</h2>
                <div className="grid gap-3">
                  {selectedLessonQuickExamples.map((example, index) => (
                    <div key={`${example.label}-${index}`} className="rounded-xl border border-border bg-background/80 p-3">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-sm font-semibold text-foreground">{example.label}</div>
                        <Button asChild size="sm" variant="outline" className="h-7 text-xs gap-1">
                          <Link to={`/compiler?code=${encodeURIComponent(example.code)}`}>
                            <Terminal className="w-3 h-3" /> {tt("tryInCompiler", "Try in Compiler")}
                          </Link>
                        </Button>
                      </div>
                      <pre className="rounded-lg border border-border bg-surface-1/60 p-2 text-xs sm:text-sm font-mono text-foreground whitespace-pre-wrap overflow-x-auto">
                        {example.code}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedLessonUsagePlaybook && (
              <div className="mb-6 rounded-2xl border border-primary/25 bg-primary/5 p-4 sm:p-5">
                <h2 className="text-base sm:text-lg font-semibold text-foreground mb-3">{tt("useInRealCode", "How To Use This In Real Code")}</h2>
                <div className="mb-3">
                  <div className="font-semibold text-foreground mb-1">When to use</div>
                  <ul className="space-y-1.5">
                    {selectedLessonUsagePlaybook.whenToUse.map((item) => (
                      <li key={item} className="text-[15px] sm:text-base text-muted-foreground leading-relaxed flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-3">
                  <div className="font-semibold text-foreground mb-1">How to apply</div>
                  <ul className="space-y-1.5">
                    {selectedLessonUsagePlaybook.howToApply.map((step) => (
                      <li key={step} className="text-[15px] sm:text-base text-muted-foreground leading-relaxed flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl border border-border bg-background/80 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-foreground">{tt("starterPattern", "Starter pattern")}</div>
                    <Button asChild size="sm" variant="outline" className="h-7 text-xs gap-1">
                      <Link to={`/compiler?code=${encodeURIComponent(selectedLessonUsagePlaybook.starterPattern)}`}>
                        <Terminal className="w-3 h-3" /> {tt("tryInCompiler", "Try in Compiler")}
                      </Link>
                    </Button>
                  </div>
                  <pre className="rounded-lg border border-border bg-surface-1/60 p-2 text-xs sm:text-sm font-mono text-foreground whitespace-pre-wrap overflow-x-auto">
                    {selectedLessonUsagePlaybook.starterPattern}
                  </pre>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="mb-8">
              {selectedLesson.content.split("\n").map((line, i) => {
                if (line.startsWith("### ")) return <h3 key={i} className="text-xl font-semibold text-foreground mt-6 mb-2">{line.replace("### ", "")}</h3>;
                if (line.startsWith("## ")) return <h2 key={i} className="text-2xl font-bold text-foreground mt-8 mb-3">{line.replace("## ", "")}</h2>;
                if (line.startsWith("- ")) {
                  const guides = getKeywordGuidesForLine(line);
                  return (
                    <div key={i} className="space-y-1.5">
                      <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{line.replace("- ", "")}</span>
                      </p>
                      {guides.map(({ token, guide }) => (
                        <div key={`${i}-${token}`} className="ml-5 rounded-lg border border-border bg-surface-1/60 px-3 py-2">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">{token}</span> - <span className="font-medium text-foreground">How:</span> {guide.howToUse}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Where:</span> {guide.whereToUse}
                          </p>
                          {guide.example && (
                            <div className="mt-2 rounded-md border border-border bg-background/80 p-2">
                              <div className="mb-1 flex items-center justify-between gap-2">
                                <p className="text-[11px] sm:text-xs font-medium text-foreground">{tt("tryThisCode", "Try this code")}</p>
                                <Button asChild size="sm" variant="outline" className="h-6 text-[10px] sm:text-xs px-2 gap-1">
                                  <Link to={`/compiler?code=${encodeURIComponent(guide.example)}`}>
                                    <Terminal className="w-3 h-3" /> {tt("run", "Run")}
                                  </Link>
                                </Button>
                              </div>
                              <pre className="overflow-x-auto whitespace-pre-wrap text-[11px] sm:text-xs text-foreground font-mono">
                                {guide.example}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                }
                if (line.trim() === "") return <br key={i} />;
                const inlineGuides = getKeywordGuidesForLine(line);
                if (inlineGuides.length > 0) {
                  return (
                    <div key={i} className="space-y-1.5">
                      <p className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">{line}</p>
                      {inlineGuides.map(({ token, guide }) => (
                        <div key={`${i}-${token}`} className="ml-1 rounded-lg border border-border bg-surface-1/60 px-3 py-2">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            <span className="font-semibold text-foreground">{token}</span> - <span className="font-medium text-foreground">How:</span> {guide.howToUse}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Where:</span> {guide.whereToUse}
                          </p>
                          {guide.example && (
                            <div className="mt-2 rounded-md border border-border bg-background/80 p-2">
                              <div className="mb-1 flex items-center justify-between gap-2">
                                <p className="text-[11px] sm:text-xs font-medium text-foreground">{tt("tryThisCode", "Try this code")}</p>
                                <Button asChild size="sm" variant="outline" className="h-6 text-[10px] sm:text-xs px-2 gap-1">
                                  <Link to={`/compiler?code=${encodeURIComponent(guide.example)}`}>
                                    <Terminal className="w-3 h-3" /> {tt("run", "Run")}
                                  </Link>
                                </Button>
                              </div>
                              <pre className="overflow-x-auto whitespace-pre-wrap text-[11px] sm:text-xs text-foreground font-mono">
                                {guide.example}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                }
                return <p key={i} className="text-[15px] sm:text-base text-muted-foreground leading-relaxed">{line}</p>;
              })}
            </div>

            {/* Code Example */}
            <div className="code-block mb-8">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface-1">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">example.py</span>
                </div>
                <Button asChild size="sm" variant="outline" className="h-7 text-xs gap-1">
                  <Link to={`/compiler?code=${encodeURIComponent(selectedLesson.codeExample)}`}>
                    <Terminal className="w-3 h-3" /> {tt("tryInCompiler", "Try in Compiler")}
                  </Link>
                </Button>
              </div>
              <Editor
                height={exampleEditorHeight}
                language="python"
                theme="vs-dark"
                value={selectedLesson.codeExample}
                options={{
                  readOnly: true,
                  domReadOnly: true,
                  minimap: { enabled: false },
                  lineNumbers: "on",
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', monospace",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  automaticLayout: true,
                  contextmenu: false,
                  renderLineHighlight: "none",
                  cursorStyle: "line-thin",
                  padding: { top: 14, bottom: 12 },
                }}
              />
            </div>

            {/* Exercises */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                 {t.exercises}
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  — {t.complete3}
                </span>
              </h3>
              <div className="space-y-3">
                {(["beginner", "intermediate", "advanced"] as const).map(level => (
                  <ExerciseEditor
                    key={`${selectedLesson.id}:${level}`}
                    exercise={selectedLesson.exercises[level]}
                    level={level}
                    lessonId={selectedLesson.id}
                    locked={!isExerciseUnlocked(selectedLesson.id, level)}
                  />
                ))}
              </div>
            </div>

            {/* Next chapter button */}
            {(() => {
              const currentIndex = lessons.findIndex(l => l.id === selectedLesson.id);
              const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;
              const canProceed = nextLesson && isLessonUnlocked(currentIndex + 1);
              
              if (!nextLesson) return null;
              
              return (
                <div className={`p-4 rounded-lg border ${canProceed ? "border-primary/30 bg-primary/5" : "border-border bg-surface-1"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {canProceed ? (
                        <CheckCircle2 className="w-5 h-5 text-streak-green" />
                      ) : (
                        <Lock className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {canProceed ? t.nextUnlocked : t.lockedText}
                        </p>
                        <p className="text-xs text-muted-foreground">{getLocalizedLesson(nextLesson, language)?.title ?? nextLesson.title}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!canProceed && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAdUnlock(nextLesson.id)}
                            className="gap-1 text-primary border-primary/30 hover:bg-primary/10"
                          >
                            <Play className="w-3 h-3" /> {t.sponsor}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleWalletUnlock(nextLesson.id)}
                            className="gap-1 text-reward-gold border-reward-gold/30 hover:bg-reward-gold/10"
                          >
                            {tt("pay100", "Pay $100")}
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        disabled={!canProceed}
                        onClick={() => setSelectedId(nextLesson.id)}
                        className="gap-1"
                      >
                        {t.next} <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div id="tour-learn-header" className="flex flex-col items-center md:justify-center h-full text-center px-4 sm:px-6 py-6 overflow-y-auto">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mb-4 hidden md:block" />
            <h2 className="text-xl font-semibold text-foreground mb-2">{t.selectLesson}</h2>
            <p className="text-muted-foreground mb-6 hidden md:block">{t.selectLessonDesc}</p>

            <div className="w-full max-w-5xl mb-6 rounded-2xl border border-primary/25 bg-primary/5 p-5 text-left">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-base font-semibold text-foreground">200 Python Quiz</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tt("quizBlockDesc", "Practice all core Python topics with 100 MCQ questions and instant explanations.")}
                  </p>
                </div>
                <Button asChild>
                  <Link to="/python-quiz-100">{t.startQuiz}</Link>
                </Button>
              </div>
            </div>

            <div id="tour-learn-roadmap" className="w-full max-w-5xl mb-8 grid gap-4 sm:grid-cols-2 text-left">
              {topicCoverage.map((group) => (
                <div key={group.title} className="rounded-2xl border border-border bg-card/60 p-4">
                  <div className="text-sm font-semibold text-foreground mb-3">{group.title}</div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full max-w-5xl mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-left">
              <div className="text-base font-semibold text-foreground mb-3">{t.beginnerMastery}</div>
              <p className="text-sm text-muted-foreground mb-4">
                {tt(
                  "beginnerMasteryDesc",
                  "If someone completes the beginner track carefully, these are the core skills they should understand clearly before moving ahead.",
                )}
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {beginnerMastery.map((item) => (
                  <div key={item} className="rounded-xl border border-border bg-background/80 px-3 py-2 text-sm text-muted-foreground">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile lesson list grouped by category */}
            <div id="tour-learn-mobile-list" className="md:hidden w-full max-w-md space-y-4 text-left">
              {categories.map(cat => (
                <div key={cat}>
                  <h3 className={`text-sm font-bold uppercase tracking-wider mb-2 ${categoryTone[cat].label}`}>
                    {categoryTone[cat].heading}
                  </h3>
                  <div className="space-y-2">
                    {getLessonsByCategory(cat).map(lesson => {
                      const localizedLesson = getLocalizedLesson(lesson, language) ?? lesson;
                      const globalIndex = lessons.indexOf(lesson);
                      const unlocked = isLessonUnlocked(globalIndex);
                      const exercisesDone = getLessonProgress(lesson.id);
                      const allDone = exercisesDone === 3;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleSelectLesson(lesson.id, globalIndex, unlocked)}
                          className={`w-full px-4 py-3 bg-card border border-border rounded-lg transition-colors ${
                            unlocked ? "hover:border-primary/40" : "hover:border-reward-gold/40"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {!unlocked ? (
                                <Lock className="w-4 h-4 text-muted-foreground" />
                              ) : allDone ? (
                                <CheckCircle2 className="w-4 h-4 text-streak-green" />
                              ) : (
                                <BookOpen className="w-4 h-4 text-primary" />
                              )}
                              <div className="text-left">
                                <div className="text-sm font-medium text-foreground">{localizedLesson.title}</div>
                                <div className="text-xs text-muted-foreground">{localizedLesson.category}</div>
                              </div>
                            </div>
                            {!unlocked ? (
                              <span className="text-xs text-primary flex items-center gap-1"><Play className="w-3 h-3" />Sponsor / $100</span>
                            ) : (
                              <span className={`text-xs ${allDone ? "text-streak-green" : "text-muted-foreground"}`}>{exercisesDone}/3</span>
                            )}
                          </div>
                          {unlocked && (
                            <div className="mt-2 h-1.5 bg-surface-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${
                                  allDone ? "bg-streak-green" : exercisesDone > 0 ? "bg-python-yellow" : "bg-muted-foreground/20"
                                }`}
                                style={{ width: `${(exercisesDone / 3) * 100}%` }}
                              />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
