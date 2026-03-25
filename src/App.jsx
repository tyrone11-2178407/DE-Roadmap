import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Bot,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock3,
  Download,
  FileText,
  Flame,
  Hammer,
  Lock,
  Map,
  MessageSquare,
  Plus,
  Play,
  Radar,
  RotateCcw,
  Send,
  Sparkles,
  Star,
  Swords,
  Target,
  Trophy,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";

const LEVELS = [
  { level: 1, title: "Raw Recruit", xp: 0 },
  { level: 2, title: "Data Curious", xp: 180 },
  { level: 3, title: "Query Crafter", xp: 420 },
  { level: 4, title: "Analyst Ready ✦", xp: 780, milestone: true },
  { level: 5, title: "Dashboard Builder", xp: 1180 },
  { level: 6, title: "BIE Core ✦", xp: 1680, milestone: true },
  { level: 7, title: "Pipeline Apprentice", xp: 2320 },
  { level: 8, title: "Pipeline Ready ✦", xp: 3100, milestone: true },
  { level: 9, title: "Interview Operator", xp: 4020 },
  { level: 10, title: "Hireable Builder ✦", xp: 5100, milestone: true },
];

const RESOURCE_RULE = "Watch or read for max 15 minutes. Then close it. Build what you just saw. Come back only if stuck.";
const CONFIDENCE_OPTIONS = [
  { id: "shaky", label: "Shaky" },
  { id: "okay", label: "Okay" },
  { id: "solid", label: "Solid" },
];

const COMPANY_BENCHMARKS = [
  {
    id: "sql",
    title: "SQL",
    expectation: "Window functions, CTEs, joins, aggregations, and business reasoning under pressure.",
  },
  {
    id: "excel",
    title: "Excel / Sheets",
    expectation: "Fast slicing, KPI thinking, and clear communication of trends.",
  },
  {
    id: "python",
    title: "Python",
    expectation: "Comfort pulling, cleaning, reshaping, and validating data with scripts.",
  },
  {
    id: "dashboards",
    title: "Dashboards",
    expectation: "Build decision-ready views, not only pretty charts.",
  },
  {
    id: "modeling",
    title: "Data Modeling",
    expectation: "Stage, mart, tests, and naming that signal analytics engineering maturity.",
  },
  {
    id: "pipelines",
    title: "Pipelines / ETL",
    expectation: "Ingest, schedule, monitor, and explain where things can break.",
  },
  {
    id: "testing",
    title: "Testing & Docs",
    expectation: "Not-null, uniqueness, README clarity, and business-safe delivery habits.",
  },
  {
    id: "stats",
    title: "Stats Basics",
    expectation: "Rolling averages, significance intuition, and metric tradeoff awareness.",
  },
  {
    id: "storytelling",
    title: "Business Storytelling",
    expectation: "Explain what changed, why it matters, and what decision follows.",
  },
  {
    id: "interview",
    title: "Interview Readiness",
    expectation: "Take-homes, behavioral stories, project walkthroughs, and confident demos.",
  },
];

const BADGES = [
  { id: "firstScript", icon: "🌱", name: "First Script", hint: "Complete Stage 1 checkpoint mastery." },
  { id: "queryCrafter", icon: "🔍", name: "Query Crafter", hint: "Reach interviewable SQL strength." },
  { id: "analystUnlocked", icon: "⚔", name: "Analyst Unlocked", hint: "Defeat the Stage 1 boss." },
  { id: "modelBuilder", icon: "🏗", name: "Model Builder", hint: "Ship your first dbt-style mart." },
  { id: "biUnlocked", icon: "⚔", name: "BI Engineer Unlocked", hint: "Defeat the Stage 2 boss." },
  { id: "cloudNative", icon: "☁", name: "Cloud Native", hint: "Log your first BigQuery load." },
  { id: "dataEngineerUnlocked", icon: "⚔", name: "Data Engineer Unlocked", hint: "Defeat the Stage 3 boss." },
  { id: "aiLeverage", icon: "🤖", name: "AI Leverage", hint: "Ship the light AI feature in Stage 4." },
  { id: "onFire", icon: "🔥", name: "On Fire", hint: "Reach a 7-day streak." },
  { id: "reignited", icon: "🔄", name: "Reignited", hint: "Come back from a broken streak." },
  { id: "shipped", icon: "📦", name: "Shipped", hint: "Finish your first full project." },
  { id: "hireReady", icon: "🎯", name: "Hire-Ready", hint: "Finish the core Career HQ checklist." },
  { id: "storyteller", icon: "📝", name: "Storyteller", hint: "Publish or draft a project write-up." },
  { id: "firstMock", icon: "🎙", name: "First Mock", hint: "Complete a mock interview." },
  { id: "resumeShipped", icon: "📄", name: "Resume Shipped", hint: "Update the resume checkpoint." },
  { id: "appSprint", icon: "🚀", name: "Application Sprint", hint: "Submit three targeted applications." },
  { id: "fullStack", icon: "🧭", name: "Full Stack", hint: "Finish a primary project in both tracks." },
  { id: "questComplete", icon: "🏆", name: "Quest Complete", hint: "Reach Day 90 with major systems shipped." },
];

const STORAGE_KEY = "data-engineer-quest-v1";

const CAREER_CHECKLIST = [
  { id: "linkedin", title: "LinkedIn headline updated", detail: "Data / BI / Analytics positioning in one line." },
  { id: "resume", title: "Resume rewritten around projects", detail: "One bullet per shipped proof, not just coursework." },
  { id: "github", title: "GitHub profile cleaned up", detail: "Pinned repos and clear README narrative." },
  { id: "projectReadme", title: "Primary TFT README polished", detail: "Architecture, business context, and what you learned." },
  { id: "story", title: "One public write-up drafted", detail: "Medium, Notion, or LinkedIn post with outcomes." },
  { id: "outreach", title: "First working data person contacted", detail: "Short, respectful message and one follow-up." },
  { id: "mock", title: "One mock interview completed", detail: "Technical plus project storytelling." },
  { id: "targetList", title: "Target roles list updated", detail: "Keep the pipeline current because deadlines and postings move." },
];

const INITIAL_TARGET_ROLES = [
  { id: "target-large-tech", company: "Large tech", role: "BIE / BI intern", track: "Enterprise BI" },
  { id: "target-fintech", company: "Fintech", role: "Product / data analyst intern", track: "Product analytics" },
  { id: "target-mid-tech", company: "Mid-size tech", role: "Analytics engineer / analyst", track: "Growth analytics" },
];

const APPLICATION_STATUSES = ["planned", "drafting", "applied", "screen", "interview", "closed"];

const OUTREACH_LOGS = [
  { id: "outreach-1", title: "Sent a short intro DM to a data professional", xp: 20 },
  { id: "outreach-2", title: "Followed up with one contact respectfully", xp: 20 },
  { id: "outreach-3", title: "Asked for feedback on one project or resume", xp: 20 },
  { id: "outreach-4", title: "Posted a progress update publicly", xp: 20 },
];

const INTERVIEW_ARENA = [
  {
    id: "sql-drill",
    title: "SQL Drill",
    detail: "Solve a timed SQL prompt and explain your approach out loud.",
    xp: 35,
    prompts: [
      "Which feature drove the largest week-over-week lift in activation for new users, and which segment benefited most? Write the query, then explain each CTE out loud in plain English.",
      "Which region had the highest retention gain after a pricing change, and which cohort moved the metric most? Write the query and explain the business meaning.",
      "Which signup source creates the highest 7-day conversion rate, and how would you show the difference clearly in SQL?",
    ],
    resource: {
      name: "SQLZoo + your own notes",
      where: "https://sqlzoo.net/",
      url: "https://sqlzoo.net/",
      format: "interactive + timed rep",
      cost: "Free",
    },
    evidence: "Paste the query, your timer, and a 3-sentence explanation of your logic.",
    rubric: [
      "The query answers the business question cleanly.",
      "You can explain each step without hiding behind syntax.",
      "You can name one check that would catch a wrong result.",
    ],
  },
  {
    id: "dashboard-walkthrough",
    title: "Dashboard Walkthrough",
    detail: "Talk through one dashboard as if a PM asked what changed and why.",
    xp: 35,
    prompts: [
      "Pretend a hiring manager opens your dashboard and asks: 'What changed, why does it matter, and what would you do next?' Answer in under 90 seconds.",
      "A product lead asks: 'If I only remember one thing from this dashboard, what should it be?' Give a 60-second answer.",
      "A recruiter asks: 'Why did you choose these views and not three different charts?' Walk through the logic.",
    ],
    resource: {
      name: "Your own dashboard + in-app prompt",
      where: "Inside Data Engineer Quest",
      url: null,
      format: "guided walkthrough",
      cost: "Free",
    },
    evidence: "Record a voice note or write the 90-second script you would use.",
    rubric: [
      "You lead with the business question, not chart descriptions.",
      "You state one insight, one reason, and one action.",
      "You avoid filler and unsupported claims.",
    ],
  },
  {
    id: "behavioral-story",
    title: "Behavioral Story",
    detail: "Draft one STAR answer from your portfolio work.",
    xp: 35,
    prompts: [
      "Use one project moment where something broke, changed, or got clarified. Write a STAR answer that sounds like you, not a template robot.",
      "Describe a time you had incomplete data but still had to move the work forward responsibly.",
      "Describe a time you simplified something complicated so another person could actually use it.",
    ],
    resource: {
      name: "In-app STAR scaffold",
      where: "Inside Data Engineer Quest",
      url: null,
      format: "guided writing",
      cost: "Free",
    },
    evidence: "Write 6-10 bullet points covering situation, task, action, and result.",
    rubric: [
      "The story has a clear problem and decision point.",
      "Your actions are specific and technical enough to be believable.",
      "The result sounds measurable or useful, not vague.",
    ],
  },
  {
    id: "take-home-sim",
    title: "Take-Home Simulation",
    detail: "Run a take-home style session with a timebox and delivery notes.",
    xp: 50,
    prompts: [
      "Set a 90-minute timer. Clean a small dataset, answer one business question, and end with a short takeaway memo.",
      "Set a 60-minute timer. Build one SQL answer plus one chart and explain what someone should do next.",
      "Set a 90-minute timer. Recreate a mini analyst take-home: clean, analyze, summarize, and note one limitation.",
    ],
    resource: {
      name: "Your Stage project data + timer",
      where: "Inside your project workspace",
      url: null,
      format: "timed simulation",
      cost: "Free",
    },
    evidence: "Submit the query or notebook, one chart, and a 3-sentence recommendation.",
    rubric: [
      "You finish something coherent within the timebox.",
      "The output includes both technical work and business explanation.",
      "You document one thing you would improve with more time.",
    ],
  },
  {
    id: "boss-demo",
    title: "Project Demo",
    detail: "Record or rehearse a 3-minute project walkthrough.",
    xp: 35,
    prompts: [
      "Explain one project in 3 minutes using this order: question, data, transformation, output, trust checks, what you learned.",
      "Give the calm walkthrough version: what the project is, what it shows, what was hard, and why it matters.",
      "Explain one project to a non-technical recruiter who needs to know whether the work is real and useful.",
    ],
    resource: {
      name: "Your README + project board",
      where: "Inside Data Engineer Quest",
      url: null,
      format: "guided demo rep",
      cost: "Free",
    },
    evidence: "Write your demo outline or record a short rehearsal.",
    rubric: [
      "The story is easy to follow even for a non-technical listener.",
      "You explain why the pipeline or model can be trusted.",
      "You end with a clear hiring-relevant takeaway.",
    ],
  },
  {
    id: "stakeholder-explain",
    title: "Stakeholder Explain",
    detail: "Explain one technical concept in plain business language.",
    xp: 35,
    prompts: [
      "Explain one of these in plain language: CTE, mart, dbt test, Airflow DAG, or schema drift. Assume your listener is smart but non-technical.",
      "Explain why a dashboard can look polished but still be wrong if the table behind it is messy.",
      "Explain why reliable data matters more than fast charts when someone is making a real business decision.",
    ],
    resource: {
      name: "In-app explanation prompt",
      where: "Inside Data Engineer Quest",
      url: null,
      format: "prompt + self-review",
      cost: "Free",
    },
    evidence: "Write 3-5 sentences or record a 45-second explanation.",
    rubric: [
      "No jargon without translation.",
      "The explanation ends with why the business should care.",
      "Someone outside data could repeat the main idea back to you.",
    ],
  },
];

const CHECKPOINT_TEMPLATES = {
  "stage1-python-csv": {
    title: "Python CSV Muscle",
    concept: "Read, filter, and write structured data without panic.",
    skillTargets: ["python", "storytelling"],
    requiredPasses: 2,
    passesLabel: "variation passes",
    datasets: ["TFT comp stats", "subscription churn rows", "fintech transactions"],
    businessQuestions: [
      "filter to the rows that matter and export a smaller file for analysis",
      "identify the highest-risk slice and save only that segment",
      "create a cleaned subset for a teammate who only needs one audience",
    ],
    constraints: ["No Googling syntax after the first 5 minutes.", "Narrate each step in plain English.", "Add one lightweight sanity check before export."],
  },
  "stage1-api-json": {
    title: "API To JSON Confidence",
    concept: "Pull external data, save it cleanly, and explain what you captured.",
    skillTargets: ["python", "testing", "storytelling"],
    requiredPasses: 2,
    passesLabel: "variation passes",
    datasets: ["Open-Meteo weather data", "mock product metrics JSON", "simple exchange-rate response"],
    businessQuestions: [
      "save a clean JSON snapshot and calculate one useful summary",
      "compare two slices of the payload and explain the difference",
      "create a teammate-friendly summary that could feed a dashboard later",
    ],
    constraints: ["Print one average and one sanity-check count.", "Rename confusing keys into human language.", "Explain what would break if the response shape changed."],
  },
  "stage1-sql-window": {
    title: "SQL CTE + Window Thinking",
    concept: "Answer a real business question with layered SQL logic.",
    skillTargets: ["sql", "stats", "storytelling"],
    requiredPasses: 2,
    passesLabel: "variation passes",
    datasets: ["TFT augment performance", "e-commerce orders", "weekly user retention"],
    businessQuestions: [
      "rank the strongest segment over time and explain why the ranking matters",
      "compare performance before and after a change event",
      "identify the top entity in each group using a window function",
    ],
    constraints: ["No syntax lookup after you start writing.", "Add one plain-English comment per CTE.", "End with one decision recommendation."],
  },
  "stage2-dbt-staging": {
    title: "Staging Layer Sense",
    concept: "Clean raw data into trusted building blocks.",
    skillTargets: ["modeling", "testing", "python"],
    requiredPasses: 2,
    passesLabel: "variation passes",
    datasets: ["Riot API match payload", "funnel event table", "card transaction logs"],
    businessQuestions: [
      "rename messy fields into analysis-friendly names",
      "cast raw fields into stable types and drop noise",
      "prepare the layer a dashboard analyst would trust",
    ],
    constraints: ["Add two tests.", "Document one business-safe naming decision.", "Note one source of schema drift risk."],
  },
  "stage2-mart-story": {
    title: "Business-Ready Mart",
    concept: "Turn cleaned data into a table people can actually use.",
    skillTargets: ["modeling", "dashboards", "storytelling"],
    requiredPasses: 2,
    passesLabel: "variation passes",
    datasets: ["augment win rates by patch", "activation funnel conversion", "merchant revenue by segment"],
    businessQuestions: [
      "build a mart that answers one recurring stakeholder question",
      "define the grain clearly and keep only decision-ready fields",
      "design a table that feeds a dashboard with minimal extra cleanup",
    ],
    constraints: ["Describe the mart in business language.", "Name one dashboard tile this mart supports.", "Add a short README note on trust and freshness."],
  },
  "stage2-sql-explain": {
    title: "Multi-Step SQL Explain",
    concept: "Solve a harder query and prove you understand it.",
    skillTargets: ["sql", "storytelling", "interview"],
    requiredPasses: 2,
    passesLabel: "variation passes",
    datasets: ["LTV by cohort", "patch impact by comp", "weekly regional sales"],
    businessQuestions: [
      "use multiple CTEs to make the logic obvious",
      "explain each layer to a non-technical stakeholder",
      "show which metric moved and which team should care",
    ],
    constraints: ["Comment each CTE.", "Explain tradeoffs in 3 sentences.", "Present the answer like an interview whiteboard wrap-up."],
  },
  "stage3-airflow": {
    title: "Daily Pipeline Operator",
    concept: "Automate a repeatable pull without silent chaos.",
    skillTargets: ["pipelines", "python", "testing"],
    requiredPasses: 2,
    passesLabel: "variation passes",
    datasets: ["TFT daily match pull", "product events snapshot", "music momentum refresh"],
    businessQuestions: [
      "schedule the ingestion and prove it runs without errors",
      "log enough detail so a future-you can debug it",
      "show what happens when the source response changes",
    ],
    constraints: ["Add one failure-aware note.", "Log row counts or file size.", "Describe the alert you would want next."],
  },
  "stage3-bigquery": {
    title: "Warehouse Delivery",
    concept: "Move raw data into a queryable warehouse layer.",
    skillTargets: ["pipelines", "python", "sql", "cloudNative"],
    requiredPasses: 2,
    passesLabel: "variation passes",
    datasets: ["raw JSON response", "daily CSV export", "scored trend feed"],
    businessQuestions: [
      "load the raw layer cleanly and answer one business question",
      "show how you would partition or organize the table",
      "document what the downstream analyst can trust",
    ],
    constraints: ["Write one verification query.", "Name one cost or reliability tradeoff.", "Add one README line about assumptions."],
  },
  "stage3-docker": {
    title: "Runs On A Clean Machine",
    concept: "Package the workflow so it works beyond your laptop mood.",
    skillTargets: ["pipelines", "testing", "interview"],
    requiredPasses: 2,
    passesLabel: "variation passes",
    datasets: ["ingest -> store -> transform -> query", "scheduled pull -> load -> report", "extract -> validate -> publish"],
    businessQuestions: [
      "run the flow end to end in a repeatable environment",
      "document the exact steps another person needs",
      "show where the weak points are and how you would harden them",
    ],
    constraints: ["Write a README runbook.", "Add one health-check note.", "Explain it in CTO-friendly language."],
  },
  "stage4-hiring-demo": {
    title: "AI Workflow Review",
    concept: "Use AI to speed up analyst work without trusting it blindly.",
    skillTargets: ["interview", "storytelling", "dashboards"],
    requiredPasses: 2,
    passesLabel: "variation passes",
    datasets: ["SQL explanation draft", "dashboard commentary draft", "stakeholder summary draft"],
    businessQuestions: [
      "use AI to explain a query, then rewrite the explanation in your own words",
      "use AI to draft dashboard commentary, then fix what is vague or wrong",
      "use AI to summarize a finding for a stakeholder, then tighten the business recommendation",
    ],
    constraints: ["Name one thing the AI got wrong.", "Keep the final answer grounded in the actual data.", "End with one human correction you made."],
  },
  "stage4-ai-leverage": {
    title: "AI Tools for Analysts",
    concept: "Practice analyst productivity workflows with AI instead of building AI apps.",
    skillTargets: ["interview", "storytelling", "testing"],
    requiredPasses: 2,
    passesLabel: "variation passes",
    datasets: ["AI-assisted SQL rewrite", "AI-generated dashboard narrative", "AI-generated error check list"],
    businessQuestions: [
      "improve a working query with AI and verify every change manually",
      "generate a stakeholder-ready summary with AI and edit it into your own voice",
      "ask AI to review an analysis for mistakes and keep only the checks that actually help",
    ],
    constraints: ["Do not use AI without checking output against source material.", "State one workflow where AI saved time.", "State one workflow where human review mattered more."],
  },
};

