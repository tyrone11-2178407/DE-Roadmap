import React, { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Coffee,
  ExternalLink,
  Lock,
  Map as MapIcon,
  Mic,
  NotebookPen,
  Shield,
  Sparkles,
  Sunrise,
  Target,
} from "lucide-react";

const STORAGE_KEY = "de-roadmap-adhd-v1";

const PRIMARY_PATH = {
  id: "da-bi",
  title: "Data Analyst / BI Analyst",
  target: "December 2026 new-grad offer",
  sector: "Mid-size non-tech (insurance, risk, healthcare)",
  summary:
    "One primary path. Everything else is a post-offer pivot. Build the floor first, then optimize.",
};

const FUTURE_PIVOTS = [
  {
    id: "bie",
    title: "BI Engineer",
    note: "Unlocks after a DA offer + 6 months dbt/modeling fluency.",
  },
  {
    id: "ae",
    title: "Analytics Engineer",
    note: "Unlocks after BIE — dbt Learn Fundamentals is parked here.",
  },
  {
    id: "de",
    title: "Data Engineer",
    note: "Archived: Zoomcamp, Airflow, Docker. Not on the Dec 2026 path.",
  },
  {
    id: "ml",
    title: "ML / AI Engineer",
    note: "Not on this plan. Projects from the old resume do not count.",
  },
];

const PHASES = [
  {
    id: "phase-1",
    order: 1,
    title: "Code-along",
    window: "Weeks 1–2",
    mode: "Watch + type. Zero blank problems.",
    rule: "Pause the video between steps. Type every line. No AI needed yet.",
    concepts: [
      "Python syntax: variables, types, lists, loops, functions",
      "SQL basics: SELECT, WHERE, ORDER BY, LIMIT",
      "Reading error messages without panic",
    ],
    resourceIds: ["datacamp-intro-python", "datacamp-intro-sql", "bara-youtube", "alex-analyst-python"],
    mastery: [
      {
        id: "p1-python-basics",
        title: "Python basics — reproduce from blank file",
        prompt:
          "Open a blank file. Without notes, write a script that reads a list of numbers and prints the mean and max. 60-sec voice memo explaining each line.",
        allowed: ["voice", "notion", "reproduction"],
      },
      {
        id: "p1-sql-basics",
        title: "SQL basics — SELECT, WHERE, ORDER BY",
        prompt:
          "Write a query that picks the top 5 rows from a table filtered by a column and sorted by another. Explain what each clause does in plain English.",
        allowed: ["voice", "notion", "reproduction"],
      },
    ],
  },
  {
    id: "phase-2",
    order: 2,
    title: "Guided solo",
    window: "Weeks 3–5",
    mode: "Interactive tutorials with hints. Use hints freely, no shame.",
    rule: "Type every line. AI answers questions only. Use tutorial hints freely — no shame.",
    concepts: [
      "pandas: filter, groupby, merge, aggregation",
      "SQL: JOINs (all types), CTEs, subqueries",
      "Stats intuition: mean vs median, distributions, rolling averages",
    ],
    resourceIds: [
      "datacamp-pandas",
      "datacamp-intermediate-sql",
      "datacamp-da-sql-track",
      "kaggle-pandas",
      "sqlbolt",
      "sqlzoo",
      "mode-sql",
      "statquest",
    ],
    mastery: [
      {
        id: "p2-pandas",
        title: "pandas — clean + aggregate a real dataset",
        prompt:
          "Load a Makeover Monday CSV. Filter, group, and aggregate to answer one question. Notion teach-back (2 paragraphs) on what you did and why.",
        allowed: ["voice", "notion", "reproduction"],
      },
      {
        id: "p2-joins",
        title: "SQL joins + CTEs",
        prompt:
          "Write a CTE that joins two tables and answers a business question. Rewrite from scratch the next day. Paste both versions.",
        allowed: ["voice", "notion", "reproduction"],
      },
      {
        id: "p2-window",
        title: "Window functions (the shaky one)",
        prompt:
          "ROW_NUMBER, RANK, LAG — one example each. Voice memo: when would you use each?",
        allowed: ["voice", "notion", "reproduction"],
      },
    ],
  },
  {
    id: "phase-3",
    order: 3,
    title: "Assisted problems",
    window: "Weeks 6–9",
    mode: "Real problems, 20-min cap, peek → rewrite from scratch the next day.",
    rule: "20-min attempt → peek at solution → rewrite from scratch. Retry blind the next day.",
    concepts: [
      "Interview-shape SQL (StrataScratch, Interview Query)",
      "Probability basics + A/B test intuition",
      "First dashboard in Tableau or Power BI (Makeover Monday dataset)",
      "Business framing: what changed, why, what decision follows",
    ],
    resourceIds: [
      "stratascratch",
      "interview-query",
      "statquest",
      "makeover-monday",
      "tableau-student",
      "powerbi-student",
    ],
    mastery: [
      {
        id: "p3-sql-problem",
        title: "StrataScratch problem — rewritten blind next day",
        prompt:
          "One StrataScratch medium. Paste both attempts (timestamped). 60-sec voice memo explaining your query.",
        allowed: ["voice", "reproduction"],
      },
      {
        id: "p3-dashboard",
        title: "First dashboard — Makeover Monday",
        prompt:
          "One Tableau or Power BI dashboard on a Makeover Monday dataset. Paste the public link + 2-paragraph teach-back on the insight.",
        allowed: ["notion", "reproduction"],
      },
      {
        id: "p3-ab-intuition",
        title: "A/B test intuition",
        prompt:
          "Voice memo: explain p-value, sample size, and one pitfall in 90 seconds. No notes.",
        allowed: ["voice"],
      },
    ],
  },
  {
    id: "phase-4",
    order: 4,
    title: "Blind attempts",
    window: "Weeks 10+",
    mode: "Solo, timed, narrate out loud. Record the explanation.",
    rule: "Solo, timed, narrate out loud. Record your explanation.",
    concepts: [
      "Timed interview problems (Interview Query)",
      "End-to-end case: dataset → dashboard → 5-min walkthrough",
      "Behavioral stories that match your real journey",
    ],
    resourceIds: ["interview-query", "stratascratch", "makeover-monday"],
    mastery: [
      {
        id: "p4-timed-sql",
        title: "Timed SQL — 3 problems, narrated",
        prompt:
          "3 Interview Query SQL problems, timed. Record yourself narrating. Paste the link to the recording.",
        allowed: ["voice", "reproduction"],
      },
      {
        id: "p4-walkthrough",
        title: "5-minute project walkthrough",
        prompt:
          "Record a 5-min walkthrough of one portfolio project — business question, data, decision. No script.",
        allowed: ["voice"],
      },
    ],
  },
];

