import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Circle,
  Coffee,
  ExternalLink,
  Flame,
  Lock,
  Map as MapIcon,
  Plus,
  Radar,
  Shield,
  Sparkles,
  Sunrise,
  Target,
  Trash2,
  Undo2,
  Unlock,
  X,
  Zap,
} from "lucide-react";

const STORAGE_KEY = "career-quest-v3";

const TRACKS = {
  "fde-se": {
    id: "fde-se",
    title: "Big 4 Tech Consulting + Tech Sales Programs",
    short: "Consulting + Sales",
    role: "primary",
    summary:
      "Big 4 Tech Advisory (Deloitte/EY/PwC/KPMG) + Tech Sales new-grad programs (Salesforce Futureforce, MSFT Aspire, AWS Tech U, Snowflake, Oracle, HubSpot). Foundation-first plan toward a Dec 2026 offer.",
    salaryBand: "$80k–110k Y1, $200k+ by Y3–Y5",
  },
  bie: {
    id: "bie",
    title: "Product / Data Analyst at Tech",
    short: "Analyst",
    role: "fallback",
    summary:
      "Analyst-flavored track. Product/Data Analyst at SaaS (Salesforce, HubSpot, Atlassian, Asana, Notion). SQL is the differentiator. Same foundation as the primary track.",
    salaryBand: "$80k–110k Y1",
  },
};

const TRACK_LOCK_END = "2026-08-01";
const APPLICATION_PEAK_DATE = "2026-10-01";
const CALENDAR_START_DATE = "2026-05-01";
const BUFFER_WEEKS = 2;

const STAGES = [
  {
    id: "stage-1",
    order: 1,
    title: "SQL Mastery",
    weeks: "4 weeks (Foundation)",
    weeksMin: 4,
    weeksMax: 4,
    tags: ["FDE", "SE", "BIE"],
    concepts: [
      "JOINs (inner / left / right / full / self)",
      "Window functions (ROW_NUMBER, RANK, LAG, LEAD, PARTITION BY)",
      "CTEs and subqueries",
      "Aggregations + GROUP BY edge cases",
      "Date/time manipulation",
      "Query optimization basics (indexes, EXPLAIN)",
      "Top-N per group, running totals, gaps and islands",
    ],
    primary: ["dc-sql-fundamentals", "dc-joining-sql", "dc-intermediate-sql", "dc-window-sql", "dc-data-manip-sql", "iq-sql"],
    gapFill: ["mode-sql", "select-star", "stratascratch", "pg-explain"],
    mvp: "25 medium SQL problems solved on StrataScratch. Can write a window function from memory.",
    done: "75 problems solved across difficulties. 4-table JOIN with window function in <10 min.",
    deliverable: "End of Stage 1: SQL drill log with 75+ solved problems linked.",
    whyThisMatters: "SQL is your edge. Most candidates have weak SQL — yours becomes lethal. That's how you out-screen 80% of competition for Big 4, analyst, and even sales roles.",
    aiPrompts: [
      "Generate 5 medium SQL problems mimicking a Big 4 interview. Don't show solutions until I ask.",
      "Quiz me on window functions: 5 questions across ROW_NUMBER, RANK, LAG, LEAD, and PARTITION BY.",
      "I solved this problem [paste]. Show me 2 alternative approaches and explain when each is faster.",
    ],
  },
  {
    id: "stage-2",
    order: 2,
    title: "Excel + Tableau or Power BI",
    weeks: "3 weeks (Foundation)",
    weeksMin: 3,
    weeksMax: 3,
    tags: ["FDE", "SE", "BIE"],
    concepts: [
      "Excel: VLOOKUP, INDEX/MATCH, XLOOKUP, pivot tables, SUMIFS",
      "Pick ONE: Tableau OR Power BI (don't split)",
      "Connect data, 3 chart types, calculated fields, filters, parameters",
      "Build a full dashboard end-to-end",
      "Data storytelling: titles, what to highlight, what to remove",
    ],
    primary: [],
    gapFill: ["mode-sql"],
    mvp: "1 dashboard live on Tableau Public from a Kaggle dataset.",
    done: "3 dashboards live, comfortable in Excel for any analyst test, can story-tell any chart in 30 seconds.",
    deliverable: "End of Stage 2: public Tableau Public profile with 3+ dashboards.",
    whyThisMatters: "Every analyst + consulting interview asks 'show me a dashboard you've built.' Most candidates fumble. You don't.",
    aiPrompts: [
      "Critique my dashboard [link]. Pretend you're a Big 4 senior consultant. Be brutal.",
      "Walk me through how to story-tell this chart [paste image] to a non-technical exec.",
      "Quiz me: 5 Excel formula questions a Big 4 analyst test would include.",
    ],
  },
  {
    id: "stage-3",
    order: 3,
    title: "Just-Enough Python",
    weeks: "3 weeks (Foundation)",
    weeksMin: 3,
    weeksMax: 3,
    tags: ["FDE", "SE", "BIE"],
    concepts: [
      "pandas: read_csv, filter, groupby, merge, pivot, sort",
      "Basic loops, functions, list/dict comprehensions",
      "1 small visualization (matplotlib basics)",
      "Skip: classes, decorators, async, ML libraries",
    ],
    primary: ["dc-python-fund", "dc-intermediate-python", "dc-pandas-manip", "dc-pandas-joining", "dc-dates", "dc-functions"],
    gapFill: ["real-python"],
    mvp: "Write a function with a for-loop and a pandas groupby without AI.",
    done: "CSV → clean → analyze → visualize in 30 min. Comfortable talking pandas in an interview.",
    deliverable: "End of Stage 3: 1 mini analysis notebook published to GitHub.",
    whyThisMatters: "You're not becoming a Python engineer. You just need to not freeze when an interviewer says 'pull up a dataframe and group by region.' 80/20 rule.",
    aiPrompts: [
      "Quiz me: 5 pandas questions an analyst interview would ask. After my answers, point out what I got wrong.",
      "I have this dataset [describe]. Walk me through a pandas analysis without writing the code — make me write it after.",
      "Convert my SQL query [paste] to pandas, then explain the differences.",
    ],
  },
  {
    id: "stage-4",
    order: 4,
    title: "Portfolio Project",
    weeks: "3 weeks",
    weeksMin: 3,
    weeksMax: 3,
    tags: ["FDE", "SE", "BIE"],
    concepts: [
      "Pick a dataset you actually care about",
      "SQL queries answering 3–5 business questions",
      "1 dashboard (Tableau / Power BI) telling the story",
      "1 pandas notebook with deeper analysis",
      "1-page write-up: problem, approach, finding, recommendation",
      "Public on GitHub + Tableau Public",
    ],
    primary: [],
    gapFill: ["loom"],
    mvp: "Project live with at least the dashboard + 1-page write-up.",
    done: "SQL + dashboard + pandas notebook + write-up all linked from a clean GitHub README.",
    deliverable: "End of Stage 4: portfolio repo on GitHub.",
    whyThisMatters: "Every interview asks 'show me something you've built.' Most candidates have nothing or ChatGPT-generated junk. You have a real project you can defend.",
    aiPrompts: [
      "Critique my portfolio README [paste]. What would a Big 4 hiring manager skip past in 10 seconds?",
      "Pretend you're interviewing me on this project. Ask 5 tough questions a sales engineer interviewer would ask.",
      "I'm stuck on what dataset to pick. Here are my interests: [list]. Suggest 3 datasets that would tell a clear story in 4 weeks.",
    ],
  },
  {
    id: "stage-5",
    order: 5,
    title: "Track Branches: Cases · Sales Pitch · Analyst Depth",
    weeks: "4 weeks",
    weeksMin: 4,
    weeksMax: 4,
    tags: ["FDE", "SE", "BIE"],
    concepts: [
      "Pick 2 of 3 branches based on top tracks",
      "Branch A (Big 4 Cases): 10–15 light cases — market sizing, profitability, tech business problems",
      "Branch B (Tech Sales): pitch + role-play — 'Tell me about yourself' (90s), 'Why sales?', mock cold calls × 10",
      "Branch C (Analyst): 2 more dashboards (1 user funnel), product sense — 'how would you improve [Spotify]?', A/B test reasoning",
      "Common: 15 STAR stories drilled to automatic",
      "Common: Resume tailored per track family (3 versions)",
      "Common: 5 mock interviews on Pramp / NWU career services",
    ],
    primary: ["iq-case", "pramp", "nwu-careers"],
    gapFill: ["amazon-lp", "loom"],
    mvp: "1 of 2 branches deep-prepped + 8 STAR stories + 3 mocks done.",
    done: "2 branches prepped + 15 STAR stories + 5 mocks + behavioral pitch in 90s without thinking.",
    deliverable: "End of Stage 5: STAR doc, mock interview Loom, cover letter templates per firm.",
    whyThisMatters: "Behavioral wins 70% of interview decisions. Most candidates wing it. By the time you interview, your STAR doc is muscle memory.",
    aiPrompts: [
      "I'll give you my STAR story [paste]. Attack it as a tough Big 4 interviewer. Find every hole.",
      "Role-play a Salesforce Futureforce SDR final round. You're an upbeat but evaluative recruiter. Be skeptical.",
      "Quiz me on the 16 Amazon Leadership Principles. Ask me for a STAR story per LP. Tell me if it actually fits.",
    ],
  },
  {
    id: "stage-6",
    order: 6,
    title: "Application Push",
    weeks: "4 weeks (September)",
    weeksMin: 4,
    weeksMax: 4,
    tags: ["FDE", "SE", "BIE"],
    concepts: [
      "100–150 applications across all 3 tracks",
      "Resume tailored per track family (3 versions saved)",
      "Cover letters: template + 30-second per-app customization",
      "Northwestern OCR pipeline + company portals + LinkedIn Easy Apply",
      "5 alumni LinkedIn outreach per week to target firms",
      "Application tracker (status per company)",
    ],
    primary: ["nwu-careers"],
    gapFill: ["pramp"],
    mvp: "30 applications sent. Tracker built. Resume v1 for each track.",
    done: "100+ applications submitted across all 3 tracks. 3 resume versions live. 20+ alumni outreach sent.",
    deliverable: "End of Stage 6: application tracker showing 100+ applied, ready for interview sprint.",
    whyThisMatters: "Volume wins. New grads with 100+ apps land 10x more interviews than ones with 20. Pipeline math is brutal but predictable.",
    aiPrompts: [
      "Critique my resume [paste]. Pretend you're a Big 4 recruiter scanning 200 in an hour. What gets me past 6 seconds?",
      "Help me write 3 different cover letter intros for: Big 4 Tech Consulting · Tech Sales SDR · Product Analyst. 60 words each.",
      "Walk me through outreaching an alum on LinkedIn. Draft a message that's not generic and doesn't ask for too much.",
    ],
  },
  {
    id: "stage-7",
    order: 7,
    title: "Interview Sprint + Negotiation",
    weeks: "12 weeks (Oct–Dec)",
    weeksMin: 12,
    weeksMax: 12,
    tags: ["FDE", "SE", "BIE"],
    concepts: [
      "Daily SQL/Python reps under pressure (InterviewQuery)",
      "Mock interview 1×/week minimum (Pramp + NWU)",
      "Recruiter screen prep + tech screen drilling",
      "Final round prep: research interviewer, team, practice",
      "Reference prep",
      "Salary negotiation: levels.fyi + Lewis Lin basics",
      "Pipeline tracker — every application status logged",
    ],
    primary: ["iq-sql", "iq-python", "iq-case"],
    gapFill: ["pramp", "exponent", "levels-fyi", "lewis-lin", "glassdoor-blind", "nwu-careers"],
    mvp: "5 first-round interviews completed. 1 offer. Daily IQ reps for 30 days.",
    done: "15+ first-round interviews. 3+ offers. 1 accepted with negotiated terms.",
    deliverable: "December 31: signed offer letter at $80k+ base.",
    whyThisMatters: "October–December is the month. Daily reps under pressure beat unstructured study by 5x. This is where the foundation work either lands an offer or stays a hobby.",
    aiPrompts: [
      "Mock interview me as a Big 4 Tech Advisory recruiter for 15 minutes — mix of behavioral and light case. Be tough. Feedback at the end.",
      "I have an offer at $X. Help me negotiate. Role-play the recruiter's pushback. Don't soften it.",
      "I'm 6 weeks in and have 0 first-rounds. Diagnose what's wrong with my pipeline.",
    ],
  },
];