const STAGES = [
  {
    id: "stage1",
    number: 1,
    title: "Data Analyst Core",
    shortTitle: "DA / BA / PA",
    icon: "🌿",
    weekRange: "Weeks 1–3",
    dayRange: [1, 21],
    hireableAs: "Hireable as: Early Data Analyst / Product Analyst / Business Analyst intern",
    hook:
      "This stage is about becoming dangerous with the fundamentals. Top internships now expect more than curiosity, so this phase builds the proof that you can clean data, answer business questions, and explain what matters.",
    resources: [
      {
        concept: "Python foundations",
        whyThisMatters: "Junior analyst roles still expect you to automate small data tasks without panic.",
        learnFrom: {
          name: "CS50P by Harvard",
          where: "https://cs50.harvard.edu/python/",
          url: "https://cs50.harvard.edu/python/",
          format: "video + problem set",
          cost: "Free",
          timeToday: "15–30 min",
          whyThisOne: "Weekly exercises force active use immediately.",
        },
        doThisNow: "Rebuild one example from memory, then change one input and rerun it.",
        evidenceToSubmit: "Screenshot or pasted output of your modified script.",
        optionalBackup: {
          name: "freeCodeCamp Scientific Computing with Python",
          where: "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
          url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
          format: "interactive",
          cost: "Free",
        },
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Python functions and return values",
        whyThisMatters: "Analyst scripting gets much easier once you can package logic into small functions instead of rewriting everything.",
        learnFrom: {
          name: "CS50P by Harvard",
          where: "https://cs50.harvard.edu/python/",
          url: "https://cs50.harvard.edu/python/",
          format: "video + problem set",
          cost: "Free",
          timeToday: "15–30 min",
          whyThisOne: "It keeps you inside the same Python spine long enough to make small reusable logic feel normal before you switch tools.",
        },
        doThisNow: "Turn your first tiny script into one function with a return value, then run it with two different inputs.",
        evidenceToSubmit: "Working function plus one sentence on what the returned value represents.",
        optionalBackup: {
          name: "freeCodeCamp Scientific Computing with Python",
          where: "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
          url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
          format: "interactive",
          cost: "Free",
        },
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Python loops and reusable scripts",
        whyThisMatters: "Before pandas feels useful, you need enough Python control flow to make tiny scripts reusable instead of one-off hacks.",
        learnFrom: {
          name: "CS50P by Harvard",
          where: "https://cs50.harvard.edu/python/",
          url: "https://cs50.harvard.edu/python/",
          format: "video + problem set",
          cost: "Free",
          timeToday: "15–30 min",
          whyThisOne: "It keeps you inside the same Python spine long enough to make loops and repeated logic feel normal before you switch tools.",
        },
        doThisNow: "Add one loop to your script, wrap the repeated logic in a small helper, and save a cleaner output than the first version.",
        evidenceToSubmit: "Working script plus one sentence on what became reusable.",
        optionalBackup: {
          name: "freeCodeCamp Scientific Computing with Python",
          where: "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
          url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
          format: "interactive",
          cost: "Free",
        },
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Python file handling prep",
        whyThisMatters: "A beginner analyst does not need deep Python breadth, but you do need to feel steady opening a file, shaping rows, and saving a result.",
        learnFrom: {
          name: "CS50P by Harvard",
          where: "https://cs50.harvard.edu/python/",
          url: "https://cs50.harvard.edu/python/",
          format: "video + problem set",
          cost: "Free",
          timeToday: "15–30 min",
          whyThisOne: "This is the handoff slice that makes pandas feel like a natural next tool instead of a sudden jump.",
        },
        doThisNow: "Read a tiny CSV or text file, keep only the rows you need, and save a smaller output file.",
        evidenceToSubmit: "Input preview, output preview, and one sentence on what changed.",
        optionalBackup: {
          name: "freeCodeCamp Scientific Computing with Python",
          where: "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
          url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/",
          format: "interactive",
          cost: "Free",
        },
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Pandas / data manipulation",
        whyThisMatters: "Cleaning rows, renaming fields, and filtering slices is everyday analyst work.",
        learnFrom: {
          name: "Kaggle Learn — Pandas",
          where: "https://www.kaggle.com/learn/pandas",
          url: "https://www.kaggle.com/learn/pandas",
          format: "interactive",
          cost: "Free with account",
          timeToday: "15–30 min",
          whyThisOne: "Every lesson ends with a browser-based exercise.",
        },
        doThisNow: "Complete one lesson and one exercise, then reproduce the same transformation on your own small CSV.",
        evidenceToSubmit: "Notebook screenshot or exported cleaned CSV preview.",
        optionalBackup: {
          name: "Corey Schafer Pandas playlist",
          where: "https://www.youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS",
          url: "https://www.youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS",
          format: "video + exercise",
          cost: "Free",
        },
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "SQL fundamentals",
        whyThisMatters: "SQL is the most universal hiring filter for DA / BI / BIE roles.",
        learnFrom: {
          name: "SQLZoo",
          where: "https://sqlzoo.net/",
          url: "https://sqlzoo.net/",
          format: "interactive",
          cost: "Free",
          timeToday: "15–30 min",
          whyThisOne: "True beginner interactivity starts from the first query.",
        },
        doThisNow: "Finish one SQLZoo lesson, then solve 3 queries without copying the previous answer.",
        evidenceToSubmit: "Screenshot of the completed lesson or 3 solved queries.",
        optionalBackup: {
          name: "SQL Murder Mystery",
          where: "https://mystery.knightlab.com/",
          url: "https://mystery.knightlab.com/",
          format: "interactive puzzle",
          cost: "Free",
        },
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Intermediate SQL practice",
        whyThisMatters: "After fundamentals, you need repetition on business-style prompts.",
        learnFrom: {
          name: "DataLemur",
          where: "https://datalemur.com/",
          url: "https://datalemur.com/",
          format: "interactive practice",
          cost: "Free",
          timeToday: "15–30 min",
          whyThisOne: "Good for skill reps after the teaching part is done.",
        },
        doThisNow: "Solve 2 easy or medium problems and explain the business question each one answers.",
        evidenceToSubmit: "Query text plus a 2-sentence explanation.",
        optionalBackup: null,
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Spreadsheets / Excel basics",
        whyThisMatters: "You only need enough spreadsheet skill to survive common analyst workflows.",
        learnFrom: {
          name: "Spreadsheet survival checklist",
          where: "Inside Data Engineer Quest",
          url: null,
          format: "in-app guide + quick exercise",
          cost: "Free",
          timeToday: "15–20 min",
          whyThisOne: "Keeps formulas, pivot tables, and charts useful without becoming a time sink.",
        },
        doThisNow: "Build one pivot table and one simple formula-based summary.",
        evidenceToSubmit: "Screenshot of your pivot table and chart.",
        optionalBackup: null,
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Dashboarding",
        whyThisMatters: "You need to turn analysis into a view someone can actually use.",
        learnFrom: {
          name: "Microsoft Learn Power BI quickstart",
          where: "https://learn.microsoft.com/en-us/power-bi/fundamentals/",
          url: "https://learn.microsoft.com/en-us/power-bi/fundamentals/",
          format: "official quickstart + build",
          cost: "Free with student access if eligible",
          timeToday: "20–30 min",
          whyThisOne: "Power BI is the safest default for enterprise-style analyst hiring and still gives fast hands-on feedback.",
        },
        doThisNow: "Build one report page answering one question a manager could actually care about, with one KPI card and one chart.",
        evidenceToSubmit: "Report screenshot showing the KPI, chart, and the question it answers.",
        optionalBackup: {
          name: "Looker Studio quickstart",
          where: "https://lookerstudio.google.com/",
          url: "https://lookerstudio.google.com/",
          format: "quickstart + build",
          cost: "Free",
        },
        ruleText: RESOURCE_RULE,
      },
    ],
    checkpointIds: ["stage1-python-csv", "stage1-api-json", "stage1-sql-window"],
    boss: {
      name: "The Analyst Audit",
      technical:
        "Pull a real dataset, clean it, answer one business question in SQL, and export a tidy output. No tutorial tab open once you begin.",
      explain:
        "Explain what you built to a product manager who only cares what decision becomes easier.",
      business:
        "State what action a team should take differently because of your output.",
      reward: "+150 XP + Analyst Unlocked badge + Stage 2 confidence",
    },
  },
  {
    id: "stage2",
    number: 2,
    title: "BI / Analytics Engineering Core",
    shortTitle: "BI / BIE / AE",
    icon: "🪴",
    weekRange: "Weeks 4–6",
    dayRange: [22, 42],
    hireableAs: "Hireable as: BI Analyst / Business Intelligence Engineer / Analytics Engineer intern",
    hook:
      "This stage is shared-core training for BI Analysts, Business Intelligence Engineers, and Analytics Engineers. You learn the overlap first: how raw data becomes business-ready tables, how dbt supports that workflow, and how one dashboard tool turns those tables into decisions.",
    resourceInstruction:
      "Industry-standard default: Power BI for enterprise BI hiring. Pick exactly ONE primary dashboard tool for Stage 2. Use Tableau if you want a stronger portfolio showcase, and use Looker Studio only if speed matters more than standardization.",
    resources: [
      {
        concept: "Raw vs staging vs marts",
        whyThisMatters: "Junior BI and analytics engineering work starts with understanding how messy source data becomes something the business can trust.",
        learnFrom: {
          name: "Built-in visual lesson",
          where: "Inside Data Engineer Quest",
          url: null,
          format: "in-app visual lesson",
          cost: "Free",
          timeToday: "10–15 min",
          whyThisOne: "It explains the pipeline in beginner-safe language before you touch dbt.",
        },
        doThisNow: "Draw one example of raw data, the staging version, and the final mart in your notes.",
        evidenceToSubmit: "Screenshot of your sketch or typed 3-step explanation.",
        optionalBackup: null,
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Star schema basics",
        whyThisMatters: "Understanding facts and dimensions helps you build dashboard-friendly data instead of one-off queries.",
        learnFrom: {
          name: "Built-in visual lesson",
          where: "Inside Data Engineer Quest",
          url: null,
          format: "in-app visual lesson",
          cost: "Free",
          timeToday: "10–15 min",
          whyThisOne: "The app can teach this faster and more clearly than abstract reading for beginners.",
        },
        doThisNow: "List one fact table and two dimension tables for your project idea.",
        evidenceToSubmit: "Screenshot or pasted schema sketch.",
        optionalBackup: null,
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Why dbt exists",
        whyThisMatters: "dbt is one of the clearest junior-level signals that you understand trusted analytics workflows.",
        learnFrom: {
          name: "Built-in visual lesson",
          where: "Inside Data Engineer Quest",
          url: null,
          format: "in-app visual lesson",
          cost: "Free",
          timeToday: "10–15 min",
          whyThisOne: "It explains the business reason for dbt before you open the tool.",
        },
        doThisNow: "Write 3 sentences on why a team would prefer dbt models over repeated ad-hoc SQL.",
        evidenceToSubmit: "Short written explanation in your own words.",
        optionalBackup: null,
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Business-ready tables for dashboards",
        whyThisMatters: "The job is not just writing SQL; it is preparing tables that make reporting stable and easy to use.",
        learnFrom: {
          name: "Built-in visual lesson",
          where: "Inside Data Engineer Quest",
          url: null,
          format: "in-app visual lesson",
          cost: "Free",
          timeToday: "10–15 min",
          whyThisOne: "It frames analytics engineering in terms the business and hiring managers actually care about.",
        },
        doThisNow: "Define the grain, metric, and dimensions for one business-ready table.",
        evidenceToSubmit: "Your one-table definition in notes or markdown.",
        optionalBackup: null,
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "dbt fundamentals",
        whyThisMatters: "This is the shared-core skill for BI, BIE, and Analytics Engineer roles at the junior level.",
        learnFrom: {
          name: "dbt Learn — dbt Fundamentals",
          where: "https://learn.getdbt.com",
          url: "https://learn.getdbt.com",
          format: "interactive",
          cost: "Free",
          timeToday: "20–40 min",
          whyThisOne: "It is browser-based and requires doing real dbt work instead of only reading definitions.",
        },
        doThisNow: "Complete one dbt Fundamentals module and recreate the same model naming pattern in your own project notes.",
        evidenceToSubmit: "Screenshot of the completed module plus your model sketch.",
        optionalBackup: {
          name: "dbt Developer Quickstart",
          where: "https://docs.getdbt.com/guides",
          url: "https://docs.getdbt.com/guides",
          format: "quickstart reference",
          cost: "Free",
        },
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Business-facing SQL and marts",
        whyThisMatters: "Junior BI and AE work is mostly about shaping data for business questions, not only solving isolated interview prompts.",
        learnFrom: {
          name: "DataLemur medium + in-app mart prompts",
          where: "https://datalemur.com/",
          url: "https://datalemur.com/",
          format: "practice + in-app lab",
          cost: "Free",
          timeToday: "20–40 min",
          whyThisOne: "It teaches the overlap between analyst SQL and analytics engineering by forcing you to define grain and business meaning.",
        },
        doThisNow: "Write one staging query and one mart-style summary query for the same business question.",
        evidenceToSubmit: "Both queries plus a 2-sentence grain definition.",
        optionalBackup: null,
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Dashboard tool track — Recommended default: Power BI",
        whyThisMatters: "Power BI shows up often in enterprise BI roles and makes your work legible to hiring managers.",
        learnFrom: {
          name: "Microsoft Learn Power BI fundamentals",
          where: "https://learn.microsoft.com/en-us/power-bi/fundamentals/",
          url: "https://learn.microsoft.com/en-us/power-bi/fundamentals/",
          format: "official quickstart + build",
          cost: "Free with student access if eligible",
          timeToday: "20–40 min",
          whyThisOne: "It is a strong enterprise-facing option and maps cleanly to many BI job postings.",
        },
        doThisNow: "Build one simple report page using a sample dataset and label the KPI, filter, and chart that matter most.",
        evidenceToSubmit: "Screenshot of the report page.",
        optionalBackup: {
          name: "Power BI Desktop getting started",
          where: "https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-getting-started",
          url: "https://learn.microsoft.com/en-us/power-bi/fundamentals/desktop-getting-started",
          format: "official quickstart",
          cost: "Free",
        },
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Dashboard tool track — Tableau",
        whyThisMatters: "Tableau is still strong for portfolio visibility and common analyst workflows.",
        learnFrom: {
          name: "Tableau for Students",
          where: "https://www.tableau.com/academic/students",
          url: "https://www.tableau.com/academic/students",
          format: "student program + guided training videos",
          cost: "Free with student email or student license if eligible",
          timeToday: "20–40 min",
          whyThisOne: "It gives you legitimate student access and a clear portfolio-friendly dashboard path.",
        },
        doThisNow: "Build one worksheet and one dashboard that answer a single business question.",
        evidenceToSubmit: "Screenshot of the worksheet and dashboard.",
        optionalBackup: {
          name: "Tableau Public note",
          where: "Tableau Public is fine for learning and portfolio work, but not commercial use.",
          url: null,
          format: "usage note",
          cost: "Free",
        },
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Dashboard tool track — Looker Studio",
        whyThisMatters: "Looker Studio is the fastest way to get a live, shareable BI artifact into your portfolio.",
        learnFrom: {
          name: "Looker Studio quickstart",
          where: "https://lookerstudio.google.com/",
          url: "https://lookerstudio.google.com/",
          format: "quickstart + build",
          cost: "Free",
          timeToday: "20–30 min",
          whyThisOne: "It is the quickest route to a public dashboard you can actually show recruiters.",
        },
        doThisNow: "Build one live dashboard page and add one filter and one headline takeaway.",
        evidenceToSubmit: "Dashboard screenshot or link.",
        optionalBackup: null,
        ruleText: RESOURCE_RULE,
      },
    ],
    checkpointIds: ["stage2-dbt-staging", "stage2-mart-story", "stage2-sql-explain"],
    boss: {
      name: "The Reliability Test",
      technical:
        "Build a tested mart with clear grain, useful metrics, and at least two trust checks that would protect the business from silent nonsense.",
      explain:
        "Explain dbt, marts, and tests to a Head of Product without jargon.",
      business:
        "Describe the wrong decision a company would make if this layer quietly drifted for three days.",
      reward: "+150 XP + BI Engineer Unlocked badge + Stage 3 confidence",
    },
  },
  {
    id: "stage3",
    number: 3,
    title: "Pipelines and Reliability",
    shortTitle: "BIE / DE-lite",
    icon: "🛠",
    weekRange: "Weeks 7–10",
    dayRange: [43, 70],
    hireableAs: "Hireable as: BIE / Analytics Engineer / Pipeline-minded intern",
    hook:
      "This phase turns your work from one-off analysis into a repeatable system. You start thinking like the person responsible for whether the dashboard is ready before the team wakes up.",
    resourceInstruction: "Zoomcamp is the spine here. Follow the week sequence first, then branch into the exact Docker, orchestration, and warehouse reps the stage needs.",
    resources: [
      {
        concept: "Zoomcamp Week 1 foundations",
        whyThisMatters: "You need just enough systems context to understand where your analyst-friendly pipeline fits.",
        learnFrom: {
          name: "DataTalksClub Data Engineering Zoomcamp",
          where: "https://github.com/DataTalksClub/data-engineering-zoomcamp",
          url: "https://github.com/DataTalksClub/data-engineering-zoomcamp",
          format: "guided module + notes",
          cost: "Free",
          timeToday: "15–30 min",
          whyThisOne: "It gives you a real DE backbone, and this stage now follows the useful Zoomcamp week order instead of hopping around randomly.",
        },
        doThisNow: "Use only the Week 1 slice for this week and write down the one pipeline idea you will actually reuse.",
        evidenceToSubmit: "One note on the selected Week 1 slice plus one thing you will copy into your own project.",
        optionalBackup: null,
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Zoomcamp Week 1 Docker setup",
        whyThisMatters: "Being able to run your work on a clean machine makes your project more believable in interviews.",
        learnFrom: {
          name: "DataTalksClub Data Engineering Zoomcamp",
          where: "https://github.com/DataTalksClub/data-engineering-zoomcamp",
          url: "https://github.com/DataTalksClub/data-engineering-zoomcamp",
          format: "guided module + terminal rep",
          cost: "Free",
          timeToday: "15–25 min",
          whyThisOne: "Docker now stays attached to the Zoomcamp Week 1 flow, so it feels like part of the pipeline path instead of a random side quest.",
        },
        doThisNow: "Follow the Week 1 Docker slice, then containerize one tiny script the same day.",
        evidenceToSubmit: "Screenshot of the container run or terminal output.",
        optionalBackup: {
          name: "Docker in 100 Seconds",
          where: "https://www.youtube.com/watch?v=Gjnup-PuquQ",
          url: "https://www.youtube.com/watch?v=Gjnup-PuquQ",
          format: "video + build",
          cost: "Free",
        },
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Zoomcamp Week 2 ingestion flow",
        whyThisMatters: "Before orchestration matters, you need one ingestion path that makes sense end to end on your own machine.",
        learnFrom: {
          name: "DataTalksClub Data Engineering Zoomcamp",
          where: "https://github.com/DataTalksClub/data-engineering-zoomcamp",
          url: "https://github.com/DataTalksClub/data-engineering-zoomcamp",
          format: "guided module + local build",
          cost: "Free",
          timeToday: "20–35 min",
          whyThisOne: "This keeps the stage week-led, so you understand ingestion before adding orchestration on top of it.",
        },
        doThisNow: "Follow the next Zoomcamp slice and get one local ingest path working from source to saved file.",
        evidenceToSubmit: "One successful local run plus one sentence on what the pipeline now produces.",
        optionalBackup: null,
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Zoomcamp Week 3 orchestration",
        whyThisMatters: "Writing a DAG early teaches orchestration better than reading about orchestration.",
        learnFrom: {
          name: "DataTalksClub Data Engineering Zoomcamp",
          where: "https://github.com/DataTalksClub/data-engineering-zoomcamp",
          url: "https://github.com/DataTalksClub/data-engineering-zoomcamp",
          format: "guided module + build",
          cost: "Free",
          timeToday: "20–40 min",
          whyThisOne: "This keeps orchestration attached to the Zoomcamp sequence first, then lets you use a quickstart only if you need a cleaner walkthrough.",
        },
        doThisNow: "Use the orchestration slice that matches this week, then write a tiny DAG that runs one Python task and logs one useful value.",
        evidenceToSubmit: "DAG screenshot or run output.",
        optionalBackup: {
          name: "Astronomer — Get started with Airflow",
          where: "https://www.astronomer.io/docs/learn/get-started-with-airflow/",
          url: "https://www.astronomer.io/docs/learn/get-started-with-airflow/",
          format: "quickstart + build",
          cost: "Free",
        },
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "Zoomcamp Week 4 warehouse basics",
        whyThisMatters: "A junior BIE or AE candidate should be able to land data in a warehouse and answer a business question on it.",
        learnFrom: {
          name: "DataTalksClub Data Engineering Zoomcamp",
          where: "https://github.com/DataTalksClub/data-engineering-zoomcamp",
          url: "https://github.com/DataTalksClub/data-engineering-zoomcamp",
          format: "guided module + hands-on quickstart",
          cost: "Free tier, watch usage",
          timeToday: "20–40 min",
          whyThisOne: "This keeps warehouse work in the same spine, while still using public datasets so the practice is student-safe.",
        },
        doThisNow: "Follow the Zoomcamp warehouse slice, then run one query on a public dataset and rewrite the result as a business answer.",
        evidenceToSubmit: "Query text plus result screenshot.",
        optionalBackup: {
          name: "BigQuery public data quickstart",
          where: "https://cloud.google.com/bigquery/docs/quickstarts/query-public-dataset-bq",
          url: "https://cloud.google.com/bigquery/docs/quickstarts/query-public-dataset-bq",
          format: "hands-on quickstart",
          cost: "Free tier, watch usage",
        },
        ruleText: RESOURCE_RULE,
      },
    ],
    checkpointIds: ["stage3-airflow", "stage3-bigquery", "stage3-docker"],
    boss: {
      name: "The Pipeline Under Pressure",
      technical:
        "Build a daily pull that lands data, checks something important, and loads a queryable layer without breaking silently.",
      explain:
        "Explain the flow to a CTO in four calm sentences, including what would fail first and how you know.",
      business:
        "Describe what the business loses if the morning pipeline is down before a big decision day.",
      reward: "+150 XP + Data Engineer Unlocked badge + Stage 4 confidence",
    },
  },
  {
    id: "stage4",
    number: 4,
    title: "AI Tools for Analysts",
    shortTitle: "AI for Analyst Workflows",
    icon: "🕊",
    weekRange: "Weeks 11–12",
    dayRange: [71, 90],
    hireableAs: "Hireable as: Analyst / BI / BIE / AE candidate who can use AI tools critically",
    hook:
      "This stage is not AI engineering. It is about using AI the way analysts actually do: to explain SQL, improve drafts, speed up dashboard commentary, and still catch mistakes before they reach stakeholders.",
    resources: [
      {
        concept: "AI-assisted SQL and coding",
        whyThisMatters: "Analyst candidates increasingly need to show they can use AI to move faster without losing accuracy.",
        learnFrom: {
          name: "GitHub Education for Students",
          where: "https://github.com/edu/students",
          url: "https://github.com/edu/students",
          format: "tool setup + guided prompt workflow",
          cost: "Free with student access if eligible",
          timeToday: "15–30 min",
          whyThisOne: "It gives you a real productivity tool you can use for SQL and Python while still practicing verification.",
        },
        doThisNow: "Ask AI to explain one query you wrote, then rewrite the explanation in your own words and correct anything vague.",
        evidenceToSubmit: "Original query plus your corrected explanation.",
        optionalBackup: {
          name: "Copilot Pro student access docs",
          where: "https://docs.github.com/copilot/how-tos/manage-your-account/getting-free-access-to-copilot-pro-as-a-student-teacher-or-maintainer",
          url: "https://docs.github.com/copilot/how-tos/manage-your-account/getting-free-access-to-copilot-pro-as-a-student-teacher-or-maintainer",
          format: "setup reference",
          cost: "Free",
        },
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "AI in Power BI",
        whyThisMatters: "If you picked Power BI, you should understand how AI features fit into real dashboard workflows and where access limits show up.",
        learnFrom: {
          name: "Copilot in Power BI overview",
          where: "https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-preview-toggle",
          url: "https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-preview-toggle",
          format: "official docs + critical review",
          cost: "Paid workspace or org license usually required",
          timeToday: "15–25 min",
          whyThisOne: "It shows the real access requirements instead of pretending every AI feature is student-friendly out of the box.",
        },
        doThisNow: "Read the access requirements, then write one note on whether this belongs in your student workflow right now.",
        evidenceToSubmit: "One paragraph on access limits and one practical use case.",
        optionalBackup: null,
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "AI in Tableau",
        whyThisMatters: "If you picked Tableau, you should know where Tableau AI or Pulse can help and where you still need manual judgment.",
        learnFrom: {
          name: "Tableau Cloud get started",
          where: "https://help.tableau.com/current/online/en-us/to_get_started.htm",
          url: "https://help.tableau.com/current/online/en-us/to_get_started.htm",
          format: "official docs + critical review",
          cost: "Varies by Tableau license or workspace access",
          timeToday: "15–25 min",
          whyThisOne: "It keeps the tool exposure grounded in official workflow setup rather than hype.",
        },
        doThisNow: "Write one note on which Tableau AI-style feature would actually save you time and one note on what you would still verify manually.",
        evidenceToSubmit: "Two bullet points: one use case, one risk.",
        optionalBackup: null,
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "AI workflow literacy",
        whyThisMatters: "The real skill is not asking AI for answers; it is prompting well, reviewing critically, and keeping ownership of the final output.",
        learnFrom: {
          name: "Built-in AI workflow guide",
          where: "Inside Data Engineer Quest",
          url: null,
          format: "short lesson + in-app practice",
          cost: "Free",
          timeToday: "15–25 min",
          whyThisOne: "It stays practical and keeps the focus on analyst productivity instead of drifting into AI engineering.",
        },
        doThisNow: "Use AI to draft a stakeholder summary, then edit the tone, tighten the recommendation, and remove anything unsupported.",
        evidenceToSubmit: "Before-and-after summary plus one sentence on what the AI got wrong.",
        optionalBackup: null,
        ruleText: RESOURCE_RULE,
      },
      {
        concept: "In-app analyst AI practice",
        whyThisMatters: "Hands-on reps matter more than reading about AI features.",
        learnFrom: {
          name: "Analyst AI drills inside the app",
          where: "Inside Data Engineer Quest",
          url: null,
          format: "guided practice",
          cost: "Free",
          timeToday: "20–30 min",
          whyThisOne: "It forces you to use AI critically for real analyst tasks instead of passively consuming AI content.",
        },
        doThisNow: "Ask AI to improve one query, write dashboard commentary, and check one analysis for errors. Keep only the parts you can verify.",
        evidenceToSubmit: "Edited result plus one sentence on what you changed or rejected.",
        optionalBackup: {
          name: "GitHub Copilot Free",
          where: "https://github.com/features/copilot/",
          url: "https://github.com/features/copilot/",
          format: "tool overview",
          cost: "Free",
        },
        ruleText: RESOURCE_RULE,
      },
    ],
    checkpointIds: ["stage4-hiring-demo", "stage4-ai-leverage"],
    boss: {
      name: "The Analyst Copilot Review",
      technical:
        "Use AI to explain one SQL query, improve one business summary, and review one dashboard narrative. Keep only what you can verify manually.",
      explain:
        "Explain to a hiring manager how AI helped your workflow, where you did not trust it, and what you corrected yourself.",
      business:
        "Describe one analyst workflow where AI saves time and one place where blind trust would create business risk.",
      reward: "+150 XP + AI Tools for Analysts completed",
    },
  },
];