const RESOURCES = {
  "datacamp-intro-python": {
    name: "DataCamp — Introduction to Python",
    kind: "Course (PRIMARY SPINE)",
    url: "https://app.datacamp.com/learn/courses/intro-to-python-for-data-science",
    phase: "phase-1",
    note: "First course. Start here Monday of Week 1.",
  },
  "datacamp-intro-sql": {
    name: "DataCamp — Introduction to SQL",
    kind: "Course (PRIMARY SPINE)",
    url: "https://app.datacamp.com/learn/courses/introduction-to-sql",
    phase: "phase-1",
    note: "After Intro to Python. Week 1 Wed.",
  },
  "datacamp-pandas": {
    name: "DataCamp — Data Manipulation with pandas",
    kind: "Course (PRIMARY SPINE)",
    url: "https://app.datacamp.com/learn/courses/data-manipulation-with-pandas",
    phase: "phase-2",
    note: "Week 3 start.",
  },
  "datacamp-intermediate-sql": {
    name: "DataCamp — Intermediate SQL",
    kind: "Course (PRIMARY SPINE)",
    url: "https://app.datacamp.com/learn/courses/intermediate-sql",
    phase: "phase-2",
    note: "JOINs, CTEs, subqueries.",
  },
  "datacamp-da-sql-track": {
    name: "DataCamp — Associate Data Analyst in SQL (Career Track)",
    kind: "Career Track",
    url: "https://app.datacamp.com/learn/career-tracks/associate-data-analyst-in-sql",
    phase: "phase-2",
    note: "The spine of Phase 2 — work through in order.",
  },
  "bara-youtube": {
    name: "Data with Bara (YouTube)",
    kind: "Video — code-along",
    url: "https://www.youtube.com/@DatawithBara",
    phase: "phase-1",
    note: "Narrated project videos. Also good weekend enjoyment.",
  },
  "alex-analyst-python": {
    name: "Alex The Analyst — Python for Data Analytics",
    kind: "Video — backup",
    url: "https://www.youtube.com/playlist?list=PLUaB-1hjhk8HqnmK0gQhfmIdCbxwoAoys",
    phase: "phase-1",
    note: "Backup to Bara. Pause between steps.",
  },
  "sqlbolt": {
    name: "SQLBolt",
    kind: "Interactive tutorial",
    url: "https://sqlbolt.com/",
    phase: "phase-2",
    note: "Warmup for Phase 2. Short, hint-friendly.",
  },
  "sqlzoo": {
    name: "SQLZoo",
    kind: "Interactive tutorial",
    url: "https://www.sqlzoo.net/",
    phase: "phase-2",
    note: "More volume once SQLBolt feels easy.",
  },
  "mode-sql": {
    name: "Mode Analytics — SQL Tutorial",
    kind: "Interactive tutorial — backup",
    url: "https://mode.com/sql-tutorial",
    phase: "phase-2",
    note: "Backup reference with real datasets.",
  },
  "kaggle-pandas": {
    name: "Kaggle — Pandas course",
    kind: "Interactive notebook",
    url: "https://www.kaggle.com/learn/pandas",
    phase: "phase-2",
    note: "Short, hands-on.",
  },
  "stratascratch": {
    name: "StrataScratch",
    kind: "Interview-style problems",
    url: "https://www.stratascratch.com/",
    phase: "phase-3",
    note: "Free interview problems. 20-min cap, then peek.",
  },
  "interview-query": {
    name: "Interview Query (paid — you have it)",
    kind: "Interview prep",
    url: "https://www.interviewquery.com/",
    phase: "phase-3",
    note: "SQL pad, probability basics, A/B tests. EXCLUDE the ML content.",
  },
  "statquest": {
    name: "StatQuest with Josh Starmer (YouTube)",
    kind: "Video — stats intuition",
    url: "https://www.youtube.com/@statquest",
    phase: "phase-2",
    note: "Stats/probability basics. Phase 2–3.",
  },
  "makeover-monday": {
    name: "Makeover Monday",
    kind: "Dataset source",
    url: "https://www.makeovermonday.co.uk/data/",
    phase: "phase-3",
    note: "Portfolio dataset source. Phase 3+.",
  },
  "tableau-student": {
    name: "Tableau (via student license)",
    kind: "Tool",
    url: "https://www.tableau.com/academic/students",
    phase: "phase-3",
    note: "Phase 3 only. Do NOT touch before Week 6.",
  },
  "powerbi-student": {
    name: "Power BI (via student license)",
    kind: "Tool",
    url: "https://www.microsoft.com/en-us/power-platform/products/power-bi",
    phase: "phase-3",
    note: "Phase 3 only. Do NOT touch before Week 6.",
  },
  "sql-murder-mystery": {
    name: "SQL Murder Mystery",
    kind: "Fun — weekend reward only",
    url: "https://mystery.knightlab.com/",
    phase: "weekend",
    note: "Weekend reward, not study time.",
  },
};