const RESOURCES = {
  // DataCamp (May–July 2026 only)
  "dc-sql-fundamentals": { name: "DataCamp — SQL Fundamentals (track)", url: "https://app.datacamp.com/learn/skill-tracks/sql-fundamentals", tag: "DataCamp · paid May–Jul" },
  "dc-joining-sql": { name: "DataCamp — Joining Data in SQL", url: "https://app.datacamp.com/learn/courses/joining-data-in-postgresql", tag: "DataCamp · paid May–Jul" },
  "dc-intermediate-sql": { name: "DataCamp — Intermediate SQL", url: "https://app.datacamp.com/learn/courses/intermediate-sql", tag: "DataCamp · paid May–Jul" },
  "dc-window-sql": { name: "DataCamp — Window Functions in SQL", url: "https://app.datacamp.com/learn/courses/pyspark-sql-window-functions-and-other-advanced-techniques", tag: "DataCamp · paid May–Jul" },
  "dc-data-manip-sql": { name: "DataCamp — Data Manipulation in SQL", url: "https://app.datacamp.com/learn/courses/data-manipulation-in-sql", tag: "DataCamp · paid May–Jul" },
  "dc-python-fund": { name: "DataCamp — Python Fundamentals (track)", url: "https://app.datacamp.com/learn/skill-tracks/python-fundamentals", tag: "DataCamp · paid May–Jul" },
  "dc-intermediate-python": { name: "DataCamp — Intermediate Python", url: "https://app.datacamp.com/learn/courses/intermediate-python", tag: "DataCamp · paid May–Jul" },
  "dc-pandas-manip": { name: "DataCamp — Data Manipulation with pandas", url: "https://app.datacamp.com/learn/courses/data-manipulation-with-pandas", tag: "DataCamp · paid May–Jul" },
  "dc-pandas-joining": { name: "DataCamp — Joining Data with pandas", url: "https://app.datacamp.com/learn/courses/joining-data-with-pandas", tag: "DataCamp · paid May–Jul" },
  "dc-dates": { name: "DataCamp — Working with Dates and Times", url: "https://app.datacamp.com/learn/courses/working-with-dates-and-times-in-python", tag: "DataCamp · paid May–Jul" },
  "dc-functions": { name: "DataCamp — Writing Functions in Python", url: "https://app.datacamp.com/learn/courses/writing-functions-in-python", tag: "DataCamp · paid May–Jul" },
  "dc-openai": { name: "DataCamp — Working with the OpenAI API", url: "https://app.datacamp.com/learn/courses/working-with-the-openai-api", tag: "DataCamp · paid May–Jul" },
  "dc-anthropic": { name: "DataCamp — Working with the Anthropic API", url: "https://app.datacamp.com/learn/courses/working-with-the-claude-api-in-python", tag: "DataCamp · paid May–Jul" },
  "dc-langchain": { name: "DataCamp — Developing LLM Applications with LangChain", url: "https://app.datacamp.com/learn/courses/developing-llm-applications-with-langchain", tag: "DataCamp · paid May–Jul" },

  // InterviewQuery (lifetime)
  "iq-sql": { name: "InterviewQuery — SQL section", url: "https://www.interviewquery.com/questions?tags=SQL", tag: "InterviewQuery · LIFETIME" },
  "iq-python": { name: "InterviewQuery — Python section", url: "https://www.interviewquery.com/questions?tags=Python", tag: "InterviewQuery · LIFETIME" },
  "iq-case": { name: "InterviewQuery — Case studies / product sense", url: "https://www.interviewquery.com/questions?tags=Case%20Study", tag: "InterviewQuery · LIFETIME" },

  // SQL gap-fill
  "mode-sql": { name: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial", tag: "Free" },
  "select-star": { name: "select-star.io", url: "https://selectstarsql.com/", tag: "Free" },
  "stratascratch": { name: "StrataScratch (free tier)", url: "https://www.stratascratch.com/", tag: "Free" },
  "pg-explain": { name: "PostgreSQL — query planning docs", url: "https://www.postgresql.org/docs/current/using-explain.html", tag: "Free" },

  // Python gap-fill
  "real-python": { name: "Real Python — articles", url: "https://realpython.com/", tag: "Free" },
  "missing-semester": { name: "The Missing Semester (MIT, ~6h)", url: "https://missing.csail.mit.edu/", tag: "Free" },
  "fastapi-tutorial": { name: "FastAPI official tutorial", url: "https://fastapi.tiangolo.com/tutorial/", tag: "Free" },
  "postman": { name: "Postman (free tier)", url: "https://www.postman.com/downloads/", tag: "Free" },

  // AI gap-fill
  "anthropic-docs": { name: "Anthropic docs — Build with Claude", url: "https://docs.anthropic.com/", tag: "Free · primary depth" },
  "openai-cookbook": { name: "OpenAI Cookbook (GitHub)", url: "https://github.com/openai/openai-cookbook", tag: "Free" },
  "deeplearning-ai": { name: "DeepLearning.AI short courses", url: "https://www.deeplearning.ai/short-courses/", tag: "Free with audit" },
  "langchain-academy": { name: "LangChain Academy", url: "https://academy.langchain.com/", tag: "Free" },
  "eugene-yan": { name: "Eugene Yan — RAG patterns + LLM evals", url: "https://eugeneyan.com/", tag: "Free" },
  "hamel-evals": { name: "Hamel Husain — Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/", tag: "Free" },
  "cursor": { name: "Cursor", url: "https://cursor.com/", tag: "Free tier · daily" },
  "claude-code": { name: "Claude Code", url: "https://docs.claude.com/en/docs/claude-code/overview", tag: "Free tier · daily" },

  // Vertical project gap-fill
  "mom-test": { name: "The Mom Test (Rob Fitzpatrick)", url: "https://www.momtestbook.com/", tag: "Library copy" },
  "streamlit": { name: "Streamlit official tutorial", url: "https://docs.streamlit.io/get-started", tag: "Free" },
  "gradio": { name: "Gradio docs", url: "https://www.gradio.app/docs/", tag: "Free" },
  "vercel": { name: "Vercel — free tier", url: "https://vercel.com/docs", tag: "Free tier" },
  "railway": { name: "Railway — free tier", url: "https://docs.railway.com/", tag: "Free tier" },
  "huggingface-spaces": { name: "Hugging Face Spaces", url: "https://huggingface.co/spaces", tag: "Free" },
  "loom": { name: "Loom (free tier)", url: "https://www.loom.com/", tag: "Free tier" },
  "anthropic-cases": { name: "Anthropic customer case studies", url: "https://www.anthropic.com/customers", tag: "Free · template" },

  // Customer skills gap-fill
  "sinek-why": { name: "Simon Sinek — Start With Why (TED)", url: "https://www.ted.com/talks/simon_sinek_how_great_leaders_inspire_action", tag: "Free" },
  "r-salesengineers": { name: "r/SalesEngineers", url: "https://www.reddit.com/r/salesengineers/", tag: "Free" },
  "yt-se-demos": { name: "YouTube: SE / FDE demos (Palantir, Databricks)", url: "https://www.youtube.com/results?search_query=palantir+forward+deployed+demo", tag: "Free" },
  "amazon-lp": { name: "Amazon Leadership Principles", url: "https://www.amazon.jobs/content/en/our-workplace/leadership-principles", tag: "Free" },
  "microsoft-culture": { name: "Microsoft cultural attributes (careers)", url: "https://careers.microsoft.com/v2/global/en/culture", tag: "Free" },
  "salesforce-v2mom": { name: "Salesforce V2MOM (careers)", url: "https://www.salesforce.com/company/careers/", tag: "Free" },
  "pramp": { name: "Pramp — peer mocks", url: "https://www.pramp.com/", tag: "Free" },
  "nwu-careers": { name: "Northwestern career services mocks", url: "https://www.northwestern.edu/careers/", tag: "Free · NWU" },

  // Cloud cert
  "udemy-ccp": { name: "Stephane Maarek Udemy — AWS Cloud Practitioner (~$12)", url: "https://www.udemy.com/user/stephane-maarek/", tag: "Udemy · ~$12 sale" },
  "udemy-saa": { name: "Stephane Maarek Udemy — AWS SAA (~$12)", url: "https://www.udemy.com/user/stephane-maarek/", tag: "Udemy · ~$12 sale" },
  "td-practice": { name: "Tutorials Dojo practice exams (~$15 each)", url: "https://tutorialsdojo.com/", tag: "TD · ~$15" },
  "aws-exam-fees": { name: "AWS exam fees (~$100 CCP, ~$150 SAA)", url: "https://aws.amazon.com/certification/", tag: "AWS exam · paid" },
  "aws-skill-builder": { name: "AWS Skill Builder — CCP Essentials", url: "https://skillbuilder.aws/", tag: "Free" },
  "exampro-yt": { name: "ExamPro YouTube (Andrew Brown) — free CCP", url: "https://www.youtube.com/@ExamProChannel", tag: "Free" },
  "aws-free-tier": { name: "AWS free tier — actually click around", url: "https://aws.amazon.com/free/", tag: "Free tier" },

  // Interview sprint
  "exponent": { name: "Exponent — SE-specific (free trial)", url: "https://www.tryexponent.com/", tag: "Free trial" },
  "levels-fyi": { name: "levels.fyi — compensation", url: "https://www.levels.fyi/", tag: "Free" },
  "lewis-lin": { name: "Lewis C. Lin YouTube — salary negotiation 101", url: "https://www.youtube.com/@LewisLin", tag: "Free" },
  "glassdoor-blind": { name: "Glassdoor + Blind — interview intel", url: "https://www.teamblind.com/", tag: "Free" },
};

const ROLLING_APPLICATIONS = [
  { id: "anthropic", name: "Anthropic FDE / Solutions", url: "https://anthropic.com/careers", priority: "stretch", notes: "Posts continuously" },
  { id: "openai", name: "OpenAI Forward Deployed", url: "https://openai.com/careers/", priority: "stretch", notes: "Posts continuously" },
  { id: "sierra", name: "Sierra Forward Deployed Engineer", url: "https://sierra.ai/careers", priority: "target", notes: "AI-native, accessible" },
  { id: "decagon", name: "Decagon Forward Deployed", url: "https://decagon.ai/careers", priority: "target", notes: "AI-native" },
  { id: "glean", name: "Glean Solutions Engineer", url: "https://glean.com/careers", priority: "target", notes: "" },
  { id: "harvey", name: "Harvey Forward Deployed", url: "https://harvey.ai/careers", priority: "target", notes: "Legal vertical" },
  { id: "hex", name: "Hex Solutions Engineer", url: "https://hex.tech/careers", priority: "target", notes: "Data tooling" },
  { id: "hebbia", name: "Hebbia Forward Deployed", url: "https://hebbia.com/careers", priority: "target", notes: "" },
  { id: "cresta", name: "Cresta Solutions", url: "https://cresta.com/careers", priority: "target", notes: "" },
  { id: "writer", name: "Writer Solutions Engineer", url: "https://writer.com/careers", priority: "target", notes: "" },
  { id: "sana", name: "Sana Forward Deployed", url: "https://sana.ai/careers", priority: "target", notes: "" },
  { id: "cohere", name: "Cohere Solutions", url: "https://cohere.com/careers", priority: "stretch", notes: "" },
  { id: "together", name: "Together Solutions", url: "https://together.ai/careers", priority: "target", notes: "" },
  { id: "huggingface", name: "Hugging Face Solutions", url: "https://huggingface.co/jobs", priority: "target", notes: "" },
  { id: "ibm", name: "IBM Consulting", url: "https://ibm.com/careers/consulting", priority: "safety", notes: "Large volume" },
  { id: "deloitte", name: "Deloitte AI & Data", url: "https://www.deloitte.com/us/en/careers.html", priority: "safety", notes: "" },
  { id: "accenture", name: "Accenture S&C / Tech", url: "https://accenture.com/us-en/careers", priority: "safety", notes: "" },
];

const COHORT_APPLICATIONS = [
  { id: "aws-techu", name: "AWS Tech U Associate Solutions Architect", url: "https://amazon.jobs/en/landing_pages/AWS-techu", window: "August (rolling)", notes: "Sign up for talent network now" },
  { id: "ms-aspire", name: "Microsoft Aspire (new grad portal)", url: "https://careers.microsoft.com/v2/global/en/recentgraduate", window: "July–August", notes: "Apply early in window" },
  { id: "sf-futureforce", name: "Salesforce Futureforce SE", url: "https://salesforce.com/company/careers/university/new-grads/", window: "September–October", notes: "Solution Engineer track" },
  { id: "oracle-classof", name: "Oracle Class Of (Pre-Sales)", url: "https://oracle.com/corporate/careers/students-grads/", window: "July–September", notes: "" },
  { id: "cisco-csap", name: "Cisco Sales Associate Program (CSAP)", url: "https://cisco.com/c/en/us/about/careers/early-in-career.html", window: "June–September", notes: "" },
  { id: "google-ce", name: "Google Customer Engineer Early Career", url: "https://google.com/about/careers/applications/jobs/results/?employment_type=FULL_TIME&target_level=EARLY", window: "Rolling, peaks fall", notes: "" },
];

const APPLICATION_STATUSES = ["not_started", "applied", "phone_screen", "interview", "offer", "rejected"];
const STATUS_LABELS = {
  not_started: "Not started",
  applied: "Applied",
  phone_screen: "Phone screen",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};
const STATUS_STYLES = {
  not_started: "border-stone-200 bg-white text-stone-500",
  applied: "border-amber-300 bg-amber-50 text-amber-800",
  phone_screen: "border-sky-300 bg-sky-50 text-sky-800",
  interview: "border-indigo-300 bg-indigo-50 text-indigo-800",
  offer: "border-emerald-400 bg-emerald-50 text-emerald-800",
  rejected: "border-stone-300 bg-stone-100 text-stone-500",
};
const PRIORITY_STYLES = {
  target: "border-stone-800 bg-stone-900 text-stone-50",
  stretch: "border-amber-300 bg-amber-50 text-amber-800",
  safety: "border-stone-200 bg-stone-50 text-stone-600",
};

const SPRINT_TARGETS = [
  { date: "Jul 16", target: "Phase 1 done — 75 SQL · 3 dashboards · 1 pandas notebook · 10 STARs" },
  { date: "Aug 6", target: "Phase 2 done — 1 portfolio project shipped to GitHub" },
  { date: "Sep 3", target: "Phase 3 done — 2 branches deep-prepped · 8 mocks · 50 LeetCode mediums" },
  { date: "Oct 1", target: "100+ applications submitted across 3 tracks" },
  { date: "Dec 31", target: "1 offer accepted at $80k+ base" },
];

const GAP_RADAR_GATES = {
  big4: {
    title: "Big 4 Tech Consulting Readiness",
    color: "amber",
    gates: [
      { id: "big4-sql-75", label: "75 SQL problems solved" },
      { id: "big4-dashboards-3", label: "3 Tableau / Power BI dashboards live" },
      { id: "big4-portfolio", label: "1 portfolio project on GitHub" },
      { id: "big4-stars-15", label: "15 STAR stories drafted" },
      { id: "big4-cases-10", label: "10 light cases drilled" },
      { id: "big4-mocks-5", label: "5 mock interviews completed" },
    ],
  },
  sales: {
    title: "Tech Sales Readiness",
    color: "indigo",
    gates: [
      { id: "sales-tmay", label: "Tell-me-about-yourself in 90s without thinking" },
      { id: "sales-coldcalls", label: "10 mock cold calls completed" },
      { id: "sales-pitch", label: "1 product pitch recorded on Loom" },
      { id: "sales-spin", label: "SPIN Selling or Challenger Sale read" },
      { id: "sales-research-5", label: "5 target SaaS products researched in depth" },
      { id: "sales-mocks-5", label: "5 SDR/AE mock interviews completed" },
    ],
  },
  analyst: {
    title: "Product / Data Analyst Readiness",
    color: "stone",
    gates: [
      { id: "analyst-sql-75", label: "75 SQL problems solved" },
      { id: "analyst-funnel", label: "1 user-funnel dashboard published" },
      { id: "analyst-product-sense", label: "5 product-sense answers drilled" },
      { id: "analyst-ab", label: "Comfortable explaining an A/B test" },
      { id: "analyst-portfolio", label: "Portfolio project on GitHub" },
      { id: "analyst-mocks-3", label: "3 mock product analytics interviews completed" },
    ],
  },
};

const ARTIFACT_KINDS = [
  { id: "sql_problem", label: "SQL problem solved" },
  { id: "code_commit", label: "Code commit / PR" },
  { id: "loom", label: "Loom recording" },
  { id: "application", label: "Application submitted" },
  { id: "info_interview", label: "Informational interview" },
  { id: "cert_exam", label: "Cert exam passed" },
  { id: "datacamp_course", label: "DataCamp course completed" },
  { id: "iq_problem", label: "InterviewQuery problem solved" },
  { id: "discovery_call", label: "Customer discovery call" },
  { id: "star_story", label: "STAR story written" },
  { id: "other", label: "Other" },
];

const FUTURE_PIVOTS = [
  { id: "da", title: "Pure Data Analyst", note: "Available as a fallback inside the BIE track. Not the primary pitch — FDE/SE is." },
  { id: "ml", title: "ML Engineer", note: "Not on this plan. Past resume projects don't count and won't be defended." },
  { id: "de", title: "Data Engineer (pipelines)", note: "Archived: Zoomcamp, Airflow, Docker. Not on the Dec 2026 path." },
];

const TABS = [
  { id: "today", label: "Today", icon: Sunrise },
  { id: "map", label: "Quest Map", icon: MapIcon },
  { id: "career", label: "Career HQ", icon: Briefcase },
  { id: "resources", label: "Resources", icon: BookOpen },
  { id: "pivots", label: "Future Pivots", icon: Lock },
];

// ---------- Date helpers ----------

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysISO(iso, days) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function diffDays(fromISO, toISO) {
  const a = new Date(fromISO + "T00:00:00");
  const b = new Date(toISO + "T00:00:00");
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function monthKey(iso) {
  return iso.slice(0, 7); // "YYYY-MM"
}

function daysUntil(iso) {
  return diffDays(todayISO(), iso);
}

function formatShort(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatLong(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ---------- State ----------

function createInitialState() {
  return {
    track: "fde-se",
    trackLockedUntil: TRACK_LOCK_END,
    trackChangeLog: [],
    streak: {
      count: 0,
      longest: 0,
      lastCheckinISO: null,
      monthKey: monthKey(todayISO()),
      graceUsedThisMonth: 0,
    },
    today: {
      date: todayISO(),
      anchorMode: "full",
      checks: { full: [false, false, false], half: [false, false], mvd: false },
    },
    stages: {},
    calendarStartDate: CALENDAR_START_DATE,
    calendarShiftDays: 0,
    applications: {},
    artifacts: [],
    gapRadar: {},
    lessons: [],
    lessonsMondayPromptISO: null,
    // V2 additions
    capture: [],              // [{id, dateISO, text}] — quick-dump inbox
    energy: {},               // { "YYYY-MM-DD": { sleep: bool, move: bool, social: bool } }
    leetcode: {               // NeetCode 150 side track
      easySolved: 0,
      mediumSolved: 0,
      log: [],                // [{id, dateISO, problem, difficulty, notes}]
    },
    discovery: [],            // [{id, name, role, company, source, status, lastTouchISO, nextStepISO, notes}]
    pipeline: {},              // { companyId: { stages: [{name, dateISO, notes}], offerStatus } }
    starStories: [],          // [{id, title, body, lp, lastDrilledISO}]
  };
}

const LESSON_CATEGORIES = [
  { id: "concept_gap", label: "Concept gap", short: "concept" },
  { id: "application_error", label: "Application error", short: "application" },
  { id: "recurring_pattern", label: "Recurring pattern", short: "recurring" },
];
const LESSONS_MAX = 500;
const REVIEW_STALE_DAYS = 7;

function lessonCategoryLabel(id) {
  return LESSON_CATEGORIES.find((c) => c.id === id)?.label || id;
}

function isStaleReview(lesson) {
  if (!lesson.last_reviewed) return false;
  const last = lesson.last_reviewed.slice(0, 10);
  return diffDays(last, todayISO()) > REVIEW_STALE_DAYS;
}

function isReviewQueueItem(lesson) {
  return !lesson.reviewed || isStaleReview(lesson);
}

function isMondayISO(iso) {
  return new Date(iso + "T00:00:00").getDay() === 1;
}

function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `lsn-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function loadState() {
  if (typeof window === "undefined") return createInitialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    return { ...createInitialState(), ...parsed };
  } catch {
    return createInitialState();
  }
}

function rolloverIfNeeded(state) {
  const now = todayISO();
  let next = state;

  // monthly grace reset
  const curMonth = monthKey(now);
  if (state.streak.monthKey !== curMonth) {
    next = { ...next, streak: { ...next.streak, monthKey: curMonth, graceUsedThisMonth: 0 } };
  }

  // day rollover — apply grace logic if a day passed
  if (state.today.date !== now) {
    const last = state.streak.lastCheckinISO;
    const yesterday = addDaysISO(now, -1);

    let streak = next.streak;
    if (last) {
      const gap = diffDays(last, now); // days between last checkin and today
      if (gap === 1) {
        // checked in yesterday — keep streak as-is for now (today not started)
      } else if (gap > 1) {
        // missed days — apply grace if available, else break streak
        const missed = gap - 1;
        const graceLeft = 2 - streak.graceUsedThisMonth;
        if (missed <= graceLeft) {
          streak = { ...streak, graceUsedThisMonth: streak.graceUsedThisMonth + missed };
        } else {
          streak = { ...streak, count: 0 };
        }
      }
    }

    // shift calendar by missed days (after the start date and before today)
    const startToYesterday = state.calendarStartDate
      ? Math.max(0, diffDays(state.calendarStartDate, yesterday))
      : 0;
    const calendarShiftDays = state.calendarShiftDays || 0;

    next = {
      ...next,
      streak,
      today: {
        date: now,
        anchorMode: state.today.anchorMode || "full",
        checks: { full: [false, false, false], half: [false, false], mvd: false },
      },
      calendarShiftDays: calendarShiftDays + 0, // recomputed below if needed
    };
    void startToYesterday;
  }

  return next;
}

// Compute floating calendar layout
function computeCalendar(state) {
  const start = addDaysISO(state.calendarStartDate, state.calendarShiftDays || 0);
  let cursor = start;
  const layout = STAGES.map((stage) => {
    const startISO = cursor;
    const days = (state.stages[stage.id]?.mvpShipped ? stage.weeksMin : stage.weeksMax) * 7;
    const endISO = addDaysISO(cursor, days);
    cursor = endISO;
    return { stageId: stage.id, startISO, endISO, days };
  });
  const stageEnd = cursor;
  const bufferStart = stageEnd;
  const bufferEnd = addDaysISO(bufferStart, BUFFER_WEEKS * 7);
  return { start, layout, bufferStart, bufferEnd, peak: APPLICATION_PEAK_DATE };
}

function getCalendarStageId(state) {
  const cal = computeCalendar(state);
  const today = todayISO();
  for (const row of cal.layout) {
    if (row.startISO <= today && today < row.endISO) return row.stageId;
  }
  if (today < cal.layout[0].startISO) return STAGES[0].id;
  return STAGES[STAGES.length - 1].id;
}

// The stage the user is actually focused on right now: explicit focusStageId override (set when MVP shipped),
// otherwise the calendar position.
function getCurrentStageId(state) {
  if (state.focusStageId) {
    const stage = STAGES.find((s) => s.id === state.focusStageId);
    // if focus stage is shipped, fall through to next unshipped
    if (stage && !state.stages?.[stage.id]?.mvpShipped) return stage.id;
  }
  // pick first un-MVP-shipped stage at or after the calendar position
  const calId = getCalendarStageId(state);
  const calIdx = STAGES.findIndex((s) => s.id === calId);
  for (let i = calIdx; i < STAGES.length; i++) {
    if (!state.stages?.[STAGES[i].id]?.mvpShipped) return STAGES[i].id;
  }
  return STAGES[STAGES.length - 1].id;
}

function nextUnshippedStageId(state, justShippedId) {
  const idx = STAGES.findIndex((s) => s.id === justShippedId);
  for (let i = idx + 1; i < STAGES.length; i++) {
    if (!state.stages?.[STAGES[i].id]?.mvpShipped) return STAGES[i].id;
  }
  // wrap: nothing later unshipped, leave focus null
  return null;
}

// ---------- App ----------

export default function App() {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState("today");
  const [trackModalOpen, setTrackModalOpen] = useState(false);
  const [switchingCostOpen, setSwitchingCostOpen] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState(null);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [reviewQueueIds, setReviewQueueIds] = useState(null); // null = closed; [] = empty done; array of ids active

  useEffect(() => {
    setState((prev) => rolloverIfNeeded(prev));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const calendar = useMemo(() => computeCalendar(state), [state]);
  const currentStageId = useMemo(() => getCurrentStageId(state), [state]);
  const currentStage = STAGES.find((s) => s.id === currentStageId);
  const trackInfo = TRACKS[state.track];
  const isTrackLocked = todayISO() < state.trackLockedUntil;

  function checkInToday() {
    const now = todayISO();
    setState((prev) => {
      const last = prev.streak.lastCheckinISO;
      let count = prev.streak.count;
      if (!last || diffDays(last, now) >= 1) {
        count = count + 1;
      }
      const longest = Math.max(prev.streak.longest || 0, count);
      return {
        ...prev,
        streak: { ...prev.streak, lastCheckinISO: now, count, longest },
      };
    });
  }

  function setAnchorMode(mode) {
    setState((prev) => ({
      ...prev,
      today: { ...prev.today, anchorMode: mode },
    }));
  }

  function toggleAnchorCheck(mode, idx) {
    setState((prev) => {
      const checks = { ...prev.today.checks };
      if (mode === "mvd") {
        checks.mvd = !checks.mvd;
      } else {
        checks[mode] = checks[mode].map((v, i) => (i === idx ? !v : v));
      }
      return { ...prev, today: { ...prev.today, checks } };
    });
  }

  function shipMVP(stageId) {
    setState((prev) => ({
      ...prev,
      stages: {
        ...prev.stages,
        [stageId]: { ...(prev.stages[stageId] || {}), mvpShipped: true, mvpShippedAt: Date.now() },
      },
      focusStageId: nextUnshippedStageId(prev, stageId),
      artifacts: [
        { id: `${stageId}-mvp-${Date.now()}`, kind: "code_commit", dateISO: todayISO(), description: `Shipped MVP for ${STAGES.find((s) => s.id === stageId)?.title}` },
        ...prev.artifacts,
      ],
    }));
  }

  function unshipMVP(stageId) {
    setState((prev) => {
      const next = { ...prev.stages };
      if (next[stageId]) {
        next[stageId] = { ...next[stageId], mvpShipped: false, mvpShippedAt: null };
      }
      // remove the auto-logged artifact for this stage's MVP
      const filtered = prev.artifacts.filter((a) => !a.id.startsWith(`${stageId}-mvp-`));
      return { ...prev, stages: next, focusStageId: stageId, artifacts: filtered };
    });
  }

  function setApplicationStatus(progId, status) {
    setState((prev) => {
      const prevApp = prev.applications[progId] || {};
      const next = { ...prevApp, status };
      if (status === "applied" && !prevApp.appliedISO) next.appliedISO = todayISO();
      const apps = { ...prev.applications, [progId]: next };
      let artifacts = prev.artifacts;
      if (status === "applied" && !prevApp.appliedISO) {
        const program = [...ROLLING_APPLICATIONS, ...COHORT_APPLICATIONS].find((p) => p.id === progId);
        artifacts = [
          { id: `app-${progId}-${Date.now()}`, kind: "application", dateISO: todayISO(), description: `Applied to ${program?.name || progId}` },
          ...artifacts,
        ];
      }
      return { ...prev, applications: apps, artifacts };
    });
  }

  function addArtifact({ kind, description, dateISO }) {
    setState((prev) => ({
      ...prev,
      artifacts: [{ id: `art-${Date.now()}-${Math.random()}`, kind, dateISO, description }, ...prev.artifacts],
    }));
  }

  function removeArtifact(id) {
    setState((prev) => ({ ...prev, artifacts: prev.artifacts.filter((a) => a.id !== id) }));
  }

  function setGate(gateId, val) {
    setState((prev) => ({ ...prev, gapRadar: { ...prev.gapRadar, [gateId]: val } }));
  }

  function shiftCalendar(days) {
    setState((prev) => ({ ...prev, calendarShiftDays: Math.max(0, (prev.calendarShiftDays || 0) + days) }));
  }

  function resetCalendarShift() {
    setState((prev) => ({ ...prev, calendarShiftDays: 0 }));
  }

  function addLesson(entry) {
    setState((prev) => {
      const lessons = [
        {
          id: uuid(),
          date: new Date().toISOString(),
          source: entry.source.trim(),
          category: entry.category,
          tag: entry.tag.trim(),
          what_i_tried: entry.what_i_tried.trim(),
          what_was_correct: entry.what_was_correct.trim(),
          why_i_missed: entry.why_i_missed.trim(),
          reviewed: false,
          review_count: 0,
          last_reviewed: null,
        },
        ...prev.lessons,
      ];
      return { ...prev, lessons };
    });
  }

  function updateLesson(id, patch) {
    setState((prev) => ({
      ...prev,
      lessons: prev.lessons.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));
  }

  function deleteLesson(id) {
    setState((prev) => ({ ...prev, lessons: prev.lessons.filter((l) => l.id !== id) }));
  }

  function markLessonReviewed(id) {
    const nowISO = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      lessons: prev.lessons.map((l) =>
        l.id === id
          ? {
              ...l,
              reviewed: true,
              review_count: (l.review_count || 0) + 1,
              last_reviewed: nowISO,
            }
          : l,
      ),
    }));
  }

  function reLogLesson(id, restatement) {
    const nowISO = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      lessons: prev.lessons.map((l) =>
        l.id === id
          ? {
              ...l,
              reviewed: false,
              what_i_tried: restatement?.trim() ? restatement.trim() : l.what_i_tried,
              last_reviewed: nowISO,
            }
          : l,
      ),
    }));
  }

  function dismissMondayPrompt() {
    setState((prev) => ({ ...prev, lessonsMondayPromptISO: todayISO() }));
  }

  function changeTrack(newTrack, reasoning) {
    setState((prev) => ({
      ...prev,
      track: newTrack,
      trackLockedUntil: addDaysISO(todayISO(), 7), // re-lock briefly
      trackChangeLog: [
        { date: todayISO(), fromTrack: prev.track, toTrack: newTrack, reasoning },
        ...prev.trackChangeLog,
      ],
    }));
  }

  function addCapture(text) {
    if (!text || !text.trim()) return;
    setState((prev) => ({
      ...prev,
      capture: [{ id: uuid(), dateISO: todayISO(), text: text.trim() }, ...(prev.capture || [])],
    }));
  }
  function deleteCapture(id) {
    setState((prev) => ({ ...prev, capture: (prev.capture || []).filter((c) => c.id !== id) }));
  }
  function setEnergyToday(field, value) {
    const today = todayISO();
    setState((prev) => ({
      ...prev,
      energy: { ...(prev.energy || {}), [today]: { ...((prev.energy || {})[today] || {}), [field]: value } },
    }));
  }
  function logLeetcode({ problem, difficulty, notes }) {
    setState((prev) => {
      const lc = prev.leetcode || { easySolved: 0, mediumSolved: 0, log: [] };
      const entry = { id: uuid(), dateISO: todayISO(), problem: problem.trim(), difficulty, notes: (notes || "").trim() };
      return {
        ...prev,
        leetcode: {
          easySolved: lc.easySolved + (difficulty === "easy" ? 1 : 0),
          mediumSolved: lc.mediumSolved + (difficulty === "medium" ? 1 : 0),
          log: [entry, ...(lc.log || [])],
        },
      };
    });
  }
  function addDiscoveryContact(entry) {
    setState((prev) => ({
      ...prev,
      discovery: [{ id: uuid(), lastTouchISO: todayISO(), status: "outreach", ...entry }, ...(prev.discovery || [])],
    }));
  }
  function updateDiscoveryContact(id, patch) {
    setState((prev) => ({
      ...prev,
      discovery: (prev.discovery || []).map((c) => (c.id === id ? { ...c, ...patch } : c)),
    }));
  }
  function deleteDiscoveryContact(id) {
    setState((prev) => ({ ...prev, discovery: (prev.discovery || []).filter((c) => c.id !== id) }));
  }
  function addStarStory(story) {
    setState((prev) => ({
      ...prev,
      starStories: [{ id: uuid(), lastDrilledISO: null, ...story }, ...(prev.starStories || [])],
    }));
  }
  function updateStarStory(id, patch) {
    setState((prev) => ({
      ...prev,
      starStories: (prev.starStories || []).map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  }
  function deleteStarStory(id) {
    setState((prev) => ({ ...prev, starStories: (prev.starStories || []).filter((s) => s.id !== id) }));
  }
  function addPipelineStage(companyId, stage) {
    setState((prev) => {
      const existing = (prev.pipeline || {})[companyId] || { stages: [], offerStatus: null };
      return {
        ...prev,
        pipeline: {
          ...(prev.pipeline || {}),
          [companyId]: { ...existing, stages: [...existing.stages, { ...stage, dateISO: stage.dateISO || todayISO() }] },
        },
      };
    });
  }
  function setPipelineOffer(companyId, offerStatus) {
    setState((prev) => {
      const existing = (prev.pipeline || {})[companyId] || { stages: [], offerStatus: null };
      return { ...prev, pipeline: { ...(prev.pipeline || {}), [companyId]: { ...existing, offerStatus } } };
    });
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header trackInfo={trackInfo} streak={state.streak} />
      <Tabs active={tab} onChange={setTab} />

      <main className="mx-auto max-w-5xl px-4 pb-24 pt-6">
        {tab === "today" && (
          <Today
            state={state}
            currentStage={currentStage}
            calendar={calendar}
            isTrackLocked={isTrackLocked}
            onOpenTrack={() => setSwitchingCostOpen(true)}
            onCheckIn={checkInToday}
            onSetMode={setAnchorMode}
            onToggleCheck={toggleAnchorCheck}
            onShipMVP={shipMVP}
            onUnshipMVP={unshipMVP}
            onShiftCalendar={shiftCalendar}
            onResetCalendarShift={resetCalendarShift}
            onOpenLessonModal={() => {
              setEditingLesson(null);
              setLessonModalOpen(true);
            }}
            onStartMondayReview={() => {
              const candidates = state.lessons.filter(isReviewQueueItem);
              const shuffled = [...candidates].sort(() => Math.random() - 0.5).slice(0, 3);
              setReviewQueueIds(shuffled.map((l) => l.id));
              dismissMondayPrompt();
            }}
            onDismissMondayPrompt={dismissMondayPrompt}
            onAddCapture={addCapture}
            onDeleteCapture={deleteCapture}
            onSetEnergy={setEnergyToday}
            onLogLeetcode={logLeetcode}
          />
        )}
        {tab === "map" && (
          <QuestMap
            state={state}
            calendar={calendar}
            currentStageId={currentStageId}
            selectedStageId={selectedStageId || currentStageId}
            onPick={setSelectedStageId}
            onShipMVP={shipMVP}
            onUnshipMVP={unshipMVP}
          />
        )}
        {tab === "career" && (
          <CareerHQ
            state={state}
            onSetApplicationStatus={setApplicationStatus}
            onAddArtifact={addArtifact}
            onRemoveArtifact={removeArtifact}
            onSetGate={setGate}
            onOpenLessonModal={() => {
              setEditingLesson(null);
              setLessonModalOpen(true);
            }}
            onEditLesson={(lesson) => {
              setEditingLesson(lesson);
              setLessonModalOpen(true);
            }}
            onDeleteLesson={deleteLesson}
            onStartReview={(ids) => setReviewQueueIds(ids)}
            onAddDiscovery={addDiscoveryContact}
            onUpdateDiscovery={updateDiscoveryContact}
            onDeleteDiscovery={deleteDiscoveryContact}
            onAddStar={addStarStory}
            onUpdateStar={updateStarStory}
            onDeleteStar={deleteStarStory}
            onAddPipelineStage={addPipelineStage}
            onSetPipelineOffer={setPipelineOffer}
          />
        )}
        {tab === "resources" && <Resources currentStageId={currentStageId} />}
        {tab === "pivots" && <FuturePivots />}
      </main>

      {trackModalOpen && (
        <TrackChangeModal
          state={state}
          onClose={() => setTrackModalOpen(false)}
          onConfirm={(newTrack, reasoning) => {
            changeTrack(newTrack, reasoning);
            setTrackModalOpen(false);
          }}
        />
      )}

      {switchingCostOpen && (
        <SwitchingCostModal
          state={state}
          calendar={calendar}
          onClose={() => setSwitchingCostOpen(false)}
          onProceed={() => {
            setSwitchingCostOpen(false);
            setTrackModalOpen(true);
          }}
        />
      )}

      {lessonModalOpen && (
        <LessonModal
          existingLesson={editingLesson}
          existingTags={[...new Set(state.lessons.map((l) => l.tag).filter(Boolean))]}
          atCapacity={state.lessons.length >= LESSONS_MAX}
          onClose={() => {
            setLessonModalOpen(false);
            setEditingLesson(null);
          }}
          onSave={(entry) => {
            if (editingLesson) {
              updateLesson(editingLesson.id, entry);
            } else {
              addLesson(entry);
            }
            setLessonModalOpen(false);
            setEditingLesson(null);
          }}
        />
      )}

      {reviewQueueIds && reviewQueueIds.length > 0 && (() => {
        const queue = reviewQueueIds
          .map((id) => state.lessons.find((l) => l.id === id))
          .filter(Boolean);
        return (
          <LessonReviewModal
            key={queue[0]?.id || "empty"}
            lessons={queue}
            onClose={() => setReviewQueueIds(null)}
            onMarkReviewed={(id) => {
              markLessonReviewed(id);
              setReviewQueueIds((q) => (q ? q.filter((qid) => qid !== id) : q));
            }}
            onReLog={(id, restatement) => {
              reLogLesson(id, restatement);
              setReviewQueueIds((q) => (q ? q.filter((qid) => qid !== id) : q));
            }}
          />
        );
      })()}
    </div>
  );
}

// ---------- Layout ----------

function BambooSprig({ className = "" }) {
  // a single, calm bamboo branch — drawn as inline SVG so it inherits theme
  return (
    <svg viewBox="0 0 80 120" fill="none" className={className} aria-hidden="true">
      {/* main stem */}
      <path d="M50 118 Q44 90 48 60 Q52 32 42 8" stroke="currentColor" strokeWidth="1.4" fill="none" />
      {/* node rings */}
      <path d="M46 90 Q49 88 52 90" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M46 60 Q49 58 52 60" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M44 32 Q47 30 50 32" stroke="currentColor" strokeWidth="1" fill="none" />
      {/* leaves */}
      <path d="M48 80 Q60 76 70 70 Q64 80 50 84 Z" fill="currentColor" opacity="0.55" />
      <path d="M50 50 Q62 44 72 40 Q66 52 52 54 Z" fill="currentColor" opacity="0.45" />
      <path d="M46 24 Q34 18 22 14 Q30 26 44 28 Z" fill="currentColor" opacity="0.55" />
      <path d="M44 8 Q36 2 28 0 Q34 8 42 12 Z" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

function PineSprig({ className = "" }) {
  // single pine branch — angled
  return (
    <svg viewBox="0 0 120 80" fill="none" className={className} aria-hidden="true">
      <path d="M2 40 Q60 38 118 30" stroke="currentColor" strokeWidth="1.2" fill="none" />
      {[10, 24, 38, 52, 66, 80, 94].map((x) => (
        <g key={x}>
          <path d={`M${x} 40 L${x - 4} 30 M${x} 40 L${x - 6} 32 M${x} 40 L${x - 5} 34`} stroke="currentColor" strokeWidth="1" />
          <path d={`M${x} 40 L${x + 4} 50 M${x} 40 L${x + 6} 48 M${x} 40 L${x + 5} 46`} stroke="currentColor" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}

function InkBlob({ className = "" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="blob" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.18" />
          <stop offset="60%" stopColor="currentColor" stopOpacity="0.06" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="100" rx="95" ry="80" fill="url(#blob)" />
    </svg>
  );
}

function Header({ trackInfo, streak }) {
  const graceLeft = 2 - streak.graceUsedThisMonth;
  return (
    <header className="relative mx-auto max-w-5xl px-4 pb-4 pt-8">
      <PineSprig className="pointer-events-none absolute right-2 top-2 hidden h-12 w-24 text-sage opacity-40 drift sm:block" />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="eyebrow">{formatLong(todayISO())} · No. {String(diffDays(CALENDAR_START_DATE, todayISO()) + 1).padStart(3, "0")}</div>
          <h1 className="mt-1 font-serif text-4xl font-medium leading-[0.95] tracking-tight text-ink sm:text-5xl">
            FDE / SE Roadmap
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Primary: {trackInfo.short} <span className="text-stone-400">·</span> Dec 2026 offer <span className="text-stone-400">·</span> <span className="tabular">{trackInfo.salaryBand}</span>
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-stone-300 bg-paper px-3 py-1.5 text-xs">
            <Flame size={12} className="text-amber-700" />
            <span className="tabular font-medium text-ink">{streak.count}</span>
            <span className="text-stone-500">day streak</span>
            <span className="hidden text-stone-400 sm:inline">·</span>
            <span className="hidden tabular text-stone-500 sm:inline">{graceLeft}/2 grace</span>
          </div>
        </div>
      </div>
      <div className="rule mt-5" />
    </header>
  );
}

function Tabs({ active, onChange }) {
  return (
    <nav className="sticky top-0 z-10 border-b border-rule bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-start gap-1 px-4 py-2 sm:gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              aria-label={tab.label}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full border px-3 py-1.5 text-sm transition sm:flex-none sm:px-4 ${
                isActive
                  ? "border-ink bg-ink text-paper"
                  : "border-rule bg-paper text-stone-600 hover:border-stone-400 hover:text-ink"
              }`}
            >
              <Icon size={14} className="shrink-0" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function SectionCard({ title, emphasis = false, children, footerNote, dark = false }) {
  const wrapperClass = dark
    ? "rounded-2xl border border-stone-800 bg-stone-900 p-5 text-stone-50 shadow-sm"
    : emphasis
      ? "rounded-2xl border border-amber-300 bg-amber-50 p-5 shadow-sm"
      : "rounded-2xl border border-stone-200 bg-white p-5 shadow-sm";
  return (
    <section className={wrapperClass}>
      <h2 className={`font-serif ${emphasis ? "text-xl" : "text-base"} tracking-tight ${dark ? "text-stone-50" : "text-stone-900"}`}>
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
      {footerNote && <p className={`mt-3 text-xs italic ${dark ? "text-stone-400" : "text-stone-500"}`}>{footerNote}</p>}
    </section>
  );
}

// ---------- Today screen ----------

function Today({ state, currentStage, calendar, isTrackLocked, onOpenTrack, onCheckIn, onSetMode, onToggleCheck, onShipMVP, onUnshipMVP, onShiftCalendar, onResetCalendarShift, onOpenLessonModal, onStartMondayReview, onDismissMondayPrompt, onAddCapture, onDeleteCapture, onSetEnergy, onLogLeetcode }) {
  const checks = state.today.checks;
  const mode = state.today.anchorMode;
  const anchorComplete =
    (mode === "full" && checks.full.every(Boolean)) ||
    (mode === "half" && checks.half.every(Boolean)) ||
    (mode === "mvd" && checks.mvd);
  const lastCheckin = state.streak.lastCheckinISO;
  const checkedInToday = lastCheckin === todayISO();
  const daysToPeak = daysUntil(APPLICATION_PEAK_DATE);

  // Find most recently shipped MVP (within 24h) for undo banner
  const recentShip = useMemo(() => {
    const entries = Object.entries(state.stages || {})
      .filter(([, v]) => v?.mvpShipped && v?.mvpShippedAt && Date.now() - v.mvpShippedAt < 24 * 60 * 60 * 1000)
      .sort((a, b) => b[1].mvpShippedAt - a[1].mvpShippedAt);
    if (!entries.length) return null;
    const [stageId] = entries[0];
    return STAGES.find((s) => s.id === stageId);
  }, [state.stages]);

  const today = todayISO();
  const lessonsCount = state.lessons.length;
  const reviewedCount = state.lessons.filter((l) => l.reviewed).length;
  const reviewQueueCount = state.lessons.filter(isReviewQueueItem).length;
  const topWeakSpot = useMemo(() => {
    const counts = {};
    state.lessons.forEach((l) => {
      if (l.reviewed) return;
      counts[l.tag] = (counts[l.tag] || 0) + 1;
    });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : null;
  }, [state.lessons]);
  const showMondayPrompt =
    isMondayISO(today) &&
    state.lessonsMondayPromptISO !== today &&
    reviewQueueCount > 0;

  return (
    <div className="space-y-5 fade-up">
      <CountdownStrip days={daysToPeak} targetISO={APPLICATION_PEAK_DATE} />

      <TrackLockBanner state={state} isTrackLocked={isTrackLocked} onOpen={onOpenTrack} />

      {showMondayPrompt && (
        <MondayReviewBanner
          unreviewedCount={reviewQueueCount}
          onReview={onStartMondayReview}
          onSkip={onDismissMondayPrompt}
        />
      )}

      {recentShip && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border-l-4 border-sage bg-sage/10 px-4 py-2.5 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-sage" />
            <span className="text-stone-800">
              MVP shipped: <span className="font-medium">{recentShip.title}</span>. Focus moved to the next stage.
            </span>
          </div>
          <button
            onClick={() => onUnshipMVP(recentShip.id)}
            className="inline-flex items-center gap-1 rounded-full border border-rule bg-paper px-2.5 py-0.5 text-xs hover:border-stone-500"
          >
            <Undo2 size={11} /> Undo (24h)
          </button>
        </div>
      )}

      <DailyCard
        state={state}
        mode={mode}
        checks={checks}
        anchorComplete={anchorComplete}
        checkedInToday={checkedInToday}
        lastCheckin={lastCheckin}
        currentStage={currentStage}
        onSetMode={onSetMode}
        onToggleCheck={onToggleCheck}
        onCheckIn={onCheckIn}
      />

      <LogLessonRow
        onOpen={onOpenLessonModal}
        lessonsCount={lessonsCount}
        reviewedCount={reviewedCount}
        topWeakSpot={topWeakSpot}
      />

      <CurrentStagePanel state={state} stage={currentStage} calendar={calendar} onShipMVP={onShipMVP} onUnshipMVP={onUnshipMVP} onShiftCalendar={onShiftCalendar} onResetCalendarShift={onResetCalendarShift} />

      <AskClaudeCard stage={currentStage} />

      <SprintTargetsRow />

      <SectionCard title="The Rule" dark>
        <p className="text-sm leading-relaxed">
          Type every line yourself. AI answers questions. AI does not write code.{" "}
          <span className="font-semibold">Copilot OFF.</span>
        </p>
      </SectionCard>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <EnergyBudget
          todayEnergy={(state.energy || {})[todayISO()]}
          onSet={onSetEnergy}
        />
        <CaptureInbox
          items={state.capture || []}
          onAdd={onAddCapture}
          onDelete={onDeleteCapture}
        />
      </div>
      <div className="mt-4">
        <LeetCodeTracker leetcode={state.leetcode} onLog={onLogLeetcode} />
      </div>
    </div>
  );
}

function LogLessonRow({ onOpen, lessonsCount, reviewedCount, topWeakSpot }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 rounded-2xl border border-rule bg-paper-warm/50 px-5 py-3">
      <button
        onClick={onOpen}
        className="group inline-flex items-center gap-2 rounded-full border border-rule bg-paper px-3.5 py-1.5 text-xs text-ink transition hover:border-clay hover:text-clay"
      >
        <BookOpen size={12} className="text-clay transition group-hover:text-clay" />
        <span className="font-medium">Log a lesson</span>
      </button>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[11px]">
        <span className="inline-flex items-baseline gap-1.5">
          <span className="eyebrow">logged</span>
          <span className="tabular font-serif text-base text-ink">{lessonsCount}</span>
        </span>
        <span className="inline-flex items-baseline gap-1.5">
          <span className="eyebrow">reviewed</span>
          <span className="tabular font-serif text-base text-sage">{reviewedCount}</span>
        </span>
        {topWeakSpot && (
          <span className="inline-flex items-baseline gap-1.5">
            <span className="eyebrow">weak spot</span>
            <span className="font-hanji text-sm italic text-clay">{topWeakSpot}</span>
          </span>
        )}
      </div>
    </div>
  );
}

function MondayReviewBanner({ unreviewedCount, onReview, onSkip }) {
  return (
    <section className="relative flex flex-wrap items-start justify-between gap-3 overflow-hidden rounded-2xl border border-celadon/40 bg-paper-warm/60 px-5 py-4">
      <span className="absolute inset-y-0 left-0 w-1 bg-celadon" aria-hidden="true" />
      <div className="min-w-0">
        <div className="eyebrow text-celadon">Monday review</div>
        <p className="mt-1 font-hanji text-[15px] leading-relaxed text-ink">
          You have <span className="tabular font-serif text-base font-medium">{unreviewedCount}</span> unreviewed lesson{unreviewedCount === 1 ? "" : "s"}. Review 3 before today's work?
        </p>
        <p className="mt-1 text-[11px] italic text-stone-500">
          Mistakes you don't revisit become a graveyard.
        </p>
      </div>
      <div className="flex shrink-0 gap-2 self-end">
        <button
          onClick={onSkip}
          className="rounded-full border border-rule bg-paper px-3 py-1 text-xs text-stone-600 transition hover:border-stone-500"
        >
          Skip this week
        </button>
        <button
          onClick={onReview}
          className="rounded-full border border-ink bg-ink px-3 py-1 text-xs text-paper transition hover:bg-stone-700"
        >
          Review 3 now
        </button>
      </div>
    </section>
  );
}

function CountdownStrip({ days, targetISO }) {
  return (
    <div className="flex items-baseline justify-between rounded-lg border border-rule bg-paper-dark/70 px-4 py-2.5">
      <div className="flex items-baseline gap-2">
        <span className="eyebrow">Application peak</span>
        <span className="text-xs text-stone-500">{formatLong(targetISO)}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="tabular font-serif text-3xl font-medium leading-none text-ink">{days}</span>
        <span className="text-xs text-stone-500">days</span>
      </div>
    </div>
  );
}

function SprintTargetsRow() {
  return (
    <section className="rounded-2xl border border-rule bg-paper p-5">
      <h2 className="eyebrow">Sprint targets</h2>
      <ul className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 md:grid-cols-4">
        {SPRINT_TARGETS.map((s) => (
          <li key={s.date} className="border-l-2 border-rule pl-3">
            <div className="tabular font-mono text-xs text-stone-500">{s.date}</div>
            <div className="mt-0.5 text-stone-800">{s.target}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DailyCard({ state, mode, checks, anchorComplete, checkedInToday, lastCheckin, currentStage, onSetMode, onToggleCheck, onCheckIn }) {
  const fullItems = ["1 InterviewQuery problem", "1 DataCamp lesson", `1 ${currentStage.title} build task`];
  const halfItems = ["1 InterviewQuery problem", `1 ${currentStage.title} build task`];
  const graceLeft = 2 - state.streak.graceUsedThisMonth;

  return (
    <section className="overflow-hidden rounded-2xl border border-rule bg-paper shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr]">
        <div className="relative overflow-hidden border-b border-rule bg-paper-warm/60 px-5 py-5 md:border-b-0 md:border-r md:px-7">
          {/* decorative bamboo sprig */}
          <BambooSprig className="pointer-events-none absolute -bottom-1 -right-2 h-24 w-16 opacity-25 drift-slow" />

          <div className="eyebrow">Today · streak</div>
          <div className="ink-wash mt-2 flex items-baseline gap-1.5">
            <span className="tabular font-serif text-6xl font-medium leading-none text-ink">{state.streak.count}</span>
            <span className="text-sm text-stone-500">day{state.streak.count === 1 ? "" : "s"}</span>
          </div>
          <div className="mt-2 flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1.5">
              <Flame size={11} className="text-clay" />
              <span className="tabular text-stone-600">{graceLeft}/2 grace this month</span>
            </div>
            {(state.streak.longest || 0) > 0 && (
              <div className="text-[10px] text-stone-500">
                Best ever: <span className="tabular">{state.streak.longest}</span>{" "}
                {state.streak.count < state.streak.longest && <span className="italic">— you've done this before.</span>}
              </div>
            )}
          </div>
          {state.streak.count === 0 && (
            <p className="mt-3 font-hanji text-xs leading-relaxed text-stone-600">
              {state.streak.longest > 0
                ? "You broke a streak. Doesn't erase the work. Today's small thing still counts."
                : "First day is the heaviest. Ship a 5-min MVD if today is hard."}
            </p>
          )}
          <div className="mt-4">
            <button
              onClick={onCheckIn}
              disabled={!anchorComplete || checkedInToday}
              className={`w-full rounded-full border px-3 py-1.5 text-xs transition ${
                checkedInToday
                  ? "border-sage bg-sage/15 text-sage ping-soft"
                  : anchorComplete
                    ? "border-ink bg-ink text-paper hover:bg-stone-800"
                    : "cursor-not-allowed border-rule bg-paper-dark/40 text-stone-400"
              }`}
            >
              {checkedInToday ? "Checked in today ✓" : anchorComplete ? "Check in" : "Finish today's anchor →"}
            </button>
          </div>
          {lastCheckin && lastCheckin !== todayISO() && (
            <div className="mt-2 text-[10px] text-stone-500">Last: {formatShort(lastCheckin)}</div>
          )}
        </div>

        <div className="px-5 py-5 md:px-7">
          <div className="flex items-center justify-between">
            <div>
              <div className="eyebrow">Anchor mode</div>
              <h3 className="mt-1 font-serif text-xl tracking-tight">Today's contact, not productivity</h3>
            </div>
            <div className="hidden text-right text-xs text-stone-500 md:block">
              {mode === "mvd" ? "5 minutes counts" : mode === "half" ? "Bad-focus day fallback" : "Real day"}
            </div>
          </div>

          <div className="mt-3 inline-flex rounded-full border border-rule p-0.5 text-xs">
            {[
              { id: "full", label: "Full", icon: Zap },
              { id: "half", label: "Half", icon: Sparkles },
              { id: "mvd", label: "MVD · 5min", icon: Coffee },
            ].map((m) => {
              const Icon = m.icon;
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onSetMode(m.id)}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition ${
                    isActive ? "bg-ink text-paper" : "text-stone-500 hover:text-ink"
                  }`}
                >
                  <Icon size={11} />
                  {m.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 space-y-2">
            {mode === "full" &&
              fullItems.map((item, i) => (
                <CheckRow key={i} checked={checks.full[i]} onChange={() => onToggleCheck("full", i)} label={item} />
              ))}
            {mode === "half" &&
              halfItems.map((item, i) => (
                <CheckRow key={i} checked={checks.half[i]} onChange={() => onToggleCheck("half", i)} label={item} />
              ))}
            {mode === "mvd" && (
              <CheckRow
                checked={checks.mvd}
                onChange={() => onToggleCheck("mvd")}
                label="1 IQ problem read · or · 1 Anthropic doc paragraph · or · 1 Loom watched"
                hint="Streak tracks contact, not productivity."
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function TrackLockBanner({ state, isTrackLocked, onOpen }) {
  const trackInfo = TRACKS[state.track];
  if (isTrackLocked) {
    return (
      <section className="flex items-start justify-between gap-3 rounded-lg border-l-4 border-amber-700 bg-amber-50/60 px-4 py-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <Lock size={13} className="text-amber-700" />
            Locked on {trackInfo.short} until {formatLong(state.trackLockedUntil)}
          </div>
          <p className="mt-0.5 text-xs text-stone-600">
            To re-evaluate, write 200+ characters on what changed.
          </p>
        </div>
        <button
          onClick={onOpen}
          className="shrink-0 rounded-full border border-amber-700 bg-paper px-3 py-1 text-xs text-amber-900 hover:bg-amber-100"
        >
          Re-evaluate
        </button>
      </section>
    );
  }
  return (
    <section className="flex items-start justify-between gap-3 rounded-lg border border-rule bg-paper px-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm font-medium text-ink">
          <Unlock size={13} className="text-sage" />
          Track unlocked: {trackInfo.short}
        </div>
        <p className="mt-0.5 text-xs text-stone-600">{trackInfo.summary}</p>
      </div>
      <button onClick={onOpen} className="shrink-0 rounded-full border border-rule bg-paper px-3 py-1 text-xs hover:border-stone-500">
        Change track
      </button>
    </section>
  );
}

function CheckRow({ checked, onChange, label, hint }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2.5 transition hover:border-stone-400">
      <input type="checkbox" checked={checked} onChange={onChange} className="mt-0.5 h-4 w-4 accent-stone-800" />
      <div className="min-w-0 flex-1">
        <div className={`text-sm ${checked ? "text-stone-400 line-through" : "text-stone-800"}`}>{label}</div>
        {hint && <div className="mt-0.5 text-xs text-stone-500">{hint}</div>}
      </div>
    </label>
  );
}

function CurrentStagePanel({ state, stage, calendar, onShipMVP, onUnshipMVP, onShiftCalendar, onResetCalendarShift }) {
  const stageState = state.stages[stage.id] || {};
  const row = calendar.layout.find((r) => r.stageId === stage.id);
  const shippedRecently = stageState.mvpShipped && stageState.mvpShippedAt && Date.now() - stageState.mvpShippedAt < 24 * 60 * 60 * 1000;
  const shift = state.calendarShiftDays || 0;
  return (
    <SectionCard
      title={
        <span className="flex items-center gap-2">
          <MapIcon size={18} /> Stage {stage.order}: {stage.title}
        </span>
      }
      footerNote={row ? `Floating window: ${formatLong(row.startISO)} → ${formatLong(row.endISO)}` : null}
    >
      <p className="text-sm text-stone-700">{stage.weeks}</p>
      <div className="mt-1 flex flex-wrap gap-1">
        {stage.tags.map((t) => (
          <span key={t} className="rounded-full border border-rule bg-paper-warm px-2 py-0.5 text-[10px] uppercase tracking-widest text-stone-500">
            {t}
          </span>
        ))}
      </div>

      {stage.whyThisMatters && (
        <div className="mt-3 rounded-lg border-l-2 border-celadon bg-paper-warm/60 px-3 py-2.5">
          <div className="eyebrow">Why this matters for FDE/SE</div>
          <p className="mt-1 font-hanji text-[15px] leading-relaxed text-ink">{stage.whyThisMatters}</p>
        </div>
      )}

      <div className="mt-3 rounded-lg border border-rule bg-paper-warm/60 p-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-clay">
          <AlertTriangle size={12} /> MVP — what to ship if you run out of time
        </div>
        <p className="mt-1 text-sm text-stone-800">{stage.mvp}</p>
        {stageState.mvpShipped ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-full border border-sage bg-sage/15 px-2.5 py-0.5 text-xs text-sage">
              <CheckCircle2 size={12} /> MVP shipped
            </div>
            {shippedRecently && (
              <button
                onClick={() => onUnshipMVP(stage.id)}
                className="inline-flex items-center gap-1 rounded-full border border-rule bg-paper px-2.5 py-0.5 text-xs text-stone-600 hover:border-stone-500"
                title="Undo within 24 hours of shipping"
              >
                <Undo2 size={11} /> Undo MVP
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => onShipMVP(stage.id)}
            className="mt-2 rounded-full border border-ink bg-ink px-3 py-1 text-xs text-paper hover:bg-stone-700"
          >
            Ship MVP — skip the remaining 70%
          </button>
        )}
      </div>

      {onShiftCalendar && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span>Missed days?</span>
          <button onClick={() => onShiftCalendar(1)} className="rounded border border-rule bg-paper px-2 py-0.5 hover:border-stone-400">+1</button>
          <button onClick={() => onShiftCalendar(3)} className="rounded border border-rule bg-paper px-2 py-0.5 hover:border-stone-400">+3 days</button>
          <button onClick={() => onShiftCalendar(-1)} disabled={shift === 0} className="rounded border border-rule bg-paper px-2 py-0.5 hover:border-stone-400 disabled:opacity-40">−1</button>
          {shift > 0 && (
            <button onClick={onResetCalendarShift} className="rounded border border-rule bg-paper px-2 py-0.5 hover:border-stone-400">Reset</button>
          )}
          <span className="ml-auto tabular text-stone-400">Total shift: {shift} day{shift === 1 ? "" : "s"}</span>
        </div>
      )}
    </SectionCard>
  );
}

function AskClaudeCard({ stage }) {
  const [open, setOpen] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState(null);
  if (!stage.aiPrompts?.length) return null;

  function copy(text, idx) {
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1400);
  }

  return (
    <SectionCard
      title={
        <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-2 text-left">
          <span className="flex items-center gap-2">
            <Sparkles size={16} className="text-clay" />
            <span>Stuck? Ask Claude</span>
          </span>
          <span className="text-xs text-stone-500">{open ? "hide" : "show"} {stage.aiPrompts.length} prompts</span>
        </button>
      }
      footerNote="Type these into Claude — don't ask Claude to write code for you. The point is to be quizzed, not coddled."
    >
      {open &&
        stage.aiPrompts.map((p, i) => (
          <div key={i} className="rounded-lg border border-rule bg-paper-warm/40 p-3">
            <p className="font-hanji text-sm leading-relaxed text-ink">{p}</p>
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => copy(p, i)}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] transition ${
                  copiedIdx === i
                    ? "border-sage bg-sage/15 text-sage"
                    : "border-rule bg-paper text-stone-600 hover:border-stone-500"
                }`}
              >
                {copiedIdx === i ? "Copied ✓" : "Copy prompt"}
              </button>
            </div>
          </div>
        ))}
      {!open && <p className="text-xs italic text-stone-500">Three pre-written prompts that quiz you instead of doing the work for you.</p>}
    </SectionCard>
  );
}

// ---------- Quest Map ----------

function phaseLabel(stageOrder) {
  if (stageOrder <= 3) return "Foundation";
  if (stageOrder === 4) return "Portfolio";
  if (stageOrder === 5) return "Branches";
  if (stageOrder === 6) return "Apply";
  return "Sprint";
}
const PHASE_COLORS = {
  Foundation: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Portfolio: "bg-blue-50 text-blue-700 border-blue-200",
  Branches: "bg-purple-50 text-purple-700 border-purple-200",
  Apply: "bg-amber-50 text-amber-700 border-amber-200",
  Sprint: "bg-rose-50 text-rose-700 border-rose-200",
};

function QuestMap({ state, calendar, currentStageId, selectedStageId, onPick, onShipMVP, onUnshipMVP }) {
  const selected = STAGES.find((s) => s.id === selectedStageId);
  const trackInfo = TRACKS[state.track];
  const trackTagFilter = state.track === "fde-se" ? ["FDE", "SE"] : ["BIE"];

  return (
    <div className="space-y-6">
      <SectionCard title={<span className="flex items-center gap-2"><MapIcon size={18} /> 7-stage Quest Map · {trackInfo.short}</span>}>
        <p className="text-sm text-stone-600">{trackInfo.summary}</p>

        <FloatingCalendar calendar={calendar} state={state} currentStageId={currentStageId} />

        <ol className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {STAGES.map((s) => {
            const isCurrent = s.id === currentStageId;
            const isSelected = s.id === selected.id;
            const stageState = state.stages[s.id] || {};
            const onTrack = s.tags.some((t) => trackTagFilter.includes(t));
            return (
              <li key={s.id}>
                <button
                  onClick={() => onPick(s.id)}
                  className={`relative w-full rounded-xl border p-3 text-left transition ${
                    isSelected
                      ? "border-stone-800 bg-stone-900 text-stone-50"
                      : isCurrent
                        ? "border-amber-400 bg-amber-50"
                        : onTrack
                          ? "border-stone-200 bg-white hover:border-stone-400"
                          : "border-stone-200 bg-stone-50 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className={`text-xs uppercase tracking-widest ${isSelected ? "text-stone-300" : "text-stone-400"}`}>
                    Stage {s.order} · {s.weeks}
                  </div>
                  <div className={`mt-1 font-serif text-base leading-tight ${isSelected ? "text-stone-50" : "text-stone-900"}`}>
                    {s.title}
                  </div>
                  <div className="mt-1">
                    <span className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border ${isSelected ? "bg-stone-800 text-stone-300 border-stone-600" : PHASE_COLORS[phaseLabel(s.order)]}`}>
                      {phaseLabel(s.order)}
                    </span>
                  </div>
                  <div className={`mt-2 flex flex-wrap gap-1`}>
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className={`rounded-full border px-1.5 py-0.5 text-[9px] uppercase tracking-widest ${
                          isSelected ? "border-stone-600 bg-stone-800 text-stone-300" : "border-stone-200 bg-stone-50 text-stone-500"
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {stageState.mvpShipped && (
                    <span className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-full border border-emerald-400 bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-800">
                      <CheckCircle2 size={10} /> MVP
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </SectionCard>

      <StageDetail stage={selected} state={state} onShipMVP={onShipMVP} onUnshipMVP={onUnshipMVP} />
      <AskClaudeCard stage={selected} />
    </div>
  );
}

function FloatingCalendar({ calendar, state, currentStageId }) {
  const today = todayISO();
  const totalDays = diffDays(calendar.start, calendar.bufferEnd);
  const todayOffset = Math.max(0, Math.min(totalDays, diffDays(calendar.start, today)));
  const todayPct = (todayOffset / totalDays) * 100;
  const STAGE_LABELS = ["SQL", "Python", "AI Eng", "Vertical", "Customer", "Cloud", "Sprint"];
  return (
    <div className="mt-4 rounded-lg border border-rule bg-paper-dark/50 p-4">
      <div className="flex items-baseline justify-between text-xs text-stone-500">
        <span className="eyebrow">Floating calendar — shifts on missed days</span>
        <span className="tabular font-mono text-[10px]">
          {formatShort(calendar.start)} → {formatShort(calendar.bufferEnd)} <span className="text-stone-400">· peak</span> {formatShort(calendar.peak)}
        </span>
      </div>

      {/* date scale */}
      <div className="relative mt-3 h-3 text-[9px] text-stone-400">
        {calendar.layout.map((row) => {
          const left = (diffDays(calendar.start, row.startISO) / totalDays) * 100;
          return (
            <span key={row.stageId} className="absolute top-0 -translate-x-1/2 tabular font-mono" style={{ left: `${left}%` }}>
              {formatShort(row.startISO)}
            </span>
          );
        })}
      </div>

      {/* main bar */}
      <div className="relative mt-1 h-9 w-full overflow-hidden rounded-md border border-rule bg-paper">
        {calendar.layout.map((row, idx) => {
          const left = (diffDays(calendar.start, row.startISO) / totalDays) * 100;
          const width = (row.days / totalDays) * 100;
          const isCurrent = row.stageId === currentStageId;
          return (
            <div
              key={row.stageId}
              className={`absolute top-0 h-full overflow-hidden border-r border-paper text-[10px] ${
                isCurrent ? "bg-amber-200" : idx % 2 === 0 ? "bg-stone-200" : "bg-stone-100"
              }`}
              style={{ left: `${left}%`, width: `${width}%` }}
              title={`${STAGES[idx].title}: ${formatLong(row.startISO)} → ${formatLong(row.endISO)}`}
            >
              <span className="absolute inset-0 flex items-center justify-start gap-1 truncate px-1.5 text-[10px] font-medium text-stone-700">
                <span className="tabular text-[9px] text-stone-500">S{idx + 1}</span>
                <span className="truncate">{STAGE_LABELS[idx]}</span>
              </span>
            </div>
          );
        })}
        {/* buffer */}
        {(() => {
          const left = (diffDays(calendar.start, calendar.bufferStart) / totalDays) * 100;
          const width = ((BUFFER_WEEKS * 7) / totalDays) * 100;
          return (
            <div
              className="absolute top-0 h-full border-r border-paper bg-sage/25 text-[10px]"
              style={{ left: `${left}%`, width: `${width}%` }}
              title="Buffer (2 weeks)"
            >
              <span className="absolute inset-0 flex items-center justify-center font-mono text-sage">BUF</span>
            </div>
          );
        })()}
        {/* today line */}
        <div
          className="pointer-events-none absolute top-0 h-full w-[2px] bg-ink"
          style={{ left: `${todayPct}%` }}
        >
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-1.5 py-0.5 text-[8px] uppercase tracking-widest text-paper">
            today
          </span>
        </div>
      </div>

      <div className="mt-2 flex items-center gap-4 text-[10px] text-stone-500">
        <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-2 bg-amber-200" /> current stage</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block h-2 w-2 bg-sage/25" /> buffer</span>
        {(state.calendarShiftDays || 0) > 0 && <span className="ml-auto tabular">Shifted +{state.calendarShiftDays} days</span>}
      </div>
    </div>
  );
}

function StageDetail({ stage, state, onShipMVP, onUnshipMVP }) {
  const stageState = state.stages[stage.id] || {};
  const shippedRecently = stageState.mvpShipped && stageState.mvpShippedAt && Date.now() - stageState.mvpShippedAt < 24 * 60 * 60 * 1000;
  return (
    <SectionCard
      title={
        <span className="flex items-center gap-2">
          Stage {stage.order}: {stage.title}
        </span>
      }
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
        <span className="font-mono">{stage.weeks}</span>
        {stage.tags.map((t) => (
          <span key={t} className="rounded-full border border-stone-200 bg-stone-50 px-2 py-0.5 uppercase tracking-widest">
            {t}
          </span>
        ))}
      </div>

      {stage.whyThisMatters && (
        <div className="rounded-lg border-l-2 border-celadon bg-paper-warm/50 px-3 py-2.5">
          <div className="eyebrow">Why this matters for FDE/SE</div>
          <p className="mt-1 font-hanji text-[15px] leading-relaxed text-ink">{stage.whyThisMatters}</p>
        </div>
      )}

      <div className="rounded-lg border border-rule bg-paper-warm/50 p-3">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-clay">
          <AlertTriangle size={12} /> MVP — ship if August arrives mid-stage
        </div>
        <p className="mt-1 text-sm text-stone-800">{stage.mvp}</p>
        {stageState.mvpShipped ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-full border border-sage bg-sage/15 px-2.5 py-0.5 text-xs text-sage">
              <CheckCircle2 size={12} /> MVP shipped
            </div>
            {shippedRecently && onUnshipMVP && (
              <button
                onClick={() => onUnshipMVP(stage.id)}
                className="inline-flex items-center gap-1 rounded-full border border-rule bg-paper px-2.5 py-0.5 text-xs text-stone-600 hover:border-stone-500"
              >
                <Undo2 size={11} /> Undo (24h grace)
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => onShipMVP(stage.id)}
            className="mt-2 rounded-full border border-ink bg-ink px-3 py-1 text-xs text-paper hover:bg-stone-700"
          >
            Ship MVP
          </button>
        )}
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-widest text-stone-500">Concepts</h4>
        <ul className="mt-2 grid grid-cols-1 gap-1 text-sm text-stone-800 md:grid-cols-2">
          {stage.concepts.map((c) => (
            <li key={c} className="flex items-start gap-2">
              <Circle size={8} className="mt-1.5 shrink-0 text-stone-400" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {stage.primary.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-widest text-stone-500">Primary resources</h4>
          <ul className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            {stage.primary.map((rid) => {
              const r = RESOURCES[rid];
              if (!r) return null;
              return (
                <li key={rid} className="rounded-lg border border-stone-200 bg-white p-2.5 text-sm">
                  <a href={r.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-medium text-stone-900 hover:underline">
                    {r.name} <ExternalLink size={10} className="text-stone-400" />
                  </a>
                  <div className="mt-0.5 text-[10px] uppercase tracking-widest text-stone-400">{r.tag}</div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {stage.gapFill.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-widest text-stone-500">Gap-fill (free)</h4>
          <ul className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
            {stage.gapFill.map((rid) => {
              const r = RESOURCES[rid];
              if (!r) return null;
              return (
                <li key={rid} className="rounded-lg border border-stone-200 bg-stone-50 p-2.5 text-sm">
                  <a href={r.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-medium text-stone-800 hover:underline">
                    {r.name} <ExternalLink size={10} className="text-stone-400" />
                  </a>
                  <div className="mt-0.5 text-[10px] uppercase tracking-widest text-stone-400">{r.tag}</div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div>
        <h4 className="text-xs uppercase tracking-widest text-stone-500">Done criteria</h4>
        <p className="mt-1 text-sm text-stone-800">{stage.done}</p>
      </div>
      <div>
        <h4 className="text-xs uppercase tracking-widest text-stone-500">Deliverable</h4>
        <p className="mt-1 text-sm text-stone-800">{stage.deliverable}</p>
      </div>
    </SectionCard>
  );
}

// ---------- Career HQ ----------

function CareerHQ({
  state,
  onSetApplicationStatus, onAddArtifact, onRemoveArtifact, onSetGate,
  onOpenLessonModal, onEditLesson, onDeleteLesson, onStartReview,
  onAddDiscovery, onUpdateDiscovery, onDeleteDiscovery,
  onAddStar, onUpdateStar, onDeleteStar,
  onAddPipelineStage, onSetPipelineOffer,
}) {
  return (
    <div className="space-y-6">
      <ApplicationTimeline state={state} onSetStatus={onSetApplicationStatus} />
      <PipelineTracker
        pipeline={state.pipeline}
        applications={state.applications}
        onAddStage={onAddPipelineStage}
        onSetOffer={onSetPipelineOffer}
      />
      <DiscoveryCRM
        discovery={state.discovery}
        onAdd={onAddDiscovery}
        onUpdate={onUpdateDiscovery}
        onDelete={onDeleteDiscovery}
      />
      <StarStoriesTracker
        stories={state.starStories}
        onAdd={onAddStar}
        onUpdate={onUpdateStar}
        onDelete={onDeleteStar}
      />
      <GapRadar state={state} onSetGate={onSetGate} />
      <LessonsPanel
        state={state}
        onOpenLessonModal={onOpenLessonModal}
        onEditLesson={onEditLesson}
        onDeleteLesson={onDeleteLesson}
        onStartReview={onStartReview}
      />
      <ArtifactWall state={state} onAdd={onAddArtifact} onRemove={onRemoveArtifact} />
    </div>
  );
}

function LessonsPanel({ state, onOpenLessonModal, onEditLesson, onDeleteLesson, onStartReview }) {
  const [subTab, setSubTab] = useState("all");
  const lessons = state.lessons;
  const reviewQueue = lessons.filter(isReviewQueueItem);

  return (
    <SectionCard
      title={
        <span className="flex items-center gap-2">
          <BookOpen size={18} /> Lessons
          <span className="ml-1 rounded-full border border-rule bg-paper px-2 py-0.5 text-[10px] tabular text-stone-500">
            {lessons.length}
          </span>
        </span>
      }
      footerNote="Mistake logs that nobody reviews become graveyards. Review weekly — or this is decoration."
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex flex-wrap rounded-full border border-rule bg-paper-warm/40 p-0.5 text-xs">
          {[
            { id: "all", label: "All lessons" },
            { id: "patterns", label: "Patterns" },
            { id: "review", label: `Review queue${reviewQueue.length ? ` · ${reviewQueue.length}` : ""}` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSubTab(t.id)}
              className={`rounded-full px-3 py-1 transition ${
                subTab === t.id ? "bg-ink text-paper" : "text-stone-500 hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button
          onClick={onOpenLessonModal}
          className="inline-flex items-center gap-1.5 rounded-full border border-rule bg-paper px-3 py-1 text-xs text-ink transition hover:border-clay hover:text-clay"
        >
          <Plus size={12} className="text-clay" /> <span className="font-medium">Log a lesson</span>
        </button>
      </div>

      {lessons.length === 0 ? (
        <div className="rounded-xl border border-dashed border-rule bg-paper-warm/30 px-5 py-8 text-center">
          <p className="font-hanji text-[15px] italic leading-relaxed text-stone-500">
            No lessons yet.
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Log mistakes from practice problems as they happen — under 60 seconds, before they fade.
          </p>
        </div>
      ) : (
        <div className="mt-1">
          {subTab === "all" && (
            <LessonsAllTab lessons={lessons} onEdit={onEditLesson} onDelete={onDeleteLesson} />
          )}
          {subTab === "patterns" && <LessonsPatternsTab lessons={lessons} />}
          {subTab === "review" && (
            <LessonsReviewTab
              lessons={reviewQueue}
              allLessons={lessons}
              onStartReview={onStartReview}
            />
          )}
        </div>
      )}
    </SectionCard>
  );
}

function LessonsAllTab({ lessons, onEdit, onDelete }) {
  const [query, setQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [filterReviewed, setFilterReviewed] = useState(""); // "", "yes", "no"
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const allTags = useMemo(
    () => [...new Set(lessons.map((l) => l.tag).filter(Boolean))].sort(),
    [lessons],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return lessons.filter((l) => {
      if (filterCategory && l.category !== filterCategory) return false;
      if (filterTag && l.tag !== filterTag) return false;
      if (filterReviewed === "yes" && !l.reviewed) return false;
      if (filterReviewed === "no" && l.reviewed) return false;
      const dateOnly = l.date.slice(0, 10);
      if (fromDate && dateOnly < fromDate) return false;
      if (toDate && dateOnly > toDate) return false;
      if (q) {
        const hay = [l.source, l.tag, l.what_i_tried, l.what_was_correct, l.why_i_missed]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [lessons, query, filterCategory, filterTag, filterReviewed, fromDate, toDate]);

  const fieldCls =
    "rounded-md border border-rule bg-paper px-2.5 py-1.5 text-xs text-ink placeholder:text-stone-400 focus:border-rule-strong focus:outline-none";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 rounded-lg border border-rule bg-paper-warm/30 p-2 sm:grid-cols-2 lg:grid-cols-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lessons…"
          className={`${fieldCls} lg:col-span-2`}
        />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className={fieldCls}>
          <option value="">All categories</option>
          {LESSON_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)} className={fieldCls}>
          <option value="">All tags</option>
          {allTags.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={filterReviewed} onChange={(e) => setFilterReviewed(e.target.value)} className={fieldCls}>
          <option value="">All statuses</option>
          <option value="yes">Reviewed</option>
          <option value="no">Unreviewed</option>
        </select>
        <div className="flex gap-1">
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={`${fieldCls} w-full`} aria-label="From date" />
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={`${fieldCls} w-full`} aria-label="To date" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="px-1 py-2 font-hanji text-sm italic text-stone-500">No lessons match these filters.</p>
      ) : (
        <ul className="divide-y divide-rule overflow-hidden rounded-xl border border-rule bg-paper">
          {filtered.map((l) => {
            const expanded = expandedId === l.id;
            return (
              <li key={l.id} className={expanded ? "bg-paper-warm/40" : "bg-paper"}>
                <button
                  onClick={() => setExpandedId(expanded ? null : l.id)}
                  className="grid w-full grid-cols-12 items-center gap-2 px-3.5 py-2.5 text-left text-xs transition hover:bg-paper-warm/30"
                >
                  <span className="col-span-2 tabular text-stone-500">{formatShort(l.date.slice(0, 10))}</span>
                  <span className="col-span-3 truncate font-medium text-ink">{l.source}</span>
                  <span className="col-span-2 truncate text-[10px] uppercase tracking-widest text-stone-500">
                    {LESSON_CATEGORIES.find((c) => c.id === l.category)?.short || l.category}
                  </span>
                  <span className="col-span-2 truncate">
                    <span className="inline-block rounded-full border border-clay/30 bg-clay/5 px-1.5 py-0.5 text-[10px] font-medium text-clay">
                      {l.tag}
                    </span>
                  </span>
                  <span className="col-span-2 truncate font-hanji italic text-stone-600">{l.why_i_missed}</span>
                  <span className="col-span-1 text-right">
                    {l.reviewed ? (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-sage">
                        <CheckCircle2 size={10} /> <span className="tabular">{l.review_count}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-300">·</span>
                    )}
                  </span>
                </button>
                {expanded && (
                  <div className="space-y-3 border-t border-rule px-4 py-3.5">
                    <div>
                      <div className="eyebrow text-clay">What I tried</div>
                      <p className="mt-1 whitespace-pre-wrap font-hanji text-[14px] leading-relaxed text-ink">{l.what_i_tried}</p>
                    </div>
                    <div>
                      <div className="eyebrow text-sage">What was correct</div>
                      <p className="mt-1 whitespace-pre-wrap font-hanji text-[14px] leading-relaxed text-ink">{l.what_was_correct}</p>
                    </div>
                    <div>
                      <div className="eyebrow text-celadon">Why I missed</div>
                      <p className="mt-1 font-hanji text-[14px] leading-relaxed text-ink">{l.why_i_missed}</p>
                    </div>
                    {l.last_reviewed && (
                      <p className="text-[10px] italic text-stone-500">
                        Last reviewed {formatShort(l.last_reviewed.slice(0, 10))} · {l.review_count} review{l.review_count === 1 ? "" : "s"}
                      </p>
                    )}
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => onEdit(l)}
                        className="rounded-full border border-rule bg-paper px-3 py-1 text-xs text-stone-700 transition hover:border-stone-500 hover:text-ink"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Delete this lesson? This cannot be undone.")) onDelete(l.id);
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-rule bg-paper px-3 py-1 text-xs text-stone-600 transition hover:border-clay hover:text-clay"
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function LessonsPatternsTab({ lessons }) {
  const groups = useMemo(() => {
    const map = new Map();
    lessons.forEach((l) => {
      const arr = map.get(l.tag) || [];
      arr.push(l);
      map.set(l.tag, arr);
    });
    return [...map.entries()]
      .map(([tag, items]) => ({
        tag,
        total: items.length,
        reviewed: items.filter((i) => i.reviewed).length,
        items,
      }))
      .sort((a, b) => b.total - a.total);
  }, [lessons]);

  const topWeakSpots = useMemo(() => {
    const weak = groups
      .map((g) => ({ tag: g.tag, unreviewed: g.total - g.reviewed }))
      .filter((g) => g.unreviewed > 0)
      .sort((a, b) => b.unreviewed - a.unreviewed)
      .slice(0, 3);
    return weak;
  }, [groups]);

  const [openTag, setOpenTag] = useState(null);

  return (
    <div className="space-y-4">
      {topWeakSpots.length > 0 && (
        <div className="rounded-xl border border-clay/30 bg-clay/5 px-4 py-3.5">
          <div className="eyebrow text-clay">Your top 3 weak spots</div>
          <ol className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {topWeakSpots.map((w, i) => (
              <li key={w.tag} className="rounded-lg border border-clay/30 bg-paper px-3 py-2">
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl tabular text-clay">{i + 1}</span>
                  <div className="min-w-0">
                    <div className="truncate font-hanji text-[14px] font-medium text-ink">{w.tag}</div>
                    <div className="text-[10px] uppercase tracking-widest text-stone-500">
                      <span className="tabular">{w.unreviewed}</span> unreviewed
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-2.5 font-hanji text-[12px] italic leading-relaxed text-stone-600">
            This is your actual study target this week.
          </p>
        </div>
      )}

      <ul className="space-y-2">
        {groups.map((g) => {
          const pct = g.total === 0 ? 0 : Math.round((g.reviewed / g.total) * 100);
          const expanded = openTag === g.tag;
          return (
            <li key={g.tag} className="overflow-hidden rounded-xl border border-rule bg-paper">
              <button
                onClick={() => setOpenTag(expanded ? null : g.tag)}
                className="w-full px-4 py-3 text-left transition hover:bg-paper-warm/30"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-hanji text-[15px] font-medium text-ink">{g.tag}</div>
                    <div className="mt-0.5 text-[11px] tabular text-stone-500">
                      {g.total} mistake{g.total === 1 ? "" : "s"} · {g.reviewed} reviewed
                    </div>
                  </div>
                  <span className="tabular font-serif text-base text-stone-700">{pct}%</span>
                </div>
                <div className="mt-2 h-1 w-full rounded-full bg-rule/50">
                  <div className="h-1 rounded-full bg-sage transition-all" style={{ width: `${pct}%` }} />
                </div>
              </button>
              {expanded && (
                <ul className="divide-y divide-rule border-t border-rule bg-paper-warm/30">
                  {g.items.map((l) => (
                    <li key={l.id} className="px-4 py-2.5 text-xs">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="tabular text-stone-500">{formatShort(l.date.slice(0, 10))}</span>
                        <span className="text-[10px] uppercase tracking-widest text-stone-400">
                          {LESSON_CATEGORIES.find((c) => c.id === l.category)?.short}
                        </span>
                      </div>
                      <p className="mt-0.5 font-medium text-ink">{l.source}</p>
                      <p className="mt-0.5 font-hanji italic text-stone-600">Why missed: {l.why_i_missed}</p>
                      {l.reviewed && (
                        <span className="mt-1 inline-flex items-center gap-0.5 text-[10px] text-sage">
                          <CheckCircle2 size={10} /> reviewed <span className="tabular">{l.review_count}×</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LessonsReviewTab({ lessons, allLessons, onStartReview }) {
  if (lessons.length === 0) {
    return (
      <p className="text-sm italic text-stone-500">
        Nothing to review. {allLessons.length === 0 ? "Log a lesson first." : "Everything's been reviewed in the last 7 days."}
      </p>
    );
  }
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-rule bg-paper-warm/40 px-4 py-2.5">
        <p className="font-hanji text-[13px] italic leading-relaxed text-stone-600">
          <span className="tabular not-italic font-serif text-base text-ink">{lessons.length}</span> entr{lessons.length === 1 ? "y" : "ies"} unreviewed or stale ({">"}{REVIEW_STALE_DAYS} days).
        </p>
        <button
          onClick={() => onStartReview(lessons.slice(0, Math.min(3, lessons.length)).map((l) => l.id))}
          className="rounded-full border border-ink bg-ink px-3.5 py-1 text-xs text-paper transition hover:bg-stone-700"
        >
          Review {Math.min(3, lessons.length)} now
        </button>
      </div>
      <ul className="divide-y divide-rule overflow-hidden rounded-xl border border-rule bg-paper">
        {lessons.map((l) => (
          <li key={l.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-2.5 text-xs transition hover:bg-paper-warm/30">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="tabular text-stone-500">{formatShort(l.date.slice(0, 10))}</span>
                <span className="inline-block rounded-full border border-clay/30 bg-clay/5 px-1.5 py-0.5 text-[10px] font-medium text-clay">
                  {l.tag}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400">
                  {LESSON_CATEGORIES.find((c) => c.id === l.category)?.short}
                </span>
                {l.last_reviewed && isStaleReview(l) && (
                  <span className="rounded-full border border-celadon/40 bg-celadon/10 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-celadon">
                    stale
                  </span>
                )}
              </div>
              <p className="mt-1 font-medium text-ink">{l.source}</p>
              <p className="mt-0.5 font-hanji italic text-stone-600">Why missed: {l.why_i_missed}</p>
            </div>
            <button
              onClick={() => onStartReview([l.id])}
              className="shrink-0 self-center rounded-full border border-rule bg-paper px-3 py-1 text-[11px] text-stone-700 transition hover:border-clay hover:text-clay"
            >
              Review now
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ApplicationTimeline({ state, onSetStatus }) {
  const summary = useMemo(() => {
    const counts = { applied: 0, screen: 0, interview: 0, offer: 0, rejected: 0 };
    Object.values(state.applications).forEach((a) => {
      if (a.status === "applied") counts.applied++;
      if (a.status === "phone_screen") counts.screen++;
      if (a.status === "interview") counts.interview++;
      if (a.status === "offer") counts.offer++;
      if (a.status === "rejected") counts.rejected++;
    });
    return counts;
  }, [state.applications]);

  return (
    <SectionCard title={<span className="flex items-center gap-2"><Briefcase size={18} /> Application Timeline</span>}>
      <div className="flex flex-wrap gap-2 text-xs">
        <StatusPill label="Applied" count={summary.applied} variant="applied" />
        <StatusPill label="Phone screens" count={summary.screen} variant="phone_screen" />
        <StatusPill label="Interviews" count={summary.interview} variant="interview" />
        <StatusPill label="Offers" count={summary.offer} variant="offer" />
        <StatusPill label="Rejected" count={summary.rejected} variant="rejected" />
      </div>

      <div className="mt-4">
        <h4 className="text-xs uppercase tracking-widest text-stone-500">Sprint targets</h4>
        <div className="mt-1 grid grid-cols-2 gap-1 text-xs text-stone-600 md:grid-cols-4">
          {SPRINT_TARGETS.map((s) => (
            <div key={s.date} className="rounded border border-stone-200 bg-stone-50 p-2">
              <div className="font-mono text-stone-500">{s.date}</div>
              <div className="text-stone-800">{s.target}</div>
            </div>
          ))}
        </div>
      </div>

      <ApplicationTable
        title="Rolling — apply when ready (peak Aug–Oct)"
        items={ROLLING_APPLICATIONS}
        showWindow={false}
        showPriority
        applications={state.applications}
        onSetStatus={onSetStatus}
      />
      <ApplicationTable
        title="Cohort-based — apply within window"
        items={COHORT_APPLICATIONS}
        showWindow
        showPriority={false}
        applications={state.applications}
        onSetStatus={onSetStatus}
      />
    </SectionCard>
  );
}

function StatusPill({ label, count, variant }) {
  const isZero = count === 0;
  const cls = isZero ? "border-rule bg-paper text-stone-400" : STATUS_STYLES[variant];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 ${cls}`}>
      <span>{label}</span>
      <span className={`tabular ${isZero ? "text-stone-400" : "font-medium"}`}>{count}</span>
    </span>
  );
}

function ApplicationTable({ title, items, showWindow, showPriority, applications, onSetStatus }) {
  return (
    <div className="mt-4">
      <h4 className="eyebrow">{title}</h4>
      <ul className="mt-3 space-y-1.5">
        {items.map((p) => {
          const a = applications[p.id] || {};
          const status = a.status || "not_started";
          return (
            <li key={p.id} className="rounded-lg border border-rule bg-paper px-3 py-2.5 transition hover:border-stone-400">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-medium text-ink hover:underline"
                  >
                    {p.name}
                    <ExternalLink size={10} className="text-stone-400" />
                  </a>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                    {showPriority && (
                      <span className={`rounded-full border px-1.5 py-0.5 text-[9px] uppercase tracking-widest ${PRIORITY_STYLES[p.priority]}`}>
                        {p.priority}
                      </span>
                    )}
                    {showWindow && <span className="tabular">{p.window}</span>}
                    {p.notes && <span className="hidden md:inline">· {p.notes}</span>}
                  </div>
                </div>
                <StatusChipToggle current={status} onPick={(s) => onSetStatus(p.id, s)} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StatusChipToggle({ current, onPick }) {
  return (
    <div className="flex flex-wrap gap-1">
      {APPLICATION_STATUSES.map((s) => {
        const active = current === s;
        return (
          <button
            key={s}
            onClick={() => onPick(s)}
            className={`rounded-full border px-2 py-0.5 text-[10px] transition ${
              active ? STATUS_STYLES[s] + " font-medium" : "border-rule bg-paper text-stone-400 hover:text-stone-700"
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        );
      })}
    </div>
  );
}

// ---------- Gap Radar ----------

function GapRadar({ state, onSetGate }) {
  return (
    <SectionCard title={<span className="flex items-center gap-2"><Radar size={18} /> Gap Radar — track-specific gates</span>}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Object.entries(GAP_RADAR_GATES).map(([key, group]) => {
          const checked = group.gates.filter((g) => state.gapRadar[g.id]).length;
          const pct = Math.round((checked / group.gates.length) * 100);
          return (
            <div key={key} className="rounded-lg border border-stone-200 bg-white p-3">
              <div className="flex items-baseline justify-between">
                <h4 className="font-serif text-base text-stone-900">{group.title}</h4>
                <span className="font-mono text-xs text-stone-500">{pct}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded bg-stone-100">
                <div className="h-1.5 rounded bg-stone-800" style={{ width: `${pct}%` }} />
              </div>
              <ul className="mt-3 space-y-1.5">
                {group.gates.map((g) => (
                  <li key={g.id}>
                    <label className="flex cursor-pointer items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={!!state.gapRadar[g.id]}
                        onChange={(e) => onSetGate(g.id, e.target.checked)}
                        className="mt-0.5 h-4 w-4 accent-stone-800"
                      />
                      <span className={state.gapRadar[g.id] ? "text-stone-400 line-through" : "text-stone-800"}>{g.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

// ---------- Artifact Wall ----------

function ArtifactWall({ state, onAdd, onRemove }) {
  const [kind, setKind] = useState("sql_problem");
  const [description, setDescription] = useState("");
  const [dateISO, setDateISO] = useState(todayISO());
  const [pendingDelete, setPendingDelete] = useState(null); // { artifact, timeoutId }

  const counts = useMemo(() => {
    const c = {};
    state.artifacts.forEach((a) => {
      c[a.kind] = (c[a.kind] || 0) + 1;
    });
    return c;
  }, [state.artifacts]);

  function submit(e) {
    e.preventDefault();
    if (!description.trim()) return;
    onAdd({ kind, description: description.trim(), dateISO });
    setDescription("");
  }

  function softDelete(artifact) {
    if (pendingDelete?.timeoutId) clearTimeout(pendingDelete.timeoutId);
    onRemove(artifact.id);
    const timeoutId = setTimeout(() => setPendingDelete(null), 5000);
    setPendingDelete({ artifact, timeoutId });
  }

  function undoDelete() {
    if (!pendingDelete) return;
    clearTimeout(pendingDelete.timeoutId);
    onAdd({
      kind: pendingDelete.artifact.kind,
      description: pendingDelete.artifact.description,
      dateISO: pendingDelete.artifact.dateISO,
    });
    setPendingDelete(null);
  }

  const undoBanner = pendingDelete && (
    <div className="flex items-center justify-between rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
      <span>
        Deleted: <span className="font-medium">{pendingDelete.artifact.description}</span>
      </span>
      <button
        onClick={undoDelete}
        className="inline-flex items-center gap-1 rounded-full border border-amber-400 bg-paper px-2.5 py-0.5 hover:bg-amber-100"
      >
        <Undo2 size={11} />
        Undo
      </button>
    </div>
  );

  return (
    <SectionCard title={<span className="flex items-center gap-2"><Shield size={18} /> Artifact Wall</span>} footerNote="Real shipped things only. No counting intentions.">
      {undoBanner}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-xs">
        {[
          { kind: "sql_problem", label: "SQL solved", target: 75 },
          { kind: "code_commit", label: "Commits", target: 50 },
          { kind: "application", label: "Applications", target: 100 },
          { kind: "star_story", label: "STAR stories", target: 15 },
        ].map((row) => {
          const count = (state.artifacts || []).filter((a) => a.kind === row.kind).length;
          const pct = Math.min(100, Math.round((count / row.target) * 100));
          return (
            <div key={row.kind} className="rounded-md border border-stone-200 p-2">
              <div className="flex justify-between text-stone-500"><span>{row.label}</span><span>{count}/{row.target}</span></div>
              <div className="h-1.5 bg-stone-100 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={submit} className="flex flex-wrap items-end gap-2 rounded-lg border border-stone-200 bg-stone-50 p-3">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] uppercase tracking-widest text-stone-500">Type</label>
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="mt-1 w-full rounded border border-stone-200 bg-white px-2 py-1.5 text-sm">
            {ARTIFACT_KINDS.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-[2] min-w-[260px]">
          <label className="block text-[10px] uppercase tracking-widest text-stone-500">Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you actually ship?"
            className="mt-1 w-full rounded border border-stone-200 bg-white px-2 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-stone-500">Date</label>
          <input
            type="date"
            value={dateISO}
            onChange={(e) => setDateISO(e.target.value)}
            className="mt-1 rounded border border-stone-200 bg-white px-2 py-1.5 text-sm"
          />
        </div>
        <button type="submit" className="rounded-full border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-stone-50 hover:bg-stone-700">
          <Plus size={12} className="-mt-0.5 mr-1 inline" /> Log artifact
        </button>
      </form>

      {Object.keys(counts).length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {ARTIFACT_KINDS.filter((k) => counts[k.id]).map((k) => (
            <span key={k.id} className="rounded-full border border-stone-200 bg-white px-2.5 py-0.5 text-xs text-stone-700">
              {k.label}: <span className="font-mono">{counts[k.id]}</span>
            </span>
          ))}
        </div>
      )}

      {state.artifacts.length === 0 ? (
        <p className="text-sm italic text-stone-500">No artifacts yet. Log the first thing you ship.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {state.artifacts.map((a) => {
            const kindLabel = ARTIFACT_KINDS.find((k) => k.id === a.kind)?.label || a.kind;
            return (
              <li key={a.id} className="flex items-start justify-between gap-2 rounded-lg border border-stone-200 bg-white p-2.5">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-stone-400">{kindLabel} · {formatShort(a.dateISO)}</div>
                  <div className="mt-0.5 text-sm text-stone-800">{a.description}</div>
                </div>
                <button onClick={() => softDelete(a)} className="shrink-0 rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700" aria-label="Delete artifact">
                  <Trash2 size={12} />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}

// ---------- Resources tab ----------

function Resources({ currentStageId }) {
  return (
    <div className="space-y-6">
      <SectionCard title="Resource Strategy" dark>
        <ul className="space-y-2 text-sm leading-relaxed">
          <li>
            <span className="font-semibold">InterviewQuery</span> — LIFETIME. Daily anchor problem source May–December. Interview sprint platform in October.
          </li>
          <li>
            <span className="font-semibold">DataCamp</span> — 3-month subscription, May–July only. Front-load SQL/Python/pandas. Surface-level for AI/LLM.
          </li>
          <li>
            <span className="font-semibold">Free fills</span> — Anthropic docs, Eugene Yan, Hamel evals, Real Python, Missing Semester, Mode SQL, ExamPro YouTube.
          </li>
          <li>
            <span className="font-semibold">AWS cert</span> — Stephane Maarek Udemy (~$24 for both courses) + Tutorials Dojo (~$30) + exam fees (~$250).
          </li>
          <li className="text-stone-400">Total paid spend across 8 months: ~$310.</li>
        </ul>
      </SectionCard>

      {STAGES.map((s) => {
        const items = [...s.primary, ...s.gapFill].map((id) => ({ id, ...RESOURCES[id] })).filter((r) => r.name);
        if (items.length === 0) return null;
        return (
          <section
            key={s.id}
            className={`rounded-2xl border p-5 shadow-sm ${s.id === currentStageId ? "border-amber-300 bg-amber-50/40" : "border-stone-200 bg-white"}`}
          >
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-xl tracking-tight">
                Stage {s.order}: {s.title}
              </h2>
              <span className="text-xs uppercase tracking-widest text-stone-400">{s.weeks}</span>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
              {items.map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start justify-between gap-2 rounded-lg border border-stone-200 bg-white p-2.5 text-sm hover:border-stone-400"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-stone-900">{r.name}</div>
                    <div className="mt-0.5 text-[10px] uppercase tracking-widest text-stone-400">{r.tag}</div>
                  </div>
                  <ExternalLink size={12} className="mt-1 shrink-0 text-stone-400" />
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ---------- Future Pivots ----------

function FuturePivots() {
  return (
    <div className="space-y-4">
      <SectionCard title={<span className="flex items-center gap-2"><Lock size={18} /> Future Pivots</span>}>
        <p className="text-sm text-stone-600">
          Visible for honesty, not active. The primary pitch is FDE/SE. BIE / AE is the explicit fallback inside the same SQL/Python spine.
        </p>
      </SectionCard>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {FUTURE_PIVOTS.map((p) => (
          <article key={p.id} className="rounded-xl border border-stone-200 bg-stone-50 p-4 opacity-80">
            <div className="flex items-center gap-2 text-stone-600">
              <Lock size={14} />
              <h3 className="font-serif text-lg">{p.title}</h3>
            </div>
            <p className="mt-2 text-sm text-stone-500">{p.note}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

// ---------- Modals ----------

function TrackChangeModal({ state, onClose, onConfirm }) {
  const [reasoning, setReasoning] = useState("");
  const [target, setTarget] = useState(state.track === "fde-se" ? "bie" : "fde-se");
  const trimmedLen = reasoning.trim().length;
  const valid = trimmedLen >= 200;
  const pct = Math.min(100, (trimmedLen / 200) * 100);
  return (
    <ModalShell onClose={onClose} title="Re-evaluate track">
      <p className="text-sm text-stone-600">
        Locked on <strong>{TRACKS[state.track].short}</strong>. To change, write 200+ characters explaining what changed since you committed.
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {Object.values(TRACKS).map((t) => (
          <button
            key={t.id}
            onClick={() => setTarget(t.id)}
            className={`rounded-lg border p-3 text-left text-sm transition ${
              target === t.id ? "border-ink bg-ink text-paper" : "border-rule bg-paper text-stone-700 hover:border-stone-500"
            }`}
          >
            <div className="font-medium">{t.title}</div>
            <div className={`mt-1 text-xs ${target === t.id ? "text-stone-400" : "text-stone-500"}`}>{t.summary}</div>
          </button>
        ))}
      </div>
      <textarea
        value={reasoning}
        onChange={(e) => setReasoning(e.target.value)}
        rows={6}
        placeholder="What changed? What new evidence? What did you ship that pulls you in this direction?"
        className="mt-3 w-full rounded border border-rule bg-paper-warm/40 p-3 text-sm leading-relaxed focus:border-stone-500 focus:outline-none"
      />
      <div className="mt-2 space-y-1">
        <div className="flex items-baseline justify-between text-xs text-stone-500">
          <span className={valid ? "font-medium text-sage" : ""}>
            <span className="tabular">{trimmedLen}</span> / 200 characters {valid && "· ready"}
          </span>
          <span className="text-stone-400">{200 - trimmedLen > 0 ? `${200 - trimmedLen} to go` : "—"}</span>
        </div>
        <div className="h-1 w-full rounded bg-rule">
          <div
            className={`h-1 rounded transition-all ${valid ? "bg-sage" : "bg-clay-soft"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-2 text-xs">
        <button onClick={onClose} className="rounded border border-rule bg-paper px-3 py-1.5 hover:border-stone-500">
          Cancel
        </button>
        <button
          onClick={() => valid && onConfirm(target, reasoning)}
          disabled={!valid}
          className={`rounded border px-3 py-1.5 transition ${
            valid
              ? "border-ink bg-ink text-paper hover:bg-stone-700"
              : "cursor-not-allowed border-rule bg-paper-dark/60 text-stone-400"
          }`}
        >
          Confirm change to {TRACKS[target].short}
        </button>
      </div>
    </ModalShell>
  );
}

function SwitchingCostModal({ state, calendar, onClose, onProceed }) {
  const today = todayISO();
  const weeksInvested = Math.max(0, Math.floor(diffDays(state.calendarStartDate, today) / 7));
  const weeksUntilApps = Math.max(0, Math.ceil(diffDays(today, calendar.bufferStart) / 7));
  const trackInfo = TRACKS[state.track];
  const otherTrack = state.track === "fde-se" ? TRACKS.bie : TRACKS["fde-se"];
  const wouldNotCarry = STAGES.filter((s) => {
    const tagsMatchOther = s.tags.includes(otherTrack.short.split(" / ")[0].replace(" ", ""));
    return !tagsMatchOther && (state.stages[s.id]?.mvpShipped || false);
  });
  const artifactsByKind = state.artifacts.reduce((acc, a) => {
    acc[a.kind] = (acc[a.kind] || 0) + 1;
    return acc;
  }, {});

  return (
    <ModalShell onClose={onClose} title="Switching cost">
      <div className="space-y-3 text-sm">
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
          <div className="text-xs uppercase tracking-widest text-stone-500">Invested so far</div>
          <div className="mt-1">
            <span className="font-mono text-2xl text-stone-900">{weeksInvested}</span>{" "}
            <span className="text-stone-600">weeks on {trackInfo.short}</span>
          </div>
        </div>
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-3">
          <div className="text-xs uppercase tracking-widest text-stone-500">Time pressure</div>
          <div className="mt-1">
            <span className="font-mono text-2xl text-stone-900">{weeksUntilApps}</span>{" "}
            <span className="text-stone-600">weeks until applications peak ({formatShort(calendar.bufferStart)})</span>
          </div>
        </div>
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3">
          <div className="text-xs uppercase tracking-widest text-amber-800">Estimated rebuild</div>
          <p className="mt-1 text-stone-800">
            Switching to <strong>{otherTrack.short}</strong> shifts your branch focus in Stage 5 (cases vs. sales pitch vs. analyst depth). Foundation stages (1–4) and the application sprint (6–7) carry over directly. Estimate ~{Math.max(1, Math.floor(weeksInvested / 4))} weeks of branch re-prep.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-stone-500">Artifacts logged</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {Object.entries(artifactsByKind).length === 0 ? (
              <span className="text-stone-500">None yet — switching is cheap.</span>
            ) : (
              Object.entries(artifactsByKind).map(([k, n]) => (
                <span key={k} className="rounded-full border border-stone-200 bg-white px-2.5 py-0.5 text-xs">
                  {ARTIFACT_KINDS.find((x) => x.id === k)?.label}: <span className="font-mono">{n}</span>
                </span>
              ))
            )}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-stone-500">MVPs that would not carry over</div>
          {wouldNotCarry.length === 0 ? (
            <p className="mt-1 text-stone-500">None — you haven't shipped any FDE/SE-only MVPs yet.</p>
          ) : (
            <ul className="mt-1 list-disc pl-5 text-stone-800">
              {wouldNotCarry.map((s) => (
                <li key={s.id}>{s.title}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="rounded border border-stone-200 bg-white px-3 py-1 text-sm">
          Stay
        </button>
        <button onClick={onProceed} className="rounded border border-stone-800 bg-stone-900 px-3 py-1 text-sm text-stone-50">
          I read this — proceed to change
        </button>
      </div>
    </ModalShell>
  );
}

function LessonModal({ existingLesson, existingTags, atCapacity, onClose, onSave }) {
  const [source, setSource] = useState(existingLesson?.source || "");
  const [category, setCategory] = useState(existingLesson?.category || "concept_gap");
  const [tag, setTag] = useState(existingLesson?.tag || "");
  const [whatTried, setWhatTried] = useState(existingLesson?.what_i_tried || "");
  const [whatCorrect, setWhatCorrect] = useState(existingLesson?.what_was_correct || "");
  const [whyMissed, setWhyMissed] = useState(existingLesson?.why_i_missed || "");
  const [touched, setTouched] = useState(false);

  const valid =
    source.trim() &&
    category &&
    tag.trim() &&
    whatTried.trim() &&
    whatCorrect.trim() &&
    whyMissed.trim();

  const tagSuggestions = tag.trim()
    ? existingTags
        .filter((t) => t.toLowerCase().includes(tag.toLowerCase()) && t.toLowerCase() !== tag.toLowerCase())
        .slice(0, 5)
    : [];

  function submit(e) {
    e?.preventDefault?.();
    setTouched(true);
    if (!valid || atCapacity) return;
    onSave({
      source,
      category,
      tag,
      what_i_tried: whatTried,
      what_was_correct: whatCorrect,
      why_i_missed: whyMissed,
    });
  }

  const inputCls =
    "mt-1.5 w-full rounded-md border border-rule bg-paper-warm/30 px-2.5 py-1.5 text-sm text-ink placeholder:text-stone-400 focus:border-rule-strong focus:bg-paper focus:outline-none";

  return (
    <ModalShell onClose={onClose} title={existingLesson ? "Edit lesson" : "Log a lesson"}>
      <p className="-mt-1 mb-3 font-hanji text-[13px] italic leading-relaxed text-stone-500">
        Capture it now, before it fades. Under 60 seconds.
      </p>
      {atCapacity && !existingLesson && (
        <div className="mb-3 rounded-lg border-l-2 border-clay bg-clay/5 px-3 py-2 text-xs text-stone-700">
          You've hit {LESSONS_MAX} lessons. Archive or delete old ones in Career HQ → Lessons before logging more.
        </div>
      )}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="eyebrow">Source</label>
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="SQLZoo problem 4 / DataCamp Joins / InterviewQuery #142"
            autoFocus
            className={inputCls}
          />
          {touched && !source.trim() && <p className="mt-1 text-[10px] italic text-clay">Required.</p>}
        </div>

        <div>
          <label className="eyebrow">Category</label>
          <div className="mt-1.5 grid grid-cols-1 gap-1.5 sm:grid-cols-3">
            {LESSON_CATEGORIES.map((c) => (
              <label
                key={c.id}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border px-2.5 py-2 text-xs transition ${
                  category === c.id
                    ? "border-ink bg-ink text-paper"
                    : "border-rule bg-paper text-stone-700 hover:border-rule-strong"
                }`}
              >
                <input
                  type="radio"
                  name="lesson-category"
                  value={c.id}
                  checked={category === c.id}
                  onChange={() => setCategory(c.id)}
                  className="sr-only"
                />
                {c.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="eyebrow">Tag</label>
          <input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="joins / window functions / pandas merge / RAG"
            className={inputCls}
            list="lesson-tag-suggestions"
          />
          {tagSuggestions.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {tagSuggestions.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className="rounded-full border border-rule bg-paper-warm/60 px-2 py-0.5 text-[10px] text-stone-600 transition hover:border-rule-strong hover:text-ink"
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          {touched && !tag.trim() && <p className="mt-1 text-[10px] italic text-clay">Required.</p>}
        </div>

        <div>
          <label className="eyebrow">What I tried</label>
          <textarea
            value={whatTried}
            onChange={(e) => setWhatTried(e.target.value)}
            rows={2}
            placeholder="The wrong approach (1–3 lines)"
            className={`${inputCls} resize-none leading-relaxed`}
          />
          {touched && !whatTried.trim() && <p className="mt-1 text-[10px] italic text-clay">Required.</p>}
        </div>

        <div>
          <label className="eyebrow">What was correct</label>
          <textarea
            value={whatCorrect}
            onChange={(e) => setWhatCorrect(e.target.value)}
            rows={2}
            placeholder="The right approach (1–3 lines)"
            className={`${inputCls} resize-none leading-relaxed`}
          />
          {touched && !whatCorrect.trim() && <p className="mt-1 text-[10px] italic text-clay">Required.</p>}
        </div>

        <div>
          <label className="eyebrow">Why I missed it</label>
          <input
            value={whyMissed}
            onChange={(e) => setWhyMissed(e.target.value)}
            placeholder="Honest gap (1 line)"
            className={inputCls}
          />
          {touched && !whyMissed.trim() && <p className="mt-1 text-[10px] italic text-clay">Required.</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-rule bg-paper px-3.5 py-1.5 text-stone-600 transition hover:border-stone-500 hover:text-ink"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!valid || (atCapacity && !existingLesson)}
            className={`rounded-full border px-3.5 py-1.5 transition ${
              valid && !(atCapacity && !existingLesson)
                ? "border-ink bg-ink text-paper hover:bg-stone-700"
                : "cursor-not-allowed border-rule bg-paper-dark/60 text-stone-400"
            }`}
          >
            {existingLesson ? "Save changes" : "Save lesson"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function LessonReviewModal({ lessons, onClose, onMarkReviewed, onReLog }) {
  const [reLogging, setReLogging] = useState(false);
  const [restatement, setRestatement] = useState("");
  const lesson = lessons[0];

  if (!lesson) {
    return (
      <ModalShell onClose={onClose} title="Review queue">
        <p className="text-sm text-stone-600">No more lessons to review right now. Solid.</p>
        <div className="mt-3 flex justify-end">
          <button onClick={onClose} className="rounded border border-ink bg-ink px-3 py-1.5 text-xs text-paper hover:bg-stone-700">
            Close
          </button>
        </div>
      </ModalShell>
    );
  }

  const total = lessons.length;
  const remaining = total;

  return (
    <ModalShell onClose={onClose} title={`Review · ${remaining} left`}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-full border border-rule bg-paper-warm/60 px-2 py-0.5 text-[10px] uppercase tracking-widest text-stone-500">
            {lessonCategoryLabel(lesson.category)}
          </span>
          <span className="rounded-full border border-clay/30 bg-clay/5 px-2 py-0.5 text-[10px] font-medium text-clay">
            {lesson.tag}
          </span>
          <span className="ml-auto tabular text-[10px] text-stone-400">
            {formatShort(lesson.date.slice(0, 10))}
          </span>
        </div>

        <div className="rounded-xl border border-rule bg-paper-warm/30 p-4">
          <div className="eyebrow">Source</div>
          <p className="mt-1 font-hanji text-[15px] leading-relaxed text-ink">{lesson.source}</p>
        </div>

        <div className="space-y-3">
          <div className="rounded-lg border-l-2 border-clay/60 bg-paper px-3.5 py-2.5">
            <div className="eyebrow text-clay">What I tried</div>
            <p className="mt-1 whitespace-pre-wrap font-hanji text-[15px] leading-relaxed text-ink">
              {lesson.what_i_tried}
            </p>
          </div>
          <div className="rounded-lg border-l-2 border-sage/70 bg-paper px-3.5 py-2.5">
            <div className="eyebrow text-sage">What was correct</div>
            <p className="mt-1 whitespace-pre-wrap font-hanji text-[15px] leading-relaxed text-ink">
              {lesson.what_was_correct}
            </p>
          </div>
          <div className="rounded-lg border-l-2 border-celadon/70 bg-paper px-3.5 py-2.5">
            <div className="eyebrow text-celadon">Why I missed</div>
            <p className="mt-1 font-hanji text-[15px] leading-relaxed text-ink">{lesson.why_i_missed}</p>
          </div>
        </div>

        {reLogging && (
          <div className="rounded-xl border border-clay/40 bg-clay/5 p-3.5">
            <label className="eyebrow text-clay">Re-explain in your own words</label>
            <textarea
              value={restatement}
              onChange={(e) => setRestatement(e.target.value)}
              rows={3}
              placeholder="What's still confusing? Write it out — that's how it sticks."
              className="mt-1.5 w-full resize-none rounded-md border border-rule bg-paper px-2.5 py-1.5 text-sm leading-relaxed text-ink placeholder:text-stone-400 focus:border-clay focus:outline-none"
              autoFocus
            />
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-2 text-xs">
        {!reLogging ? (
          <>
            <button
              onClick={() => setReLogging(true)}
              className="rounded-full border border-rule bg-paper px-3.5 py-1.5 text-stone-700 transition hover:border-clay hover:text-clay"
            >
              Still confused
            </button>
            <button
              onClick={() => onMarkReviewed(lesson.id)}
              className="rounded-full border border-ink bg-ink px-3.5 py-1.5 text-paper transition hover:bg-stone-700"
            >
              Got it · mark reviewed
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setReLogging(false);
                setRestatement("");
              }}
              className="rounded-full border border-rule bg-paper px-3.5 py-1.5 text-stone-700 transition hover:border-stone-500"
            >
              Cancel
            </button>
            <button
              onClick={() => onReLog(lesson.id, restatement)}
              disabled={!restatement.trim()}
              className={`rounded-full border px-3.5 py-1.5 transition ${
                restatement.trim()
                  ? "border-clay bg-clay text-paper hover:bg-clay/90"
                  : "cursor-not-allowed border-rule bg-paper-dark/60 text-stone-400"
              }`}
            >
              Save re-log
            </button>
          </>
        )}
      </div>
    </ModalShell>
  );
}

function ModalShell({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/40 p-4 sm:items-center">
      <div className="w-full max-w-2xl rounded-2xl border border-stone-200 bg-white p-5 shadow-xl">
        <div className="flex items-baseline justify-between">
          <h3 className="font-serif text-xl tracking-tight">{title}</h3>
          <button onClick={onClose} className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700">
            <X size={16} />
          </button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

function CaptureInbox({ items, onAdd, onDelete }) {
  const [text, setText] = useState("");
  function handleAdd() {
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  }
  return (
    <SectionCard title="Capture Inbox">
      <p className="text-xs text-stone-500 mb-2">Brain dump. Don't carry it. Process weekly.</p>
      <div className="flex gap-2 mb-3">
        <input
          className="flex-1 rounded-md border border-stone-300 px-3 py-2 text-sm"
          placeholder="What's on your mind…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
        />
        <button onClick={handleAdd} className="rounded-md bg-ink text-paper px-4 py-2 text-sm">Capture</button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-stone-400 italic">Inbox empty.</p>
      ) : (
        <ul className="space-y-1.5">
          {items.slice(0, 20).map((c) => (
            <li key={c.id} className="flex items-start gap-2 text-sm">
              <span className="text-stone-400 text-xs pt-1 w-16 shrink-0">{formatShort(c.dateISO)}</span>
              <span className="flex-1">{c.text}</span>
              <button onClick={() => onDelete(c.id)} className="text-stone-300 hover:text-red-500 text-xs">×</button>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

function EnergyBudget({ todayEnergy, onSet }) {
  const fields = [
    { key: "sleep", label: "Slept 7h+" },
    { key: "move", label: "Moved 20min" },
    { key: "social", label: "1+ social interaction" },
  ];
  const e = todayEnergy || {};
  const greenCount = fields.filter((f) => e[f.key]).length;
  const prescription = greenCount >= 2
    ? "Green day — Full or Half mode."
    : greenCount === 1
    ? "Yellow day — Half mode recommended."
    : "Red day — MVD only. Don't push.";
  return (
    <SectionCard title="Energy Budget">
      <p className="text-xs text-stone-500 mb-2">{prescription}</p>
      <div className="grid grid-cols-3 gap-2">
        {fields.map((f) => (
          <label key={f.key} className="flex items-center gap-2 text-sm cursor-pointer rounded-md border border-stone-200 px-3 py-2">
            <input
              type="checkbox"
              checked={!!e[f.key]}
              onChange={(ev) => onSet(f.key, ev.target.checked)}
            />
            <span>{f.label}</span>
          </label>
        ))}
      </div>
    </SectionCard>
  );
}

function LeetCodeTracker({ leetcode, onLog }) {
  const [problem, setProblem] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [notes, setNotes] = useState("");
  const lc = leetcode || { easySolved: 0, mediumSolved: 0, log: [] };

  function submit() {
    if (!problem.trim()) return;
    onLog({ problem, difficulty, notes });
    setProblem("");
    setNotes("");
  }

  const easyMilestone = 50;
  const mediumMilestone = 80;
  const easyPct = Math.min(100, Math.round((lc.easySolved / easyMilestone) * 100));
  const mediumPct = Math.min(100, Math.round((lc.mediumSolved / mediumMilestone) * 100));

  return (
    <SectionCard title="LeetCode Side Track (NeetCode 150)">
      <p className="text-xs text-stone-500 mb-3">30 min/day. Side goal — not required for your tracks.</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-md border border-stone-200 p-3">
          <div className="flex justify-between text-xs text-stone-500 mb-1">
            <span>Easy</span>
            <span>{lc.easySolved} / {easyMilestone}</span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400" style={{ width: `${easyPct}%` }} />
          </div>
        </div>
        <div className="rounded-md border border-stone-200 p-3">
          <div className="flex justify-between text-xs text-stone-500 mb-1">
            <span>Medium</span>
            <span>{lc.mediumSolved} / {mediumMilestone}</span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-400" style={{ width: `${mediumPct}%` }} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <input
          className="rounded-md border border-stone-300 px-3 py-2 text-sm"
          placeholder="Problem name (e.g. Two Sum)"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
        />
        <div className="flex gap-2">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="rounded-md border border-stone-300 px-2 py-2 text-sm"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
          </select>
          <input
            className="flex-1 rounded-md border border-stone-300 px-3 py-2 text-sm"
            placeholder="Notes (pattern used)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button onClick={submit} className="rounded-md bg-ink text-paper px-4 py-2 text-sm">Log</button>
        </div>
      </div>
      {lc.log && lc.log.length > 0 && (
        <details className="mt-3 text-sm">
          <summary className="text-xs text-stone-500 cursor-pointer">Recent log ({lc.log.length})</summary>
          <ul className="mt-2 space-y-1">
            {lc.log.slice(0, 10).map((e) => (
              <li key={e.id} className="text-xs text-stone-600 flex gap-2">
                <span className="text-stone-400 w-16 shrink-0">{formatShort(e.dateISO)}</span>
                <span className={`uppercase text-[10px] px-1.5 rounded ${e.difficulty === "easy" ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"}`}>{e.difficulty}</span>
                <span>{e.problem}</span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </SectionCard>
  );
}

const DISCOVERY_STATUSES = [
  { id: "outreach", label: "Outreach sent", color: "bg-stone-100 text-stone-700" },
  { id: "replied", label: "Replied", color: "bg-blue-100 text-blue-700" },
  { id: "scheduled", label: "Scheduled", color: "bg-amber-100 text-amber-700" },
  { id: "completed", label: "Completed", color: "bg-emerald-100 text-emerald-700" },
  { id: "ghosted", label: "Ghosted", color: "bg-stone-100 text-stone-400" },
];

function DiscoveryCRM({ discovery, onAdd, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", role: "", company: "", source: "", notes: "" });

  function submit() {
    if (!draft.name.trim()) return;
    onAdd(draft);
    setDraft({ name: "", role: "", company: "", source: "", notes: "" });
    setOpen(false);
  }

  const counts = DISCOVERY_STATUSES.reduce((acc, s) => {
    acc[s.id] = (discovery || []).filter((d) => d.status === s.id).length;
    return acc;
  }, {});

  return (
    <SectionCard title="Discovery / Networking CRM">
      <p className="text-xs text-stone-500 mb-3">Track outreach, replies, calls. Aim for 5+ informational interviews logged.</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {DISCOVERY_STATUSES.map((s) => (
          <span key={s.id} className={`text-xs px-2 py-1 rounded ${s.color}`}>
            {s.label}: {counts[s.id] || 0}
          </span>
        ))}
      </div>
      <button onClick={() => setOpen((o) => !o)} className="text-sm rounded-md border border-stone-300 px-3 py-1.5 mb-3">
        {open ? "Cancel" : "+ Add contact"}
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-2 mb-3 p-3 bg-stone-50 rounded-md">
          <input className="rounded border border-stone-300 px-2 py-1.5 text-sm" placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <input className="rounded border border-stone-300 px-2 py-1.5 text-sm" placeholder="Role / title" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} />
          <input className="rounded border border-stone-300 px-2 py-1.5 text-sm" placeholder="Company" value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} />
          <input className="rounded border border-stone-300 px-2 py-1.5 text-sm" placeholder="Source (LinkedIn, alum, etc.)" value={draft.source} onChange={(e) => setDraft({ ...draft, source: e.target.value })} />
          <textarea className="col-span-2 rounded border border-stone-300 px-2 py-1.5 text-sm" placeholder="Notes / weak-tie reason" rows={2} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
          <button onClick={submit} className="col-span-2 rounded-md bg-ink text-paper px-3 py-2 text-sm">Save contact</button>
        </div>
      )}
      {(discovery || []).length === 0 ? (
        <p className="text-xs text-stone-400 italic">No contacts yet. Start with 3 alumni this week.</p>
      ) : (
        <ul className="space-y-2">
          {(discovery || []).map((c) => {
            const statusObj = DISCOVERY_STATUSES.find((s) => s.id === c.status) || DISCOVERY_STATUSES[0];
            return (
              <li key={c.id} className="border border-stone-200 rounded-md p-2.5 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{c.name} <span className="text-stone-500 font-normal">— {c.role || "?"} @ {c.company || "?"}</span></div>
                    <div className="text-xs text-stone-500 mt-0.5">{c.source} · last touch {formatShort(c.lastTouchISO)}</div>
                    {c.notes && <div className="text-xs text-stone-600 mt-1 italic">{c.notes}</div>}
                  </div>
                  <button onClick={() => onDelete(c.id)} className="text-stone-300 hover:text-red-500 text-xs">×</button>
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {DISCOVERY_STATUSES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onUpdate(c.id, { status: s.id, lastTouchISO: todayISO() })}
                      className={`text-[10px] px-2 py-0.5 rounded ${c.status === s.id ? s.color : "bg-stone-50 text-stone-400 hover:bg-stone-100"}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </SectionCard>
  );
}

const AMAZON_LPS = [
  "Customer Obsession", "Ownership", "Invent and Simplify", "Are Right, A Lot",
  "Learn and Be Curious", "Hire and Develop the Best", "Insist on the Highest Standards",
  "Think Big", "Bias for Action", "Frugality", "Earn Trust", "Dive Deep",
  "Have Backbone; Disagree and Commit", "Deliver Results", "Strive to be Earth's Best Employer",
  "Success and Scale Bring Broad Responsibility",
];

function StarStoriesTracker({ stories, onAdd, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ title: "", body: "", lp: "" });
  function submit() {
    if (!draft.title.trim()) return;
    onAdd(draft);
    setDraft({ title: "", body: "", lp: "" });
    setOpen(false);
  }
  const target = 15;
  const count = (stories || []).length;
  const pct = Math.min(100, Math.round((count / target) * 100));
  return (
    <SectionCard title={`STAR Stories — ${count} / ${target}`}>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden mb-3">
        <div className="h-full bg-amber-400" style={{ width: `${pct}%` }} />
      </div>
      <button onClick={() => setOpen((o) => !o)} className="text-sm rounded-md border border-stone-300 px-3 py-1.5 mb-3">
        {open ? "Cancel" : "+ Add STAR story"}
      </button>
      {open && (
        <div className="flex flex-col gap-2 mb-3 p-3 bg-stone-50 rounded-md">
          <input className="rounded border border-stone-300 px-2 py-1.5 text-sm" placeholder="Title (e.g. Led MLDS group project)" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <select className="rounded border border-stone-300 px-2 py-1.5 text-sm" value={draft.lp} onChange={(e) => setDraft({ ...draft, lp: e.target.value })}>
            <option value="">— Mapped LP / theme —</option>
            <option value="Leadership">Leadership</option>
            <option value="Conflict">Conflict</option>
            <option value="Failure">Failure</option>
            <option value="Ambiguity">Ambiguity</option>
            <option value="Customer">Customer / stakeholder</option>
            <option value="Technical">Technical</option>
            <optgroup label="Amazon LPs">
              {AMAZON_LPS.map((lp) => <option key={lp} value={lp}>{lp}</option>)}
            </optgroup>
          </select>
          <textarea className="rounded border border-stone-300 px-2 py-1.5 text-sm" placeholder="Story (S-T-A-R format)" rows={4} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
          <button onClick={submit} className="rounded-md bg-ink text-paper px-3 py-2 text-sm">Save story</button>
        </div>
      )}
      <ul className="space-y-2">
        {(stories || []).map((s) => (
          <li key={s.id} className="border border-stone-200 rounded-md p-2 text-sm">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-medium">{s.title}</div>
                {s.lp && <div className="text-xs text-amber-700 mt-0.5">{s.lp}</div>}
                {s.body && <div className="text-xs text-stone-600 mt-1 whitespace-pre-line">{s.body}</div>}
              </div>
              <button onClick={() => onDelete(s.id)} className="text-stone-300 hover:text-red-500 text-xs">×</button>
            </div>
            <button onClick={() => onUpdate(s.id, { lastDrilledISO: todayISO() })} className="text-xs text-stone-500 mt-1.5">
              Mark drilled today {s.lastDrilledISO ? `(last ${formatShort(s.lastDrilledISO)})` : ""}
            </button>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

const PIPELINE_STAGES = ["Applied", "Recruiter", "Tech Screen", "Onsite", "Offer"];
const OFFER_STATUSES = [
  { id: "pending", label: "Pending" },
  { id: "offered", label: "Offered" },
  { id: "accepted", label: "Accepted" },
  { id: "rejected", label: "Rejected" },
  { id: "ghosted", label: "Ghosted" },
];

function PipelineTracker({ pipeline, applications, onAddStage, onSetOffer }) {
  const allApps = [...ROLLING_APPLICATIONS, ...COHORT_APPLICATIONS];
  const active = allApps.filter((a) => applications[a.id]?.status === "applied");
  return (
    <SectionCard title="Interview Pipeline">
      <p className="text-xs text-stone-500 mb-3">Applied → Recruiter → Tech Screen → Onsite → Offer. Updated as you move.</p>
      {active.length === 0 ? (
        <p className="text-xs text-stone-400 italic">Mark applications as "applied" in Application Timeline to see them here.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-left text-stone-500">
                <th className="py-1.5 pr-2">Company</th>
                {PIPELINE_STAGES.map((s) => <th key={s} className="py-1.5 px-2 text-center">{s}</th>)}
                <th className="py-1.5 pl-2">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {active.map((a) => {
                const p = (pipeline || {})[a.id] || { stages: [], offerStatus: null };
                const reached = new Set(p.stages.map((s) => s.name));
                return (
                  <tr key={a.id} className="border-b border-stone-100">
                    <td className="py-1.5 pr-2 font-medium">{a.name}</td>
                    {PIPELINE_STAGES.map((s) => (
                      <td key={s} className="py-1.5 px-2 text-center">
                        <button
                          onClick={() => onAddStage(a.id, { name: s })}
                          className={`text-[10px] px-2 py-0.5 rounded ${reached.has(s) ? "bg-emerald-100 text-emerald-700" : "bg-stone-50 text-stone-400 hover:bg-stone-100"}`}
                        >
                          {reached.has(s) ? "✓" : "+"}
                        </button>
                      </td>
                    ))}
                    <td className="py-1.5 pl-2">
                      <select
                        value={p.offerStatus || ""}
                        onChange={(e) => onSetOffer(a.id, e.target.value || null)}
                        className="text-[10px] rounded border border-stone-200 px-1 py-0.5"
                      >
                        <option value="">—</option>
                        {OFFER_STATUSES.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}