const RESOURCE_SLICE_DETAILS = {
  "stage1:Python foundations": {
    lessonLabel: "CS50P Week 0-1 — variables, input, and conditionals",
    stopAt: "Stop before loops and exception-heavy work. Today is only about the first stable Python footing.",
    timebox: "25 min",
    buildNow: "Write a tiny script that reads a 10-row CSV, filters one segment, and saves a smaller file.",
    writeNow: "Write one sentence: what did your tiny script do, and which rows did you keep?",
    checkpointId: "stage1-python-csv",
    projectStepId: "tft-1|1",
    starterAsset: "Use `tiny_matches.csv`, `tiny_funnel.csv`, or a hand-made 10-row CSV.",
    transferLater: "Stay in CS50P long enough to make the Python shape feel normal first. This is the base for your real data pull and cleanup later.",
  },
  "stage1:Python functions and return values": {
    lessonLabel: "CS50P Week 1 — small functions and return values",
    stopAt: "Stop before loops. The goal is to make small reusable logic feel normal, not to finish the whole week.",
    timebox: "25 min",
    buildNow: "Turn your first tiny script into one function with a return value and run it twice with different inputs.",
    writeNow: "Write one sentence: what does your function return, and why is that useful?",
    checkpointId: "stage1-python-csv",
    projectStepId: "tft-1|1",
    starterAsset: "Reuse the same tiny CSV so the new thing is the function shape, not the data complexity.",
    transferLater: "This is still CS50P because you are learning how to package logic cleanly before you add loops or pandas.",
  },
  "stage1:Python loops and reusable scripts": {
    lessonLabel: "CS50P Week 2 — loops and reusable scripts",
    stopAt: "Stop before classes and exception-heavy work. You are still building analyst Python, not full Python breadth.",
    timebox: "25 min",
    buildNow: "Add one loop, wrap the repeated logic in a helper, and export a cleaner result than the first version.",
    writeNow: "Write one sentence: what became reusable after you added the loop or helper?",
    checkpointId: "stage1-python-csv",
    projectStepId: "tft-1|2",
    starterAsset: "Reuse the same tiny CSV so the new thing is the code structure, not the data complexity.",
    transferLater: "This is the last CS50P stretch before the handoff to pandas, so the switch happens because your Python base is ready, not because the next card exists.",
  },
  "stage1:Python file handling prep": {
    lessonLabel: "CS50P file-shaped slice — open, loop through, and save a smaller file",
    stopAt: "Stop after one tiny read-filter-save loop works. Do not turn this into a deep file-system detour.",
    timebox: "25 min",
    buildNow: "Open a tiny file, keep only the rows you care about, and save a smaller version for later analysis.",
    writeNow: "Write one sentence: what changed between the input file and the output file?",
    checkpointId: "stage1-python-csv",
    projectStepId: "tft-1|2",
    starterAsset: "Use the same tiny CSV or text file so the only new thing is file handling.",
    transferLater: "This is the handoff slice. After this, pandas should feel like a better tool for bigger row manipulation instead of a sudden leap.",
  },
  "stage1:Pandas / data manipulation": {
    lessonLabel: "Kaggle Pandas — Lessons 1 to 3 (creating, selecting, filtering)",
    stopAt: "Stop before heavier groupby work. Switch only after your Python scripting slices feel okay.",
    timebox: "25 min",
    buildNow: "Load a tiny CSV, rename two columns, filter one audience, and export the result.",
    writeNow: "Write one sentence: which columns did you rename, and which slice did you keep?",
    checkpointId: "stage1-python-csv",
    projectStepId: "tft-1|2",
    starterAsset: "Use a 10-20 row CSV with three columns you can understand quickly.",
    transferLater: "Apply the same rename + filter pattern to your TFT or funnel dataset later.",
  },
  "stage1:SQL fundamentals": {
    lessonLabel: "SQLZoo — SELECT basics, WHERE, and aggregate intro",
    stopAt: "Stop after the first 2-3 foundational lessons.",
    timebox: "20 min",
    buildNow: "Solve 3 beginner queries and rewrite each one as the business question it answers.",
    writeNow: "Write one sentence for each query: what business question does it answer?",
    checkpointId: "stage1-sql-window",
    projectStepId: "tft-1|3",
    starterAsset: "Use SQLZoo tables or a tiny DuckDB table you create yourself.",
    transferLater: "This becomes the base pattern for your first real project query.",
  },
  "stage1:Intermediate SQL practice": {
    lessonLabel: "DataLemur — 2 easy analyst-style problems",
    stopAt: "Stop after two solved reps and one rewrite in your own words.",
    timebox: "25 min",
    buildNow: "Solve 2 problems, then explain the grain and final metric in plain English.",
    writeNow: "Write two short notes: what was the grain, and what final metric did you return?",
    checkpointId: "stage1-sql-window",
    projectStepId: "tft-1|3",
    starterAsset: "Use DataLemur easy prompts or a tiny sample orders table.",
    transferLater: "The same business-question framing feeds your first TFT or funnel SQL story.",
  },
  "stage1:Spreadsheets / Excel basics": {
    lessonLabel: "In-app spreadsheet survival drill — formulas, pivot, chart",
    stopAt: "Stop after one pivot table and one chart.",
    timebox: "20 min",
    buildNow: "Create one pivot table, one percentage formula, and one chart headline.",
    writeNow: "Write one line: what does the pivot or chart tell you at a glance?",
    checkpointId: "stage1-sql-window",
    projectStepId: "fin-1|3",
    starterAsset: "Use a tiny CSV with category, date, and amount columns.",
    transferLater: "You will reuse the same KPI thinking when turning SQL output into a dashboard.",
  },
  "stage1:Dashboarding": {
    lessonLabel: "Power BI fundamentals — import data, card visual, one chart, one filter",
    stopAt: "Stop after your first report page works.",
    timebox: "30 min",
    buildNow: "Build one report page with one KPI card, one chart, and one sentence above it.",
    writeNow: "Write one sentence above the chart: what changed, and why should someone care?",
    checkpointId: "stage1-sql-window",
    projectStepId: "tft-1|4",
    starterAsset: "Use a sample CSV with one metric, one category, and one date field.",
    transferLater: "This becomes the first finished view inside your personal portfolio project.",
  },
  "stage2:Raw vs staging vs marts": {
    lessonLabel: "Built-in visual lesson — raw data, staging tables, marts",
    stopAt: "Stop after you can sketch the 3 layers from memory.",
    timebox: "15 min",
    buildNow: "Draw one messy raw table, one cleaned staging table, and one business-ready mart.",
    writeNow: "Write three labels: what is raw, what is staging, and what is the mart?",
    checkpointId: "stage2-dbt-staging",
    projectStepId: "tft-2|1",
    starterAsset: "Use the app sketch prompt if you do not have source data yet.",
    transferLater: "Use the same layered thinking when naming your first dbt models.",
  },
  "stage2:Star schema basics": {
    lessonLabel: "Built-in visual lesson — fact table, dimensions, grain",
    stopAt: "Stop after you can name one fact and two dimensions for your project idea.",
    timebox: "15 min",
    buildNow: "Write the grain for one fact table and name two dimensions that join to it.",
    writeNow: "Write one line for the fact table grain and one line for each dimension.",
    checkpointId: "stage2-mart-story",
    projectStepId: "fin-2|0",
    starterAsset: "Use a toy schema based on orders, players, or events.",
    transferLater: "This becomes the backbone of your marts and dashboard joins later.",
  },
  "stage2:Why dbt exists": {
    lessonLabel: "Built-in visual lesson — repeatable SQL, tests, docs, trust",
    stopAt: "Stop after you can explain dbt without jargon.",
    timebox: "15 min",
    buildNow: "Write 3 sentences on why dbt is safer than repeating ad-hoc SQL everywhere.",
    writeNow: "Write 3 short sentences explaining why dbt exists in plain English.",
    checkpointId: "stage2-dbt-staging",
    projectStepId: "tft-2|0",
    starterAsset: "Use the built-in prompt; no project data required.",
    transferLater: "You will reuse this explanation in interviews and README notes.",
  },
  "stage2:Business-ready tables for dashboards": {
    lessonLabel: "Built-in visual lesson — grain, freshness, and metric-ready fields",
    stopAt: "Stop after you can define one table a dashboard could use directly.",
    timebox: "15 min",
    buildNow: "Define one business-ready table with grain, dimensions, metric, and freshness note.",
    writeNow: "Write the grain, one metric, two dimensions, and one freshness note.",
    checkpointId: "stage2-mart-story",
    projectStepId: "tft-2|2",
    starterAsset: "Use a one-table sketch if your models are not built yet.",
    transferLater: "This becomes the mart description you ship with your portfolio layer.",
  },
  "stage2:dbt fundamentals": {
    lessonLabel: "dbt Learn Fundamentals — Module 1 only",
    stopAt: "Stop after the first fundamentals module is complete.",
    timebox: "30 min",
    buildNow: "Complete Module 1, then mirror the same naming pattern in your own project notes.",
    writeNow: "Write the model naming pattern you copied and one reason it is clearer.",
    checkpointId: "stage2-dbt-staging",
    projectStepId: "tft-2|1",
    starterAsset: "Use dbt Learn browser exercises and one mock raw table sketch.",
    transferLater: "Apply the same staging pattern to your project raw data later.",
  },
  "stage2:Business-facing SQL and marts": {
    lessonLabel: "DataLemur medium — 1 business query + 1 mart-style rewrite",
    stopAt: "Stop after one staging query and one mart summary query.",
    timebox: "35 min",
    buildNow: "Write one staging query, then rewrite it as a mart answer with clear grain.",
    writeNow: "Write one sentence on the grain and one sentence on what the mart answers.",
    checkpointId: "stage2-sql-explain",
    projectStepId: "fin-2|1",
    starterAsset: "Use a medium DataLemur problem or a tiny sample events table.",
    transferLater: "This same structure becomes your project mart logic and interview explanation.",
  },
  "stage2:Dashboard tool track — Recommended default: Power BI": {
    lessonLabel: "Power BI get started — import, model view, one KPI page",
    stopAt: "Stop after one working report page.",
    timebox: "30 min",
    buildNow: "Import one sample dataset and create a simple page with KPI, trend, and filter.",
    writeNow: "Write one headline above the page that says what question this dashboard answers.",
    checkpointId: "stage2-mart-story",
    projectStepId: "tft-2|5",
    starterAsset: "Use a tiny mart-like CSV with one metric and one time field.",
    transferLater: "You will later rebuild this page on top of your own trusted mart.",
  },
  "stage2:Dashboard tool track — Tableau": {
    lessonLabel: "Tableau student setup — first worksheet and one dashboard",
    stopAt: "Stop after one dashboard answers one question.",
    timebox: "30 min",
    buildNow: "Create one worksheet and one dashboard that answer a single question clearly.",
    writeNow: "Write one dashboard title that makes the question obvious.",
    checkpointId: "stage2-mart-story",
    projectStepId: "fin-2|4",
    starterAsset: "Use Tableau sample data or your own tiny CSV.",
    transferLater: "Swap in your mart output later if you choose Tableau as your main tool.",
  },
  "stage2:Dashboard tool track — Looker Studio": {
    lessonLabel: "Looker Studio quickstart — connect data, one scorecard, one filter",
    stopAt: "Stop after one live shareable page works.",
    timebox: "25 min",
    buildNow: "Build one page with one scorecard, one chart, and one filter.",
    writeNow: "Write one short takeaway headline above the chart.",
    checkpointId: "stage2-mart-story",
    projectStepId: "fin-2|4",
    starterAsset: "Use a simple CSV or Google Sheet with one date and one category.",
    transferLater: "Use the same layout when you want a fast public-facing portfolio view.",
  },
  "stage3:Zoomcamp Week 1 foundations": {
    lessonLabel: "Zoomcamp Week 1 — pipeline overview, environment, and what the stack is for",
    stopAt: "Stop after the part that frames the stack and local workflow. Do not open later weeks yet.",
    timebox: "25 min",
    buildNow: "Write down the one Zoomcamp Week 1 idea that maps directly to your own pipeline.",
    writeNow: "Write one line: what is the one Week 1 idea you will reuse in your own project?",
    checkpointId: "stage3-airflow",
    projectStepId: "tft-3|1",
    starterAsset: "Use the Week 1 module notes only; do not open the full curriculum.",
    transferLater: "This gives the pipeline context first, so Docker and orchestration land as part of one system instead of isolated tools.",
  },
  "stage3:Zoomcamp Week 1 Docker setup": {
    lessonLabel: "Zoomcamp Week 1 — Docker and local environment setup",
    stopAt: "Stop after your first tiny script runs in a container and you understand why the image exists.",
    timebox: "25 min",
    buildNow: "Containerize one tiny Python script and run it once successfully.",
    writeNow: "Write the exact docker command that worked and one sentence on why the container matters.",
    checkpointId: "stage3-docker",
    projectStepId: "tft-3|1",
    starterAsset: "Use a single-file Python script with one dependency if possible.",
    transferLater: "This stays in the Zoomcamp Week 1 spine so container work feels like pipeline setup, not a random detour.",
  },
  "stage3:Zoomcamp Week 2 ingestion flow": {
    lessonLabel: "Zoomcamp Week 2 — local ingestion flow from source to saved file",
    stopAt: "Stop after one local ingest path works end to end and you can explain each step in order.",
    timebox: "30 min",
    buildNow: "Get one source pull running locally and save the result in a stable place you can inspect.",
    writeNow: "Write three tiny bullets: source, transform, and saved output.",
    checkpointId: "stage3-airflow",
    projectStepId: "tft-3|2",
    starterAsset: "Use one tiny API pull or sample file if your real source is not ready yet.",
    transferLater: "This creates the ingestion backbone first so orchestration lands on a real workflow instead of an empty shell.",
  },
  "stage3:Zoomcamp Week 3 orchestration": {
    lessonLabel: "Zoomcamp Week 3 — first DAG with one Python task",
    stopAt: "Stop after the first DAG runs and logs one value. You can use Astronomer only if you need a cleaner walkthrough.",
    timebox: "35 min",
    buildNow: "Write one tiny DAG with one Python task that logs a row count or file size.",
    writeNow: "Write one line: what does the DAG run, and what signal does it log?",
    checkpointId: "stage3-airflow",
    projectStepId: "tft-3|4",
    starterAsset: "Use a dummy local file or one tiny API response if your real source is not ready.",
    transferLater: "This is the next Zoomcamp-style continuation after setup, so orchestration arrives when the sequence is ready for it.",
  },
  "stage3:Zoomcamp Week 4 warehouse basics": {
    lessonLabel: "Zoomcamp Week 4 — public dataset query + one validation query",
    stopAt: "Stop after one public dataset query and one sanity-check query. Stay on the warehouse layer, not the whole cloud stack.",
    timebox: "35 min",
    buildNow: "Run one public dataset query, then write one follow-up validation query that checks the result.",
    writeNow: "Write one sentence: what did the query show, and how did you validate it?",
    checkpointId: "stage3-bigquery",
    projectStepId: "tft-3|4",
    starterAsset: "Use a public BigQuery dataset or a tiny sample file if you are not cloud-ready yet.",
    transferLater: "Use the same query + validation habit when loading your own raw layer later.",
  },
  "stage4:AI-assisted SQL and coding": {
    lessonLabel: "GitHub Copilot setup + one SQL explanation rep",
    stopAt: "Stop after one query explanation and one manual rewrite.",
    timebox: "20 min",
    buildNow: "Ask AI to explain one query you already wrote, then rewrite the explanation in your own words.",
    writeNow: "Write one sentence on what the query does and one correction you made to the AI explanation.",
    checkpointId: "stage4-ai-leverage",
    projectStepId: "tft-4|1",
    starterAsset: "Use one query from SQLZoo, DataLemur, or your own notes.",
    transferLater: "Later use the same workflow to tighten your real project SQL commentary.",
  },
  "stage4:AI in Power BI": {
    lessonLabel: "Power BI Copilot access review — where it helps and where it does not",
    stopAt: "Stop after you can explain one useful workflow and one access limit.",
    timebox: "15 min",
    buildNow: "Write one note on whether this AI feature is realistic for your student workflow right now.",
    writeNow: "Write one realistic use case and one access limit.",
    checkpointId: "stage4-hiring-demo",
    projectStepId: "tft-4|2",
    starterAsset: "Use the official feature page and your current dashboard workflow.",
    transferLater: "Use the note to decide whether the feature belongs in your portfolio story at all.",
  },
  "stage4:AI in Tableau": {
    lessonLabel: "Tableau AI / Pulse review — one useful workflow, one verification risk",
    stopAt: "Stop after you can name one workflow you would actually trust partially.",
    timebox: "15 min",
    buildNow: "Write one use case and one thing you would still verify manually.",
    writeNow: "Write one useful workflow and one verification risk.",
    checkpointId: "stage4-hiring-demo",
    projectStepId: "tft-4|2",
    starterAsset: "Use the official getting-started material and your own dashboard habit.",
    transferLater: "Turn the result into a calm explanation of where AI fits and where it does not.",
  },
  "stage4:AI workflow literacy": {
    lessonLabel: "Built-in AI workflow guide — prompt, verify, edit, own the answer",
    stopAt: "Stop after one before/after summary rewrite.",
    timebox: "20 min",
    buildNow: "Use AI to draft one stakeholder summary, then tighten it until every claim is supported.",
    writeNow: "Write one sentence on what the AI draft got wrong or overstated.",
    checkpointId: "stage4-hiring-demo",
    projectStepId: "tft-4|0",
    starterAsset: "Use one chart, KPI, or SQL result you already understand.",
    transferLater: "This becomes part of your project demo and interview story around AI judgment.",
  },
  "stage4:In-app analyst AI practice": {
    lessonLabel: "Analyst AI drills — explain SQL, improve query, write commentary, review errors",
    stopAt: "Stop after one complete drill where you reject at least one bad AI suggestion.",
    timebox: "25 min",
    buildNow: "Run one full analyst AI drill and document what you kept, changed, and rejected.",
    writeNow: "Write three short bullets: what you kept, what you changed, and what you rejected.",
    checkpointId: "stage4-ai-leverage",
    projectStepId: "tft-4|4",
    starterAsset: "Use one existing query, one chart, or one short stakeholder summary draft.",
    transferLater: "This becomes your clearest proof that you use AI critically instead of blindly.",
  },
};

function getResourceTrackMeta(stageId, concept) {
  const key = `${stageId}:${concept}`;
  const map = {
    "stage1:Python foundations": { id: "stage1-python-track", label: "CS50P to pandas path", order: 1, total: 5 },
    "stage1:Python functions and return values": { id: "stage1-python-track", label: "CS50P to pandas path", order: 2, total: 5 },
    "stage1:Python loops and reusable scripts": { id: "stage1-python-track", label: "CS50P to pandas path", order: 3, total: 5 },
    "stage1:Python file handling prep": { id: "stage1-python-track", label: "CS50P to pandas path", order: 4, total: 5 },
    "stage1:Pandas / data manipulation": { id: "stage1-python-track", label: "CS50P to pandas path", order: 5, total: 5 },
    "stage1:SQL fundamentals": { id: "stage1-sql-track", label: "SQL foundations", order: 1, total: 2 },
    "stage1:Intermediate SQL practice": { id: "stage1-sql-track", label: "SQL foundations", order: 2, total: 2 },
    "stage1:Spreadsheets / Excel basics": { id: "stage1-spreadsheet-track", label: "Spreadsheet survival", order: 1, total: 1 },
    "stage1:Dashboarding": { id: "stage1-dashboard-track", label: "First dashboard", order: 1, total: 1 },
    "stage2:Raw vs staging vs marts": { id: "stage2-modeling-track", label: "Analytics engineering basics", order: 1, total: 4 },
    "stage2:Star schema basics": { id: "stage2-modeling-track", label: "Analytics engineering basics", order: 2, total: 4 },
    "stage2:Why dbt exists": { id: "stage2-modeling-track", label: "Analytics engineering basics", order: 3, total: 4 },
    "stage2:Business-ready tables for dashboards": { id: "stage2-modeling-track", label: "Analytics engineering basics", order: 4, total: 4 },
    "stage2:dbt fundamentals": { id: "stage2-dbt-track", label: "dbt fundamentals", order: 1, total: 1 },
    "stage2:Business-facing SQL and marts": { id: "stage2-sql-track", label: "Business SQL and marts", order: 1, total: 1 },
    "stage2:Dashboard tool track — Recommended default: Power BI": { id: "stage2-dashboard-track", label: "Dashboard tool track", order: 1, total: 3 },
    "stage2:Dashboard tool track — Tableau": { id: "stage2-dashboard-track", label: "Dashboard tool track", order: 2, total: 3 },
    "stage2:Dashboard tool track — Looker Studio": { id: "stage2-dashboard-track", label: "Dashboard tool track", order: 3, total: 3 },
    "stage3:Zoomcamp Week 1 foundations": { id: "stage3-pipeline-track", label: "Zoomcamp spine", order: 1, total: 5 },
    "stage3:Zoomcamp Week 1 Docker setup": { id: "stage3-pipeline-track", label: "Zoomcamp spine", order: 2, total: 5 },
    "stage3:Zoomcamp Week 2 ingestion flow": { id: "stage3-pipeline-track", label: "Zoomcamp spine", order: 3, total: 5 },
    "stage3:Zoomcamp Week 3 orchestration": { id: "stage3-pipeline-track", label: "Zoomcamp spine", order: 4, total: 5 },
    "stage3:Zoomcamp Week 4 warehouse basics": { id: "stage3-pipeline-track", label: "Zoomcamp spine", order: 5, total: 5 },
    "stage4:AI-assisted SQL and coding": { id: "stage4-ai-track", label: "AI analyst workflow", order: 1, total: 5 },
    "stage4:AI in Power BI": { id: "stage4-ai-track", label: "AI analyst workflow", order: 2, total: 5 },
    "stage4:AI in Tableau": { id: "stage4-ai-track", label: "AI analyst workflow", order: 3, total: 5 },
    "stage4:AI workflow literacy": { id: "stage4-ai-track", label: "AI analyst workflow", order: 4, total: 5 },
    "stage4:In-app analyst AI practice": { id: "stage4-ai-track", label: "AI analyst workflow", order: 5, total: 5 },
  };
  return map[key] || { id: `${stageId}-track`, label: "Core track", order: 1, total: 1 };
}

const CONCEPT_UNITS = STAGES.flatMap((stage) =>
  stage.resources.map((resource, index) => {
    const details = RESOURCE_SLICE_DETAILS[`${stage.id}:${resource.concept}`] || {};
    const track = getResourceTrackMeta(stage.id, resource.concept);
    return {
      conceptUnitId: details.conceptUnitId || `${stage.id}-unit-${index + 1}`,
      stageId: stage.id,
      order: index + 1,
      resourceTrackId: track.id,
      resourceTrackLabel: track.label,
      resourceTrackOrder: track.order,
      resourceTrackTotal: track.total,
      title: resource.concept,
      whyThisMatters: resource.whyThisMatters,
      resourceName: resource.learnFrom.name,
      resourceUrl: resource.learnFrom.url,
      resourceWhere: resource.learnFrom.where,
      format: resource.learnFrom.format,
      cost: resource.learnFrom.cost,
      whyThisOne: resource.learnFrom.whyThisOne,
      lessonLabel: details.lessonLabel || resource.learnFrom.name,
      stopAt: details.stopAt || "Stop after one focused section.",
      timebox: details.timebox || resource.learnFrom.timeToday,
      buildNow: details.buildNow || resource.doThisNow,
      writeNow: details.writeNow || resource.evidenceToSubmit || "Write one short note on what changed or what you built.",
      evidencePrompt: details.evidencePrompt || resource.evidenceToSubmit,
      checkpointId: details.checkpointId || stage.checkpointIds[0],
      projectStepId: details.projectStepId || null,
      starterAsset: details.starterAsset || "Use the smallest starter asset you can understand quickly.",
      transferLater: details.transferLater || "Carry this exact concept into your project when the matching step opens.",
      unlockAfter: index === 0 ? null : `${stage.id}-unit-${index}`,
      optionalBackup: resource.optionalBackup,
      ruleText: resource.ruleText,
    };
  }),
);

const DAILY_TASK_POOLS = {
  stage1: {
    mustDos: [
      {
        title: "Watch CS50P or Kaggle for 20 minutes, then recreate the code without peeking.",
        estimate: "60–75 min",
        resource: "CS50P Week 1 or Kaggle Python",
        microSteps: ["Watch only one focused segment.", "Close the tab and rebuild the tiny example.", "Write one sentence on what changed in your understanding."],
        buildBlock: "Turn the example into a tiny script that reads a file or list and prints a useful summary.",
        practiceBlock: "Solve 2 easy SQL questions or one Excel slice-and-filter drill.",
        salvage: "Recreate just one 10-line example and annotate each line in plain English.",
      },
      {
        title: "Write a Python script that reads any CSV and answers one business question from memory.",
        estimate: "70–90 min",
        resource: "Your own sample CSV + pandas",
        microSteps: ["Load the file.", "Filter to one segment that matters.", "Print or export the answer cleanly."],
        buildBlock: "Add one quality check like row count or null count before exporting.",
        practiceBlock: "Write a 3-sentence business explanation of the result.",
        salvage: "Read the CSV and print 5 useful summary facts with no export step.",
      },
      {
        title: "Complete 5 DataLemur problems and explain the trick behind your hardest one.",
        estimate: "60–90 min",
        resource: "DataLemur easy tier",
        microSteps: ["Pick 5 related problems.", "Solve without looking up after the first attempt.", "Explain the hardest one in plain English."],
        buildBlock: "Rewrite one solution using a CTE so it reads better.",
        practiceBlock: "Add one dashboard or spreadsheet-friendly metric idea from the query.",
        salvage: "Solve 2 problems and write the business question each one answers.",
      },
      {
        title: "Build your first Looker Studio dashboard answering one question that a manager could care about.",
        estimate: "75–90 min",
        resource: "Looker Studio tutorials",
        microSteps: ["Pick one metric question.", "Create one clean chart and one filter.", "Write the one-sentence insight above it."],
        buildBlock: "Add a comparison view or segment filter.",
        practiceBlock: "Explain who would use this dashboard and what decision it helps.",
        salvage: "Sketch the dashboard layout and write the KPI definitions before building.",
      },
      {
        title: "Pull a simple API response and save it as a clean JSON snapshot you can trust.",
        estimate: "60–75 min",
        resource: "Open-Meteo or another friendly API",
        microSteps: ["Make the request.", "Save the response.", "Print one meaningful summary stat."],
        buildBlock: "Handle one edge case like a missing key.",
        practiceBlock: "Write one sentence on how schema drift would hurt a dashboard.",
        salvage: "Call the API and print only the top-level keys with a short explanation.",
      },
    ],
    flowBonuses: [
      "Do 3 extra DataLemur problems.",
      "Read one article about how a company uses analysts for decision-making.",
      "Write a one-paragraph explanation of what you built today in plain English.",
      "Practice one Excel filter + pivot flow on a toy dataset.",
    ],
    careerActions: [
      { title: "Save 2 internship roles to your tracker and note why they match your path.", xp: 20 },
      { title: "Rewrite one resume bullet using project impact language.", xp: 30 },
      { title: "Send one short outreach DM to a working analyst or BIE.", xp: 20 },
      { title: "Clean one GitHub repo title or README sentence so a recruiter understands it faster.", xp: 20 },
    ],
  },
  stage2: {
    mustDos: [
      {
        title: "Build a staging model that cleans one raw table and makes the names human.",
        estimate: "75–90 min",
        resource: "dbt Learn Module 1",
        microSteps: ["Define the grain.", "Rename and cast fields.", "Add two tests or trust checks."],
        buildBlock: "Document why the cleaned table is safer for downstream work.",
        practiceBlock: "Explain the model to a PM in 3 sentences.",
        salvage: "Sketch the staging column names and types before writing the model.",
      },
      {
        title: "Build a mart that answers one recurring stakeholder question without extra cleanup.",
        estimate: "75–90 min",
        resource: "In-app staging vs marts lesson + your own project data",
        microSteps: ["State the business question.", "Define the mart grain.", "Keep only decision-ready fields."],
        buildBlock: "Add a matching dashboard tile or query on top of the mart.",
        practiceBlock: "Write the mart description as if it will go in docs.",
        salvage: "Define the grain, metric, and dimensions before writing any SQL.",
      },
      {
        title: "Write a multi-CTE SQL query and explain each layer like you are in an interview.",
        estimate: "60–80 min",
        resource: "DataLemur medium tier",
        microSteps: ["Name each CTE for its job.", "Keep the logic layered.", "Say out loud what each part does."],
        buildBlock: "Refactor the final select to read like a business answer.",
        practiceBlock: "Write the decision that follows from the result.",
        salvage: "Write the CTE plan in comments before solving the query.",
      },
      {
        title: "Add one more test and one more documentation note to an existing model.",
        estimate: "60–75 min",
        resource: "dbt Fundamentals + your own models",
        microSteps: ["Choose the weakest model.", "Add one trust check.", "Write one explanation a teammate would thank you for."],
        buildBlock: "Take a screenshot or note for your README.",
        practiceBlock: "State what silent failure this prevents.",
        salvage: "List the tests the model should have, even if you only implement one.",
      },
      {
        title: "Build one clean dashboard view on top of your mart and write the takeaway headline first.",
        estimate: "70–90 min",
        resource: "Looker Studio or similar",
        microSteps: ["Write the question in plain English.", "Build the one chart that answers it.", "Add context text above the chart."],
        buildBlock: "Add a filter or patch comparison.",
        practiceBlock: "Practice the 30-second walkthrough.",
        salvage: "Draft the dashboard copy and KPI definitions before connecting the data.",
      },
    ],
    flowBonuses: [
      "Add one more dbt test to any model.",
      "Replicate one dashboard element from a tutorial and simplify it.",
      "Write the contractor brief for your TFT project in the README.",
      "Explain one mart model in a voice note to yourself.",
    ],
    careerActions: [
      { title: "Tailor one resume version toward BIE / Analytics Engineer language.", xp: 30 },
      { title: "Apply to one internship that genuinely matches your growing skill set.", xp: 30 },
      { title: "Rewrite one README section with a clearer business impact lens.", xp: 40 },
      { title: "Message one engineer with a specific question about BI or analytics engineering work.", xp: 20 },
    ],
  },
  stage3: {
    mustDos: [
      {
        title: "Write or extend an Airflow DAG so it runs one daily ingestion path without errors.",
        estimate: "75–95 min",
        resource: "Astronomer Airflow 101",
        microSteps: ["Define one task clearly.", "Run the DAG locally.", "Log one useful signal like row count or file size."],
        buildBlock: "Add one schema or freshness check.",
        practiceBlock: "Write the CTO-friendly 4-sentence explanation.",
        salvage: "Write the DAG skeleton and one Python task before wiring the rest.",
      },
      {
        title: "Land one raw file into BigQuery and answer one real business question on it.",
        estimate: "75–90 min",
        resource: "BigQuery quickstart + public datasets",
        microSteps: ["Upload or load the data.", "Write one validation query.", "Answer one stakeholder question."],
        buildBlock: "Add a partitioning or table organization note.",
        practiceBlock: "Write what could silently go wrong here.",
        salvage: "Draft the load steps and verification query before touching the warehouse.",
      },
      {
        title: "Get your ingestion script running inside Docker so the setup stops depending on your mood.",
        estimate: "70–90 min",
        resource: "Docker in 100 Seconds + project repo",
        microSteps: ["Write the container basics.", "Run the script inside the container.", "Note the exact command in README."],
        buildBlock: "Explain one thing that still would not scale yet.",
        practiceBlock: "Write the clean-machine story for interviews.",
        salvage: "Draft the Dockerfile and list dependencies even if the run is not perfect yet.",
      },
      {
        title: "Add one reliability improvement to your pipeline that future-you will actually appreciate.",
        estimate: "60–80 min",
        resource: "Your current project",
        microSteps: ["Pick one failure mode.", "Add one check or log.", "State what signal tells you it worked."],
        buildBlock: "Document it in README or diagram notes.",
        practiceBlock: "Explain the business risk it reduces.",
        salvage: "List the three most likely failure points and choose one.",
      },
      {
        title: "Complete one cloud lab hands-on and connect it mentally to your own pipeline.",
        estimate: "60–75 min",
        resource: "BigQuery or warehouse quickstart",
        microSteps: ["Do only the hands-on part.", "Map each step to your project.", "Write one note on what you would reuse."],
        buildBlock: "Apply one tiny cloud improvement to your repo notes.",
        practiceBlock: "Say why this matters for a BIE or AE role, not just DE.",
        salvage: "Watch the lab overview and extract the 3 commands you need to remember.",
      },
    ],
    flowBonuses: [
      "Watch one ByteByteGo video and write a 4-line summary.",
      "Add one data quality check to your pipeline.",
      "Update LinkedIn with a concrete progress post.",
      "Refine one architecture diagram box or label.",
    ],
    careerActions: [
      { title: "Apply to one pipeline-friendly BIE / AE / DE-lite internship.", xp: 30 },
      { title: "Do one mock interview focused on explaining your pipeline clearly.", xp: 35 },
      { title: "Rewrite your project summary to emphasize reliability and business trust.", xp: 40 },
      { title: "Send one follow-up message sharing a concrete project update.", xp: 20 },
    ],
  },
  stage4: {
    mustDos: [
      {
        title: "Ask AI to explain one SQL query you wrote, then rewrite the explanation in your own words and correct anything vague.",
        estimate: "45–60 min",
        resource: "GitHub Copilot or another student-safe AI assistant",
        microSteps: ["Paste one query you already understand partly.", "Ask AI to explain it step by step.", "Rewrite the explanation in your own words and fix errors."],
        buildBlock: "Keep only the explanation that you can verify against the actual query.",
        practiceBlock: "Write one sentence on what the AI got wrong or missed.",
        salvage: "Explain just one SELECT clause in your own words after reading the AI explanation.",
      },
      {
        title: "Use AI to improve one working SQL query, then verify every change manually before keeping it.",
        estimate: "45–60 min",
        resource: "AI-assisted SQL workflow",
        microSteps: ["Start with a query that already runs.", "Ask AI for one improvement.", "Test whether the change actually helps or breaks anything."],
        buildBlock: "Keep only the version that is clearer, faster, or easier to explain.",
        practiceBlock: "Write which AI suggestion you rejected and why.",
        salvage: "Ask AI for naming or comment improvements only, not logic changes.",
      },
      {
        title: "Generate stakeholder summary text with AI, then edit it into something you would actually send.",
        estimate: "60–80 min",
        resource: "Built-in AI workflow guide",
        microSteps: ["Give AI a real chart or query result.", "Ask for a stakeholder-ready summary.", "Edit tone, claims, and recommendation until it sounds like you."],
        buildBlock: "Make sure every sentence is supported by the underlying result.",
        practiceBlock: "Write one sentence about the risk of sending the raw AI draft unedited.",
        salvage: "Edit only the headline and one recommendation sentence.",
      },
      {
        title: "Use AI to write dashboard commentary, then tighten the story and remove anything unsupported.",
        estimate: "45–60 min",
        resource: "Your dashboard + AI assistant",
        microSteps: ["Pick one chart or KPI tile.", "Ask AI for commentary.", "Rewrite it so the business question and takeaway are obvious."],
        buildBlock: "Remove fluff and make one decision recommendation explicit.",
        practiceBlock: "Note one place where AI overreached beyond the data.",
        salvage: "Rewrite only the first two lines of commentary.",
      },
      {
        title: "Ask AI to review one analysis for mistakes, then keep only the checks that genuinely help.",
        estimate: "45–60 min",
        resource: "In-app analyst AI drills",
        microSteps: ["Feed AI one short analysis or summary.", "Ask it to find weaknesses.", "Keep the useful checks and throw away the fake confidence."],
        buildBlock: "Turn one useful check into a repeatable review habit.",
        practiceBlock: "Write one note on where human review mattered more than AI speed.",
        salvage: "Use AI only to generate a checklist, then apply one item manually.",
      },
    ],
    flowBonuses: [
      "Ask AI to explain one error message and rewrite the fix in plain English.",
      "Use AI to turn a query result into 3 possible stakeholder headlines, then pick the strongest one.",
      "Compare your original summary with the AI-assisted version and note what improved.",
      "Write one short rule for when you should not trust AI output without checking.",
    ],
    careerActions: [
      { title: "Submit one targeted application and log the company fit.", xp: 30 },
      { title: "Do one mock interview or take-home simulation.", xp: 50 },
      { title: "Follow up on one prior application with a respectful note.", xp: 20 },
      { title: "Ask one person for blunt feedback on your story, resume, or demo.", xp: 20 },
    ],
  },
};