const ARCHIVED_RESOURCES = [
  {
    name: "dbt Learn Fundamentals",
    note: "Archived. Unlock post-offer when moving toward AE.",
    url: "https://courses.getdbt.com/courses/fundamentals",
  },
];

const RESOURCE_RULE =
  "Type every line yourself. AI answers questions. AI does not write code. Copilot must be OFF in your editor.";

const STUCK_PROTOCOL = [
  { range: "0–10 min", action: "Re-read the prompt. Rewrite it in plain English." },
  { range: "10–20 min", action: "Ask AI a question (not for code). Read the answer. Go back." },
  { range: "20 min", action: "Use the hint OR see the solution. Then rewrite from scratch." },
  { range: "Furious", action: "Stop. Walk. The day is done. Tomorrow you retry blind." },
];

const ARTIFACT_TYPES = {
  voice: { label: "Voice memo link", icon: Mic, placeholder: "Paste file/phone recording link (60 sec, no notes)" },
  notion: { label: "Notion teach-back link", icon: NotebookPen, placeholder: "Paste Notion page link (2 paragraphs, your words)" },
  reproduction: {
    label: "Blank-file reproduction",
    icon: BookOpen,
    placeholder: "Paste code rebuilt from scratch. A timestamp auto-attaches.",
    multiline: true,
  },
};

