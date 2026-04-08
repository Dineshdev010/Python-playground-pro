import { type Exercise } from "./lessons";

export interface CareerLesson {
  id: string;
  title: string;
  description: string;
  category?: string;
  content: string;
  codeExample: string;
  exercises: {
    beginner: Exercise;
    intermediate: Exercise;
    advanced: Exercise;
  };
}

export interface CareerTrack {
  id: string;
  title: string;
  description: string;
  color: string;
  language?: "python" | "sql";
  lessons: CareerLesson[];
}

function da(): CareerLesson[] {
  return [
    {
      id: "da-intro", title: "Introduction to Data Analysis", description: "What is data analysis and why Python is the best tool for it",
      content: "## What is Data Analysis?\n\nData analysis is the process of inspecting, cleaning, transforming, and modeling data to discover useful information.\n\n### Why Python for Data Analysis?\n- **Rich ecosystem** — Pandas, NumPy, Matplotlib, Seaborn\n- **Easy syntax** — Focus on logic, not boilerplate\n- **Community** — Millions of tutorials and StackOverflow answers\n- **Industry standard** — Used at Google, Netflix, NASA\n\n### The Data Analysis Workflow\n1. **Collect** data from files, APIs, or databases\n2. **Clean** — handle missing values, fix types\n3. **Explore** — summary statistics, distributions\n4. **Visualize** — charts, graphs, dashboards\n5. **Interpret** — draw conclusions, tell the story",
      codeExample: "# A taste of data analysis in Python\nimport pandas as pd\n\ndata = {\n    \"Name\": [\"Alice\", \"Bob\", \"Charlie\"],\n    \"Age\": [25, 30, 35],\n    \"Salary\": [50000, 60000, 70000]\n}\n\ndf = pd.DataFrame(data)\nprint(df)\nprint(\"Average salary:\", df['Salary'].mean())",
      exercises: {
        beginner: { prompt: "Create a list of 5 numbers and print their average using sum() and len().", starterCode: "numbers = [10, 20, 30, 40, 50]\n\n# Calculate and print the average\n", expectedOutput: "30.0" },
        intermediate: { prompt: "Given a dictionary of students and scores, print the student with the highest score.", starterCode: "scores = {\"Alice\": 85, \"Bob\": 92, \"Charlie\": 78}\n\n# Find and print the top student\n", expectedOutput: "Bob" },
        advanced: { prompt: "Calculate total revenue (price * quantity) for all products and print it.", starterCode: "products = [\n    {\"name\": \"Widget\", \"price\": 10, \"quantity\": 5},\n    {\"name\": \"Gadget\", \"price\": 25, \"quantity\": 3},\n    {\"name\": \"Doohickey\", \"price\": 15, \"quantity\": 8}\n]\n\n# Calculate and print total revenue\n", expectedOutput: "245" },
      },
    },
    {
      id: "da-lists-data", title: "Working with Data in Lists", description: "Use Python lists as your first data structure for analysis",
      content: "## Lists as Data Containers\n\nBefore learning Pandas, master Python's built-in list for data manipulation.\n\n### Key Operations\n- **Filtering** — Select items that match a condition\n- **Mapping** — Transform every item\n- **Aggregating** — Reduce to a single value (sum, avg, max)\n- **Sorting** — Order data by a criterion\n\n### List Comprehensions\nThe Pythonic way to filter and transform data in one line.",
      codeExample: "sales = [120, 340, 250, 410, 180, 520, 300]\nhigh_sales = [s for s in sales if s > 300]\nprint(\"High sales:\", high_sales)\nprint(\"Total:\", sum(sales))\nprint(\"Average:\", round(sum(sales)/len(sales), 1))",
      exercises: {
        beginner: { prompt: "Given temps=[72, 68, 75, 80, 65, 78], print the maximum temperature.", starterCode: "temps = [72, 68, 75, 80, 65, 78]\n\n# Print max temperature\n", expectedOutput: "80" },
        intermediate: { prompt: "Filter the list to only include even numbers and print. nums=[1,2,3,4,5,6,7,8,9,10]", starterCode: "nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n\n# Filter even numbers and print\n", expectedOutput: "[2, 4, 6, 8, 10]" },
        advanced: { prompt: "Given sales=[200,150,350], calculate and print the percentage the first sale contributes. Round to 1 decimal, format as '28.6%'.", starterCode: "sales = [200, 150, 350]\ntotal = sum(sales)\n\n# Print percentage of first sale\n", expectedOutput: "28.6%" },
      },
    },
    {
      id: "da-dictionaries", title: "Dictionaries for Structured Data", description: "Use dictionaries to represent records and datasets",
      content: "## Dictionaries = Mini Databases\n\nDictionaries store structured data as key-value pairs — like a row in a spreadsheet.\n\n### Why Dictionaries?\n- Named access: record[\"name\"] instead of record[0]\n- Self-documenting: keys describe the data\n- Flexible: different records can have different keys\n\n### Common Patterns\n- **List of dicts** = a table (each dict is a row)\n- **Dict of lists** = columnar data\n- **Nested dicts** = hierarchical data",
      codeExample: "employees = [\n    {\"name\": \"Alice\", \"dept\": \"Engineering\", \"salary\": 95000},\n    {\"name\": \"Bob\", \"dept\": \"Marketing\", \"salary\": 72000},\n    {\"name\": \"Charlie\", \"dept\": \"Engineering\", \"salary\": 88000},\n]\neng = [e for e in employees if e[\"dept\"] == \"Engineering\"]\nprint(\"Engineering team:\", len(eng), \"people\")\navg = sum(e[\"salary\"] for e in employees) / len(employees)\nprint(\"Average salary:\", int(avg))",
      exercises: {
        beginner: { prompt: "Create a dict student with keys 'name','grade','gpa'. Print the name.", starterCode: "student = {\"name\": \"Alice\", \"grade\": \"A\", \"gpa\": 3.8}\n\n# Print the name\n", expectedOutput: "Alice" },
        intermediate: { prompt: "Given a list of products, print the name of the most expensive one.", starterCode: "products = [\n    {\"name\": \"Laptop\", \"price\": 999},\n    {\"name\": \"Phone\", \"price\": 699},\n    {\"name\": \"Tablet\", \"price\": 449}\n]\n\n# Print name of most expensive\n", expectedOutput: "Laptop" },
        advanced: { prompt: "Count employees in 'Engineering' department. Print the count.", starterCode: "employees = [\n    {\"name\": \"Alice\", \"dept\": \"Engineering\"},\n    {\"name\": \"Bob\", \"dept\": \"Marketing\"},\n    {\"name\": \"Charlie\", \"dept\": \"Engineering\"},\n    {\"name\": \"Diana\", \"dept\": \"Marketing\"},\n    {\"name\": \"Eve\", \"dept\": \"Engineering\"}\n]\n\n# Count Engineering employees\n", expectedOutput: "3" },
      },
    },
    {
      id: "da-statistics", title: "Basic Statistics with Python", description: "Calculate mean, median, mode, and standard deviation",
      content: "## Statistics in Python\n\nStatistics helps understand data distribution and central tendencies.\n\n### Key Measures\n- **Mean** — Average value: sum/count\n- **Median** — Middle value when sorted\n- **Mode** — Most frequent value\n- **Range** — Max minus min\n- **Standard Deviation** — How spread out values are",
      codeExample: "scores = [85, 92, 78, 95, 88, 72, 90, 85, 88, 95]\nmean = sum(scores) / len(scores)\nsorted_s = sorted(scores)\nn = len(sorted_s)\nmedian = (sorted_s[n//2-1] + sorted_s[n//2]) / 2 if n % 2 == 0 else sorted_s[n//2]\nprint(\"Mean:\", mean)\nprint(\"Median:\", median)",
      exercises: {
        beginner: { prompt: "Given scores=[85, 90, 78, 92, 88], calculate and print the mean.", starterCode: "scores = [85, 90, 78, 92, 88]\n\n# Calculate and print mean\n", expectedOutput: "86.6" },
        intermediate: { prompt: "Find the median of nums=[3,1,4,1,5,9,2,6]. Sort first.", starterCode: "nums = [3, 1, 4, 1, 5, 9, 2, 6]\nsorted_nums = sorted(nums)\nn = len(sorted_nums)\nmedian = (sorted_nums[n//2 - 1] + sorted_nums[n//2]) / 2\nprint(median)\n", expectedOutput: "3.5" },
        advanced: { prompt: "Calculate standard deviation of data=[10,12,23,23,16,23,21,16]. Print rounded to 2 decimals.", starterCode: "data = [10, 12, 23, 23, 16, 23, 21, 16]\nmean = sum(data) / len(data)\nvariance = sum((x - mean) ** 2 for x in data) / len(data)\nstd_dev = variance ** 0.5\nprint(round(std_dev, 2))\n", expectedOutput: "4.9" },
      },
    },
    {
      id: "da-visualization", title: "Data Visualization Concepts", description: "Learn chart types and when to use them",
      content: "## Visualizing Data\n\nCharts transform numbers into visual stories.\n\n### Common Chart Types\n- **Bar Chart** — Compare categories\n- **Line Chart** — Show trends over time\n- **Scatter Plot** — Show relationships\n- **Histogram** — Show distribution\n- **Pie Chart** — Show proportions",
      codeExample: "categories = [\"Python\", \"JavaScript\", \"Java\", \"C++\"]\npopularity = [35, 30, 20, 15]\ntop_idx = popularity.index(max(popularity))\nprint(\"Most popular:\", categories[top_idx])\nprint(\"Share:\", str(popularity[top_idx]) + \"%\")",
      exercises: {
        beginner: { prompt: "Given categories and values, print which category has the highest value.", starterCode: "categories = [\"A\", \"B\", \"C\", \"D\"]\nvalues = [25, 40, 15, 30]\n\n# Print category with highest value\n", expectedOutput: "B" },
        intermediate: { prompt: "Calculate the percentage each category represents. Print the largest rounded to 1 decimal.", starterCode: "labels = [\"Python\", \"JS\", \"Java\"]\nusers = [350, 300, 150]\ntotal = sum(users)\npercentages = [(u/total)*100 for u in users]\nprint(round(max(percentages), 1))\n", expectedOutput: "43.8" },
        advanced: { prompt: "Calculate month-over-month growth rates and print the highest as percentage rounded to 1 decimal.", starterCode: "revenue = [1000, 1200, 1100, 1500, 1800]\ngrowth = []\nfor i in range(1, len(revenue)):\n    rate = ((revenue[i] - revenue[i-1]) / revenue[i-1]) * 100\n    growth.append(round(rate, 1))\nprint(max(growth))\n", expectedOutput: "36.4" },
      },
    },
    {
      id: "da-pandas-intro", title: "Introduction to Pandas", description: "DataFrames, Series, and basic operations",
      content: "## Pandas: The Data Analysis Powerhouse\n\nPandas provides two main data structures:\n- **Series** — A single column of data\n- **DataFrame** — A table (like a spreadsheet)\n\n### Key Operations\n- df.head() — First 5 rows\n- df.describe() — Summary statistics\n- df.shape — (rows, columns)\n- df[\"column\"] — Select a column",
      codeExample: "cities = {\"City\": [\"NYC\", \"LA\", \"Chicago\"], \"Pop\": [8336817, 3979576, 2693976]}\nprint(\"Rows:\", len(cities[\"City\"]))\nprint(\"Columns:\", len(cities))\nmax_idx = cities[\"Pop\"].index(max(cities[\"Pop\"]))\nprint(\"Largest:\", cities[\"City\"][max_idx])",
      exercises: {
        beginner: { prompt: "Create a dict with keys 'City' and 'Pop' with 3 cities. Print the dictionary.", starterCode: "data = {\"City\": [\"NYC\", \"LA\", \"Chicago\"], \"Pop\": [8336817, 3979576, 2693976]}\nprint(data)\n", expectedOutput: "{'City': ['NYC', 'LA', 'Chicago'], 'Pop': [8336817, 3979576, 2693976]}" },
        intermediate: { prompt: "From a dict of cities and populations, find and print the city with the largest population.", starterCode: "cities = {\"NYC\": 8336817, \"LA\": 3979576, \"Chicago\": 2693976}\n\n# Print city with max population\n", expectedOutput: "NYC" },
        advanced: { prompt: "Create paired tuples sorted by population descending. Print the first tuple's city name.", starterCode: "cities = [\"NYC\", \"LA\", \"Chicago\", \"Houston\"]\npops = [8336817, 3979576, 2693976, 2320268]\npaired = list(zip(cities, pops))\npaired.sort(key=lambda x: x[1], reverse=True)\nprint(paired[0][0])\n", expectedOutput: "NYC" },
      },
    },
    {
      id: "da-file-io", title: "Reading & Writing Data Files", description: "Work with CSV and text data",
      content: "## File I/O for Data Analysis\n\nReal data lives in files — CSV, JSON, TXT.\n\n### CSV Files\nCSV (Comma-Separated Values) is the most common data format.\n\n### Key Concepts\n- open() — opens a file\n- with statement — automatically closes the file\n- csv.reader — reads rows as lists",
      codeExample: "csv_data = \"Name,Age,City\\nAlice,25,NYC\\nBob,30,LA\\nCharlie,35,Chicago\"\nlines = csv_data.split(\"\\n\")\nheader = lines[0].split(\",\")\nrows = [line.split(\",\") for line in lines[1:]]\nfor row in rows:\n    print(row[0], \"is\", row[1], \"from\", row[2])",
      exercises: {
        beginner: { prompt: "Split a multi-line string into lines and print the count.", starterCode: "data = \"Name,Age\\nAlice,25\\nBob,30\\nCharlie,35\"\nlines = data.strip().split(\"\\n\")\nprint(len(lines))\n", expectedOutput: "4" },
        intermediate: { prompt: "Parse CSV: extract the Age column and print the sum.", starterCode: "data = \"Name,Age\\nAlice,25\\nBob,30\\nCharlie,35\"\nlines = data.strip().split(\"\\n\")\nrows = [line.split(\",\") for line in lines[1:]]\nage_sum = sum(int(row[1]) for row in rows)\nprint(age_sum)\n", expectedOutput: "90" },
        advanced: { prompt: "Filter CSV rows where Age > 25 and print the count.", starterCode: "data = \"Name,Age\\nAlice,25\\nBob,30\\nCharlie,35\\nDiana,22\"\nlines = data.strip().split(\"\\n\")\nrows = [line.split(\",\") for line in lines[1:]]\ncount = sum(1 for row in rows if int(row[1]) > 25)\nprint(count)\n", expectedOutput: "2" },
      },
    },
    {
      id: "da-pandas-mastery", title: "Pandas Mastery Patterns", description: "GroupBy, merge, pivot, and performance habits",
      content: "## Pandas Mastery\n\nOnce you know the basics, these patterns make you *fast* in real jobs.\n\n### Core patterns\n- **groupby + agg** — summarize by category\n- **merge / join** — combine datasets\n- **pivot_table** — reshape for reporting\n- **missing values** — fill, drop, flag\n- **types** — convert early (int, float, datetime)\n\n### Performance habits\n- Avoid row-by-row loops when possible\n- Prefer vectorized ops and boolean masks\n- Use `value_counts()` / `groupby()` for summaries\n\nYou do not need to memorize everything; you need to know the *patterns* and where to look.",
      codeExample: "# Pandas-like operations (conceptual, using Python)\nrows = [\n    {\"dept\": \"Eng\", \"salary\": 100},\n    {\"dept\": \"Eng\", \"salary\": 120},\n    {\"dept\": \"Sales\", \"salary\": 90},\n]\n\n# groupby dept -> avg salary\nsums = {}\ncounts = {}\nfor r in rows:\n    d = r[\"dept\"]\n    sums[d] = sums.get(d, 0) + r[\"salary\"]\n    counts[d] = counts.get(d, 0) + 1\n\navgs = {d: round(sums[d] / counts[d], 1) for d in sums}\nprint(avgs)\n",
      exercises: {
        beginner: { prompt: "Group by category and print total for 'A'. data=[('A',10),('B',5),('A',7)]", starterCode: "data = [(\"A\", 10), (\"B\", 5), (\"A\", 7)]\ntotals = {}\nfor cat, val in data:\n    totals[cat] = totals.get(cat, 0) + val\nprint(totals[\"A\"]) \n", expectedOutput: "17" },
        intermediate: { prompt: "Left join two lists of dicts on id and print the joined name for id=2.", starterCode: "users = [{\"id\": 1, \"name\": \"A\"}, {\"id\": 2, \"name\": \"B\"}]\norders = [{\"id\": 2, \"total\": 50}]\norder_by_id = {o[\"id\"]: o for o in orders}\njoined = []\nfor u in users:\n    row = {**u, **order_by_id.get(u[\"id\"], {})}\n    joined.append(row)\nprint(joined[1][\"name\"]) \n", expectedOutput: "B" },
        advanced: { prompt: "Build a pivot-like summary: counts by dept from rows. Print Eng count.", starterCode: "rows = [\n    {\"dept\": \"Eng\"}, {\"dept\": \"Eng\"}, {\"dept\": \"Sales\"}, {\"dept\": \"Eng\"}\n]\ncounts = {}\nfor r in rows:\n    d = r[\"dept\"]\n    counts[d] = counts.get(d, 0) + 1\nprint(counts[\"Eng\"]) \n", expectedOutput: "3" },
      },
    },
    {
      id: "da-case-study", title: "Case Study: From Raw Data to Insights", description: "A portfolio-style mini project workflow",
      content: "## Case Study Workflow\n\nRecruiters love seeing end-to-end thinking.\n\n### A strong case study includes\n1. **Problem statement** — what you are trying to answer\n2. **Data cleaning** — handle missing and bad values\n3. **Exploration** — summary statistics and patterns\n4. **Insights** — 3 to 5 clear findings\n5. **Recommendation** — what to do next\n6. **Limitations** — what the data cannot prove\n\n### Output idea\n- A single clean notebook or markdown report\n- A few charts (even simple ones)\n- A short conclusion section\n\nYou are practicing *storytelling*, not just code.",
      codeExample: "# Mini case study: find top product by revenue\nsales = [\n    {\"product\": \"A\", \"price\": 10, \"qty\": 3},\n    {\"product\": \"B\", \"price\": 7, \"qty\": 6},\n    {\"product\": \"A\", \"price\": 10, \"qty\": 1},\n]\n\nrevenue = {}\nfor s in sales:\n    revenue[s[\"product\"]] = revenue.get(s[\"product\"], 0) + s[\"price\"] * s[\"qty\"]\n\ntop = max(revenue, key=revenue.get)\nprint(top, revenue[top])\n",
      exercises: {
        beginner: { prompt: "Compute revenue for price=12, qty=4. Print it.", starterCode: "price = 12\nqty = 4\nprint(price * qty)\n", expectedOutput: "48" },
        intermediate: { prompt: "Find the max value in revenue={'A':40,'B':42,'C':10}. Print the key.", starterCode: "revenue = {\"A\": 40, \"B\": 42, \"C\": 10}\nprint(max(revenue, key=revenue.get))\n", expectedOutput: "B" },
        advanced: { prompt: "Given nums=[10, None, 30, None, 5], replace None with 0 and print sum.", starterCode: "nums = [10, None, 30, None, 5]\nclean = [0 if x is None else x for x in nums]\nprint(sum(clean))\n", expectedOutput: "45" },
      },
    },
  ];
}