const PORTFOLIO_TRACKS = [
  {
    id: "tft",
    title: "Track A — TFT Meta Intelligence",
    tagline: "Motivating domain, strong analyst-to-BIE storytelling, easy to make memorable in interviews.",
    projects: [
      {
        id: "tft-1",
        stageId: "stage1",
        title: "TFT Patch Impact Analysis",
        businessProblem: "Help a competitive TFT team understand which comps and augments look strongest right after a patch.",
        skills: ["Python", "SQL", "Dashboarding", "Business explanation"],
        recruiterSummary: "Pulled match data, cleaned it, answered a focused question, and turned the result into a clean personal analysis project.",
        interviewTalkingPoints: "How you collected the data, what question you were trying to answer, why the metric grain matters, and what you learned.",
        benchmarkBoosts: ["python", "sql", "dashboards", "storytelling"],
        steps: [
          "Set up the Riot developer API key path and test a connection.",
          "Pull a focused dataset of recent Challenger / GM match data.",
          "Clean and normalize the data with pandas.",
          "Write SQL that explains what changed after a patch.",
          "Build one clean dashboard with 3 recruiter-legible views.",
          "Write a short project story explaining what you found and why it was interesting.",
        ],
      },
      {
        id: "tft-2",
        stageId: "stage2",
        title: "TFT Meta Intelligence dbt Layer",
        businessProblem: "Move from one-off SQL toward a reliable analytics layer that coaches could trust every patch.",
        skills: ["dbt", "Data modeling", "Testing", "Documentation", "BI"],
        recruiterSummary: "Built staging and mart models with trust checks so analysis becomes repeatable instead of fragile.",
        interviewTalkingPoints: "How marts help the business, what your tests protect, and how you define trusted metrics.",
        benchmarkBoosts: ["modeling", "testing", "dashboards", "storytelling"],
        steps: [
          "Set up the dbt project and connect it to your warehouse or local pattern.",
          "Build staging models that clean raw API responses.",
          "Build a mart for augment win rates by patch.",
          "Build a mart for comp performance by rank and phase.",
          "Add tests and descriptions to the important models.",
          "Generate docs and use the marts in a dashboard view.",
        ],
      },
      {
        id: "tft-3",
        stageId: "stage3",
        title: "Live TFT Intelligence Pipeline",
        businessProblem: "Automate the daily data pull so analysts stop manually rebuilding the same morning workflow.",
        skills: ["Airflow", "BigQuery", "Docker", "Monitoring", "Architecture communication"],
        recruiterSummary: "Built an automated ingest-to-dashboard pipeline with reliability thinking instead of just a single script.",
        interviewTalkingPoints: "Your orchestration choices, what would fail, what you log, and how you would improve it next.",
        benchmarkBoosts: ["pipelines", "testing", "interview", "storytelling"],
        steps: [
          "Set up cloud storage and a queryable warehouse target.",
          "Write the ingestion script for daily match data.",
          "Add a schema drift or response-shape check.",
          "Load raw data into a warehouse layer.",
          "Orchestrate the flow on a schedule.",
          "Containerize the project and write a clean README runbook.",
        ],
      },
      {
        id: "tft-4",
        stageId: "stage4",
        title: "TFT Hiring Demo + AI Leverage",
        businessProblem: "Turn the project into a polished demo that feels modern, useful, and interview-ready.",
        skills: ["Storytelling", "Portfolio polish", "Light AI", "Demo readiness"],
        recruiterSummary: "Packaged the strongest project into a calm, persuasive demo with one AI-assisted edge instead of hype.",
        interviewTalkingPoints: "Why you kept the AI layer small, where trust matters, and how this tool would help a real team.",
        benchmarkBoosts: ["interview", "storytelling", "testing"],
        steps: [
          "Write a 3-minute project demo script.",
          "Add one tiny AI helper or explanation layer.",
          "Create an architecture visual or walkthrough card.",
          "Practice 5 likely interview follow-up questions.",
          "Polish the repo or app landing experience.",
          "Use this project in targeted applications and outreach.",
        ],
      },
    ],
  },
  {
    id: "fintech",
    title: "Track B — Product / Fintech Growth Intelligence",
    tagline: "Employer-friendly backup domain that maps cleanly to product, growth, and fintech analytics jobs.",
    projects: [
      {
        id: "fin-1",
        stageId: "stage1",
        title: "Activation Funnel Analysis",
        businessProblem: "Understand where new users drop off between signup, verification, first transaction, and repeat usage.",
        skills: ["SQL", "Excel / Sheets", "Dashboarding", "Business framing"],
        recruiterSummary: "Modeled a product funnel, identified the biggest leak, and turned it into a recruiter-legible business story.",
        interviewTalkingPoints: "North-star metric, drop-off diagnosis, what the chart shows clearly, and what you would explore next.",
        benchmarkBoosts: ["sql", "dashboards", "excel", "storytelling"],
        steps: [
          "Create or source a simple funnel dataset.",
          "Define each stage and the conversion metric clearly.",
          "Write SQL for funnel conversion and biggest drop-off.",
          "Build a decision-ready dashboard view.",
          "Write the plain-English takeaway: what changed, why it matters, and what you noticed.",
        ],
      },
      {
        id: "fin-2",
        stageId: "stage2",
        title: "Growth Metrics Mart Layer",
        businessProblem: "Build trusted KPI tables for activation, retention, and revenue by cohort.",
        skills: ["Modeling", "dbt", "Documentation", "Business metrics"],
        recruiterSummary: "Created clean marts that a growth team could reuse without rewriting logic every week.",
        interviewTalkingPoints: "Metric definitions, table grain, and what tests protect against false wins.",
        benchmarkBoosts: ["modeling", "testing", "storytelling"],
        steps: [
          "Define a base event or transaction model.",
          "Build a cohort retention mart.",
          "Build an activation KPI mart.",
          "Document the metrics and assumptions.",
          "Connect one dashboard tile to the marts.",
        ],
      },
      {
        id: "fin-3",
        stageId: "stage3",
        title: "Scheduled Growth Pipeline",
        businessProblem: "Refresh product KPIs on a schedule so teams do not rely on stale snapshots.",
        skills: ["Pipelines", "Monitoring", "Warehouse", "Communication"],
        recruiterSummary: "Automated product KPI refreshes with enough reliability thinking to be believable in interviews.",
        interviewTalkingPoints: "Freshness, failure modes, validation queries, and downstream trust.",
        benchmarkBoosts: ["pipelines", "testing", "interview"],
        steps: [
          "Ingest daily product activity data.",
          "Load it into a queryable warehouse layer.",
          "Run one transformation path on a schedule.",
          "Add one freshness or anomaly check.",
          "Write the README runbook and diagram.",
        ],
      },
    ],
  },
];

const TABS = [
  { id: "today", label: "Today", icon: Target },
  { id: "quest", label: "Quest Map", icon: Map },
  { id: "projects", label: "Projects", icon: Hammer },
  { id: "gap", label: "Gap Radar", icon: Radar },
  { id: "career", label: "Career HQ", icon: Briefcase },
  { id: "arena", label: "Interview Arena", icon: Swords },
  { id: "badges", label: "Badges", icon: Trophy },
  { id: "activity", label: "Activity", icon: BarChart3 },
];

const STUCK_HINTS = [
  "Nudge",
  "Structure",
  "Example Shape",
  "Answer Pattern",
];

const BLOCKER_COPY = {
  confused: {
    label: "Confused",
    nudge: "Name the exact thing that feels fuzzy. Usually the smallest unclear noun is the real blocker.",
    structure: "Write the input, the output, and the one transformation between them.",
    example: "Example shape: read file -> filter rows -> print count -> save cleaned result.",
    answer: "Pattern: start with a tiny happy-path version, then add one guardrail only after it runs.",
  },
  syntax: {
    label: "Syntax issue",
    nudge: "Don’t solve the whole task. Find the smallest line that fails.",
    structure: "Reduce to one import, one function, one print or query, then expand slowly.",
    example: "Example shape: connect -> inspect columns -> write the simplest working query -> refine.",
    answer: "Pattern: get a minimal valid statement first, then rename and comment once it works.",
  },
  overwhelmed: {
    label: "Overwhelmed",
    nudge: "Shrink the task until it feels almost too easy.",
    structure: "Do only step 1 right now. Ignore steps 2 and 3 until step 1 exists.",
    example: "Example shape: create the file, write the header, save it, stop for 30 seconds.",
    answer: "Pattern: if full task is 90 minutes, build the 12-minute version first and count it as momentum.",
  },
  avoiding: {
    label: "Avoiding",
    nudge: "You do not need motivation. You need a task small enough to begin before your brain negotiates.",
    structure: "Set a 7-minute timer and do the ugliest first draft possible.",
    example: "Example shape: open the repo, make one file, write one query, save, done.",
    answer: "Pattern: start with the part you’d be least embarrassed to delete later.",
  },
  lowEnergy: {
    label: "Low energy",
    nudge: "This is a Recovery Mode day, not a failure day.",
    structure: "Switch to the salvage version and keep the chain alive.",
    example: "Example shape: read the prompt, write the outline, name the next command, stop there.",
    answer: "Pattern: convert the mission from building to preparing, and count preparation as real work today.",
  },
};

function createInitialState() {
  return {
    currentDay: 1,
    journeyStartDate: new Date().toISOString(),
    totalXP: 0,
    streak: 0,
    streakReigniteCount: 0,
    completedCheckpoints: {},
    completedConceptUnits: {},
    completedBosses: {},
    bossAnswers: {},
    completedProjectSteps: {},
    completedProjects: {},
    completedCareerChecklist: {},
    earnedBadges: {},
    activityLog: [],
    xpLog: [],
    mustDoDone: false,
    flowBonusesDone: [false, false, false],
    careerActionDone: false,
    expandedStage: "stage1",
    expandedProject: "tft-1",
    activeTab: "today",
    toasts: [],
    currentMissionSeed: 0,
    activeConceptUnitId: CONCEPT_UNITS[0]?.conceptUnitId || null,
    focusStarted: false,
    flowBonusesExpanded: false,
    dailyRhythmExpanded: false,
    stuckFlow: { open: false, blockerType: "confused", hintLevel: 0 },
    recoveryMode: false,
    confidenceLedger: [],
    checkpointAttempts: {},
    checkpointPhaseProgress: {},
    conceptMastery: {},
    proofByUnitId: {},
    proofDraftsByUnitId: {},
    projectLinksByUnitId: Object.fromEntries(CONCEPT_UNITS.map((unit) => [unit.conceptUnitId, unit.projectStepId])),
    jobPipeline: INITIAL_TARGET_ROLES.map((app) => ({ ...app, status: "planned" })),
    targetDraft: { company: "", role: "", track: "" },
    outreachLog: {},
    interviewPrep: {},
    interviewPromptSeeds: {},
    roadmapBranch: "internship",
    savedProgressMeta: { lastExportedAt: null, lastImportedAt: null },
  };
}

function getEmptyProofDraft() {
  return {
    confidence: "",
    note: "",
  };
}

function migrateLegacyState(parsed) {
  const migrated = {
    ...parsed,
    proofByUnitId: parsed.proofByUnitId || {},
    proofDraftsByUnitId: parsed.proofDraftsByUnitId || {},
  };

  if (!parsed.proofByUnitId && parsed.evidenceByUnitId) {
    Object.entries(parsed.evidenceByUnitId).forEach(([unitId, evidenceEntry]) => {
      const legacyProof = evidenceEntry?.practice || evidenceEntry?.transfer;
      if (!legacyProof) return;
      migrated.proofByUnitId[unitId] = {
        passed: true,
        confidence: "okay",
        note:
          legacyProof.summary ||
          legacyProof.whatBuilt ||
          legacyProof.whatWorked ||
          legacyProof.whatNext ||
          "",
        completedAt: legacyProof.savedAt || Date.now(),
      };
    });
  }

  return migrated;
}

