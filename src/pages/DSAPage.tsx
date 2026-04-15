// ============================================================
// DSA PAGE — src/pages/DSAPage.tsx
// Data Structures & Algorithms mastery page with visual
// explanations, code examples, complexity analysis, and
// pattern detection tips for each topic.
// ============================================================
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Brain, Search, Zap, ArrowRight, ArrowLeft, CheckCircle2, Code, Target, Lightbulb, TrendingUp, ExternalLink, PlayCircle, AlertTriangle, CheckCheck } from "lucide-react";
import type { Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { problems, type Problem } from "@/data/problems";
import { useLanguage } from "@/contexts/LanguageContext";

interface DSATopic {
  id: string;
  title: string;
  emoji: string;
  category: "fundamentals" | "patterns" | "advanced";
  difficulty: "Easy" | "Medium" | "Hard";
  whatIsIt: string;
  whyUseIt: string;
  whenToUse: string[];
  patternDetection: string[];
  timeComplexity: string;
  spaceComplexity: string;
  codeExample: string;
  realWorldUse: string;
  visualExplanation: string;
  translations?: Partial<
    Record<
      "tamil" | "kannada" | "telugu" | "hindi",
      Partial<
        Pick<
          DSATopic,
          | "title"
          | "whatIsIt"
          | "whyUseIt"
          | "whenToUse"
          | "patternDetection"
          | "timeComplexity"
          | "spaceComplexity"
          | "realWorldUse"
          | "visualExplanation"
        >
      >
    >
  >;
}

type LearnLanguage = "english" | "tamil" | "kannada" | "telugu" | "hindi";

function getLocalizedDSATopic(topic: DSATopic | undefined, language: LearnLanguage) {
  if (!topic) return undefined;
  if (language === "english") return topic;
  const localized = topic.translations?.[language];
  if (!localized) return topic;
  return {
    ...topic,
    ...localized,
    whenToUse: localized.whenToUse ?? topic.whenToUse,
    patternDetection: localized.patternDetection ?? topic.patternDetection,
  };
}

const dsaTopics: DSATopic[] = [
  // FUNDAMENTALS
  {
    id: "arrays", title: "Arrays & Lists", emoji: "📦", category: "fundamentals", difficulty: "Easy",
    whatIsIt: "An array is a contiguous block of memory that stores elements of the same type. In Python, we use lists which are dynamic arrays — they can grow and shrink automatically.",
    whyUseIt: "Arrays give you O(1) random access by index. When you need to store a collection of items and access them by position, arrays are your go-to.",
    whenToUse: ["When you need fast access by index (O(1))", "When order of elements matters", "When you need to iterate through all elements", "When working with fixed-size or growing collections"],
    patternDetection: ["🔍 'Find all elements that...' → Linear scan O(n)", "🔍 'Sort and then...' → Sort first, then process", "🔍 'Find pair/triplet that sums to...' → Two pointers after sorting", "🔍 'Subarray with max/min...' → Sliding window or Kadane's"],
    timeComplexity: "Access: O(1) | Search: O(n) | Insert: O(n) | Append: O(1)",
    spaceComplexity: "O(n)",
    codeExample: `# Array/List operations in Python
nums = [3, 1, 4, 1, 5, 9]
print(nums[2])  # 4 - O(1) access
nums.append(2)  # O(1) amortized
squares = [x**2 for x in range(10)]
evens = [x for x in nums if x % 2 == 0]

# Two pointer pattern
def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        if s == target: return [left, right]
        elif s < target: left += 1
        else: right -= 1`,
    realWorldUse: "Database records, pixel arrays in images, sensor data streams, playlist ordering",
    visualExplanation: "Think of an array like a row of numbered lockers 🗄️. Each locker (index) holds one item. You can instantly go to locker #5, but inserting a new locker in the middle means moving everything after it.",
    translations: {
      tamil: {
        title: "Arrays & Lists",
        whatIsIt:
          "Array என்பது memory-ல் தொடர்ச்சியாக (contiguous) இருக்கும் பகுதியில் elements-ஐ சேமிக்கும் அமைப்பு. Python-ல் list என்பது dynamic array — அது தானாக வளரவும் குறையவும் முடியும்.",
        whyUseIt:
          "Index மூலம் O(1) random access கிடைக்கும். Position மூலம் items-ஐ அணுக வேண்டும் என்றால் arrays/lists சிறந்த தேர்வு.",
        whenToUse: [
          "Index மூலம் விரைவான access (O(1)) வேண்டும்",
          "Order முக்கியம்",
          "அனைத்து elements-ஐ iterate செய்ய வேண்டும்",
          "Fixed-size அல்லது growing collections",
        ],
        visualExplanation:
          "Array-ஐ எண்ணப்பட்ட lockers வரிசை 🗄️ போல நினையுங்கள். Locker #5-க்கு உடனே செல்லலாம்; ஆனால் நடுவில் புதிய locker சேர்க்க எல்லாவற்றையும் நகர்த்த வேண்டும்.",
      },
      kannada: {
        title: "Arrays & Lists",
        whatIsIt:
          "Array ಅಂದರೆ memory ನಲ್ಲಿ contiguous ಆಗಿ elements ಅನ್ನು ಸಂಗ್ರಹಿಸುವ ರಚನೆ. Python ನಲ್ಲಿ list ಒಂದು dynamic array — ಅದು ಸ್ವಯಂಚಾಲಿತವಾಗಿ grow/shrink ಆಗುತ್ತದೆ.",
        whyUseIt:
          "Index ಮೂಲಕ O(1) random access. Position ಆಧಾರಿತ access ಬೇಕಾದರೆ arrays/lists ಉತ್ತಮ.",
        whenToUse: ["Index ಮೂಲಕ fast access (O(1))", "Order ಮುಖ್ಯ", "ಎಲ್ಲ elements iterate", "Fixed ಅಥವಾ growing collections"],
        visualExplanation:
          "Array ಅನ್ನು ಸಂಖ್ಯೆ ಹಾಕಿದ lockers ಸಾಲು 🗄️ ಎಂದು ಕಲ್ಪಿಸಿ. Locker #5 ಗೆ ತಕ್ಷಣ ಹೋಗಬಹುದು, ಆದರೆ ಮಧ್ಯದಲ್ಲಿ ಹೊಸ locker ಸೇರಿಸಲು ನಂತರದ ಎಲ್ಲವನ್ನು shift ಮಾಡಬೇಕು.",
      },
      telugu: {
        title: "Arrays & Lists",
        whatIsIt:
          "Array అనేది memory లో contiguous గా elements ను store చేసే structure. Python లో list అనేది dynamic array — అది auto గా grow/shrink అవుతుంది.",
        whyUseIt:
          "Index ద్వారా O(1) random access. Position ఆధారంగా items ని access చేయాలంటే arrays/lists best.",
        whenToUse: ["Index తో fast access (O(1))", "Order ముఖ్యము", "All elements iterate", "Fixed లేదా growing collections"],
        visualExplanation:
          "Array ని numbered lockers వరుస 🗄️ లా ఊహించండి. Locker #5 కి వెంటనే వెళ్లొచ్చు, కానీ మధ్యలో కొత్త locker పెడితే తరువాతివన్నీ shift చేయాలి.",
      },
      hindi: {
        title: "Arrays & Lists",
        whatIsIt:
          "Array memory में contiguous block में elements store करता है। Python में list dynamic array है — यह अपने आप grow/shrink हो सकती है।",
        whyUseIt:
          "Index से O(1) random access मिलता है। Position से items access करने हों तो arrays/lists best हैं।",
        whenToUse: ["Index से fast access (O(1))", "Order important", "All elements iterate", "Fixed या growing collections"],
        visualExplanation:
          "Array को numbered lockers की row 🗄️ समझो। Locker #5 पर तुरंत जा सकते हो, लेकिन बीच में नया locker जोड़ने पर बाद वाले सब shift करने पड़ते हैं।",
      },
    },
  },
  {
    id: "hash-maps", title: "Hash Maps (Dictionaries)", emoji: "🗺️", category: "fundamentals", difficulty: "Easy",
    whatIsIt: "A hash map maps keys to values using a hash function. Python's dict is a hash map — it converts your key into an array index internally for O(1) access.",
    whyUseIt: "When you need to look up, insert, or delete by a key in O(1) average time. The most versatile data structure for counting, caching, and mapping relationships.",
    whenToUse: ["When you need fast lookup by key — O(1)", "Counting occurrences of elements", "Mapping relationships (name → phone)", "Caching/memoization results"],
    patternDetection: ["🔍 'Count frequency of...' → Use Counter or dict", "🔍 'Find if complement exists...' → Store seen values in dict", "🔍 'Group elements by...' → defaultdict(list)", "🔍 'Check if already visited...' → Use set (hash set)"],
    timeComplexity: "Get/Set/Delete: O(1) avg | Worst: O(n)",
    spaceComplexity: "O(n)",
    codeExample: `from collections import Counter, defaultdict

freq = Counter("hello world".split())
print(freq)

def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i

def group_by_length(words):
    groups = defaultdict(list)
    for w in words:
        groups[len(w)].append(w)
    return dict(groups)`,
    realWorldUse: "Caches, database indexes, symbol tables in compilers, configuration settings",
    visualExplanation: "Imagine a library catalog 📚. Instead of searching every shelf, you look up a book by its call number (key) and go directly to its location (value). That's hashing!",
    translations: {
      tamil: {
        title: "Hash Maps (Dictionaries)",
        whatIsIt:
          "Hash map என்பது key → value mapping. Python `dict` ஒரு hash map; key-ஐ hash செய்து O(1) average access க்காக உள்ளே index-ஆக மாற்றுகிறது.",
        whyUseIt:
          "Key மூலம் lookup/insert/delete O(1) average. Counting, caching, mapping relationships போன்றவற்றுக்கு மிக பயனுள்ளது.",
      },
      kannada: {
        title: "Hash Maps (Dictionaries)",
        whatIsIt:
          "Hash map ಎಂದರೆ key → value mapping. Python `dict` ಒಂದು hash map; key ಅನ್ನು hash ಮಾಡಿ O(1) avg access ಗಾಗಿ internal index ಗೆ ಮ್ಯಾಪ್ ಮಾಡುತ್ತದೆ.",
        whyUseIt:
          "Key ಮೂಲಕ lookup/insert/delete O(1) avg. Counting, caching, relationships mapping ಗೆ ಅತ್ಯಂತ ಉಪಯುಕ್ತ.",
      },
      telugu: {
        title: "Hash Maps (Dictionaries)",
        whatIsIt:
          "Hash map అనేది key → value mapping. Python `dict` hash map; key ని hash చేసి O(1) avg access కోసం internal index గా map చేస్తుంది.",
        whyUseIt:
          "Key తో lookup/insert/delete O(1) avg. Counting, caching, relationships mapping కి చాలా ఉపయోగం.",
      },
      hindi: {
        title: "Hash Maps (Dictionaries)",
        whatIsIt:
          "Hash map key → value mapping है। Python `dict` hash map है; key को hash करके O(1) avg access के लिए internal index में map करता है।",
        whyUseIt:
          "Key से lookup/insert/delete O(1) avg। Counting, caching, relationships mapping के लिए बहुत उपयोगी।",
      },
    },
  },
  {
    id: "stacks-queues", title: "Stacks & Queues", emoji: "📚", category: "fundamentals", difficulty: "Easy",
    whatIsIt: "Stack = LIFO (Last In, First Out). Queue = FIFO (First In, First Out). Both restrict how you access elements for specific processing patterns.",
    whyUseIt: "When the order of processing matters. Stacks for undo operations, parsing, DFS. Queues for BFS, task scheduling, message processing.",
    whenToUse: ["Stack: matching brackets, undo/redo, DFS, expression evaluation", "Queue: BFS, task scheduling, buffer management", "When you only need to access the most recently or first added element"],
    patternDetection: ["🔍 'Valid parentheses/brackets...' → Stack", "🔍 'Process in order received...' → Queue", "🔍 'Level-by-level traversal...' → Queue (BFS)", "🔍 'Next greater/smaller element...' → Monotonic stack"],
    timeComplexity: "Push/Pop/Enqueue/Dequeue: O(1) | Peek: O(1)",
    spaceComplexity: "O(n)",
    codeExample: `from collections import deque

stack = []
stack.append(1)
stack.append(2)
top = stack.pop()  # 2

def is_valid(s):
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in '({[':
            stack.append(char)
        elif not stack or stack.pop() != pairs[char]:
            return False
    return len(stack) == 0

queue = deque()
queue.append(1)
first = queue.popleft()  # 1`,
    realWorldUse: "Browser back/forward (stack), print job queue, call stack in programming, BFS in social networks",
    visualExplanation: "Stack 📚: Like a stack of books — you can only take from the top. Queue 🎫: Like a ticket line — first person in line gets served first.",
    translations: {
      tamil: {
        title: "Stacks & Queues",
        whatIsIt: "Stack = LIFO. Queue = FIFO. இரண்டும் elements-ஐ access செய்யும் முறையை கட்டுப்படுத்தும்.",
        visualExplanation:
          "Stack 📚: புத்தகக் குவியல் போல — மேலே இருப்பதையே எடுக்க முடியும். Queue 🎫: வரிசை போல — முதலில் வந்தவர் முதலில் சேவை பெறுவர்.",
      },
      kannada: {
        title: "Stacks & Queues",
        whatIsIt: "Stack = LIFO. Queue = FIFO. ಎರಡೂ access ಕ್ರಮವನ್ನು ನಿಯಂತ್ರಿಸುತ್ತವೆ.",
        visualExplanation:
          "Stack 📚: ಪುಸ್ತಕಗಳ ಕಟ್ಟು — ಮೇಲಿಂದಲೇ ತೆಗೆದುಕೊಳ್ಳಬಹುದು. Queue 🎫: ಸಾಲು — ಮೊದಲಿಗೆ ಬಂದವನು ಮೊದಲಿಗೆ ಸೇವೆ.",
      },
      telugu: {
        title: "Stacks & Queues",
        whatIsIt: "Stack = LIFO. Queue = FIFO. రెండూ access ఆర్డర్ ను నియంత్రిస్తాయి.",
        visualExplanation:
          "Stack 📚: పుస్తకాల కట్ట లా — పై నుండి మాత్రమే తీస్తాం. Queue 🎫: క్యూలైన్ లా — ముందుగా వచ్చినవాడు ముందుగా.",
      },
      hindi: {
        title: "Stacks & Queues",
        whatIsIt: "Stack = LIFO. Queue = FIFO. दोनों access order को restrict करते हैं।",
        visualExplanation:
          "Stack 📚: किताबों की stack — ऊपर से ही निकालते हैं। Queue 🎫: लाइन — जो पहले आया, वो पहले।",
      },
    },
  },
  {
    id: "linked-lists", title: "Linked Lists", emoji: "🔗", category: "fundamentals", difficulty: "Medium",
    whatIsIt: "A linked list is a chain of nodes, where each node stores data and a pointer to the next node. Unlike arrays, elements aren't stored contiguously in memory.",
    whyUseIt: "O(1) insertion/deletion at known positions (no shifting needed). Useful when you don't know the size ahead of time or need frequent insertions.",
    whenToUse: ["Frequent insertions/deletions at known positions", "When you don't need random access by index", "Implementing stacks, queues, or LRU caches", "When memory is fragmented"],
    patternDetection: ["🔍 'Detect cycle in...' → Fast/slow pointer (Floyd's)", "🔍 'Find middle element...' → Fast/slow pointer", "🔍 'Reverse a linked list...' → Three pointers: prev, curr, next", "🔍 'Merge two sorted lists...' → Dummy head + comparison"],
    timeComplexity: "Access: O(n) | Insert/Delete: O(1) at known position | Search: O(n)",
    spaceComplexity: "O(n)",
    codeExample: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev

def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
    realWorldUse: "Browser history, music playlists, memory allocation, polynomial representation",
    visualExplanation: "Like a treasure hunt 🗺️ — each clue (node) tells you where to find the next clue, but you can't jump ahead. You must follow the chain!",
    translations: {
      tamil: {
        title: "Linked Lists",
        whatIsIt:
          "Linked list என்பது nodes சங்கிலி. ஒவ்வொரு node-ம் data + next pointer வைத்திருக்கும். Array போல contiguous memory அல்ல.",
        whyUseIt:
          "Known position-ல் insertion/deletion O(1) (shift செய்ய வேண்டாம்). Size முன்கூட்டியே தெரியாததும் frequent insertions தேவைப்படும் போதும் பயன்.",
        whenToUse: ["Known positions-ல் frequent insert/delete", "Index random access தேவையில்லை", "Stacks/queues/LRU cache implement செய்ய", "Memory fragmented ஆகும் சூழல்"],
        patternDetection: [
          "🔍 'Cycle detect...' → Fast/slow pointer (Floyd)",
          "🔍 'Middle node...' → Fast/slow pointer",
          "🔍 'Reverse...' → prev/curr/next pointers",
          "🔍 'Merge sorted lists...' → Dummy head + compare",
        ],
        visualExplanation:
          "Treasure hunt 🗺️ போல நினையுங்கள் — ஒவ்வொரு node-மும் next clue எங்கே என்பதை சொல்கிறது; நீங்கள் chain-ஐ பின்பற்றியே செல்ல வேண்டும்.",
      },
      kannada: {
        title: "Linked Lists",
        whatIsIt:
          "Linked list nodes ಸರಪಳಿ. ಪ್ರತಿಯೊಂದು node ನಲ್ಲಿ data + next pointer. Array ನಂತೆ contiguous memory ಅಲ್ಲ.",
        whyUseIt:
          "Known position ನಲ್ಲಿ insertion/deletion O(1) (shift ಬೇಡ). Size ಮುಂಚಿತವಾಗಿ ತಿಳಿಯದಾಗ ಅಥವಾ frequent insertions ಬೇಕಾದಾಗ ಉಪಯುಕ್ತ.",
        whenToUse: ["Known positions ನಲ್ಲಿ frequent insert/delete", "Index random access ಬೇಡ", "Stacks/queues/LRU cache implement", "Memory fragmented ಆಗಿರುವಾಗ"],
        patternDetection: [
          "🔍 'Cycle detect...' → Fast/slow pointer (Floyd)",
          "🔍 'Middle node...' → Fast/slow pointer",
          "🔍 'Reverse...' → prev/curr/next pointers",
          "🔍 'Merge sorted lists...' → Dummy head + compare",
        ],
        visualExplanation:
          "Treasure hunt 🗺️ ಹೀಗೇ — ಪ್ರತಿಯೊಂದು node next clue ಎಲ್ಲಿದೆ ಎಂದು ಹೇಳುತ್ತದೆ; ನೀವು chain ಅನ್ನು ಅನುಸರಿಸಬೇಕು.",
      },
      telugu: {
        title: "Linked Lists",
        whatIsIt:
          "Linked list అనేది nodes chain. ప్రతి node లో data + next pointer ఉంటుంది. Array లా contiguous memory కాదు.",
        whyUseIt:
          "Known position లో insertion/deletion O(1) (shift అవసరం లేదు). Size ముందుగా తెలియనప్పుడు లేదా frequent insertions అవసరమైనప్పుడు ఉపయోగం.",
        whenToUse: ["Known positions లో frequent insert/delete", "Index random access అవసరం లేదు", "Stacks/queues/LRU cache implement", "Memory fragmented అయినప్పుడు"],
        patternDetection: [
          "🔍 'Cycle detect...' → Fast/slow pointer (Floyd)",
          "🔍 'Middle node...' → Fast/slow pointer",
          "🔍 'Reverse...' → prev/curr/next pointers",
          "🔍 'Merge sorted lists...' → Dummy head + compare",
        ],
        visualExplanation:
          "Treasure hunt 🗺️ లా — ప్రతి node next clue ఎక్కడుందో చెబుతుంది; మీరు chain ని follow అవ్వాలి.",
      },
      hindi: {
        title: "Linked Lists",
        whatIsIt:
          "Linked list nodes की chain है। हर node में data + next pointer होता है। Array की तरह contiguous memory नहीं।",
        whyUseIt:
          "Known position पर insertion/deletion O(1) (shift नहीं करना पड़ता)। Size पहले से न पता हो या frequent insertions हों तो useful।",
        whenToUse: ["Known positions पर frequent insert/delete", "Index random access नहीं चाहिए", "Stacks/queues/LRU cache implement", "Fragmented memory cases"],
        patternDetection: [
          "🔍 'Cycle detect...' → Fast/slow pointer (Floyd)",
          "🔍 'Middle node...' → Fast/slow pointer",
          "🔍 'Reverse...' → prev/curr/next pointers",
          "🔍 'Merge sorted lists...' → Dummy head + compare",
        ],
        visualExplanation:
          "Treasure hunt 🗺️ जैसा — हर node बताता है next clue कहाँ है; आपको chain follow करनी होती है।",
      },
    },
  },
  {
    id: "strings", title: "String Manipulation", emoji: "📝", category: "fundamentals", difficulty: "Easy",
    whatIsIt: "Strings are immutable sequences of characters. Python strings support slicing, searching, formatting, and regex — powerful tools for text processing.",
    whyUseIt: "Text processing is everywhere: parsing input, validating data, pattern matching, serialization. Mastering strings is essential for any developer.",
    whenToUse: ["Text parsing and validation", "Pattern matching and searching", "Data serialization (JSON, CSV)", "URL/path manipulation"],
    patternDetection: ["🔍 'Anagram/permutation check...' → Sort or frequency count", "🔍 'Palindrome check...' → Two pointers from both ends", "🔍 'Substring search...' → Sliding window or KMP", "🔍 'String transformation...' → Build character by character"],
    timeComplexity: "Access: O(1) | Search: O(n) | Concatenation: O(n) | Slice: O(k)",
    spaceComplexity: "O(n) — strings are immutable, new string = new memory",
    codeExample: `# Essential string operations
s = "Hello, Python World!"

# Slicing
print(s[7:13])   # "Python"
print(s[::-1])   # Reverse

# Useful methods
print(s.lower())
print(s.split(", "))
print("-".join(["a", "b", "c"]))

# Check anagram
def is_anagram(s1, s2):
    return sorted(s1.lower()) == sorted(s2.lower())

# Check palindrome  
def is_palindrome(s):
    clean = ''.join(c.lower() for c in s if c.isalnum())
    return clean == clean[::-1]`,
    realWorldUse: "Search engines, text editors, compilers, data validation, natural language processing",
    visualExplanation: "A string is like a necklace of beads 📿 — each bead is a character. You can look at any bead by position, but to change one, you have to make a whole new necklace.",
    translations: {
      tamil: {
        title: "String Manipulation",
        whatIsIt:
          "String என்பது immutable characters sequence. Python-ல் slicing, search, formatting, regex போன்ற சக்திவாய்ந்த tools உள்ளன.",
        whyUseIt:
          "Text processing எங்கும் உள்ளது: input parse, data validate, pattern match, JSON/CSV போன்ற serialization. Strings-ஐ நன்றாக அறிதல் அவசியம்.",
        whenToUse: ["Text parsing/validation", "Pattern matching/search", "Serialization (JSON/CSV)", "URL/path manipulation"],
        patternDetection: [
          "🔍 'Anagram...' → sort அல்லது frequency count",
          "🔍 'Palindrome...' → two pointers",
          "🔍 'Substring search...' → sliding window / KMP",
          "🔍 'Transform...' → char-by-char build",
        ],
        visualExplanation:
          "String-ஐ மணிகளின் மாலை 📿 போல நினையுங்கள். ஒரு character மாற்ற வேண்டுமெனில் புதிய string உருவாக்க வேண்டும்.",
      },
      kannada: {
        title: "String Manipulation",
        whatIsIt:
          "String ಒಂದು immutable characters sequence. Python slicing/search/formatting/regex tools ಕೊಡುತ್ತದೆ.",
        whyUseIt:
          "Text processing ಎಲ್ಲೆಡೆ: input parse, data validate, pattern match, JSON/CSV serialization. Strings mastery ಅಗತ್ಯ.",
        whenToUse: ["Text parsing/validation", "Pattern matching/search", "Serialization (JSON/CSV)", "URL/path manipulation"],
        patternDetection: [
          "🔍 'Anagram...' → sort ಅಥವಾ frequency count",
          "🔍 'Palindrome...' → two pointers",
          "🔍 'Substring search...' → sliding window / KMP",
          "🔍 'Transform...' → char-by-char build",
        ],
        visualExplanation:
          "String ಅನ್ನು ಮುತ್ತಿನ ಹಾರ 📿 ಎಂದು ಕಲ್ಪಿಸಿ. ಒಂದು character ಬದಲಾಯಿಸಲು ಹೊಸ string ಬೇಕು (immutable).",
      },
      telugu: {
        title: "String Manipulation",
        whatIsIt:
          "String అనేది immutable characters sequence. Python లో slicing/search/formatting/regex tools ఉన్నాయి.",
        whyUseIt:
          "Text processing everywhere: input parse, data validate, pattern match, JSON/CSV serialization. Strings mastery అవసరం.",
        whenToUse: ["Text parsing/validation", "Pattern matching/search", "Serialization (JSON/CSV)", "URL/path manipulation"],
        patternDetection: [
          "🔍 'Anagram...' → sort లేదా frequency count",
          "🔍 'Palindrome...' → two pointers",
          "🔍 'Substring search...' → sliding window / KMP",
          "🔍 'Transform...' → char-by-char build",
        ],
        visualExplanation:
          "String ని ముత్యాల హారం 📿 లా ఊహించండి. ఒక character మార్చాలంటే కొత్త string తయారు చేయాలి (immutable).",
      },
      hindi: {
        title: "String Manipulation",
        whatIsIt:
          "String immutable characters sequence है। Python में slicing/search/formatting/regex tools हैं।",
        whyUseIt:
          "Text processing हर जगह: input parse, data validate, pattern match, JSON/CSV serialization. Strings mastery जरूरी।",
        whenToUse: ["Text parsing/validation", "Pattern matching/search", "Serialization (JSON/CSV)", "URL/path manipulation"],
        patternDetection: [
          "🔍 'Anagram...' → sort या frequency count",
          "🔍 'Palindrome...' → two pointers",
          "🔍 'Substring search...' → sliding window / KMP",
          "🔍 'Transform...' → char-by-char build",
        ],
        visualExplanation:
          "String को beads की necklace 📿 समझो। एक character बदलना हो तो नई string बनानी पड़ती है (immutable).",
      },
    },
  },
  {
    id: "heaps", title: "Heaps & Priority Queues", emoji: "⛰️", category: "fundamentals", difficulty: "Medium",
    whatIsIt: "A heap is a tree-based structure where the parent is always smaller (min-heap) or larger (max-heap) than its children. Python's heapq module implements a min-heap.",
    whyUseIt: "Get the minimum/maximum element in O(1), insert/remove in O(log n). Perfect for 'top K', streaming data, and scheduling problems.",
    whenToUse: ["Find k largest/smallest elements", "Merge k sorted lists", "Median in a data stream", "Task scheduling by priority"],
    patternDetection: ["🔍 'K largest/smallest...' → Min/max heap of size K", "🔍 'Merge K sorted...' → Min heap with one element per list", "🔍 'Running median...' → Two heaps (max-heap + min-heap)", "🔍 'Schedule by priority...' → Priority queue"],
    timeComplexity: "Insert: O(log n) | Extract min: O(log n) | Peek: O(1)",
    spaceComplexity: "O(n)",
    codeExample: `import heapq

# Min heap
nums = [5, 3, 8, 1, 9, 2]
heapq.heapify(nums)  # O(n)
print(heapq.heappop(nums))  # 1 (smallest)

# K largest elements
def k_largest(nums, k):
    return heapq.nlargest(k, nums)

print(k_largest([3, 1, 4, 1, 5, 9], 3))  # [9, 5, 4]

# Merge K sorted lists
def merge_k_sorted(lists):
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))
    result = []
    while heap:
        val, list_idx, elem_idx = heapq.heappop(heap)
        result.append(val)
        if elem_idx + 1 < len(lists[list_idx]):
            heapq.heappush(heap, (lists[list_idx][elem_idx + 1], list_idx, elem_idx + 1))
    return result`,
    realWorldUse: "OS task schedulers, Dijkstra's shortest path, event-driven simulation, bandwidth management",
    visualExplanation: "Imagine a tournament bracket 🏆 — the winner (smallest/largest) is always at the top. When you remove the champion, a new one quickly rises up through the bracket.",
    translations: {
      tamil: {
        title: "Heaps & Priority Queues",
        whatIsIt:
          "Heap என்பது tree-based structure. Min-heap-ல் parent எப்போதும் children-ஐ விட சிறியது. Python `heapq` min-heap implement செய்கிறது.",
        whyUseIt:
          "Min/Max O(1) peek, insert/remove O(log n). Top-K, streaming median, scheduling போன்றவற்றில் சிறப்பு.",
        whenToUse: ["k largest/smallest", "Merge k sorted lists", "Median in stream", "Priority scheduling"],
        patternDetection: [
          "🔍 'Top K...' → size K heap",
          "🔍 'Merge K sorted...' → heap with 1 elem per list",
          "🔍 'Running median...' → two heaps",
          "🔍 'Schedule by priority...' → priority queue",
        ],
        visualExplanation:
          "Tournament bracket 🏆 போல — champion மேலே. Champion-ஐ நீக்கினால் புதிய champion வேகமாக மேலே வரும்.",
      },
      kannada: {
        title: "Heaps & Priority Queues",
        whatIsIt:
          "Heap ಒಂದು tree-based structure. Min-heap ನಲ್ಲಿ parent ಯಾವಾಗಲೂ children ಗಿಂತ ಚಿಕ್ಕದು. Python `heapq` min-heap.",
        whyUseIt:
          "Min/Max peek O(1), insert/remove O(log n). Top-K, streaming median, scheduling ಗೆ ಸೂಕ್ತ.",
        whenToUse: ["k largest/smallest", "Merge k sorted lists", "Median in stream", "Priority scheduling"],
        patternDetection: [
          "🔍 'Top K...' → size K heap",
          "🔍 'Merge K sorted...' → heap with 1 elem per list",
          "🔍 'Running median...' → two heaps",
          "🔍 'Schedule by priority...' → priority queue",
        ],
        visualExplanation:
          "Tournament bracket 🏆 — champion ಮೇಲ್ನೋಟದಲ್ಲಿ. Champion ತೆಗೆದರೆ ಹೊಸ champion ಬೇಗ ಮೇಲಕ್ಕೆ ಬರುತ್ತಾನೆ.",
      },
      telugu: {
        title: "Heaps & Priority Queues",
        whatIsIt:
          "Heap అనేది tree-based structure. Min-heap లో parent ఎప్పుడూ children కంటే చిన్నది. Python `heapq` min-heap.",
        whyUseIt:
          "Min/Max peek O(1), insert/remove O(log n). Top-K, streaming median, scheduling కి బాగా సరిపోతుంది.",
        whenToUse: ["k largest/smallest", "Merge k sorted lists", "Median in stream", "Priority scheduling"],
        patternDetection: [
          "🔍 'Top K...' → size K heap",
          "🔍 'Merge K sorted...' → heap with 1 elem per list",
          "🔍 'Running median...' → two heaps",
          "🔍 'Schedule by priority...' → priority queue",
        ],
        visualExplanation:
          "Tournament bracket 🏆 లా — champion పైభాగంలో. Champion తీసేస్తే కొత్త champion త్వరగా పైకి వస్తాడు.",
      },
      hindi: {
        title: "Heaps & Priority Queues",
        whatIsIt:
          "Heap tree-based structure है। Min-heap में parent हमेशा children से छोटा होता है। Python `heapq` min-heap implement करता है।",
        whyUseIt:
          "Min/Max peek O(1), insert/remove O(log n). Top-K, streaming median, scheduling के लिए best।",
        whenToUse: ["k largest/smallest", "Merge k sorted lists", "Median in stream", "Priority scheduling"],
        patternDetection: [
          "🔍 'Top K...' → size K heap",
          "🔍 'Merge K sorted...' → heap with 1 elem per list",
          "🔍 'Running median...' → two heaps",
          "🔍 'Schedule by priority...' → priority queue",
        ],
        visualExplanation:
          "Tournament bracket 🏆 जैसा — champion सबसे ऊपर। Champion हटाओ तो नया champion जल्दी ऊपर आ जाता है।",
      },
    },
  },
  // PATTERNS
  {
    id: "two-pointers", title: "Two Pointers Pattern", emoji: "👆👆", category: "patterns", difficulty: "Medium",
    whatIsIt: "A technique using two references (pointers) that traverse the data structure in a coordinated way — often from opposite ends or at different speeds.",
    whyUseIt: "Reduces O(n²) brute force to O(n). Works brilliantly on sorted arrays and linked lists for finding pairs, removing duplicates, or partitioning.",
    whenToUse: ["Sorted arrays: find pairs with target sum", "Remove duplicates from sorted array", "Container with most water / trapping rain water", "Palindrome checking"],
    patternDetection: ["🔍 'Find pair in sorted array...' → Start from both ends", "🔍 'Remove in-place...' → Read/write pointers", "🔍 'Is palindrome...' → Compare from both ends", "🔍 'Three sum / four sum...' → Fix one, two-pointer on rest"],
    timeComplexity: "Usually O(n) or O(n log n) if sorting needed",
    spaceComplexity: "O(1) — no extra space!",
    codeExample: `def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        current = nums[left] + nums[right]
        if current == target: return [left, right]
        elif current < target: left += 1
        else: right -= 1

def remove_duplicates(nums):
    if not nums: return 0
    write = 1
    for read in range(1, len(nums)):
        if nums[read] != nums[read - 1]:
            nums[write] = nums[read]
            write += 1
    return write

def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]: return False
        left += 1; right -= 1
    return True`,
    realWorldUse: "Database merge operations, collision detection, DNA sequence matching",
    visualExplanation: "Imagine two people walking toward each other on a bridge 🌉. They start at opposite ends and meet in the middle, checking conditions as they go.",
    translations: {
      tamil: {
        title: "Two Pointers Pattern",
        whatIsIt:
          "இரண்டு pointers மூலம் data structure-ஐ ஒருங்கிணைந்து traverse செய்வது (எதிர் முனைகளில் இருந்து அல்லது வேகங்கள் வேறாக).",
        whyUseIt:
          "Brute force O(n²) ஐ O(n) ஆக குறைக்க முடியும். Sorted arrays மற்றும் linked lists-ல் சிறப்பு.",
        whenToUse: ["Sorted array pair sum", "In-place duplicates remove", "Water container / rain water", "Palindrome check"],
        patternDetection: [
          "🔍 'Sorted pair...' → both ends",
          "🔍 'In-place remove...' → read/write pointers",
          "🔍 'Palindrome...' → compare ends",
          "🔍 '3-sum/4-sum...' → fix one + two pointers",
        ],
        visualExplanation:
          "Bridge 🌉-ல் இரண்டு பேர் எதிர் முனைகளில் இருந்து நடந்து நடுவில் சந்திப்பது போல — pointers move செய்து condition check செய்க.",
      },
      kannada: {
        title: "Two Pointers Pattern",
        whatIsIt:
          "ಎರಡು pointers ಬಳಸಿ coordinated traversal (ಎದುರು ದಿಕ್ಕಿನಿಂದ ಅಥವಾ ಬೇರೆ ವೇಗದಲ್ಲಿ).",
        whyUseIt:
          "O(n²) brute force ಅನ್ನು O(n) ಗೆ ಇಳಿಸುತ್ತದೆ. Sorted arrays/linked lists ನಲ್ಲಿ ಉತ್ತಮ.",
        whenToUse: ["Sorted pair sum", "In-place duplicates remove", "Water container", "Palindrome check"],
        patternDetection: [
          "🔍 'Sorted pair...' → both ends",
          "🔍 'In-place remove...' → read/write pointers",
          "🔍 'Palindrome...' → compare ends",
          "🔍 '3-sum/4-sum...' → fix one + two pointers",
        ],
        visualExplanation:
          "Bridge 🌉 ನಲ್ಲಿ ಎರಡು ಜನ ಎದುರು ತುದಿಗಳಿಂದ ನಡೆದು ಮಧ್ಯದಲ್ಲಿ ಸೇರುವಂತೆ — pointers move ಮಾಡಿ check ಮಾಡಿ.",
      },
      telugu: {
        title: "Two Pointers Pattern",
        whatIsIt:
          "రెండు pointers తో coordinated traversal (opposite ends లేదా different speeds).",
        whyUseIt:
          "O(n²) brute force ని O(n) గా తగ్గిస్తుంది. Sorted arrays/linked lists లో అద్భుతం.",
        whenToUse: ["Sorted pair sum", "In-place duplicates remove", "Water container", "Palindrome check"],
        patternDetection: [
          "🔍 'Sorted pair...' → both ends",
          "🔍 'In-place remove...' → read/write pointers",
          "🔍 'Palindrome...' → compare ends",
          "🔍 '3-sum/4-sum...' → fix one + two pointers",
        ],
        visualExplanation:
          "Bridge 🌉 పై రెండు మంది opposite ends నుండి నడుస్తూ మధ్యలో కలిసేలా — pointers move చేసి condition చెక్ చేయండి.",
      },
      hindi: {
        title: "Two Pointers Pattern",
        whatIsIt:
          "दो pointers से coordinated traversal (opposite ends से या अलग speed).",
        whyUseIt:
          "O(n²) brute force को O(n) में बदल देता है। Sorted arrays/linked lists में बहुत काम आता है।",
        whenToUse: ["Sorted pair sum", "In-place duplicates remove", "Water container", "Palindrome check"],
        patternDetection: [
          "🔍 'Sorted pair...' → both ends",
          "🔍 'In-place remove...' → read/write pointers",
          "🔍 'Palindrome...' → compare ends",
          "🔍 '3-sum/4-sum...' → fix one + two pointers",
        ],
        visualExplanation:
          "Bridge 🌉 पर दो लोग दोनों ends से चलते हुए बीच में मिलते हैं — वैसे pointers move करके check करते जाएँ।",
      },
    },
  },
  {
    id: "sliding-window", title: "Sliding Window Pattern", emoji: "🪟", category: "patterns", difficulty: "Medium",
    whatIsIt: "A technique that maintains a 'window' (subarray/substring) that slides across the data. The window can be fixed-size or dynamic, expanding and shrinking as needed.",
    whyUseIt: "Turns O(n²) or O(n³) substring/subarray problems into O(n). Instead of recalculating from scratch, update by adding/removing elements at the window edges.",
    whenToUse: ["Longest/shortest substring with condition", "Maximum sum subarray of size k", "String permutation / anagram matching", "Minimum window containing all characters"],
    patternDetection: ["🔍 'Maximum/minimum sum of k consecutive...' → Fixed window", "🔍 'Longest substring with at most...' → Dynamic window", "🔍 'Find anagram in string...' → Fixed window + freq count", "🔍 'Minimum window containing...' → Dynamic window + hash map"],
    timeComplexity: "O(n) — each element is added and removed at most once",
    spaceComplexity: "O(k) where k is window size or O(1) for fixed window",
    codeExample: `def max_sum_k(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    return max_sum

def longest_unique_substring(s):
    char_set = set()
    left = result = 0
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        char_set.add(s[right])
        result = max(result, right - left + 1)
    return result`,
    realWorldUse: "Network packet analysis, real-time analytics dashboards, stock price analysis, text pattern matching",
    visualExplanation: "Like looking through a train window 🚂 as it moves — you see a portion of the landscape at a time. As the train moves forward, new scenery enters and old scenery leaves your view.",
    translations: {
      tamil: {
        title: "Sliding Window Pattern",
        whatIsIt:
          "ஒரு window (subarray/substring) வைத்து data-ல் slide செய்வது. Fixed-size அல்லது dynamic (expand/shrink) ஆக இருக்கலாம்.",
        whyUseIt:
          "Substring/subarray brute force O(n²)/O(n³) ஐ O(n) ஆக மாற்றும். Edge-ல் add/remove செய்து update செய்யலாம்.",
        whenToUse: ["Longest/shortest substring", "Max sum subarray size k", "Anagram/permutation match", "Minimum window substring"],
        patternDetection: [
          "🔍 'Sum of k consecutive...' → fixed window",
          "🔍 'Longest with at most...' → dynamic window",
          "🔍 'Find anagram...' → fixed + freq count",
          "🔍 'Minimum window...' → dynamic + hashmap",
        ],
        visualExplanation:
          "Train window 🚂 போல — ஒரு பகுதியை மட்டும் பார்க்கிறோம்; train முன்னேறும்போது புதியது வரும், பழையது வெளியேறும்.",
      },
      kannada: {
        title: "Sliding Window Pattern",
        whatIsIt:
          "Window (subarray/substring) ಅನ್ನು maintain ಮಾಡಿ data ಮೇಲೆ slide ಮಾಡುವುದು. Fixed-size ಅಥವಾ dynamic (expand/shrink).",
        whyUseIt:
          "O(n²)/O(n³) brute force ಅನ್ನು O(n) ಗೆ ಇಳಿಸುತ್ತದೆ. Edges ನಲ್ಲಿ add/remove ಮಾಡಿ update.",
        whenToUse: ["Longest/shortest substring", "Max sum size k", "Anagram/permutation match", "Minimum window substring"],
        patternDetection: [
          "🔍 'Sum of k consecutive...' → fixed window",
          "🔍 'Longest with at most...' → dynamic window",
          "🔍 'Find anagram...' → fixed + freq count",
          "🔍 'Minimum window...' → dynamic + hashmap",
        ],
        visualExplanation:
          "Train window 🚂 ಹೀಗೇ — ಒಂದು ಭಾಗ ಮಾತ್ರ ಕಾಣುತ್ತದೆ; train ಮುಂದುವರಿದಂತೆ ಹೊಸದು ಬರುತ್ತದೆ, ಹಳೆಯದು ಹೋಗುತ್ತದೆ.",
      },
      telugu: {
        title: "Sliding Window Pattern",
        whatIsIt:
          "Window (subarray/substring) ని maintain చేసి data పై slide చేయడం. Fixed-size లేదా dynamic (expand/shrink).",
        whyUseIt:
          "O(n²)/O(n³) brute force ని O(n) కి తగ్గిస్తుంది. Edges వద్ద add/remove చేసి update.",
        whenToUse: ["Longest/shortest substring", "Max sum size k", "Anagram/permutation match", "Minimum window substring"],
        patternDetection: [
          "🔍 'Sum of k consecutive...' → fixed window",
          "🔍 'Longest with at most...' → dynamic window",
          "🔍 'Find anagram...' → fixed + freq count",
          "🔍 'Minimum window...' → dynamic + hashmap",
        ],
        visualExplanation:
          "Train window 🚂 లా — ఒక్క భాగమే కనిపిస్తుంది; train ముందుకు పోతే కొత్తది వస్తుంది, పాతది వెళ్తుంది.",
      },
      hindi: {
        title: "Sliding Window Pattern",
        whatIsIt:
          "Window (subarray/substring) maintain करके data पर slide करना। Fixed-size या dynamic (expand/shrink) हो सकता है।",
        whyUseIt:
          "O(n²)/O(n³) brute force को O(n) बनाता है। Edges पर add/remove करके update करते हैं।",
        whenToUse: ["Longest/shortest substring", "Max sum size k", "Anagram/permutation match", "Minimum window substring"],
        patternDetection: [
          "🔍 'Sum of k consecutive...' → fixed window",
          "🔍 'Longest with at most...' → dynamic window",
          "🔍 'Find anagram...' → fixed + freq count",
          "🔍 'Minimum window...' → dynamic + hashmap",
        ],
        visualExplanation:
          "Train window 🚂 जैसा — एक time पर landscape का छोटा हिस्सा दिखता है; आगे बढ़ते ही नया आता है, पुराना चला जाता है।",
      },
    },
  },
  {
    id: "binary-search-pattern", title: "Binary Search Pattern", emoji: "🔍", category: "patterns", difficulty: "Medium",
    whatIsIt: "A divide-and-conquer technique that halves the search space each step. Works on sorted data or any monotonic function. Incredibly powerful — O(log n).",
    whyUseIt: "Searching through 1 billion sorted elements takes only ~30 steps instead of 1 billion. The most efficient search algorithm for sorted data.",
    whenToUse: ["Searching in sorted arrays", "Finding boundaries (first/last occurrence)", "Minimizing/maximizing with monotonic function", "Square root, peak finding"],
    patternDetection: ["🔍 'Find target in sorted...' → Classic binary search", "🔍 'First/last position of...' → Binary search with boundary", "🔍 'Minimum speed/capacity to...' → Binary search on answer", "🔍 'Peak element in...' → Modified binary search"],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1) iterative | O(log n) recursive",
    codeExample: `def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target: return mid
        elif nums[mid] < target: left = mid + 1
        else: right = mid - 1
    return -1

def find_first(nums, target):
    left, right = 0, len(nums) - 1
    result = -1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            result = mid
            right = mid - 1
        elif nums[mid] < target: left = mid + 1
        else: right = mid - 1
    return result`,
    realWorldUse: "Database indexes, searching sorted files, version control bisect, game AI decision trees",
    visualExplanation: "Like the guessing game 🎯 — 'I'm thinking of a number 1-100'. If you guess 50 and I say 'higher', you've eliminated half the possibilities in one step!",
    translations: {
      tamil: {
        title: "Binary Search Pattern",
        whatIsIt: "Search space-ஐ ஒவ்வொரு step-லும் பாதியாக குறைக்கும் divide-and-conquer technique. Sorted data அல்லது monotonic function-க்கு பயன்படும்.",
        whyUseIt: "1 billion sorted elements-ல் ~30 steps போதும். Sorted data-க்கு மிக திறமையான search (O(log n)).",
        whenToUse: ["Sorted arrays search", "Boundaries (first/last occurrence)", "Binary search on answer (monotonic)", "Sqrt/peak finding"],
        patternDetection: [
          "🔍 'Target in sorted...' → classic binary search",
          "🔍 'First/last position...' → boundary binary search",
          "🔍 'Minimum capacity/speed...' → binary search on answer",
          "🔍 'Peak element...' → modified binary search",
        ],
        visualExplanation:
          "Guessing game 🎯 போல — 1-100 எண்ணில் 50 என்று guess செய்தால் பாதி possibilities உடனே நீங்கும்.",
      },
      kannada: {
        title: "Binary Search Pattern",
        whatIsIt: "ಪ್ರತಿ step ನಲ್ಲಿ search space ಅನ್ನು ಅರ್ಧ ಮಾಡಿ ಕಡಿಮೆ ಮಾಡುವ divide-and-conquer technique. Sorted data ಅಥವಾ monotonic function ಗೆ ಸೂಕ್ತ.",
        whyUseIt: "1 billion sorted elements ನಲ್ಲಿ ~30 steps ಸಾಕು. O(log n) ಪರಿಣಾಮಕಾರಿ search.",
        whenToUse: ["Sorted arrays search", "Boundaries (first/last)", "Binary search on answer", "Sqrt/peak finding"],
        patternDetection: [
          "🔍 'Target in sorted...' → classic binary search",
          "🔍 'First/last position...' → boundary binary search",
          "🔍 'Minimum capacity/speed...' → answer binary search",
          "🔍 'Peak element...' → modified binary search",
        ],
        visualExplanation:
          "Guessing game 🎯 — 1-100 ನಲ್ಲಿ 50 ಊಹಿಸಿದರೆ ಅರ್ಧ possibilities ಒಂದೇ ಬಾರಿ ಕಡಿಮೆಯಾಗುತ್ತವೆ.",
      },
      telugu: {
        title: "Binary Search Pattern",
        whatIsIt: "ప్రతి step లో search space ని half చేసే divide-and-conquer technique. Sorted data లేదా monotonic function కి ఉపయోగపడుతుంది.",
        whyUseIt: "1 billion sorted elements లో ~30 steps చాలు. O(log n) efficient search.",
        whenToUse: ["Sorted arrays search", "Boundaries (first/last)", "Binary search on answer", "Sqrt/peak finding"],
        patternDetection: [
          "🔍 'Target in sorted...' → classic binary search",
          "🔍 'First/last position...' → boundary binary search",
          "🔍 'Minimum capacity/speed...' → answer binary search",
          "🔍 'Peak element...' → modified binary search",
        ],
        visualExplanation:
          "Guessing game 🎯 లా — 1-100 లో 50 guess చేస్తే half possibilities తొలగిపోతాయి.",
      },
      hindi: {
        title: "Binary Search Pattern",
        whatIsIt: "Divide-and-conquer technique जो हर step में search space आधा कर देता है। Sorted data या monotonic function पर काम करता है।",
        whyUseIt: "1 billion sorted elements में ~30 steps। O(log n) सबसे efficient search।",
        whenToUse: ["Sorted arrays search", "Boundaries (first/last)", "Binary search on answer", "Sqrt/peak finding"],
        patternDetection: [
          "🔍 'Target in sorted...' → classic binary search",
          "🔍 'First/last position...' → boundary binary search",
          "🔍 'Minimum capacity/speed...' → answer binary search",
          "🔍 'Peak element...' → modified binary search",
        ],
        visualExplanation:
          "Guessing game 🎯 जैसा — 1-100 में 50 guess करो, तो आधी possibilities एक step में खत्म।",
      },
    },
  },
  {
    id: "greedy", title: "Greedy Algorithms", emoji: "🤑", category: "patterns", difficulty: "Medium",
    whatIsIt: "A greedy algorithm makes the locally optimal choice at each step, hoping it leads to a globally optimal solution. It never reconsiders choices once made.",
    whyUseIt: "Simple, fast, and effective when the problem has the greedy-choice property. Often O(n log n) due to sorting, with O(1) extra space.",
    whenToUse: ["Activity/interval scheduling", "Minimum coins for change (specific denominations)", "Huffman coding", "Fractional knapsack"],
    patternDetection: ["🔍 'Maximum number of non-overlapping...' → Sort by end time, greedy pick", "🔍 'Minimum platforms/rooms...' → Sort events, track overlaps", "🔍 'Assign tasks to minimize...' → Sort and pair optimally", "🔍 'Jump game / reach end...' → Track farthest reachable"],
    timeComplexity: "O(n log n) typically (due to sorting) | O(n) for traversal",
    spaceComplexity: "O(1) to O(n)",
    codeExample: `# Activity Selection
def max_activities(starts, ends):
    activities = sorted(zip(starts, ends), key=lambda x: x[1])
    count = 1
    last_end = activities[0][1]
    for start, end in activities[1:]:
        if start >= last_end:
            count += 1
            last_end = end
    return count

# Jump Game
def can_jump(nums):
    farthest = 0
    for i, jump in enumerate(nums):
        if i > farthest: return False
        farthest = max(farthest, i + jump)
    return True`,
    realWorldUse: "Job scheduling, network routing, file compression (Huffman), coin vending machines",
    visualExplanation: "Like eating at a buffet 🍽️ — at each station, take the best-looking dish. You don't go back and swap. Sometimes this gets you the best meal, sometimes not!",
    translations: {
      tamil: {
        title: "Greedy Algorithms",
        whatIsIt:
          "ஒவ்வொரு step-லும் locally best choice எடுத்து globally best கிடைக்கும் என்று நம்பும் algorithm. முடிவு செய்த பிறகு திரும்ப மாற்றாது.",
        whyUseIt:
          "சரளமானது, வேகமானது. Greedy-choice property உள்ள problems-ல் சிறப்பாக வேலை செய்கிறது. பெரும்பாலும் sort காரணமாக O(n log n).",
        whenToUse: ["Interval scheduling", "Coin change (specific denominations)", "Huffman coding", "Fractional knapsack"],
        patternDetection: [
          "🔍 'Max non-overlapping...' → end time sort + greedy pick",
          "🔍 'Min rooms/platforms...' → sort events + track overlaps",
          "🔍 'Assign tasks...' → sort + pair",
          "🔍 'Jump game...' → farthest reachable track",
        ],
        visualExplanation:
          "Buffet 🍽️ போல — ஒவ்வொரு நிலையிலும் best dish எடுப்போம்; திரும்ப போய் swap செய்ய மாட்டோம்.",
      },
      kannada: {
        title: "Greedy Algorithms",
        whatIsIt:
          "ಪ್ರತಿ step ನಲ್ಲಿ locally best ಆಯ್ಕೆ ಮಾಡಿ global optimum ಸಿಗುತ್ತದೆ ಎಂದು ಭಾವಿಸುವ algorithm. ಆಯ್ಕೆಯನ್ನು ಮರುಪರಿಶೀಲಿಸದು.",
        whyUseIt:
          "ಸರಳ ಮತ್ತು ವೇಗವಾದುದು. Greedy-choice property ಇದ್ದರೆ ಪರಿಣಾಮಕಾರಿ. ಬಹುಸಾ sorting ಕಾರಣ O(n log n).",
        whenToUse: ["Interval scheduling", "Coin change", "Huffman coding", "Fractional knapsack"],
        patternDetection: [
          "🔍 'Max non-overlapping...' → end time sort + greedy pick",
          "🔍 'Min rooms/platforms...' → sort events + overlaps",
          "🔍 'Assign tasks...' → sort + pair",
          "🔍 'Jump game...' → farthest reachable",
        ],
        visualExplanation:
          "Buffet 🍽️ — ಪ್ರತಿ station ನಲ್ಲಿ best dish ತೆಗೆದು, ಹಿಂದಿರುಗಿ swap ಮಾಡುವುದಿಲ್ಲ.",
      },
      telugu: {
        title: "Greedy Algorithms",
        whatIsIt:
          "ప్రతి step లో locally best choice తీసుకుని global best వస్తుందని ఆశించే algorithm. ఒకసారి నిర్ణయం తీసుకున్నాక మార్చదు.",
        whyUseIt:
          "సింపుల్, ఫాస్ట్. Greedy-choice property ఉన్న problems లో బాగా పనిచేస్తుంది. సాధారణంగా sorting వల్ల O(n log n).",
        whenToUse: ["Interval scheduling", "Coin change", "Huffman coding", "Fractional knapsack"],
        patternDetection: [
          "🔍 'Max non-overlapping...' → end time sort + greedy pick",
          "🔍 'Min rooms/platforms...' → sort events + overlaps",
          "🔍 'Assign tasks...' → sort + pair",
          "🔍 'Jump game...' → farthest reachable",
        ],
        visualExplanation:
          "Buffet 🍽️ లా — ప్రతి station లో best dish తీసుకుంటారు; తిరిగి swap చేయరు.",
      },
      hindi: {
        title: "Greedy Algorithms",
        whatIsIt:
          "हर step पर locally best choice लेकर global optimum पाने की कोशिश करने वाला algorithm। एक बार choice हो गई तो वापस नहीं बदलता।",
        whyUseIt:
          "Simple और fast। Greedy-choice property वाले problems में effective। अक्सर sorting के कारण O(n log n)।",
        whenToUse: ["Interval scheduling", "Coin change", "Huffman coding", "Fractional knapsack"],
        patternDetection: [
          "🔍 'Max non-overlapping...' → end time sort + greedy pick",
          "🔍 'Min rooms/platforms...' → sort events + overlaps",
          "🔍 'Assign tasks...' → sort + pair",
          "🔍 'Jump game...' → farthest reachable",
        ],
        visualExplanation:
          "Buffet 🍽️ जैसा — हर station पर best dish ले लो; वापस जाकर swap नहीं करते।",
      },
    },
  },
  {
    id: "prefix-sum", title: "Prefix Sum Pattern", emoji: "📊", category: "patterns", difficulty: "Easy",
    whatIsIt: "Pre-compute cumulative sums so any range sum query becomes O(1). Build a prefix array where prefix[i] = sum of elements from index 0 to i.",
    whyUseIt: "Transforms O(n) range sum queries into O(1) after O(n) preprocessing. Essential for subarray sum problems.",
    whenToUse: ["Range sum queries", "Subarray sum equals K", "Count subarrays with given sum", "2D matrix region sums"],
    patternDetection: ["🔍 'Sum of subarray from i to j...' → Prefix sum difference", "🔍 'Number of subarrays with sum K...' → Prefix sum + hash map", "🔍 'Equilibrium index...' → Prefix sum from both sides", "🔍 'Running average...' → Cumulative sum / count"],
    timeComplexity: "Build: O(n) | Query: O(1)",
    spaceComplexity: "O(n)",
    codeExample: `# Build prefix sum
def build_prefix(nums):
    prefix = [0] * (len(nums) + 1)
    for i in range(len(nums)):
        prefix[i + 1] = prefix[i] + nums[i]
    return prefix

# Range sum query
def range_sum(prefix, left, right):
    return prefix[right + 1] - prefix[left]

# Subarray sum equals K
def subarray_sum_k(nums, k):
    count = 0
    prefix_sum = 0
    seen = {0: 1}
    for num in nums:
        prefix_sum += num
        if prefix_sum - k in seen:
            count += seen[prefix_sum - k]
        seen[prefix_sum] = seen.get(prefix_sum, 0) + 1
    return count`,
    realWorldUse: "Financial running totals, image processing (integral images), database aggregations",
    visualExplanation: "Like a running total on a receipt 🧾 — instead of re-adding items each time, you just look at the subtotal at any point and subtract where you started.",
    translations: {
      tamil: {
        title: "Prefix Sum Pattern",
        whatIsIt:
          "Cumulative sums முன்னதாக கணக்கிட்டு வைத்தால் range sum query O(1) ஆகும். `prefix[i] = sum(0..i)` போல.",
        whyUseIt:
          "O(n) range sum queries-ஐ O(1) ஆக மாற்றும் (O(n) preprocessing பிறகு). Subarray sum problems-க்கு முக்கியம்.",
        whenToUse: ["Range sum queries", "Subarray sum = K", "Count subarrays with sum", "2D region sums"],
        patternDetection: [
          "🔍 'Sum i..j...' → prefix difference",
          "🔍 'Count subarrays sum K...' → prefix + hashmap",
          "🔍 'Equilibrium index...' → prefix both sides",
          "🔍 'Running average...' → cumulative/ count",
        ],
        visualExplanation:
          "Receipt 🧾-ல் running total போல — மீண்டும் மீண்டும் சேர்க்காமல் subtotal-ஐ பார்த்து கழித்தால் போதும்.",
      },
      kannada: {
        title: "Prefix Sum Pattern",
        whatIsIt:
          "Cumulative sums ಮೊದಲು compute ಮಾಡಿದರೆ range sum query O(1). `prefix[i]=sum(0..i)`.",
        whyUseIt:
          "O(n) range sum queries ಅನ್ನು O(1) ಮಾಡುತ್ತದೆ (O(n) preprocessing ನಂತರ). Subarray sum problems ಗೆ ಮುಖ್ಯ.",
        whenToUse: ["Range sum queries", "Subarray sum = K", "Count subarrays", "2D region sums"],
        patternDetection: [
          "🔍 'Sum i..j...' → prefix difference",
          "🔍 'Count subarrays sum K...' → prefix + hashmap",
          "🔍 'Equilibrium index...' → prefix both sides",
          "🔍 'Running average...' → cumulative/count",
        ],
        visualExplanation:
          "Receipt 🧾 ನಲ್ಲಿ running total — ಮತ್ತೆ ಸೇರಿಸದೆ subtotal ನೋಡಿ subtract ಮಾಡಬಹುದು.",
      },
      telugu: {
        title: "Prefix Sum Pattern",
        whatIsIt:
          "Cumulative sums ముందే compute చేస్తే range sum query O(1). `prefix[i]=sum(0..i)`.",
        whyUseIt:
          "O(n) range sum queries ని O(1) చేస్తుంది (O(n) preprocessing తర్వాత). Subarray sum problems కు కీలకం.",
        whenToUse: ["Range sum queries", "Subarray sum = K", "Count subarrays", "2D region sums"],
        patternDetection: [
          "🔍 'Sum i..j...' → prefix difference",
          "🔍 'Count subarrays sum K...' → prefix + hashmap",
          "🔍 'Equilibrium index...' → prefix both sides",
          "🔍 'Running average...' → cumulative/count",
        ],
        visualExplanation:
          "Receipt 🧾 లో running total లా — మళ్లీ మళ్లీ add చేయకుండా subtotal చూసి subtract చేస్తారు.",
      },
      hindi: {
        title: "Prefix Sum Pattern",
        whatIsIt:
          "Cumulative sums पहले compute कर लो तो range sum query O(1) हो जाती है। `prefix[i]=sum(0..i)`।",
        whyUseIt:
          "O(n) range sum queries को O(1) बनाता है (O(n) preprocessing के बाद)। Subarray sum problems के लिए जरूरी।",
        whenToUse: ["Range sum queries", "Subarray sum = K", "Count subarrays", "2D region sums"],
        patternDetection: [
          "🔍 'Sum i..j...' → prefix difference",
          "🔍 'Count subarrays sum K...' → prefix + hashmap",
          "🔍 'Equilibrium index...' → prefix both sides",
          "🔍 'Running average...' → cumulative/count",
        ],
        visualExplanation:
          "Receipt 🧾 के running total जैसा — बार-बार जोड़ने की जगह subtotal देखकर subtract कर लो।",
      },
    },
  },
  // ADVANCED
  {
    id: "recursion-backtracking", title: "Recursion & Backtracking", emoji: "🔄", category: "advanced", difficulty: "Hard",
    whatIsIt: "Recursion is a function calling itself with a smaller problem. Backtracking is recursion + undo — explore a choice, and if it doesn't work, undo and try another.",
    whyUseIt: "Essential for problems with multiple choices at each step: permutations, combinations, puzzles, constraint satisfaction.",
    whenToUse: ["Generate all permutations/combinations", "Solve puzzles (Sudoku, N-Queens)", "Tree/graph traversal (DFS)", "All paths / all solutions problems"],
    patternDetection: ["🔍 'Generate all possible...' → Backtracking", "🔍 'Find all paths...' → DFS with backtracking", "🔍 'Can you partition into...' → Backtracking with pruning", "🔍 'Solve this puzzle...' → Constraint-based backtracking"],
    timeComplexity: "Varies — often O(n!) or O(2^n) for combinatorial",
    spaceComplexity: "O(n) recursion stack depth",
    codeExample: `def subsets(nums):
    result = []
    def backtrack(start, current):
        result.append(current[:])
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()  # UNDO ← key step!
    backtrack(0, [])
    return result

def solve_n_queens(n):
    solutions = []
    def backtrack(row, cols, diag1, diag2, board):
        if row == n:
            solutions.append(["".join(r) for r in board])
            return
        for col in range(n):
            if col in cols or (row-col) in diag1 or (row+col) in diag2:
                continue
            board[row][col] = 'Q'
            backtrack(row+1, cols|{col}, diag1|{row-col}, diag2|{row+col}, board)
            board[row][col] = '.'
    backtrack(0, set(), set(), set(), [['.']*n for _ in range(n)])
    return solutions`,
    realWorldUse: "AI game solving, compiler parsing, route planning, scheduling algorithms",
    visualExplanation: "Like exploring a maze 🏰 — at each fork, pick a path. If you hit a dead end, backtrack to the last fork and try a different path.",
    translations: {
      tamil: {
        title: "Recursion & Backtracking",
        whatIsIt:
          "Recursion என்பது function தன்னைத் தான் அழைப்பது. Backtracking என்பது recursion + undo — ஒரு தேர்வை முயன்று, வேலை செய்யவில்லை என்றால் திரும்பி வேறு தேர்வு முயலுவது.",
        whyUseIt:
          "Multiple choices உள்ள problems-க்கு அவசியம்: permutations, combinations, puzzles, constraint satisfaction.",
        whenToUse: ["Permutations/combinations generate", "Sudoku/N-Queens போன்ற puzzles", "Tree/graph DFS traversal", "All paths / all solutions"],
        patternDetection: [
          "🔍 'Generate all possible...' → backtracking",
          "🔍 'Find all paths...' → DFS + backtracking",
          "🔍 'Partition...' → backtracking + pruning",
          "🔍 'Solve puzzle...' → constraint backtracking",
        ],
        visualExplanation:
          "Maze 🏰 explore செய்வது போல — fork-ல் ஒரு பாதை தேர்வு; dead end என்றால் கடைசி fork-க்கு திரும்பி வேறு பாதை.",
      },
      kannada: {
        title: "Recursion & Backtracking",
        whatIsIt:
          "Recursion ಎಂದರೆ function ತನ್ನನ್ನೇ ಕರೆಯುವುದು. Backtracking ಎಂದರೆ recursion + undo — ಆಯ್ಕೆ ಮಾಡಿ, ಕೆಲಸ ಆಗದಿದ್ದರೆ undo ಮಾಡಿ ಮತ್ತೊಂದು ಆಯ್ಕೆ.",
        whyUseIt:
          "Multiple choices ಇರುವ problems ಗೆ ಅಗತ್ಯ: permutations, combinations, puzzles, constraints.",
        whenToUse: ["Permutations/combinations", "Sudoku/N-Queens", "Tree/graph DFS", "All paths / all solutions"],
        patternDetection: [
          "🔍 'Generate all possible...' → backtracking",
          "🔍 'Find all paths...' → DFS + backtracking",
          "🔍 'Partition...' → backtracking + pruning",
          "🔍 'Solve puzzle...' → constraint backtracking",
        ],
        visualExplanation:
          "Maze 🏰 ನಲ್ಲಿ ನಡೆಯುವಂತೆ — fork ನಲ್ಲಿ ಒಂದು ದಾರಿ; dead end ಆದರೆ ಹಿಂದಿರುಗಿ ಇನ್ನೊಂದು ದಾರಿ.",
      },
      telugu: {
        title: "Recursion & Backtracking",
        whatIsIt:
          "Recursion అంటే function తనను తానే call చేసుకోవడం. Backtracking అంటే recursion + undo — ఒక choice try చేసి, పని కాకపోతే undo చేసి ఇంకొక choice try చేయడం.",
        whyUseIt:
          "Multiple choices ఉన్న problems కి అవసరం: permutations, combinations, puzzles, constraints.",
        whenToUse: ["Permutations/combinations", "Sudoku/N-Queens", "Tree/graph DFS", "All paths / all solutions"],
        patternDetection: [
          "🔍 'Generate all possible...' → backtracking",
          "🔍 'Find all paths...' → DFS + backtracking",
          "🔍 'Partition...' → backtracking + pruning",
          "🔍 'Solve puzzle...' → constraint backtracking",
        ],
        visualExplanation:
          "Maze 🏰 లో explore చేసేలా — fork వద్ద ఒక దారి; dead end అయితే తిరిగి వచ్చి ఇంకో దారి.",
      },
      hindi: {
        title: "Recursion & Backtracking",
        whatIsIt:
          "Recursion में function खुद को call करता है। Backtracking = recursion + undo — एक choice try करो, नहीं चले तो undo करके दूसरा try करो।",
        whyUseIt:
          "Multiple choices वाले problems के लिए जरूरी: permutations, combinations, puzzles, constraints.",
        whenToUse: ["Permutations/combinations", "Sudoku/N-Queens", "Tree/graph DFS", "All paths / all solutions"],
        patternDetection: [
          "🔍 'Generate all possible...' → backtracking",
          "🔍 'Find all paths...' → DFS + backtracking",
          "🔍 'Partition...' → backtracking + pruning",
          "🔍 'Solve puzzle...' → constraint backtracking",
        ],
        visualExplanation:
          "Maze 🏰 explore करने जैसा — fork पर एक path, dead end हो तो वापस और दूसरा path।",
      },
    },
  },
  {
    id: "dynamic-programming", title: "Dynamic Programming", emoji: "🧮", category: "advanced", difficulty: "Hard",
    whatIsIt: "DP is solving complex problems by breaking them into overlapping subproblems and storing results to avoid recalculating. It's recursion + memoization optimized into iteration.",
    whyUseIt: "Transforms exponential time complexity (O(2^n)) into polynomial (O(n²) or O(n)). The most powerful technique for optimization problems.",
    whenToUse: ["Optimal substructure: solution depends on optimal sub-solutions", "Overlapping subproblems: same subproblems solved repeatedly", "Counting problems: 'how many ways to...'", "Min/max problems: 'minimum cost to...'"],
    patternDetection: ["🔍 'Minimum/maximum cost to...' → DP with state transitions", "🔍 'How many ways to...' → Counting DP", "🔍 'Longest increasing/common...' → Sequence DP", "🔍 'Can you reach/achieve...' → Boolean DP"],
    timeComplexity: "Usually O(n²) or O(n × m) — depends on state space",
    spaceComplexity: "O(n) to O(n × m) — can often optimize to O(n)",
    codeExample: `def fib(n):
    if n <= 1: return n
    dp = [0, 1]
    for i in range(2, n + 1):
        dp.append(dp[-1] + dp[-2])
    return dp[n]

def climb_stairs(n):
    if n <= 2: return n
    prev2, prev1 = 1, 2
    for _ in range(3, n + 1):
        prev2, prev1 = prev1, prev2 + prev1
    return prev1

def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            dp[i][w] = dp[i-1][w]
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w], dp[i-1][w-weights[i-1]] + values[i-1])
    return dp[n][capacity]`,
    realWorldUse: "Route optimization (GPS), resource allocation, text diffing (git), speech recognition",
    visualExplanation: "Like building with LEGO blocks 🧱 — you solve tiny problems first, save the results, then combine them to solve bigger problems. Each block is built exactly once!",
    translations: {
      tamil: {
        title: "Dynamic Programming (DP)",
        whatIsIt:
          "DP என்பது overlapping subproblems-ஆக பிரித்து, results-ஐ சேமித்து மீண்டும் கணக்கிடாமல் தீர்ப்பது. Recursion + memoization-ஐ iteration-ஆக optimize செய்தது.",
        whyUseIt:
          "Exponential (O(2^n)) ஐ polynomial (O(n²)/O(n)) ஆக மாற்ற முடியும். Optimization problems-க்கு சக்திவாய்ந்த technique.",
        whenToUse: ["Optimal substructure", "Overlapping subproblems", "Counting: 'how many ways'", "Min/Max: 'minimum cost'"],
        patternDetection: [
          "🔍 'Minimum/maximum cost...' → DP state transitions",
          "🔍 'How many ways...' → counting DP",
          "🔍 'Longest increasing/common...' → sequence DP",
          "🔍 'Can you reach/achieve...' → boolean DP",
        ],
        visualExplanation:
          "LEGO 🧱 போல — சிறிய blocks முதலில்; முடிவுகளை சேமித்து பெரிய problem-க்கு இணைக்கவும். ஒவ்வொரு block ஒரே முறை கட்டப்படும்.",
      },
      kannada: {
        title: "Dynamic Programming (DP)",
        whatIsIt:
          "DP ಎಂದರೆ overlapping subproblems ಗೆ ವಿಭಜಿಸಿ, results store ಮಾಡಿ ಮರು ಲೆಕ್ಕ ಹಾಕದಂತೆ ಪರಿಹರಿಸುವುದು. Recursion+memo → iteration optimization.",
        whyUseIt:
          "Exponential (O(2^n)) ಅನ್ನು polynomial (O(n²)/O(n)) ಗೆ ಇಳಿಸುತ್ತದೆ. Optimization problems ಗೆ ಶಕ್ತಿಶಾಲಿ.",
        whenToUse: ["Optimal substructure", "Overlapping subproblems", "Counting problems", "Min/Max cost problems"],
        patternDetection: [
          "🔍 'Minimum/maximum cost...' → DP transitions",
          "🔍 'How many ways...' → counting DP",
          "🔍 'Longest increasing/common...' → sequence DP",
          "🔍 'Can you reach/achieve...' → boolean DP",
        ],
        visualExplanation:
          "LEGO 🧱 — ಸಣ್ಣ blocks ಮೊದಲು, results ಉಳಿಸಿ, ದೊಡ್ಡ problem ಗೆ ಸೇರಿಸಿ. ಪ್ರತಿ block ಒಂದೇ ಬಾರಿ.",
      },
      telugu: {
        title: "Dynamic Programming (DP)",
        whatIsIt:
          "DP అంటే overlapping subproblems గా విడదీసి, results నిల్వ చేసి మళ్లీ లెక్కించకుండా solve చేయడం. Recursion+memo ని iteration గా optimize చేయడం.",
        whyUseIt:
          "Exponential (O(2^n)) ని polynomial (O(n²)/O(n)) కి మార్చగలదు. Optimization problems కి powerful.",
        whenToUse: ["Optimal substructure", "Overlapping subproblems", "Counting problems", "Min/Max cost problems"],
        patternDetection: [
          "🔍 'Minimum/maximum cost...' → DP transitions",
          "🔍 'How many ways...' → counting DP",
          "🔍 'Longest increasing/common...' → sequence DP",
          "🔍 'Can you reach/achieve...' → boolean DP",
        ],
        visualExplanation:
          "LEGO 🧱 లా — చిన్న problems ముందుగా, results save చేసి పెద్ద problem కి కలపండి. ప్రతి block ఒక్కసారి.",
      },
      hindi: {
        title: "Dynamic Programming (DP)",
        whatIsIt:
          "DP में problem को overlapping subproblems में तोड़कर results store करते हैं ताकि बार-बार calculate न करना पड़े। Recursion+memo को iteration में optimize किया जाता है।",
        whyUseIt:
          "Exponential (O(2^n)) को polynomial (O(n²)/O(n)) बना देता है। Optimization problems के लिए बहुत powerful।",
        whenToUse: ["Optimal substructure", "Overlapping subproblems", "Counting problems", "Min/Max cost problems"],
        patternDetection: [
          "🔍 'Minimum/maximum cost...' → DP transitions",
          "🔍 'How many ways...' → counting DP",
          "🔍 'Longest increasing/common...' → sequence DP",
          "🔍 'Can you reach/achieve...' → boolean DP",
        ],
        visualExplanation:
          "LEGO 🧱 जैसा — पहले छोटे blocks, results save करो, फिर बड़े problem में जोड़ो। हर block सिर्फ एक बार बनता है।",
      },
    },
  },
  {
    id: "trees-graphs", title: "Trees & Graphs", emoji: "🌳", category: "advanced", difficulty: "Hard",
    whatIsIt: "Trees are hierarchical structures with a root and children (no cycles). Graphs are networks of nodes connected by edges (can have cycles).",
    whyUseIt: "Model real-world relationships: file systems (tree), social networks (graph), road maps (graph), HTML DOM (tree).",
    whenToUse: ["Hierarchical data: file systems, org charts", "Network problems: shortest path, connectivity", "Search and traversal: BFS, DFS", "Decision trees, parsing expressions"],
    patternDetection: ["🔍 'Shortest path in unweighted...' → BFS", "🔍 'Explore all paths...' → DFS", "🔍 'Level-order traversal...' → BFS with queue", "🔍 'Lowest common ancestor...' → DFS on tree"],
    timeComplexity: "BFS/DFS: O(V + E) | V = vertices, E = edges",
    spaceComplexity: "O(V) for visited set + queue/stack",
    codeExample: `from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def bfs(root):
    if not root: return []
    result, queue = [], deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result

def shortest_path(graph, start, end):
    queue = deque([(start, [start])])
    visited = {start}
    while queue:
        node, path = queue.popleft()
        if node == end: return path
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))`,
    realWorldUse: "Google Maps (shortest path), social media (friend suggestions), file systems, AI decision trees",
    visualExplanation: "A tree 🌳 is like a family tree — one ancestor at top, branching down. A graph 🕸️ is like a social network — everyone can connect to anyone.",
    translations: {
      tamil: {
        title: "Trees & Graphs",
        whatIsIt:
          "Tree என்பது hierarchy structure (root + children, cycles இல்லை). Graph என்பது nodes + edges network (cycles இருக்கலாம்).",
        whyUseIt:
          "Real-world relationships model செய்ய: file system (tree), social network (graph), road map (graph), DOM (tree).",
        whenToUse: ["Hierarchy data", "Shortest path/connectivity", "BFS/DFS traversal", "Decision trees/parsing"],
        patternDetection: [
          "🔍 'Shortest path unweighted...' → BFS",
          "🔍 'Explore all paths...' → DFS",
          "🔍 'Level-order...' → BFS queue",
          "🔍 'LCA...' → DFS on tree",
        ],
        visualExplanation:
          "Tree 🌳 குடும்ப மரம் போல; Graph 🕸️ சமூக வலை போல — யார் வேண்டுமானாலும் connect ஆகலாம்.",
      },
      kannada: {
        title: "Trees & Graphs",
        whatIsIt:
          "Tree hierarchy structure (root + children, cycles ಇಲ್ಲ). Graph nodes+edges network (cycles ಇರಬಹುದು).",
        whyUseIt:
          "Real-world relationships model: file system (tree), social network (graph), road map (graph), DOM (tree).",
        whenToUse: ["Hierarchy data", "Shortest path/connectivity", "BFS/DFS traversal", "Decision trees/parsing"],
        patternDetection: [
          "🔍 'Shortest path unweighted...' → BFS",
          "🔍 'Explore all paths...' → DFS",
          "🔍 'Level-order...' → BFS queue",
          "🔍 'LCA...' → DFS on tree",
        ],
        visualExplanation:
          "Tree 🌳 ಕುಟುಂಬ ಮರದಂತೆ; Graph 🕸️ ಸಾಮಾಜಿಕ ಜಾಲದಂತೆ — ಎಲ್ಲರೂ ಎಲ್ಲರಿಗೂ connect ಆಗಬಹುದು.",
      },
      telugu: {
        title: "Trees & Graphs",
        whatIsIt:
          "Tree అనేది hierarchy structure (root + children, cycles లేవు). Graph అనేది nodes+edges network (cycles ఉండొచ్చు).",
        whyUseIt:
          "Real-world relationships model: file system (tree), social network (graph), road map (graph), DOM (tree).",
        whenToUse: ["Hierarchy data", "Shortest path/connectivity", "BFS/DFS traversal", "Decision trees/parsing"],
        patternDetection: [
          "🔍 'Shortest path unweighted...' → BFS",
          "🔍 'Explore all paths...' → DFS",
          "🔍 'Level-order...' → BFS queue",
          "🔍 'LCA...' → DFS on tree",
        ],
        visualExplanation:
          "Tree 🌳 కుటుంబ వృక్షం లా; Graph 🕸️ social network లా — ఎవరైనా ఎవరితోనైనా connect కావచ్చు.",
      },
      hindi: {
        title: "Trees & Graphs",
        whatIsIt:
          "Tree hierarchy structure है (root + children, cycles नहीं)। Graph nodes+edges का network है (cycles हो सकते हैं)।",
        whyUseIt:
          "Real-world relationships model करने के लिए: file system (tree), social network (graph), road map (graph), DOM (tree).",
        whenToUse: ["Hierarchy data", "Shortest path/connectivity", "BFS/DFS traversal", "Decision trees/parsing"],
        patternDetection: [
          "🔍 'Shortest path unweighted...' → BFS",
          "🔍 'Explore all paths...' → DFS",
          "🔍 'Level-order...' → BFS queue",
          "🔍 'LCA...' → DFS on tree",
        ],
        visualExplanation:
          "Tree 🌳 family tree जैसा; Graph 🕸️ social network जैसा — कोई भी किसी से connect हो सकता है।",
      },
    },
  },
  {
    id: "trie", title: "Trie (Prefix Tree)", emoji: "🌲", category: "advanced", difficulty: "Medium",
    whatIsIt: "A specialized tree used to store strings. Each node represents a single character.",
    whyUseIt: "Extremely fast O(L) time for prefix searches and autocomplete, where L is the length of the word.",
    whenToUse: ["Autocomplete systems", "Spell checkers", "Word search games", "IP routing"],
    patternDetection: ["🔍 'Find all words starting with...' → Trie", "🔍 'Maximum XOR of two numbers...' → Bitwise Trie", "🔍 'Word search board...' → Trie + DFS"],
    timeComplexity: "Insert/Search: O(L) where L is word length",
    spaceComplexity: "O(N * M) where N is number of words, M is max length",
    codeExample: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_word = True

    def search(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_word`,
    realWorldUse: "Search engine autocomplete, router IP prefix matching, spell checkers, phone book contacts",
    visualExplanation: "Imagine a filing cabinet sorted by the first letter, then folders by the second letter, then files by the third. You only open what exactly matches your prefix!",
    translations: {
      tamil: {
        title: "Trie (Prefix Tree)",
        whatIsIt: "Strings சேமிக்க சிறப்பு tree. ஒவ்வொரு node ஒரு character-ஐ குறிக்கும்.",
        whyUseIt: "Prefix search/autocomplete O(L) — word length L. மிகவும் வேகம்.",
        whenToUse: ["Autocomplete", "Spell check", "Word search games", "IP routing"],
        patternDetection: [
          "🔍 'Words starting with prefix...' → Trie",
          "🔍 'Maximum XOR...' → bitwise Trie",
          "🔍 'Word search board...' → Trie + DFS",
        ],
        visualExplanation:
          "Filing cabinet போல — முதல் எழுத்து, இரண்டாம் எழுத்து... என அடுக்கி வைத்தால் prefix match ஆனவற்றை மட்டும் திறப்போம்.",
      },
      kannada: {
        title: "Trie (Prefix Tree)",
        whatIsIt: "Strings store ಮಾಡಲು ವಿಶೇಷ tree. ಪ್ರತಿ node ಒಂದು character.",
        whyUseIt: "Prefix search/autocomplete O(L) (L = word length). ಬಹಳ ವೇಗ.",
        whenToUse: ["Autocomplete", "Spell check", "Word search games", "IP routing"],
        patternDetection: [
          "🔍 'Words starting with prefix...' → Trie",
          "🔍 'Maximum XOR...' → bitwise Trie",
          "🔍 'Word search board...' → Trie + DFS",
        ],
        visualExplanation:
          "Filing cabinet — ಮೊದಲ ಅಕ್ಷರ, ನಂತರ ಎರಡನೇ... prefix match ಆದ್ದನ್ನು ಮಾತ್ರ ತೆಗೆಯಿರಿ.",
      },
      telugu: {
        title: "Trie (Prefix Tree)",
        whatIsIt: "Strings నిల్వ చేయడానికి ప్రత్యేక tree. ప్రతి node ఒక character ని represent చేస్తుంది.",
        whyUseIt: "Prefix search/autocomplete O(L) (L = word length). చాలా ఫాస్ట్.",
        whenToUse: ["Autocomplete", "Spell check", "Word search games", "IP routing"],
        patternDetection: [
          "🔍 'Words starting with prefix...' → Trie",
          "🔍 'Maximum XOR...' → bitwise Trie",
          "🔍 'Word search board...' → Trie + DFS",
        ],
        visualExplanation:
          "Filing cabinet లా — మొదటి letter, తర్వాత రెండో... prefix match అయ్యేవి మాత్రమే ఓపెన్ చేయండి.",
      },
      hindi: {
        title: "Trie (Prefix Tree)",
        whatIsIt: "Strings store करने के लिए special tree। हर node एक character represent करता है।",
        whyUseIt: "Prefix search/autocomplete O(L) (L = word length) — बहुत तेज़।",
        whenToUse: ["Autocomplete", "Spell check", "Word search games", "IP routing"],
        patternDetection: [
          "🔍 'Words starting with prefix...' → Trie",
          "🔍 'Maximum XOR...' → bitwise Trie",
          "🔍 'Word search board...' → Trie + DFS",
        ],
        visualExplanation:
          "Filing cabinet जैसा — first letter, फिर second... आप सिर्फ वही खोलते हैं जो आपके prefix से match करता है।",
      },
    },
  },
  {
    id: "union-find", title: "Union Find (Disjoint Set)", emoji: "🖇️", category: "advanced", difficulty: "Hard",
    whatIsIt: "A data structure that keeps track of elements partitioned into disjoint (non-overlapping) sets. It supports two operations: Find and Union.",
    whyUseIt: "Near O(1) time complexity for finding if two elements are connected, or connecting two elements. Essential for finding connected components.",
    whenToUse: ["Kruskal's Minimum Spanning Tree", "Finding connected components in a graph", "Detecting cycles in an undirected graph", "Dynamic connectivity queries"],
    patternDetection: ["🔍 'Are these two nodes connected?' → Union Find", "🔍 'Number of isolated islands...' → Union Find or DFS", "🔍 'Redundant connection...' → Union Find to detect cycle"],
    timeComplexity: "Union/Find: Amortized O(α(N)) ≈ O(1)",
    spaceComplexity: "O(N) for parent and rank arrays",
    codeExample: `class UnionFind:
    def __init__(self, size):
        self.parent = list(range(size))
        self.rank = [1] * size

    def find(self, p):
        if self.parent[p] != p:
            self.parent[p] = self.find(self.parent[p])  # Path compression
        return self.parent[p]

    def union(self, p, q):
        rootP = self.find(p)
        rootQ = self.find(q)
        if rootP != rootQ:
            # Union by rank
            if self.rank[rootP] > self.rank[rootQ]:
                self.parent[rootQ] = rootP
            elif self.rank[rootP] < self.rank[rootQ]:
                self.parent[rootP] = rootQ
            else:
                self.parent[rootQ] = rootP
                self.rank[rootP] += 1
            return True
        return False`,
    realWorldUse: "Network connectivity in social platforms, image segmentation, clustering algorithms",
    visualExplanation: "Think of merging companies. Finding the parent company (Find) takes you to the ultimate CEO. Merging two companies (Union) means making one CEO report to the other.",
    translations: {
      tamil: {
        title: "Union Find (Disjoint Set)",
        whatIsIt:
          "Disjoint sets-ஆக பிரிக்கப்பட்ட elements-ஐ track செய்யும் structure. இரண்டு operations: Find மற்றும் Union.",
        whyUseIt:
          "இரண்டு elements connected-ஆ என்பதை near O(1) (amortized) நேரத்தில் check/connect செய்ய முடியும். Components கண்டறிய பயன்படும்.",
        whenToUse: ["Kruskal MST", "Connected components", "Undirected cycle detect", "Dynamic connectivity"],
        patternDetection: [
          "🔍 'Connected?' → Union Find",
          "🔍 'Number of islands/components...' → Union Find / DFS",
          "🔍 'Redundant edge...' → Union Find cycle detect",
        ],
        visualExplanation:
          "Companies merge போல. Find = ultimate CEO-வை கண்டுபிடி. Union = ஒரு CEO மற்றொன்றிற்கு report ஆக இணை.",
      },
      kannada: {
        title: "Union Find (Disjoint Set)",
        whatIsIt: "Disjoint sets ಆಗಿ ವಿಭಜಿಸಲಾದ elements track ಮಾಡುವ structure. Find ಮತ್ತು Union operations.",
        whyUseIt: "Connected? check/connect near O(1) amortized. Components ಕಂಡುಹಿಡಿಯಲು ಉಪಯುಕ್ತ.",
        whenToUse: ["Kruskal MST", "Connected components", "Undirected cycle detect", "Dynamic connectivity"],
        patternDetection: [
          "🔍 'Connected?' → Union Find",
          "🔍 'Islands/components count...' → Union Find / DFS",
          "🔍 'Redundant edge...' → Union Find cycle detect",
        ],
        visualExplanation:
          "Companies merge — Find = ultimate CEO. Union = ಒಬ್ಬ CEO ಇನ್ನೊಬ್ಬರಿಗೆ report ಆಗುವಂತೆ ಸೇರಿಸಿ.",
      },
      telugu: {
        title: "Union Find (Disjoint Set)",
        whatIsIt: "Disjoint sets గా partition అయిన elements ని track చేసే structure. Find, Union operations.",
        whyUseIt: "Connected? check/connect near O(1) amortized. Components కోసం essential.",
        whenToUse: ["Kruskal MST", "Connected components", "Undirected cycle detect", "Dynamic connectivity"],
        patternDetection: [
          "🔍 'Connected?' → Union Find",
          "🔍 'Islands/components count...' → Union Find / DFS",
          "🔍 'Redundant edge...' → Union Find cycle detect",
        ],
        visualExplanation:
          "Companies merge లా. Find = ultimate CEO. Union = ఒక CEO మరో CEO కి report అయ్యేలా కలపడం.",
      },
      hindi: {
        title: "Union Find (Disjoint Set)",
        whatIsIt: "Elements को disjoint sets में track करने वाला structure। दो operations: Find और Union।",
        whyUseIt: "दो elements connected हैं या नहीं near O(1) amortized में check/connect। Components के लिए essential।",
        whenToUse: ["Kruskal MST", "Connected components", "Undirected cycle detect", "Dynamic connectivity"],
        patternDetection: [
          "🔍 'Connected?' → Union Find",
          "🔍 'Islands/components count...' → Union Find / DFS",
          "🔍 'Redundant edge...' → Union Find cycle detect",
        ],
        visualExplanation:
          "Companies merge जैसा। Find = ultimate CEO। Union = एक CEO को दूसरे को report कराने जैसा जोड़ना।",
      },
    },
  },
  {
    id: "bit-manipulation", title: "Bit Manipulation", emoji: "🔢", category: "advanced", difficulty: "Hard",
    whatIsIt: "Operating directly on binary representations of numbers using AND, OR, XOR, NOT, and shift operators. The fastest operations a CPU can perform.",
    whyUseIt: "O(1) space for certain set operations, extremely fast. Essential for optimization, cryptography, and low-level programming.",
    whenToUse: ["Check if number is power of 2", "Count set bits", "Find single number in array of pairs", "Subset generation"],
    patternDetection: ["🔍 'Single number among duplicates...' → XOR all elements", "🔍 'Power of 2...' → n & (n-1) == 0", "🔍 'All subsets...' → Bitmask 0 to 2^n", "🔍 'Toggle/flip bits...' → XOR with mask"],
    timeComplexity: "O(1) per operation | O(n) for array scan",
    spaceComplexity: "O(1)",
    codeExample: `# Single number (all others appear twice)
def single_number(nums):
    result = 0
    for num in nums:
        result ^= num  # XOR cancels pairs
    return result

# Check power of 2
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0

# Count set bits
def count_bits(n):
    count = 0
    while n:
        count += n & 1
        n >>= 1
    return count

# Generate all subsets using bitmask
def subsets_bitmask(nums):
    n = len(nums)
    result = []
    for mask in range(1 << n):
        subset = [nums[i] for i in range(n) if mask & (1 << i)]
        result.append(subset)
    return result`,
    realWorldUse: "Cryptography, compression algorithms, network subnet masks, game state encoding, hardware drivers",
    visualExplanation: "Think of bits as light switches 💡 — each switch is ON (1) or OFF (0). Bit operations flip, check, or combine these switches at lightning speed.",
    translations: {
      tamil: {
        title: "Bit Manipulation",
        whatIsIt:
          "எண்களின் binary representation-ல் AND/OR/XOR/NOT மற்றும் shifts மூலம் நேரடியாக வேலை செய்வது.",
        whyUseIt:
          "மிக வேகமான CPU operations. சில set/subset operations-க்கு O(1) extra space. Optimization/crypto/low-level coding-ல் முக்கியம்.",
        whenToUse: ["Power of 2 check", "Set bits count", "Single number via XOR", "Subset generation (bitmask)"],
        patternDetection: [
          "🔍 'Single number...' → XOR all",
          "🔍 'Power of 2...' → n & (n-1) == 0",
          "🔍 'All subsets...' → bitmask 0..2^n",
          "🔍 'Toggle bits...' → XOR with mask",
        ],
        visualExplanation:
          "Bits-ஐ switches 💡 போல — ON(1)/OFF(0). Bit ops lightning speed-ல் flip/check/combine செய்கின்றன.",
      },
      kannada: {
        title: "Bit Manipulation",
        whatIsIt: "ಸಂಖ್ಯೆಗಳ binary representation ಮೇಲೆ AND/OR/XOR/NOT ಮತ್ತು shifts ಮೂಲಕ ನೇರವಾಗಿ ಕೆಲಸ ಮಾಡುವುದು.",
        whyUseIt: "CPU ಯ ಅತ್ಯಂತ ವೇಗದ operations. ಕೆಲವು operations ಗೆ O(1) extra space. Optimization/crypto/low-level ನಲ್ಲಿ ಮುಖ್ಯ.",
        whenToUse: ["Power of 2 check", "Set bits count", "Single number XOR", "Subset generation bitmask"],
        patternDetection: [
          "🔍 'Single number...' → XOR all",
          "🔍 'Power of 2...' → n & (n-1) == 0",
          "🔍 'All subsets...' → bitmask 0..2^n",
          "🔍 'Toggle bits...' → XOR with mask",
        ],
        visualExplanation:
          "Bits ಅನ್ನು switches 💡 ಎಂದು ಕಲ್ಪಿಸಿ — ON(1)/OFF(0). Bit ops lightning speed ನಲ್ಲಿ flip/check/combine.",
      },
      telugu: {
        title: "Bit Manipulation",
        whatIsIt: "నంబర్ల binary representation పై AND/OR/XOR/NOT మరియు shifts తో నేరుగా పని చేయడం.",
        whyUseIt: "CPU లో అత్యంత వేగమైన operations. కొన్ని operations కి O(1) extra space. Optimization/crypto/low-level లో కీలకం.",
        whenToUse: ["Power of 2 check", "Set bits count", "Single number XOR", "Subset generation bitmask"],
        patternDetection: [
          "🔍 'Single number...' → XOR all",
          "🔍 'Power of 2...' → n & (n-1) == 0",
          "🔍 'All subsets...' → bitmask 0..2^n",
          "🔍 'Toggle bits...' → XOR with mask",
        ],
        visualExplanation:
          "Bits ని switches 💡 లా ఊహించండి — ON(1)/OFF(0). Bit ops lightning speed లో flip/check/combine చేస్తాయి.",
      },
      hindi: {
        title: "Bit Manipulation",
        whatIsIt: "Numbers के binary representation पर AND/OR/XOR/NOT और shifts से directly काम करना।",
        whyUseIt: "CPU की सबसे fast operations। कुछ operations में O(1) extra space। Optimization/crypto/low-level programming में जरूरी।",
        whenToUse: ["Power of 2 check", "Set bits count", "Single number XOR", "Subset generation bitmask"],
        patternDetection: [
          "🔍 'Single number...' → XOR all",
          "🔍 'Power of 2...' → n & (n-1) == 0",
          "🔍 'All subsets...' → bitmask 0..2^n",
          "🔍 'Toggle bits...' → XOR with mask",
        ],
        visualExplanation:
          "Bits को switches 💡 समझो — ON(1)/OFF(0)। Bit ops lightning speed पर flip/check/combine करते हैं।",
      },
    },
  },
];

const categories = [
  {
    id: "fundamentals",
    title: {
      english: "Beginner",
      tamil: "தொடக்கநிலை",
      kannada: "ಆರಂಭಿಕ",
      telugu: "ప్రారంభ స్థాయి",
      hindi: "शुरुआती",
    },
    desc: {
      english: "Start here: build intuition with core structures and simple patterns",
      tamil: "இங்கே தொடங்குங்கள்: அடிப்படை structures மற்றும் எளிய patterns மூலம் புரிதலை கட்டுங்கள்",
      kannada: "ಇಲ್ಲಿ ಆರಂಭಿಸಿ: core structures ಮತ್ತು simple patterns ಮೂಲಕ intuition ಕಟ್ಟಿರಿ",
      telugu: "ఇక్కడ ప్రారంభించండి: core structures + simple patterns తో intuition పెంచండి",
      hindi: "यहीं से शुरू करें: core structures और simple patterns से intuition बनाएं",
    },
  },
  {
    id: "patterns",
    title: {
      english: "Intermediate",
      tamil: "இடைக்கட்ட",
      kannada: "ಮಧ್ಯಮ",
      telugu: "మధ్యస్థ",
      hindi: "मध्यम",
    },
    desc: {
      english: "Learn repeatable solving patterns that work across many problems",
      tamil: "பல பிரச்சினைகளுக்கும் வேலை செய்யும் மீண்டும் பயன்படுத்தக்கூடிய solving patterns கற்றுக்கொள்ளுங்கள்",
      kannada: "ಅನೇಕರ ಸಮಸ್ಯೆಗಳಿಗೆ ಕೆಲಸ ಮಾಡುವ repeatable solving patterns ಕಲಿಯಿರಿ",
      telugu: "చాలా problems కి పని చేసే repeatable solving patterns నేర్చుకోండి",
      hindi: "कई problems में काम आने वाले repeatable solving patterns सीखें",
    },
  },
  {
    id: "advanced",
    title: {
      english: "Advanced",
      tamil: "மேம்பட்ட",
      kannada: "ಅಡ್ವಾನ್ಸ್ಡ್",
      telugu: "అధునాతన",
      hindi: "उन्नत",
    },
    desc: {
      english: "Prepare for harder interviews: DP, graphs, and complex reasoning",
      tamil: "கடினமான interviews-க்கு தயார்: DP, graphs, மற்றும் ஆழமான reasoning",
      kannada: "ಕಠಿಣ interviews ಗೆ ತಯಾರಿ: DP, graphs, ಮತ್ತು complex reasoning",
      telugu: "కఠినమైన interviews కోసం: DP, graphs, complex reasoning",
      hindi: "कठिन interviews के लिए: DP, graphs और complex reasoning",
    },
  },
];

function tCategory(
  value: (typeof categories)[number]["title"] | string,
  language: LearnLanguage,
): string {
  if (typeof value === "string") return value;
  return value[language] ?? value.english;
}

function getLevelLabel(category: DSATopic["category"]) {
  if (category === "fundamentals") return "Beginner";
  if (category === "patterns") return "Intermediate";
  return "Advanced";
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as Easing } }),
};

const topicKeywords: Record<string, string[]> = {
  arrays: ["array", "list", "subarray", "prefix", "kadane"],
  "hash-maps": ["hash", "dictionary", "frequency", "anagram", "two sum"],
  "stacks-queues": ["stack", "queue", "parentheses", "deque", "monotonic"],
  "linked-lists": ["linked list", "listnode", "cycle", "remove nth", "reverse list", "random pointer"],
  strings: ["string", "palindrome", "substring", "anagram", "word"],
  heaps: ["heap", "priority queue", "kth", "top k", "merge k"],
  "two-pointers": ["two pointer", "sorted", "pair", "sum", "palindrome"],
  "sliding-window": ["window", "substring", "consecutive", "anagram"],
  "binary-search-pattern": ["binary search", "sorted", "peak", "boundary"],
  greedy: ["greedy", "interval", "jump", "minimum", "maximum"],
  "dynamic-programming": ["dp", "dynamic programming", "memo", "knapsack", "subsequence"],
  backtracking: ["backtracking", "permutation", "combination", "n-queens", "word search"],
  trees: ["tree", "binary tree", "bst", "traversal", "serialize"],
  graphs: ["graph", "bfs", "dfs", "shortest path", "topological"],
  trie: ["trie", "prefix", "word dictionary", "autocomplete"],
  "union-find": ["union find", "disjoint", "connected", "redundant", "islands"],
  "bit-manipulation": ["bit", "xor", "mask", "power of two"],
};

function buildYouTubeSearchUrl(problemTitle: string) {
  const query = encodeURIComponent(`${problemTitle} python dsa explanation`);
  return `https://www.youtube.com/results?search_query=${query}`;
}

function getRelatedProblems(topicId: string) {
  const keywords = topicKeywords[topicId] || [];
  const scored = problems
    .map((problem) => {
      const hay = `${problem.title} ${problem.description} ${problem.solutionExplanation}`.toLowerCase();
      const score = keywords.reduce((count, key) => (hay.includes(key) ? count + 1 : count), 0);
      return { problem, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((entry) => entry.problem);
  return scored;
}

function parseNodesFromCode(rawCode: string) {
  const values: number[] = [];
  const regex = /ListNode\s*\(\s*(-?\d+)/g;
  let match = regex.exec(rawCode);
  while (match) {
    values.push(Number(match[1]));
    match = regex.exec(rawCode);
  }
  return values;
}

function parseNumberList(raw: string) {
  return raw
    .split(",")
    .map((item) => Number(item.trim()))
    .filter((value) => Number.isFinite(value));
}

function parseTokenList(raw: string) {
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function inferVisualizationType(topicId: string, problem?: Problem) {
  const text = `${topicId} ${problem?.title ?? ""} ${problem?.description ?? ""}`.toLowerCase();
  if (text.includes("linked list") || text.includes("listnode")) return "linked-list" as const;
  if (text.includes("tree") || text.includes("bst")) return "tree" as const;
  if (text.includes("graph")) return "graph" as const;
  if (text.includes("string") || text.includes("palindrome") || text.includes("substring")) return "string" as const;
  if (text.includes("window") || text.includes("subarray")) return "sliding-window" as const;
  return "array" as const;
}

function extractSeedInput(problem?: Problem) {
  if (!problem?.examples?.length) return "1,2,3,4,5";
  const raw = problem.examples[0].input || "";
  const bracketMatch = raw.match(/\[([^\]]+)\]/);
  if (bracketMatch?.[1]) return bracketMatch[1];
  const tokenMatch = raw.match(/([A-Za-z]-[A-Za-z](?:,\s*[A-Za-z]-[A-Za-z])*)/);
  if (tokenMatch?.[1]) return tokenMatch[1];
  return raw.includes(",") ? raw.replace(/[^\w,\-\s]/g, "") : "1,2,3,4,5";
}

function buildTreeLevels(values: number[]) {
  const levels: number[][] = [];
  let level = 0;
  let index = 0;
  while (index < values.length && level < 5) {
    const count = 2 ** level;
    levels.push(values.slice(index, index + count));
    index += count;
    level += 1;
  }
  return levels;
}

const masteredTopicsStorageKey = "pymaster_dsa_mastered_topics";

const topicPlaybook: Record<string, {
  complexityNotes: string[];
  pitfalls: string[];
  edgeCases: string[];
  dryRunSteps: string[];
  interviewVariants: string[];
  practicePath: string[];
}> = {
  arrays: {
    complexityNotes: ["If input is unsorted but pattern needs order, sort once and accept O(n log n).", "Favor in-place updates for O(1) extra memory when mutation is allowed."],
    pitfalls: ["Forgetting off-by-one bounds in loops and slices.", "Using nested loops before checking if two-pointers can reduce complexity."],
    edgeCases: ["Empty list", "Single element", "All equal values", "Negative values mixed with positive values"],
    dryRunSteps: ["Write indexes under each element.", "Track left/right or read/write pointer movement.", "Verify final index/length returned matches expected output."],
    interviewVariants: ["Rotate array in-place", "Product of array except self", "Best time to buy/sell stock", "Maximum subarray"],
    practicePath: ["Solve one easy array traversal problem.", "Solve one two-pointer array problem.", "Solve one optimization (Kadane/prefix) problem."],
  },
  "sliding-window": {
    complexityNotes: ["Dynamic windows are O(n) because each index enters/exits at most once.", "Prefer hash map counts over repeated substring scans."],
    pitfalls: ["Shrinking window too late and violating constraints.", "Not updating best answer after each valid window expansion."],
    edgeCases: ["k larger than input length", "Repeated identical characters", "No valid window exists", "Unicode or mixed-case text"],
    dryRunSteps: ["Mark left and right pointers.", "Update frequency map as right expands.", "Shrink while invalid, then record candidate answer."],
    interviewVariants: ["Minimum window substring", "Longest repeating replacement", "Permutation in string", "Maximum sum subarray of size k"],
    practicePath: ["Start with fixed-size window.", "Move to longest/shortest dynamic window.", "End with min-window hard variant."],
  },
  "dynamic-programming": {
    complexityNotes: ["Define state clearly first: dp[i] or dp[i][j].", "Space optimize only after transitions are correct."],
    pitfalls: ["Wrong base cases cause all downstream states to fail.", "Mixing index meaning (0-based vs 1-based) in recurrence."],
    edgeCases: ["n = 0 or empty string", "Unreachable states", "Large constraints requiring modulo arithmetic", "Duplicate values affecting transitions"],
    dryRunSteps: ["Write the smallest subproblem answer manually.", "Build next 2-3 states using transition formula.", "Confirm table fill order respects dependencies."],
    interviewVariants: ["House robber with circular street", "Longest increasing subsequence", "Coin change (min coins / count ways)", "0/1 knapsack"],
    practicePath: ["Recursion + memo first.", "Convert to bottom-up table.", "Optimize memory and explain tradeoff."],
  },
};

function getTopicPlaybook(topic: DSATopic) {
  const baseByCategory: Record<DSATopic["category"], {
    complexityNotes: string[];
    pitfalls: string[];
    edgeCases: string[];
    dryRunSteps: string[];
    interviewVariants: string[];
    practicePath: string[];
  }> = {
    fundamentals: {
      complexityNotes: ["State brute-force complexity first, then target improvement.", "Prefer readable O(n) approaches over clever but brittle shortcuts."],
      pitfalls: ["Skipping input validation assumptions.", "Not testing with smallest valid input."],
      edgeCases: ["Empty input", "Single element/value", "Duplicate values"],
      dryRunSteps: ["Read constraints and expected output type.", "Walk through one normal case.", "Walk through one boundary case."],
      interviewVariants: ["Return indices vs values", "In-place vs extra-space version", "Streaming input version"],
      practicePath: ["Easy implementation", "Medium pattern variant", "Timed recap problem"],
    },
    patterns: {
      complexityNotes: ["Pattern choice should reduce one dimension of search.", "Explain why this pattern dominates brute force for constraints."],
      pitfalls: ["Applying a pattern without verifying prerequisites (sorted/monotonic/etc).", "Overfitting one pattern to all subarray problems."],
      edgeCases: ["Already sorted input", "All same values", "No valid answer"],
      dryRunSteps: ["List pattern prerequisites.", "Track pointer/window/heap states each step.", "Validate termination condition."],
      interviewVariants: ["Optimize memory", "Return all valid answers", "Support online/streaming updates"],
      practicePath: ["1 canonical pattern problem", "1 noisy wording problem", "1 mixed-pattern problem"],
    },
    advanced: {
      complexityNotes: ["Define state/graph model before coding.", "State both time and memory big-O and acceptable limits."],
      pitfalls: ["Starting code before invariant or recurrence is clear.", "Missing pruning/visited checks causes TLE or loops."],
      edgeCases: ["Disconnected components", "Cycles or impossible states", "Large input limits"],
      dryRunSteps: ["Model graph/state on paper.", "Simulate first transitions.", "Verify stop condition and correctness argument."],
      interviewVariants: ["Output one solution and count all solutions", "Iterative rewrite of recursive approach", "Constraint-tight optimization follow-up"],
      practicePath: ["Medium prep variant", "Hard core problem", "Explain aloud with complexity defense"],
    },
  };

  return topicPlaybook[topic.id] ?? baseByCategory[topic.category];
}

export default function DSAPage() {
  const canonical = "https://pymaster.pro/dsa";
  const { language } = useLanguage();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [visualInput, setVisualInput] = useState("1,2,3,4,5");
  const [windowStart, setWindowStart] = useState(0);
  const [windowSize, setWindowSize] = useState(3);
  const [activeProblem, setActiveProblem] = useState<Problem | null>(null);
  const [activeVisualization, setActiveVisualization] = useState<"array" | "string" | "sliding-window" | "linked-list" | "tree" | "graph">("array");
  const [linkedListCodeInput, setLinkedListCodeInput] = useState(
    "head = ListNode(1)\nhead.next = ListNode(2)\nhead.next.next = ListNode(3)\nhead.next.next.next = ListNode(4)",
  );
  const [linkedListNodes, setLinkedListNodes] = useState<number[]>([1, 2, 3, 4]);
  const [masteredTopics, setMasteredTopics] = useState<string[]>([]);

  const topic = useMemo(() => {
    const base = dsaTopics.find((t) => t.id === selectedTopic);
    return getLocalizedDSATopic(base, language);
  }, [language, selectedTopic]);
  const relatedProblems = useMemo(() => (topic ? getRelatedProblems(topic.id) : []), [topic]);
  const arrayValues = useMemo(() => parseNumberList(visualInput), [visualInput]);
  const stringValues = useMemo(() => visualInput.replace(/\s+/g, ""), [visualInput]);
  const graphEdges = useMemo(() => parseTokenList(visualInput), [visualInput]);
  const treeLevels = useMemo(() => buildTreeLevels(arrayValues), [arrayValues]);
  const masteredCount = masteredTopics.length;
  const masteredPct = Math.round((masteredCount / dsaTopics.length) * 100);
  const playbook = topic ? getTopicPlaybook(topic) : null;

  const difficultyColor = {
    Easy: "text-streak-green bg-streak-green/10 border-streak-green/30",
    Medium: "text-python-yellow bg-python-yellow/10 border-python-yellow/30",
    Hard: "text-destructive bg-destructive/10 border-destructive/30",
  };

  useEffect(() => {
    if (!topic) return;
    setActiveProblem(null);
    setActiveVisualization(inferVisualizationType(topic.id));
    setVisualInput(topic.id === "graphs" ? "A-B,B-C,C-D,D-E" : "1,2,3,4,5");
    setWindowStart(0);
    setWindowSize(3);
  }, [topic]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(masteredTopicsStorageKey);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setMasteredTopics(parsed.filter((value): value is string => typeof value === "string"));
      }
    } catch {
      setMasteredTopics([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(masteredTopicsStorageKey, JSON.stringify(masteredTopics));
    } catch {
      // Ignore storage failures gracefully.
    }
  }, [masteredTopics]);

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] md:h-[calc(100dvh-3.5rem)] flex-col md:flex-row md:overflow-hidden">
      <Helmet>
        <title>Data Structures & Algorithms in Python | PyMaster</title>
        <meta name="description" content="Master Python Data Structures and Algorithms with visual explanations, complexity analysis, and real-world patterns. Free DSA course." />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content="Python DSA Mastery | PyMaster" />
        <meta property="og:description" content="Learn Arrays, Hash Maps, Dynamic Programming, and Graph patterns in Python with amazing visual examples." />
        <meta property="og:image" content="https://pymaster.pro/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Python DSA Mastery | PyMaster" />
        <meta name="twitter:description" content="Learn Arrays, Hash Maps, Dynamic Programming, and Graph patterns in Python with visual examples." />
        <meta name="twitter:image" content="https://pymaster.pro/og-image.png" />
      </Helmet>
      
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-surface-1 overflow-y-auto scrollbar-none shrink-0 hidden md:block">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> 🧠 DSA Mastery
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {dsaTopics.length} topics • Pattern-based learning
          </p>
          <div className="mt-3 rounded-xl border border-border bg-card/60 p-3">
            <div className="text-[11px] font-semibold text-foreground">Choose your level</div>
            <div className="mt-2 space-y-2 text-[11px] leading-5 text-muted-foreground">
              <div><span className="font-semibold text-foreground">Beginner:</span> learn the “what” and “why” with easy examples.</div>
              <div><span className="font-semibold text-foreground">Intermediate:</span> spot repeatable patterns across problems.</div>
              <div><span className="font-semibold text-foreground">Advanced:</span> handle DP/graphs and explain tradeoffs clearly.</div>
            </div>
            <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-foreground">Pattern Progress</span>
                <span className="text-primary">{masteredCount}/{dsaTopics.length}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-1">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${masteredPct}%` }} />
              </div>
            </div>
          </div>
        </div>
        <nav className="p-2">
          {categories.map(cat => {
            const catTopics = dsaTopics.filter(t => t.category === cat.id);
            return (
              <div key={cat.id} className="mb-3">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                  {tCategory(cat.title, language)}
                </div>
                {catTopics.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTopic(t.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-md text-sm flex items-center gap-2 transition-colors mb-0.5 ${
                      selectedTopic === t.id
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                  >
                    <span>{t.emoji}</span>
                    <span className="truncate flex-1">
                      {getLocalizedDSATopic(t, language)?.title ?? t.title}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${difficultyColor[t.difficulty]}`}>
                      {t.difficulty}
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {topic ? (
          <div className="w-full max-w-5xl px-4 sm:px-6 md:px-8 py-6 md:py-8">
            {/* Mobile back button */}
            <button 
              onClick={() => setSelectedTopic(null)} 
              className="md:hidden flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> All Topics
            </button>
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{topic.emoji}</span>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{topic.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColor[topic.difficulty]}`}>
                    {topic.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground">{getLevelLabel(topic.category)}</span>
                </div>
              </div>
              <Button
                type="button"
                variant={masteredTopics.includes(topic.id) ? "default" : "outline"}
                size="sm"
                className="ml-auto"
                onClick={() =>
                  setMasteredTopics((current) =>
                    current.includes(topic.id) ? current.filter((id) => id !== topic.id) : [...current, topic.id],
                  )
                }
              >
                {masteredTopics.includes(topic.id) ? "Mastered" : "Mark Mastered"}
              </Button>
            </div>

            {/* Visual Explanation */}
            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={0}
              className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5 mb-6"
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-python-yellow shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">💡 Visual Analogy</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{topic.visualExplanation}</p>
                </div>
              </div>
            </motion.div>

            {/* What is it */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> What is it?
              </h2>
              <p className="text-muted-foreground leading-relaxed">{topic.whatIsIt}</p>
            </motion.div>

            {/* Why use it */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                <Target className="w-4 h-4 text-streak-green" /> Why use it?
              </h2>
              <p className="text-muted-foreground leading-relaxed">{topic.whyUseIt}</p>
            </motion.div>

            {/* When to use */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="mb-6">
              <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-python-yellow" /> When to use it
              </h2>
              <ul className="space-y-1.5">
                {topic.whenToUse.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-streak-green shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* 🔍 Pattern Detection — KEY SECTION */}
            <motion.div
              initial="hidden" animate="visible" variants={fadeUp} custom={4}
              className="bg-card border-2 border-primary/30 rounded-xl p-5 mb-6"
            >
              <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" /> 🔍 Pattern Detection
              </h2>
              <p className="text-xs text-muted-foreground mb-3">When you see these clues in a problem, this data structure/pattern is likely the answer:</p>
              <div className="space-y-2">
                {topic.patternDetection.map((pattern, i) => (
                  <div key={i} className="bg-surface-1 rounded-lg px-4 py-2.5 text-sm text-foreground font-mono">
                    {pattern}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Complexity */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="bg-surface-1 border border-border rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">⏱️ Time Complexity</div>
                <div className="text-sm font-mono text-foreground">{topic.timeComplexity}</div>
              </div>
              <div className="bg-surface-1 border border-border rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-1">💾 Space Complexity</div>
                <div className="text-sm font-mono text-foreground">{topic.spaceComplexity}</div>
              </div>
            </motion.div>

            {playbook && (
              <>
                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="mb-6 rounded-xl border border-border bg-card p-4 sm:p-5">
                  <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                    <CheckCheck className="w-4 h-4 text-primary" /> Pattern-First Solve Plan
                  </h3>
                  <ul className="space-y-2">
                    {playbook.practicePath.map((step, index) => (
                      <li key={step} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-[11px] font-semibold text-primary">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="mb-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-surface-1 p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Complexity + Tradeoffs</h4>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {playbook.complexityNotes.map((note) => (
                        <li key={note} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-streak-green mt-0.5 shrink-0" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-border bg-surface-1 p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Interview Follow-Ups</h4>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {playbook.interviewVariants.map((variant) => (
                        <li key={variant} className="flex items-start gap-2">
                          <ArrowRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          {variant}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="mb-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border bg-card p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-python-yellow" /> Common Pitfalls
                    </h4>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {playbook.pitfalls.map((pitfall) => (
                        <li key={pitfall}>• {pitfall}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-border bg-card p-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">Edge Cases Checklist</h4>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {playbook.edgeCases.map((edgeCase) => (
                        <li key={edgeCase}>• {edgeCase}</li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5} className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Guided Dry Run Workflow</h4>
                  <ol className="space-y-1.5 text-sm text-muted-foreground">
                    {playbook.dryRunSteps.map((step, index) => (
                      <li key={step}>{index + 1}. {step}</li>
                    ))}
                  </ol>
                </motion.div>
              </>
            )}

            {/* Code Example */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Code className="w-4 h-4 text-primary" /> 💻 Code Example
                </h2>
                <Button asChild size="sm" variant="outline" className="h-7 text-xs gap-1">
                  <Link to={`/compiler?code=${encodeURIComponent(topic.codeExample)}`}>
                    ▶ Try in Editor
                  </Link>
                </Button>
              </div>
              <div className="code-block">
                <pre className="p-4 text-xs sm:text-sm font-mono text-foreground overflow-x-auto leading-relaxed">
                  {topic.codeExample}
                </pre>
              </div>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6} className="mb-6 rounded-xl border border-border bg-card p-4 sm:p-5">
              <h3 className="text-base font-semibold text-foreground mb-2">Problem Visual Lab</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize DSA problems across multiple structures. Pick a mode, load a problem, and inspect the shape of data.
              </p>

              <div className="mb-4 grid gap-2 sm:grid-cols-3">
                {(["array", "string", "sliding-window", "linked-list", "tree", "graph"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setActiveVisualization(mode)}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                      activeVisualization === mode
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {mode.replace("-", " ")}
                  </button>
                ))}
              </div>

              <div className="rounded-lg border border-border bg-surface-1 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  {activeProblem ? `Input from: ${activeProblem.title}` : "Custom Input"}
                </div>
                <input
                  value={visualInput}
                  onChange={(e) => setVisualInput(e.target.value)}
                  placeholder={activeVisualization === "graph" ? "A-B,B-C,C-D" : "1,2,3,4,5"}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary/50"
                />
              </div>

              {activeVisualization === "sliding-window" && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs text-muted-foreground">
                    Window Start
                    <input
                      type="number"
                      min={0}
                      value={windowStart}
                      onChange={(e) => setWindowStart(Math.max(0, Number(e.target.value) || 0))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary/50"
                    />
                  </label>
                  <label className="text-xs text-muted-foreground">
                    Window Size
                    <input
                      type="number"
                      min={1}
                      value={windowSize}
                      onChange={(e) => setWindowSize(Math.max(1, Number(e.target.value) || 1))}
                      className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary/50"
                    />
                  </label>
                </div>
              )}

              {activeVisualization === "linked-list" && (
                <div className="mt-3 rounded-lg border border-border bg-surface-1 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Code Input</div>
                  <textarea
                    value={linkedListCodeInput}
                    onChange={(e) => setLinkedListCodeInput(e.target.value)}
                    className="h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-xs font-mono text-foreground outline-none focus:border-primary/50"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3 w-full"
                    onClick={() => {
                      const values = parseNodesFromCode(linkedListCodeInput);
                      if (values.length > 0) {
                        setLinkedListNodes(values);
                        setVisualInput(values.join(","));
                      }
                    }}
                  >
                    Parse Nodes From Code
                  </Button>
                </div>
              )}

              <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-background p-4">
                {activeVisualization === "array" && (
                  <div className="flex min-w-max items-end gap-2">
                    {arrayValues.map((value, idx) => (
                      <div key={`${value}-${idx}`} className="flex flex-col items-center">
                        <div
                          className="w-10 rounded-t-md bg-primary/80 text-center text-xs text-white"
                          style={{ height: `${Math.max(20, Math.min(160, value * 8))}px` }}
                        />
                        <div className="mt-1 text-xs text-foreground">{value}</div>
                        <div className="text-[10px] text-muted-foreground">i={idx}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeVisualization === "string" && (
                  <div className="flex min-w-max items-center gap-2">
                    {stringValues.split("").map((ch, idx) => (
                      <div key={`${ch}-${idx}`} className="rounded-lg border border-primary/25 bg-primary/10 px-3 py-2 text-center">
                        <div className="text-sm font-semibold text-foreground">{ch}</div>
                        <div className="text-[10px] text-muted-foreground">idx {idx}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeVisualization === "sliding-window" && (
                  <div className="flex min-w-max items-center gap-2">
                    {arrayValues.map((value, idx) => {
                      const inWindow = idx >= windowStart && idx < windowStart + windowSize;
                      return (
                        <div
                          key={`${value}-${idx}`}
                          className={`rounded-lg border px-3 py-2 text-center ${
                            inWindow ? "border-python-yellow bg-python-yellow/20" : "border-border bg-surface-1"
                          }`}
                        >
                          <div className="text-sm font-semibold text-foreground">{value}</div>
                          <div className="text-[10px] text-muted-foreground">idx {idx}</div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {activeVisualization === "linked-list" && (
                  <div className="flex min-w-max items-center gap-2">
                    {(linkedListNodes.length ? linkedListNodes : parseNumberList(visualInput)).map((value, index, arr) => (
                      <div key={`${value}-${index}`} className="flex items-center gap-2">
                        <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-center shadow-sm">
                          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Node</div>
                          <div className="text-base font-bold text-foreground">{value}</div>
                        </div>
                        {index < arr.length - 1 && <ArrowRight className="w-4 h-4 text-primary shrink-0" />}
                      </div>
                    ))}
                    <div className="rounded-xl border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">NULL</div>
                  </div>
                )}

                {activeVisualization === "tree" && (
                  <div className="space-y-3">
                    {treeLevels.map((level, levelIdx) => (
                      <div key={levelIdx} className="flex justify-center gap-2">
                        {level.map((value, idx) => (
                          <div key={`${value}-${idx}`} className="rounded-full border border-streak-green/30 bg-streak-green/10 px-3 py-2 text-sm font-semibold text-foreground">
                            {value}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {activeVisualization === "graph" && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {graphEdges.map((edge) => (
                        <div key={edge} className="rounded-lg border border-border bg-surface-1 px-3 py-2 text-xs font-mono text-foreground">
                          {edge}
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Enter edges like <code>A-B,B-C,C-D</code>. This shows graph connectivity pairs.
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Real World */}
            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7} className="bg-surface-1 border border-border rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-reward-gold" /> 🌍 Real-World Applications
              </h3>
              <p className="text-sm text-muted-foreground">{topic.realWorldUse}</p>
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7} className="bg-surface-1 border border-border rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-red-500" /> Problem Videos (YouTube)
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                These are matched from your PyMaster problem set. Open the problem, watch explanations, or load problem input into the visual lab.
              </p>
              <div className="space-y-2">
                {relatedProblems.length > 0 ? relatedProblems.map((problem: Problem) => (
                  <div key={problem.id} className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-foreground">{problem.title}</div>
                        <div className="text-xs text-muted-foreground">{problem.difficulty}</div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8"
                        onClick={() => {
                          setActiveProblem(problem);
                          setActiveVisualization(inferVisualizationType(topic.id, problem));
                          setVisualInput(extractSeedInput(problem));
                          const seeded = parseNodesFromCode(problem.starterCode || "");
                          if (seeded.length) setLinkedListNodes(seeded);
                        }}
                      >
                        Visualize
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild variant="outline" size="sm" className="h-8">
                        <Link to={`/problems/${problem.id}`}>Open Problem</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="h-8 gap-1">
                        <a href={buildYouTubeSearchUrl(problem.title)} target="_blank" rel="noreferrer">
                          YouTube <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-muted-foreground">
                    No direct mapping found yet. Open practice problems and search by this topic title on YouTube.
                  </div>
                )}
              </div>
            </motion.div>

            {/* Practice link */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="gap-2">
                <Link to="/problems">
                  🏋️ Practice Problems <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link to={`/compiler?code=${encodeURIComponent(topic.codeExample)}`}>
                  💻 Code Playground
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center md:justify-center h-full text-center px-4 sm:px-6 py-6 overflow-y-auto">
            <Brain className="w-12 h-12 text-muted-foreground/30 mb-4 hidden md:block" />
            <h2 className="text-xl font-semibold text-foreground mb-1">🧠 DSA Mastery</h2>
            <p className="text-muted-foreground mb-6 max-w-md text-sm">
              Learn Data Structures & Algorithms with pattern detection and real-world examples.
            </p>

            {/* Desktop placeholder */}
            <p className="text-muted-foreground hidden md:block">Choose a topic from the sidebar to start learning</p>
            <div className="hidden md:block mt-6 w-full max-w-2xl text-left">
              <div className="grid gap-4 md:grid-cols-3">
                <section className="rounded-xl border border-border bg-card/70 p-4">
                  <h3 className="text-sm font-semibold text-foreground">Beginner</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-6">
                    Best for school students, college beginners, and anyone new to coding interviews.
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground leading-6 list-disc pl-4">
                    <li>Understand arrays, strings, stacks, queues, and hash maps</li>
                    <li>Explain problems in simple words before writing code</li>
                    <li>Learn Big-O like “how time grows”</li>
                  </ul>
                </section>
                <section className="rounded-xl border border-border bg-card/70 p-4">
                  <h3 className="text-sm font-semibold text-foreground">Intermediate</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-6">
                    Ideal when you can code, but you want a repeatable method to solve new problems.
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground leading-6 list-disc pl-4">
                    <li>Master patterns: two pointers, sliding window, binary search</li>
                    <li>Pick the right structure quickly (set vs dict vs heap)</li>
                    <li>Write cleaner, testable solutions</li>
                  </ul>
                </section>
                <section className="rounded-xl border border-border bg-card/70 p-4">
                  <h3 className="text-sm font-semibold text-foreground">Advanced</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-6">
                    For tougher interviews and deeper reasoning: dynamic programming and graphs.
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-muted-foreground leading-6 list-disc pl-4">
                    <li>Break DP into states, transitions, and base cases</li>
                    <li>Use BFS/DFS correctly and explain why it works</li>
                    <li>Discuss tradeoffs confidently (time vs memory)</li>
                  </ul>
                </section>
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-6">
                Expectation: you don’t need to be “good at math” to learn DSA. You just need patience, practice, and a step-by-step plan. Start
                with one beginner topic, write the code, then practice 2–3 problems from <Link to="/problems" className="text-primary hover:underline">Problems</Link>.
              </p>
            </div>

            {/* Mobile topic list */}
            <div className="md:hidden w-full max-w-lg space-y-5 text-left">
              {categories.map(cat => (
                <div key={cat.id}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5 px-1">{tCategory(cat.title, language)}</h3>
                  <p className="text-[11px] text-muted-foreground mb-2 px-1">{tCategory(cat.desc, language)}</p>
                  <div className="space-y-1.5">
                    {dsaTopics.filter(t => t.category === cat.id).map(t => (
                      // Localize per-topic title in the list.
                      <button
                        key={t.id}
                        onClick={() => setSelectedTopic(t.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 bg-card border border-border rounded-lg hover:border-primary/40 active:bg-secondary/50 transition-colors"
                      >
                        <span className="text-lg shrink-0">{t.emoji}</span>
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {getLocalizedDSATopic(t, language)?.title ?? t.title}
                          </div>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full border shrink-0 ${difficultyColor[t.difficulty]}`}>
                          {t.difficulty}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