function wd(): CareerLesson[] {
  return [
    {
      id: "wd-intro", title: "Web Development with Python", description: "Overview of Python web frameworks",
      content: "## Python for the Web\n\nPython powers Instagram, Pinterest, Spotify.\n\n### Popular Frameworks\n- **Django** — Full-featured, batteries-included\n- **Flask** — Lightweight, flexible\n- **FastAPI** — Modern, async-first\n\n### How the Web Works\n1. Browser sends HTTP request\n2. Server processes it\n3. Server sends HTTP response\n4. Browser renders result",
      codeExample: "def handle_route(path):\n    routes = {\"/\": \"Home Page\", \"/about\": \"About Page\"}\n    return routes.get(path, \"404 Not Found\")\n\nprint(handle_route(\"/\"))\nprint(handle_route(\"/about\"))\nprint(handle_route(\"/xyz\"))",
      exercises: {
        beginner: { prompt: "Create a dict representing an HTTP response with 'status' and 'body'. Print status.", starterCode: "response = {\"status\": 200, \"body\": \"OK\"}\nprint(response[\"status\"])\n", expectedOutput: "200" },
        intermediate: { prompt: "Write route(path) returning 'Home' for '/', 'About' for '/about', '404' else. Test '/'.", starterCode: "def route(path):\n    if path == \"/\":\n        return \"Home\"\n    elif path == \"/about\":\n        return \"About\"\n    else:\n        return \"404\"\n\nprint(route(\"/\"))\n", expectedOutput: "Home" },
        advanced: { prompt: "Parse URL query 'name=Alice&age=25' into a dict and print it.", starterCode: "query = \"name=Alice&age=25\"\nparams = dict(pair.split(\"=\") for pair in query.split(\"&\"))\nprint(params)\n", expectedOutput: "{'name': 'Alice', 'age': '25'}" },
      },
    },
    {
      id: "wd-http", title: "HTTP & Request Handling", description: "HTTP methods and status codes",
      content: "## HTTP Fundamentals\n\n### HTTP Methods\n- **GET** — Retrieve data\n- **POST** — Create data\n- **PUT** — Update data\n- **DELETE** — Remove data\n\n### Status Codes\n- **200** — OK\n- **201** — Created\n- **404** — Not Found\n- **500** — Server Error",
      codeExample: "codes = {200: \"OK\", 201: \"Created\", 404: \"Not Found\", 500: \"Server Error\"}\nfor code, msg in codes.items():\n    print(code, \"-\", msg)",
      exercises: {
        beginner: { prompt: "Create a dict with status codes. Print the meaning of 404.", starterCode: "codes = {200: \"OK\", 404: \"Not Found\", 500: \"Error\"}\nprint(codes[404])\n", expectedOutput: "Not Found" },
        intermediate: { prompt: "Write is_success(code) returning True if 200-299. Test with 201.", starterCode: "def is_success(code):\n    return 200 <= code <= 299\n\nprint(is_success(201))\n", expectedOutput: "True" },
        advanced: { prompt: "Map (method, path) tuples to handler names. Print handler for GET /users.", starterCode: "routes = {\n    (\"GET\", \"/users\"): \"list_users\",\n    (\"POST\", \"/users\"): \"create_user\",\n}\nprint(routes[(\"GET\", \"/users\")])\n", expectedOutput: "list_users" },
      },
    },
    {
      id: "wd-rest", title: "REST API Design", description: "Build clean RESTful APIs",
      content: "## REST APIs\n\nREST is the standard for building web APIs.\n\n### Principles\n- **Resources** — Everything is a resource\n- **URLs** — Each resource has a unique URL\n- **Methods** — CRUD maps to HTTP methods\n- **JSON** — Standard data format",
      codeExample: "import json\nusers = [{\"id\": 1, \"name\": \"Alice\"}, {\"id\": 2, \"name\": \"Bob\"}]\ndef get_user(uid):\n    for u in users:\n        if u[\"id\"] == uid:\n            return json.dumps(u)\n    return json.dumps({\"error\": \"Not found\"})\nprint(get_user(1))",
      exercises: {
        beginner: { prompt: "Create 2 user dicts. Print the first user's name.", starterCode: "users = [{\"id\": 1, \"name\": \"Alice\"}, {\"id\": 2, \"name\": \"Bob\"}]\nprint(users[0][\"name\"])\n", expectedOutput: "Alice" },
        intermediate: { prompt: "Write find_user(users, id) returning matching user. Print name for id=2.", starterCode: "users = [{\"id\": 1, \"name\": \"Alice\"}, {\"id\": 2, \"name\": \"Bob\"}]\ndef find_user(users, uid):\n    for u in users:\n        if u[\"id\"] == uid:\n            return u\n    return None\nprint(find_user(users, 2)[\"name\"])\n", expectedOutput: "Bob" },
        advanced: { prompt: "Add user with auto-increment id. Print new user's id.", starterCode: "users = [{\"id\": 1, \"name\": \"Alice\"}, {\"id\": 2, \"name\": \"Bob\"}]\ndef add_user(users, name):\n    new_id = max(u[\"id\"] for u in users) + 1\n    user = {\"id\": new_id, \"name\": name}\n    users.append(user)\n    return user\nresult = add_user(users, \"Charlie\")\nprint(result[\"id\"])\n", expectedOutput: "3" },
      },
    },
    {
      id: "wd-templates", title: "Templates & Rendering", description: "Dynamic HTML generation",
      content: "## Templates\n\nTemplates generate dynamic HTML by inserting Python variables.\n\n### Jinja2 Template Engine\n- Variables: {{ name }}\n- Logic: {% if condition %}\n- Loops: {% for item in list %}\n\n### Why Templates?\n- Separate logic from presentation\n- Reuse layouts\n- Dynamic content",
      codeExample: "def render(template, **kwargs):\n    result = template\n    for key, value in kwargs.items():\n        result = result.replace(\"{{ \" + key + \" }}\", str(value))\n    return result\n\nhtml = \"<h1>Hello, {{ name }}!</h1>\"\nprint(render(html, name=\"Alice\"))",
      exercises: {
        beginner: { prompt: "Use string formatting to print 'Hello, Alice!'.", starterCode: "name = \"Alice\"\nprint(\"Hello, \" + name + \"!\")\n", expectedOutput: "Hello, Alice!" },
        intermediate: { prompt: "Write render(template, data) replacing {name} with data['name']. Test it.", starterCode: "def render(template, data):\n    for key, val in data.items():\n        template = template.replace(\"{\" + key + \"}\", str(val))\n    return template\nprint(render(\"Hello, {name}!\", {\"name\": \"World\"}))\n", expectedOutput: "Hello, World!" },
        advanced: { prompt: "Generate an HTML list from items. Print '<ul><li>A</li><li>B</li><li>C</li></ul>'", starterCode: "items = [\"A\", \"B\", \"C\"]\nhtml = \"<ul>\" + \"\".join(\"<li>\" + i + \"</li>\" for i in items) + \"</ul>\"\nprint(html)\n", expectedOutput: "<ul><li>A</li><li>B</li><li>C</li></ul>" },
      },
    },
    {
      id: "wd-database", title: "Database Integration", description: "Connect Python to databases",
      content: "## Databases with Python\n\n### SQLite — Built into Python\n- No setup required\n- File-based database\n- Perfect for learning\n\n### SQL Basics\n- CREATE TABLE — Define structure\n- INSERT — Add data\n- SELECT — Query data\n- UPDATE — Modify data\n- DELETE — Remove data",
      codeExample: "table = [\n    {\"id\": 1, \"name\": \"Alice\", \"email\": \"alice@email.com\"},\n    {\"id\": 2, \"name\": \"Bob\", \"email\": \"bob@email.com\"},\n]\nresult = [r for r in table if r[\"id\"] == 1]\nprint(result[0][\"name\"])",
      exercises: {
        beginner: { prompt: "Create a list of tuples (1,'Alice'), (2,'Bob'). Print the second row.", starterCode: "rows = [(1, \"Alice\"), (2, \"Bob\")]\nprint(rows[1])\n", expectedOutput: "(2, 'Bob')" },
        intermediate: { prompt: "Filter tuples where id > 1. Print the result.", starterCode: "rows = [(1, \"Alice\"), (2, \"Bob\"), (3, \"Charlie\")]\nfiltered = [(id, name) for id, name in rows if id > 1]\nprint(filtered)\n", expectedOutput: "[(2, 'Bob'), (3, 'Charlie')]" },
        advanced: { prompt: "Filter records where age > 25. Print count.", starterCode: "table = [\n    {\"name\": \"Alice\", \"age\": 25},\n    {\"name\": \"Bob\", \"age\": 30},\n    {\"name\": \"Charlie\", \"age\": 22},\n    {\"name\": \"Diana\", \"age\": 28}\n]\nresult = [r for r in table if r[\"age\"] > 25]\nprint(len(result))\n", expectedOutput: "2" },
      },
    },
    {
      id: "wd-auth", title: "Authentication & Sessions", description: "User login, tokens, and session management",
      content: "## Authentication\n\nAuthentication verifies who a user is.\n\n### Methods\n- **Session-based** — Server stores session data\n- **Token-based (JWT)** — Client stores a signed token\n- **OAuth** — Login with Google, GitHub, etc.\n\n### Password Hashing\nNever store passwords in plain text! Use hashing.\n\n### JWT (JSON Web Token)\n- Header — Algorithm info\n- Payload — User data\n- Signature — Verifies integrity",
      codeExample: "import hashlib\nimport json\nimport base64\n\n# Simple password hashing\ndef hash_password(pwd):\n    return hashlib.sha256(pwd.encode()).hexdigest()\n\n# JWT-like token concept\ndef create_token(user_id, secret):\n    payload = json.dumps({\"user_id\": user_id})\n    encoded = base64.b64encode(payload.encode()).decode()\n    return encoded\n\ntoken = create_token(42, \"secret\")\nprint(\"Token:\", token)\nprint(\"Hash:\", hash_password(\"mypassword\")[:16] + \"...\")",
      exercises: {
        beginner: { prompt: "Hash the string 'password123' using hashlib.sha256. Print first 10 chars of the hex digest.", starterCode: "import hashlib\nhashed = hashlib.sha256(\"password123\".encode()).hexdigest()\nprint(hashed[:10])\n", expectedOutput: "ef92b778ba" },
        intermediate: { prompt: "Encode a dict {\"user\": \"Alice\"} to base64. Print the encoded string.", starterCode: "import json\nimport base64\ndata = json.dumps({\"user\": \"Alice\"})\nencoded = base64.b64encode(data.encode()).decode()\nprint(encoded)\n", expectedOutput: "eyJ1c2VyIjogIkFsaWNlIn0=" },
        advanced: { prompt: "Verify a password by comparing hashes. Print True if match.", starterCode: "import hashlib\ndef verify(password, stored_hash):\n    return hashlib.sha256(password.encode()).hexdigest() == stored_hash\n\nstored = hashlib.sha256(\"secret\".encode()).hexdigest()\nprint(verify(\"secret\", stored))\n", expectedOutput: "True" },
      },
    },
    {
      id: "wd-middleware", title: "Middleware & Error Handling", description: "Request processing pipelines and error management",
      content: "## Middleware\n\nMiddleware processes requests before they reach your routes.\n\n### Common Middleware\n- **Logging** — Log every request\n- **CORS** — Cross-origin resource sharing\n- **Rate Limiting** — Prevent abuse\n- **Authentication** — Verify tokens\n\n### Error Handling\n- Try/except for graceful failures\n- Custom error responses\n- Error logging and monitoring",
      codeExample: "# Middleware chain concept\ndef logging_middleware(request):\n    print(f\"LOG: {request['method']} {request['path']}\")\n    return request\n\ndef auth_middleware(request):\n    if 'token' not in request:\n        return {\"error\": \"Unauthorized\", \"status\": 401}\n    return request\n\nreq = {\"method\": \"GET\", \"path\": \"/api/data\", \"token\": \"abc123\"}\nreq = logging_middleware(req)\nresult = auth_middleware(req)\nprint(\"Status:\", result.get(\"status\", 200))",
      exercises: {
        beginner: { prompt: "Write a function that logs a request method and path. Test with GET /home.", starterCode: "def log_request(method, path):\n    print(f\"{method} {path}\")\n\nlog_request(\"GET\", \"/home\")\n", expectedOutput: "GET /home" },
        intermediate: { prompt: "Write rate_limit(requests, max_req) returning True if under limit. Test 5 < 10.", starterCode: "def rate_limit(requests, max_req):\n    return requests < max_req\n\nprint(rate_limit(5, 10))\n", expectedOutput: "True" },
        advanced: { prompt: "Chain 2 middleware functions on a request dict. Print final status.", starterCode: "def add_timestamp(req):\n    req[\"timestamp\"] = \"2024-01-01\"\n    return req\n\ndef validate(req):\n    req[\"valid\"] = \"path\" in req\n    return req\n\nreq = {\"path\": \"/api\"}\nreq = add_timestamp(validate(req))\nprint(req[\"valid\"])\n", expectedOutput: "True" },
      },
    },
    {
      id: "wd-deploy", title: "Deployment & DevOps", description: "Deploy Python web apps to production",
      content: "## Deploying Python Apps\n\n### Platforms\n- **Heroku** — Simple PaaS\n- **Railway / Render** — Modern alternatives\n- **AWS / GCP** — Full cloud\n- **Docker** — Containerization\n\n### Key Concepts\n- Environment variables for secrets\n- WSGI/ASGI servers (Gunicorn, Uvicorn)\n- Reverse proxy (Nginx)\n- CI/CD pipelines",
      codeExample: "import os\n\n# Environment variables pattern\ndef get_config():\n    return {\n        \"debug\": os.environ.get(\"DEBUG\", \"False\") == \"True\",\n        \"port\": int(os.environ.get(\"PORT\", 8000)),\n        \"db_url\": os.environ.get(\"DATABASE_URL\", \"sqlite:///local.db\"),\n    }\n\nconfig = get_config()\nprint(\"Port:\", config[\"port\"])\nprint(\"Debug:\", config[\"debug\"])",
      exercises: {
        beginner: { prompt: "Use os.environ.get with a default value. Print the result.", starterCode: "import os\nport = os.environ.get(\"PORT\", \"8000\")\nprint(port)\n", expectedOutput: "8000" },
        intermediate: { prompt: "Create a config dict from env vars with defaults. Print the database key.", starterCode: "import os\nconfig = {\n    \"host\": os.environ.get(\"HOST\", \"localhost\"),\n    \"database\": os.environ.get(\"DB\", \"myapp\")\n}\nprint(config[\"database\"])\n", expectedOutput: "myapp" },
        advanced: { prompt: "Parse a connection string 'postgres://user:pass@host:5432/db'. Print the host.", starterCode: "url = \"postgres://user:pass@host:5432/db\"\nparts = url.split(\"@\")[1].split(\":\")\nhost = parts[0]\nprint(host)\n", expectedOutput: "host" },
      },
    },
    {
      id: "wd-auth-security", title: "Authentication & Security Basics", description: "Passwords, sessions, JWT concepts, and common mistakes",
      content: "## Auth & Security (Web)\n\n### Authentication vs Authorization\n- **Authentication**: who you are\n- **Authorization**: what you can access\n\n### Password storage (must)\n- Never store plaintext passwords\n- Store a *salted hash* (e.g., PBKDF2/bcrypt/argon2)\n\n### Sessions vs JWT\n- **Sessions**: server stores session, browser stores cookie\n- **JWT**: server signs a token, browser stores token\n\n### Common pitfalls\n- Missing input validation\n- Insecure secrets in code\n- No rate limiting on login\n- Broken access control",
      codeExample: "import hashlib\n\n# Hash password (demo only; use proper password hash libs in real apps)\ndef hash_password(pwd, salt=\"mysalt\"):\n    return hashlib.sha256((salt + pwd).encode()).hexdigest()\n\nstored = hash_password(\"Pass123\")\nprint(stored[:12])\nprint(hash_password(\"Pass123\") == stored)\n",
      exercises: {
        beginner: { prompt: "Check if '/admin' starts with '/'. Print True/False.", starterCode: "path = \"/admin\"\nprint(path.startswith(\"/\"))\n", expectedOutput: "True" },
        intermediate: { prompt: "Validate username is at least 3 chars and alphanumeric. Test 'ab'. Print False.", starterCode: "u = \"ab\"\nok = len(u) >= 3 and u.isalnum()\nprint(ok)\n", expectedOutput: "False" },
        advanced: { prompt: "Implement a tiny rate-limit: allow max 3 tries. Given tries=4 print 'Blocked'.", starterCode: "tries = 4\nprint(\"Blocked\" if tries > 3 else \"OK\")\n", expectedOutput: "Blocked" },
      },
    },
    {
      id: "wd-testing", title: "Testing & Debugging Like a Pro", description: "Unit tests, integration tests, and predictable debugging",
      content: "## Testing\n\n### Why tests matter\n- Prevent regressions\n- Make refactors safe\n- Improve confidence before deploy\n\n### What to test\n- Pure functions: easiest\n- API routes: status code + JSON shape\n- Database logic: constraints and edge cases\n\n### Debugging checklist\n- Reproduce the bug\n- Reduce to a minimal case\n- Add logs for inputs/outputs\n- Write a test that fails, then fix",
      codeExample: "import unittest\n\ndef add(a, b):\n    return a + b\n\nclass TestAdd(unittest.TestCase):\n    def test_add(self):\n        self.assertEqual(add(2, 3), 5)\n\nif __name__ == \"__main__\":\n    suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestAdd)\n    result = unittest.TextTestRunner(verbosity=0).run(suite)\n    print(\"OK\" if result.wasSuccessful() else \"FAIL\")\n",
      exercises: {
        beginner: { prompt: "Write a function that returns 'OK' if status code is 200 else 'ERR'. Test 200 and print.", starterCode: "def status_label(code):\n    return \"OK\" if code == 200 else \"ERR\"\n\nprint(status_label(200))\n", expectedOutput: "OK" },
        intermediate: { prompt: "Given items=[1,2,3], assert length is 3 using a simple if and print 'pass'.", starterCode: "items = [1, 2, 3]\nif len(items) == 3:\n    print(\"pass\")\n", expectedOutput: "pass" },
        advanced: { prompt: "Given response={'user':{'id':1}}, check nested key exists safely and print True.", starterCode: "response = {\"user\": {\"id\": 1}}\nprint(\"user\" in response and \"id\" in response[\"user\"]) \n", expectedOutput: "True" },
      },
    },
  ];
}