const WEEK_1_START = "2026-04-28";
const WEEK_1 = [
  {
    dow: "Mon",
    date: "Apr 28",
    title: "DataCamp — Intro to Python, Ch 1, first 3 exercises",
    resourceId: "datacamp-intro-python",
  },
  {
    dow: "Tue",
    date: "Apr 29",
    title: "DataCamp — Intro to Python, Ch 2, first 3 ex + Focusmate session",
    resourceId: "datacamp-intro-python",
  },
  {
    dow: "Wed",
    date: "Apr 30",
    title: "DataCamp — Intro to SQL, Ch 1, first 3 exercises",
    resourceId: "datacamp-intro-sql",
  },
  {
    dow: "Thu",
    date: "May 1",
    title: "Finish Intro to SQL Ch 1 + Focusmate session",
    resourceId: "datacamp-intro-sql",
  },
  {
    dow: "Fri",
    date: "May 2",
    title: "Review — redo 2 shaky exercises from the week",
    resourceId: null,
  },
  {
    dow: "Sat",
    date: "May 3",
    title: "Off, or SQL Murder Mystery for fun",
    resourceId: "sql-murder-mystery",
  },
  {
    dow: "Sun",
    date: "May 4",
    title: "30-min review — what worked; adjust Week 2",
    resourceId: null,
  },
];

