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

const STORAGE_KEY = "de-roadmap-fde-se-v2";

const TRACKS = {
  "fde-se": {
    id: "fde-se",
    title: "Forward Deployed Engineer / AI Solutions Engineer",
    short: "FDE / SE",
    role: "primary",
    summary:
      "Customer-facing AI engineer. Build vertical agents, run discovery calls, ship demos. The 8-month plan toward a Dec 2026 offer.",
    salaryBand: "$90k–130k+",
  },
  bie: {
    id: "bie",
    title: "BI Engineer / Analytics Engineer",
    short: "BIE / AE",
    role: "fallback",
    summary:
      "Fallback if the FDE/SE market closes or readiness lags. Same SQL/Python spine, different signal stack.",
    salaryBand: "$80k–110k",
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
    title: "SQL Foundations",
    weeks: "4–5 weeks",
    weeksMin: 4,
    weeksMax: 5,
    tags: ["FDE", "SE", "BIE"],
    concepts: [
      "SELECT / WHERE / ORDER BY / LIMIT / DISTINCT",
      "Aggregations: GROUP BY, HAVING",
      "All 5 JOIN types",
      "Subqueries: scalar, correlated",
      "CTEs (including recursive)",
      "Window functions: ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, PARTITION BY, frame clauses",
      "CASE statements",
      "String + date functions",
      "NULL handling: COALESCE, NULLIF",
      "Set operations",
      "Performance basics: EXPLAIN, indexing",
      "Patterns: running totals, top-N per group, gaps and islands, sessionization",
    ],
    primary: ["dc-sql-fundamentals", "dc-joining-sql", "dc-intermediate-sql", "dc-window-sql", "dc-data-manip-sql", "iq-sql"],
    gapFill: ["mode-sql", "select-star", "stratascratch", "pg-explain"],
    mvp: "SELECT, all 5 JOINs, GROUP BY, basic CTEs, ROW_NUMBER + RANK + CASE. Skip recursive CTEs and EXPLAIN.",
    done: "50 mixed SQL problems solved. Window functions from memory. 'Top 3 per category' cold in <5 min.",
    deliverable: "End of Stage 1: post a Notion page with 50 SQL problems, your queries, and 1-line takeaways.",
    whyThisMatters: "FDE interviews at Sierra, Decagon, Hex test SQL on every loop. Even AI-native shops want you to debug a customer's query live. This is your foundation — and the cheapest stage to build confidence on.",
    aiPrompts: [
      "Explain INNER vs LEFT vs FULL OUTER JOIN with one e-commerce example each. Then quiz me on a tricky case where I have to pick.",
      "I keep mixing up WHERE and HAVING. Give me 3 problems where the right answer requires the right one. Wait for my answer before showing yours.",
      "Walk me through 'top N per category' using ROW_NUMBER. Then give me a similar problem cold and don't help unless I ask.",
    ],
  },
  {
    id: "stage-2",
    order: 2,
    title: "Python + APIs",
    weeks: "5–6 weeks",
    weeksMin: 5,
    weeksMax: 6,
    tags: ["FDE", "SE", "BIE"],
    concepts: [
      "Python fundamentals + data structures",
      "Comprehensions, file I/O, error handling, stack trace reading",
      "pandas deeply: DataFrames, indexing, groupby+agg, merge, pivot, melt, datetime, missing data",
      "numpy basics",
      "requests + JSON",
      "REST patterns: params, pagination, rate limiting, retries",
      "Auth: API keys, basic, OAuth concept",
      "Virtual environments + git workflow",
      "Reading AI-generated code line-by-line",
      "pytest basics",
    ],
    primary: ["dc-python-fund", "dc-intermediate-python", "dc-pandas-manip", "dc-pandas-joining", "dc-dates", "dc-functions", "iq-python"],
    gapFill: ["real-python", "missing-semester", "fastapi-tutorial", "postman"],
    mvp: "Python basics, pandas core, requests + JSON, can read AI-gen code line-by-line. Skip numpy depth, OAuth, pytest.",
    done: "Python script calling 2 APIs, joining with pandas, handling pagination + errors, outputting CSV. 30 IQ Python problems. Can explain every line of a 100-line AI-gen file.",
    deliverable: "End of Stage 2: a public GitHub repo with the API+pandas script, README, and a Loom walkthrough.",
    whyThisMatters: "FDE work is 60% Python — building scripts that pull customer data, hit APIs, transform responses on a call. You can't fake this with AI alone, and it's the best signal that you can actually defend code in interviews.",
    aiPrompts: [
      "Show me 3 patterns for paginating a REST API in Python. Then give me a broken script and ask me to fix it without writing the fix yourself.",
      "Explain pandas merge vs concat using a CRM dataset (customers + orders + tickets). Then quiz me on which to use in 4 scenarios.",
      "I'll paste a 100-line AI-generated Python file. Quiz me on what each block does, line by line. Don't accept hand-wavy answers.",
    ],
  },
  {
    id: "stage-3",
    order: 3,
    title: "AI Engineering",
    weeks: "4–5 weeks",
    weeksMin: 4,
    weeksMax: 5,
    tags: ["FDE", "SE"],
    concepts: [
      "LLM fundamentals: tokens, context, temperature, top_p, hallucinations",
      "Prompt engineering: zero-shot, few-shot, CoT, structured outputs",
      "Anthropic + OpenAI APIs",
      "Tool use / function calling",
      "RAG: chunking, embeddings, vector similarity",
      "One vector DB hands-on (Pinecone or Chroma)",
      "One agent framework (LangChain or LlamaIndex)",
      "Evaluation: eval sets, golden examples",
      "Limitations + failure modes",
      "Cursor / Claude Code daily fluency",
    ],
    primary: ["dc-openai", "dc-anthropic", "dc-langchain", "iq-case"],
    gapFill: [
      "anthropic-docs",
      "openai-cookbook",
      "deeplearning-ai",
      "langchain-academy",
      "eugene-yan",
      "hamel-evals",
      "cursor",
      "claude-code",
    ],
    mvp: "One LLM API used fluently (Anthropic OR OpenAI), basic prompts, one RAG built (any quality), tool use understood. Skip vector DB tuning + production eval.",
    done: "Working RAG pipeline you built and can explain. Agent with 2+ tools handling failures. JSON-output prompt valid 95%+. 30+ days daily Cursor or Claude Code.",
    deliverable: "End of Stage 3: a deployed RAG demo + a 1-page architecture write-up.",
    whyThisMatters: "This is the differentiator. AI Engineering depth is what makes you 'forward deployed' instead of 'generic engineer'. Knowing where RAG breaks beats knowing 10 frameworks — recruiters ask 'why didn't your pipeline work in production?' and want a real answer.",
    aiPrompts: [
      "Walk me through a simple RAG pipeline over 50 PDFs. Then point out 3 places it would fail in production and how you'd diagnose each.",
      "I'm stuck on tool use schemas. Give me 3 worked examples for an Anthropic-style tool call, then make me write one for a customer-support agent. Don't write it for me.",
      "Quiz me on temperature, top_p, and structured outputs. After I answer, tell me which one I'd tune for a deterministic JSON-extraction task and why.",
    ],
  },
  {
    id: "stage-4",
    order: 4,
    title: "The Vertical Project",
    weeks: "6–8 weeks (capstone, parallel with Stage 5)",
    weeksMin: 6,
    weeksMax: 8,
    tags: ["FDE", "SE"],
    concepts: [
      "Vertical selection: weak ties, accessible verticals, repetitive workflows",
      "Customer discovery: open vs. closed, 5-whys",
      "The Mom Test framework",
      "Workflow mapping",
      "Scoping discipline",
      "AI-assisted prototype building",
      "Architecture decisions",
      "UI: Streamlit / Gradio / React",
      "Free hosting",
      "Demo recording",
      "Case study writing",
      "Code defense — line-by-line",
    ],
    primary: [],
    gapFill: ["mom-test", "streamlit", "gradio", "vercel", "railway", "huggingface-spaces", "loom", "anthropic-cases"],
    mvp: "Pick vertical, complete 3 discovery calls (not 5), build prototype that runs locally, 1-min demo. Skip deployment + formal case study.",
    done: "Live deployed prototype + 2-min demo + 1-page case study + can defend code line-by-line + 5+ documented discovery calls.",
    deliverable: "End of Stage 4: deployed prototype, 2-min demo, written case study, 5+ discovery call notes.",
    whyThisMatters: "FDE recruiters at Sierra/Decagon want to see you've actually shipped something with real users — not a tutorial. This is the project that replaces the AI-generated resume bullets you're not going to defend.",
    aiPrompts: [
      "Help me pick a vertical for my FDE prototype. My weak ties / accessible verticals are: [paste yours]. Find me 1 workflow that's repetitive enough to automate and small enough to ship in 6 weeks.",
      "I'm prepping discovery calls with a [vertical role]. Walk me through 5 Mom Test questions, then role-play one of the calls. Be a difficult, busy person.",
      "I shipped a working prototype but it feels embarrassing. Interview me on it for 5 minutes — toughest questions a Sierra FDE interviewer would ask. Then tell me what to fix before the call.",
    ],
  },
  {
    id: "stage-5",
    order: 5,
    title: "Customer Skills",
    weeks: "4–5 weeks (parallel with Stage 4)",
    weeksMin: 4,
    weeksMax: 5,
    tags: ["FDE", "SE"],
    concepts: [
      "Discovery questioning",
      "The Mom Test (counts double)",
      "Demo storytelling",
      "Technical writing: cold emails, follow-ups, case studies, decision memos",
      "Presenting to mixed audiences",
      "SE/FDE interview formats",
      "STAR framework drilled to automatic",
      "Amazon Leadership Principles (16)",
      "Microsoft cultural attributes",
      "Salesforce values",
      "Informational interview cadence",
    ],
    primary: [],
    gapFill: [
      "mom-test",
      "sinek-why",
      "r-salesengineers",
      "yt-se-demos",
      "amazon-lp",
      "microsoft-culture",
      "salesforce-v2mom",
      "pramp",
      "nwu-careers",
    ],
    mvp: "5 informational interviews (not 10), 5 STAR stories (not 15), Mom Test read.",
    done: "10+ informational interviews logged. 1 recorded mock discovery call. 1 recorded mock demo. 15 STAR stories. 5 LinkedIn posts.",
    deliverable: "End of Stage 5: STAR doc with 15 stories + Loom of one mock demo.",
    whyThisMatters: "FDE is 50% engineering, 50% customer. Most CS grads can't do the customer half — they freeze on a mock discovery call. This is the edge that hands you the offer at otherwise-equal candidates.",
    aiPrompts: [
      "Help me draft a STAR story about [recent project]. Then attack it as a tough Sierra FDE interviewer — find the holes.",
      "Quiz me on the 16 Amazon Leadership Principles. After each, ask me for a STAR story I'd use, then tell me if it actually fits the LP or not.",
      "Role-play a 5-minute discovery call. You're a non-technical ops manager at a mid-sized insurance company. I'm the FDE. Be skeptical of AI hype.",
    ],
  },
  {
    id: "stage-6",
    order: 6,
    title: "Cloud Certification",
    weeks: "4–6 weeks",
    weeksMin: 4,
    weeksMax: 6,
    tags: ["FDE", "SE"],
    concepts: [
      "Cloud fundamentals + AWS Global Infrastructure",
      "Core services: EC2, S3, RDS, Lambda, VPC, IAM",
      "Networking: VPC, subnets, security groups, NACLs",
      "Storage: S3 classes, EBS, EFS",
      "Databases: RDS, DynamoDB, Aurora, Redshift",
      "Compute: EC2, Lambda, ECS",
      "IAM: least privilege, assume-role",
      "Security: KMS, encryption",
      "Cost models",
      "Well-Architected Framework (6 pillars)",
    ],
    primary: ["udemy-ccp", "udemy-saa", "td-practice", "aws-exam-fees"],
    gapFill: ["aws-skill-builder", "exampro-yt", "aws-free-tier"],
    mvp: "AWS Cloud Practitioner only ($100). Skip SAA if time pressured — Cloud Practitioner alone is still a credential.",
    done: "Pass Cloud Practitioner (target end of August). Pass SAA (target end of September). Both visible on LinkedIn before applications peak.",
    deliverable: "End of Stage 6: AWS CCP badge added to LinkedIn. SAA if time allows.",
    whyThisMatters: "AWS cert isn't because cloud is the job — it's a credibility shortcut. Recruiters skim LinkedIn for 'AWS Cloud Practitioner' as a filter. $100, ~4 weeks, and you're past the algorithmic gate.",
    aiPrompts: [
      "Quiz me on AWS Cloud Practitioner: 5 questions across compute, storage, networking, IAM, and pricing. Then explain my wrong answers in plain English.",
      "Walk me through the 6 pillars of the Well-Architected Framework using a real example: a small SaaS app on AWS. Then ask me where it's weakest.",
      "I have $100 budget for the CCP exam and 4 weeks. Build me a study plan with daily checkpoints. Skip anything that won't be on the exam.",
    ],
  },
  {
    id: "stage-7",
    order: 7,
    title: "Interview Sprint",
    weeks: "4 weeks (October)",
    weeksMin: 4,
    weeksMax: 4,
    tags: ["FDE", "SE", "BIE"],
    concepts: [
      "Structured daily SQL/Python reps under pressure",
      "Case interview prep for SE roles",
      "STAR story refinement (record + tighten)",
      "Mock interviews",
      "Company-specific prep: Amazon LP, Microsoft cultural, Salesforce values",
      "Salary negotiation",
      "Compensation research",
      "Reference prep",
    ],
    primary: ["iq-sql", "iq-python", "iq-case"],
    gapFill: ["pramp", "exponent", "levels-fyi", "lewis-lin", "glassdoor-blind", "nwu-careers"],
    mvp: "Daily InterviewQuery for 30 days, 3 mocks (not 10), STAR stories memorized. Skip company-specific deep prep.",
    done: "10+ full mocks. 3 case studies practiced. Comfortable negotiating one offer.",
    deliverable: "October 31: ready to interview. Daily reps, 10 mocks, 3 case studies, scripts memorized.",
    whyThisMatters: "October is the month. Daily reps under pressure beat unstructured study by 5x. This is the stage where the work you've done in 1-6 either lands an offer or stays a hobby.",
    aiPrompts: [
      "Mock interview me as a Sierra FDE recruiter for 10 minutes — mix of technical, behavioral, and customer scenarios. Be tough. Then give me feedback on where I lost points.",
      "I have an offer at $X. Help me negotiate. Role-play the recruiter's pushback, then critique my responses. Don't soften it.",
      "Quiz me on Amazon Leadership Principles for 15 minutes. Force me to use a different STAR story for each LP. Catch repetition.",
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
  { date: "Aug 15", target: "5+ rolling FDE applications submitted" },
  { date: "Sep 1", target: "All cohort-based programs applied to" },
  { date: "Oct 1", target: "20+ applications total" },
  { date: "Nov 15", target: "25+ applications total" },
];

const GAP_RADAR_GATES = {
  fde: {
    title: "FDE Readiness",
    color: "amber",
    gates: [
      { id: "fde-vertical-agent", label: "Shipped 1 vertical AI agent" },
      { id: "fde-demo", label: "2-min demo recorded" },
      { id: "fde-discovery-5", label: "5+ customer discovery calls completed" },
      { id: "fde-ccp", label: "AWS Cloud Practitioner passed" },
      { id: "fde-cursor-30", label: "Daily Cursor or Claude Code use 30+ days" },
    ],
  },
  se: {
    title: "SE Rotational Program Readiness",
    color: "indigo",
    gates: [
      { id: "se-aws-techu", label: "Applied to AWS Tech U" },
      { id: "se-ms-aspire", label: "Applied to Microsoft Aspire" },
      { id: "se-sf-futureforce", label: "Applied to Salesforce Futureforce" },
      { id: "se-oracle", label: "Applied to Oracle Class Of" },
      { id: "se-cisco", label: "Applied to Cisco CSAP" },
      { id: "se-ibm", label: "Applied to IBM Consulting" },
      { id: "se-stars-15", label: "15 STAR stories prepped" },
      { id: "se-amazon-lp", label: "2 stories per Amazon LP (16 LPs × 2)" },
    ],
  },
  bie: {
    title: "BIE Fallback Readiness",
    color: "stone",
    gates: [
      { id: "bie-sql-50", label: "50 SQL questions solved" },
      { id: "bie-pandas", label: "pandas project shipped" },
      { id: "bie-api-script", label: "Python+API script deployed" },
      { id: "bie-dashboard", label: "Tableau or Power BI dashboard published" },
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
  };
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

function Today({ state, currentStage, calendar, isTrackLocked, onOpenTrack, onCheckIn, onSetMode, onToggleCheck, onShipMVP, onUnshipMVP, onShiftCalendar, onResetCalendarShift }) {
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

  return (
    <div className="space-y-5 fade-up">
      <CountdownStrip days={daysToPeak} targetISO={APPLICATION_PEAK_DATE} />

      <TrackLockBanner state={state} isTrackLocked={isTrackLocked} onOpen={onOpenTrack} />

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

      <CurrentStagePanel state={state} stage={currentStage} calendar={calendar} onShipMVP={onShipMVP} onUnshipMVP={onUnshipMVP} onShiftCalendar={onShiftCalendar} onResetCalendarShift={onResetCalendarShift} />

      <AskClaudeCard stage={currentStage} />

      <SprintTargetsRow />

      <SectionCard title="The Rule" dark>
        <p className="text-sm leading-relaxed">
          Type every line yourself. AI answers questions. AI does not write code.{" "}
          <span className="font-semibold">Copilot OFF.</span>
        </p>
      </SectionCard>
    </div>
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

function CareerHQ({ state, onSetApplicationStatus, onAddArtifact, onRemoveArtifact, onSetGate }) {
  return (
    <div className="space-y-6">
      <ApplicationTimeline state={state} onSetStatus={onSetApplicationStatus} />
      <GapRadar state={state} onSetGate={onSetGate} />
      <ArtifactWall state={state} onAdd={onAddArtifact} onRemove={onRemoveArtifact} />
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
            Switching to <strong>{otherTrack.short}</strong> means re-routing {state.track === "fde-se" ? "AI Engineering, Vertical Project, Customer Skills, and Cloud Cert work" : "BIE-tagged Stage 7 prep"}. Estimate ~{Math.max(2, weeksInvested - 2)} weeks of equivalent work before reaching the same readiness.
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