function aiml(): CareerLesson[] {
  return [
    {
      id: "ml-intro", title: "What is Machine Learning?", description: "Core concepts and types of ML",
      content: "## Machine Learning Overview\n\nML teaches computers to learn from data without explicit programming.\n\n### Types of ML\n- **Supervised** — Learn from labeled data\n- **Unsupervised** — Find patterns in unlabeled data\n- **Reinforcement** — Learn by trial and error\n\n### The ML Workflow\n1. Collect & prepare data\n2. Choose a model\n3. Train the model\n4. Evaluate performance\n5. Deploy & monitor",
      codeExample: "features = [[1500, 3], [2000, 4], [1200, 2]]\nprices = [300000, 450000, 200000]\ntotal_sqft = sum(f[0] for f in features)\navg_price_per_sqft = sum(prices) / total_sqft\nnew_house = 1800\nprint(\"Predicted:\", int(new_house * avg_price_per_sqft))",
      exercises: {
        beginner: { prompt: "Calculate the mean of [1500, 2000, 1200]. Print rounded to 1 decimal.", starterCode: "features = [1500, 2000, 1200]\nmean = sum(features) / len(features)\nprint(round(mean, 1))\n", expectedOutput: "1566.7" },
        intermediate: { prompt: "Calculate mean absolute error between predicted=[300,450,200] and actual=[310,440,210]. Print it.", starterCode: "predicted = [300, 450, 200]\nactual = [310, 440, 210]\nerrors = [abs(p - a) for p, a in zip(predicted, actual)]\nmae = sum(errors) / len(errors)\nprint(round(mae, 1))\n", expectedOutput: "10.0" },
        advanced: { prompt: "Linear prediction y = mx + b. Given m=2, b=1, predict for x=[1,2,3,4,5]. Print list.", starterCode: "m = 2\nb = 1\nx_values = [1, 2, 3, 4, 5]\npredictions = [m * x + b for x in x_values]\nprint(predictions)\n", expectedOutput: "[3, 5, 7, 9, 11]" },
      },
    },
    {
      id: "ml-numpy", title: "NumPy Concepts for ML", description: "Array operations for machine learning",
      content: "## NumPy: Foundation of ML\n\nNumPy provides fast array operations.\n\n### Why NumPy?\n- 10-100x faster than Python lists\n- Vectorization — operate on entire arrays\n- Broadcasting — automatic shape alignment\n- Linear algebra built-in",
      codeExample: "a = [1, 2, 3]\nb = [4, 5, 6]\nresult = [x + y for x, y in zip(a, b)]\nprint(\"Add:\", result)\ndot = sum(x * y for x, y in zip(a, b))\nprint(\"Dot:\", dot)\nscaled = [x * 2 for x in a]\nprint(\"Scale:\", scaled)",
      exercises: {
        beginner: { prompt: "Add vectors [1,2,3] and [4,5,6] element-wise. Print result.", starterCode: "a = [1, 2, 3]\nb = [4, 5, 6]\nresult = [x + y for x, y in zip(a, b)]\nprint(result)\n", expectedOutput: "[5, 7, 9]" },
        intermediate: { prompt: "Calculate dot product of [1,2,3] and [4,5,6]. Print it.", starterCode: "a = [1, 2, 3]\nb = [4, 5, 6]\ndot = sum(x * y for x, y in zip(a, b))\nprint(dot)\n", expectedOutput: "32" },
        advanced: { prompt: "Calculate magnitude of vector [3,4]. Print it.", starterCode: "import math\nv = [3, 4]\nmagnitude = math.sqrt(sum(x**2 for x in v))\nprint(magnitude)\n", expectedOutput: "5.0" },
      },
    },
    {
      id: "ml-classification", title: "Classification Basics", description: "Predict categories from data",
      content: "## Classification\n\nPredicts which category a data point belongs to.\n\n### Examples\n- Email: Spam or Not Spam\n- Image: Cat or Dog\n- Transaction: Fraud or Legit\n\n### K-Nearest Neighbors (KNN)\n1. Calculate distance to all training points\n2. Find K nearest\n3. Majority vote = prediction",
      codeExample: "import math\ndata = [\n    [1, 2, \"A\"], [2, 3, \"A\"], [3, 1, \"A\"],\n    [6, 5, \"B\"], [7, 7, \"B\"], [8, 6, \"B\"],\n]\ndef distance(p1, p2):\n    return math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2)\nnew_point = [5, 5]\ndists = [(distance(new_point, d[:2]), d[2]) for d in data]\ndists.sort()\nprint(\"Nearest 3:\", [d[1] for d in dists[:3]])",
      exercises: {
        beginner: { prompt: "Calculate Euclidean distance between (0,0) and (3,4). Print it.", starterCode: "import math\nd = math.sqrt(3**2 + 4**2)\nprint(d)\n", expectedOutput: "5.0" },
        intermediate: { prompt: "Find majority vote from ['A','A','B','A','B']. Print it.", starterCode: "labels = [\"A\", \"A\", \"B\", \"A\", \"B\"]\ncounts = {}\nfor l in labels:\n    counts[l] = counts.get(l, 0) + 1\nprint(max(counts, key=counts.get))\n", expectedOutput: "A" },
        advanced: { prompt: "Calculate accuracy: predicted=['A','B','A','A'] vs actual=['A','B','B','A']. Print as percentage.", starterCode: "predicted = [\"A\", \"B\", \"A\", \"A\"]\nactual = [\"A\", \"B\", \"B\", \"A\"]\ncorrect = sum(p == a for p, a in zip(predicted, actual))\naccuracy = (correct / len(actual)) * 100\nprint(accuracy)\n", expectedOutput: "75.0" },
      },
    },
    {
      id: "ml-regression", title: "Linear Regression", description: "Predict continuous values with regression",
      content: "## Linear Regression\n\nPredict a continuous value from input features.\n\n### The Math\n- y = mx + b (slope-intercept)\n- m = slope (rate of change)\n- b = y-intercept\n\n### Training\n- Find m and b that minimize error\n- Cost function: Mean Squared Error\n- Gradient descent optimization\n\n### Applications\n- House price prediction\n- Stock forecasting\n- Sales estimation",
      codeExample: "# Simple linear regression from scratch\nX = [1, 2, 3, 4, 5]\ny = [2, 4, 5, 4, 5]\n\nn = len(X)\nmean_x = sum(X) / n\nmean_y = sum(y) / n\n\nnumerator = sum((X[i] - mean_x) * (y[i] - mean_y) for i in range(n))\ndenominator = sum((X[i] - mean_x) ** 2 for i in range(n))\n\nm = numerator / denominator\nb = mean_y - m * mean_x\n\nprint(\"Slope:\", round(m, 2))\nprint(\"Intercept:\", round(b, 2))\nprint(\"Predict x=6:\", round(m * 6 + b, 2))",
      exercises: {
        beginner: { prompt: "Given y=2x+1, predict y for x=5. Print it.", starterCode: "m = 2\nb = 1\nx = 5\ny = m * x + b\nprint(y)\n", expectedOutput: "11" },
        intermediate: { prompt: "Calculate MSE for predictions [2,4,6] vs actual [2.5,3.5,6]. Print rounded to 2 decimals.", starterCode: "pred = [2, 4, 6]\nactual = [2.5, 3.5, 6]\nmse = sum((p - a) ** 2 for p, a in zip(pred, actual)) / len(pred)\nprint(round(mse, 2))\n", expectedOutput: "0.17" },
        advanced: { prompt: "Calculate R-squared for predictions. Print rounded to 2 decimals.", starterCode: "actual = [3, 5, 7, 9]\npred = [2.8, 5.2, 6.8, 9.1]\nmean_a = sum(actual) / len(actual)\nss_res = sum((a - p) ** 2 for a, p in zip(actual, pred))\nss_tot = sum((a - mean_a) ** 2 for a in actual)\nr2 = 1 - (ss_res / ss_tot)\nprint(round(r2, 2))\n", expectedOutput: "0.99" },
      },
    },
    {
      id: "ml-neural-nets", title: "Neural Networks Basics", description: "Understand how neural networks work",
      content: "## Neural Networks\n\nInspired by the brain — layers of connected neurons.\n\n### Architecture\n- **Input Layer** — Receives features\n- **Hidden Layers** — Learn patterns\n- **Output Layer** — Makes predictions\n\n### Activation Functions\n- **ReLU** — max(0, x)\n- **Sigmoid** — 1/(1+e^-x) → outputs 0-1\n- **Softmax** — Multi-class probabilities\n\n### Training: Backpropagation\n1. Forward pass — compute output\n2. Calculate loss\n3. Backward pass — compute gradients\n4. Update weights",
      codeExample: "import math\n\n# Activation functions\ndef relu(x):\n    return max(0, x)\n\ndef sigmoid(x):\n    return 1 / (1 + math.exp(-x))\n\n# Simple neuron\ndef neuron(inputs, weights, bias):\n    total = sum(i * w for i, w in zip(inputs, weights)) + bias\n    return sigmoid(total)\n\nresult = neuron([1.0, 0.5], [0.8, 0.2], -0.1)\nprint(\"Output:\", round(result, 4))",
      exercises: {
        beginner: { prompt: "Implement ReLU: return max(0, x). Test with -3 and 5. Print results.", starterCode: "def relu(x):\n    return max(0, x)\n\nprint(relu(-3))\nprint(relu(5))\n", expectedOutput: "0\n5" },
        intermediate: { prompt: "Calculate sigmoid(0). Print rounded to 1 decimal.", starterCode: "import math\ndef sigmoid(x):\n    return 1 / (1 + math.exp(-x))\n\nprint(round(sigmoid(0), 1))\n", expectedOutput: "0.5" },
        advanced: { prompt: "Weighted sum of inputs=[1,2,3] with weights=[0.5,0.3,0.2] plus bias=0.1. Print rounded to 1.", starterCode: "inputs = [1, 2, 3]\nweights = [0.5, 0.3, 0.2]\nbias = 0.1\nresult = sum(i * w for i, w in zip(inputs, weights)) + bias\nprint(round(result, 1))\n", expectedOutput: "1.8" },
      },
    },
    {
      id: "ml-nlp", title: "Natural Language Processing", description: "Process and understand text with Python",
      content: "## NLP — Teaching Computers to Read\n\n### Text Processing Pipeline\n1. **Tokenization** — Split text into words\n2. **Lowercasing** — Normalize case\n3. **Stop words** — Remove common words (the, is, a)\n4. **Stemming** — Reduce to root (running → run)\n5. **Vectorization** — Convert text to numbers\n\n### Applications\n- Chatbots & virtual assistants\n- Sentiment analysis\n- Translation\n- Text summarization",
      codeExample: "# Simple NLP pipeline\ntext = \"The quick brown fox jumps over the lazy dog\"\n\n# Tokenize\ntokens = text.lower().split()\nprint(\"Tokens:\", len(tokens))\n\n# Remove stop words\nstop_words = {\"the\", \"over\", \"a\", \"is\", \"and\"}\nfiltered = [w for w in tokens if w not in stop_words]\nprint(\"Filtered:\", filtered)\n\n# Word frequency\nfreq = {}\nfor w in filtered:\n    freq[w] = freq.get(w, 0) + 1\nprint(\"Frequencies:\", freq)",
      exercises: {
        beginner: { prompt: "Tokenize 'Hello World Python' into a list. Print the list.", starterCode: "text = \"Hello World Python\"\ntokens = text.split()\nprint(tokens)\n", expectedOutput: "['Hello', 'World', 'Python']" },
        intermediate: { prompt: "Count word frequency in 'the cat sat on the mat'. Print frequency of 'the'.", starterCode: "text = \"the cat sat on the mat\"\nwords = text.split()\nfreq = {}\nfor w in words:\n    freq[w] = freq.get(w, 0) + 1\nprint(freq[\"the\"])\n", expectedOutput: "2" },
        advanced: { prompt: "Simple sentiment: count positive words. Print the count.", starterCode: "text = \"great amazing product but terrible shipping\"\npositive = {\"great\", \"amazing\", \"good\", \"excellent\"}\nwords = text.split()\ncount = sum(1 for w in words if w in positive)\nprint(count)\n", expectedOutput: "2" },
      },
    },
    {
      id: "ml-cv", title: "Computer Vision Concepts", description: "Image processing and recognition basics",
      content: "## Computer Vision\n\nTeach computers to see and understand images.\n\n### Key Concepts\n- **Pixels** — Image = grid of numbers\n- **Channels** — RGB (Red, Green, Blue)\n- **Filters/Kernels** — Detect edges, blur, sharpen\n- **CNNs** — Convolutional Neural Networks\n\n### Applications\n- Face recognition\n- Object detection\n- Self-driving cars\n- Medical imaging",
      codeExample: "# Image as a matrix concept\nimage = [\n    [0, 0, 255, 0, 0],\n    [0, 255, 255, 255, 0],\n    [255, 255, 255, 255, 255],\n    [0, 255, 255, 255, 0],\n    [0, 0, 255, 0, 0],\n]\n\n# Count bright pixels (> 128)\nbright = sum(1 for row in image for pixel in row if pixel > 128)\ntotal = sum(len(row) for row in image)\nprint(f\"Bright pixels: {bright}/{total}\")\nprint(f\"Brightness: {round(bright/total*100)}%\")",
      exercises: {
        beginner: { prompt: "Create a 3x3 grid of zeros. Print it.", starterCode: "grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]\nfor row in grid:\n    print(row)\n", expectedOutput: "[0, 0, 0]\n[0, 0, 0]\n[0, 0, 0]" },
        intermediate: { prompt: "Flatten a 2x3 matrix to a 1D list. Print it.", starterCode: "matrix = [[1, 2, 3], [4, 5, 6]]\nflat = [val for row in matrix for val in row]\nprint(flat)\n", expectedOutput: "[1, 2, 3, 4, 5, 6]" },
        advanced: { prompt: "Calculate average pixel value of image=[[100,200],[150,50]]. Print it.", starterCode: "image = [[100, 200], [150, 50]]\ntotal = sum(p for row in image for p in row)\ncount = sum(len(row) for row in image)\nprint(total / count)\n", expectedOutput: "125.0" },
      },
    },
    {
      id: "ml-feature-engineering", title: "Feature Engineering", description: "Turn raw data into model-ready signals",
      content: "## Feature Engineering\n\nModels learn from *features*.\n\n### Common transformations\n- **Scaling**: min-max, standardization\n- **Encoding**: one-hot for categories\n- **Text**: bag-of-words, TF-IDF (concept)\n- **Datetime**: day-of-week, month, hour\n\n### Rule of thumb\nIf a human can explain why a signal matters, it is often a good candidate feature.",
      codeExample: "# Simple scaling (min-max)\nx = [10, 20, 15, 30]\nmn, mx = min(x), max(x)\nscaled = [round((v - mn) / (mx - mn), 2) for v in x]\nprint(scaled)\n",
      exercises: {
        beginner: { prompt: "Compute min-max scaled value of v=5 with min=0 max=10. Print it.", starterCode: "v = 5\nmn = 0\nmx = 10\nprint((v - mn) / (mx - mn))\n", expectedOutput: "0.5" },
        intermediate: { prompt: "One-hot encode 'B' from categories=['A','B','C']. Print the list.", starterCode: "categories = [\"A\", \"B\", \"C\"]\nvalue = \"B\"\nvec = [1 if c == value else 0 for c in categories]\nprint(vec)\n", expectedOutput: "[0, 1, 0]" },
        advanced: { prompt: "Extract day-of-week from '2024-01-07' (Sunday). Print 'Sun'.", starterCode: "from datetime import datetime\ns = \"2024-01-07\"\nd = datetime.strptime(s, \"%Y-%m-%d\")\nprint(d.strftime(\"%a\"))\n", expectedOutput: "Sun" },
      },
    },
    {
      id: "ml-evaluation", title: "Model Evaluation & Metrics", description: "Accuracy, precision, recall, and confusion matrices",
      content: "## Evaluation\n\n### Why accuracy can be misleading\nIf 95% of transactions are not fraud, a model that always predicts \"not fraud\" is 95% accurate but useless.\n\n### Confusion matrix\n- TP: true positives\n- FP: false positives\n- TN: true negatives\n- FN: false negatives\n\n### Metrics\n- **Precision** = TP / (TP + FP)\n- **Recall** = TP / (TP + FN)\n- **F1** = harmonic mean of precision and recall",
      codeExample: "# Compute precision/recall from predictions\nactual = [1, 0, 1, 1, 0]\npred =   [1, 0, 0, 1, 1]\n\nTP = sum(1 for a, p in zip(actual, pred) if a == 1 and p == 1)\nFP = sum(1 for a, p in zip(actual, pred) if a == 0 and p == 1)\nFN = sum(1 for a, p in zip(actual, pred) if a == 1 and p == 0)\n\nprecision = TP / (TP + FP) if TP + FP else 0\nrecall = TP / (TP + FN) if TP + FN else 0\nprint(round(precision, 2), round(recall, 2))\n",
      exercises: {
        beginner: { prompt: "Given TP=3, FP=1, compute precision. Print 0.75.", starterCode: "TP = 3\nFP = 1\nprint(TP / (TP + FP))\n", expectedOutput: "0.75" },
        intermediate: { prompt: "Given TP=2, FN=1, compute recall. Print 0.6666666666666666.", starterCode: "TP = 2\nFN = 1\nprint(TP / (TP + FN))\n", expectedOutput: "0.6666666666666666" },
        advanced: { prompt: "Compute accuracy for actual=[1,0,1,0] pred=[1,1,1,0]. Print 0.75.", starterCode: "actual = [1, 0, 1, 0]\npred = [1, 1, 1, 0]\ncorrect = sum(1 for a, p in zip(actual, pred) if a == p)\nprint(correct / len(actual))\n", expectedOutput: "0.75" },
      },
    },
  ];
}

