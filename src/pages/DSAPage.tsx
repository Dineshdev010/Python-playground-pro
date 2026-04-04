// ============================================================
// DSA PAGE — src/pages/DSAPage.tsx
// Data Structures & Algorithms mastery page with visual
// explanations, code examples, complexity analysis, and
// pattern detection tips for each topic.
// ============================================================
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, Brain, Search, Zap, ArrowRight, ArrowLeft, CheckCircle2, Code, Target, Lightbulb, TrendingUp, ExternalLink, PlayCircle } from "lucide-react";
import type { Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { problems, type Problem } from "@/data/problems";

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
  },
];

const categories = [
  { id: "fundamentals", title: "📦 Fundamentals", desc: "Core data structures every developer must know" },
  { id: "patterns", title: "🧩 Algorithm Patterns", desc: "Recognize these patterns to solve any problem" },
  { id: "advanced", title: "🚀 Advanced Topics", desc: "Master-level concepts for interviews & beyond" },
];

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

export default function DSAPage() {
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

  const topic = dsaTopics.find(t => t.id === selectedTopic);
  const relatedProblems = useMemo(() => (topic ? getRelatedProblems(topic.id) : []), [topic]);
  const arrayValues = useMemo(() => parseNumberList(visualInput), [visualInput]);
  const stringValues = useMemo(() => visualInput.replace(/\s+/g, ""), [visualInput]);
  const graphEdges = useMemo(() => parseTokenList(visualInput), [visualInput]);
  const treeLevels = useMemo(() => buildTreeLevels(arrayValues), [arrayValues]);

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
  }, [topic?.id]);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col md:h-[calc(100vh-3.5rem)] md:flex-row">
      <Helmet>
        <title>Data Structures & Algorithms in Python | PyMaster</title>
        <meta name="description" content="Master Python Data Structures and Algorithms with visual explanations, complexity analysis, and real-world patterns. Free DSA course." />
        <meta property="og:title" content="Python DSA Mastery | PyMaster" />
        <meta property="og:description" content="Learn Arrays, Hash Maps, Dynamic Programming, and Graph patterns in Python with amazing visual examples." />
      </Helmet>
      
      {/* Sidebar */}
      <aside className="w-72 border-r border-border bg-surface-1 overflow-y-auto shrink-0 hidden md:block">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" /> 🧠 DSA Mastery
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            {dsaTopics.length} topics • Pattern-based learning
          </p>
        </div>
        <nav className="p-2">
          {categories.map(cat => {
            const catTopics = dsaTopics.filter(t => t.category === cat.id);
            return (
              <div key={cat.id} className="mb-3">
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                  {cat.title}
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
                    <span className="truncate flex-1">{t.title}</span>
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
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8">
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
                  <span className="text-xs text-muted-foreground">{topic.category}</span>
                </div>
              </div>
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

            {/* Mobile topic list */}
            <div className="md:hidden w-full max-w-lg space-y-5 text-left">
              {categories.map(cat => (
                <div key={cat.id}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-1.5 px-1">{cat.title}</h3>
                  <p className="text-[11px] text-muted-foreground mb-2 px-1">{cat.desc}</p>
                  <div className="space-y-1.5">
                    {dsaTopics.filter(t => t.category === cat.id).map(t => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTopic(t.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 bg-card border border-border rounded-lg hover:border-primary/40 active:bg-secondary/50 transition-colors"
                      >
                        <span className="text-lg shrink-0">{t.emoji}</span>
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{t.title}</div>
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