const TABS = [
  { id: "today", label: "Today", icon: Sunrise },
  { id: "map", label: "Quest Map", icon: MapIcon },
  { id: "resources", label: "Resources", icon: BookOpen },
  { id: "pivots", label: "Future Pivots", icon: Lock },
];

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function computeCurrentPhaseId(startISO, todayISOStr) {
  if (!startISO) return "phase-1";
  const start = new Date(startISO + "T00:00:00");
  const today = new Date(todayISOStr + "T00:00:00");
  const days = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  if (days < 14) return "phase-1";
  if (days < 35) return "phase-2";
  if (days < 63) return "phase-3";
  return "phase-4";
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

function createInitialState() {
  return {
    journeyStartDate: WEEK_1_START,
    seenWeek1Starter: false,
    today: {
      date: todayISO(),
      anchorCoffeePhone: false,
      anchorExerciseBeforeFeeds: false,
      floorExercise: false,
      floorVoiceMemo: false,
      floorVoiceMemoNote: "",
      bonusConceptDone: false,
      bonusFocusmateBooked: false,
      tftUsed: 0,
      deepWorkMinutes: 0,
    },
    masteryArtifacts: {},
  };
}

function rollOverDayIfNeeded(state, setState) {
  const today = todayISO();
  if (state.today.date !== today) {
    setState((prev) => ({
      ...prev,
      today: { ...createInitialState().today, date: today },
    }));
  }
}

function Tabs({ active, onChange }) {
  return (
    <nav className="sticky top-0 z-10 border-b border-stone-200 bg-[#fafaf7]/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center gap-1 overflow-x-auto px-4 py-3">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition ${
                isActive
                  ? "border-stone-800 bg-stone-900 text-stone-50"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Header() {
  return (
    <header className="mx-auto max-w-4xl px-4 pt-8 pb-4">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="font-serif text-3xl tracking-tight text-stone-900">DA Roadmap</h1>
          <p className="mt-1 text-sm text-stone-500">
            {PRIMARY_PATH.title} · {PRIMARY_PATH.target}
          </p>
        </div>
        <div className="text-xs uppercase tracking-widest text-stone-400">{todayISO()}</div>
      </div>
    </header>
  );
}

export default function App() {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState("today");
  const [selectedPhaseId, setSelectedPhaseId] = useState(null);

  useEffect(() => {
    rollOverDayIfNeeded(state, setState);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota
    }
  }, [state]);

  const currentPhaseId = useMemo(
    () => computeCurrentPhaseId(state.journeyStartDate, todayISO()),
    [state.journeyStartDate],
  );

  const showWeek1Starter = !state.seenWeek1Starter && tab === "today";

  function dismissWeek1() {
    setState((prev) => ({ ...prev, seenWeek1Starter: true }));
  }

  function updateToday(patch) {
    setState((prev) => ({ ...prev, today: { ...prev.today, ...patch } }));
  }

  function setArtifact(checkId, patch) {
    setState((prev) => ({
      ...prev,
      masteryArtifacts: {
        ...prev.masteryArtifacts,
        [checkId]: { ...(prev.masteryArtifacts[checkId] || {}), ...patch },
      },
    }));
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] text-stone-900">
      <Header />
      <Tabs active={tab} onChange={setTab} />

      <main className="mx-auto max-w-4xl px-4 pb-24 pt-6">
        {tab === "today" && (
          <TodayScreen
            state={state}
            updateToday={updateToday}
            currentPhaseId={currentPhaseId}
            showWeek1Starter={showWeek1Starter}
            dismissWeek1={dismissWeek1}
          />
        )}
        {tab === "map" && (
          <QuestMap
            currentPhaseId={currentPhaseId}
            onPickPhase={(id) => setSelectedPhaseId(id)}
            selectedPhaseId={selectedPhaseId}
            state={state}
            setArtifact={setArtifact}
          />
        )}
        {tab === "resources" && <Resources currentPhaseId={currentPhaseId} />}
        {tab === "pivots" && <FuturePivots />}
      </main>
    </div>
  );
}

function TodayScreen({ state, updateToday, currentPhaseId, showWeek1Starter, dismissWeek1 }) {
  const phase = PHASES.find((p) => p.id === currentPhaseId);
  const floorDone = state.today.floorExercise && state.today.floorVoiceMemo;

  return (
    <div className="space-y-6">
      {showWeek1Starter && <Week1Starter onDismiss={dismissWeek1} />}
      <MorningAnchor state={state} updateToday={updateToday} />
      <Floor state={state} updateToday={updateToday} />
      <Bonus state={state} updateToday={updateToday} phase={phase} floorDone={floorDone} />
      <TheRule />
      <StuckProtocol />
      <DistractionBudget state={state} updateToday={updateToday} />
    </div>
  );
}

function SectionCard({ title, emphasis = false, children, footerNote }) {
  return (
    <section
      className={`rounded-2xl border p-5 shadow-sm ${
        emphasis ? "border-amber-300 bg-amber-50" : "border-stone-200 bg-white"
      }`}
    >
      <h2
        className={`font-serif ${emphasis ? "text-xl text-stone-900" : "text-base text-stone-800"} tracking-tight`}
      >
        {title}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
      {footerNote && <p className="mt-3 text-xs italic text-stone-500">{footerNote}</p>}
    </section>
  );
}

function CheckRow({ checked, onChange, label, hint, dim = false }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2.5 transition ${
        dim ? "border-stone-100 bg-stone-50/60 opacity-60" : "border-stone-200 bg-white hover:border-stone-400"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-stone-800"
      />
      <div className="min-w-0 flex-1">
        <div className={`text-sm ${checked ? "text-stone-400 line-through" : "text-stone-800"}`}>{label}</div>
        {hint && <div className="mt-0.5 text-xs text-stone-500">{hint}</div>}
      </div>
    </label>
  );
}

function MorningAnchor({ state, updateToday }) {
  const t = state.today;
  return (
    <SectionCard
      title={
        <span className="flex items-center gap-2">
          <Sunrise size={20} className="text-amber-600" /> Morning Anchor
        </span>
      }
      emphasis
      footerNote="This is the foundation of the day. Runs before anything else."
    >
      <CheckRow
        checked={t.anchorCoffeePhone}
        onChange={(v) => updateToday({ anchorCoffeePhone: v })}
        label="Coffee in hand, phone in another room"
      />
      <CheckRow
        checked={t.anchorExerciseBeforeFeeds}
        onChange={(v) => updateToday({ anchorExerciseBeforeFeeds: v })}
        label="One exercise done BEFORE any app or feed"
        hint="Not TFT. Not TikTok. One exercise first — literally any one."
      />
    </SectionCard>
  );
}

function Floor({ state, updateToday }) {
  const t = state.today;
  return (
    <SectionCard title={<span className="flex items-center gap-2"><Shield size={18} /> Floor (non-negotiable)</span>} footerNote="Floor = 1 exercise, not 30 minutes. Hit the floor, you're not behind.">
      <CheckRow
        checked={t.floorExercise}
        onChange={(v) => updateToday({ floorExercise: v })}
        label="1 DataCamp exercise OR 1 SQL problem"
      />
      <div className="rounded-lg border border-stone-200 bg-white p-3">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={t.floorVoiceMemo}
            onChange={(e) => updateToday({ floorVoiceMemo: e.target.checked })}
            className="mt-1 h-4 w-4 accent-stone-800"
          />
          <div className="flex-1">
            <div className={`text-sm ${t.floorVoiceMemo ? "text-stone-400 line-through" : "text-stone-800"}`}>
              5-min voice memo: what did I learn
            </div>
            <textarea
              value={t.floorVoiceMemoNote}
              onChange={(e) => updateToday({ floorVoiceMemoNote: e.target.value })}
              placeholder="Or type it here in 1–3 sentences."
              className="mt-2 w-full resize-y rounded border border-stone-200 bg-stone-50 p-2 text-sm focus:border-stone-400 focus:outline-none"
              rows={2}
            />
          </div>
        </label>
      </div>
    </SectionCard>
  );
}

function Bonus({ state, updateToday, phase, floorDone }) {
  const t = state.today;
  const firstConcept = phase?.concepts?.[0] || "Next concept";
  return (
    <SectionCard
      title={<span className="flex items-center gap-2"><Sparkles size={18} /> Bonus (only if floor done)</span>}
      footerNote={floorDone ? null : "Locked until Floor is done. This is by design."}
    >
      <CheckRow
        checked={t.bonusConceptDone}
        onChange={(v) => floorDone && updateToday({ bonusConceptDone: v })}
        label={`Next concept: ${firstConcept}`}
        hint={`Current phase: ${phase?.title} (${phase?.window})`}
        dim={!floorDone}
      />
      <CheckRow
        checked={t.bonusFocusmateBooked}
        onChange={(v) => floorDone && updateToday({ bonusFocusmateBooked: v })}
        label="Focusmate session booked for tomorrow?"
        dim={!floorDone}
      />
    </SectionCard>
  );
}

function TheRule() {
  return (
    <section className="rounded-2xl border border-stone-800 bg-stone-900 p-5 text-stone-50 shadow-sm">
      <h2 className="font-serif text-base tracking-tight">The Rule (always visible)</h2>
      <p className="mt-2 text-sm leading-relaxed">
        Type every line yourself. AI answers questions. AI does not write code.{" "}
        <span className="font-semibold">Copilot OFF.</span>
      </p>
    </section>
  );
}

function StuckProtocol() {
  return (
    <SectionCard title={<span className="flex items-center gap-2"><Target size={18} /> Stuck? Protocol</span>}>
      <ul className="space-y-1.5 text-sm">
        {STUCK_PROTOCOL.map((step) => (
          <li key={step.range} className="flex gap-3">
            <span className="w-20 shrink-0 font-mono text-xs text-stone-500">{step.range}</span>
            <span className="text-stone-800">{step.action}</span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

function DistractionBudget({ state, updateToday }) {
  const t = state.today;
  const floorDone = t.floorExercise && t.floorVoiceMemo;
  return (
    <SectionCard title={<span className="flex items-center gap-2"><Coffee size={18} /> Distraction Budget</span>}>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-stone-600">TFT today:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateToday({ tftUsed: Math.max(0, t.tftUsed - 1) })}
              className="rounded border border-stone-200 bg-white px-2 py-0.5 text-xs hover:border-stone-400"
            >
              −
            </button>
            <span className="font-mono">
              {t.tftUsed} / {floorDone ? 2 : 0}
            </span>
            <button
              onClick={() =>
                updateToday({ tftUsed: Math.min(floorDone ? 2 : 0, t.tftUsed + 1) })
              }
              className="rounded border border-stone-200 bg-white px-2 py-0.5 text-xs hover:border-stone-400"
            >
              +
            </button>
          </div>
          {!floorDone && <span className="text-xs italic text-stone-500">(0 until floor done)</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-stone-600">Deep work:</span>
          <input
            type="number"
            min={0}
            value={t.deepWorkMinutes}
            onChange={(e) => updateToday({ deepWorkMinutes: Number(e.target.value) || 0 })}
            className="w-20 rounded border border-stone-200 bg-white px-2 py-0.5 text-sm"
          />
          <span className="text-xs text-stone-500">min (target flexible)</span>
        </div>
      </div>
    </SectionCard>
  );
}

function Week1Starter({ onDismiss }) {
  return (
    <section className="rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50/70 p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h2 className="font-serif text-xl tracking-tight text-stone-900">Week 1 Starter — Apr 28 – May 4</h2>
        <button
          onClick={onDismiss}
          className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs text-stone-600 hover:border-stone-500"
        >
          Got it, hide this
        </button>
      </div>
      <p className="mt-1 text-sm text-stone-600">One obvious thing per day. Click through to the resource.</p>
      <ol className="mt-3 space-y-1.5">
        {WEEK_1.map((d) => {
          const r = d.resourceId ? RESOURCES[d.resourceId] : null;
          return (
            <li key={d.dow} className="flex items-start gap-3 rounded-lg bg-white/70 p-2.5">
              <span className="w-14 shrink-0 font-mono text-xs text-stone-500">
                {d.dow} <span className="text-stone-400">{d.date}</span>
              </span>
              <div className="flex-1 text-sm text-stone-800">
                {d.title}
                {r && (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 inline-flex items-center gap-1 text-xs text-amber-700 underline-offset-2 hover:underline"
                  >
                    open <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function QuestMap({ currentPhaseId, onPickPhase, selectedPhaseId, state, setArtifact }) {
  const selected = PHASES.find((p) => p.id === selectedPhaseId) || PHASES.find((p) => p.id === currentPhaseId);
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="font-serif text-xl tracking-tight">Quest Map — 4 Phases</h2>
        <p className="mt-1 text-sm text-stone-500">{PRIMARY_PATH.summary}</p>
        <ol className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          {PHASES.map((p) => {
            const isCurrent = p.id === currentPhaseId;
            const isSelected = p.id === selected.id;
            return (
              <li key={p.id}>
                <button
                  onClick={() => onPickPhase(p.id)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    isSelected
                      ? "border-stone-800 bg-stone-900 text-stone-50"
                      : isCurrent
                        ? "border-amber-400 bg-amber-50"
                        : "border-stone-200 bg-white hover:border-stone-400"
                  }`}
                >
                  <div className={`text-xs uppercase tracking-widest ${isSelected ? "text-stone-300" : "text-stone-400"}`}>
                    Phase {p.order} · {p.window}
                  </div>
                  <div className={`mt-1 font-serif text-lg ${isSelected ? "text-stone-50" : "text-stone-900"}`}>
                    {p.title}
                  </div>
                  <div className={`mt-1 text-xs ${isSelected ? "text-stone-300" : "text-stone-500"}`}>{p.mode}</div>
                </button>
              </li>
            );
          })}
        </ol>
      </section>

      <PhaseDetail phase={selected} state={state} setArtifact={setArtifact} />
    </div>
  );
}

function PhaseDetail({ phase, state, setArtifact }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-baseline justify-between">
        <h3 className="font-serif text-2xl tracking-tight">
          Phase {phase.order}: {phase.title}
        </h3>
        <span className="text-xs uppercase tracking-widest text-stone-400">{phase.window}</span>
      </div>
      <p className="mt-1 text-sm text-stone-600">{phase.mode}</p>

      <div className="mt-4 rounded-lg border border-stone-800 bg-stone-900 p-3 text-sm text-stone-50">
        <div className="text-xs uppercase tracking-widest text-stone-400">Phase rule</div>
        <div className="mt-1">{phase.rule}</div>
      </div>

      <div className="mt-5">
        <h4 className="text-xs uppercase tracking-widest text-stone-500">Target concepts</h4>
        <ul className="mt-2 space-y-1 text-sm text-stone-800">
          {phase.concepts.map((c) => (
            <li key={c} className="flex items-start gap-2">
              <Circle size={8} className="mt-1.5 shrink-0 text-stone-400" />
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <h4 className="text-xs uppercase tracking-widest text-stone-500">Resources for this phase</h4>
        <ul className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
          {phase.resourceIds.map((rid) => {
            const r = RESOURCES[rid];
            if (!r) return null;
            return (
              <li key={rid} className="rounded-lg border border-stone-200 p-3">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-sm font-medium text-stone-900 hover:underline"
                >
                  {r.name} <ExternalLink size={12} className="text-stone-400" />
                </a>
                <div className="mt-0.5 text-xs text-stone-500">{r.kind}</div>
                {r.note && <div className="mt-1 text-xs italic text-stone-500">{r.note}</div>}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-5">
        <h4 className="text-xs uppercase tracking-widest text-stone-500">Mastery checks — artifact required</h4>
        <div className="mt-2 space-y-3">
          {phase.mastery.map((m) => (
            <MasteryCheck key={m.id} check={m} artifact={state.masteryArtifacts[m.id]} onChange={(patch) => setArtifact(m.id, patch)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MasteryCheck({ check, artifact, onChange }) {
  const a = artifact || {};
  const chosen = a.type || check.allowed[0];
  const status = a.passed
    ? "passed"
    : a.value && a.value.trim()
      ? "artifact pending review"
      : "not attempted";
  const StatusIcon = a.passed ? CheckCircle2 : Circle;
  const TypeIcon = ARTIFACT_TYPES[chosen].icon;

  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50/40 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-stone-900">{check.title}</div>
          <div className="mt-1 text-xs text-stone-600">{check.prompt}</div>
        </div>
        <span
          className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs ${
            a.passed
              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
              : a.value
                ? "border-amber-300 bg-amber-50 text-amber-800"
                : "border-stone-200 bg-white text-stone-500"
          }`}
        >
          <StatusIcon size={12} />
          {status}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {check.allowed.map((type) => {
          const Icon = ARTIFACT_TYPES[type].icon;
          const isSelected = chosen === type;
          return (
            <button
              key={type}
              onClick={() => onChange({ type })}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs transition ${
                isSelected
                  ? "border-stone-800 bg-stone-900 text-stone-50"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
              }`}
            >
              <Icon size={10} />
              {ARTIFACT_TYPES[type].label}
            </button>
          );
        })}
      </div>

      <div className="mt-2">
        {ARTIFACT_TYPES[chosen].multiline ? (
          <textarea
            value={a.value || ""}
            onChange={(e) => onChange({ value: e.target.value })}
            placeholder={ARTIFACT_TYPES[chosen].placeholder}
            rows={3}
            className="w-full resize-y rounded border border-stone-200 bg-white p-2 text-sm focus:border-stone-400 focus:outline-none"
          />
        ) : (
          <input
            type="text"
            value={a.value || ""}
            onChange={(e) => onChange({ value: e.target.value })}
            placeholder={ARTIFACT_TYPES[chosen].placeholder}
            className="w-full rounded border border-stone-200 bg-white p-2 text-sm focus:border-stone-400 focus:outline-none"
          />
        )}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-stone-500">
          {a.timestamp ? `Last saved ${new Date(a.timestamp).toLocaleString()}` : "No artifact yet"}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onChange({ timestamp: Date.now() })}
            className="rounded border border-stone-200 bg-white px-2.5 py-1 text-xs hover:border-stone-400"
          >
            Save timestamp
          </button>
          <button
            onClick={() => onChange({ passed: !a.passed })}
            className={`rounded border px-2.5 py-1 text-xs transition ${
              a.passed
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-stone-300 bg-white text-stone-700 hover:border-stone-500"
            }`}
          >
            {a.passed ? "Passed ✓" : "Mark passed"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Resources({ currentPhaseId }) {
  const resourcesByPhase = PHASES.map((p) => ({
    phase: p,
    items: p.resourceIds.map((id) => ({ id, ...RESOURCES[id] })).filter((r) => r.name),
  }));
  const weekend = Object.entries(RESOURCES)
    .filter(([, r]) => r.phase === "weekend")
    .map(([id, r]) => ({ id, ...r }));

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-stone-800 bg-stone-900 p-5 text-stone-50 shadow-sm">
        <div className="flex items-start gap-2">
          <Shield size={18} className="mt-0.5 shrink-0" />
          <div>
            <h2 className="font-serif text-base tracking-tight">{RESOURCE_RULE}</h2>
            <p className="mt-1 text-xs text-stone-400">Shown on every resource. If Copilot is on, turn it off now.</p>
          </div>
        </div>
      </section>

      {resourcesByPhase.map(({ phase, items }) => (
        <section key={phase.id} className={`rounded-2xl border p-5 shadow-sm ${phase.id === currentPhaseId ? "border-amber-300 bg-amber-50/40" : "border-stone-200 bg-white"}`}>
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-xl tracking-tight">
              Phase {phase.order}: {phase.title}
            </h2>
            <span className="text-xs uppercase tracking-widest text-stone-400">{phase.window}</span>
          </div>
          <div className="mt-3 space-y-2">
            {items.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </section>
      ))}

      {weekend.length > 0 && (
        <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="font-serif text-xl tracking-tight">Weekend reward</h2>
          <div className="mt-3 space-y-2">
            {weekend.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
        <h2 className="font-serif text-base tracking-tight text-stone-700">Archived (not active)</h2>
        <ul className="mt-2 space-y-2 text-sm text-stone-500">
          {ARCHIVED_RESOURCES.map((r) => (
            <li key={r.name} className="flex items-baseline gap-2">
              <Lock size={12} className="shrink-0" />
              <a href={r.url} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                {r.name}
              </a>
              <span className="text-xs italic">— {r.note}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function ResourceCard({ resource }) {
  return (
    <article className="rounded-lg border border-stone-200 bg-white p-3">
      <div className="flex items-baseline justify-between gap-2">
        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1 text-sm font-medium text-stone-900 hover:underline"
        >
          {resource.name} <ExternalLink size={12} className="text-stone-400" />
        </a>
        <span className="text-xs uppercase tracking-widest text-stone-400">{resource.kind}</span>
      </div>
      {resource.note && <div className="mt-1 text-xs italic text-stone-500">{resource.note}</div>}
      <div className="mt-2 rounded border border-stone-800 bg-stone-900 px-2.5 py-1.5 text-xs text-stone-50">
        {RESOURCE_RULE}
      </div>
    </article>
  );
}

function FuturePivots() {
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <h2 className="font-serif text-xl tracking-tight">Future Pivots (locked)</h2>
        <p className="mt-1 text-sm text-stone-500">
          Visible for motivation. Not active. Unlocks happen <em>after</em> a December 2026 DA offer.
        </p>
      </section>
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