function auto(): CareerLesson[] {
  return [
    {
      id: "auto-intro", title: "Python Automation Basics", description: "Automate repetitive tasks",
      content: "## Why Automation?\n\nIf you do something more than twice, automate it.\n\n### What Can You Automate?\n- File organization & renaming\n- Data entry & form filling\n- Email sending & reporting\n- Web scraping & data collection\n- System monitoring\n\n### Python's Toolkit\n- os / shutil — File operations\n- requests — HTTP calls\n- BeautifulSoup — Web scraping\n- schedule — Task scheduling",
      codeExample: "files = [\"report_jan.csv\", \"report_feb.csv\", \"image.png\", \"report_mar.csv\"]\ncsv_files = [f for f in files if f.endswith(\".csv\")]\nprint(\"CSV files:\", csv_files)\nfor f in csv_files:\n    month = f.split(\"_\")[1].split(\".\")[0]\n    print(\" \", month, \"->\", f)",
      exercises: {
        beginner: { prompt: "Filter image files (.png, .jpg) from a list. Print count.", starterCode: "files = [\"doc.pdf\", \"img.png\", \"data.csv\", \"pic.jpg\"]\nimages = [f for f in files if f.endswith((\".png\", \".jpg\"))]\nprint(len(images))\n", expectedOutput: "2" },
        intermediate: { prompt: "Add 'backup_' prefix to filenames. Print new list.", starterCode: "files = [\"data.csv\", \"config.json\"]\nrenamed = [\"backup_\" + f for f in files]\nprint(renamed)\n", expectedOutput: "['backup_data.csv', 'backup_config.json']" },
        advanced: { prompt: "Count ERROR entries in log lines. Print the count.", starterCode: "logs = [\n    \"INFO: Server started\",\n    \"ERROR: Connection failed\",\n    \"INFO: Request processed\",\n    \"ERROR: Timeout\",\n    \"ERROR: Disk full\"\n]\nerror_count = sum(1 for log in logs if log.startswith(\"ERROR\"))\nprint(error_count)\n", expectedOutput: "3" },
      },
    },
    {
      id: "auto-scraping", title: "Web Scraping Basics", description: "Extract data from websites",
      content: "## Web Scraping\n\nExtract data from websites programmatically.\n\n### How It Works\n1. Send HTTP request\n2. Parse HTML content\n3. Extract needed data\n4. Store it\n\n### Tools\n- requests — Fetch pages\n- BeautifulSoup — Parse HTML\n- Scrapy — Full framework",
      codeExample: "html = '<h1>Welcome</h1><p class=\"price\">29.99</p><p class=\"price\">49.99</p>'\nimport re\nprices = re.findall(r'class=\"price\">(\\d+\\.\\d+)', html)\nprint(\"Prices found:\", prices)\nprint(\"Total:\", sum(float(p) for p in prices))",
      exercises: {
        beginner: { prompt: "Extract text between <h1> tags. Print it.", starterCode: "html = \"<h1>Hello World</h1>\"\ntext = html.replace(\"<h1>\", \"\").replace(\"</h1>\", \"\")\nprint(text)\n", expectedOutput: "Hello World" },
        intermediate: { prompt: "Parse '$29.99' to a float and print it.", starterCode: "price_str = \"$29.99\"\nprice = float(price_str.replace(\"$\", \"\"))\nprint(price)\n", expectedOutput: "29.99" },
        advanced: { prompt: "Count URLs starting with 'https' in a text. Print count.", starterCode: "text = \"Visit https://example.com or http://old.com or https://secure.org\"\nwords = text.split()\nhttps_count = sum(1 for w in words if w.startswith(\"https://\"))\nprint(https_count)\n", expectedOutput: "2" },
      },
    },
    {
      id: "auto-regex", title: "Regular Expressions", description: "Pattern matching for text automation",
      content: "## Regular Expressions (Regex)\n\nRegex lets you search for patterns in text.\n\n### Common Patterns\n- \\d — Any digit\n- \\w — Any word character\n- . — Any character\n- * — Zero or more\n- + — One or more\n- [] — Character class\n\n### Python's re module\n- re.search() — Find first match\n- re.findall() — Find all matches\n- re.sub() — Replace matches",
      codeExample: "import re\n\ntext = \"Contact us at support@example.com or sales@company.org\"\n\n# Find all emails\nemails = re.findall(r'[\\w.]+@[\\w.]+', text)\nprint(\"Emails:\", emails)\n\n# Find all phone-like patterns\nphones = \"Call 555-1234 or 555-5678\"\nnumbers = re.findall(r'\\d{3}-\\d{4}', phones)\nprint(\"Numbers:\", numbers)",
      exercises: {
        beginner: { prompt: "Find all digits in 'abc123def456'. Print them as a list.", starterCode: "import re\ntext = \"abc123def456\"\ndigits = re.findall(r'\\d+', text)\nprint(digits)\n", expectedOutput: "['123', '456']" },
        intermediate: { prompt: "Extract email domains from 'user@gmail.com admin@yahoo.com'. Print them.", starterCode: "import re\ntext = \"user@gmail.com admin@yahoo.com\"\ndomains = re.findall(r'@([\\w.]+)', text)\nprint(domains)\n", expectedOutput: "['gmail.com', 'yahoo.com']" },
        advanced: { prompt: "Replace all digits with '#' in 'Phone: 555-1234'. Print result.", starterCode: "import re\ntext = \"Phone: 555-1234\"\nresult = re.sub(r'\\d', '#', text)\nprint(result)\n", expectedOutput: "Phone: ###-####" },
      },
    },
    {
      id: "auto-api", title: "API Integration", description: "Connect to external services via APIs",
      content: "## API Integration\n\nAPIs let your scripts talk to other services.\n\n### REST API Basics\n- GET — Read data\n- POST — Send data\n- Headers — Authentication, content type\n- JSON — Standard data format\n\n### Common APIs\n- Weather data\n- Social media\n- Payment processing\n- Email services",
      codeExample: "import json\n\n# Simulating API response\napi_response = json.dumps({\n    \"status\": \"success\",\n    \"data\": {\"temp\": 72, \"city\": \"New York\"},\n    \"count\": 1\n})\n\nparsed = json.loads(api_response)\nprint(\"City:\", parsed[\"data\"][\"city\"])\nprint(\"Temp:\", parsed[\"data\"][\"temp\"])",
      exercises: {
        beginner: { prompt: "Parse JSON string '{\"name\": \"Alice\"}'. Print the name.", starterCode: "import json\ndata = json.loads('{\"name\": \"Alice\"}')\nprint(data[\"name\"])\n", expectedOutput: "Alice" },
        intermediate: { prompt: "Convert a dict to JSON string. Print it.", starterCode: "import json\ndata = {\"status\": \"ok\", \"code\": 200}\nresult = json.dumps(data)\nprint(result)\n", expectedOutput: '{"status": "ok", "code": 200}' },
        advanced: { prompt: "Build a query string from dict params. Print it.", starterCode: "params = {\"q\": \"python\", \"page\": \"1\", \"sort\": \"new\"}\nquery = \"&\".join(f\"{k}={v}\" for k, v in params.items())\nprint(query)\n", expectedOutput: "q=python&page=1&sort=new" },
      },
    },
    {
      id: "auto-scheduling", title: "Task Scheduling & Cron", description: "Run scripts on a schedule",
      content: "## Task Scheduling\n\nAutomate when scripts run.\n\n### Methods\n- **time.sleep()** — Simple delays\n- **schedule library** — Readable scheduling\n- **cron (Linux)** — OS-level scheduling\n- **Windows Task Scheduler**\n\n### Use Cases\n- Daily report generation\n- Hourly data sync\n- Monitoring & alerts\n- Backup automation",
      codeExample: "import time\nfrom datetime import datetime\n\n# Simulating a scheduled task\ndef run_task():\n    now = datetime.now().strftime(\"%H:%M:%S\")\n    print(f\"[{now}] Task executed\")\n\n# Simulating cron-like schedule\nschedule = {\n    \"daily_report\": \"08:00\",\n    \"hourly_sync\": \"every 1h\",\n    \"backup\": \"02:00\"\n}\n\nfor task, when in schedule.items():\n    print(f\"{task}: runs at {when}\")",
      exercises: {
        beginner: { prompt: "Get current hour using datetime. Print it.", starterCode: "from datetime import datetime\nhour = datetime.now().hour\nprint(type(hour).__name__)\n", expectedOutput: "int" },
        intermediate: { prompt: "Create a schedule dict with 3 tasks. Print the number of tasks.", starterCode: "schedule = {\n    \"backup\": \"02:00\",\n    \"report\": \"08:00\",\n    \"sync\": \"12:00\"\n}\nprint(len(schedule))\n", expectedOutput: "3" },
        advanced: { prompt: "Parse cron-like string '*/5 * * * *'. Print the interval (5).", starterCode: "cron = \"*/5 * * * *\"\nminute_field = cron.split()[0]\ninterval = int(minute_field.split(\"/\")[1])\nprint(interval)\n", expectedOutput: "5" },
      },
    },
    {
      id: "auto-email", title: "Email Automation", description: "Send automated emails with Python",
      content: "## Email Automation\n\nAutomate sending emails for reports, alerts, notifications.\n\n### Python Email Libraries\n- **smtplib** — Built-in SMTP client\n- **email.mime** — Create rich email messages\n- **SendGrid / Mailgun** — Cloud email APIs\n\n### Email Structure\n- From, To, Subject\n- Body (plain text or HTML)\n- Attachments",
      codeExample: "# Email template builder\ndef build_email(to, subject, body, attachments=None):\n    email = {\n        \"to\": to,\n        \"subject\": subject,\n        \"body\": body,\n        \"attachments\": attachments or []\n    }\n    return email\n\nemail = build_email(\n    \"user@example.com\",\n    \"Daily Report\",\n    \"Here is your report for today.\"\n)\nprint(f\"To: {email['to']}\")\nprint(f\"Subject: {email['subject']}\")",
      exercises: {
        beginner: { prompt: "Create an email dict with 'to', 'subject', 'body'. Print the subject.", starterCode: "email = {\"to\": \"alice@mail.com\", \"subject\": \"Hello\", \"body\": \"Hi there\"}\nprint(email[\"subject\"])\n", expectedOutput: "Hello" },
        intermediate: { prompt: "Format an email body with variables. Print it.", starterCode: "name = \"Alice\"\ntotal = 150\nbody = f\"Dear {name}, your total is ${total}.\"\nprint(body)\n", expectedOutput: "Dear Alice, your total is $150." },
        advanced: { prompt: "Build a recipient list from a CSV-like string. Print the count.", starterCode: "csv = \"alice@mail.com,bob@mail.com,charlie@mail.com\"\nrecipients = csv.split(\",\")\nprint(len(recipients))\n", expectedOutput: "3" },
      },
    },
    {
      id: "auto-cli-logging", title: "CLI Tools & Logging", description: "Build reusable command-line scripts with good logs",
      content: "## CLI Tools\n\nA lot of real automation is just clean CLI scripts.\n\n### Must-have skills\n- **argparse** — parse command-line arguments\n- **logging** — structured output you can trust\n- **exit codes** — tell other tools success/failure\n\n### Logging levels\n- DEBUG: details\n- INFO: normal progress\n- WARNING: something odd\n- ERROR: failed",
      codeExample: "import logging\n\nlogging.basicConfig(level=logging.INFO, format=\"%(levelname)s: %(message)s\")\n\ndef run(task):\n    logging.info(\"Starting %s\", task)\n    if task == \"backup\":\n        logging.info(\"Backup complete\")\n        return 0\n    logging.error(\"Unknown task\")\n    return 1\n\ncode = run(\"backup\")\nprint(code)\n",
      exercises: {
        beginner: { prompt: "Print 'INFO' if ok=True else 'ERROR'.", starterCode: "ok = True\nprint(\"INFO\" if ok else \"ERROR\")\n", expectedOutput: "INFO" },
        intermediate: { prompt: "Write a function exit_code(success) returns 0 if True else 1. Print for False.", starterCode: "def exit_code(success):\n    return 0 if success else 1\n\nprint(exit_code(False))\n", expectedOutput: "1" },
        advanced: { prompt: "Given args=['--task','clean'], parse task value without argparse and print it.", starterCode: "args = [\"--task\", \"clean\"]\nidx = args.index(\"--task\")\nprint(args[idx + 1])\n", expectedOutput: "clean" },
      },
    },
    {
      id: "auto-concurrency", title: "Concurrency for Faster Automation", description: "Run multiple tasks in parallel safely",
      content: "## Concurrency\n\nWhen automation feels slow, it is often waiting on I/O (network, disk).\n\n### Options\n- **threads**: good for I/O bound tasks\n- **async**: good for many network calls\n- **processes**: for CPU heavy work\n\n### Safety rules\n- Limit parallelism (do not spawn 1000 tasks)\n- Timeouts everywhere\n- Retries with backoff for network calls",
      codeExample: "from concurrent.futures import ThreadPoolExecutor\n\nitems = [1, 2, 3, 4]\n\ndef work(x):\n    return x * x\n\nwith ThreadPoolExecutor(max_workers=2) as ex:\n    results = list(ex.map(work, items))\n\nprint(results)\n",
      exercises: {
        beginner: { prompt: "Square numbers [1,2,3] using a loop and print list.", starterCode: "nums = [1, 2, 3]\nout = []\nfor n in nums:\n    out.append(n * n)\nprint(out)\n", expectedOutput: "[1, 4, 9]" },
        intermediate: { prompt: "Use list comprehension to double [2,4,6]. Print list.", starterCode: "nums = [2, 4, 6]\nprint([n * 2 for n in nums])\n", expectedOutput: "[4, 8, 12]" },
        advanced: { prompt: "Given tasks=['a','b','c'], limit concurrency to 2. Print 2.", starterCode: "tasks = [\"a\", \"b\", \"c\"]\nmax_workers = min(2, len(tasks))\nprint(max_workers)\n", expectedOutput: "2" },
      },
    },
  ];
}

