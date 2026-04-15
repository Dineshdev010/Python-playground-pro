export interface Exercise {
  prompt: string;
  starterCode: string;
  expectedOutput: string;
  hint?: string;
  solution?: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  codeExample: string;
  translations?: Partial<
    Record<
      "tamil" | "kannada" | "telugu" | "hindi",
      {
        title?: string;
        description?: string;
        content?: string;
        codeExample?: string;
        category?: string;
      }
    >
  >;
  exercises: {
    beginner: Exercise;
    intermediate: Exercise;
    advanced: Exercise;
  };
}

export const lessons: Lesson[] = [
  // ═══════════════════════════════════════
  // BEGINNER
  // ═══════════════════════════════════════
  {
    id: "fundamentals",
    title: "Python Fundamentals",
    category: "Beginner",
    description: "Learn the basics of Python programming language",
    content: `## What is Python?\n\nPython is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum in 1991.\n\n### Key Features\n- **Easy to learn** — Clean syntax close to natural language\n- **Versatile** — Web dev, data science, AI, automation\n- **Large ecosystem** — Thousands of packages on PyPI\n- **Cross-platform** — Runs on Windows, macOS, Linux\n\n### Your First Python Program\n\nThe classic "Hello, World!" program:`,
    codeExample: `# Your first Python program\nprint("Hello, World!")\n\n# Python is dynamically typed\nname = "PyMaster"\nprint(f"Welcome to {name}!")\n\n# Comments start with #\n# This is a single-line comment\n\nif True:\n    print("Indentation matters in Python!")`,
    translations: {
      tamil: {
        title: "Python அடிப்படைகள்",
        category: "தொடக்கநிலை",
        description: "Python நிரலாக்க மொழியின் அடிப்படைகளை கற்றுக்கொள்ளுங்கள்",
        content: `## Python என்றால் என்ன?\n\nPython என்பது எளிமை மற்றும் வாசிப்புத்திறனால் பிரபலமான ஒரு உயர் நிலை, interpreter அடிப்படையிலான நிரலாக்க மொழி. இதை Guido van Rossum 1991-ல் உருவாக்கினார்.\n\n### முக்கிய அம்சங்கள்\n- **கற்க எளிது** — இயல்பான மொழியைப் போல சுத்தமான syntax\n- **பல்துறை** — Web development, Data science, AI, Automation\n- **பெரிய சூழல்** — PyPI-ல் ஆயிரக்கணக்கான packages\n- **அனைத்து தளங்களிலும் இயங்கும்** — Windows, macOS, Linux\n\n### உங்கள் முதல் Python நிரல்\n\nபழமையான "Hello, World!" நிரல்:`,
      },
      kannada: {
        title: "Python ಮೂಲಭಾಗಗಳು",
        category: "ಆರಂಭಿಕ",
        description: "Python ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆಯ ಮೂಲಭಾಗಗಳನ್ನು ಕಲಿಯಿರಿ",
        content: `## Python ಎಂದರೇನು?\n\nPython ಸರಳತೆ ಮತ್ತು ಓದಲು ಸುಲಭವಾದ ರೂಪಕ್ಕಾಗಿ ಪ್ರಸಿದ್ಧವಾದ high-level, interpreted ಪ್ರೋಗ್ರಾಮಿಂಗ್ ಭಾಷೆ. Guido van Rossum ಅವರು 1991ರಲ್ಲಿ ರಚಿಸಿದರು.\n\n### ಮುಖ್ಯ ವೈಶಿಷ್ಟ್ಯಗಳು\n- **ಕಲಿಯಲು ಸುಲಭ** — ನೈಸರ್ಗಿಕ ಭಾಷೆಯಂತಿರುವ ಸರಳ syntax\n- **ಬಹುಮುಖ** — Web development, Data science, AI, Automation\n- **ದೊಡ್ಡ ಪರಿಸರ ವ್ಯವಸ್ಥೆ** — PyPIಯಲ್ಲಿ ಸಾವಿರಾರು packages\n- **Cross-platform** — Windows, macOS, Linuxನಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ\n\n### ನಿಮ್ಮ ಮೊದಲ Python ಪ್ರೋಗ್ರಾಂ\n\nಪ್ರಸಿದ್ಧ "Hello, World!" ಪ್ರೋಗ್ರಾಂ:`,
      },
      telugu: {
        title: "Python మూలాలు",
        category: "ప్రారంభ స్థాయి",
        description: "Python ప్రోగ్రామింగ్ భాష యొక్క ప్రాథమికాలను నేర్చుకోండి",
        content: `## Python అంటే ఏమిటి?\n\nPython అనేది సరళత మరియు చదవడానికి సులభత కోసం ప్రసిద్ధి చెందిన high-level, interpreted ప్రోగ్రామింగ్ భాష. దీనిని Guido van Rossum 1991లో రూపొందించారు.\n\n### ముఖ్య లక్షణాలు\n- **నేర్చుకోవడం సులభం** — సహజ భాషలా కనిపించే క్లియర్ syntax\n- **బహుముఖ ఉపయోగం** — Web development, Data science, AI, Automation\n- **విపుల ecosystem** — PyPIలో వేలాది packages\n- **Cross-platform** — Windows, macOS, Linuxలో పనిచేస్తుంది\n\n### మీ మొదటి Python ప్రోగ్రామ్\n\nసాధారణ "Hello, World!" ప్రోగ్రామ్:`,
      },
      hindi: {
        title: "Python की मूल बातें",
        category: "शुरुआती",
        description: "Python प्रोग्रामिंग भाषा की बुनियादी बातें सीखें",
        content: `## Python क्या है?\n\nPython एक high-level, interpreted प्रोग्रामिंग भाषा है जो अपनी सादगी और readability के लिए जानी जाती है। इसे Guido van Rossum ने 1991 में बनाया।\n\n### मुख्य विशेषताएं\n- **सीखना आसान** — प्राकृतिक भाषा जैसा साफ syntax\n- **बहुउपयोगी** — Web development, Data science, AI, Automation\n- **बड़ा ecosystem** — PyPI पर हजारों packages\n- **Cross-platform** — Windows, macOS, Linux पर चलता है\n\n### आपका पहला Python प्रोग्राम\n\nक्लासिक "Hello, World!" प्रोग्राम:`,
      },
    },
    exercises: {
      beginner: {
        prompt: "Print 'Hello, World!' and 'Welcome to PyMaster!' on separate lines.",
        starterCode: `# Print the two messages on separate lines\n`,
        expectedOutput: "Hello, World!\nWelcome to PyMaster!",
        hint: "Use two print() statements.",
        solution: `print("Hello, World!")\nprint("Welcome to PyMaster!")`,
      },
      intermediate: {
        prompt: "Print a greeting using an f-string: 'Hello, my name is Alice and I am 25 years old'",
        starterCode: `# Use an f-string to print a greeting\nname = "Alice"\nage = 25\n\n# Print the greeting\n`,
        expectedOutput: "Hello, my name is Alice and I am 25 years old",
      },
      advanced: {
        prompt: "Create a simple calculator: given a=10, b=3, print the sum, difference, product, and quotient each on a new line.",
        starterCode: `a = 10\nb = 3\n\n# Print sum, difference, product, quotient\n`,
        expectedOutput: "13\n7\n30\n3.3333333333333335",
      },
    },
  },
  {
    id: "variables",
    title: "Variables & Data Types",
    category: "Beginner",
    description: "Understanding Python's type system and variable assignment",
    content: `## Variables in Python\n\nA variable is a named container for a value. Think of it like a labeled box: the label is the variable name and the value is what you store inside.\n\nExample:\n- \`name = "Asha"\`\n- \`age = 21\`\n\nPython is dynamically typed, so you do not write the type while creating the variable. Python automatically understands it from the value.\n\n### Data Types You Must Know\n- **int** — Whole numbers, example: \`42\`\n- **float** — Decimal numbers, example: \`3.14\`\n- **str** — Text data, example: \`"hello"\`\n- **bool** — Logical values: \`True\` or \`False\`\n- **NoneType** — No value yet, written as \`None\`\n\n### How To Use Each Type\n- Use **int** for counting items, age, score, rank, and indexes.\n- Use **float** for measurements, percentages, and prices with decimals.\n- Use **str** for names, messages, labels, and any text input.\n- Use **bool** for checks and decisions, like \`is_logged_in\` or \`is_valid\`.\n- Use **None** when a value is optional or not available yet.\n\n### Type Conversion (Important)\nSometimes values come in as text and you need to convert them:\n- \`int("42")\` gives \`42\`\n- \`float("3.5")\` gives \`3.5\`\n- \`str(123)\` gives \`"123"\`\n- \`bool(0)\` gives \`False\`, \`bool(1)\` gives \`True\`\n\n### Common Beginner Mistakes\n- Trying to add text and number directly: \`"Age: " + 21\` (error)\n- Forgetting quotes for strings\n- Assuming \`"42"\` and \`42\` are the same type\n- Comparing with wrong type, like \`"10" > 2\`\n\n### Quick Practice Idea\nCreate one variable of each type, print the value, and print \`type(variable)\` so you can see the real type.`,
    codeExample: `# Variables and data types\nage = 25              # int\npi = 3.14159          # float\nname = "Python"       # str\nis_fun = True         # bool\n\nprint(type(age))      # <class 'int'>\nprint(f"{name} is {age} years old")`,
    translations: {
      tamil: {
        title: "மாறிகள் & தரவு வகைகள்",
        category: "தொடக்கநிலை",
        description: "Python இன் type system மற்றும் variable assignment ஐ புரிந்துகொள்ளுங்கள்",
      },
      kannada: {
        title: "ಚರಗಳು ಮತ್ತು ಡೇಟಾ ಪ್ರಕಾರಗಳು",
        category: "ಆರಂಭಿಕ",
        description: "Python type system ಮತ್ತು variable assignment ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ",
      },
      telugu: {
        title: "వేరియబుల్స్ & డేటా టైప్స్",
        category: "ప్రారంభ స్థాయి",
        description: "Python type system మరియు variable assignment ను అర్థం చేసుకోండి",
      },
      hindi: {
        title: "वेरिएबल्स और डेटा टाइप्स",
        category: "शुरुआती",
        description: "Python के type system और variable assignment को समझें",
      },
    },
    exercises: {
      beginner: {
        prompt: "Create variables: name='Python', version=3, is_awesome=True. Print each on a new line.",
        starterCode: `# Create the variables and print them\n`,
        expectedOutput: "Python\n3\nTrue",
      },
      intermediate: {
        prompt: "Convert Celsius to Fahrenheit. Given celsius=100, print the Fahrenheit value (F = C * 9/5 + 32).",
        starterCode: `celsius = 100\n\n# Convert and print\n`,
        expectedOutput: "212.0",
      },
      advanced: {
        prompt: "Given the string '42', convert it to int, add 8, then print the result and its type name.",
        starterCode: `num_str = "42"\n\n# Convert, add 8, print result and type\n`,
        expectedOutput: "50\nint",
      },
    },
  },
  {
    id: "strings",
    title: "Strings & String Methods",
    category: "Beginner",
    description: "Master string manipulation and formatting",
    content: `## Strings in Python\n\nStrings are sequences of characters. They are immutable.\n\n### Common Methods\n- \`.upper()\`, \`.lower()\`, \`.title()\`\n- \`.strip()\`, \`.split()\`, \`.join()\`\n- \`.find()\`, \`.replace()\`, \`.count()\`\n- \`.startswith()\`, \`.endswith()\`\n\n### Slicing\n\`s[start:stop:step]\``,
    codeExample: `text = "Hello, Python World!"\nprint(text.upper())\nprint(text.lower())\nprint(text[7:13])     # Python\nprint(text[::-1])     # Reverse\nprint(" ".join(["Python", "is", "awesome"]))`,
    translations: {
      tamil: {
        title: "Strings & String Methods",
        category: "தொடக்கநிலை",
        description: "String manipulation மற்றும் formatting திறன்களை கற்றுக்கொள்ளுங்கள்",
      },
      kannada: {
        title: "Strings ಮತ್ತು String Methods",
        category: "ಆರಂಭಿಕ",
        description: "String manipulation ಮತ್ತು formatting ಅನ್ನು ಅಭ್ಯಾಸ ಮಾಡಿ",
      },
      telugu: {
        title: "Strings & String Methods",
        category: "ప్రారంభ స్థాయి",
        description: "String manipulation మరియు formatting నేర్చుకోండి",
      },
      hindi: {
        title: "Strings और String Methods",
        category: "शुरुआती",
        description: "String manipulation और formatting में महारत हासिल करें",
      },
    },
    exercises: {
      beginner: {
        prompt: "Given text='hello world', print it in uppercase.",
        starterCode: `text = "hello world"\n\n# Print in uppercase\n`,
        expectedOutput: "HELLO WORLD",
      },
      intermediate: {
        prompt: "Given sentence='Python is great', reverse the string and print it.",
        starterCode: `sentence = "Python is great"\n\n# Reverse and print\n`,
        expectedOutput: "taerg si nohtyP",
      },
      advanced: {
        prompt: "Given words=['Hello', 'World', 'Python'], join them with ' - ' and print the result.",
        starterCode: `words = ["Hello", "World", "Python"]\n\n# Join with ' - ' and print\n`,
        expectedOutput: "Hello - World - Python",
      },
    },
  },
  {
    id: "input-output",
    title: "Input & Output",
    category: "Beginner",
    description: "Handle user input and formatted output",
    content: `## Input and Output\n\n### print() options\n- \`sep\` — separator between values\n- \`end\` — end character\n\n### Formatting\n- f-strings: \`f"value: {x}"\`\n- Format specs: \`f"{pi:.2f}"\``,
    codeExample: `print("Hello", "World", sep=", ")\npi = 3.14159\nprint(f"Pi: {pi:.2f}")\nprint(f"{'center':^20}")`,
    exercises: {
      beginner: {
        prompt: "Print 'Hello' and 'World' separated by ' | ' (using sep parameter).",
        starterCode: `# Use print with sep parameter\n`,
        expectedOutput: "Hello | World",
      },
      intermediate: {
        prompt: "Given pi=3.14159265, print it rounded to 2 decimal places using f-string formatting.",
        starterCode: `pi = 3.14159265\n\n# Print with 2 decimal places\n`,
        expectedOutput: "3.14",
      },
      advanced: {
        prompt: "Print the number 1000000 with comma separators using f-string formatting.",
        starterCode: `num = 1000000\n\n# Print with commas\n`,
        expectedOutput: "1,000,000",
      },
    },
  },
  {
    id: "control-flow",
    title: "Control Flow (if/elif/else)",
    category: "Beginner",
    description: "Master conditional statements and logical operators",
    content: `## Control Flow\n\nPython uses indentation for code blocks.\n\n### Comparison Operators\n\`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`\n\n### Logical Operators\n\`and\`, \`or\`, \`not\`\n\n### Ternary\n\`value_if_true if condition else value_if_false\``,
    codeExample: `score = 85\nif score >= 90: grade = "A"\nelif score >= 80: grade = "B"\nelif score >= 70: grade = "C"\nelse: grade = "F"\nprint(f"Grade: {grade}")\n\nstatus = "pass" if score >= 60 else "fail"`,
    exercises: {
      beginner: {
        prompt: "Given num=7, print 'Positive', 'Negative', or 'Zero' accordingly.",
        starterCode: `num = 7\n\n# Check and print\n`,
        expectedOutput: "Positive",
      },
      intermediate: {
        prompt: "Given score=85, print the letter grade: A(>=90), B(>=80), C(>=70), D(>=60), F(below 60).",
        starterCode: `score = 85\n\n# Determine and print grade\n`,
        expectedOutput: "B",
      },
      advanced: {
        prompt: "Given year=2024, check if it's a leap year and print 'Leap year' or 'Not a leap year'. (Divisible by 4, but not 100, unless also by 400)",
        starterCode: `year = 2024\n\n# Check leap year\n`,
        expectedOutput: "Leap year",
      },
    },
  },
  {
    id: "loops",
    title: "Loops (for & while)",
    category: "Beginner",
    description: "Iterate with for and while loops",
    content: `## Loops in Python\n\n### for loop\nIterates over a sequence.\n\n### while loop\nRepeats while condition is True.\n\n### Loop Control\n- \`break\` — Exit loop\n- \`continue\` — Skip iteration\n\n### range()\n\`range(stop)\`, \`range(start, stop)\`, \`range(start, stop, step)\``,
    codeExample: `for i in range(5):\n    print(i)\n\nsquares = [x**2 for x in range(10)]\nprint(squares)\n\nfor i, fruit in enumerate(["apple", "banana"]):\n    print(f"{i}: {fruit}")`,
    exercises: {
      beginner: {
        prompt: "Print numbers 1 to 5, each on a new line.",
        starterCode: `# Print 1 to 5\n`,
        expectedOutput: "1\n2\n3\n4\n5",
      },
      intermediate: {
        prompt: "Print the sum of numbers from 1 to 100.",
        starterCode: `# Calculate and print the sum of 1 to 100\n`,
        expectedOutput: "5050",
      },
      advanced: {
        prompt: "Print all even numbers from 2 to 10 (inclusive), each on a new line.",
        starterCode: `# Print even numbers from 2 to 10\n`,
        expectedOutput: "2\n4\n6\n8\n10",
      },
    },
  },
  {
    id: "numbers-math",
    title: "Numbers & Math Operations",
    category: "Beginner",
    description: "Arithmetic, math module, and number manipulation",
    content: `## Numbers in Python\n\n### Arithmetic Operators\n\`+\`, \`-\`, \`*\`, \`/\`, \`//\` (floor), \`%\` (mod), \`**\` (power)\n\n### math Module\n\`sqrt\`, \`ceil\`, \`floor\`, \`factorial\`, \`pi\`, \`gcd\``,
    codeExample: `import math\nprint(10 // 3)    # 3\nprint(10 ** 3)    # 1000\nprint(math.sqrt(16))   # 4.0\nprint(math.factorial(5))  # 120`,
    exercises: {
      beginner: {
        prompt: "Given radius=5, calculate and print the area of a circle (use 3.14159 for pi). Print rounded to 2 decimals.",
        starterCode: `radius = 5\npi = 3.14159\n\n# Calculate and print area\n`,
        expectedOutput: "78.54",
      },
      intermediate: {
        prompt: "Print 2 raised to the power of 10.",
        starterCode: `# Calculate 2^10 and print\n`,
        expectedOutput: "1024",
      },
      advanced: {
        prompt: "Print the factorial of 7.",
        starterCode: `import math\n\n# Print factorial of 7\n`,
        expectedOutput: "5040",
      },
    },
  },

  // ═══════════════════════════════════════
  {
    id: "operators-expressions",
    title: "Operators & Expressions",
    category: "Beginner",
    description: "Understand arithmetic, comparison, assignment, and how expressions produce values",
    content: `## Operators & Expressions\n\nOperators tell Python to do work with values.\n\n### Arithmetic operators\n- \`+\` add\n- \`-\` subtract\n- \`*\` multiply\n- \`/\` divide\n- \`//\` floor divide\n- \`%\` remainder\n- \`**\` power\n\n### Comparison operators\n- \`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`\n\n### Assignment operators\n- \`=\`\n- \`+=\`, \`-=\`, \`*=\`\n\n### Crystal-clear rule\nAn expression is any code that becomes a value. \`2 + 3\` becomes \`5\`. \`age >= 18\` becomes \`True\`.`,
    codeExample: `a = 10\nb = 3\n\nprint(a + b)\nprint(a - b)\nprint(a * b)\nprint(a / b)\nprint(a // b)\nprint(a % b)\nprint(a ** b)\n\nscore = 50\nscore += 10\nprint(score)\nprint(score >= 60)`,
    exercises: {
      beginner: {
        prompt: "Given a=12 and b=5, print the sum and the remainder on separate lines.",
        starterCode: `a = 12\nb = 5\n\n# Print the sum\n# Print the remainder\n`,
        expectedOutput: "17\n2",
      },
      intermediate: {
        prompt: "Given points=40, increase it by 15 using += and print the final value.",
        starterCode: `points = 40\n\n# Increase and print\n`,
        expectedOutput: "55",
      },
      advanced: {
        prompt: "Given x=7 and y=7, print the result of x == y and x >= y on separate lines.",
        starterCode: `x = 7\ny = 7\n\n# Print both comparisons\n`,
        expectedOutput: "True\nTrue",
      },
    },
  },
  {
    id: "indexing-slicing",
    title: "Indexing & Slicing",
    category: "Beginner",
    description: "Access characters and items by position in strings and lists",
    content: `## Indexing & Slicing\n\nPython lets you access items by position.\n\n### Indexing\n- First item is index \`0\`\n- Last item can be accessed with negative indexes like \`-1\`\n\n### Slicing\n- \`items[start:stop]\` gets part of a sequence\n- The stop position is not included\n- \`items[::-1]\` is a simple way to reverse\n\n### Why beginners must master this\nIndexing and slicing appear in strings, lists, loops, validation, and many real interview questions.`,
    codeExample: `word = "Python"\nprint(word[0])\nprint(word[-1])\nprint(word[1:4])\nprint(word[::-1])\n\nnums = [10, 20, 30, 40, 50]\nprint(nums[2])\nprint(nums[:3])`,
    exercises: {
      beginner: {
        prompt: "Given word='PyMaster', print the first character.",
        starterCode: `word = "PyMaster"\n\n# Print the first character\n`,
        expectedOutput: "P",
      },
      intermediate: {
        prompt: "Given text='Programming', print the slice 'gram'.",
        starterCode: `text = "Programming"\n\n# Print gram\n`,
        expectedOutput: "gram",
      },
      advanced: {
        prompt: "Given nums=[1,2,3,4,5], print the list in reverse order using slicing.",
        starterCode: `nums = [1, 2, 3, 4, 5]\n\n# Reverse and print\n`,
        expectedOutput: "[5, 4, 3, 2, 1]",
      },
    },
  },
  {
    id: "lists-basics",
    title: "Lists & List Basics",
    category: "Beginner",
    description: "Store many values in one place and update them easily",
    content: `## Lists\n\nA list is an ordered, changeable collection.\n\n### What beginners should know\n- Lists use square brackets: \`[]\`\n- Items can be read by index\n- Lists can be changed after creation\n- Common tools are \`.append()\`, \`.remove()\`, and \`len()\`\n\n### Real-world use\nUse lists for marks, names, tasks, products, scores, and any group of related values.`,
    codeExample: `fruits = ["apple", "banana", "mango"]\nprint(fruits[0])\n\nfruits.append("orange")\nprint(fruits)\n\nfruits.remove("banana")\nprint(fruits)\nprint(len(fruits))`,
    exercises: {
      beginner: {
        prompt: "Create a list with ['red', 'green', 'blue'] and print it.",
        starterCode: `# Create the list and print it\n`,
        expectedOutput: "['red', 'green', 'blue']",
      },
      intermediate: {
        prompt: "Given nums=[1,2,3], append 4 and print the updated list.",
        starterCode: `nums = [1, 2, 3]\n\n# Append and print\n`,
        expectedOutput: "[1, 2, 3, 4]",
      },
      advanced: {
        prompt: "Given items=['pen', 'book', 'bag'], remove 'book' and print the list length on the first line, then the list.",
        starterCode: `items = ["pen", "book", "bag"]\n\n# Remove and print length and list\n`,
        expectedOutput: "2\n['pen', 'bag']",
      },
    },
  },
  {
    id: "tuples-sets-dicts-basics",
    title: "Tuples, Sets & Dictionary Basics",
    category: "Beginner",
    description: "Learn the core collection types and when to use each one",
    content: `## Tuples, Sets, and Dictionaries\n\nPython has different collection types for different jobs.\n\n### Tuple\n- Ordered\n- Usually used for fixed data\n- Written with parentheses like \`(10, 20)\`\n\n### Set\n- Unordered\n- Keeps only unique values\n- Great for removing duplicates\n\n### Dictionary\n- Stores key-value pairs\n- Written with curly braces like \`{"name": "Asha"}\`\n- Excellent for structured data\n\n### Quick rule\nUse a list for ordered items, a tuple for fixed groups, a set for uniqueness, and a dictionary for named data.`,
    codeExample: `point = (10, 20)\nprint(point[0])\n\ncolors = {"red", "blue", "red"}\nprint(colors)\n\nuser = {"name": "Asha", "city": "Chennai"}\nprint(user["name"])\nuser["level"] = "beginner"\nprint(user)`,
    exercises: {
      beginner: {
        prompt: "Create a tuple (5, 10, 15) and print the second value.",
        starterCode: `# Create tuple and print second value\n`,
        expectedOutput: "10",
      },
      intermediate: {
        prompt: "Given nums=[1,1,2,2,3,3], convert it to a set and print the result.",
        starterCode: `nums = [1, 1, 2, 2, 3, 3]\n\n# Convert to set and print\n`,
        expectedOutput: "{1, 2, 3}",
      },
      advanced: {
        prompt: "Create a dictionary student={'name': 'Ravi', 'marks': 90}. Print the name on the first line and marks on the second line.",
        starterCode: `# Create dictionary and print values\n`,
        expectedOutput: "Ravi\n90",
      },
    },
  },
  {
    id: "functions-basics",
    title: "Functions Basics",
    category: "Beginner",
    description: "Write small reusable blocks of code with parameters and return values",
    content: `## Functions Basics\n\nA function is a named block of code that does one job.\n\n### Why functions matter\nFunctions help you avoid repeating code and make programs easier to read.\n\n### Core parts\n- \`def\` starts a function\n- Parameters receive input values\n- \`return\` sends a value back\n\n### Beginner goal\nAfter this lesson, a learner should be able to write a small function, call it, and understand what input goes in and what value comes out.`,
    codeExample: `def greet(name):\n    return f"Hello, {name}"\n\nprint(greet("PyMaster"))\n\n\ndef add(a, b):\n    return a + b\n\nprint(add(4, 6))`,
    exercises: {
      beginner: {
        prompt: "Write a function say_hi() that prints 'Hi'. Call it once.",
        starterCode: `# Define say_hi and call it\n`,
        expectedOutput: "Hi",
      },
      intermediate: {
        prompt: "Write a function add(a, b) that returns the sum. Print add(7, 8).",
        starterCode: `# Define add and print add(7, 8)\n`,
        expectedOutput: "15",
      },
      advanced: {
        prompt: "Write a function is_even(n) that returns True for even numbers. Print is_even(12) and is_even(7) on separate lines.",
        starterCode: `# Define is_even and test it\n`,
        expectedOutput: "True\nFalse",
      },
    },
  },

  // INTERMEDIATE
  // ═══════════════════════════════════════
  {
    id: "functions",
    title: "Functions",
    category: "Intermediate",
    description: "Define reusable code blocks with functions",
    content: `## Functions\n\nUse \`def\` to define functions.\n\n### Key Concepts\n- Parameters and return values\n- Default arguments\n- \\*args, \\*\\*kwargs\n- Lambda functions\n- Type hints`,
    codeExample: `def greet(name, greeting="Hello"):\n    return f"{greeting}, {name}!"\n\nprint(greet("Alice"))\n\nsquare = lambda x: x ** 2\nprint(square(5))`,
    exercises: {
      beginner: {
        prompt: "Write a function area(w, h) that returns w * h. Print area(5, 3).",
        starterCode: `# Define the area function\n\n# Print area(5, 3)\n`,
        expectedOutput: "15",
      },
      intermediate: {
        prompt: "Write a function factorial(n) using recursion. Print factorial(6).",
        starterCode: `# Define recursive factorial\n\n# Print factorial(6)\n`,
        expectedOutput: "720",
      },
      advanced: {
        prompt: "Write a function that takes *args of numbers and returns their sum. Print the result for (1,2,3,4,5).",
        starterCode: `# Define sum function with *args\n\n# Print sum_all(1,2,3,4,5)\n`,
        expectedOutput: "15",
      },
    },
  },
  {
    id: "lists",
    title: "Lists",
    category: "Intermediate",
    description: "Master Python's most versatile data structure",
    content: `## Lists\n\nOrdered, mutable collections.\n\n### Methods\n\`.append()\`, \`.extend()\`, \`.insert()\`, \`.remove()\`, \`.pop()\`, \`.sort()\`, \`.reverse()\`\n\n### Slicing\n\`list[start:stop:step]\`\n\n### Comprehensions\n\`[expr for x in iterable if cond]\``,
    codeExample: `nums = [3, 1, 4, 1, 5, 9]\nnums.sort()\nprint(nums)\nsquares = [x**2 for x in range(10)]\nprint(squares)`,
    exercises: {
      beginner: {
        prompt: "Create a list [5, 3, 8, 1, 9]. Sort it and print the sorted list.",
        starterCode: `nums = [5, 3, 8, 1, 9]\n\n# Sort and print\n`,
        expectedOutput: "[1, 3, 5, 8, 9]",
      },
      intermediate: {
        prompt: "Use a list comprehension to create squares of 1-5: [1, 4, 9, 16, 25]. Print the list.",
        starterCode: `# List comprehension for squares\n`,
        expectedOutput: "[1, 4, 9, 16, 25]",
      },
      advanced: {
        prompt: "Given nums=[1,2,3,4,5,6,7,8,9,10], filter even numbers using list comprehension. Print the result.",
        starterCode: `nums = [1,2,3,4,5,6,7,8,9,10]\n\n# Filter evens and print\n`,
        expectedOutput: "[2, 4, 6, 8, 10]",
      },
    },
  },
  {
    id: "tuples-sets",
    title: "Tuples & Sets",
    category: "Intermediate",
    description: "Immutable sequences and unique collections",
    content: `## Tuples\nOrdered, immutable. Created with \`()\`.\n\n## Sets\nUnordered, unique elements. Created with \`{}\`.\n\n### Set Operations\n\`|\` union, \`&\` intersection, \`-\` difference, \`^\` symmetric difference`,
    codeExample: `point = (3, 4)\nx, y = point\n\na = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\nprint(a & b)  # {3, 4}`,
    exercises: {
      beginner: {
        prompt: "Create a tuple (10, 20, 30). Unpack into a, b, c and print their sum.",
        starterCode: `# Create tuple, unpack, print sum\n`,
        expectedOutput: "60",
      },
      intermediate: {
        prompt: "Given two sets a={1,2,3,4} and b={3,4,5,6}, print their intersection.",
        starterCode: `a = {1, 2, 3, 4}\nb = {3, 4, 5, 6}\n\n# Print intersection\n`,
        expectedOutput: "{3, 4}",
      },
      advanced: {
        prompt: "Remove duplicates from [1,2,2,3,3,3,4,4,5] using a set. Print the sorted result as a list.",
        starterCode: `nums = [1,2,2,3,3,3,4,4,5]\n\n# Remove duplicates, sort, print\n`,
        expectedOutput: "[1, 2, 3, 4, 5]",
      },
    },
  },
  {
    id: "dictionaries",
    title: "Dictionaries",
    category: "Intermediate",
    description: "Key-value pairs for fast data lookup",
    content: `## Dictionaries\n\nKey-value pairs with O(1) lookup.\n\n### Methods\n\`.get()\`, \`.keys()\`, \`.values()\`, \`.items()\`, \`.update()\`, \`.pop()\`\n\n### Comprehensions\n\`{k: v for k, v in items}\``,
    codeExample: `student = {"name": "Alice", "age": 22}\nfor key, val in student.items():\n    print(f"{key}: {val}")\n\nsquared = {x: x**2 for x in range(5)}\nprint(squared)`,
    exercises: {
      beginner: {
        prompt: "Create a dict person={'name': 'Alice', 'age': 25}. Print the name value.",
        starterCode: `# Create dict and print name\n`,
        expectedOutput: "Alice",
      },
      intermediate: {
        prompt: "Create a dict comprehension mapping numbers 1-5 to their squares. Print it.",
        starterCode: `# Dict comprehension\n`,
        expectedOutput: "{1: 1, 2: 4, 3: 9, 4: 16, 5: 25}",
      },
      advanced: {
        prompt: "Count word frequency in 'hello world hello python world hello'. Print the resulting dict sorted by key.",
        starterCode: `text = "hello world hello python world hello"\n\n# Count words and print\n`,
        expectedOutput: "{'hello': 3, 'python': 1, 'world': 2}",
      },
    },
  },
  {
    id: "file-handling",
    title: "File Handling",
    category: "Intermediate",
    description: "Read from and write to files",
    content: `## File Handling\n\n### Modes\n\`"r"\` read, \`"w"\` write, \`"a"\` append\n\n### Context Manager\n\`with open(...) as f:\`\n\n### JSON\n\`json.dump()\`, \`json.load()\``,
    codeExample: `with open("test.txt", "w") as f:\n    f.write("Hello!\\n")\n\nwith open("test.txt", "r") as f:\n    print(f.read())`,
    exercises: {
      beginner: {
        prompt: "Print the string 'File handling in Python' (simulating file output).",
        starterCode: `# Print the string\n`,
        expectedOutput: "File handling in Python",
      },
      intermediate: {
        prompt: "Create a list data=['line1', 'line2', 'line3']. Print each item on a new line (simulating writing to file).",
        starterCode: `data = ["line1", "line2", "line3"]\n\n# Print each line\n`,
        expectedOutput: "line1\nline2\nline3",
      },
      advanced: {
        prompt: "Convert the dict {'name': 'Alice', 'age': 25} to a JSON string and print it.",
        starterCode: `import json\n\ndata = {"name": "Alice", "age": 25}\n\n# Convert to JSON string and print\n`,
        expectedOutput: '{"name": "Alice", "age": 25}',
      },
    },
  },
  {
    id: "error-handling",
    title: "Error Handling (try/except)",
    category: "Intermediate",
    description: "Handle exceptions gracefully",
    content: `## Error Handling\n\n### try/except/else/finally\nHandle errors without crashing.\n\n### Common Exceptions\nValueError, TypeError, IndexError, KeyError, ZeroDivisionError\n\n### raise\nManually raise exceptions.`,
    codeExample: `try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print("Cannot divide by zero!")\n\ntry:\n    num = int("abc")\nexcept ValueError as e:\n    print(f"Error: {e}")`,
    exercises: {
      beginner: {
        prompt: "Use try/except to catch dividing 10 by 0. Print 'Error: division by zero'.",
        starterCode: `# Try dividing 10 by 0, catch the error\n`,
        expectedOutput: "Error: division by zero",
      },
      intermediate: {
        prompt: "Try converting 'abc' to int. Catch ValueError and print 'Invalid number'.",
        starterCode: `# Try converting 'abc' to int\n`,
        expectedOutput: "Invalid number",
      },
      advanced: {
        prompt: "Write a safe_divide(a, b) function. If b is 0, return 'Cannot divide by zero'. Print safe_divide(10, 0).",
        starterCode: `# Define safe_divide and test it\n`,
        expectedOutput: "Cannot divide by zero",
      },
    },
  },
  {
    id: "list-comprehensions",
    title: "Comprehensions",
    category: "Intermediate",
    description: "List, dict, set, and generator comprehensions",
    content: `## Comprehensions\n\n- **List**: \`[expr for x in iterable if cond]\`\n- **Dict**: \`{k: v for x in iterable}\`\n- **Set**: \`{expr for x in iterable}\`\n- **Generator**: \`(expr for x in iterable)\``,
    codeExample: `squares = [x**2 for x in range(10)]\nevens = [x for x in range(20) if x % 2 == 0]\nflat = [n for row in [[1,2],[3,4]] for n in row]\nprint(flat)`,
    exercises: {
      beginner: {
        prompt: "Create a list of cubes from 1 to 5: [1, 8, 27, 64, 125]. Print it.",
        starterCode: `# List comprehension for cubes\n`,
        expectedOutput: "[1, 8, 27, 64, 125]",
      },
      intermediate: {
        prompt: "Flatten [[1,2,3],[4,5,6],[7,8,9]] into a single list. Print it.",
        starterCode: `matrix = [[1,2,3],[4,5,6],[7,8,9]]\n\n# Flatten and print\n`,
        expectedOutput: "[1, 2, 3, 4, 5, 6, 7, 8, 9]",
      },
      advanced: {
        prompt: "Create a list of 'even'/'odd' labels for numbers 0-4. Print it.",
        starterCode: `# Create labels list\n`,
        expectedOutput: "['even', 'odd', 'even', 'odd', 'even']",
      },
    },
  },
  {
    id: "modules-imports",
    title: "Modules & Imports",
    category: "Intermediate",
    description: "Organize code with modules and packages",
    content: `## Modules\n\n### Import Styles\n- \`import module\`\n- \`from module import func\`\n- \`import module as alias\`\n\n### Standard Library Highlights\nos, sys, datetime, collections, itertools, json, re`,
    codeExample: `from collections import Counter\nwords = "hello world hello".split()\nprint(Counter(words))\n\nimport datetime\nprint(datetime.date.today())`,
    exercises: {
      beginner: {
        prompt: "Import math and print math.pi rounded to 4 decimal places.",
        starterCode: `# Import math and print pi\n`,
        expectedOutput: "3.1416",
      },
      intermediate: {
        prompt: "Use Counter from collections to count letters in 'banana'. Print the Counter object.",
        starterCode: `from collections import Counter\n\n# Count letters in 'banana'\n`,
        expectedOutput: "Counter({'a': 3, 'n': 2, 'b': 1})",
      },
      advanced: {
        prompt: "Use itertools.combinations to print all 2-element combinations of [1,2,3] as a list of tuples.",
        starterCode: `from itertools import combinations\n\n# Print combinations\n`,
        expectedOutput: "[(1, 2), (1, 3), (2, 3)]",
      },
    },
  },

  // ═══════════════════════════════════════
  // ADVANCED
  // ═══════════════════════════════════════
  {
    id: "oop",
    title: "Object-Oriented Programming",
    category: "Advanced",
    description: "Master classes, inheritance, and OOP principles",
    content: `## OOP in Python\n\n### Four Pillars\n1. Encapsulation\n2. Abstraction\n3. Inheritance\n4. Polymorphism\n\n### Special Methods\n\`__init__\`, \`__str__\`, \`__repr__\`, \`__eq__\`, \`__len__\``,
    codeExample: `class Dog:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        return f"{self.name} says Woof!"\n\ndog = Dog("Rex")\nprint(dog.speak())`,
    exercises: {
      beginner: {
        prompt: "Create a class Circle with __init__(self, radius). Add an area() method (use 3.14159). Print Circle(5).area() rounded to 2 decimals.",
        starterCode: `# Define Circle class\n\n# Print area of Circle(5)\n`,
        expectedOutput: "78.54",
      },
      intermediate: {
        prompt: "Create a class Rectangle(w, h) with area() and perimeter() methods. Print area and perimeter of Rectangle(4, 6) on separate lines.",
        starterCode: `# Define Rectangle class\n\n# Print area and perimeter\n`,
        expectedOutput: "24\n20",
      },
      advanced: {
        prompt: "Create Animal and Dog(Animal) classes. Dog.__init__ takes name, Animal.__init__ takes name and sound. Dog always says 'Woof'. Print Dog('Rex').speak() which returns 'Rex says Woof!'.",
        starterCode: `# Define Animal and Dog classes\n\n# Print Dog('Rex').speak()\n`,
        expectedOutput: "Rex says Woof!",
      },
    },
  },
  {
    id: "oop-advanced",
    title: "Advanced OOP",
    category: "Advanced",
    description: "Abstract classes, dataclasses, class methods",
    content: `## Advanced OOP\n\n### Abstract Base Classes\nDefine interfaces subclasses must implement.\n\n### Dataclasses\nReduce boilerplate for data-holding classes.\n\n### @classmethod / @staticmethod`,
    codeExample: `from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: float\n    y: float\n\np = Point(3, 4)\nprint(p)`,
    exercises: {
      beginner: {
        prompt: "Create a dataclass Student with name(str) and grade(int). Print Student('Alice', 90).",
        starterCode: `from dataclasses import dataclass\n\n# Define Student dataclass\n\n# Print Student('Alice', 90)\n`,
        expectedOutput: "Student(name='Alice', grade=90)",
      },
      intermediate: {
        prompt: "Create a class with a @classmethod 'from_string' that parses 'Alice-25' into Person(name, age). Print the name and age.",
        starterCode: `# Define Person with from_string classmethod\n\n# Test it\n`,
        expectedOutput: "Alice\n25",
      },
      advanced: {
        prompt: "Create a @staticmethod is_adult(age) that returns True if age >= 18. Print is_adult(20) and is_adult(15).",
        starterCode: `# Define class with static method\n\n# Test it\n`,
        expectedOutput: "True\nFalse",
      },
    },
  },
  {
    id: "decorators",
    title: "Decorators",
    category: "Advanced",
    description: "Functions that modify other functions",
    content: `## Decorators\n\nWrap functions to extend behavior.\n\n### Common Decorators\n\`@property\`, \`@staticmethod\`, \`@classmethod\`, \`@functools.wraps\`, \`@functools.lru_cache\``,
    codeExample: `import functools\n\ndef uppercase(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        return func(*args, **kwargs).upper()\n    return wrapper\n\n@uppercase\ndef greet(name):\n    return f"hello, {name}"\n\nprint(greet("alice"))`,
    exercises: {
      beginner: {
        prompt: "Create a decorator 'shout' that converts a function's return value to uppercase. Apply to greet('world') -> 'HELLO, WORLD'. Print result.",
        starterCode: `# Define shout decorator and greet function\n\n# Print greet('world')\n`,
        expectedOutput: "HELLO, WORLD",
      },
      intermediate: {
        prompt: "Create a decorator 'repeat(n)' that calls a function n times. Use @repeat(3) on a function that prints 'Hi'. ",
        starterCode: `# Define repeat decorator\n\n# Apply and call\n`,
        expectedOutput: "Hi\nHi\nHi",
      },
      advanced: {
        prompt: "Use @functools.lru_cache to create a memoized fibonacci(n). Print fibonacci(10).",
        starterCode: `import functools\n\n# Define memoized fibonacci\n\n# Print fibonacci(10)\n`,
        expectedOutput: "55",
      },
    },
  },
  {
    id: "generators",
    title: "Generators & Iterators",
    category: "Advanced",
    description: "Lazy evaluation with yield",
    content: `## Generators\n\nUse \`yield\` to produce values lazily.\n\n### Benefits\n- Memory efficient\n- Lazy evaluation\n- Can represent infinite sequences`,
    codeExample: `def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nprint(list(fibonacci(10)))`,
    exercises: {
      beginner: {
        prompt: "Create a generator that yields numbers 1 to 5. Print them as a list.",
        starterCode: `# Define generator\n\n# Print as list\n`,
        expectedOutput: "[1, 2, 3, 4, 5]",
      },
      intermediate: {
        prompt: "Create a generator squares(n) that yields x^2 for x in 1..n. Print list(squares(5)).",
        starterCode: `# Define squares generator\n\n# Print list\n`,
        expectedOutput: "[1, 4, 9, 16, 25]",
      },
      advanced: {
        prompt: "Create a generator that yields Fibonacci numbers. Print the first 8 as a list.",
        starterCode: `# Define fibonacci generator\n\n# Print first 8\n`,
        expectedOutput: "[0, 1, 1, 2, 3, 5, 8, 13]",
      },
    },
  },
  {
    id: "lambda-map-filter",
    title: "Lambda, Map, Filter & Reduce",
    category: "Advanced",
    description: "Functional programming tools",
    content: `## Functional Programming\n\n### Lambda\n\`lambda args: expression\`\n\n### map() / filter() / reduce()\nTransform, filter, and accumulate data.`,
    codeExample: `from functools import reduce\nnums = [1, 2, 3, 4, 5]\nprint(list(map(lambda x: x**2, nums)))\nprint(list(filter(lambda x: x%2==0, nums)))\nprint(reduce(lambda a, b: a+b, nums))`,
    exercises: {
      beginner: {
        prompt: "Use map to double each number in [1,2,3,4,5]. Print as a list.",
        starterCode: `nums = [1, 2, 3, 4, 5]\n\n# Use map to double\n`,
        expectedOutput: "[2, 4, 6, 8, 10]",
      },
      intermediate: {
        prompt: "Use filter to get odd numbers from [1,2,3,4,5,6,7,8,9,10]. Print as a list.",
        starterCode: `nums = [1,2,3,4,5,6,7,8,9,10]\n\n# Filter odds\n`,
        expectedOutput: "[1, 3, 5, 7, 9]",
      },
      advanced: {
        prompt: "Use reduce to find the product of [1,2,3,4,5]. Print the result.",
        starterCode: `from functools import reduce\n\nnums = [1, 2, 3, 4, 5]\n\n# Reduce to product\n`,
        expectedOutput: "120",
      },
    },
  },
  {
    id: "regex",
    title: "Regular Expressions",
    category: "Advanced",
    description: "Pattern matching with the re module",
    content: `## Regular Expressions\n\n### Functions\n\`re.search()\`, \`re.match()\`, \`re.findall()\`, \`re.sub()\`, \`re.split()\`\n\n### Patterns\n\`.\` any, \`\\d\` digit, \`\\w\` word, \`\\s\` space, \`*\` 0+, \`+\` 1+`,
    codeExample: `import re\ntext = "Email: test@example.com"\nemails = re.findall(r'[\\w.]+@[\\w.]+', text)\nprint(emails)`,
    exercises: {
      beginner: {
        prompt: "Use re.findall to find all digits in 'abc123def456'. Print the list.",
        starterCode: `import re\n\ntext = "abc123def456"\n\n# Find all digits\n`,
        expectedOutput: "['1', '2', '3', '4', '5', '6']",
      },
      intermediate: {
        prompt: "Use re.findall to find all words in 'Hello, World! Python 3.12'. Print the list.",
        starterCode: `import re\n\ntext = "Hello, World! Python 3.12"\n\n# Find all words (\\w+)\n`,
        expectedOutput: "['Hello', 'World', 'Python', '3', '12']",
      },
      advanced: {
        prompt: "Use re.sub to replace all digits in 'abc123def456' with '#'. Print result.",
        starterCode: `import re\n\ntext = "abc123def456"\n\n# Replace digits with #\n`,
        expectedOutput: "abc###def###",
      },
    },
  },
  {
    id: "context-managers",
    title: "Context Managers",
    category: "Advanced",
    description: "Manage resources with 'with' statement",
    content: `## Context Managers\n\n### with Statement\nAuto-cleanup of resources.\n\n### Creating\n1. Class: \`__enter__\` / \`__exit__\`\n2. Generator: \`@contextmanager\``,
    codeExample: `from contextlib import contextmanager\n\n@contextmanager\ndef tag(name):\n    print(f"<{name}>")\n    yield\n    print(f"</{name}>")\n\nwith tag("div"):\n    print("Content")`,
    exercises: {
      beginner: {
        prompt: "Print 'Start', 'Middle', 'End' on separate lines (simulating enter/body/exit).",
        starterCode: `# Print the three phases\n`,
        expectedOutput: "Start\nMiddle\nEnd",
      },
      intermediate: {
        prompt: "Create a context manager using @contextmanager that prints 'Opening' on enter and 'Closing' on exit. Print 'Working' inside. ",
        starterCode: `from contextlib import contextmanager\n\n# Define and use context manager\n`,
        expectedOutput: "Opening\nWorking\nClosing",
      },
      advanced: {
        prompt: "Create a Timer class context manager. Print 'Timer started' on enter and 'Timer stopped' on exit. Print 'Running' inside.",
        starterCode: `# Define Timer class context manager\n\n# Use it\n`,
        expectedOutput: "Timer started\nRunning\nTimer stopped",
      },
    },
  },
  {
    id: "advanced-python",
    title: "Advanced Concepts",
    category: "Advanced",
    description: "Closures, type hints, walrus operator",
    content: `## Advanced Python\n\n### Closures\nFunctions remembering enclosing scope.\n\n### Type Hints\n\`def func(x: int) -> str:\`\n\n### Walrus Operator (:=)\nAssign within expressions.`,
    codeExample: `def make_multiplier(factor):\n    def multiply(x):\n        return x * factor\n    return multiply\n\ndouble = make_multiplier(2)\nprint(double(5))  # 10`,
    exercises: {
      beginner: {
        prompt: "Create a closure make_adder(n) that returns a function adding n. Print make_adder(10)(5).",
        starterCode: `# Define make_adder closure\n\n# Test it\n`,
        expectedOutput: "15",
      },
      intermediate: {
        prompt: "Create make_multiplier(n). Use it to create double and triple. Print double(7) and triple(7) on separate lines.",
        starterCode: `# Define make_multiplier\n\n# Test double and triple\n`,
        expectedOutput: "14\n21",
      },
      advanced: {
        prompt: "Create a counter closure that increments on each call. Call it 3 times and print each result.",
        starterCode: `# Define counter closure\n\n# Call 3 times and print\n`,
        expectedOutput: "1\n2\n3",
      },
    },
  },

  // ═══════════════════════════════════════
  // EXPERT
  // ═══════════════════════════════════════
  {
    id: "concurrency",
    title: "Concurrency & Async",
    category: "Expert",
    description: "Threading, multiprocessing, and async/await",
    content: `## Concurrency\n\n### Threading — I/O-bound tasks\n### Multiprocessing — CPU-bound tasks\n### async/await — Single-threaded concurrency`,
    codeExample: `import asyncio\n\nasync def fetch(name, delay):\n    await asyncio.sleep(delay)\n    return f"{name} done"\n\nasync def main():\n    results = await asyncio.gather(\n        fetch("A", 1), fetch("B", 2)\n    )\n    print(results)`,
    exercises: {
      beginner: {
        prompt: "Print 'Task 1', 'Task 2', 'Task 3' on separate lines (simulating sequential tasks).",
        starterCode: `# Simulate 3 tasks\n`,
        expectedOutput: "Task 1\nTask 2\nTask 3",
      },
      intermediate: {
        prompt: "Create a list of 5 task names ['Task-1'...'Task-5']. Print each.",
        starterCode: `# Create and print tasks\n`,
        expectedOutput: "Task-1\nTask-2\nTask-3\nTask-4\nTask-5",
      },
      advanced: {
        prompt: "Simulate a producer-consumer: producer creates items 1-3, consumer prints 'Consumed: 1' etc.",
        starterCode: `# Simulate producer-consumer\n`,
        expectedOutput: "Consumed: 1\nConsumed: 2\nConsumed: 3",
      },
    },
  },
  {
    id: "testing",
    title: "Testing & Debugging",
    category: "Expert",
    description: "Unit testing and debugging techniques",
    content: `## Testing\n\n### unittest — Built-in framework\n### pytest — Pythonic testing\n### assert — Simple checks\n### logging — Production debugging`,
    codeExample: `def add(a, b): return a + b\n\n# Simple assertions\nassert add(2, 3) == 5\nassert add(-1, 1) == 0\nprint("All tests passed!")`,
    exercises: {
      beginner: {
        prompt: "Write an add(a,b) function. Use assert to test add(2,3)==5 and add(-1,1)==0. Print 'All tests passed!'.",
        starterCode: `# Define add and test with assert\n`,
        expectedOutput: "All tests passed!",
      },
      intermediate: {
        prompt: "Write is_even(n) and test it: assert is_even(4)==True, is_even(7)==False. Print 'Tests OK'.",
        starterCode: `# Define is_even and test\n`,
        expectedOutput: "Tests OK",
      },
      advanced: {
        prompt: "Write a divide(a,b) function that raises ValueError for b==0. Test it: divide(10,2)==5, and verify the exception. Print 'All passed'.",
        starterCode: `# Define divide with error handling and test\n`,
        expectedOutput: "All passed",
      },
    },
  },
  {
    id: "data-structures-algo",
    title: "Data Structures & Algorithms",
    category: "Expert",
    description: "Implement common data structures",
    content: `## Data Structures\n\n- Stack (LIFO)\n- Queue (FIFO)\n- Linked List\n- Binary Tree\n- Heap (heapq)`,
    codeExample: `class Stack:\n    def __init__(self): self._items = []\n    def push(self, item): self._items.append(item)\n    def pop(self): return self._items.pop()\n    def peek(self): return self._items[-1]\n\ns = Stack()\ns.push(1); s.push(2)\nprint(s.pop())  # 2`,
    exercises: {
      beginner: {
        prompt: "Create a Stack class with push/pop. Push 1,2,3 then pop twice. Print each popped value.",
        starterCode: `# Define Stack and test\n`,
        expectedOutput: "3\n2",
      },
      intermediate: {
        prompt: "Use heapq to find the 3 smallest numbers from [7,3,9,1,5,8,2]. Print them as a list.",
        starterCode: `import heapq\n\nnums = [7, 3, 9, 1, 5, 8, 2]\n\n# Find 3 smallest\n`,
        expectedOutput: "[1, 2, 3]",
      },
      advanced: {
        prompt: "Implement binary search. Search for 7 in [1,3,5,7,9,11]. Print the index.",
        starterCode: `# Implement binary search\n\n# Search for 7 in [1,3,5,7,9,11]\n`,
        expectedOutput: "3",
      },
    },
  },
  {
    id: "web-scraping",
    title: "Web Scraping & APIs",
    category: "Expert",
    description: "HTTP requests and web scraping",
    content: `## Web & APIs\n\n### requests library\nGET, POST, PUT, DELETE\n\n### BeautifulSoup\nParse HTML\n\n### JSON APIs\nInteract with RESTful services`,
    codeExample: `# Simulated API response\ndata = {"name": "Python", "version": "3.12"}\nprint(f"Language: {data['name']}")\nprint(f"Version: {data['version']}")`,
    exercises: {
      beginner: {
        prompt: "Parse a dict response={'status': 200, 'data': 'Hello'}. Print the 'data' value.",
        starterCode: `response = {"status": 200, "data": "Hello"}\n\n# Print the data value\n`,
        expectedOutput: "Hello",
      },
      intermediate: {
        prompt: "Given a list of dicts users=[{'name':'Alice'},{'name':'Bob'}], print each name.",
        starterCode: `users = [{"name": "Alice"}, {"name": "Bob"}]\n\n# Print each name\n`,
        expectedOutput: "Alice\nBob",
      },
      advanced: {
        prompt: "Convert a list of dicts to JSON string with indent=2. data=[{'id':1},{'id':2}]. Print it.",
        starterCode: `import json\n\ndata = [{"id": 1}, {"id": 2}]\n\n# Convert and print\n`,
        expectedOutput: '[\n  {\n    "id": 1\n  },\n  {\n    "id": 2\n  }\n]',
      },
    },
  },
  {
    id: "design-patterns",
    title: "Design Patterns",
    category: "Expert",
    description: "Common software design patterns",
    content: `## Design Patterns\n\n### Creational\nSingleton, Factory, Builder\n\n### Structural\nAdapter, Decorator, Facade\n\n### Behavioral\nObserver, Strategy, Iterator`,
    codeExample: `class Singleton:\n    _instance = None\n    def __new__(cls):\n        if cls._instance is None:\n            cls._instance = super().__new__(cls)\n        return cls._instance\n\na = Singleton()\nb = Singleton()\nprint(a is b)  # True`,
    exercises: {
      beginner: {
        prompt: "Create a Singleton class. Verify two instances are the same object. Print True/False.",
        starterCode: `# Define Singleton\n\n# Test\n`,
        expectedOutput: "True",
      },
      intermediate: {
        prompt: "Create a factory function make_shape(type) that returns 'Circle' or 'Square' string. Print make_shape('circle') and make_shape('square').",
        starterCode: `# Define factory\n\n# Test\n`,
        expectedOutput: "Circle\nSquare",
      },
      advanced: {
        prompt: "Create an Observer pattern: EventEmitter with on() and emit(). Register a handler for 'greet' that prints 'Hello, Alice'. Emit 'greet'.",
        starterCode: `# Define EventEmitter\n\n# Test\n`,
        expectedOutput: "Hello, Alice",
      },
    },
  },

  // ═══════════════════════════════════════
  // ADDITIONAL LESSONS — Expanded PyMaster Curriculum
  // ═══════════════════════════════════════
  {
    id: "recursion",
    title: "Recursion",
    category: "Intermediate",
    description: "Solve problems using recursive functions",
    content: `## Recursion\n\nA function that calls itself to break a problem into smaller sub-problems.\n\n### Key Concepts\n- **Base case** — stops the recursion\n- **Recursive case** — calls itself with a smaller input\n- **Stack depth** — Python limits recursion depth (~1000)\n\n### Common Examples\nFactorial, Fibonacci, tree traversal, backtracking.`,
    codeExample: `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(5))  # 120\n\ndef fibonacci(n):\n    if n <= 1: return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\nprint(fibonacci(7))  # 13`,
    exercises: {
      beginner: {
        prompt: "Write a recursive function to calculate factorial of 6. Print the result.",
        starterCode: `# Define recursive factorial\n\n# Print factorial(6)\n`,
        expectedOutput: "720",
      },
      intermediate: {
        prompt: "Write a recursive function to sum numbers from 1 to n. Print sum_recursive(10).",
        starterCode: `# Define sum_recursive(n)\n\n# Test\n`,
        expectedOutput: "55",
      },
      advanced: {
        prompt: "Write a recursive function to reverse a string. Print reverse_str('PyMaster').",
        starterCode: `# Define reverse_str(s)\n\n# Test\n`,
        expectedOutput: "retsaMyP",
      },
    },
  },
  {
    id: "sorting-algorithms",
    title: "Sorting Algorithms",
    category: "Advanced",
    description: "Implement classic sorting algorithms in Python",
    content: `## Sorting Algorithms\n\n### Bubble Sort — O(n²)\nRepeatedly swap adjacent elements.\n\n### Selection Sort — O(n²)\nFind minimum, place at front.\n\n### Merge Sort — O(n log n)\nDivide and conquer.\n\n### Quick Sort — O(n log n) average\nPick pivot, partition.`,
    codeExample: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\nprint(bubble_sort([64, 34, 25, 12, 22, 11, 90]))`,
    exercises: {
      beginner: {
        prompt: "Sort [5, 2, 8, 1, 9] using Python's sorted() function. Print the result.",
        starterCode: `nums = [5, 2, 8, 1, 9]\n\n# Sort and print\n`,
        expectedOutput: "[1, 2, 5, 8, 9]",
      },
      intermediate: {
        prompt: "Implement bubble sort for [3, 1, 4, 1, 5]. Print the sorted list.",
        starterCode: `def bubble_sort(arr):\n    # Implement\n    pass\n\nprint(bubble_sort([3, 1, 4, 1, 5]))`,
        expectedOutput: "[1, 1, 3, 4, 5]",
      },
      advanced: {
        prompt: "Implement merge sort for [38, 27, 43, 3, 9, 82, 10]. Print the sorted list.",
        starterCode: `def merge_sort(arr):\n    # Implement\n    pass\n\nprint(merge_sort([38, 27, 43, 3, 9, 82, 10]))`,
        expectedOutput: "[3, 9, 10, 27, 38, 43, 82]",
      },
    },
  },
  {
    id: "regex",
    title: "Regular Expressions",
    category: "Advanced",
    description: "Pattern matching with the re module",
    content: `## Regular Expressions\n\nThe \`re\` module provides regex support.\n\n### Common Patterns\n- \`\\d\` — digit, \`\\w\` — word char, \`\\s\` — whitespace\n- \`+\` — one or more, \`*\` — zero or more\n- \`[]\` — character class, \`()\` — capture group\n\n### Functions\n\`re.match()\`, \`re.search()\`, \`re.findall()\`, \`re.sub()\``,
    codeExample: `import re\n\ntext = "Call me at 123-456-7890 or 987-654-3210"\nphones = re.findall(r'\\d{3}-\\d{3}-\\d{4}', text)\nprint(phones)\n\nemail = "user@pymaster.com"\nif re.match(r'[\\w.]+@[\\w.]+', email):\n    print("Valid email")`,
    exercises: {
      beginner: {
        prompt: "Use re.findall to find all digits in 'PyMaster 2024 v3'. Print the list.",
        starterCode: `import re\n\ntext = "PyMaster 2024 v3"\n\n# Find all digits\n`,
        expectedOutput: "['2', '0', '2', '4', '3']",
      },
      intermediate: {
        prompt: "Extract all words starting with uppercase from 'Hello World From PyMaster'. Print as list.",
        starterCode: `import re\n\ntext = "Hello World From PyMaster"\n\n# Find uppercase words\n`,
        expectedOutput: "['Hello', 'World', 'From', 'PyMaster']",
      },
      advanced: {
        prompt: "Replace all digits in 'Room 101, Floor 3' with '#'. Print result.",
        starterCode: `import re\n\ntext = "Room 101, Floor 3"\n\n# Replace digits with #\n`,
        expectedOutput: "Room ###, Floor #",
      },
    },
  },
  {
    id: "itertools-functools",
    title: "itertools & functools",
    category: "Expert",
    description: "Advanced iteration and functional programming tools",
    content: `## itertools & functools\n\n### itertools\n- \`chain\` — combine iterables\n- \`product\` — Cartesian product\n- \`permutations\`, \`combinations\`\n- \`groupby\` — group consecutive elements\n\n### functools\n- \`reduce\` — accumulate values\n- \`lru_cache\` — memoization\n- \`partial\` — partial function application`,
    codeExample: `from itertools import combinations, permutations\nfrom functools import reduce\n\nprint(list(combinations([1,2,3], 2)))\nprint(list(permutations("AB")))\nprint(reduce(lambda a,b: a*b, [1,2,3,4,5]))`,
    exercises: {
      beginner: {
        prompt: "Use functools.reduce to find the product of [1,2,3,4,5]. Print the result.",
        starterCode: `from functools import reduce\n\n# Calculate product\n`,
        expectedOutput: "120",
      },
      intermediate: {
        prompt: "Print all 2-element combinations of [1,2,3,4] as a list of tuples.",
        starterCode: `from itertools import combinations\n\n# Print combinations\n`,
        expectedOutput: "[(1, 2), (1, 3), (1, 4), (2, 3), (2, 4), (3, 4)]",
      },
      advanced: {
        prompt: "Use itertools.chain to combine [1,2], [3,4], [5,6] into one list. Print it.",
        starterCode: `from itertools import chain\n\n# Chain and print\n`,
        expectedOutput: "[1, 2, 3, 4, 5, 6]",
      },
    },
  },
  {
    id: "boolean-none",
    title: "Boolean Logic & None",
    category: "Beginner",
    description: "Understand truthy values, boolean expressions, and the None object",
    content: `## Boolean Logic\n\nBooleans represent truth values: \`True\` and \`False\`.\n\n### Common ideas\n- Comparison expressions return booleans\n- \`and\`, \`or\`, and \`not\` combine conditions\n- Empty strings, empty collections, 0, and \`None\` are falsy\n- \`None\` means “no value” and should be checked with \`is None\`\n\n### Why it matters\nBoolean logic controls decisions, loops, filtering, and validation in real Python programs.`,
    codeExample: `user_name = ""\nage = 20\nscore = None\n\nprint(bool(user_name))      # False\nprint(age >= 18 and age < 60)\nprint(score is None)        # True\n\nstatus = "ready" if user_name or age >= 18 else "wait"\nprint(status)`,
    exercises: {
      beginner: {
        prompt: "Given is_logged_in=True and has_token=False, print the result of is_logged_in and has_token.",
        starterCode: `is_logged_in = True\nhas_token = False\n\n# Print the combined result\n`,
        expectedOutput: "False",
      },
      intermediate: {
        prompt: "Given value=None, print 'Missing' if the value is None, otherwise print 'Present'.",
        starterCode: `value = None\n\n# Check and print\n`,
        expectedOutput: "Missing",
      },
      advanced: {
        prompt: "Given nums=[0, 1, 2, 3], print only the truthy values as a list using a comprehension.",
        starterCode: `nums = [0, 1, 2, 3]\n\n# Filter truthy values and print\n`,
        expectedOutput: "[1, 2, 3]",
      },
    },
  },
  {
    id: "json-serialization",
    title: "JSON & Serialization",
    category: "Intermediate",
    description: "Convert Python data to JSON and back again",
    content: `## JSON in Python\n\nJSON is a text format used to exchange structured data.\n\n### Core functions\n- \`json.dumps()\` converts Python data to a JSON string\n- \`json.loads()\` parses a JSON string into Python data\n- \`json.dump()\` and \`json.load()\` work with files\n\n### When to use it\nUse JSON when working with APIs, config files, browser apps, and saved structured data.`,
    codeExample: `import json\n\nuser = {"name": "PyMaster", "level": "beginner", "xp": 120}\njson_text = json.dumps(user, indent=2)\nprint(json_text)\n\nparsed = json.loads('{"ok": true, "count": 3}')\nprint(parsed["count"])`,
    exercises: {
      beginner: {
        prompt: "Convert {'name': 'Alice', 'age': 25} to a JSON string and print it.",
        starterCode: `import json\n\ndata = {"name": "Alice", "age": 25}\n\n# Convert and print\n`,
        expectedOutput: '{"name": "Alice", "age": 25}',
      },
      intermediate: {
        prompt: "Parse the JSON string '{\"city\": \"Chennai\", \"pin\": 600001}' and print the city value.",
        starterCode: `import json\n\ntext = '{"city": "Chennai", "pin": 600001}'\n\n# Parse and print city\n`,
        expectedOutput: "Chennai",
      },
      advanced: {
        prompt: "Convert [{'id': 1}, {'id': 2}] to pretty JSON with indent=2 and print it.",
        starterCode: `import json\n\nitems = [{"id": 1}, {"id": 2}]\n\n# Print pretty JSON\n`,
        expectedOutput: '[\n  {\n    "id": 1\n  },\n  {\n    "id": 2\n  }\n]',
      },
    },
  },
  {
    id: "datetime",
    title: "Datetime & Time Utilities",
    category: "Intermediate",
    description: "Work with dates, times, timedeltas, and formatting",
    content: `## Datetime\n\nPython's \`datetime\` module helps you create, compare, and format dates and times.\n\n### Key tools\n- \`datetime.now()\` for current date and time\n- \`date()\` and \`time()\` parts of a datetime\n- \`timedelta\` for adding or subtracting time\n- \`strftime()\` for formatting output\n\n### Common use cases\nScheduling, timestamps, logs, expiration checks, reminders, and date math.`,
    codeExample: `from datetime import datetime, timedelta\n\nnow = datetime(2026, 4, 3, 10, 30)\nprint(now.strftime("%Y-%m-%d"))\n\nnext_week = now + timedelta(days=7)\nprint(next_week.strftime("%d %b %Y"))`,
    exercises: {
      beginner: {
        prompt: "Create a datetime for 2026-01-01 and print it formatted as YYYY-MM-DD.",
        starterCode: `from datetime import datetime\n\n# Create and print formatted date\n`,
        expectedOutput: "2026-01-01",
      },
      intermediate: {
        prompt: "Given a datetime for 2026-04-03, add 5 days and print the new date as YYYY-MM-DD.",
        starterCode: `from datetime import datetime, timedelta\n\nday = datetime(2026, 4, 3)\n\n# Add 5 days and print\n`,
        expectedOutput: "2026-04-08",
      },
      advanced: {
        prompt: "Create two datetimes: 2026-04-01 and 2026-04-10. Print the number of days between them.",
        starterCode: `from datetime import datetime\n\nstart = datetime(2026, 4, 1)\nend = datetime(2026, 4, 10)\n\n# Print day difference\n`,
        expectedOutput: "9",
      },
    },
  },
  {
    id: "typing-dataclasses",
    title: "Type Hints & Dataclasses",
    category: "Advanced",
    description: "Write clearer Python with annotations and lightweight data models",
    content: `## Type Hints & Dataclasses\n\nType hints document what values a function expects and returns.\n\n### Type hints\n- \`name: str\`\n- \`age: int\`\n- \`def greet(user: str) -> str:\`\n\n### Dataclasses\nUse \`@dataclass\` when a class mostly stores data. Python creates \`__init__\`, \`__repr__\`, and comparison helpers for you.\n\n### Why this helps\nYour code becomes easier to read, maintain, and check with tools.`,
    codeExample: `from dataclasses import dataclass\n\n@dataclass\nclass User:\n    name: str\n    xp: int\n\n\ndef level_label(xp: int) -> str:\n    return "pro" if xp >= 100 else "starter"\n\nuser = User("Asha", 140)\nprint(user)\nprint(level_label(user.xp))`,
    exercises: {
      beginner: {
        prompt: "Write a function greet(name: str) -> str that returns 'Hello, <name>'. Print greet('PyMaster').",
        starterCode: `# Define greet with type hints\n\n# Print the result\n`,
        expectedOutput: "Hello, PyMaster",
      },
      intermediate: {
        prompt: "Create a dataclass Product with fields name:str and price:int. Make Product('Book', 500) and print its name.",
        starterCode: `from dataclasses import dataclass\n\n# Define Product and test it\n`,
        expectedOutput: "Book",
      },
      advanced: {
        prompt: "Create a dataclass Point with x:int and y:int. Make Point(3, 4) and print x + y.",
        starterCode: `from dataclasses import dataclass\n\n# Define Point and print x + y\n`,
        expectedOutput: "7",
      },
    },
  },
];