function loadInitialState() {
  if (typeof window === "undefined") return createInitialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    const migrated = migrateLegacyState(parsed);
    return {
      ...createInitialState(),
      ...migrated,
      toasts: [],
    };
  } catch {
    return createInitialState();
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getActiveStage(day) {
  return STAGES.find((stage) => day >= stage.dayRange[0] && day <= stage.dayRange[1]) || STAGES[STAGES.length - 1];
}

function getStageStatus(stage, currentDay, completedBosses) {
  if (completedBosses[stage.id]) return "Complete";
  if (currentDay < stage.dayRange[0]) return "Locked";
  if (currentDay >= stage.dayRange[0] && currentDay <= stage.dayRange[1]) return "Active";
  return "Open";
}

function getCurrentLevel(totalXP) {
  const current = [...LEVELS].reverse().find((level) => totalXP >= level.xp) || LEVELS[0];
  const next = LEVELS.find((level) => level.xp > totalXP) || null;
  const progress = next ? ((totalXP - current.xp) / (next.xp - current.xp)) * 100 : 100;
  return {
    current,
    next,
    progress: clamp(progress, 0, 100),
    remainingXP: next ? Math.max(next.xp - totalXP, 0) : 0,
  };
}

function getDateForDay(journeyStartDate, day) {
  const start = new Date(journeyStartDate);
  const target = new Date(start);
  target.setDate(start.getDate() + (day - 1));
  return target.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function getTodayJourneyDay(journeyStartDate) {
  const start = new Date(journeyStartDate);
  const startMidnight = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.floor((todayMidnight - startMidnight) / (1000 * 60 * 60 * 24));
  return clamp(diff + 1, 1, 90);
}

function getDaySync(journeyStartDate, currentDay) {
  const calendarDay = getTodayJourneyDay(journeyStartDate);
  const delta = currentDay - calendarDay;
  if (delta === 0) {
    return { calendarDay, delta, status: "Synced", note: "Your tracker day matches the calendar." };
  }
  if (delta < 0) {
    return {
      calendarDay,
      delta,
      status: "Behind",
      note: `Calendar says Day ${calendarDay}. You are ${Math.abs(delta)} day${Math.abs(delta) === 1 ? "" : "s"} behind, which is okay. Catch up with one honest mission at a time.`,
    };
  }
  return {
    calendarDay,
    delta,
    status: "Ahead",
    note: `Your tracker is ${delta} day${delta === 1 ? "" : "s"} ahead of the calendar. Use this only if you are planning intentionally, not skipping evidence.`,
  };
}

function formatRelativeTime(timestamp) {
  const diffMs = Date.now() - timestamp;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}

function getFlameState(streak, activityLog) {
  const hadBreak = activityLog.some((entry) => entry.mustDoDone === false);
  if (streak === 0) {
    return hadBreak
      ? { tone: "text-[var(--accent-rose)]", label: "0", sublabel: "Reignite it" }
      : { tone: "text-[var(--text-muted)]", label: "0", sublabel: "Not started yet" };
  }
  if (streak <= 2) return { tone: "text-[var(--text-muted)]", label: String(streak), sublabel: "Dim" };
  if (streak <= 6) return { tone: "text-[var(--accent-orange)]", label: String(streak), sublabel: "Warm-up" };
  return { tone: "text-[var(--xp-gold)]", label: String(streak), sublabel: "Bright" };
}

function computeMomentum(activityLog) {
  const lastSeven = activityLog.slice(-7);
  if (lastSeven.length < 3) {
    return { percent: 0, label: "Not enough data", completed: 0, possible: 0, visible: false };
  }
  const completed = lastSeven.reduce((sum, day) => sum + day.completedTasks, 0);
  const possible = lastSeven.reduce((sum, day) => sum + day.maxTasks, 0);
  const percent = possible ? Math.round((completed / possible) * 100) : 0;
  let label = "Cold";
  if (percent > 70) label = "On Fire";
  else if (percent > 30) label = "Warm";
  return { percent, label, completed, possible, visible: true };
}

function generateDailyMission(day, stage, recoveryMode, seed = 0) {
  const pool = DAILY_TASK_POOLS[stage.id];
  const mustDoIndex = (day - 1 + seed) % pool.mustDos.length;
  const mustDo = pool.mustDos[mustDoIndex];
  const flowBonuses = Array.from({ length: 3 }, (_, index) => pool.flowBonuses[(day - 1 + seed + index) % pool.flowBonuses.length]);
  const careerAction = pool.careerActions[(day - 1 + seed) % pool.careerActions.length];
  const confidencePrompt = recoveryMode
    ? "Small proof counts today. Protect momentum first, then return to the full mission tomorrow."
    : "The goal is not to remember answers. The goal is to leave evidence that you can apply the concept on demand.";
  return {
    mustDo: {
      ...mustDo,
      xp: recoveryMode ? 12 : 20,
      title: recoveryMode ? `Recovery Mode — ${mustDo.salvage}` : mustDo.title,
      microSteps: recoveryMode ? ["Open the task.", "Do the smallest version.", "Log one thing you now understand better."] : mustDo.microSteps,
      buildBlock: recoveryMode ? "If energy returns, continue only one extra step beyond the salvage version." : mustDo.buildBlock,
      practiceBlock: recoveryMode ? "Write a 2-sentence note on what future-you should do next." : mustDo.practiceBlock,
      modeLabel: recoveryMode ? "Recovery mission" : "Core mission",
    },
    flowBonuses,
    careerAction,
    confidencePrompt,
    timeBlocks: [
      { label: "Block 1 · Learn", duration: "60–75 min", detail: mustDo.resource },
      { label: "Block 2 · Build", duration: "60–90 min", detail: mustDo.buildBlock },
      { label: "Block 3 · Explain / Practice", duration: "30–45 min", detail: mustDo.practiceBlock },
    ],
  };
}

function generateCheckpointVariant(templateId, history = { passes: 0, attempts: 0 }) {
  const template = CHECKPOINT_TEMPLATES[templateId];
  const variationIndex = history.attempts % template.datasets.length;
  const modeOrder = ["Learn", "Apply", "Explain", "Transfer"];
  const mode = modeOrder[history.passes % modeOrder.length];
  return {
    mode,
    prompt: `${mode}: Use ${template.datasets[variationIndex]} to ${template.businessQuestions[variationIndex]}. Constraint: ${template.constraints[variationIndex]}`,
  };
}

function getCheckpointSupport(template, variation) {
  const evidenceByMode = {
    Learn: "Capture the first working version plus one sentence on what the concept does.",
    Apply: "Show the working output and one line on how this variation differs from the last one.",
    Explain: "Write or record a plain-English explanation of the logic and business value.",
    Transfer: "Show the new dataset or context plus the adapted solution and one validation check.",
  };
  return {
    evidencePrompt: evidenceByMode[variation.mode] || "Submit the working artifact and a short explanation.",
    rubric: [
      "The work answers the prompt instead of only looking technically correct.",
      "You can explain the grain, logic, or purpose in plain English.",
      "You included one check, caveat, or risk that shows you were thinking critically.",
    ],
  };
}

function deriveConceptMastery(state) {
  const mastery = {};
  Object.entries(CHECKPOINT_TEMPLATES).forEach(([id, template]) => {
    const history = state.checkpointAttempts[id] || { passes: 0, attempts: 0, hintLevelUsed: 0 };
    let status = "Not started";
    if (history.passes >= template.requiredPasses) status = "Interviewable";
    else if (history.attempts > 0 || history.passes > 0) status = "Emerging";
    mastery[id] = {
      passes: history.passes,
      attempts: history.attempts,
      hintLevelUsed: history.hintLevelUsed || 0,
      status,
    };
  });
  return mastery;
}

function computeGapRadar(state) {
  const proofTargets = {
    sql: 4,
    excel: 2,
    python: 3,
    dashboards: 3,
    modeling: 3,
    pipelines: 3,
    testing: 3,
    stats: 2,
    storytelling: 4,
    interview: 4,
  };
  const proofs = COMPANY_BENCHMARKS.reduce((acc, skill) => {
    acc[skill.id] = { points: 0, proofs: [] };
    return acc;
  }, {});

  function addProof(skillId, points, label) {
    if (!proofs[skillId]) return;
    proofs[skillId].points += points;
    if (label) proofs[skillId].proofs.push(label);
  }

  Object.entries(state.checkpointAttempts).forEach(([templateId, history]) => {
    const template = CHECKPOINT_TEMPLATES[templateId];
    if (!template) return;
    const base = history.passes >= template.requiredPasses ? 1.3 : history.attempts > 0 ? 0.6 : 0;
    template.skillTargets.forEach((skillId) => {
      addProof(skillId, base, `${template.title} checkpoint`);
    });
  });

  Object.entries(state.proofByUnitId || {}).forEach(([unitId, proof]) => {
    if (!proof?.passed) return;
    const unit = getConceptUnit(unitId);
    const template = unit ? CHECKPOINT_TEMPLATES[unit.checkpointId] : null;
    if (!template) return;
    const confidenceBoost = proof.confidence === "solid" ? 0.5 : proof.confidence === "okay" ? 0.35 : 0.2;
    template.skillTargets.forEach((skillId) => {
      addProof(skillId, confidenceBoost, `${unit.title} lesson passed`);
    });
  });

  PORTFOLIO_TRACKS.forEach((track) => {
    track.projects.forEach((project) => {
      const completedSteps = project.steps.filter((_, index) => state.completedProjectSteps[`${project.id}-${index}`]).length;
      if (completedSteps > 0) {
        const completionRatio = completedSteps / project.steps.length;
        const boost = completionRatio >= 1 ? 1.4 : completionRatio >= 0.5 ? 0.8 : 0.35;
        project.benchmarkBoosts.forEach((skillId) => {
          addProof(skillId, boost, `${project.title} project work`);
        });
      }
    });
  });

  Object.entries(state.completedCareerChecklist).forEach(([itemId, done]) => {
    if (!done) return;
    if (itemId === "resume") addProof("interview", 0.8, "Resume updated around proof work");
    if (itemId === "linkedin") addProof("storytelling", 0.5, "LinkedIn positioning updated");
    if (itemId === "projectReadme") {
      addProof("testing", 0.6, "README clarified delivery trust");
      addProof("storytelling", 0.6, "README framed business impact");
    }
    if (itemId === "story") addProof("storytelling", 1, "Public write-up drafted");
    if (itemId === "mock") addProof("interview", 1, "Mock interview completed");
  });

  Object.entries(state.interviewPrep).forEach(([arenaId, done]) => {
    const completedCount = typeof done === "boolean" ? (done ? 1 : 0) : done?.completedSeeds?.length || 0;
    if (!completedCount) return;
    addProof("interview", Math.min(0.9 + (completedCount - 1) * 0.2, 1.5), `Interview Arena: ${arenaId}`);
    if (arenaId === "stakeholder-explain" || arenaId === "dashboard-walkthrough") addProof("storytelling", Math.min(0.7 + (completedCount - 1) * 0.15, 1.2), "Stakeholder communication rep");
    if (arenaId === "sql-drill") addProof("sql", Math.min(0.9 + (completedCount - 1) * 0.2, 1.4), "Timed SQL practice");
  });

  Object.values(state.jobPipeline).forEach((application) => {
    if (application.status === "applied") addProof("interview", 0.25, `${application.company} application submitted`);
    if (application.status === "screen") addProof("interview", 0.45, `${application.company} screen reached`);
    if (application.status === "interview") addProof("interview", 0.7, `${application.company} interview reached`);
  });

  return COMPANY_BENCHMARKS.map((skill) => {
    const target = proofTargets[skill.id] || 3;
    const earned = Math.min(proofs[skill.id].points, target);
    const raw = Math.round((earned / target) * 100);
    let status = "Not Started";
    if (earned >= target) status = "Strong";
    else if (earned >= target * 0.65) status = "Interviewable";
    else if (earned > 0) status = "Emerging";
    const missingCount = Math.max(Math.ceil(target - earned), 0);
    const nextAction =
      raw === 0
        ? "Build first proof"
        : raw < 65
          ? "Add another applied proof"
          : raw < 100
            ? "Practice under interview pressure"
            : "Maintain and explain clearly";
    return {
      ...skill,
      score: raw,
      status,
      nextAction,
      proofsEarned: earned.toFixed(1).replace(/\.0$/, ""),
      proofsTarget: target,
      missingCount,
      missingLabel: missingCount ? `${missingCount} more proof${missingCount === 1 ? "" : "s"} needed` : "Proof target met",
      recentProofs: proofs[skill.id].proofs.slice(0, 3),
    };
  });
}

function getNextSmallestStep(task, blockerType) {
  const copy = BLOCKER_COPY[blockerType] || BLOCKER_COPY.confused;
  return {
    nextStep: task.microSteps?.[0] || "Open the file and write the smallest first line.",
    hints: [copy.nudge, copy.structure, copy.example, copy.answer],
  };
}

function deriveBadgeUnlocks(state, gapRadar) {
  const unlocked = {};
  if (state.completedCheckpoints["stage1-python-csv"]) unlocked.firstScript = true;
  if ((gapRadar.find((skill) => skill.id === "sql") || {}).status === "Interviewable" || (gapRadar.find((skill) => skill.id === "sql") || {}).status === "Strong") unlocked.queryCrafter = true;
  if (state.completedBosses.stage1) unlocked.analystUnlocked = true;
  if (state.completedCheckpoints["stage2-mart-story"]) unlocked.modelBuilder = true;
  if (state.completedBosses.stage2) unlocked.biUnlocked = true;
  if (state.completedCheckpoints["stage3-bigquery"]) unlocked.cloudNative = true;
  if (state.completedBosses.stage3) unlocked.dataEngineerUnlocked = true;
  if (state.completedCheckpoints["stage4-ai-leverage"]) unlocked.aiLeverage = true;
  if (state.streak >= 7) unlocked.onFire = true;
  if (state.streakReigniteCount >= 3) unlocked.reignited = true;
  if (Object.values(state.completedProjects).some(Boolean)) unlocked.shipped = true;
  if (Object.values(state.completedCareerChecklist).filter(Boolean).length === CAREER_CHECKLIST.length) unlocked.hireReady = true;
  if (state.completedCareerChecklist.story) unlocked.storyteller = true;
  if (hasInterviewLog(state.interviewPrep, "take-home-sim") || hasInterviewLog(state.interviewPrep, "sql-drill")) unlocked.firstMock = true;
  if (state.completedCareerChecklist.resume) unlocked.resumeShipped = true;
  if (state.jobPipeline.filter((app) => app.status === "applied" || app.status === "screen" || app.status === "interview").length >= 3) unlocked.appSprint = true;
  if (state.completedProjects["tft-3"] && state.completedProjects["fin-3"]) unlocked.fullStack = true;
  if (state.currentDay >= 90 && state.completedBosses.stage4) unlocked.questComplete = true;
  return unlocked;
}

function getStageCheckpointCompletion(stageId, completedCheckpoints) {
  const stage = STAGES.find((entry) => entry.id === stageId);
  return stage.checkpointIds.filter((id) => completedCheckpoints[id]).length;
}

function getStatusPillClasses(status) {
  if (status === "Complete") return "bg-[var(--accent-sage-light)] text-[var(--accent-sage-deep)]";
  if (status === "Active") return "bg-[var(--accent-indigo-light)] text-[var(--accent-indigo)]";
  if (status === "Open") return "bg-[var(--bg-subtle)] text-[var(--text-secondary)]";
  return "bg-[var(--bg-subtle)] text-[var(--text-muted)]";
}

function getProjectDeliverable(project) {
  if (project.stageId === "stage1") {
    return "A clean personal project with a small dataset, a notebook or SQL file, one dashboard view, and a short write-up showing what you found.";
  }
  if (project.stageId === "stage2") {
    return "A dbt-style analytics layer with staging models, business-ready marts, tests, documentation, and one dashboard built on the trusted tables.";
  }
  if (project.stageId === "stage3") {
    return "A repeatable pipeline with ingestion, orchestration, warehouse loading, reliability checks, and a README or diagram that explains the whole flow clearly.";
  }
  return "A polished analyst workflow that shows how AI helps you move faster while you still verify the final SQL, analysis, and stakeholder-facing output yourself.";
}

function getProjectImportance(project) {
  if (project.stageId === "stage1") {
    return "This matters because it proves you can go from messy data to a finished personal project that another person can understand.";
  }
  if (project.stageId === "stage2") {
    return "This matters because BI, BIE, and Analytics Engineering roles care about trusted tables, repeatable metrics, and work that does not break when the question changes.";
  }
  if (project.stageId === "stage3") {
    return "This matters because stronger internships increasingly expect you to show reliability, not just analysis. A dashboard is useless if the data pipeline fails silently.";
  }
  return "This matters because companies increasingly want analysts who can use AI critically, speed up their workflow, and still protect quality.";
}

function formatXP(amount) {
  return amount > 0 ? `+${amount}` : `${amount}`;
}

function getArenaPrompt(item, seed = 0) {
  const prompts = item.prompts && item.prompts.length ? item.prompts : [item.prompt];
  return prompts[((seed % prompts.length) + prompts.length) % prompts.length];
}

function getGapGuidance(skillId) {
  const guides = {
    sql: ["Pass SQL checkpoints", "Write one real project query", "Do one timed SQL drill"],
    excel: ["Finish the spreadsheet drill", "Use a pivot table in one project", "Write one clear takeaway from the sheet"],
    python: ["Pass the CSV or API checkpoint", "Use Python in a project step", "Explain one script without peeking"],
    dashboards: ["Build one real dashboard view", "Walk it through out loud", "Use it in a project story"],
    modeling: ["Pass a marts checkpoint", "Define grain clearly", "Build one trusted model layer"],
    pipelines: ["Land data on schedule", "Add one reliability check", "Explain one failure mode clearly"],
    testing: ["Add one validation or dbt test", "Write assumptions in the README", "Log one risk you protected against"],
    stats: ["Interpret a trend carefully", "Use one comparison metric", "Explain one caveat or limit"],
    storytelling: ["Write a short project story", "Explain the result in plain English", "Practice one stakeholder summary"],
    interview: ["Log one mock or drill", "Refresh one prompt", "Practice under a timer"],
  };
  return guides[skillId] || ["Build one proof", "Explain it clearly", "Repeat under pressure"];
}

function getInterviewLogCount(interviewPrep) {
  return Object.values(interviewPrep).reduce((sum, entry) => {
    if (!entry) return sum;
    if (typeof entry === "boolean") return sum + 1;
    return sum + (entry.completedSeeds?.length || 0);
  }, 0);
}

function hasInterviewLog(interviewPrep, itemId) {
  const entry = interviewPrep[itemId];
  if (!entry) return false;
  if (typeof entry === "boolean") return entry;
  return (entry.completedSeeds?.length || 0) > 0;
}

function getCheckpointStarterNote(templateId) {
  const notes = {
    "stage1-python-csv": "Use any CSV you already have. If you do not have one yet, make a tiny 10-15 row CSV by hand and practice on that.",
    "stage1-api-json": "If your project data does not exist yet, use Open-Meteo or any simple public JSON API first.",
    "stage1-sql-window": "If your project tables do not exist yet, use SQLZoo, DataLemur, or a tiny DuckDB table you create yourself.",
    "stage2-dbt-staging": "If you do not have real project raw data yet, use a mock CSV or JSON file and pretend it is your raw layer.",
    "stage2-mart-story": "Start with a toy mart first. The goal is learning grain and clarity, not waiting for perfect source data.",
    "stage2-sql-explain": "You can practice this with your own SQL, a DataLemur solution, or a small sample business table.",
    "stage3-airflow": "If your full project is not ready, build the orchestration shape on a tiny dummy pipeline first.",
    "stage3-bigquery": "Use public datasets or a tiny sample file if your own pipeline data is not live yet.",
    "stage3-docker": "Start with one script and one container. You do not need the whole system ready to earn this rep.",
    "stage4-hiring-demo": "Use whichever project feels most real right now. The point is a clean explanation, not a perfect product.",
    "stage4-ai-leverage": "Use your existing SQL, dashboard, or notes. Do not wait for a special AI project.",
  };
  return notes[templateId] || "Use the smallest real or sample artifact you already have. Do not wait for a perfect project setup.";
}

function getRecommendedCheckpoint(stage, state) {
  const checkpointId = stage.checkpointIds.find((id) => !state.completedCheckpoints[id]) || stage.checkpointIds[0];
  const template = CHECKPOINT_TEMPLATES[checkpointId];
  const history = state.checkpointAttempts[checkpointId] || { passes: 0, attempts: 0, hintLevelUsed: 0 };
  const variation = generateCheckpointVariant(checkpointId, history);
  return {
    checkpointId,
    template,
    history,
    variation,
    starterNote: getCheckpointStarterNote(checkpointId),
  };
}

function getConceptUnit(unitId) {
  return CONCEPT_UNITS.find((unit) => unit.conceptUnitId === unitId) || null;
}

function getConceptUnitsForStage(stageId) {
  return CONCEPT_UNITS.filter((unit) => unit.stageId === stageId);
}

function getProjectsForStage(stageId) {
  return PORTFOLIO_TRACKS.flatMap((track) => track.projects).filter((project) => project.stageId === stageId);
}

function getNextIncompleteConceptUnitId(completedConceptUnits) {
  return CONCEPT_UNITS.find((unit) => !completedConceptUnits[unit.conceptUnitId])?.conceptUnitId || CONCEPT_UNITS[CONCEPT_UNITS.length - 1]?.conceptUnitId || null;
}

function isConceptUnitUnlocked(unit, completedConceptUnits) {
  const index = CONCEPT_UNITS.findIndex((entry) => entry.conceptUnitId === unit.conceptUnitId);
  if (index <= 0) return true;
  return CONCEPT_UNITS.slice(0, index).every((entry) => completedConceptUnits[entry.conceptUnitId]);
}

function getProofRecord(state, unitId) {
  return (
    state.proofByUnitId?.[unitId] || {
      passed: false,
      confidence: "",
      note: "",
      completedAt: null,
    }
  );
}

function getCurrentPhaseForCheckpoint(state, checkpointId) {
  if (state.completedCheckpoints?.[checkpointId]) return "complete";
  const matchingUnit = CONCEPT_UNITS.find((unit) => unit.checkpointId === checkpointId && state.completedConceptUnits?.[unit.conceptUnitId]);
  return matchingUnit ? "transfer" : "practice";
}

function deriveCompletedCheckpoints(proofByUnitId, completedProjectSteps) {
  return Object.fromEntries(
    Object.keys(CHECKPOINT_TEMPLATES).map((checkpointId) => {
      const units = CONCEPT_UNITS.filter((unit) => unit.checkpointId === checkpointId);
      const complete = units.some((unit) => {
        const proof = proofByUnitId?.[unit.conceptUnitId];
        if (!proof?.passed) return false;
        if (!unit.projectStepId) return true;
        const projectRef = parseProjectStepRef(unit.projectStepId);
        return projectRef ? getProjectStepState(projectRef.project.id, projectRef.stepIndex, completedProjectSteps) : true;
      });
      return [checkpointId, complete];
    }),
  );
}

function getCheckpointDelta(previousCompletedCheckpoints, proofByUnitId, completedProjectSteps) {
  const nextCompletedCheckpoints = deriveCompletedCheckpoints(proofByUnitId, completedProjectSteps);
  const gained = Object.keys(nextCompletedCheckpoints).filter((checkpointId) => nextCompletedCheckpoints[checkpointId] && !previousCompletedCheckpoints?.[checkpointId]);
  const lost = Object.keys(previousCompletedCheckpoints || {}).filter((checkpointId) => previousCompletedCheckpoints[checkpointId] && !nextCompletedCheckpoints[checkpointId]);
  return {
    nextCompletedCheckpoints,
    gained,
    lost,
  };
}

function getConfidenceLabel(confidence) {
  return CONFIDENCE_OPTIONS.find((option) => option.id === confidence)?.label || "Not rated";
}

function getUnitProgress(unit, state) {
  const proof = getProofRecord(state, unit.conceptUnitId);
  const practicePassed = !!proof.passed;
  const projectRef = parseProjectStepRef(unit.projectStepId);
  const transferPassed = practicePassed && (projectRef ? getProjectStepState(projectRef.project.id, projectRef.stepIndex, state.completedProjectSteps) : !!state.completedCheckpoints?.[unit.checkpointId]);
  const practiceStatus = practicePassed ? `Passed · ${getConfidenceLabel(proof.confidence)}` : "Not started";
  const transferUnlocked = practicePassed;
  const transferStatus = !transferUnlocked ? "Locked" : transferPassed ? "Passed" : "Waiting for linked project step";
  const currentPhase = !practicePassed ? "practice" : transferPassed ? "complete" : "transfer";
  return {
    practiceStatus,
    transferStatus,
    currentPhase,
    currentProof: proof.passed ? proof : null,
    proof,
    transferUnlocked,
    practicePassed,
    transferPassed,
    isComplete: !!state.completedConceptUnits?.[unit.conceptUnitId],
  };
}

function getProofPreview(proof) {
  if (!proof?.passed) return null;
  const parts = [getConfidenceLabel(proof.confidence)];
  if (proof.note?.trim()) parts.push(proof.note.trim());
  if (proof.completedAt) parts.push(formatRelativeTime(proof.completedAt));
  return parts.join(" · ");
}

function parseProjectStepRef(stepRef) {
  if (!stepRef) return null;
  const [projectId, rawIndex] = stepRef.split("|");
  const stepIndex = Number(rawIndex);
  const project = PORTFOLIO_TRACKS.flatMap((track) => track.projects).find((entry) => entry.id === projectId);
  if (!project || Number.isNaN(stepIndex)) return null;
  return {
    project,
    stepIndex,
    stepLabel: project.steps[stepIndex],
  };
}

function getProjectStepState(projectId, stepIndex, completedProjectSteps) {
  return !!completedProjectSteps[`${projectId}-${stepIndex}`];
}

function getFocusedProject(stageId, state) {
  const stageProjects = getProjectsForStage(stageId);
  const expanded = stageProjects.find((project) => project.id === state.expandedProject);
  if (expanded) return expanded;
  return stageProjects.find((project) => project.steps.some((_, index) => !getProjectStepState(project.id, index, state.completedProjectSteps))) || stageProjects[0] || null;
}

function getNextMappedProjectStep(project, stageId, state) {
  if (!project) return null;
  const stageUnits = getConceptUnitsForStage(stageId);
  const mappedIndices = new Set(
    stageUnits
      .filter((unit) => unit.projectStepId?.startsWith(`${project.id}|`))
      .map((unit) => Number(unit.projectStepId.split("|")[1])),
  );
  const nextMappedIndex = project.steps.findIndex((_, index) => mappedIndices.has(index) && !getProjectStepState(project.id, index, state.completedProjectSteps));
  if (nextMappedIndex >= 0) {
    return {
      projectId: project.id,
      stepIndex: nextMappedIndex,
      stepLabel: project.steps[nextMappedIndex],
      mapped: true,
    };
  }
  const nextAnyIndex = project.steps.findIndex((_, index) => !getProjectStepState(project.id, index, state.completedProjectSteps));
  if (nextAnyIndex >= 0) {
    return {
      projectId: project.id,
      stepIndex: nextAnyIndex,
      stepLabel: project.steps[nextAnyIndex],
      mapped: false,
    };
  }
  return {
    projectId: project.id,
    stepIndex: project.steps.length - 1,
    stepLabel: project.steps[project.steps.length - 1],
    mapped: false,
  };
}

function getTrackUnits(resourceTrackId) {
  return CONCEPT_UNITS.filter((unit) => unit.resourceTrackId === resourceTrackId).sort((a, b) => a.resourceTrackOrder - b.resourceTrackOrder);
}

function getTrackProgress(unit, completedConceptUnits) {
  const trackUnits = getTrackUnits(unit.resourceTrackId);
  const completed = trackUnits.filter((entry) => completedConceptUnits?.[entry.conceptUnitId]).length;
  const nextUnit = trackUnits.find((entry) => !completedConceptUnits?.[entry.conceptUnitId]);
  return {
    completed,
    total: trackUnits.length,
    nextUnit,
  };
}

function getTrackExitRule(resourceTrackId) {
  const rules = {
    "stage1-python-track": "Leave this track only after the file-handling prep slice feels steady and your first pandas rep works without panic.",
    "stage1-sql-track": "Leave this track once SQLZoo fundamentals are stable and the harder reps can shift into DataLemur-style business practice.",
    "stage2-modeling-track": "Leave this track once you can explain raw, staging, marts, and grain in plain language without bluffing.",
    "stage2-dbt-track": "Leave this track once the first fundamentals module is done and you can mirror the structure in your own project notes.",
    "stage3-pipeline-track": "Leave this track after the Zoomcamp spine reaches the warehouse slice in order, not before.",
    "stage4-ai-track": "Leave this track once you can show one real analyst workflow where AI helps but human review still owns the output.",
  };
  return rules[resourceTrackId] || "Leave this track once the final app-defined segment is complete.";
}

function getPrimaryStageProject(stageId) {
  return getProjectsForStage(stageId)[0] || null;
}

function countProjectStepsDone(project, completedProjectSteps) {
  if (!project) return 0;
  return project.steps.filter((_, index) => completedProjectSteps[`${project.id}-${index}`]).length;
}

function getStageReadyOutcome(stageId) {
  const map = {
    stage1: "You can credibly say you can clean small datasets, answer basic business questions, and turn one analysis into a usable dashboard view.",
    stage2: "You can credibly say you understand how trusted analytics tables are shaped, documented, and used in BI-style reporting.",
    stage3: "You can credibly say you can move from one-off analysis into a repeatable, reliability-aware data workflow.",
    stage4: "You can credibly say you use AI to speed up analyst work without blindly trusting the output.",
  };
  return map[stageId] || "You can credibly explain what this stage prepared you to do.";
}

function getStrictGateMap(stageId) {
  const map = {
    stage1: [
      { id: "lessons", label: "All Stage 1 lesson slices passed" },
      { id: "project", label: "One polished Stage 1 project path mostly built" },
      { id: "sql", label: "Beginner SQL checkpoint passed without lookup dependence" },
      { id: "dashboard", label: "One usable dashboard view exists" },
      { id: "explain", label: "You can explain one analysis calmly in plain business English" },
    ],
    stage2: [
      { id: "lessons", label: "All Stage 2 lesson slices passed" },
      { id: "project", label: "Core BI / dbt / mart project mostly built" },
      { id: "dbt", label: "You can explain staging, marts, grain, and trust checks" },
      { id: "sql", label: "Medium SQL reps are repeatable and explainable" },
      { id: "dashboard", label: "One dashboard sits on top of a trusted mart-style layer" },
    ],
    stage3: [
      { id: "lessons", label: "All Stage 3 lesson slices passed" },
      { id: "project", label: "One repeatable ingest-to-query workflow mostly built" },
      { id: "reliability", label: "You can explain failure points, trust checks, and warehouse usage" },
      { id: "ops", label: "One containerized or orchestrated project path exists" },
      { id: "demo", label: "You can demo the pipeline clearly in interview language" },
    ],
    stage4: [
      { id: "lessons", label: "All Stage 4 lesson slices passed" },
      { id: "project", label: "One AI-assisted analyst workflow is tied into your project story" },
      { id: "critical", label: "You can explain one place where AI helped and one place you corrected it" },
    ],
  };
  return map[stageId] || [];
}

function getStrictStageAudit(stageId, state, readiness) {
  const project = readiness.primaryProject;
  const projectStepsDone = readiness.projectStepsDone;
  const interviewReps = getInterviewLogCount(state.interviewPrep || {});
  const hasStoryProof = !!state.completedCareerChecklist?.projectReadme || !!state.completedCareerChecklist?.story;
  const hasMock = !!state.completedCareerChecklist?.mock || interviewReps > 0;
  const gatesById = {
    stage1: {
      lessons: readiness.lessonsPassed === readiness.lessonsTotal,
      project: projectStepsDone >= 4,
      sql: !!state.completedCheckpoints?.["stage1-sql-window"],
      dashboard: !!getProjectStepState("tft-1", 4, state.completedProjectSteps || {}),
      explain: !!state.completedCheckpoints?.["stage1-python-csv"] || hasStoryProof,
    },
    stage2: {
      lessons: readiness.lessonsPassed === readiness.lessonsTotal,
      project: projectStepsDone >= 5,
      dbt: !!state.completedCheckpoints?.["stage2-dbt-staging"] && !!state.completedCheckpoints?.["stage2-mart-story"],
      sql: !!state.completedCheckpoints?.["stage2-sql-explain"],
      dashboard: !!getProjectStepState("tft-2", 5, state.completedProjectSteps || {}) || !!getProjectStepState("fin-2", 4, state.completedProjectSteps || {}),
    },
    stage3: {
      lessons: readiness.lessonsPassed === readiness.lessonsTotal,
      project: projectStepsDone >= 5,
      reliability: !!state.completedCheckpoints?.["stage3-airflow"] && !!state.completedCheckpoints?.["stage3-bigquery"],
      ops: !!state.completedCheckpoints?.["stage3-docker"] || !!getProjectStepState("tft-3", 5, state.completedProjectSteps || {}),
      demo: hasMock && hasStoryProof,
    },
    stage4: {
      lessons: readiness.lessonsPassed === readiness.lessonsTotal,
      project: projectStepsDone >= 4,
      critical: !!state.completedCheckpoints?.["stage4-ai-leverage"] && (hasMock || interviewReps > 0),
    },
  };
  const stageGateState = gatesById[stageId] || {};
  const gates = getStrictGateMap(stageId).map((gate) => ({
    ...gate,
    done: !!stageGateState[gate.id],
  }));
  const completedGateCount = gates.filter((gate) => gate.done).length;

  const auditMap = {
    stage1: {
      strictVerdict: "Not hireable yet for top-tech DA / BA / BIE internships",
      stretchVerdict: completedGateCount >= 4 ? "Good enough to begin applying selectively to broader analyst internships" : "Still foundation-building only",
      biggestGap: "You still need stronger modeling/reporting maturity, faster SQL, and more repeatable proof work.",
      headline: "Foundation stage only",
    },
    stage2: {
      strictVerdict: completedGateCount === gates.length ? "Borderline top-tech BI / BIE / AE intern candidate" : "Promising, but still not strict-bar ready",
      stretchVerdict: completedGateCount >= 4 ? "Reasonable to start targeting BI / BIE / AE internships more seriously" : "Still building the core BI layer",
      biggestGap: "The weak point is still automation / reliability depth and whether you can explain the work under pressure.",
      headline: "First real interviewable stage",
    },
    stage3: {
      strictVerdict: completedGateCount === gates.length ? "Real BIE / AE / DE-lite intern candidate" : "Close, but still short of the strict systems bar",
      stretchVerdict: completedGateCount >= 4 ? "Strong enough to target BIE / AE / DE-lite internships" : "Systems layer still needs more proof",
      biggestGap: "Full DE depth is still missing; README clarity and calm demos still decide conversion.",
      headline: "Systems stage",
    },
    stage4: {
      strictVerdict: completedGateCount === gates.length ? "Helpful differentiator, not the main hiring reason" : "Useful leverage stage, but not core hiring proof yet",
      stretchVerdict: "AI workflow polish can strengthen demos, but it should never replace the core analyst / BI / pipeline proof.",
      biggestGap: "This stage only helps if it stays grounded in real analyst workflow and critical review.",
      headline: "Differentiator stage",
    },
  };

  return {
    ...auditMap[stageId],
    gates,
    completedGateCount,
    totalGateCount: gates.length,
  };
}

function getStageReadiness(stageId, state) {
  const stage = STAGES.find((entry) => entry.id === stageId);
  const units = getConceptUnitsForStage(stageId);
  const lessonsPassed = units.filter((unit) => state.completedConceptUnits?.[unit.conceptUnitId]).length;
  const primaryProject = getPrimaryStageProject(stageId);
  const projectStepsDone = countProjectStepsDone(primaryProject, state.completedProjectSteps || {});
  const projectStepsTotal = primaryProject?.steps.length || 0;
  const requiredProjectStepsMap = {
    stage1: 4,
    stage2: 5,
    stage3: 5,
    stage4: 4,
  };
  const requiredProjectSteps = projectStepsTotal ? Math.min(requiredProjectStepsMap[stageId] || Math.ceil(projectStepsTotal * 0.7), projectStepsTotal) : 0;
  const lessonsReady = lessonsPassed === units.length;
  const projectReady = projectStepsTotal ? projectStepsDone >= requiredProjectSteps : true;
  const readyEnough = lessonsReady && projectReady;
  const readinessBase = {
    stage,
    lessonsPassed,
    lessonsTotal: units.length,
    primaryProject,
    projectStepsDone,
    projectStepsTotal,
    requiredProjectSteps,
    readyEnough,
    readyRule: projectStepsTotal
      ? `Ready enough = all ${units.length} lesson slices passed + at least ${requiredProjectSteps}/${projectStepsTotal} core project steps completed.`
      : `Ready enough = all ${units.length} lesson slices passed.`,
    outcome: getStageReadyOutcome(stageId),
  };
  const strictAudit = getStrictStageAudit(stageId, state, readinessBase);
  return {
    ...readinessBase,
    strictAudit,
  };
}

function getProjectDrivenConceptUnit(stageId, state) {
  const focusedProject = getFocusedProject(stageId, state);
  const nextStep = getNextMappedProjectStep(focusedProject, stageId, state);
  const stageUnits = getConceptUnitsForStage(stageId);
  if (nextStep?.mapped) {
    const matchingUnit = stageUnits.find(
      (unit) => unit.projectStepId === `${focusedProject.id}|${nextStep.stepIndex}` && !state.completedConceptUnits?.[unit.conceptUnitId],
    );
    if (matchingUnit) {
      return { unit: matchingUnit, project: focusedProject, step: nextStep };
    }
  }
  const fallbackStageUnit = stageUnits.find((unit) => !state.completedConceptUnits?.[unit.conceptUnitId]);
  if (fallbackStageUnit) {
    return { unit: fallbackStageUnit, project: focusedProject, step: nextStep };
  }
  const globalFallback = CONCEPT_UNITS.find((unit) => !state.completedConceptUnits?.[unit.conceptUnitId]) || CONCEPT_UNITS[0] || null;
  return { unit: globalFallback, project: focusedProject, step: nextStep };
}

function scoreLegend(day) {
  if (day.flowBonuses === 3 && day.mustDoDone) return { color: "var(--accent-sage-deep)", label: "Must Do + all flow bonuses" };
  if (day.flowBonuses >= 1 && day.mustDoDone) return { color: "var(--accent-sage)", label: "Must Do + 1–2 flow bonuses" };
  if (day.mustDoDone) return { color: "var(--accent-sage-light)", label: "Must Do only" };
  return { color: "var(--border)", label: "Day passed, no mission logged" };
}

export default function App() {
  const [state, setState] = useState(loadInitialState);
  const fileInputRef = useRef(null);
  const levelRef = useRef(LEVELS[0].level);

  const activeStage = useMemo(() => getActiveStage(state.currentDay), [state.currentDay]);
  const currentLevel = useMemo(() => getCurrentLevel(state.totalXP), [state.totalXP]);
  const momentum = useMemo(() => computeMomentum(state.activityLog), [state.activityLog]);
  const daySync = useMemo(() => getDaySync(state.journeyStartDate, state.currentDay), [state.currentDay, state.journeyStartDate]);
  const mission = useMemo(
    () => generateDailyMission(state.currentDay, activeStage, state.recoveryMode, state.currentMissionSeed),
    [activeStage, state.currentDay, state.currentMissionSeed, state.recoveryMode],
  );
  const recommendedCheckpoint = useMemo(() => getRecommendedCheckpoint(activeStage, state), [activeStage, state]);
  const conceptMastery = useMemo(() => deriveConceptMastery(state), [state]);
  const gapRadar = useMemo(() => computeGapRadar(state), [state]);
  const projectDrivenFocus = useMemo(() => getProjectDrivenConceptUnit(activeStage.id, state), [activeStage.id, state]);
  const firstIncompleteConceptUnitId = useMemo(() => getNextIncompleteConceptUnitId(state.completedConceptUnits || {}), [state.completedConceptUnits]);
  const activeConceptUnit = useMemo(
    () => {
      const selected = getConceptUnit(state.activeConceptUnitId);
      if (
        selected &&
        !state.completedConceptUnits?.[selected.conceptUnitId] &&
        selected.stageId === activeStage.id
      ) {
        return selected;
      }
      return projectDrivenFocus.unit || getConceptUnit(firstIncompleteConceptUnitId);
    },
    [activeStage.id, firstIncompleteConceptUnitId, projectDrivenFocus.unit, state.activeConceptUnitId, state.completedConceptUnits],
  );
  const activeConceptStage = useMemo(
    () => STAGES.find((stage) => stage.id === activeConceptUnit?.stageId) || activeStage,
    [activeConceptUnit, activeStage],
  );
  const activeConceptProgress = useMemo(
    () => (activeConceptUnit ? getUnitProgress(activeConceptUnit, state) : null),
    [activeConceptUnit, state],
  );
  const activeProjectStep = useMemo(
    () => {
      if (projectDrivenFocus.project && projectDrivenFocus.step) {
        return {
          project: projectDrivenFocus.project,
          stepIndex: projectDrivenFocus.step.stepIndex,
          stepLabel: projectDrivenFocus.step.stepLabel,
          mapped: projectDrivenFocus.step.mapped,
        };
      }
      return activeConceptUnit ? parseProjectStepRef(activeConceptUnit.projectStepId) : null;
    },
    [activeConceptUnit, projectDrivenFocus.project, projectDrivenFocus.step],
  );
  const latestActiveEvidencePreview = useMemo(
    () => (activeConceptProgress ? getProofPreview(activeConceptProgress.currentProof) : null),
    [activeConceptProgress],
  );
  const activeTrackProgress = useMemo(
    () => (activeConceptUnit ? getTrackProgress(activeConceptUnit, state.completedConceptUnits || {}) : null),
    [activeConceptUnit, state.completedConceptUnits],
  );
  const activeTrackExitRule = useMemo(
    () => (activeConceptUnit ? getTrackExitRule(activeConceptUnit.resourceTrackId) : ""),
    [activeConceptUnit],
  );
  const activeStageReadiness = useMemo(
    () => getStageReadiness(activeConceptStage.id, state),
    [activeConceptStage.id, state],
  );

  useEffect(() => {
    setState((previous) => {
      const nextBadges = deriveBadgeUnlocks(previous, gapRadar);
      const missingBadges = Object.keys(nextBadges).filter((badgeId) => nextBadges[badgeId] && !previous.earnedBadges[badgeId]);
      if (!missingBadges.length) return previous;
      const now = Date.now();
      const earnedBadges = { ...previous.earnedBadges };
      const toasts = [...previous.toasts];
      missingBadges.forEach((badgeId) => {
        const badge = BADGES.find((entry) => entry.id === badgeId);
        earnedBadges[badgeId] = { earned: true, date: `Day ${previous.currentDay}` };
        if (badge) {
          toasts.push({
            id: `${badgeId}-${now}`,
            title: `Badge Unlocked: ${badge.name}`,
            description: `${badge.icon} A new proof just landed.`,
          });
          setTimeout(() => {
            setState((current) => ({
              ...current,
              toasts: current.toasts.filter((toast) => toast.id !== `${badgeId}-${now}`),
            }));
          }, 3000);
        }
      });
      return { ...previous, earnedBadges, toasts };
    });
  }, [gapRadar, state.currentDay]);

  useEffect(() => {
    if (currentLevel.current.level > levelRef.current) {
      const toastId = `level-${currentLevel.current.level}-${Date.now()}`;
      setState((previous) => ({
        ...previous,
        toasts: [
          ...previous.toasts,
          {
            id: toastId,
            title: `Level Up! ${currentLevel.current.title}`,
            description: `You are now Level ${currentLevel.current.level}.`,
          },
        ],
      }));
      setTimeout(() => {
        setState((current) => ({
          ...current,
          toasts: current.toasts.filter((toast) => toast.id !== toastId),
        }));
      }, 3000);
    }
    levelRef.current = currentLevel.current.level;
  }, [currentLevel]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const persistableState = {
      ...state,
      toasts: [],
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistableState));
  }, [state]);

  useEffect(() => {
    if (!activeConceptUnit || state.activeConceptUnitId === activeConceptUnit.conceptUnitId) return;
    setState((previous) => ({ ...previous, activeConceptUnitId: activeConceptUnit.conceptUnitId }));
  }, [activeConceptUnit, state.activeConceptUnitId]);

  function pushToast(title, description) {
    const toastId = `${title}-${Date.now()}-${Math.random()}`;
    setState((previous) => ({
      ...previous,
      toasts: [...previous.toasts, { id: toastId, title, description }],
    }));
    setTimeout(() => {
      setState((current) => ({
        ...current,
        toasts: current.toasts.filter((toast) => toast.id !== toastId),
      }));
    }, 3000);
  }

  function addConfidenceEntry(label) {
    setState((previous) => ({
      ...previous,
      confidenceLedger: [
        { id: `${Date.now()}-${Math.random()}`, day: previous.currentDay, label },
        ...previous.confidenceLedger,
      ].slice(0, 12),
    }));
  }

  function addXP(amount, action, extras = {}) {
    setState((previous) => ({
      ...previous,
      totalXP: Math.max(previous.totalXP + amount, 0),
      xpLog: [{ action, xp: amount, day: previous.currentDay, time: Date.now() }, ...previous.xpLog].slice(0, 20),
      ...extras,
    }));
    pushToast(`${formatXP(amount)} XP`, action);
  }

  function selectConceptUnit(unitId) {
    const unit = getConceptUnit(unitId);
    if (!unit || !isConceptUnitUnlocked(unit, state.completedConceptUnits || {})) return;
    setState((previous) => ({
      ...previous,
      activeConceptUnitId: unitId,
      expandedStage: unit.stageId,
    }));
  }

  function startActiveLesson() {
    if (!activeConceptUnit) return;
    setState((previous) => {
      return {
        ...previous,
        focusStarted: true,
        activeConceptUnitId: activeConceptUnit.conceptUnitId,
        expandedStage: activeConceptUnit.stageId,
      };
    });
    pushToast("Lesson started", "Stay inside this slice only. Stop where the card tells you to stop.");
  }

  function updateProofDraft(unitId, field, value) {
    const unit = getConceptUnit(unitId);
    if (!unit) return;
    setState((previous) => ({
      ...previous,
      proofDraftsByUnitId: {
        ...previous.proofDraftsByUnitId,
        [unitId]: {
          ...getEmptyProofDraft(),
          ...(previous.proofDraftsByUnitId[unitId] || {}),
          [field]: value,
        },
      },
    }));
  }

  function passLessonWithProof(unitId) {
    const unit = getConceptUnit(unitId);
    if (!unit) return;
    const existingProof = getProofRecord(state, unitId);
    if (existingProof.passed) {
      pushToast("Lesson already passed", "This lesson already has a saved proof. Move to the next slice or the linked project step.");
      return;
    }
    const draft = state.proofDraftsByUnitId?.[unitId] || getEmptyProofDraft();
    if (!draft.confidence) {
      pushToast("Pick a confidence rating", "Choose shaky, okay, or solid so future-you knows how stable this lesson felt.");
      return;
    }

    const completedAt = Date.now();
    const nextProofByUnitId = {
      ...state.proofByUnitId,
      [unitId]: {
        passed: true,
        confidence: draft.confidence,
        note: draft.note?.trim() || "",
        completedAt,
      },
    };
    const nextCompletedConceptUnits = {
      ...state.completedConceptUnits,
      [unitId]: true,
    };
    const checkpointDelta = getCheckpointDelta(state.completedCheckpoints, nextProofByUnitId, state.completedProjectSteps);
    const nextConceptUnitId =
      CONCEPT_UNITS[CONCEPT_UNITS.findIndex((entry) => entry.conceptUnitId === unitId) + 1]?.conceptUnitId || unitId;
    const bonusXp = checkpointDelta.gained.length * 25;
    const xpLog = [
      ...checkpointDelta.gained.map((checkpointId) => ({
        action: `Checkpoint mastered — ${CHECKPOINT_TEMPLATES[checkpointId]?.title || unit.title}`,
        xp: 25,
        day: state.currentDay,
        time: completedAt,
      })),
      ...state.xpLog,
    ].slice(0, 20);

    setState((previous) => ({
      ...previous,
      totalXP: previous.totalXP + bonusXp,
      xpLog,
      proofByUnitId: nextProofByUnitId,
      proofDraftsByUnitId: {
        ...previous.proofDraftsByUnitId,
        [unitId]: getEmptyProofDraft(),
      },
      completedConceptUnits: nextCompletedConceptUnits,
      completedCheckpoints: checkpointDelta.nextCompletedCheckpoints,
      activeConceptUnitId: nextConceptUnitId,
      focusStarted: false,
    }));

    pushToast("Lesson passed", `${unit.title} is logged as ${getConfidenceLabel(draft.confidence).toLowerCase()}.`);
    if (checkpointDelta.gained.length) {
      pushToast("Checkpoint cleared", `${CHECKPOINT_TEMPLATES[checkpointDelta.gained[0]]?.title} is now complete because the linked project step already exists.`);
    }
    addConfidenceEntry(
      draft.note?.trim()
        ? `${unit.title}: ${draft.note.trim()}`
        : `Passed ${unit.title.toLowerCase()} and rated it ${getConfidenceLabel(draft.confidence).toLowerCase()}.`,
    );
  }

  function completeMustDo() {
    if (state.mustDoDone) return;
    setState((previous) => ({
      ...previous,
      mustDoDone: true,
      focusStarted: true,
      stuckFlow: { ...previous.stuckFlow, open: false },
      totalXP: previous.totalXP + mission.mustDo.xp,
      xpLog: [{ action: `Completed Must Do — Day ${previous.currentDay}`, xp: mission.mustDo.xp, day: previous.currentDay, time: Date.now() }, ...previous.xpLog].slice(0, 20),
      confidenceLedger: [
        {
          id: `${Date.now()}-${Math.random()}`,
          day: previous.currentDay,
          label: previous.recoveryMode ? "Protected momentum with a salvage mission." : mission.confidencePrompt,
        },
        ...previous.confidenceLedger,
      ].slice(0, 12),
    }));
    pushToast(`+${mission.mustDo.xp} XP`, state.recoveryMode ? "Recovery mission complete." : "Must Do complete.");
  }

  function completeFlowBonus(index) {
    if (state.flowBonusesDone[index]) return;
    const updated = [...state.flowBonusesDone];
    updated[index] = true;
    addXP(10, `Flow bonus complete — ${mission.flowBonuses[index]}`, { flowBonusesDone: updated });
  }

  function completeCareerAction() {
    if (state.careerActionDone) return;
    addXP(mission.careerAction.xp, `Career action complete — ${mission.careerAction.title}`, { careerActionDone: true });
  }

  function recordVariationPass(templateId) {
    const template = CHECKPOINT_TEMPLATES[templateId];
    const history = state.checkpointAttempts[templateId] || { passes: 0, attempts: 0, hintLevelUsed: 0 };
    if (state.completedCheckpoints[templateId]) return;
    const nextPasses = history.passes + 1;
    const isComplete = nextPasses >= template.requiredPasses;
    const nextHistory = { ...history, attempts: history.attempts + 1, passes: nextPasses };
    const updates = {
      checkpointAttempts: { ...state.checkpointAttempts, [templateId]: nextHistory },
    };
    if (isComplete) {
      addXP(25, `Checkpoint mastered — ${template.title}`, {
        ...updates,
        completedCheckpoints: { ...state.completedCheckpoints, [templateId]: true },
      });
      addConfidenceEntry(`Mastered ${template.title.toLowerCase()} across multiple variations.`);
    } else {
      setState((previous) => ({
        ...previous,
        ...updates,
      }));
      pushToast("Variation logged", `${template.title} is now ${nextPasses}/${template.requiredPasses}.`);
    }
  }

  function completeBoss(stageId) {
    if (state.completedBosses[stageId]) return;
    addXP(150, `Boss defeated — ${STAGES.find((stage) => stage.id === stageId)?.boss.name}`, {
      completedBosses: { ...state.completedBosses, [stageId]: true },
    });
    pushToast("Boss Defeated", `${STAGES.find((stage) => stage.id === stageId)?.title} is now cleared.`);
    addConfidenceEntry(`Beat the ${STAGES.find((stage) => stage.id === stageId)?.boss.name} and proved the concept under pressure.`);
  }

  function toggleProjectStep(projectId, index) {
    const stepKey = `${projectId}-${index}`;
    const project = PORTFOLIO_TRACKS.flatMap((track) => track.projects).find((entry) => entry.id === projectId);
    const currentlyDone = !!state.completedProjectSteps[stepKey];
    if (currentlyDone) {
      const nextCompletedProjectSteps = { ...state.completedProjectSteps };
      delete nextCompletedProjectSteps[stepKey];
      const nextCompletedProjects = { ...state.completedProjects };
      const checkpointDelta = getCheckpointDelta(state.completedCheckpoints, state.proofByUnitId, nextCompletedProjectSteps);
      let xp = -15;
      if (state.completedProjects[projectId]) {
        delete nextCompletedProjects[projectId];
        xp -= 200;
      }
      xp -= checkpointDelta.lost.length * 25;
      addXP(xp, `Project step unchecked — ${project.title}`, {
        completedProjectSteps: nextCompletedProjectSteps,
        completedProjects: nextCompletedProjects,
        completedCheckpoints: checkpointDelta.nextCompletedCheckpoints,
      });
      return;
    }
    const nextCompletedProjectSteps = { ...state.completedProjectSteps, [stepKey]: true };
    const allDone = project.steps.every((_, stepIndex) => nextCompletedProjectSteps[`${projectId}-${stepIndex}`]);
    const checkpointDelta = getCheckpointDelta(state.completedCheckpoints, state.proofByUnitId, nextCompletedProjectSteps);
    const extras = { completedProjectSteps: nextCompletedProjectSteps };
    let xp = 15 + checkpointDelta.gained.length * 25;
    let action = `Project step complete — ${project.title}`;
    if (allDone && !state.completedProjects[projectId]) {
      xp += 200;
      action = `Full project shipped — ${project.title}`;
      extras.completedProjects = { ...state.completedProjects, [projectId]: true };
      addConfidenceEntry(`Shipped ${project.title} and now have a recruiter-legible proof project.`);
    }
    extras.completedCheckpoints = checkpointDelta.nextCompletedCheckpoints;
    addXP(xp, action, extras);
    checkpointDelta.gained.forEach((checkpointId) => {
      pushToast("Checkpoint cleared", `${CHECKPOINT_TEMPLATES[checkpointId]?.title} is now complete because you transferred the lesson into the linked project step.`);
    });
  }

  function toggleCareerChecklist(itemId) {
    if (state.completedCareerChecklist[itemId]) return;
    const item = CAREER_CHECKLIST.find((entry) => entry.id === itemId);
    addXP(20, `Career checkpoint complete — ${item.title}`, {
      completedCareerChecklist: { ...state.completedCareerChecklist, [itemId]: true },
    });
  }

  function cycleApplicationStatus(applicationId) {
    const application = state.jobPipeline.find((entry) => entry.id === applicationId);
    const currentIndex = APPLICATION_STATUSES.indexOf(application.status);
    const nextStatus = APPLICATION_STATUSES[(currentIndex + 1) % APPLICATION_STATUSES.length];
    const nextPipeline = state.jobPipeline.map((entry) =>
      entry.id === applicationId ? { ...entry, status: nextStatus } : entry,
    );
    const extras = { jobPipeline: nextPipeline };
    if (nextStatus === "applied") {
      addXP(30, `Targeted application logged — ${application.company}`, extras);
    } else {
      setState((previous) => ({ ...previous, ...extras }));
    }
  }

  function updateTargetDraft(field, value) {
    setState((previous) => ({
      ...previous,
      targetDraft: {
        ...previous.targetDraft,
        [field]: value,
      },
    }));
  }

  function addTargetRole() {
    const company = state.targetDraft.company.trim();
    const role = state.targetDraft.role.trim();
    const track = state.targetDraft.track.trim();
    if (!company || !role) {
      pushToast("Target role incomplete", "Add at least a company label and a role before saving it.");
      return;
    }
    setState((previous) => ({
      ...previous,
      jobPipeline: [
        ...previous.jobPipeline,
        {
          id: `target-${Date.now()}`,
          company,
          role,
          track: track || "Custom target",
          status: "planned",
        },
      ],
      targetDraft: { company: "", role: "", track: "" },
    }));
    pushToast("Target role added", "Good. Keep the pipeline current instead of relying on stale examples.");
  }

  function removeTargetRole(applicationId) {
    setState((previous) => ({
      ...previous,
      jobPipeline: previous.jobPipeline.filter((entry) => entry.id !== applicationId),
    }));
  }

  function completeOutreach(itemId) {
    if (state.outreachLog[itemId]) return;
    const item = OUTREACH_LOGS.find((entry) => entry.id === itemId);
    addXP(item.xp, `Outreach logged — ${item.title}`, {
      outreachLog: { ...state.outreachLog, [itemId]: true },
    });
  }

  function toggleArena(itemId) {
    const item = INTERVIEW_ARENA.find((entry) => entry.id === itemId);
    const currentSeed = state.interviewPromptSeeds[itemId] || 0;
    const entry = state.interviewPrep[itemId];
    const completedSeeds = typeof entry === "boolean" ? [0] : entry?.completedSeeds || [];
    if (completedSeeds.includes(currentSeed)) {
      const nextSeeds = completedSeeds.filter((seed) => seed !== currentSeed);
      const nextInterviewPrep = {
        ...state.interviewPrep,
        [itemId]: { completedSeeds: nextSeeds },
      };
      addXP(-item.xp, `Interview rep unchecked — ${item.title}`, {
        interviewPrep: nextInterviewPrep,
      });
      return;
    }
    addXP(item.xp, `Interview Arena complete — ${item.title}`, {
      interviewPrep: {
        ...state.interviewPrep,
        [itemId]: { completedSeeds: [...completedSeeds, currentSeed] },
      },
    });
    addConfidenceEntry(`Practiced ${item.title.toLowerCase()} so interview proof feels more real.`);
  }

  function cycleArenaPrompt(itemId) {
    setState((previous) => ({
      ...previous,
      interviewPromptSeeds: {
        ...previous.interviewPromptSeeds,
        [itemId]: (previous.interviewPromptSeeds[itemId] || 0) + 1,
      },
    }));
  }

  function markDayDone() {
    const completedTasks =
      (state.mustDoDone ? 1 : 0) +
      state.flowBonusesDone.filter(Boolean).length +
      (state.careerActionDone ? 1 : 0);
    const maxTasks = 5;
    const hadPriorDays = state.activityLog.length > 0;
    const brokeYesterday = state.activityLog[state.activityLog.length - 1]?.mustDoDone === false;
    let nextStreak = state.mustDoDone ? state.streak + 1 : 0;
    let nextReigniteCount = 0;
    const xpEvents = [];

    if (state.mustDoDone) {
      if (state.streakReigniteCount > 0 || (state.streak === 0 && hadPriorDays && brokeYesterday)) {
        nextReigniteCount = state.streakReigniteCount + 1;
        if (nextReigniteCount === 3) {
          xpEvents.push({ xp: 50, action: "Streak Reignited! +50 bonus XP" });
          pushToast("Streak Reignited", "Three steady days after the break. Keep going.");
        }
      }
      if (nextStreak === 7) {
        xpEvents.push({ xp: 75, action: "7-day streak! +75 bonus XP" });
        pushToast("7-day streak", "That is real consistency, not luck.");
      }
    } else {
      pushToast("Day advanced", "Streak broke. Tomorrow gets a clean restart.");
    }

    const bonusXp = xpEvents.reduce((sum, entry) => sum + entry.xp, 0);
    setState((previous) => ({
      ...previous,
      currentDay: Math.min(previous.currentDay + 1, 90),
      streak: nextStreak,
      streakReigniteCount: nextReigniteCount,
      totalXP: previous.totalXP + bonusXp,
      xpLog: [...xpEvents.map((entry) => ({ ...entry, day: previous.currentDay, time: Date.now() })), ...previous.xpLog].slice(0, 20),
      activityLog: [
        ...previous.activityLog,
        {
          day: previous.currentDay,
          mustDoDone: previous.mustDoDone,
          flowBonuses: previous.flowBonusesDone.filter(Boolean).length,
          careerActionDone: previous.careerActionDone,
          completedTasks,
          maxTasks,
          keptMomentum: previous.recoveryMode && previous.mustDoDone,
        },
      ],
      mustDoDone: false,
      flowBonusesDone: [false, false, false],
      flowBonusesExpanded: false,
      dailyRhythmExpanded: false,
      careerActionDone: false,
      currentMissionSeed: previous.currentMissionSeed + 1,
      focusStarted: false,
      recoveryMode: false,
      stuckFlow: { open: false, blockerType: "confused", hintLevel: 0 },
    }));
  }

  function toggleRecoveryMode() {
    setState((previous) => ({
      ...previous,
      recoveryMode: !previous.recoveryMode,
      stuckFlow: { ...previous.stuckFlow, open: false },
    }));
  }

  function showStuckFlow(blockerType = state.stuckFlow.blockerType) {
    setState((previous) => ({
      ...previous,
      stuckFlow: { open: true, blockerType, hintLevel: 0 },
    }));
  }

  function stepHintLevel() {
    setState((previous) => ({
      ...previous,
      stuckFlow: {
        ...previous.stuckFlow,
        hintLevel: clamp(previous.stuckFlow.hintLevel + 1, 0, STUCK_HINTS.length - 1),
      },
    }));
  }

  function exportProgress() {
    const payload = JSON.stringify(state, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `data-engineer-quest-day-${state.currentDay}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setState((previous) => ({
      ...previous,
      savedProgressMeta: { ...previous.savedProgressMeta, lastExportedAt: new Date().toISOString() },
    }));
    pushToast("Progress exported", "You now have a checkpoint file you can import later.");
  }

  function importProgress(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      try {
        const parsed = JSON.parse(loadEvent.target?.result);
        setState({
          ...createInitialState(),
          ...parsed,
          savedProgressMeta: {
            ...(parsed.savedProgressMeta || {}),
            lastImportedAt: new Date().toISOString(),
          },
          toasts: [],
        });
        pushToast("Progress imported", "Your tracker state has been restored.");
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...createInitialState(), ...parsed, toasts: [] }));
        }
      } catch (error) {
        pushToast("Import failed", "That file did not parse cleanly as quest progress.");
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  function resetProgress() {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm("Reset the tracker back to Day 1 on this browser?");
      if (!confirmed) return;
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setState(createInitialState());
    pushToast("Progress reset", "You are back at Day 1 in this browser.");
  }

  const focusSupport = getNextSmallestStep(mission.mustDo, state.stuckFlow.blockerType);
  const activityMap = state.activityLog.reduce((acc, entry) => {
    acc[entry.day] = entry;
    return acc;
  }, {});
  const careerChecklistComplete = Object.values(state.completedCareerChecklist).filter(Boolean).length;
  const appliedCount = state.jobPipeline.filter((app) => app.status === "applied" || app.status === "screen" || app.status === "interview").length;
  const outreachCount = Object.values(state.outreachLog).filter(Boolean).length;
  const interviewCount = getInterviewLogCount(state.interviewPrep);
  const flame = getFlameState(state.streak, state.activityLog);
  const activeCheckpointTemplate = activeConceptUnit ? CHECKPOINT_TEMPLATES[activeConceptUnit.checkpointId] : null;
  const activeProofDraft = activeConceptUnit
    ? {
        ...getEmptyProofDraft(),
        ...(state.proofDraftsByUnitId?.[activeConceptUnit.conceptUnitId] || {}),
      }
    : getEmptyProofDraft();
  const activeProofRecord = activeConceptUnit ? getProofRecord(state, activeConceptUnit.conceptUnitId) : null;
  const todayRecipe = activeConceptUnit
    ? [
        {
          number: 1,
          label: "Open",
          detail: `${activeConceptUnit.resourceName} — ${activeConceptUnit.lessonLabel}`,
          subdetail: activeConceptUnit.resourceWhere,
        },
        {
          number: 2,
          label: "Stop here",
          detail: activeConceptUnit.stopAt,
        },
        {
          number: 3,
          label: "Build",
          detail: activeConceptUnit.buildNow,
        },
        {
          number: 4,
          label: "Write",
          detail: activeConceptUnit.writeNow,
        },
        {
          number: 5,
          label: "Mark done",
          detail: "Pick shaky, okay, or solid, then pass the lesson.",
        },
      ]
    : [];
  const nextAfterLesson = activeTrackProgress?.nextUnit && activeTrackProgress.nextUnit.conceptUnitId !== activeConceptUnit?.conceptUnitId
    ? activeTrackProgress.nextUnit.lessonLabel
    : activeProjectStep?.stepLabel || "Move into the linked project step.";

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

        :root {
          --bg-base: #fafaf7;
          --bg-card: #ffffff;
          --bg-subtle: #f2f0eb;
          --border: #e8e4dc;
          --text-primary: #1c1c1e;
          --text-secondary: #5f5a52;
          --text-muted: #8f877b;
          --accent-sage: #8baf8b;
          --accent-sage-light: #c5d9c5;
          --accent-sage-deep: #5c8a5c;
          --accent-rose: #d4a0a0;
          --accent-rose-light: #f0dada;
          --accent-indigo: #8b8fbf;
          --accent-indigo-light: #d4d6f0;
          --accent-orange: #e8956d;
          --xp-gold: #c9a84c;
        }

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: "Plus Jakarta Sans", sans-serif;
          font-weight: 500;
          background:
            radial-gradient(circle at 12% 14%, rgba(197, 217, 197, 0.65), transparent 22%),
            radial-gradient(circle at 88% 10%, rgba(212, 214, 240, 0.8), transparent 24%),
            radial-gradient(circle at 70% 72%, rgba(240, 218, 218, 0.6), transparent 20%),
            radial-gradient(circle at 20% 82%, rgba(232, 149, 109, 0.14), transparent 18%),
            repeating-linear-gradient(90deg, rgba(232, 228, 220, 0.17) 0, rgba(232, 228, 220, 0.17) 1px, transparent 1px, transparent 120px),
            repeating-linear-gradient(0deg, rgba(232, 228, 220, 0.08) 0, rgba(232, 228, 220, 0.08) 1px, transparent 1px, transparent 32px),
            linear-gradient(180deg, #fafaf7 0%, #f7f6f1 100%);
          color: var(--text-primary);
          text-align: left;
        }

        .paper-card {
          background:
            linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.91) 100%),
            radial-gradient(circle at top left, rgba(255,255,255,0.72), transparent 36%);
          border: 1px solid rgba(232, 228, 220, 0.95);
          border-radius: 20px;
          box-shadow:
            0 20px 45px rgba(71, 68, 63, 0.06),
            0 2px 10px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(10px);
        }

        .paper-card::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.45), transparent 36%),
            radial-gradient(circle at 20% 0%, rgba(139, 175, 139, 0.04), transparent 28%),
            repeating-linear-gradient(0deg, rgba(232, 228, 220, 0.04) 0, rgba(232, 228, 220, 0.04) 1px, transparent 1px, transparent 16px);
        }

        .section-kicker {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          color: var(--text-secondary);
        }

        .soft-panel {
          border: 1px solid rgba(232, 228, 220, 0.95);
          background: rgba(242, 240, 235, 0.75);
          border-radius: 18px;
        }

        .ink-border {
          position: relative;
        }

        .ink-border::after {
          content: "";
          position: absolute;
          inset: 8px;
          border: 1px dashed rgba(139, 175, 139, 0.14);
          border-radius: 16px;
          pointer-events: none;
        }

        .floating-wash {
          position: absolute;
          border-radius: 999px;
          filter: blur(24px);
          opacity: 0.6;
          pointer-events: none;
        }

        .title-bloom {
          position: relative;
        }

        .title-bloom::before {
          content: "";
          position: absolute;
          left: -10px;
          top: -8px;
          width: 64px;
          height: 64px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(197, 217, 197, 0.65), transparent 68%);
          filter: blur(10px);
          opacity: 0.9;
          pointer-events: none;
        }

        .stagger-in {
          animation: fade-up 320ms ease both;
        }

        .soft-pulse {
          animation: soft-pulse 2.4s ease-in-out infinite;
        }

        .badge-glow {
          animation: badge-glow 2.4s ease-in-out infinite;
        }

        .boss-ring {
          background: linear-gradient(120deg, rgba(212,214,240,0.65), rgba(233,149,109,0.45), rgba(197,217,197,0.75));
          background-size: 200% 200%;
          animation: drift 8s ease infinite;
        }

        .toast-enter {
          animation: toast-in 280ms ease both;
        }

        .recipe-hero {
          background:
            linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.9) 100%),
            radial-gradient(circle at top right, rgba(212,214,240,0.22), transparent 28%),
            radial-gradient(circle at bottom left, rgba(197,217,197,0.2), transparent 26%);
        }

        .recipe-step {
          position: relative;
          border: 1px solid rgba(232, 228, 220, 0.92);
          background: rgba(255, 255, 255, 0.8);
          border-radius: 18px;
        }

        .ghibli-motes {
          pointer-events: none;
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .ghibli-mote {
          position: absolute;
          border-radius: 999px;
          opacity: 0.28;
          filter: blur(1px);
          animation: float-mote linear infinite;
        }

        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes soft-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(139, 175, 139, 0.2);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(139, 175, 139, 0.05);
          }
        }

        @keyframes badge-glow {
          0%, 100% {
            box-shadow: 0 0 0 rgba(201, 168, 76, 0.0);
          }
          50% {
            box-shadow: 0 0 18px rgba(201, 168, 76, 0.16);
          }
        }

        @keyframes drift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes toast-in {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float-mote {
          0% {
            transform: translate3d(0, 10px, 0);
            opacity: 0;
          }
          15% {
            opacity: 0.24;
          }
          50% {
            transform: translate3d(12px, -18px, 0);
            opacity: 0.3;
          }
          100% {
            transform: translate3d(-8px, -42px, 0);
            opacity: 0;
          }
        }
      `}</style>

      <div className="border-b border-[rgba(232,228,220,0.72)] bg-[rgba(250,250,247,0.82)]">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="title-bloom relative">
            <div className="floating-wash left-8 top-5 h-14 w-14 bg-[rgba(212,214,240,0.55)]" />
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">Calm Learning OS for DA · BI · BIE · AE Paths</p>
            <h1 className="mt-2 max-w-[540px] text-4xl leading-[0.92] sm:text-5xl md:text-6xl" style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.04em" }}>
              Data Engineer Quest
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-[var(--text-secondary)]">
              A calm study companion for building analyst, BI, and pipeline proof without drowning in tabs or fake progress.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:max-w-[390px]">
            <div className="paper-card px-3 py-2">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Day</div>
              <div className="mt-1 text-sm font-semibold">{state.currentDay} / 90</div>
              <div className="mt-1 text-[11px] text-[var(--text-muted)]">Calendar: {daySync.calendarDay}</div>
            </div>
            <div className="paper-card px-3 py-2">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Streak</div>
              <div className={`mt-1 flex items-center gap-1 text-sm font-semibold ${flame.tone}`}>
                <Flame className="h-4 w-4" />
                {flame.label}
              </div>
              <div className="mt-1 text-[11px] text-[var(--text-muted)]">{flame.sublabel}</div>
            </div>
            <div className="paper-card col-span-2 px-3 py-2 sm:col-span-1">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Momentum</div>
              <div className={`mt-1 flex items-center gap-1 text-sm font-semibold ${momentum.visible ? "text-[var(--accent-orange)]" : "text-[var(--text-muted)]"}`}>
                <Flame className="h-4 w-4" />
                {momentum.label}
              </div>
              <div className="mt-1 text-[11px] text-[var(--text-muted)]">{momentum.visible ? `${momentum.percent}% over the last ${Math.min(state.activityLog.length, 7)} logged days` : "Unlocks after 3 logged days"}</div>
            </div>
            <div className="paper-card px-3 py-2">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">XP</div>
              <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-[var(--xp-gold)]">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-mono">{state.totalXP}</span>
              </div>
            </div>
            <div className="paper-card col-span-1 px-3 py-2 sm:col-span-2">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">Level</div>
              <div className="mt-1 text-sm font-semibold">{currentLevel.current.title}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-30 border-b border-[rgba(232,228,220,0.82)] bg-[rgba(250,250,247,0.9)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-2 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = state.activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setState((previous) => ({ ...previous, activeTab: tab.id }))}
                  className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-all duration-200 ${
                    active
                      ? "border-[var(--accent-sage)] bg-[var(--accent-sage-light)] text-[var(--accent-sage-deep)]"
                      : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="self-start rounded-[18px] border border-[var(--border)] bg-white/90 px-4 py-2 text-sm text-[var(--text-secondary)] lg:self-auto">
            <div>Day {state.currentDay} · {currentLevel.current.title}</div>
            <div className="font-mono text-[var(--xp-gold)]">{state.totalXP} XP</div>
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-6 px-4 py-6 sm:px-6">
        <section className={`paper-card ink-border p-5 ${currentLevel.current.milestone ? "badge-glow" : ""}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-sage-light)] text-2xl">
                🍃
              </div>
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Level {currentLevel.current.level}</p>
                <h2 className="text-xl font-semibold">
                  {currentLevel.current.title} {currentLevel.current.milestone ? <span className="text-[var(--xp-gold)]">✦</span> : null}
                </h2>
              </div>
            </div>
            <div className="flex-1">
              <div className="h-3 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                <div
                  className="h-full rounded-full bg-[var(--accent-sage)] transition-all duration-300"
                  style={{ width: `${currentLevel.progress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-[var(--text-secondary)]">
                <span>{currentLevel.next ? `${currentLevel.remainingXP} XP to next level` : "Max level reached"}</span>
                <span className="font-mono">{Math.round(currentLevel.progress)}%</span>
              </div>
            </div>
          </div>
        </section>

        {state.activeTab === "today" && (
          <>
            <section className="stagger-in space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">What do I do right now?</p>
                <h2 className="mt-1 text-2xl font-semibold">Today Recipe</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
                  One lesson, one proof check, then you can stop. This stage is building you toward {activeConceptStage.shortTitle}.
                </p>
              </div>

              {activeConceptUnit && (
                <>
                  <div className="paper-card recipe-hero relative overflow-hidden p-6">
                    <div className="ghibli-motes">
                      <span className="ghibli-mote left-[8%] top-[78%] h-2.5 w-2.5 bg-[rgba(197,217,197,0.8)]" style={{ animationDuration: "16s", animationDelay: "0s" }} />
                      <span className="ghibli-mote left-[18%] top-[65%] h-1.5 w-1.5 bg-[rgba(255,255,255,0.9)]" style={{ animationDuration: "13s", animationDelay: "2s" }} />
                      <span className="ghibli-mote left-[68%] top-[70%] h-2 w-2 bg-[rgba(212,214,240,0.75)]" style={{ animationDuration: "15s", animationDelay: "1s" }} />
                      <span className="ghibli-mote left-[86%] top-[82%] h-1.5 w-1.5 bg-[rgba(240,218,218,0.85)]" style={{ animationDuration: "12s", animationDelay: "3s" }} />
                    </div>
                    <div className="relative">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="max-w-2xl">
                          <p className="section-kicker">Today recipe</p>
                          <h3 className="mt-2 text-3xl font-semibold leading-tight">{activeConceptUnit.title}</h3>
                          <p className="mt-3 text-base leading-8 text-[var(--text-secondary)]">
                            {activeConceptUnit.whyThisMatters}
                          </p>
                        </div>
                        <div className="rounded-[20px] border border-[rgba(232,228,220,0.95)] bg-white/80 px-4 py-3 text-sm text-[var(--text-secondary)]">
                          <p className="section-kicker">Today only</p>
                          <p className="mt-2 font-semibold text-[var(--text-primary)]">{activeConceptUnit.timebox}</p>
                          <p className="mt-1 max-w-[180px] leading-6">Do this slice only. You do not need to finish the whole resource.</p>
                        </div>
                      </div>

                      <div className="mt-5 rounded-[24px] border border-[rgba(232,228,220,0.9)] bg-white/78 p-4 sm:p-5">
                        <div className="space-y-3">
                          {todayRecipe.map((step) => (
                            <div key={step.number} className="recipe-step flex gap-4 px-4 py-4">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent-sage-light)] text-sm font-semibold text-[var(--accent-sage-deep)]">
                                {step.number}
                              </div>
                              <div className="min-w-0">
                                <p className="section-kicker">{step.label}</p>
                                <p className="mt-1 text-base font-semibold leading-7 text-[var(--text-primary)]">{step.detail}</p>
                                {step.subdetail ? (
                                  <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                                    {step.number === 1 && activeConceptUnit.resourceUrl ? (
                                      <a href={activeConceptUnit.resourceUrl} target="_blank" rel="noreferrer" className="underline decoration-[var(--accent-sage-deep)] underline-offset-4">
                                        {step.subdetail}
                                      </a>
                                    ) : (
                                      step.subdetail
                                    )}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 rounded-2xl border border-[var(--accent-sage-light)] bg-[rgba(197,217,197,0.1)] px-4 py-3 text-sm leading-7 text-[var(--text-primary)]">
                          {RESOURCE_RULE}
                        </div>

                        {state.currentDay === 1 && !activeProofRecord?.passed ? (
                          <div className="mt-4 rounded-2xl bg-[rgba(212,214,240,0.14)] px-4 py-3 text-sm leading-7 text-[var(--text-secondary)]">
                            First day tip: do only this recipe, save one honest proof, and stop there. The goal is clarity, not volume.
                          </div>
                        ) : null}

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={startActiveLesson}
                            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-sage)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-sage-deep)]"
                          >
                            <Play className="h-4 w-4" />
                            Continue current path
                          </button>
                          <button
                            type="button"
                            onClick={() => showStuckFlow()}
                            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-secondary)] transition hover:border-[var(--accent-indigo)]"
                          >
                            <Wand2 className="h-4 w-4" />
                            I&apos;m Stuck
                          </button>
                          <button
                            type="button"
                            onClick={toggleRecoveryMode}
                            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-secondary)] transition hover:border-[var(--accent-rose)]"
                          >
                            <RotateCcw className="h-4 w-4" />
                            {state.recoveryMode ? "Exit Recovery Mode" : "Need A Reset"}
                          </button>
                        </div>

                        <div className="mt-4 grid gap-3 lg:grid-cols-2">
                          <div className="rounded-2xl bg-[var(--bg-subtle)] px-4 py-3 text-sm leading-7 text-[var(--text-secondary)]">
                            <p className="section-kicker">After this lesson</p>
                            <p className="mt-2">{nextAfterLesson}</p>
                          </div>
                          <div className="rounded-2xl bg-[var(--bg-subtle)] px-4 py-3 text-sm leading-7 text-[var(--text-secondary)]">
                            <p className="section-kicker">Why the handoff happens</p>
                            <p className="mt-2">{activeTrackExitRule}</p>
                          </div>
                        </div>
                      </div>

                      {state.focusStarted ? (
                        <div className="mt-4 rounded-2xl border border-[var(--accent-sage)] bg-white/80 px-4 py-3 text-sm text-[var(--text-secondary)]">
                          <span className="font-semibold text-[var(--accent-sage-deep)]">Focus session live.</span> Stay inside this recipe until you hit the stop point.
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="paper-card p-4 sm:p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="section-kicker">Checkpoint status</p>
                        <h3 className="mt-1 text-xl font-semibold">{activeCheckpointTemplate?.title}</h3>
                      </div>
                      <div className="rounded-full bg-[var(--bg-subtle)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                        {activeConceptProgress?.currentPhase === "practice"
                          ? "Practice now"
                          : activeConceptProgress?.currentPhase === "transfer"
                            ? "Transfer ready"
                            : "Passed"}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      <div className="rounded-2xl bg-[var(--bg-subtle)] p-4 text-sm text-[var(--text-secondary)]">
                        <p className="section-kicker">What this proves</p>
                        <p className="mt-2 leading-7">{activeCheckpointTemplate?.concept}</p>
                      </div>
                      <div className="rounded-2xl bg-[var(--bg-subtle)] p-4 text-sm text-[var(--text-secondary)]">
                        <p className="section-kicker">What counts as enough</p>
                        <p className="mt-2 leading-7">Finish this lesson honestly, rate how stable it felt, and pass it. The stronger project transfer comes later when you use it in the linked build.</p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm text-[var(--text-secondary)]">
                        <span className="font-semibold text-[var(--text-primary)]">Pass state:</span> {activeConceptProgress?.practiceStatus}
                      </div>
                      <div className="rounded-2xl bg-white px-4 py-3 text-sm text-[var(--text-secondary)]">
                        <span className="font-semibold text-[var(--text-primary)]">Confidence saved:</span> {activeProofRecord?.passed ? getConfidenceLabel(activeProofRecord.confidence) : "Not saved yet"}
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-white p-4">
                      <p className="section-kicker">Confidence rating</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {CONFIDENCE_OPTIONS.map((option) => {
                          const selected = activeProofDraft.confidence === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => updateProofDraft(activeConceptUnit.conceptUnitId, "confidence", option.id)}
                              className={`rounded-full border px-4 py-2 text-sm transition ${
                                selected
                                  ? "border-[var(--accent-sage)] bg-[var(--accent-sage-light)] text-[var(--accent-sage-deep)]"
                                  : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)]"
                              }`}
                            >
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl bg-white p-4">
                      <p className="section-kicker">Optional note</p>
                      <textarea
                        value={activeProofDraft.note}
                        onChange={(event) => updateProofDraft(activeConceptUnit.conceptUnitId, "note", event.target.value)}
                        rows={2}
                        className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] px-3 py-3 text-sm text-[var(--text-primary)] outline-none"
                        placeholder="Optional: one short memory cue for future-you."
                      />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => passLessonWithProof(activeConceptUnit.conceptUnitId)}
                        disabled={!!activeProofRecord?.passed}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent-sage)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-sage-deep)] disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {activeProofRecord?.passed ? "Lesson passed" : "Pass lesson"}
                      </button>
                      {activeProofRecord?.passed ? (
                        <div className="rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-secondary)]">
                          Saved {getProofPreview(activeProofRecord)}
                        </div>
                      ) : (
                        <div className="rounded-full border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-secondary)]">
                          Your first proof will show up here after you pass today&apos;s slice.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="paper-card p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="section-kicker">Daily rhythm</p>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          Keep the day honest without turning Today into a dashboard.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setState((previous) => ({ ...previous, dailyRhythmExpanded: !previous.dailyRhythmExpanded }))}
                        className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--text-secondary)]"
                      >
                        {state.dailyRhythmExpanded ? "Hide rhythm" : "Open rhythm"}
                        {state.dailyRhythmExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={completeMustDo}
                      className={`mt-4 w-full rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                        state.mustDoDone
                          ? "border-[var(--accent-sage)] bg-[var(--accent-sage-light)] text-[var(--accent-sage-deep)]"
                          : "border-[var(--border)] bg-white hover:border-[var(--accent-sage)]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {state.mustDoDone ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <Circle className="mt-0.5 h-5 w-5 text-[var(--text-muted)]" />}
                        <div className="flex-1">
                          <p className="font-semibold">{mission.mustDo.title}</p>
                          <p className="mt-1 text-sm text-[var(--text-secondary)]">Completing this is worth <span className="font-mono text-[var(--xp-gold)]">{mission.mustDo.xp} XP</span>.</p>
                        </div>
                      </div>
                    </button>
                    {state.dailyRhythmExpanded ? (
                      <div className="mt-4 space-y-4">
                        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] p-4">
                          <p className="section-kicker">Next 3 micro-steps only</p>
                          <div className="mt-3 space-y-2">
                            {mission.mustDo.microSteps.map((step, index) => (
                              <div key={step} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-[var(--text-primary)]">
                                  {index + 1}
                                </span>
                                <span>{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-3">
                          {mission.timeBlocks.map((block) => (
                            <div key={block.label} className="paper-card p-4">
                              <p className="flex items-center gap-2 text-sm font-semibold">
                                <Clock3 className="h-4 w-4 text-[var(--accent-indigo)]" />
                                {block.label}
                              </p>
                              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">{block.duration}</p>
                              <p className="mt-3 text-sm text-[var(--text-secondary)]">{block.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </>
              )}

              {state.stuckFlow.open && (
                <div className="paper-card border-[var(--accent-indigo-light)] bg-[rgba(212,214,240,0.28)] p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="section-kicker">Stuck Protocol</p>
                      <h3 className="mt-1 text-xl font-semibold">You are not blocked forever. You only need the next smallest step.</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setState((previous) => ({ ...previous, stuckFlow: { ...previous.stuckFlow, open: false } }))}
                      className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text-secondary)]"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {Object.entries(BLOCKER_COPY).map(([key, value]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => showStuckFlow(key)}
                        className={`rounded-full border px-3 py-2 text-sm transition ${
                          state.stuckFlow.blockerType === key
                            ? "border-[var(--accent-indigo)] bg-white text-[var(--accent-indigo)]"
                            : "border-[var(--border)] bg-transparent text-[var(--text-secondary)]"
                        }`}
                      >
                        {value.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-2xl bg-white p-4">
                      <p className="section-kicker">Next smallest step</p>
                      <p className="mt-2 text-sm font-semibold">{focusSupport.nextStep}</p>
                      <p className="mt-3 text-sm text-[var(--text-secondary)]">
                        If the full task feels heavy, the fallback version still counts as momentum: <span className="font-medium">{mission.mustDo.title}</span>
                      </p>
                    </div>
                    <div className="rounded-2xl bg-white p-4">
                      <p className="section-kicker">Hint ladder</p>
                      <div className="mt-3 space-y-3">
                        {focusSupport.hints.slice(0, state.stuckFlow.hintLevel + 1).map((hint, index) => (
                          <div key={`${hint}-${index}`} className="rounded-2xl bg-[var(--bg-subtle)] px-3 py-3 text-sm text-[var(--text-secondary)]">
                            <span className="mr-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
                              {STUCK_HINTS[index]}
                            </span>
                            {hint}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={stepHintLevel}
                        disabled={state.stuckFlow.hintLevel >= STUCK_HINTS.length - 1}
                        className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-2 text-sm text-[var(--text-secondary)] disabled:opacity-50"
                      >
                        <ArrowRight className="h-4 w-4" />
                        Reveal next hint
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="soft-panel p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">Flow Bonuses</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">Optional extras only. Skipping them costs nothing.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setState((previous) => ({ ...previous, flowBonusesExpanded: !previous.flowBonusesExpanded }))}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--text-secondary)]"
                  >
                    {state.flowBonusesDone.filter(Boolean).length}/3 done
                    {state.flowBonusesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>
                {state.flowBonusesExpanded ? (
                  <div className="mt-4 space-y-3">
                    {mission.flowBonuses.map((bonus, index) => (
                      <button
                        key={bonus}
                        type="button"
                        onClick={() => completeFlowBonus(index)}
                        className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                          state.flowBonusesDone[index]
                            ? "border-[var(--accent-sage)] bg-white text-[var(--accent-sage-deep)]"
                            : "border-[var(--border)] bg-white text-[var(--text-secondary)]"
                        }`}
                      >
                        {state.flowBonusesDone[index] ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <Circle className="mt-0.5 h-5 w-5 text-[var(--text-muted)]" />}
                        <div className="flex-1">
                          <p className="font-medium">{bonus}</p>
                          <p className="mt-1 text-xs text-[var(--text-muted)]">+10 XP</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-[var(--text-muted)]">Open only when the core mission is done and you still have energy.</p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[var(--text-secondary)]">
                  {state.recoveryMode
                    ? "Today counts as a protected momentum day if you finish the salvage version."
                    : "Mark the day done after the core mission so the streak logic stays honest."}
                </p>
                <button
                  type="button"
                  onClick={markDayDone}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent-sage)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-sage-deep)]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Day {state.currentDay} Done
                </button>
              </div>
            </section>
          </>
        )}

        {state.activeTab === "quest" && (
          <section className="space-y-4">
            <div className="paper-card p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Quest Map</p>
              <h2 className="mt-1 text-2xl font-semibold">4-stage path to internship readiness</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                This sequence is deliberately front-loaded toward analyst, BI, and analytics engineering skills so you become hireable sooner.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
              {STAGES.map((stage, index) => {
                const status = getStageStatus(stage, state.currentDay, state.completedBosses);
                const checkpointCompletion = getStageCheckpointCompletion(stage.id, state.completedCheckpoints);
                const conceptUnitsForStage = getConceptUnitsForStage(stage.id);
                const conceptCompletion = conceptUnitsForStage.filter((unit) => state.completedConceptUnits?.[unit.conceptUnitId]).length;
                const readiness = getStageReadiness(stage.id, state);
                return (
                  <div key={stage.id} className="paper-card p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--bg-subtle)] text-lg">{stage.icon}</div>
                        <div>
                          <p className="text-sm font-semibold">Stage {stage.number}</p>
                          <p className="text-xs text-[var(--text-muted)]">{stage.weekRange}</p>
                        </div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusPillClasses(status)}`}>{status}</span>
                    </div>
                    <h3 className="text-lg font-semibold">{stage.title}</h3>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">{stage.hireableAs}</p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent-sage)] transition-all duration-300"
                        style={{ width: `${(conceptCompletion / Math.max(conceptUnitsForStage.length, 1)) * 100}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-[var(--text-muted)]">
                      {conceptCompletion} / {conceptUnitsForStage.length} lesson slices cleared · {checkpointCompletion} / {stage.checkpointIds.length} full checkpoints mastered
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {readiness.readyEnough ? "Ready enough for this stage’s role target." : readiness.readyRule}
                    </p>
                    <div className="mt-3 rounded-2xl bg-[var(--bg-subtle)] px-3 py-3 text-xs leading-6 text-[var(--text-secondary)]">
                      <span className="font-semibold text-[var(--text-primary)]">Top-tech strict verdict:</span>{" "}
                      {readiness.strictAudit.strictVerdict}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setState((previous) => ({
                          ...previous,
                          expandedStage: previous.expandedStage === stage.id ? null : stage.id,
                        }))
                      }
                      className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--text-secondary)]"
                    >
                      View Stage
                      {state.expandedStage === stage.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {index < STAGES.length - 1 ? <div className="mt-4 hidden h-2 w-full rounded-full bg-[var(--accent-sage-light)] lg:block" /> : null}
                  </div>
                );
              })}
            </div>

            {STAGES.map((stage) => {
              if (state.expandedStage !== stage.id) return null;
              const allStageCheckpointsDone = stage.checkpointIds.every((checkpointId) => state.completedCheckpoints[checkpointId]);
              const stageUnits = getConceptUnitsForStage(stage.id);
              const focusedStageProject = getFocusedProject(stage.id, state);
              const focusedStageStep = getNextMappedProjectStep(focusedStageProject, stage.id, state);
              const readiness = getStageReadiness(stage.id, state);
              return (
                <div key={`${stage.id}-detail`} className="paper-card p-5">
                  <div className="rounded-2xl bg-[var(--bg-subtle)] p-4 text-sm italic text-[var(--text-secondary)]">{stage.hook}</div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-4">
                      <p className="section-kicker">Role target</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{stage.hireableAs}</p>
                    </div>
                    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-4">
                      <p className="section-kicker">Core project that proves it</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                        {readiness.primaryProject ? readiness.primaryProject.title : "No core project linked yet."}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-4">
                      <p className="section-kicker">Ready enough</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{readiness.readyRule}</p>
                      <p className="mt-2 text-xs text-[var(--text-muted)]">
                        Current: {readiness.lessonsPassed}/{readiness.lessonsTotal} lessons · {readiness.projectStepsDone}/{readiness.projectStepsTotal || 0} core project steps
                      </p>
                    </div>
                    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-4">
                      <p className="section-kicker">What you can credibly say</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{readiness.outcome}</p>
                    </div>
                    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-4">
                      <p className="section-kicker">Top-tech strict verdict</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{readiness.strictAudit.strictVerdict}</p>
                      <p className="mt-2 text-xs text-[var(--text-muted)]">{readiness.strictAudit.stretchVerdict}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Curriculum spine</p>
                      {stage.resourceInstruction ? (
                        <div className="mt-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                          {stage.resourceInstruction}
                        </div>
                      ) : null}
                      <div className="relative mt-5 pl-6">
                        <div className="absolute bottom-4 left-[11px] top-2 w-px bg-[rgba(139,175,139,0.28)]" />
                        <div className="space-y-4">
                          {stageUnits.map((unit) => {
                            const unitProgress = getUnitProgress(unit, state);
                            const isActive = activeConceptUnit?.conceptUnitId === unit.conceptUnitId;
                            const unlocked = isConceptUnitUnlocked(unit, state.completedConceptUnits || {});
                            const projectInfo = parseProjectStepRef(unit.projectStepId);
                            const proofPreview = getProofPreview(unitProgress.proof);
                            return (
                              <div key={unit.conceptUnitId} className="relative">
                                <div
                                  className={`absolute -left-6 top-8 h-5 w-5 rounded-full border-2 ${
                                    unitProgress.isComplete
                                      ? "border-[var(--accent-sage)] bg-[var(--accent-sage-light)]"
                                      : isActive
                                        ? "border-[var(--accent-indigo)] bg-[var(--accent-indigo-light)]"
                                        : unlocked
                                          ? "border-[var(--border)] bg-white"
                                          : "border-[var(--border)] bg-[var(--bg-subtle)]"
                                  }`}
                                />
                                <div
                                  className={`rounded-[24px] border p-5 transition ${
                                    isActive
                                      ? "border-[var(--accent-indigo-light)] bg-[rgba(212,214,240,0.16)]"
                                      : unitProgress.isComplete
                                        ? "border-[var(--accent-sage-light)] bg-[rgba(197,217,197,0.14)]"
                                        : "border-[var(--border)] bg-white"
                                  }`}
                                >
                                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                      <div className="inline-flex rounded-full bg-[var(--bg-subtle)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                                        Step {unit.order} of {stageUnits.length}
                                      </div>
                                      <div className="mt-2 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-secondary)]">
                                        {unit.resourceTrackLabel} · lesson {unit.resourceTrackOrder}/{unit.resourceTrackTotal}
                                      </div>
                                      <h3 className="mt-3 text-xl font-semibold text-[var(--text-primary)]">{unit.title}</h3>
                                      <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{unit.whyThisMatters}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      <span className="rounded-full bg-[var(--bg-subtle)] px-3 py-1 text-xs text-[var(--text-secondary)]">Practice: {unitProgress.practiceStatus}</span>
                                      <span className="rounded-full bg-[var(--bg-subtle)] px-3 py-1 text-xs text-[var(--text-secondary)]">Transfer: {unitProgress.transferStatus}</span>
                                    </div>
                                  </div>

                                  <div className="mt-4 grid gap-3 lg:grid-cols-[1.08fr_0.92fr]">
                                    <div className="rounded-2xl bg-[var(--bg-subtle)] p-4">
                                      <p className="section-kicker">Exact lesson slice</p>
                                      <p className="mt-2 font-semibold text-[var(--text-primary)]">{unit.lessonLabel}</p>
                                      <p className="mt-2 text-sm text-[var(--text-secondary)]">
                                        {unit.resourceUrl ? (
                                          <a href={unit.resourceUrl} target="_blank" rel="noreferrer" className="underline decoration-[var(--accent-sage-deep)] underline-offset-4">
                                            {unit.resourceWhere}
                                          </a>
                                        ) : (
                                          unit.resourceWhere
                                        )}
                                      </p>
                                      <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                                        <p><span className="font-semibold text-[var(--text-primary)]">Stop at:</span> {unit.stopAt}</p>
                                        <p><span className="font-semibold text-[var(--text-primary)]">Timebox:</span> {unit.timebox}</p>
                                        <p><span className="font-semibold text-[var(--text-primary)]">Cost:</span> {unit.cost}</p>
                                      </div>
                                    </div>
                                    <div className="rounded-2xl bg-white p-4">
                                      <p className="section-kicker">Build now</p>
                                      <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{unit.buildNow}</p>
                                      <div className="mt-3 rounded-2xl border border-[var(--accent-sage-light)] bg-[rgba(197,217,197,0.14)] p-3 text-sm text-[var(--text-primary)]">
                                        {unit.ruleText}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                                    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-4">
                                      <p className="section-kicker">Starter asset</p>
                                      <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{unit.starterAsset}</p>
                                    </div>
                                    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-4">
                                      <p className="section-kicker">Checkpoint</p>
                                      <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{CHECKPOINT_TEMPLATES[unit.checkpointId]?.title}</p>
                                      <p className="mt-2 text-xs text-[var(--text-muted)]">
                                        {unitProgress.transferUnlocked
                                          ? "The lesson pass is done. This checkpoint fully clears once the linked project step is used."
                                          : "Practice this concept now on a tiny starter artifact first."}
                                      </p>
                                    </div>
                                    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-4">
                                      <p className="section-kicker">Project step linkage</p>
                                      <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                                        {projectInfo ? `${projectInfo.project.title} — ${projectInfo.stepLabel}` : "This concept still feeds a project step later."}
                                      </p>
                                    </div>
                                  </div>

                                  {proofPreview ? (
                                    <div className="mt-4 rounded-2xl bg-[rgba(212,214,240,0.12)] p-4 text-sm text-[var(--text-secondary)]">
                                      <p className="section-kicker">Saved proof preview</p>
                                      <p className="mt-2 leading-7">{proofPreview}</p>
                                    </div>
                                  ) : null}

                                  <div className="mt-4 flex flex-wrap gap-2">
                                    {unlocked && !isActive ? (
                                      <button
                                        type="button"
                                        onClick={() => selectConceptUnit(unit.conceptUnitId)}
                                        className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--text-secondary)]"
                                      >
                                        <BookOpen className="h-4 w-4" />
                                        Make current focus
                                      </button>
                                    ) : null}
                                    {isActive ? (
                                      <button
                                        type="button"
                                        onClick={() => setState((previous) => ({ ...previous, activeTab: "today", activeConceptUnitId: unit.conceptUnitId }))}
                                        className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-sage)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-sage-deep)]"
                                      >
                                        <ArrowRight className="h-4 w-4" />
                                        {unitProgress.practicePassed ? "Continue from Today" : "Pass this lesson in Today"}
                                      </button>
                                    ) : null}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div>
                      {focusedStageProject ? (
                        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] p-4">
                          <p className="section-kicker">Current project unlock chain</p>
                          <h4 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{focusedStageProject.title}</h4>
                          <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                            {focusedStageStep
                              ? `Right now the path is trying to unlock: ${focusedStageStep.stepLabel}`
                              : "This stage project is complete, so the lesson path is clearing remaining proof work."}
                          </p>
                          <div className="mt-4 space-y-2">
                            {focusedStageProject.steps.map((step, stepIndex) => {
                              const done = getProjectStepState(focusedStageProject.id, stepIndex, state.completedProjectSteps);
                              const linkedUnitCount = stageUnits.filter((unit) => unit.projectStepId === `${focusedStageProject.id}|${stepIndex}`).length;
                              const isFocus = focusedStageStep?.stepIndex === stepIndex;
                              return (
                                <div
                                  key={`${focusedStageProject.id}-ladder-${stepIndex}`}
                                  className={`rounded-2xl px-3 py-3 text-sm ${
                                    isFocus
                                      ? "border border-[var(--accent-indigo-light)] bg-white"
                                      : "bg-white/70"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <p className={`leading-6 ${done ? "text-[var(--accent-sage-deep)]" : "text-[var(--text-secondary)]"}`}>{step}</p>
                                    <span className="rounded-full bg-[var(--bg-subtle)] px-2 py-1 text-[11px] text-[var(--text-secondary)]">
                                      {done ? "Done" : linkedUnitCount ? `${linkedUnitCount} lesson${linkedUnitCount === 1 ? "" : "s"}` : "No direct lesson card"}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}

                      <div className="mt-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] p-4">
                        <p className="section-kicker">Strict readiness gates</p>
                        <div className="mt-3 space-y-2">
                          {readiness.strictAudit.gates.map((gate) => (
                            <div key={`${stage.id}-${gate.id}`} className="flex items-start gap-3 rounded-2xl bg-white px-3 py-3 text-sm text-[var(--text-secondary)]">
                              {gate.done ? (
                                <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--accent-sage-deep)]" />
                              ) : (
                                <Circle className="mt-0.5 h-4 w-4 text-[var(--text-muted)]" />
                              )}
                              <span>{gate.label}</span>
                            </div>
                          ))}
                        </div>
                        <p className="mt-3 text-xs leading-6 text-[var(--text-muted)]">
                          {readiness.strictAudit.completedGateCount}/{readiness.strictAudit.totalGateCount} strict gates met
                        </p>
                      </div>

                      <div className="mt-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] p-4">
                        <p className="section-kicker">Biggest remaining gap</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{readiness.strictAudit.biggestGap}</p>
                      </div>

                      <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] p-4">
                        <p className="section-kicker">Soft gate rule</p>
                        <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">
                          The lesson path strongly recommends passing the current slice first, but your linked project step is still there if you want to explore early and learn by touching the work.
                        </p>
                      </div>

                      <div className="mt-4 rounded-[18px] bg-[var(--text-primary)] p-[1px]">
                        <div className="boss-ring rounded-[17px] p-[1px]">
                          <div className="rounded-[16px] bg-[#141417] p-4 text-white">
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="text-xs uppercase tracking-[0.22em] text-white/50">Boss Battle</p>
                                <h4 className="mt-1 text-lg font-semibold">{stage.boss.name}</h4>
                              </div>
                              <div className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">
                                {allStageCheckpointsDone ? "⚔ BOSS BATTLE UNLOCKED" : "🔒 Complete all checkpoints first"}
                              </div>
                            </div>
                            <div className="mt-4 space-y-3 text-sm text-white/80">
                              <div className="rounded-2xl bg-white/5 p-3">
                                <p className="font-semibold text-white">Technical</p>
                                <p className="mt-1">{stage.boss.technical}</p>
                              </div>
                              <div className="rounded-2xl bg-white/5 p-3">
                                <p className="font-semibold text-white">Explain It</p>
                                <p className="mt-1">{stage.boss.explain}</p>
                              </div>
                              <div className="rounded-2xl bg-white/5 p-3">
                                <p className="font-semibold text-white">Business Case</p>
                                <p className="mt-1">{stage.boss.business}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => completeBoss(stage.id)}
                              disabled={!allStageCheckpointsDone || state.completedBosses[stage.id]}
                              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-40"
                            >
                              {allStageCheckpointsDone ? <Swords className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                              {state.completedBosses[stage.id] ? "Boss defeated" : "Defeat boss"}
                            </button>
                            <p className="mt-3 text-xs text-white/55">{stage.boss.reward}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {state.activeTab === "projects" && (
          <section className="space-y-4">
            {PORTFOLIO_TRACKS.map((track, trackIndex) => (
              <div key={track.id} className={`paper-card p-5 stagger-in`} style={{ animationDelay: `${trackIndex * 70}ms` }}>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">{track.title}</p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">{track.tagline}</p>
                <div className="mt-4 space-y-4">
                  {track.projects.map((project) => {
                    const completedSteps = project.steps.filter((_, index) => state.completedProjectSteps[`${project.id}-${index}`]).length;
                    const projectDone = !!state.completedProjects[project.id];
                    const linkedUnits = CONCEPT_UNITS.filter((unit) => unit.projectStepId?.startsWith(`${project.id}|`));
                    return (
                      <div key={project.id} className="rounded-2xl border border-[var(--border)] bg-white p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                              {STAGES.find((stage) => stage.id === project.stageId)?.title}
                            </p>
                            <h3 className="mt-1 text-xl font-semibold">{project.title}</h3>
                            <p className="mt-2 text-sm text-[var(--text-secondary)]">{project.businessProblem}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setState((previous) => ({
                                ...previous,
                                expandedProject: previous.expandedProject === project.id ? null : project.id,
                              }))
                            }
                            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-2 text-sm text-[var(--text-secondary)]"
                          >
                            {state.expandedProject === project.id ? "Hide project" : "Open project"}
                            {state.expandedProject === project.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </div>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                          <div
                            className="h-full rounded-full bg-[var(--accent-sage)] transition-all duration-300"
                            style={{ width: `${(completedSteps / project.steps.length) * 100}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-[var(--text-muted)]">
                          {completedSteps}/{project.steps.length} steps complete
                          {projectDone ? " · Full project shipped" : ""}
                        </p>

                        {state.expandedProject === project.id && (
                          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
                            <div className="space-y-3">
                              <div className="rounded-2xl bg-[var(--bg-subtle)] p-4">
                                <p className="section-kicker">What the final project should look like</p>
                                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{getProjectDeliverable(project)}</p>
                              </div>
                              <div className="rounded-2xl bg-[var(--bg-subtle)] p-4">
                                <p className="section-kicker">Why this project matters</p>
                                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{getProjectImportance(project)}</p>
                              </div>
                              <div className="rounded-2xl bg-[var(--bg-subtle)] p-4">
                                <p className="section-kicker">Project summary</p>
                                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{project.recruiterSummary}</p>
                              </div>
                              <div className="rounded-2xl bg-[var(--bg-subtle)] p-4">
                                <p className="section-kicker">How to talk about it</p>
                                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{project.interviewTalkingPoints}</p>
                              </div>
                              <div className="rounded-2xl bg-[var(--bg-subtle)] p-4">
                                <p className="section-kicker">Hard skills shown</p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {project.skills.map((skill) => (
                                    <span key={skill} className="rounded-full bg-white px-3 py-1 text-xs text-[var(--text-secondary)]">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              {linkedUnits.length ? (
                                <>
                                  <div className="rounded-2xl bg-[var(--bg-subtle)] p-4">
                                    <p className="section-kicker">Concept units feeding this project</p>
                                    <div className="mt-3 space-y-2">
                                      {linkedUnits.map((unit) => (
                                        <div key={`${project.id}-${unit.conceptUnitId}`} className="rounded-2xl bg-white px-3 py-3 text-sm text-[var(--text-secondary)]">
                                          <p className="font-semibold text-[var(--text-primary)]">{unit.title}</p>
                                          <p className="mt-1">{unit.lessonLabel}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="rounded-2xl bg-[var(--bg-subtle)] p-4">
                                    <p className="section-kicker">Linked proof</p>
                                    <div className="mt-3 space-y-2">
                                      {linkedUnits.map((unit) => {
                                        const preview = getProofPreview(state.proofByUnitId?.[unit.conceptUnitId]);
                                        return (
                                          <div key={`${project.id}-${unit.conceptUnitId}-proof`} className="rounded-2xl bg-white px-3 py-3 text-sm text-[var(--text-secondary)]">
                                            <p className="font-semibold text-[var(--text-primary)]">{unit.title}</p>
                                            <p className="mt-1">{preview || "No linked proof saved yet. It will show up here after you pass the matching lesson and rate it."}</p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </>
                              ) : null}
                            </div>
                            <div>
                              <p className="section-kicker">Project steps</p>
                              <div className="mt-3 space-y-3">
                                {project.steps.map((step, index) => {
                                  const done = state.completedProjectSteps[`${project.id}-${index}`];
                                  return (
                                    <button
                                      key={`${project.id}-${step}`}
                                      type="button"
                                      onClick={() => toggleProjectStep(project.id, index)}
                                      className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                                        done
                                          ? "border-[var(--accent-sage)] bg-[var(--accent-sage-light)] text-[var(--accent-sage-deep)]"
                                          : "border-[var(--border)] bg-white text-[var(--text-secondary)]"
                                      }`}
                                    >
                                      {done ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <Circle className="mt-0.5 h-5 w-5 text-[var(--text-muted)]" />}
                                      <div>
                                        <p className="font-medium">{step}</p>
                                        <p className="mt-1 text-xs text-[var(--text-muted)]">{done ? "Click again to uncheck and remove the XP." : "+15 XP each · +200 XP when the whole project ships"}</p>
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                              <div className="mt-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] p-4 text-sm text-[var(--text-secondary)]">
                                Improves: {project.benchmarkBoosts.map((skillId) => COMPANY_BENCHMARKS.find((skill) => skill.id === skillId)?.title).join(" · ")}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        )}

        {state.activeTab === "gap" && (
          <section className="space-y-4">
            <div className="paper-card p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Gap Radar</p>
              <h2 className="mt-1 text-2xl font-semibold">Top-company benchmark, translated into visible proof</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                This is here to answer three things fast: what improved recently, what proof caused it, and what proof would move the skill next.
              </p>
              <div className="mt-4 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3 text-sm leading-7 text-[var(--text-secondary)]">
                This view uses a top-tech strict bar. It should push back on false confidence, not hand out “hireable” too early.
              </div>
            </div>
            <div className="grid gap-4">
              {gapRadar.map((skill, index) => (
                <div key={skill.id} className="paper-card stagger-in p-4" style={{ animationDelay: `${index * 40}ms` }}>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{skill.title}</h3>
                        <span className="rounded-full bg-[var(--bg-subtle)] px-3 py-1 text-xs text-[var(--text-secondary)]">{skill.status}</span>
                      </div>
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">{skill.expectation}</p>
                    </div>
                    <div className="rounded-2xl bg-[var(--bg-subtle)] px-4 py-3 text-right">
                      <p className="section-kicker">Proofs</p>
                      <p className="font-mono text-lg font-semibold text-[var(--accent-sage-deep)]">
                        {skill.proofsEarned}/{skill.proofsTarget}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                    <div className="h-full rounded-full bg-[var(--accent-sage)] transition-all duration-300" style={{ width: `${skill.score}%` }} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    {Array.from({ length: skill.proofsTarget }, (_, proofIndex) => (
                      <div
                        key={`${skill.id}-proof-${proofIndex}`}
                        className={`h-2 flex-1 rounded-full ${proofIndex < Math.floor(Number(skill.proofsEarned)) ? "bg-[var(--accent-sage)]" : "bg-[var(--bg-subtle)]"}`}
                      />
                    ))}
                  </div>
                  <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-start">
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">
                        Next proof to earn: <span className="font-semibold text-[var(--text-primary)]">{skill.nextAction}</span>
                      </p>
                      <p className="mt-1 text-sm text-[var(--text-muted)]">{skill.missingLabel}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {getGapGuidance(skill.id).map((guide) => (
                          <span key={guide} className="rounded-full bg-[var(--bg-subtle)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                            {guide}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white px-3 py-2 text-right text-xs leading-6 text-[var(--text-secondary)]">
                      <span className="font-semibold text-[var(--text-primary)]">What changed recently:</span>{" "}
                      {skill.recentProofs.length ? skill.recentProofs.join(" · ") : "No proof logged yet"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="paper-card p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Concept Mastery</p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {Object.entries(conceptMastery).map(([templateId, mastery]) => (
                  <div key={templateId} className="rounded-2xl border border-[var(--border)] bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{CHECKPOINT_TEMPLATES[templateId].title}</p>
                      <span className="rounded-full bg-[var(--bg-subtle)] px-3 py-1 text-xs text-[var(--text-secondary)]">{mastery.status}</span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">
                      {mastery.passes} passes · {mastery.attempts} attempts · {mastery.hintLevelUsed} help uses
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {state.activeTab === "career" && (
          <section className="space-y-4">
            <div className="paper-card p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Career HQ</p>
              <h2 className="mt-1 text-2xl font-semibold">Learning and job hunting live in the same system</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Because internships now behave closer to full-job hiring, your tracker needs to move applications, outreach, and portfolio proof forward from Week 1.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              <div className="paper-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Hire-Me core</p>
                    <h3 className="mt-1 text-xl font-semibold">Career checklist</h3>
                  </div>
                  <div className="rounded-2xl bg-[var(--bg-subtle)] px-4 py-3 text-right">
                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Progress</p>
                    <p className="font-mono text-lg font-semibold text-[var(--accent-sage-deep)]">
                      {careerChecklistComplete}/{CAREER_CHECKLIST.length}
                    </p>
                  </div>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--bg-subtle)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent-sage)] transition-all duration-300"
                    style={{ width: `${(careerChecklistComplete / CAREER_CHECKLIST.length) * 100}%` }}
                  />
                </div>
                <div className="mt-4 space-y-3">
                  {CAREER_CHECKLIST.map((item) => {
                    const done = !!state.completedCareerChecklist[item.id];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleCareerChecklist(item.id)}
                        className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                          done
                            ? "border-[var(--accent-sage)] bg-[var(--accent-sage-light)] text-[var(--accent-sage-deep)]"
                            : "border-[var(--border)] bg-white text-[var(--text-secondary)]"
                        }`}
                      >
                        {done ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <Circle className="mt-0.5 h-5 w-5 text-[var(--text-muted)]" />}
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="mt-1 text-sm text-[var(--text-secondary)]">{item.detail}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <div className="paper-card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Weekly pulse</p>
                      <h3 className="mt-1 text-xl font-semibold">Market actions</h3>
                    </div>
                    <Target className="h-5 w-5 text-[var(--accent-orange)]" />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-[var(--bg-subtle)] p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Applications</p>
                      <p className="mt-2 font-mono text-2xl font-semibold">{appliedCount}</p>
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">Goal: 3+</p>
                    </div>
                    <div className="rounded-2xl bg-[var(--bg-subtle)] p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Outreach</p>
                      <p className="mt-2 font-mono text-2xl font-semibold">{outreachCount}</p>
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">Goal: 2+</p>
                    </div>
                    <div className="rounded-2xl bg-[var(--bg-subtle)] p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Mocks</p>
                      <p className="mt-2 font-mono text-2xl font-semibold">{interviewCount}</p>
                      <p className="mt-1 text-xs text-[var(--text-secondary)]">Goal: 1+</p>
                    </div>
                  </div>
                </div>

                <div className="paper-card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Current career action</p>
                      <h3 className="mt-1 text-xl font-semibold">Keep the hiring lane moving</h3>
                    </div>
                    <Briefcase className="h-5 w-5 text-[var(--accent-indigo)]" />
                  </div>
                  <button
                    type="button"
                    onClick={completeCareerAction}
                    className={`mt-4 w-full rounded-2xl border px-4 py-4 text-left transition ${
                      state.careerActionDone
                        ? "border-[var(--accent-sage)] bg-[var(--accent-sage-light)] text-[var(--accent-sage-deep)]"
                        : "border-[var(--border)] bg-white text-[var(--text-secondary)]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {state.careerActionDone ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <Circle className="mt-0.5 h-5 w-5 text-[var(--text-muted)]" />}
                      <div>
                        <p className="font-medium">{mission.careerAction.title}</p>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          Worth <span className="font-mono text-[var(--xp-gold)]">{mission.careerAction.xp} XP</span>. This lives here so Today can stay focused on learning.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                <div className="paper-card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Target pipeline</p>
                      <h3 className="mt-1 text-xl font-semibold">Target roles</h3>
                    </div>
                    <Send className="h-5 w-5 text-[var(--accent-indigo)]" />
                  </div>
                  <p className="mt-3 text-sm text-[var(--text-secondary)]">
                    Keep this custom. Deadlines move, roles close, and new openings appear. Treat this as your living shortlist, not a fixed list from the app.
                  </p>
                  <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1.2fr_0.9fr_auto]">
                    <input
                      value={state.targetDraft.company}
                      onChange={(event) => updateTargetDraft("company", event.target.value)}
                      placeholder="Company or bucket"
                      className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none"
                    />
                    <input
                      value={state.targetDraft.role}
                      onChange={(event) => updateTargetDraft("role", event.target.value)}
                      placeholder="Role"
                      className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none"
                    />
                    <input
                      value={state.targetDraft.track}
                      onChange={(event) => updateTargetDraft("track", event.target.value)}
                      placeholder="Track"
                      className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-primary)] outline-none"
                    />
                    <button
                      type="button"
                      onClick={addTargetRole}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--text-secondary)]"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {state.jobPipeline.map((application) => (
                      <div key={application.id} className="flex items-start justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 py-3 text-left">
                        <button
                          type="button"
                          onClick={() => cycleApplicationStatus(application.id)}
                          className="flex-1 text-left"
                        >
                          <p className="font-semibold">{application.company}</p>
                          <p className="text-sm text-[var(--text-secondary)]">{application.role}</p>
                          <p className="mt-1 text-xs text-[var(--text-muted)]">{application.track}</p>
                        </button>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-[var(--bg-subtle)] px-3 py-1 text-xs capitalize text-[var(--text-secondary)]">
                            {application.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeTargetRole(application.id)}
                            className="rounded-full border border-[var(--border)] p-2 text-[var(--text-secondary)]"
                            aria-label={`Remove ${application.company}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
              <div className="paper-card p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Outreach</p>
                <h3 className="mt-1 text-xl font-semibold">Small reps, steady visibility</h3>
                <div className="mt-4 space-y-3">
                  {OUTREACH_LOGS.map((item) => {
                    const done = !!state.outreachLog[item.id];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => completeOutreach(item.id)}
                        className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                          done
                            ? "border-[var(--accent-sage)] bg-[var(--accent-sage-light)] text-[var(--accent-sage-deep)]"
                            : "border-[var(--border)] bg-white text-[var(--text-secondary)]"
                        }`}
                      >
                        {done ? <CheckCircle2 className="mt-0.5 h-5 w-5" /> : <MessageSquare className="mt-0.5 h-5 w-5 text-[var(--accent-indigo)]" />}
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="mt-1 text-xs text-[var(--text-muted)]">{formatXP(item.xp)} XP</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="paper-card p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">2-Year Roadmap</p>
                    <h3 className="mt-1 text-xl font-semibold">Keep the longer plan without losing the 90-day focus</h3>
                  </div>
                  <Bot className="h-5 w-5 text-[var(--accent-indigo)]" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[
                    { id: "internship", label: "Internship landed" },
                    { id: "continue", label: "No internship yet" },
                    { id: "pm", label: "PM path" },
                  ].map((branch) => (
                    <button
                      key={branch.id}
                      type="button"
                      onClick={() => setState((previous) => ({ ...previous, roadmapBranch: branch.id }))}
                      className={`rounded-full border px-3 py-2 text-sm transition ${
                        state.roadmapBranch === branch.id
                          ? "border-[var(--accent-sage)] bg-[var(--accent-sage-light)] text-[var(--accent-sage-deep)]"
                          : "border-[var(--border)] bg-white text-[var(--text-secondary)]"
                      }`}
                    >
                      {branch.label}
                    </button>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl bg-[var(--bg-subtle)] p-4 text-sm text-[var(--text-secondary)]">
                  {state.roadmapBranch === "internship" && (
                    <p>
                      If the internship lands, the next 12 months shift toward stronger execution, clearer business storytelling, and owning one analytics system end to end. Your PM path then builds on actual product and stakeholder exposure instead of theory alone.
                    </p>
                  )}
                  {state.roadmapBranch === "continue" && (
                    <p>
                      If no internship lands right away, the plan becomes: ship one more employer-legible project, tighten interview reps, increase targeted outreach, and push toward BIE / AE / analyst contract or apprentice-style openings while continuing the portfolio system.
                    </p>
                  )}
                  {state.roadmapBranch === "pm" && (
                    <p>
                      The PM path over 12–24 months should come after you build real product-adjacent credibility. Use analytics work to get close to product decisions, then layer on experimentation, metrics strategy, stakeholder leadership, and roadmap communication.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="paper-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Progress Utilities</p>
                  <h3 className="mt-1 text-xl font-semibold">Save, reset, and move your tracker safely</h3>
                </div>
                <CalendarDays className="h-5 w-5 text-[var(--accent-indigo)]" />
              </div>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                Progress auto-saves in this browser. That is fine because the data is tiny. The real limitation is device scope, so export still matters.
              </p>
              <div className="mt-3 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-subtle)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--text-primary)]">Autosaved in this browser.</span> Export is your backup, import is your restore path, and reset is there for clean testing.
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={exportProgress}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--text-secondary)]"
                >
                  <Download className="h-4 w-4" />
                  Export Progress
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--text-secondary)]"
                >
                  <Upload className="h-4 w-4" />
                  Import Progress
                </button>
                <button
                  type="button"
                  onClick={resetProgress}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--text-secondary)]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset To Day 1
                </button>
                <input ref={fileInputRef} type="file" accept="application/json" onChange={importProgress} className="hidden" />
              </div>
            </div>
          </section>
        )}

        {state.activeTab === "arena" && (
          <section className="space-y-4">
            <div className="paper-card p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Interview Arena</p>
              <h2 className="mt-1 text-2xl font-semibold">Practice until the work feels explainable, not just completed</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                The goal here is to remove the feeling that you only know things on a good day. Each rep now includes a prompt, a resource, and a rubric so you can judge yourself honestly.
              </p>
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {INTERVIEW_ARENA.map((item, index) => {
                const currentSeed = state.interviewPromptSeeds[item.id] || 0;
                const interviewEntry = state.interviewPrep[item.id];
                const completedSeeds = typeof interviewEntry === "boolean" ? [0] : interviewEntry?.completedSeeds || [];
                const done = completedSeeds.includes(currentSeed);
                const activePrompt = getArenaPrompt(item, currentSeed);
                return (
                  <div
                    key={item.id}
                    className={`paper-card stagger-in p-5 text-left transition ${done ? "border-[var(--accent-sage)]" : ""}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                        <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.detail}</p>
                      </div>
                      {done ? <CheckCircle2 className="h-5 w-5 text-[var(--accent-sage-deep)]" /> : <Circle className="h-5 w-5 text-[var(--text-muted)]" />}
                    </div>
                    <div className="mt-4 rounded-2xl bg-[var(--bg-subtle)] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Prompt</p>
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">{activePrompt}</p>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr]">
                      <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Practice from</p>
                        <p className="mt-2 font-semibold">{item.resource.name}</p>
                        <p className="mt-2 text-sm text-[var(--text-secondary)]">
                          {item.resource.url ? (
                            <a href={item.resource.url} target="_blank" rel="noreferrer" className="underline decoration-[var(--accent-sage)] underline-offset-4">
                              {item.resource.where}
                            </a>
                          ) : (
                            item.resource.where
                          )}
                        </p>
                        <p className="mt-2 text-xs text-[var(--text-muted)]">
                          {item.resource.format} · {item.resource.cost}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-[var(--border)] bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Evidence to log</p>
                        <p className="mt-2 text-sm text-[var(--text-secondary)]">{item.evidence}</p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-2xl border border-dashed border-[var(--border)] bg-[rgba(197,217,197,0.12)] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Self-grade rubric</p>
                      <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                        {item.rubric.map((rubricPoint) => (
                          <div key={rubricPoint} className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[var(--accent-sage)]" />
                            <span>{rubricPoint}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-xs text-[var(--text-muted)]">{done ? "Logged. Click again to unlog if this was just a test click." : `+${item.xp} XP when you complete this rep honestly`}</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => cycleArenaPrompt(item.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--text-secondary)]"
                        >
                          <RotateCcw className="h-4 w-4" />
                          New prompt
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleArena(item.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm text-[var(--text-secondary)]"
                        >
                          <MessageSquare className="h-4 w-4" />
                          {done ? "Unlog rep" : "Log rep"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {state.activeTab === "badges" && (
          <section className="space-y-4">
            <div className="paper-card p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">Achievements</p>
              <h2 className="mt-1 text-2xl font-semibold">Only earned proof shows up here</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Hidden until earned, so this board feels like proof rather than pressure.
              </p>
            </div>
            {BADGES.filter((badge) => state.earnedBadges[badge.id]).length ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {BADGES.filter((badge) => state.earnedBadges[badge.id]).map((badge, index) => {
                  const earned = state.earnedBadges[badge.id];
                  return (
                    <div
                      key={badge.id}
                      className="paper-card stagger-in badge-glow p-4"
                      style={{ animationDelay: `${index * 35}ms` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-sage-light)] text-2xl">
                          {badge.icon}
                        </div>
                        <span className="rounded-full bg-[var(--accent-sage-light)] px-3 py-1 text-xs text-[var(--accent-sage-deep)]">{earned.date}</span>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">{badge.name}</h3>
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">{badge.hint}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="paper-card p-5">
                <p className="text-sm text-[var(--text-secondary)]">
                  No achievements unlocked yet. The first one should land once you complete a real proof, not just browse the app.
                </p>
              </div>
            )}
          </section>
        )}

        {state.activeTab === "activity" && (
          <section className="space-y-4">
            <div className="paper-card p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">90-Day Activity Wall</p>
              <h2 className="mt-1 text-2xl font-semibold">Every square is one day of evidence</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Even imperfect days matter if they keep the chain alive.
              </p>
              <div className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-[repeat(15,minmax(0,1fr))]">
                {Array.from({ length: 90 }, (_, index) => {
                  const day = index + 1;
                  const entry = activityMap[day];
                  const isCurrent = day === state.currentDay;
                  const palette = entry ? scoreLegend(entry) : { color: "var(--bg-base)", label: "Future day" };
                  const title = entry
                    ? `Day ${day} — ${getDateForDay(state.journeyStartDate, day)} — ${palette.label}`
                    : `Day ${day} — ${getDateForDay(state.journeyStartDate, day)} — future`;
                  return (
                    <div
                      key={day}
                      title={title}
                      className={`h-7 rounded-[10px] border transition ${isCurrent ? "soft-pulse" : ""}`}
                      style={{
                        backgroundColor: day > state.currentDay ? "var(--bg-base)" : palette.color,
                        borderColor: isCurrent ? "var(--accent-sage)" : "var(--border)",
                      }}
                    />
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-xs text-[var(--text-secondary)]">
                {[
                  { label: "Future day", color: "var(--bg-base)" },
                  { label: "Passed, nothing logged", color: "var(--border)" },
                  { label: "Must Do only", color: "var(--accent-sage-light)" },
                  { label: "Must Do + 1–2 flow bonuses", color: "var(--accent-sage)" },
                  { label: "Must Do + all flow bonuses", color: "var(--accent-sage-deep)" },
                ].map((legend) => (
                  <div key={legend.label} className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-md border border-[var(--border)]" style={{ backgroundColor: legend.color }} />
                    {legend.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="paper-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--text-muted)]">XP Log</p>
                  <h3 className="mt-1 text-xl font-semibold">Recent proof of motion</h3>
                </div>
                <FileText className="h-5 w-5 text-[var(--accent-indigo)]" />
              </div>
              <div className="mt-4 space-y-3">
                {(state.xpLog.length ? state.xpLog : [{ action: "No XP logged yet. Start with today’s Must Do.", xp: 0, time: Date.now(), day: 1 }]).map((entry, index) => (
                  <div key={`${entry.action}-${entry.time}-${index}`} className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--border)] bg-white px-4 py-3">
                    <div>
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">{formatRelativeTime(entry.time)}</p>
                    </div>
                    <span className="font-mono text-sm font-semibold text-[var(--xp-gold)]">{formatXP(entry.xp)} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <div className="pointer-events-none fixed bottom-4 right-4 z-40 flex max-w-sm flex-col gap-3">
        {state.toasts.map((toast) => (
          <div key={toast.id} className="toast-enter pointer-events-auto paper-card flex items-start gap-3 border-l-4 border-l-[var(--accent-sage)] px-4 py-3">
            <Star className="mt-0.5 h-5 w-5 text-[var(--accent-sage-deep)]" />
            <div>
              <p className="text-sm font-semibold">{toast.title}</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{toast.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