function de(): CareerLesson[] {
  return [
    {
      id: "de-intro", title: "Data Engineering Fundamentals", description: "Pipelines, ETL, and data infrastructure",
      content: "## What is Data Engineering?\n\nData engineers build infrastructure that makes data usable.\n\n### Key Concepts\n- **ETL** — Extract, Transform, Load\n- **Data Pipeline** — Automated data flow\n- **Data Warehouse** — Centralized store\n- **Data Lake** — Raw data storage\n\n### ETL Process\n1. Extract — Pull from sources\n2. Transform — Clean, validate\n3. Load — Store in destination",
      codeExample: "def extract():\n    return [{\"name\": \"Alice\", \"age\": \"25\"}, {\"name\": \"Bob\", \"age\": \"thirty\"}]\n\ndef transform(data):\n    clean = []\n    for row in data:\n        try:\n            row[\"age\"] = int(row[\"age\"])\n            clean.append(row)\n        except ValueError:\n            print(\"Skipping:\", row[\"name\"])\n    return clean\n\ndef load(data):\n    for row in data:\n        print(\"Loaded:\", row[\"name\"])\n\nload(transform(extract()))",
      exercises: {
        beginner: { prompt: "Remove None values from a list. Print clean list.", starterCode: "data = [1, None, 3, None, 5]\nclean = [x for x in data if x is not None]\nprint(clean)\n", expectedOutput: "[1, 3, 5]" },
        intermediate: { prompt: "Convert string numbers to int, skip invalid. Print valid count.", starterCode: "raw = [\"10\", \"20\", \"abc\", \"40\", \"xyz\"]\nvalid = []\nfor item in raw:\n    try:\n        valid.append(int(item))\n    except ValueError:\n        pass\nprint(len(valid))\n", expectedOutput: "3" },
        advanced: { prompt: "ETL: uppercase all names. Print first transformed name.", starterCode: "data = [{\"name\": \"alice\"}, {\"name\": \"bob\"}]\ntransformed = [{\"name\": d[\"name\"].upper()} for d in data]\nprint(transformed[0][\"name\"])\n", expectedOutput: "ALICE" },
      },
    },
    {
      id: "de-sql", title: "SQL for Data Engineers", description: "Master SQL queries and database design",
      content: "## SQL Mastery\n\nData engineers live and breathe SQL.\n\n### Advanced SQL\n- **JOINs** — Combine tables\n- **GROUP BY** — Aggregate data\n- **Window Functions** — Running totals, rankings\n- **Subqueries** — Queries within queries\n- **CTEs** — Common Table Expressions\n\n### Database Design\n- Normalization (1NF, 2NF, 3NF)\n- Star schema vs snowflake\n- Indexing strategies",
      codeExample: "# Simulating SQL operations in Python\norders = [\n    {\"id\": 1, \"customer\": \"Alice\", \"amount\": 100},\n    {\"id\": 2, \"customer\": \"Bob\", \"amount\": 200},\n    {\"id\": 3, \"customer\": \"Alice\", \"amount\": 150},\n]\n\n# GROUP BY customer, SUM(amount)\nfrom collections import defaultdict\ntotals = defaultdict(int)\nfor o in orders:\n    totals[o[\"customer\"]] += o[\"amount\"]\n\nfor customer, total in totals.items():\n    print(f\"{customer}: ${total}\")",
      exercises: {
        beginner: { prompt: "Group items by category and count. Print Engineering count.", starterCode: "items = [\"Engineering\", \"Marketing\", \"Engineering\", \"Sales\"]\ncounts = {}\nfor item in items:\n    counts[item] = counts.get(item, 0) + 1\nprint(counts[\"Engineering\"])\n", expectedOutput: "2" },
        intermediate: { prompt: "Simulate a LEFT JOIN. Print matched count.", starterCode: "users = [{\"id\": 1, \"name\": \"Alice\"}, {\"id\": 2, \"name\": \"Bob\"}]\norders = [{\"user_id\": 1, \"item\": \"Book\"}, {\"user_id\": 1, \"item\": \"Pen\"}]\njoined = [(u, [o for o in orders if o[\"user_id\"] == u[\"id\"]]) for u in users]\nprint(len(joined[0][1]))\n", expectedOutput: "2" },
        advanced: { prompt: "Calculate running total of [100, 200, 150, 300]. Print the list.", starterCode: "values = [100, 200, 150, 300]\nrunning = []\ntotal = 0\nfor v in values:\n    total += v\n    running.append(total)\nprint(running)\n", expectedOutput: "[100, 300, 450, 750]" },
      },
    },
    {
      id: "de-pipelines", title: "Building Data Pipelines", description: "Design and implement data workflows",
      content: "## Data Pipelines\n\nAutomate the flow of data from source to destination.\n\n### Pipeline Components\n1. **Source** — Where data comes from\n2. **Processor** — Transform/clean\n3. **Sink** — Where data goes\n4. **Scheduler** — When it runs\n5. **Monitor** — Track failures\n\n### Pipeline Patterns\n- Batch processing (hourly/daily)\n- Stream processing (real-time)\n- Lambda architecture (batch + stream)",
      codeExample: "# Pipeline builder pattern\nclass Pipeline:\n    def __init__(self):\n        self.steps = []\n    \n    def add_step(self, name, func):\n        self.steps.append((name, func))\n        return self\n    \n    def run(self, data):\n        for name, func in self.steps:\n            data = func(data)\n            print(f\"Step '{name}': {len(data)} records\")\n        return data\n\np = Pipeline()\np.add_step(\"filter\", lambda d: [x for x in d if x > 0])\np.add_step(\"double\", lambda d: [x * 2 for x in d])\nresult = p.run([-1, 2, -3, 4, 5])\nprint(\"Result:\", result)",
      exercises: {
        beginner: { prompt: "Apply two transformations: filter positives, then double. Print result.", starterCode: "data = [-1, 2, -3, 4]\nstep1 = [x for x in data if x > 0]\nstep2 = [x * 2 for x in step1]\nprint(step2)\n", expectedOutput: "[4, 8]" },
        intermediate: { prompt: "Chain 3 string transformations on a list. Print result.", starterCode: "names = [\" Alice \", \" BOB \", \" charlie \"]\ncleaned = [n.strip().lower().capitalize() for n in names]\nprint(cleaned)\n", expectedOutput: "['Alice', 'Bob', 'Charlie']" },
        advanced: { prompt: "Implement a simple pipeline using functions. Print final count.", starterCode: "def extract():\n    return list(range(10))\n\ndef transform(data):\n    return [x for x in data if x % 2 == 0]\n\ndef load(data):\n    return len(data)\n\nresult = load(transform(extract()))\nprint(result)\n", expectedOutput: "5" },
      },
    },
    {
      id: "de-streaming", title: "Stream Processing", description: "Handle real-time data streams",
      content: "## Stream Processing\n\nProcess data as it arrives, not in batches.\n\n### Concepts\n- **Events** — Individual data points\n- **Producers** — Generate events\n- **Consumers** — Process events\n- **Topics** — Event categories\n- **Windowing** — Group events by time\n\n### Tools\n- Apache Kafka — Event streaming\n- Apache Flink — Stream processing\n- Redis Streams — Lightweight streaming",
      codeExample: "from collections import deque\n\n# Simulating a message queue\nclass MessageQueue:\n    def __init__(self):\n        self.queue = deque()\n    \n    def produce(self, message):\n        self.queue.append(message)\n    \n    def consume(self):\n        return self.queue.popleft() if self.queue else None\n\nmq = MessageQueue()\nmq.produce({\"event\": \"click\", \"user\": \"Alice\"})\nmq.produce({\"event\": \"purchase\", \"user\": \"Bob\"})\n\nwhile msg := mq.consume():\n    print(f\"Processing: {msg['event']} by {msg['user']}\")",
      exercises: {
        beginner: { prompt: "Use deque as a queue. Add 3 items, pop first. Print it.", starterCode: "from collections import deque\nq = deque()\nq.append(\"a\")\nq.append(\"b\")\nq.append(\"c\")\nprint(q.popleft())\n", expectedOutput: "a" },
        intermediate: { prompt: "Implement sliding window average for [1,3,5,7,9] with window=3. Print last avg.", starterCode: "data = [1, 3, 5, 7, 9]\nwindow = 3\navgs = []\nfor i in range(len(data) - window + 1):\n    avg = sum(data[i:i+window]) / window\n    avgs.append(round(avg, 1))\nprint(avgs[-1])\n", expectedOutput: "7.0" },
        advanced: { prompt: "Count events by type from a stream. Print click count.", starterCode: "events = [\"click\", \"view\", \"click\", \"purchase\", \"click\", \"view\"]\ncounts = {}\nfor e in events:\n    counts[e] = counts.get(e, 0) + 1\nprint(counts[\"click\"])\n", expectedOutput: "3" },
      },
    },
    {
      id: "de-cloud", title: "Cloud Data Platforms", description: "AWS, GCP, and Azure for data engineering",
      content: "## Cloud Data Platforms\n\n### AWS Data Services\n- **S3** — Object storage\n- **Redshift** — Data warehouse\n- **Glue** — ETL service\n- **Kinesis** — Streaming\n\n### GCP Data Services\n- **BigQuery** — Serverless analytics\n- **Cloud Storage** — Object storage\n- **Dataflow** — Stream & batch processing\n\n### Key Concepts\n- Infrastructure as Code\n- Auto-scaling\n- Cost optimization",
      codeExample: "# Cloud storage path patterns\ndef s3_path(bucket, prefix, date, filename):\n    return f\"s3://{bucket}/{prefix}/{date}/{filename}\"\n\n# Partitioned data paths\nfor month in [\"2024-01\", \"2024-02\", \"2024-03\"]:\n    path = s3_path(\"data-lake\", \"sales\", month, \"data.parquet\")\n    print(path)",
      exercises: {
        beginner: { prompt: "Build an S3-like path string. Print it.", starterCode: "bucket = \"my-bucket\"\nkey = \"data/file.csv\"\npath = f\"s3://{bucket}/{key}\"\nprint(path)\n", expectedOutput: "s3://my-bucket/data/file.csv" },
        intermediate: { prompt: "Generate partitioned paths for 3 dates. Print count.", starterCode: "dates = [\"2024-01-01\", \"2024-01-02\", \"2024-01-03\"]\npaths = [f\"data/date={d}/part.parquet\" for d in dates]\nprint(len(paths))\n", expectedOutput: "3" },
        advanced: { prompt: "Parse an S3 path to extract bucket and key. Print the bucket.", starterCode: "path = \"s3://analytics-bucket/raw/users/data.csv\"\nparts = path.replace(\"s3://\", \"\").split(\"/\", 1)\nprint(parts[0])\n", expectedOutput: "analytics-bucket" },
      },
    },
    {
      id: "de-data-modeling", title: "Data Modeling Mastery", description: "Dimensional modeling, keys, and schema design",
      content: "## Data Modeling\n\nGood models make analytics easy.\n\n### Common models\n- **Star schema**: fact table + dimension tables\n- **Snowflake**: normalized dimensions\n\n### Key ideas\n- **Primary key**: unique row id\n- **Foreign key**: links tables\n- **Grain**: what one row represents\n\n### Interview gold\nAlways state the grain first. It avoids 50% of modeling bugs.",
      codeExample: "# Fact table grain example\nfacts = [\n    {\"order_id\": 1, \"user_id\": 10, \"amount\": 50},\n    {\"order_id\": 2, \"user_id\": 10, \"amount\": 20},\n    {\"order_id\": 3, \"user_id\": 11, \"amount\": 30},\n]\n\n# Aggregate to user grain\nby_user = {}\nfor f in facts:\n    by_user[f[\"user_id\"]] = by_user.get(f[\"user_id\"], 0) + f[\"amount\"]\nprint(by_user[10])\n",
      exercises: {
        beginner: { prompt: "Print the grain phrase: 'one row = one order'.", starterCode: "print(\"one row = one order\")\n", expectedOutput: "one row = one order" },
        intermediate: { prompt: "Given orders=[(1,10),(2,10),(3,11)], count orders for user 10 and print 2.", starterCode: "orders = [(1, 10), (2, 10), (3, 11)]\ncount = sum(1 for oid, uid in orders if uid == 10)\nprint(count)\n", expectedOutput: "2" },
        advanced: { prompt: "Detect duplicate primary keys in ids=[1,2,2,3]. Print True.", starterCode: "ids = [1, 2, 2, 3]\nprint(len(ids) != len(set(ids)))\n", expectedOutput: "True" },
      },
    },
    {
      id: "de-data-quality", title: "Data Quality & Reliability", description: "Validation checks, null handling, and pipeline trust",
      content: "## Data Quality\n\nIf data is wrong, everything is wrong.\n\n### Common checks\n- Not null for key columns\n- Uniqueness for ids\n- Valid ranges (age 0-120)\n- Referential integrity (foreign keys exist)\n\n### Reliability habits\n- Add checks at every stage\n- Fail fast for bad data\n- Track metrics: rows in/out, null rate, duplicates",
      codeExample: "# Simple data validation checks\nrows = [\n    {\"id\": 1, \"age\": 25},\n    {\"id\": 2, \"age\": None},\n    {\"id\": 2, \"age\": 40},\n]\n\nids = [r[\"id\"] for r in rows]\nnull_age = sum(1 for r in rows if r[\"age\"] is None)\nduplicates = len(ids) - len(set(ids))\nprint(null_age, duplicates)\n",
      exercises: {
        beginner: { prompt: "Count None values in [1,None,2,None]. Print 2.", starterCode: "data = [1, None, 2, None]\nprint(sum(1 for x in data if x is None))\n", expectedOutput: "2" },
        intermediate: { prompt: "Check if all ages are between 0 and 120 for ages=[10,50,130]. Print False.", starterCode: "ages = [10, 50, 130]\nok = all(0 <= a <= 120 for a in ages)\nprint(ok)\n", expectedOutput: "False" },
        advanced: { prompt: "Compute duplicate count for ids=[1,2,2,2]. Print 2.", starterCode: "ids = [1, 2, 2, 2]\ndups = len(ids) - len(set(ids))\nprint(dups)\n", expectedOutput: "2" },
      },
    },
  ];
}

function cs(): CareerLesson[] {
  return [
    {
      id: "cs-intro", title: "Python for Cybersecurity", description: "Security fundamentals with Python",
      content: "## Cybersecurity with Python\n\nPython is widely used by security teams for **defense**, **automation**, and **incident response**.\n\n### First Rule (Important)\nOnly test systems you **own** or have **written permission** to test. Learning security is great, but \"hacking anything\" is illegal and harmful.\n\n### Applications\n- Security automation\n- Log analysis and detection\n- Forensics\n- Secure coding and hardening\n- Authorized security testing (with permission)\n\n### Key Libraries\n- hashlib — Hashing (MD5, SHA256)\n- hmac — Secure comparisons and signatures\n- secrets — Secure random tokens\n- cryptography — Encryption\n- socket — Network programming (safe diagnostics)\n- re/json/csv — Parsing security logs",
      codeExample: "import hashlib\npassword = \"SecurePass123\"\nhashed = hashlib.sha256(password.encode()).hexdigest()\nprint(\"SHA256:\", hashed[:20] + \"...\")\n\ndef verify(pwd, hash_val):\n    return hashlib.sha256(pwd.encode()).hexdigest() == hash_val\nprint(\"Valid:\", verify(\"SecurePass123\", hashed))\nprint(\"Invalid:\", verify(\"wrong\", hashed))",
      exercises: {
        beginner: { prompt: "Caesar cipher: shift 'abc' by 1. Print encrypted.", starterCode: "text = \"abc\"\nencrypted = \"\".join(chr(ord(c) + 1) for c in text)\nprint(encrypted)\n", expectedOutput: "bcd" },
        intermediate: { prompt: "Check password strength: 8+ chars, has digit, has uppercase. Test 'Secure1!'. Print True/False.", starterCode: "pwd = \"Secure1!\"\nis_strong = len(pwd) >= 8 and any(c.isdigit() for c in pwd) and any(c.isupper() for c in pwd)\nprint(is_strong)\n", expectedOutput: "True" },
        advanced: { prompt: "XOR encrypt 'Hi' with key=42. Print list of encrypted values.", starterCode: "text = \"Hi\"\nkey = 42\nencrypted = [ord(c) ^ key for c in text]\nprint(encrypted)\n", expectedOutput: "[98, 67]" },
      },
    },
    {
      id: "cs-ethics", title: "Ethics, Law, and Safe Labs", description: "Learn safely without harming anyone",
      content: "## Ethics and Permission\n\nSecurity skills must be used responsibly.\n\n### What is allowed\n- Your own devices and applications\n- Systems you have **explicit written permission** to test\n- Practice targets designed for learning (CTFs and labs)\n\n### What is not allowed\n- Testing random websites/apps\n- Attempting to access accounts/data you do not own\n- \"Trying\" attacks on public networks\n\n### Safe practice labs (recommended)\n- OWASP Juice Shop (web app practice)\n- DVWA (web vulnerability practice)\n- TryHackMe / Hack The Box (guided labs)\n\n### A professional pentest always includes\n1. Scope + permission\n2. Testing plan\n3. Evidence (screenshots/logs)\n4. Fix recommendations\n5. Final report",
      codeExample: "# Scope guard: only allow testing approved targets\nallowed = {\"localhost\", \"127.0.0.1\", \"example.com\"}\n\ndef in_scope(host: str) -> bool:\n    return host.strip().lower() in allowed\n\ntests = [\"localhost\", \"Example.com\", \"google.com\"]\nfor host in tests:\n    print(host, \"->\", \"IN SCOPE\" if in_scope(host) else \"OUT OF SCOPE\")\n",
      exercises: {
        beginner: { prompt: "Create an allowlist of 2 hosts and check if 'localhost' is allowed. Print True/False.", starterCode: "allowed = {\"localhost\", \"127.0.0.1\"}\nprint(\"localhost\" in allowed)\n", expectedOutput: "True" },
        intermediate: { prompt: "Normalize a host to lowercase and strip spaces. Print it.", starterCode: "host = \"  ExAmPlE.Com  \"\nprint(host.strip().lower())\n", expectedOutput: "example.com" },
        advanced: { prompt: "Given hosts list, print count of in-scope hosts.", starterCode: "allowed = {\"localhost\", \"127.0.0.1\"}\nhosts = [\"localhost\", \"google.com\", \"127.0.0.1\", \"example.com\"]\ncount = sum(1 for h in hosts if h in allowed)\nprint(count)\n", expectedOutput: "2" },
      },
    },
    {
      id: "cs-network", title: "Network Monitoring", description: "DNS, traffic basics, and safe diagnostics",
      content: "## Network Monitoring (Defensive)\n\nThis section focuses on **defensive** network skills: understanding traffic, reading logs, and doing safe diagnostics.\n\n### Key Concepts\n- **Ports** — Services listen on specific ports (80=HTTP, 443=HTTPS)\n- **TCP/UDP** — Transport protocols\n- **IP Addresses** — Network identification\n- **DNS** — Domain name resolution\n\n### Defensive tasks\n- Read firewall logs\n- Detect repeated failed connections\n- Spot suspicious spikes\n- Track top source IPs\n\n### Python tools\n- socket — DNS lookup and safe connectivity checks\n- collections — counting and grouping\n- datetime — timelines",
      codeExample: "# Firewall log parsing (defensive)\nlogs = [\n    \"ALLOW 192.168.1.10 -> 10.0.0.2:443\",\n    \"DENY 10.0.0.5 -> 10.0.0.2:22\",\n    \"DENY 10.0.0.5 -> 10.0.0.2:22\",\n    \"DENY 10.0.0.5 -> 10.0.0.2:22\",\n    \"ALLOW 192.168.1.20 -> 10.0.0.2:80\",\n]\n\ncounts = {}\nfor line in logs:\n    action, src, _, _ = line.split(maxsplit=3)\n    if action == \"DENY\":\n        counts[src] = counts.get(src, 0) + 1\n\nfor src, c in counts.items():\n    if c >= 3:\n        print(f\"ALERT: repeated denies from {src} ({c})\")\n",
      exercises: {
        beginner: { prompt: "Count how many DENY lines exist. Print count.", starterCode: "logs = [\"ALLOW\", \"DENY\", \"DENY\"]\ncount = sum(1 for x in logs if x == \"DENY\")\nprint(count)\n", expectedOutput: "2" },
        intermediate: { prompt: "Extract port number from '10.0.0.2:443'. Print 443.", starterCode: "dest = \"10.0.0.2:443\"\nport = int(dest.split(\":\")[1])\nprint(port)\n", expectedOutput: "443" },
        advanced: { prompt: "Find the most common source IP. Print it.", starterCode: "sources = [\"10.0.0.5\", \"10.0.0.5\", \"192.168.1.10\"]\ncounts = {}\nfor s in sources:\n    counts[s] = counts.get(s, 0) + 1\nprint(max(counts, key=counts.get))\n", expectedOutput: "10.0.0.5" },
      },
    },
    {
      id: "cs-crypto", title: "Cryptography Essentials", description: "Encryption, hashing, and digital signatures",
      content: "## Cryptography\n\n### Types\n- **Symmetric** — Same key to encrypt & decrypt (AES)\n- **Asymmetric** — Public/private key pair (RSA)\n- **Hashing** — One-way transformation (SHA256)\n\n### Common Algorithms\n- AES — Advanced Encryption Standard\n- RSA — Public key encryption\n- SHA256 — Secure hash\n- bcrypt — Password hashing\n\n### Use Cases\n- Secure communication (HTTPS)\n- Password storage\n- Digital signatures\n- Blockchain",
      codeExample: "# Simple substitution cipher\nimport string\n\ndef caesar_encrypt(text, shift):\n    result = \"\"\n    for char in text:\n        if char.isalpha():\n            base = ord('A') if char.isupper() else ord('a')\n            result += chr((ord(char) - base + shift) % 26 + base)\n        else:\n            result += char\n    return result\n\nencrypted = caesar_encrypt(\"Hello World\", 3)\nprint(\"Encrypted:\", encrypted)\ndecrypted = caesar_encrypt(encrypted, -3)\nprint(\"Decrypted:\", decrypted)",
      exercises: {
        beginner: { prompt: "ROT13 encrypt 'abc'. Print result.", starterCode: "text = \"abc\"\nresult = \"\".join(chr((ord(c) - ord('a') + 13) % 26 + ord('a')) for c in text)\nprint(result)\n", expectedOutput: "nop" },
        intermediate: { prompt: "XOR encrypt and decrypt 'Hi' with key=7. Print decrypted matches original.", starterCode: "text = \"Hi\"\nkey = 7\nencrypted = [ord(c) ^ key for c in text]\ndecrypted = \"\".join(chr(c ^ key) for c in encrypted)\nprint(decrypted == text)\n", expectedOutput: "True" },
        advanced: { prompt: "Generate a simple hash by summing char codes mod 1000. Print hash of 'password'.", starterCode: "text = \"password\"\nhash_val = sum(ord(c) for c in text) % 1000\nprint(hash_val)\n", expectedOutput: "879" },
      },
    },
    {
      id: "cs-forensics", title: "Digital Forensics", description: "Investigate and analyze digital evidence",
      content: "## Digital Forensics\n\nInvestigating security incidents and analyzing evidence.\n\n### Key Areas\n- **Log Analysis** — Server and application logs\n- **File Analysis** — Metadata, hidden data\n- **Memory Forensics** — RAM analysis\n- **Network Forensics** — Packet capture analysis\n\n### Python Tools\n- os/pathlib — File system analysis\n- struct — Binary file parsing\n- datetime — Timeline analysis\n- json/csv — Log parsing",
      codeExample: "# Log analysis for security\nlogs = [\n    \"2024-01-15 10:30:00 LOGIN alice 192.168.1.10 SUCCESS\",\n    \"2024-01-15 10:31:00 LOGIN root 10.0.0.5 FAILED\",\n    \"2024-01-15 10:31:05 LOGIN root 10.0.0.5 FAILED\",\n    \"2024-01-15 10:31:10 LOGIN root 10.0.0.5 FAILED\",\n    \"2024-01-15 10:35:00 LOGIN bob 192.168.1.20 SUCCESS\",\n]\n\n# Detect brute force (3+ failures from same IP)\nfailures = {}\nfor log in logs:\n    if \"FAILED\" in log:\n        ip = log.split()[3]\n        failures[ip] = failures.get(ip, 0) + 1\n\nfor ip, count in failures.items():\n    if count >= 3:\n        print(f\"ALERT: Brute force from {ip} ({count} attempts)\")",
      exercises: {
        beginner: { prompt: "Count FAILED entries in a list of log strings. Print count.", starterCode: "logs = [\"SUCCESS\", \"FAILED\", \"SUCCESS\", \"FAILED\", \"FAILED\"]\ncount = sum(1 for l in logs if l == \"FAILED\")\nprint(count)\n", expectedOutput: "3" },
        intermediate: { prompt: "Extract unique IPs from logs. Print count.", starterCode: "logs = [\"192.168.1.1 GET /\", \"10.0.0.1 POST /login\", \"192.168.1.1 GET /about\"]\nips = set(log.split()[0] for log in logs)\nprint(len(ips))\n", expectedOutput: "2" },
        advanced: { prompt: "Find the IP with most requests. Print it.", starterCode: "logs = [\"192.168.1.1\", \"10.0.0.1\", \"192.168.1.1\", \"192.168.1.1\", \"10.0.0.1\"]\ncounts = {}\nfor ip in logs:\n    counts[ip] = counts.get(ip, 0) + 1\nprint(max(counts, key=counts.get))\n", expectedOutput: "192.168.1.1" },
      },
    },
    {
      id: "cs-pentest", title: "Ethical Security Testing", description: "Authorized testing and professional reporting",
      content: "## Ethical Security Testing (With Permission)\n\nThis is about **authorized** security testing, not hacking random targets.\n\n### Always required\n- Written permission + scope\n- A safe test environment (labs/CTFs/staging)\n- A report that helps developers fix issues\n\n### High-level workflow\n1. **Scope** — what is allowed and not allowed\n2. **Discovery** — identify assets and entry points\n3. **Validation** — confirm issues safely (no data theft)\n4. **Fix guidance** — recommend secure changes\n5. **Reporting** — evidence + impact + remediation\n\n### Common web risk categories (OWASP-style)\n- Injection\n- Broken authentication\n- Security misconfiguration\n- Sensitive data exposure\n- Access control issues",
      codeExample: "# SQL Injection detection concept\ndef is_sql_injection(input_str):\n    suspicious = [\"'\", \"--\", \"OR 1=1\", \"DROP\", \"UNION SELECT\", \";\", \"/*\"]\n    input_upper = input_str.upper()\n    return any(s.upper() in input_upper for s in suspicious)\n\ntests = [\"Alice\", \"' OR 1=1 --\", \"normal_user\", \"'; DROP TABLE users;--\"]\nfor t in tests:\n    result = \"⚠️ INJECTION\" if is_sql_injection(t) else \"✅ Safe\"\n    print(f\"{t[:20]:20s} -> {result}\")",
      exercises: {
        beginner: { prompt: "Check if a string contains a single quote. Print True/False.", starterCode: "user_input = \"hello'world\"\nhas_quote = \"'\" in user_input\nprint(has_quote)\n", expectedOutput: "True" },
        intermediate: { prompt: "Normalize input by trimming spaces. Print the cleaned username.", starterCode: "user_input = \"  admin  \"\nprint(user_input.strip())\n", expectedOutput: "admin" },
        advanced: { prompt: "Check if password is in a common passwords list. Print 'Weak' or 'OK'.", starterCode: "common = [\"password\", \"123456\", \"admin\", \"qwerty\"]\npwd = \"admin\"\nresult = \"Weak\" if pwd in common else \"OK\"\nprint(result)\n", expectedOutput: "Weak" },
      },
    },
    {
      id: "cs-secure-coding", title: "Secure Coding in Python", description: "Input validation, secrets, and safer defaults",
      content: "## Secure Coding\n\nCybersecurity is not only pen testing. Secure coding prevents issues from existing.\n\n### Safer habits\n- Validate and sanitize user input\n- Never hardcode secrets (use environment variables)\n- Use constant-time comparisons for tokens\n- Keep dependencies updated\n\n### Common web-ish mistakes\n- Using `eval()` on user input\n- Building SQL strings with concatenation\n- Logging secrets\n\nThis lesson focuses on defensive practices you can apply anywhere.",
      codeExample: "import hmac\n\n# Constant-time comparison\nexpected = \"token123\"\nprovided = \"token123\"\nprint(hmac.compare_digest(expected, provided))\n",
      exercises: {
        beginner: { prompt: "Reject input if it contains ';'. For s='ok;drop' print 'Reject'.", starterCode: "s = \"ok;drop\"\nprint(\"Reject\" if \";\" in s else \"OK\")\n", expectedOutput: "Reject" },
        intermediate: { prompt: "Read env var with default. For missing var, print 'local'.", starterCode: "import os\nprint(os.environ.get(\"ENV\", \"local\"))\n", expectedOutput: "local" },
        advanced: { prompt: "Avoid eval: safely convert '42' to int and print 42.", starterCode: "s = \"42\"\nprint(int(s))\n", expectedOutput: "42" },
      },
    },
    {
      id: "cs-detection-basics", title: "Detection Basics: Logs to Alerts", description: "Simple rules and anomaly checks on log data",
      content: "## Detection Basics\n\nMany security roles involve detection engineering.\n\n### What you do\n- Collect logs (auth, app, network)\n- Normalize fields (time, user, ip, action)\n- Write rules (thresholds, patterns)\n- Reduce false positives\n\n### Example ideas\n- 5+ failed logins from one IP in 10 minutes\n- Rare admin actions\n- Sudden spike in 404/500s",
      codeExample: "# Detect repeated failures per IP\nlogs = [\n    \"FAILED 10.0.0.1\",\n    \"FAILED 10.0.0.1\",\n    \"OK 10.0.0.1\",\n    \"FAILED 10.0.0.1\",\n]\n\nfails = {}\nfor line in logs:\n    status, ip = line.split()\n    if status == \"FAILED\":\n        fails[ip] = fails.get(ip, 0) + 1\n\nprint(fails.get(\"10.0.0.1\", 0))\n",
      exercises: {
        beginner: { prompt: "Count 'FAILED' in ['OK','FAILED','FAILED']. Print 2.", starterCode: "items = [\"OK\", \"FAILED\", \"FAILED\"]\nprint(sum(1 for x in items if x == \"FAILED\"))\n", expectedOutput: "2" },
        intermediate: { prompt: "Given counts={'ip':4}, if >=3 print 'ALERT'.", starterCode: "counts = {\"ip\": 4}\nprint(\"ALERT\" if counts[\"ip\"] >= 3 else \"OK\")\n", expectedOutput: "ALERT" },
        advanced: { prompt: "Extract IPs from ['FAILED 1.1.1.1','OK 2.2.2.2'] and print ['1.1.1.1','2.2.2.2'].", starterCode: "logs = [\"FAILED 1.1.1.1\", \"OK 2.2.2.2\"]\nips = [line.split()[1] for line in logs]\nprint(ips)\n", expectedOutput: "['1.1.1.1', '2.2.2.2']" },
      },
    },
  ];
}

function githubMastery(): CareerLesson[] {
  return [
    {
      id: "git-intro", title: "Git: The Starting Line", description: "Introduction to tracking changes and collaboration",
      content: "## Why Version Control?\n\nAs a developer, you need to track changes, undo mistakes, and collaborate with others. Git is the world's most popular tool for this.\n\n### Key Concepts\n- **History** — Going back in time to any version of your project\n- **Branching** — Working on new features without breaking the main app\n- **Staging** — Preparing files for a commit\n- **Collaboration** — Sharing code via GitHub\n\n### Git's Areas\n1. **Working Directory** — Files you are editing now\n2. **Staging Area** — Files marked to be saved in the next snapshot\n3. **Local Repo** — Your local snapshots (commits)",
      codeExample: "# Git state simulation\nrepo_state = {\"staged\": [], \"committed\": [\"init\"]}\n\ndef add(file):\n    repo_state[\"staged\"].append(file)\n\nprint(f\"Initial state: {repo_state}\")\nadd(\"main.py\")\nprint(f\"After staging: {repo_state}\")",
      exercises: {
        beginner: { prompt: "Create a list representing git states: ['modified', 'staged', 'committed']. Print the last state.", starterCode: "states = [\"modified\", \"staged\", \"committed\"]\n# Print the terminal committed state\n", expectedOutput: "committed" },
        intermediate: { prompt: "Write add(files, file) that appends to list only if not already present. Test with ['a.py'], 'b.py'. Print list.", starterCode: "def add(staged, f):\n    if f not in staged:\n        staged.append(f)\n    return staged\n\nprint(add([\"a.py\"], \"b.py\"))\n", expectedOutput: "['a.py', 'b.py']" },
        advanced: { prompt: "Implement commit(): move items from staged list to history list. Print length of history.", starterCode: "staged = [\"a.py\", \"b.py\"]\nhistory = []\n# Move staged items to history as a single commit\nhistory.append(list(staged))\nstaged.clear()\nprint(len(history))\n", expectedOutput: "1" },
      },
    },
    {
      id: "git-staging", title: "Staging: The Waiting Room", description: "Learn to prepare files for commit",
      content: "## The Staging Area\n\nIn Git, you don't save every change immediately. You move them to a **Staging Area** first.\n\n### Commands\n- `git status`: See what is changed and staged\n- `git add <file>`: Stage a specific file\n- `git add .`: Stage ALL changes in the directory\n\nThink of staging as picking products for a shipping box before you seal it (commit it).",
      codeExample: "files = [\"auth.py\", \"tests.py\", \"README.md\"]\nstaged = []\n\n# Pro-tip: Check status first\nprint(f\"Changes to stage: {files}\")\nstaged.append(files[0])\nprint(f\"Staged: {staged}\")",
      exercises: {
        beginner: { prompt: "Format the command to stage all files (use dot). Print it.", starterCode: "command = \"git add .\"\nprint(command)\n", expectedOutput: "git add ." },
        intermediate: { prompt: "Write a loop to stage all files from a list 'modified'. Print the 'staged' list.", starterCode: "modified = [\"a.py\", \"b.py\"]\nstaged = []\nfor f in modified:\n    staged.append(f)\nprint(staged)\n", expectedOutput: "['a.py', 'b.py']" },
        advanced: { prompt: "Filter a list of files to only stage '.py' files. Print the resulting list.", starterCode: "files = [\"notes.txt\", \"app.py\", \"util.py\", \"logo.png\"]\nstaged = [f for f in files if f.endswith(\".py\")]\nprint(staged)\n", expectedOutput: "['app.py', 'util.py']" },
      },
    },
    {
      id: "git-commits", title: "Committing: Taking Snapshots", description: "Save your progress permanently",
      content: "## The Commit\n\nA commit is a permanent snapshot of your staged changes. It includes a message and a unique ID (hash).\n\n### Rules for Messages\n1. **Be Concise** — Keep it under 50 chars if possible\n2. **Imperative Mood** — Use 'Add login' NOT 'Added login'\n3. **Context** — Mention what changed and why\n\n### Command\n`git commit -m \"Your message here\"`",
      codeExample: "commits = []\ndef commit(msg, files):\n    commits.append({\"id\": \"a1b2c3d\", \"msg\": msg, \"files\": files})\n\ncommit(\"Add payment gateway\", [\"stripe.py\"])\nprint(f\"Total Commits: {len(commits)}\")",
      exercises: {
        beginner: { prompt: "Format a commit command string with message 'Fix bug'. Print it.", starterCode: "m = \"Fix bug\"\nprint(f'git commit -m \"{m}\"')\n", expectedOutput: "git commit -m \"Fix bug\"" },
        intermediate: { prompt: "Simulate a commit hash by taking the first 7 chars of 'f3e2d1c0b9a8'. Print it.", starterCode: "h = \"f3e2d1c0b9a8\"\nprint(h[:7])\n", expectedOutput: "f3e2d1c" },
        advanced: { prompt: "Validate a commit message: Must be >= 5 chars and end with a letter. Test 'Fix'. Print False.", starterCode: "m = \"Fix\"\nis_valid = len(m) >= 5 and m[-1].isalpha()\nprint(is_valid)\n", expectedOutput: "False" },
      },
    },
    {
      id: "github-remotes", title: "Connecting to GitHub", description: "The Cloud: Remotes and SSH",
      content: "## GitHub & Remotes\n\nGitHub is a host for your Git repositories. To connect your local computer to GitHub, you use **Remotes**.\n\n### Connection Types\n- **HTTPS**: Uses a Personal Access Token (PAT). Good for beginners.\n- **SSH**: Uses digital keys for passwordless security. Recommended for Pros.\n\n### Commands\n- `git remote add origin <url>`: Connect local repo to remote URL\n- `git remote -v`: Verify the connection",
      codeExample: "config = {\"remote\": \"origin\", \"url\": \"https://github.com/user/py-pro.git\"}\nprint(f\"Connected to: {config['url']}\")",
      exercises: {
        beginner: { prompt: "Print the command to verify remote URLs.", starterCode: "print(\"git remote -v\")\n", expectedOutput: "git remote -v" },
        intermediate: { prompt: "Check if a URL uses SSH (starts with 'git@'). Test 'git@github.com:user/repo.git'. Print True.", starterCode: "url = \"git@github.com:user/repo.git\"\nprint(url.startswith(\"git@\"))\n", expectedOutput: "True" },
        advanced: { prompt: "Extract the owner from 'https://github.com/dinesh/app'. (Between github.com/ and /app). Print 'dinesh'.", starterCode: "url = \"https://github.com/dinesh/app\"\n# Use string split or slice\nprint(url.split(\"/\")[3])\n", expectedOutput: "dinesh" },
      },
    },
    {
      id: "git-push-pull", title: "Push & Pull: Syncing", description: "Sharing and receiving code",
      content: "## Syncing Changes\n\n- `git push origin main`: Send your local commits to GitHub\n- `git pull origin main`: Get latest changes from teammates onto your machine\n- `git clone <url>`: Copy an entire repository from GitHub for the first time\n\n### Conflict Warning\nIf someone else pushed changes to the same lines you edited, `git pull` will ask you to resolve a **Merge Conflict**.",
      codeExample: "local = 5\nremote = 7\nif local < remote:\n    print(f\"You are {remote - local} commits behind! Time to pull.\")",
      exercises: {
        beginner: { prompt: "Print the command to pull from origin branch 'main'.", starterCode: "print(\"git pull origin main\")\n", expectedOutput: "git pull origin main" },
        intermediate: { prompt: "A repo has 10 commits. You pull 2 new ones. What is the total? Print it.", starterCode: "initial = 10\nnew = 2\nprint(initial + new)\n", expectedOutput: "12" },
        advanced: { prompt: "Check if local and remote hashes match. Local 'abc', Remote '123'. Print 'Sync Error' if they differ.", starterCode: "l = \"abc\"\nr = \"123\"\nprint(\"Sync Error\" if l != r else \"OK\")\n", expectedOutput: "Sync Error" },
      },
    },
    {
      id: "git-branches", title: "Branches: Parallel Worlds", description: "Developing features in isolation",
      content: "## Why Bench?\n\nBranches let you work on a New Feature or Bug Fix without breaking the Main code. This is called **Isolation**.\n\n### Commands\n- `git checkout -b <name>`: Create and switch to a new branch\n- `git branch`: List all branches\n- `git merge <name>`: Combine branch back into main\n- `git checkout <name>`: Switch between existing branches",
      codeExample: "branches = [\"main\", \"feature-login\", \"fix-bug\"]\ncurrent = \"feature-login\"\nprint(f\"Working on: {current}\")",
      exercises: {
        beginner: { prompt: "Print the command to create and switch to 'dev' branch.", starterCode: "print(\"git checkout -b dev\")\n", expectedOutput: "git checkout -b dev" },
        intermediate: { prompt: "Check if 'main' is in a list of branches. Print True.", starterCode: "b = [\"v1\", \"main\", \"qa\"]\nprint(\"main\" in b)\n", expectedOutput: "True" },
        advanced: { prompt: "Given current='main', return command to switch to 'test'. Print it.", starterCode: "target = \"test\"\nprint(f\"git checkout {target}\")\n", expectedOutput: "git checkout test" },
      },
    },
    {
      id: "github-prs", title: "Pull Requests & Reviews", description: "How teams collaborate on GitHub",
      content: "## The Pull Request (PR)\n\nA Pull Request is how you tell your team: \"I've finished a feature, please review it and merge it into the main project.\"\n\n### PR Lifecycle\n1. **Open PR**: Describe your changes\n2. **Review**: Teammates comment on your code\n3. **Approve**: Senior devs approve the logic\n4. **Merge**: code joins the project",
      codeExample: "pr = {\"status\": \"open\", \"approvals\": 0}\ndef approve(): pr[\"approvals\"] += 1\n\napprove()\nif pr[\"approvals\"] >= 1:\n    print(\"Ready to merge!\")",
      exercises: {
        beginner: { prompt: "Print the status of a PR that requires 1 more approval (approvals=1, required=2). Print 'Pending'.", starterCode: "app = 1\nreq = 2\nprint(\"Pending\" if app < req else \"Verified\")\n", expectedOutput: "Pending" },
        intermediate: { prompt: "Format a PR title: '[TASK-123] Fix Login'. Print it.", starterCode: "id = 123\nname = \"Fix Login\"\nprint(f\"[TASK-{id}] {name}\")\n", expectedOutput: "[TASK-123] Fix Login" },
        advanced: { prompt: "Filter comments starting with 'FIX:' from a list. Print the list.", starterCode: "msgs = [\"Nice code\", \"FIX: Line 10\", \"Style fix\", \"FIX: Logic error\"]\nfixes = [m for m in msgs if m.startswith(\"FIX:\")]\nprint(fixes)\n", expectedOutput: "['FIX: Line 10', 'FIX: Logic error']" },
      },
    },
    {
      id: "github-forking", title: "Forking: Open Source Mastery", description: "Contributing to any project in the world",
      content: "## Forking vs Branching\n\n- **Branch**: Internal development within one repo.\n- **Fork**: A copy of someone else's repo in YOUR GitHub account. You use this to contribute to Open Source.\n\n### Workflow\n1. **Fork** the Repo\n2. **Clone** your fork\n3. **Branch** & Update\n4. Push to your fork\n5. Open a **PR** to the original owner",
      codeExample: "owner = \"google\"\nrepo = \"tensorflow\"\nprint(f\"Forking {owner}/{repo} to my-account/{repo}...\")",
      exercises: {
        beginner: { prompt: "Print the first step to contribute to a public repo.", starterCode: "print(\"Fork\")\n", expectedOutput: "Fork" },
        intermediate: { prompt: "Map owner to repo: {'owner': 'py', 'repo': 'core'}. Print formatted 'py/core'.", starterCode: "d = {\"owner\": \"py\", \"repo\": \"core\"}\nprint(f\"{d['owner']}/{d['repo']}\")\n", expectedOutput: "py/core" },
        advanced: { prompt: "Check if 'fork' is in a list of Git actions. Print True.", starterCode: "actions = [\"clone\", \"push\", \"fork\", \"pull\"]\nprint(\"fork\" in actions)\n", expectedOutput: "True" },
      },
    },
    {
      id: "git-conflicts", title: "Resolving Conflicts", description: "Handling overlapping changes (Simulated)",
      content: "## What is a Conflict?\n\nA conflict happens when Git can't automatically merge two branches because they both changed the SAME line of the SAME file.\n\n### How to Fix\n1. Open the file\n2. Find the markers: `<<<<<<< HEAD` and `>>>>>>>`\n3. Choose which code to keep\n4. Remove markers, `git add`, and `git commit`",
      codeExample: "file_content = \"\"\"\n<<<<<<< HEAD\nprint('Hello World')\n=======\nprint('Hello Universe')\n>>>>>>> feature-branch\n\"\"\"\nprint(\"Conflict detected! Choose one and delete markers.\")",
      exercises: {
        beginner: { prompt: "Check if '<<<<<<< HEAD' is in a string. Print True.", starterCode: "s = \"Line 1\\n<<<<<<< HEAD\\nLine 2\"\nprint(\"<<<<<<< HEAD\" in s)\n", expectedOutput: "True" },
        intermediate: { prompt: "Write a function solve() that returns the second line of a conflict (the incoming change).", starterCode: "c = [\"<<<<\", \"Mine\", \"====\", \"Theirs\", \">>>>\"]\nprint(c[3])\n", expectedOutput: "Theirs" },
        advanced: { prompt: "Simulate marker removal: Remove all lines starting with '<<' or '==' or '>>' from a list. Print list.", starterCode: "lines = [\"<<<<\", \"logic = 5\", \"====\", \"logic = 10\", \">>>>\"]\nclean = [l for l in lines if not any(x in l for x in [\"<\", \"=\", \">\"])]\n# Print the cleaned logic lines\nprint(clean)\n", expectedOutput: "['logic = 5', 'logic = 10']" },
      },
    },
    {
      id: "github-actions", title: "GitHub Actions: CI/CD Basics", description: "Automating your development with Workflows",
      content: "## Automation with Actions\n\nGitHub Actions lets you run code every time you push to GitHub. This is used for **Automated Testing** and **Deployment**.\n\n### Key Terms\n- **Workflow**: The automation file (.yaml)\n- **Event**: What triggers the run (e.g., Push, PR)\n- **Job**: A set of steps (e.g., Run Tests, Deploy)\n- **Runner**: The cloud computer running your actions",
      codeExample: "# Example Workflow simulation in Python (YAML representation)\nworkflow = {\n    \"name\": \"Test Suite\",\n    \"on\": [\"push\"],\n    \"jobs\": {\n        \"test\": {\"runs-on\": \"ubuntu-latest\", \"steps\": [\"pip install\", \"pytest\"]}\n    }\n}\nprint(f\"Triggered by: {workflow['on']}\")",
      exercises: {
        beginner: { prompt: "Print the directory where GitHub Actions workflows are stored.", starterCode: "print(\".github/workflows\")\n", expectedOutput: ".github/workflows" },
        intermediate: { prompt: "Check if a workflow 'on' list contains 'push'. Print True.", starterCode: "on = [\"pull_request\", \"push\"]\nprint(\"push\" in on)\n", expectedOutput: "True" },
        advanced: { prompt: "Validate if a job has 'runs-on' key. Job: {'steps': []}. Print False.", starterCode: "job = {\"steps\": []}\nprint(\"runs-on\" in job)\n", expectedOutput: "False" },
      },
    },
    {
      id: "github-pages", title: "GitHub Pages & Portfolios", description: "Hosting your portfolio with one click",
      content: "## GitHub Pages\n\nGitHub Pages is a hosting service that turns your repository into a live website—for free!\n\n### How to enable\n1. Go to **Settings** > **Pages**\n2. Select your `main` branch\n3. Click Save\n\nYour site will be live at `https://username.github.io/repo-name`",
      codeExample: "user = \"jane_doe\"\nrepo = \"portfolio\"\nurl = f\"https://{user}.github.io/{repo}\"\nprint(f\"Visit my site: {url}\")",
      exercises: {
        beginner: { prompt: "Construct the URL for user 'alex' and repo 'blog'. Print it.", starterCode: "u = \"alex\"\nr = \"blog\"\nprint(f\"https://{u}.github.io/{r}\")\n", expectedOutput: "https://alex.github.io/blog" },
        intermediate: { prompt: "Check if 'index.html' is in a list of files (required for Pages). Print 'Ready' if present.", starterCode: "f = [\"style.css\", \"index.html\", \"script.js\"]\nprint(\"Ready\" if \"index.html\" in f else \"Missing\")\n", expectedOutput: "Ready" },
        advanced: { prompt: "Check if branch is 'main' or 'gh-pages' for hosting. Test 'main'. Print True.", starterCode: "b = \"main\"\nprint(b in [\"main\", \"gh-pages\"])\n", expectedOutput: "True" },
      },
    },
    {
      id: "github-master-pro", title: "Master Profile & Portfolio", description: "Building the ultimate dev presence",
      content: "## The Master Profile\n\nGitHub is your **Developer Resume**. \n\n### Essential Checklist\n- **Profile README**: Use a special repo named after your username to show a bio.\n- **Green Grass**: Keep a consistent commit streak.\n- **Pinned Repos**: Show your best work.\n- **Organizations**: Join teams to show professional experience.\n\nCongratulations! You have mastered the GitHub journey from Start to Finish.",
      codeExample: "profile = {\n    \"username\": \"py_master\",\n    \"readme\": \"Hi, I build cool stuff!\",\n    \"pinned\": [\"AI-Bot\", \"Web-Scraper\"]\n}\nprint(f\"Welcome to {profile['username']}'s world!\")",
      exercises: {
        beginner: { prompt: "Print the name of the special repository for your profile README.", starterCode: "# It must be your username exactly\nprint(\"username/username\")\n", expectedOutput: "username/username" },
        intermediate: { prompt: "Verify if at least 1 repo is pinned. Pinned: []. Print 'Empty'.", starterCode: "p = []\nprint(\"Empty\" if not p else \"Active\")\n", expectedOutput: "Empty" },
        advanced: { prompt: "Format a bio: 'Bio: [txt]'. Test 'Python Dev'. Print it.", starterCode: "txt = \"Python Dev\"\nprint(f\"Bio: {txt}\")\n", expectedOutput: "Bio: Python Dev" },
      },
    },
  ];
}

function sqlLessons(): CareerLesson[] {
  return [
    {
      id: "sql-intro",
      title: "SQL Foundations (DQL)",
      description: "SELECT, FROM, ORDER BY, LIMIT — your first queries",
      category: "DQL (SELECT)",
      content:
        "## SQL Foundations\n\nSQL is the language used to **query and analyze** data in relational databases.\n\n### What you will practice here\n- `SELECT` columns\n- `FROM` tables\n- `ORDER BY` for stable output\n- `LIMIT` to reduce rows\n\n### Practice database (built-in)\nYou will query a small practice dataset with tables like `customers`, `orders`, `order_items`, and `products`.",
      codeExample:
        "-- Explore customers\nSELECT id, name, city\nFROM customers\nORDER BY id\nLIMIT 5;",
      exercises: {
        beginner: {
          prompt: "Select all customers (id, name) ordered by id.",
          starterCode: "-- Write your SQL here\nSELECT id, name\nFROM customers\nORDER BY id;\n",
          expectedOutput: "id,name\n1,Alice\n2,Bob\n3,Charlie\n4,Diana\n5,Ethan",
        },
        intermediate: {
          prompt: "List Electronics products (name, price) ordered by price DESC.",
          starterCode: "-- Write your SQL here\nSELECT name, price\nFROM products\nWHERE category = 'Electronics'\nORDER BY price DESC;\n",
          expectedOutput: "name,price\nKeyboard,2500\nHeadphones,1500\nMouse,800",
        },
        advanced: {
          prompt: "Show the top 3 most expensive products (name, price).",
          starterCode: "-- Write your SQL here\nSELECT name, price\nFROM products\nORDER BY price DESC\nLIMIT 3;\n",
          expectedOutput: "name,price\nKeyboard,2500\nHeadphones,1500\nMouse,800",
        },
      },
    },
    {
      id: "sql-filtering",
      title: "Filtering & Sorting",
      description: "WHERE, AND/OR, LIKE, BETWEEN, IN, ORDER BY",
      category: "Filtering & Sorting",
      content:
        "## Filtering & Sorting\n\n### Core clauses\n- `WHERE` filters rows\n- `AND` / `OR` combine conditions\n- `IN` checks membership\n- `BETWEEN` checks ranges\n- `LIKE` pattern matching (`%` wildcard)\n\nTip: Always add an `ORDER BY` when you care about the exact row order (especially for exercises).",
      codeExample:
        "-- Customers in Mumbai\nSELECT name, city\nFROM customers\nWHERE city = 'Mumbai'\nORDER BY name;",
      exercises: {
        beginner: {
          prompt: "List customers from Mumbai (name, city) ordered by name.",
          starterCode: "-- Write your SQL here\nSELECT name, city\nFROM customers\nWHERE city = 'Mumbai'\nORDER BY name;\n",
          expectedOutput: "name,city\nAlice,Mumbai\nDiana,Mumbai",
        },
        intermediate: {
          prompt: "Show March 2026 orders (id, order_date, status) ordered by order_date.",
          starterCode:
            "-- Write your SQL here\nSELECT id, order_date, status\nFROM orders\nWHERE order_date >= '2026-03-01' AND order_date < '2026-04-01'\nORDER BY order_date;\n",
          expectedOutput: "id,order_date,status\n4,2026-03-12,completed\n5,2026-03-15,completed",
        },
        advanced: {
          prompt: "List products priced between 100 and 2000 (name, price) ordered by price.",
          starterCode:
            "-- Write your SQL here\nSELECT name, price\nFROM products\nWHERE price BETWEEN 100 AND 2000\nORDER BY price;\n",
          expectedOutput: "name,price\nCoffee,120\nMouse,800\nHeadphones,1500",
        },
      },
    },
    {
      id: "sql-aggregations",
      title: "Aggregations & GROUP BY",
      description: "COUNT, SUM, AVG, GROUP BY, HAVING",
      category: "Aggregations",
      content:
        "## Aggregations\n\n### Common functions\n- `COUNT(*)`\n- `SUM(x)`\n- `AVG(x)`\n- `MIN(x)`, `MAX(x)`\n\n### GROUP BY\nGroups rows so aggregates are calculated per group.\n\n### HAVING\nFilters *groups* (after aggregation).",
      codeExample:
        "-- Orders per status\nSELECT status, COUNT(*) AS count\nFROM orders\nGROUP BY status\nORDER BY status;",
      exercises: {
        beginner: {
          prompt: "Count orders by status (status, count) ordered by status.",
          starterCode:
            "-- Write your SQL here\nSELECT status, COUNT(*) AS count\nFROM orders\nGROUP BY status\nORDER BY status;\n",
          expectedOutput: "status,count\ncancelled,1\ncompleted,4",
        },
        intermediate: {
          prompt: "For completed orders only, compute total quantity sold per product (name, total_qty) ordered by total_qty DESC then name.",
          starterCode:
            "-- Write your SQL here\nSELECT p.name, SUM(oi.quantity) AS total_qty\nFROM orders o\nJOIN order_items oi ON oi.order_id = o.id\nJOIN products p ON p.id = oi.product_id\nWHERE o.status = 'completed'\nGROUP BY p.id, p.name\nORDER BY total_qty DESC, p.name;\n",
          expectedOutput: "name,total_qty\nPen,5\nCoffee,4\nHeadphones,3\nNotebook,3\nKeyboard,1",
        },
        advanced: {
          prompt: "Compute revenue per completed order (order_id, revenue) ordered by order_id.",
          starterCode:
            "-- Write your SQL here\nSELECT o.id AS order_id, SUM(p.price * oi.quantity) AS revenue\nFROM orders o\nJOIN order_items oi ON oi.order_id = o.id\nJOIN products p ON p.id = oi.product_id\nWHERE o.status = 'completed'\nGROUP BY o.id\nORDER BY o.id;\n",
          expectedOutput: "order_id,revenue\n1,270\n2,1500\n4,2860\n5,3050",
        },
      },
    },
    {
      id: "sql-joins",
      title: "JOINs",
      description: "INNER JOIN, LEFT JOIN, joining multiple tables",
      category: "Joins",
      content:
        "## JOINs\n\n### The big idea\nA JOIN combines rows from tables using a matching key.\n\n### Most used JOINs\n- `INNER JOIN`: only matching rows\n- `LEFT JOIN`: keep all left rows (even if no match)\n\nTip: When totals can be missing, use `COALESCE(x, 0)` to turn NULL into 0.",
      codeExample:
        "-- Orders with customer names\nSELECT o.id AS order_id, c.name, o.status\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nORDER BY o.id;",
      exercises: {
        beginner: {
          prompt: "List all orders with customer name (order_id, name, status) ordered by order_id.",
          starterCode:
            "-- Write your SQL here\nSELECT o.id AS order_id, c.name, o.status\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nORDER BY o.id;\n",
          expectedOutput: "order_id,name,status\n1,Alice,completed\n2,Bob,completed\n3,Alice,cancelled\n4,Charlie,completed\n5,Diana,completed",
        },
        intermediate: {
          prompt: "For order_id=1, list items (order_id, product, quantity) ordered by product.",
          starterCode:
            "-- Write your SQL here\nSELECT oi.order_id, p.name AS product, oi.quantity\nFROM order_items oi\nJOIN products p ON p.id = oi.product_id\nWHERE oi.order_id = 1\nORDER BY p.name;\n",
          expectedOutput: "order_id,product,quantity\n1,Coffee,1\n1,Notebook,2\n1,Pen,5",
        },
        advanced: {
          prompt: "Total spent per customer on completed orders (include customers with 0). Output (name, total_spent) ordered by total_spent DESC.",
          starterCode:
            "-- Write your SQL here\nWITH order_revenue AS (\n  SELECT o.id AS order_id, o.customer_id, SUM(p.price * oi.quantity) AS revenue\n  FROM orders o\n  JOIN order_items oi ON oi.order_id = o.id\n  JOIN products p ON p.id = oi.product_id\n  WHERE o.status = 'completed'\n  GROUP BY o.id, o.customer_id\n)\nSELECT c.name, COALESCE(SUM(orv.revenue), 0) AS total_spent\nFROM customers c\nLEFT JOIN order_revenue orv ON orv.customer_id = c.id\nGROUP BY c.id, c.name\nORDER BY total_spent DESC;\n",
          expectedOutput: "name,total_spent\nDiana,3050\nCharlie,2860\nBob,1500\nAlice,270\nEthan,0",
        },
      },
    },
    {
      id: "sql-subqueries",
      title: "Subqueries",
      description: "IN, EXISTS, scalar subqueries, derived tables",
      category: "Subqueries",
      content:
        "## Subqueries\n\nSubqueries let you use one query inside another.\n\n### Common patterns\n- `WHERE x IN (SELECT ...)`\n- `WHERE EXISTS (SELECT ...)`\n- Subquery in `FROM` (derived table)\n\nTip: Prefer `EXISTS` when you only need to check presence (not values).",
      codeExample:
        "-- Customers with any cancelled order\nSELECT name\nFROM customers\nWHERE id IN (\n  SELECT customer_id FROM orders WHERE status = 'cancelled'\n)\nORDER BY name;",
      exercises: {
        beginner: {
          prompt: "Find customers who have a cancelled order (name).",
          starterCode:
            "-- Write your SQL here\nSELECT name\nFROM customers\nWHERE id IN (SELECT customer_id FROM orders WHERE status = 'cancelled')\nORDER BY name;\n",
          expectedOutput: "name\nAlice",
        },
        intermediate: {
          prompt: "Find products that were never ordered (name) ordered by name.",
          starterCode:
            "-- Write your SQL here\nSELECT p.name\nFROM products p\nWHERE NOT EXISTS (\n  SELECT 1 FROM order_items oi WHERE oi.product_id = p.id\n)\nORDER BY p.name;\n",
          expectedOutput: "name\nMouse",
        },
        advanced: {
          prompt: "Find customers whose completed total_spent is greater than the average total_spent across all customers (include 0). Output (name, total_spent) ordered by total_spent DESC.",
          starterCode:
            "-- Write your SQL here\nWITH order_revenue AS (\n  SELECT o.id AS order_id, o.customer_id, SUM(p.price * oi.quantity) AS revenue\n  FROM orders o\n  JOIN order_items oi ON oi.order_id = o.id\n  JOIN products p ON p.id = oi.product_id\n  WHERE o.status = 'completed'\n  GROUP BY o.id, o.customer_id\n),\ncustomer_spend AS (\n  SELECT c.id, c.name, COALESCE(SUM(orv.revenue), 0) AS total_spent\n  FROM customers c\n  LEFT JOIN order_revenue orv ON orv.customer_id = c.id\n  GROUP BY c.id, c.name\n),\navg_spend AS (\n  SELECT AVG(total_spent) AS avg_total FROM customer_spend\n)\nSELECT cs.name, cs.total_spent\nFROM customer_spend cs\nCROSS JOIN avg_spend a\nWHERE cs.total_spent > a.avg_total\nORDER BY cs.total_spent DESC;\n",
          expectedOutput: "name,total_spent\nDiana,3050\nCharlie,2860",
        },
      },
    },
    {
      id: "sql-ctes",
      title: "CTEs (WITH)",
      description: "Readable multi-step queries with WITH",
      category: "CTEs",
      content:
        "## Common Table Expressions (CTEs)\n\nCTEs make complex queries easier to read by giving names to intermediate results.\n\n### Benefits\n- Break logic into steps\n- Reuse computed sets\n- Safer than repeating subqueries",
      codeExample:
        "-- Monthly revenue for completed orders\nWITH order_revenue AS (\n  SELECT o.id, substr(o.order_date, 1, 7) AS month, SUM(p.price * oi.quantity) AS revenue\n  FROM orders o\n  JOIN order_items oi ON oi.order_id = o.id\n  JOIN products p ON p.id = oi.product_id\n  WHERE o.status = 'completed'\n  GROUP BY o.id, month\n)\nSELECT month, SUM(revenue) AS revenue\nFROM order_revenue\nGROUP BY month\nORDER BY month;",
      exercises: {
        beginner: {
          prompt: "Using a CTE, compute completed order revenue (order_id, revenue) ordered by order_id.",
          starterCode:
            "-- Write your SQL here\nWITH order_revenue AS (\n  SELECT o.id AS order_id, SUM(p.price * oi.quantity) AS revenue\n  FROM orders o\n  JOIN order_items oi ON oi.order_id = o.id\n  JOIN products p ON p.id = oi.product_id\n  WHERE o.status = 'completed'\n  GROUP BY o.id\n)\nSELECT order_id, revenue\nFROM order_revenue\nORDER BY order_id;\n",
          expectedOutput: "order_id,revenue\n1,270\n2,1500\n4,2860\n5,3050",
        },
        intermediate: {
          prompt: "Compute monthly completed revenue (month, revenue) ordered by month.",
          starterCode:
            "-- Write your SQL here\nWITH order_revenue AS (\n  SELECT o.id, substr(o.order_date, 1, 7) AS month, SUM(p.price * oi.quantity) AS revenue\n  FROM orders o\n  JOIN order_items oi ON oi.order_id = o.id\n  JOIN products p ON p.id = oi.product_id\n  WHERE o.status = 'completed'\n  GROUP BY o.id, month\n)\nSELECT month, SUM(revenue) AS revenue\nFROM order_revenue\nGROUP BY month\nORDER BY month;\n",
          expectedOutput: "month,revenue\n2026-01,1770\n2026-03,5910",
        },
        advanced: {
          prompt: "Find the top customer by completed total_spent (name, total_spent).",
          starterCode:
            "-- Write your SQL here\nWITH order_revenue AS (\n  SELECT o.customer_id, SUM(p.price * oi.quantity) AS revenue\n  FROM orders o\n  JOIN order_items oi ON oi.order_id = o.id\n  JOIN products p ON p.id = oi.product_id\n  WHERE o.status = 'completed'\n  GROUP BY o.id, o.customer_id\n),\ncustomer_spend AS (\n  SELECT c.name, COALESCE(SUM(orv.revenue), 0) AS total_spent\n  FROM customers c\n  LEFT JOIN order_revenue orv ON orv.customer_id = c.id\n  GROUP BY c.id, c.name\n)\nSELECT name, total_spent\nFROM customer_spend\nORDER BY total_spent DESC\nLIMIT 1;\n",
          expectedOutput: "name,total_spent\nDiana,3050",
        },
      },
    },
    {
      id: "sql-windows",
      title: "Window Functions",
      description: "RANK, DENSE_RANK, OVER(), running totals",
      category: "Window Functions",
      content:
        "## Window Functions\n\nWindow functions compute values across a set of rows **without collapsing** them like GROUP BY.\n\n### Examples\n- Ranking within a category\n- Running totals\n- Moving averages\n\nSyntax pattern:\n`func(...) OVER (PARTITION BY ... ORDER BY ...)`",
      codeExample:
        "-- Rank products by price within category\nSELECT category, name, price,\n       RANK() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank\nFROM products\nORDER BY category, name;",
      exercises: {
        beginner: {
          prompt: "Rank products by price within each category (category, name, price, price_rank) ordered by category, name.",
          starterCode:
            "-- Write your SQL here\nSELECT category, name, price,\n       RANK() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank\nFROM products\nORDER BY category, name;\n",
          expectedOutput:
            "category,name,price,price_rank\nElectronics,Headphones,1500,2\nElectronics,Keyboard,2500,1\nElectronics,Mouse,800,3\nGrocery,Coffee,120,1\nStationery,Notebook,50,1\nStationery,Pen,10,2",
        },
        intermediate: {
          prompt: "Show completed daily revenue and running_total (order_date, revenue, running_total) ordered by order_date.",
          starterCode:
            "-- Write your SQL here\nWITH daily AS (\n  SELECT o.order_date, SUM(p.price * oi.quantity) AS revenue\n  FROM orders o\n  JOIN order_items oi ON oi.order_id = o.id\n  JOIN products p ON p.id = oi.product_id\n  WHERE o.status = 'completed'\n  GROUP BY o.order_date\n)\nSELECT order_date, revenue,\n       SUM(revenue) OVER (ORDER BY order_date) AS running_total\nFROM daily\nORDER BY order_date;\n",
          expectedOutput: "order_date,revenue,running_total\n2026-01-05,270,270\n2026-01-06,1500,1770\n2026-03-12,2860,4630\n2026-03-15,3050,7680",
        },
        advanced: {
          prompt: "Top 2 customers by completed total_spent with rank (name, total_spent, spend_rank) ordered by spend_rank.",
          starterCode:
            "-- Write your SQL here\nWITH order_revenue AS (\n  SELECT o.id AS order_id, o.customer_id, SUM(p.price * oi.quantity) AS revenue\n  FROM orders o\n  JOIN order_items oi ON oi.order_id = o.id\n  JOIN products p ON p.id = oi.product_id\n  WHERE o.status = 'completed'\n  GROUP BY o.id, o.customer_id\n),\ncustomer_spend AS (\n  SELECT c.name, COALESCE(SUM(orv.revenue), 0) AS total_spent\n  FROM customers c\n  LEFT JOIN order_revenue orv ON orv.customer_id = c.id\n  GROUP BY c.id, c.name\n)\nSELECT name, total_spent,\n       DENSE_RANK() OVER (ORDER BY total_spent DESC) AS spend_rank\nFROM customer_spend\nORDER BY spend_rank\nLIMIT 2;\n",
          expectedOutput: "name,total_spent,spend_rank\nDiana,3050,1\nCharlie,2860,2",
        },
      },
    },
    {
      id: "sql-ddl",
      title: "DDL (CREATE / ALTER / DROP)",
      description: "Define tables, constraints, and schema",
      category: "DDL",
      content:
        "## DDL (Data Definition Language)\n\nDDL changes the database structure.\n\n### Common commands\n- `CREATE TABLE`\n- `ALTER TABLE`\n- `DROP TABLE`\n\nIn the practice editor, you can run multiple statements in one execution (separated by `;`).",
      codeExample:
        "CREATE TABLE temp_notes(\n  id INTEGER,\n  note TEXT\n);\n\nSELECT name\nFROM sqlite_master\nWHERE type='table' AND name='temp_notes';",
      exercises: {
        beginner: {
          prompt: "Create table temp_notes(id INTEGER, note TEXT) then select its name from sqlite_master.",
          starterCode:
            "-- Write your SQL here\nCREATE TABLE temp_notes(\n  id INTEGER,\n  note TEXT\n);\n\nSELECT name\nFROM sqlite_master\nWHERE type='table' AND name='temp_notes';\n",
          expectedOutput: "name\ntemp_notes",
        },
        intermediate: {
          prompt: "Create table projects(id INTEGER PRIMARY KEY, name TEXT NOT NULL), insert 1 row, then select count.",
          starterCode:
            "-- Write your SQL here\nCREATE TABLE projects(\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL\n);\nINSERT INTO projects(id, name) VALUES (1, 'Roadmap');\nSELECT COUNT(*) AS count FROM projects;\n",
          expectedOutput: "count\n1",
        },
        advanced: {
          prompt: "Create table emails(email TEXT UNIQUE), insert 2 distinct emails, then select count.",
          starterCode:
            "-- Write your SQL here\nCREATE TABLE emails(\n  email TEXT UNIQUE\n);\nINSERT INTO emails(email) VALUES ('a@example.com');\nINSERT INTO emails(email) VALUES ('b@example.com');\nSELECT COUNT(*) AS count FROM emails;\n",
          expectedOutput: "count\n2",
        },
      },
    },
    {
      id: "sql-dml",
      title: "DML (INSERT / UPDATE / DELETE)",
      description: "Modify rows safely with conditions",
      category: "DML",
      content:
        "## DML (Data Manipulation Language)\n\nDML changes row data.\n\n### Commands\n- `INSERT` add rows\n- `UPDATE` change rows (always use a WHERE unless you intend to update all)\n- `DELETE` remove rows\n\nTip: For practice, you can run changes and immediately verify with a SELECT.",
      codeExample:
        "-- Insert a new customer and verify\nINSERT INTO customers(id, name, city, signup_date)\nVALUES (6, 'Farah', 'Delhi', '2026-04-01');\n\nSELECT name, city\nFROM customers\nWHERE id = 6;",
      exercises: {
        beginner: {
          prompt: "Insert a customer (id=6, Farah, Delhi) then select (name, city) for id=6.",
          starterCode:
            "-- Write your SQL here\nINSERT INTO customers(id, name, city, signup_date)\nVALUES (6, 'Farah', 'Delhi', '2026-04-01');\n\nSELECT name, city\nFROM customers\nWHERE id = 6;\n",
          expectedOutput: "name,city\nFarah,Delhi",
        },
        intermediate: {
          prompt: "Update order 3 from cancelled to completed, then count completed orders (count).",
          starterCode:
            "-- Write your SQL here\nUPDATE orders\nSET status = 'completed'\nWHERE id = 3;\n\nSELECT COUNT(*) AS count\nFROM orders\nWHERE status = 'completed';\n",
          expectedOutput: "count\n5",
        },
        advanced: {
          prompt: "Delete order_items for order_id=3, then show total_qty for order 3 as 0 (use COALESCE).",
          starterCode:
            "-- Write your SQL here\nDELETE FROM order_items WHERE order_id = 3;\n\nSELECT COALESCE(SUM(quantity), 0) AS total_qty\nFROM order_items\nWHERE order_id = 3;\n",
          expectedOutput: "total_qty\n0",
        },
      },
    },
    {
      id: "sql-transactions",
      title: "Transactions (TCL)",
      description: "BEGIN, COMMIT, ROLLBACK for safe changes",
      category: "Transactions (TCL)",
      content:
        "## Transactions\n\nTransactions let you group changes so they either all happen or none happen.\n\n### Commands\n- `BEGIN` / `BEGIN TRANSACTION`\n- `COMMIT` save changes\n- `ROLLBACK` undo changes\n\nThis is essential for correctness in real systems (payments, inventory, etc.).",
      codeExample:
        "BEGIN;\nUPDATE products SET price = 15 WHERE name = 'Pen';\nCOMMIT;\nSELECT price FROM products WHERE name = 'Pen';",
      exercises: {
        beginner: {
          prompt: "BEGIN; insert a customer (id=6); ROLLBACK; then count customers (count).",
          starterCode:
            "-- Write your SQL here\nBEGIN;\nINSERT INTO customers(id, name, city, signup_date) VALUES (6, 'Farah', 'Delhi', '2026-04-01');\nROLLBACK;\nSELECT COUNT(*) AS count FROM customers;\n",
          expectedOutput: "count\n5",
        },
        intermediate: {
          prompt: "BEGIN; update Pen price to 9999; ROLLBACK; then select Pen price (price).",
          starterCode:
            "-- Write your SQL here\nBEGIN;\nUPDATE products SET price = 9999 WHERE name = 'Pen';\nROLLBACK;\nSELECT price FROM products WHERE name = 'Pen';\n",
          expectedOutput: "price\n10",
        },
        advanced: {
          prompt: "BEGIN; update Pen price to 15; COMMIT; then select Pen price (price).",
          starterCode:
            "-- Write your SQL here\nBEGIN;\nUPDATE products SET price = 15 WHERE name = 'Pen';\nCOMMIT;\nSELECT price FROM products WHERE name = 'Pen';\n",
          expectedOutput: "price\n15",
        },
      },
    },
    {
      id: "sql-indexes",
      title: "Indexes & Performance Basics",
      description: "What indexes do and when to use them",
      category: "Indexes",
      content:
        "## Indexes\n\nIndexes speed up lookups by creating an additional data structure.\n\n### Key idea\nIndexes can improve read performance but may slow down writes.\n\nIn SQLite, you can inspect indexes via `sqlite_master`.",
      codeExample:
        "CREATE INDEX idx_orders_customer ON orders(customer_id);\n\nSELECT name\nFROM sqlite_master\nWHERE type='index' AND tbl_name='orders'\nORDER BY name;",
      exercises: {
        beginner: {
          prompt: "Create index idx_orders_customer on orders(customer_id) then list index names for orders (name).",
          starterCode:
            "-- Write your SQL here\nCREATE INDEX idx_orders_customer ON orders(customer_id);\n\nSELECT name\nFROM sqlite_master\nWHERE type='index' AND tbl_name='orders'\nORDER BY name;\n",
          expectedOutput: "name\nidx_orders_customer",
        },
        intermediate: {
          prompt: "Create two indexes on orders: idx_orders_customer and idx_orders_status, then list them ordered by name.",
          starterCode:
            "-- Write your SQL here\nCREATE INDEX idx_orders_customer ON orders(customer_id);\nCREATE INDEX idx_orders_status ON orders(status);\n\nSELECT name\nFROM sqlite_master\nWHERE type='index' AND tbl_name='orders'\nORDER BY name;\n",
          expectedOutput: "name\nidx_orders_customer\nidx_orders_status",
        },
        advanced: {
          prompt: "After creating the two indexes, count how many indexes exist on orders (count).",
          starterCode:
            "-- Write your SQL here\nCREATE INDEX idx_orders_customer ON orders(customer_id);\nCREATE INDEX idx_orders_status ON orders(status);\n\nSELECT COUNT(*) AS count\nFROM sqlite_master\nWHERE type='index' AND tbl_name='orders';\n",
          expectedOutput: "count\n2",
        },
      },
    },
    {
      id: "sql-views",
      title: "Views",
      description: "Saved queries for reuse and simplicity",
      category: "Views",
      content:
        "## Views\n\nA view is a saved query that acts like a virtual table.\n\n### Why views?\n- Reuse common joins\n- Simplify reporting queries\n- Keep application queries cleaner",
      codeExample:
        "CREATE VIEW v_completed_orders AS\nSELECT o.id AS order_id, c.name, o.order_date\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'completed';\n\nSELECT order_id, name\nFROM v_completed_orders\nORDER BY order_id\nLIMIT 2;",
      exercises: {
        beginner: {
          prompt: "Create view v_completed_orders (orders + customers for completed) then select first 2 rows (order_id, name) ordered by order_id.",
          starterCode:
            "-- Write your SQL here\nCREATE VIEW v_completed_orders AS\nSELECT o.id AS order_id, c.name, o.order_date\nFROM orders o\nJOIN customers c ON c.id = o.customer_id\nWHERE o.status = 'completed';\n\nSELECT order_id, name\nFROM v_completed_orders\nORDER BY order_id\nLIMIT 2;\n",
          expectedOutput: "order_id,name\n1,Alice\n2,Bob",
        },
        intermediate: {
          prompt: "Create view v_customer_spend (name,total_spent for completed) then list customers with total_spent > 2000 ordered by total_spent DESC.",
          starterCode:
            "-- Write your SQL here\nCREATE VIEW v_customer_spend AS\nWITH order_revenue AS (\n  SELECT o.id AS order_id, o.customer_id, SUM(p.price * oi.quantity) AS revenue\n  FROM orders o\n  JOIN order_items oi ON oi.order_id = o.id\n  JOIN products p ON p.id = oi.product_id\n  WHERE o.status = 'completed'\n  GROUP BY o.id, o.customer_id\n)\nSELECT c.name, COALESCE(SUM(orv.revenue), 0) AS total_spent\nFROM customers c\nLEFT JOIN order_revenue orv ON orv.customer_id = c.id\nGROUP BY c.id, c.name;\n\nSELECT name, total_spent\nFROM v_customer_spend\nWHERE total_spent > 2000\nORDER BY total_spent DESC;\n",
          expectedOutput: "name,total_spent\nDiana,3050\nCharlie,2860",
        },
        advanced: {
          prompt: "Create then DROP view v_customer_spend, then verify it no longer exists (count).",
          starterCode:
            "-- Write your SQL here\nCREATE VIEW v_customer_spend AS\nSELECT 1 AS x;\n\nDROP VIEW v_customer_spend;\n\nSELECT COUNT(*) AS count\nFROM sqlite_master\nWHERE type='view' AND name='v_customer_spend';\n",
          expectedOutput: "count\n0",
        },
      },
    },
  ];
}

export const careerTracks: CareerTrack[] = [
  {
    id: "sql",
    title: "SQL & Databases",
    description: "Learn SQL with structured lessons and a built-in practice database",
    color: "primary",
    language: "sql",
    lessons: sqlLessons(),
  },
  { id: "data-analysis", title: "Data Analysis", description: "Master data analysis with Python", color: "primary", lessons: da() },
  { id: "web-development", title: "Web Development", description: "Build web apps and APIs", color: "streak-green", lessons: wd() },
  { id: "ai-ml", title: "AI & Machine Learning", description: "Build intelligent systems", color: "expert-purple", lessons: aiml() },
  { id: "automation", title: "Automation & Scripting", description: "Automate tasks with Python", color: "python-yellow", lessons: auto() },
  { id: "data-engineering", title: "Data Engineering", description: "Build data pipelines", color: "reward-gold", lessons: de() },
  { id: "cybersecurity", title: "Cybersecurity", description: "Security with Python", color: "destructive", lessons: cs() },
  { id: "git", title: "GitHub Mastery (Start to Master)", description: "Master Git and GitHub for teams", color: "expert-purple", lessons: githubMastery() },
];
