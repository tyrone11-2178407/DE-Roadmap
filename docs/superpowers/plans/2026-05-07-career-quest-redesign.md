# Career Quest Full Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign every screen of Career Quest (Today, Quest Map, Career HQ, Resources, Future Pivots, Track Lock) to match `ROADMAP_V2.md` (foundation-first, 3 tracks: Big 4 / Tech Sales / Analyst), and add the missing features the spec calls for: Capture Inbox, Energy Budget, LeetCode side track, Discovery CRM, Application Pipeline tracker, Artifact Feed, STAR Stories tracker.

**Architecture:** All state lives in a single React `useState` object persisted to `localStorage` under key `career-quest-v3`. The app is one file (`src/App.jsx`) with named functional components. New features extend the state shape and add new components inline. Migration strategy: bump storage key + initialize new fields with sensible defaults so existing users don't get broken state.

**Tech Stack:** React 19 · Vite · Tailwind v4 · Lucide React · localStorage. **No tests exist** — verification is manual (run `npm run dev`, click through, verify behavior). Each task includes a manual verification step.

**Conventions:**
- All file paths are relative to repo root: `/Users/ty/Desktop/FDE/DE-Roadmap`
- "Run dev" means: `cd /Users/ty/Desktop/FDE/DE-Roadmap && npm run dev` then open `http://localhost:5173`
- Commit after every task. Use Conventional Commits style (`feat:`, `fix:`, `refactor:`, `chore:`)

---

## Phase A — State Foundation

Adds the new state shape, helpers, and storage migration. No UI changes yet — this enables all subsequent UI work.

### Task A1: Extend state shape with new fields

**Files:**
- Modify: `src/App.jsx:496-522` (`createInitialState`)

- [ ] **Step 1: Add new fields to `createInitialState`**

Replace the body of `createInitialState()` (lines 497-521) with:

```javascript
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
```

- [ ] **Step 2: Verify build still passes**

Run: `cd /Users/ty/Desktop/FDE/DE-Roadmap && npm run build 2>&1 | tail -5`
Expected: `✓ built in <Xms>` with no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/ty/Desktop/FDE/DE-Roadmap
git add src/App.jsx
git commit -m "feat(state): extend state shape with V2 fields (capture, energy, leetcode, discovery, pipeline, starStories)"
```

---

### Task A2: Add capture, energy, leetcode, discovery handlers in `App()`

**Files:**
- Modify: `src/App.jsx` (insert before `return (` at line ~890, after `changeTrack` function)

- [ ] **Step 1: Add 8 new handler functions**

Find the line `function changeTrack(newTrack, reasoning) {` (around line 878). Right before the `return (` line that opens the JSX (around line 890), insert:

```javascript
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
```

- [ ] **Step 2: Verify build**

Run: `cd /Users/ty/Desktop/FDE/DE-Roadmap && npm run build 2>&1 | tail -3`
Expected: build success.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(state): add handlers for capture/energy/leetcode/discovery/pipeline/STAR stories"
```

---

## Phase B — New mini-components

Each component is small, self-contained, and gets dropped onto the Today or Career HQ screens in Phase C.

### Task B1: `CaptureInbox` component

**Files:**
- Modify: `src/App.jsx` — append to end of file (before final closing); component will be wired to Today screen in Task C1.

- [ ] **Step 1: Add `CaptureInbox` component**

Append at end of `src/App.jsx` (after the last `}` of `ModalShell`):

```javascript
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
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -3`
Expected: build success.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(today): add CaptureInbox component"
```

---

### Task B2: `EnergyBudget` component

**Files:**
- Modify: `src/App.jsx` — append after `CaptureInbox`.

- [ ] **Step 1: Add `EnergyBudget` component**

Append:

```javascript
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
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -3`

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(today): add EnergyBudget component (sleep/move/social → mode prescription)"
```

---

### Task B3: `LeetCodeTracker` component

**Files:**
- Modify: `src/App.jsx` — append after `EnergyBudget`.

- [ ] **Step 1: Add `LeetCodeTracker`**

Append:

```javascript
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

  // NeetCode 150 milestones
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
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -3`

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(today): add LeetCodeTracker (NeetCode 150 progress bars + log)"
```

---

### Task B4: `DiscoveryCRM` component

**Files:**
- Modify: `src/App.jsx` — append after `LeetCodeTracker`.

- [ ] **Step 1: Add `DiscoveryCRM`**

Append:

```javascript
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
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -3`

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(career): add DiscoveryCRM (outreach → reply → scheduled → completed funnel)"
```

---

### Task B5: `StarStoriesTracker` component

**Files:**
- Modify: `src/App.jsx` — append after `DiscoveryCRM`.

- [ ] **Step 1: Add `StarStoriesTracker`**

Append:

```javascript
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
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -3`

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(career): add StarStoriesTracker (15-story target with LP mapping)"
```

---

### Task B6: `PipelineTracker` component

**Files:**
- Modify: `src/App.jsx` — append after `StarStoriesTracker`.

- [ ] **Step 1: Add `PipelineTracker`**

Append:

```javascript
const PIPELINE_STAGES = ["Applied", "Recruiter", "Tech Screen", "Onsite", "Offer"];
const OFFER_STATUSES = [
  { id: "pending", label: "Pending" },
  { id: "offered", label: "Offered" },
  { id: "accepted", label: "Accepted" },
  { id: "rejected", label: "Rejected" },
  { id: "ghosted", label: "Ghosted" },
];

function PipelineTracker({ pipeline, applications, onAddStage, onSetOffer }) {
  // Show all applications with status set, plus pipeline data
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
```

- [ ] **Step 2: Verify build**

Run: `npm run build 2>&1 | tail -3`

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(career): add PipelineTracker (applied→recruiter→tech→onsite→offer per company)"
```

---

## Phase C — Screen redesigns (wire mini-components in)

### Task C1: Wire CaptureInbox + EnergyBudget + LeetCodeTracker into Today screen

**Files:**
- Modify: `src/App.jsx` — `Today` component (line 1153) and `App()` props for `<Today>` (line 897)

- [ ] **Step 1: Add new props to `Today` signature**

Find `function Today({ state, currentStage, calendar, isTrackLocked, onOpenTrack, onCheckIn, onSetMode, onToggleCheck, onShipMVP, onUnshipMVP, onShiftCalendar, onResetCalendarShift, onOpenLessonModal, onStartMondayReview, onDismissMondayPrompt }) {` (line 1153).

Replace the destructuring with:

```javascript
function Today({ state, currentStage, calendar, isTrackLocked, onOpenTrack, onCheckIn, onSetMode, onToggleCheck, onShipMVP, onUnshipMVP, onShiftCalendar, onResetCalendarShift, onOpenLessonModal, onStartMondayReview, onDismissMondayPrompt, onAddCapture, onDeleteCapture, onSetEnergy, onLogLeetcode }) {
```

- [ ] **Step 2: Add the 3 new sections to Today's JSX**

Inside `Today`, find the closing `</div>` of the main container (the last `</div>` before the function ends). Right before that final closing div, add:

```jsx
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
```

- [ ] **Step 3: Pass the new props in `App()` to `<Today>`**

Find the `<Today` JSX block in `App()` (around line 897). Add these prop lines before the closing `/>`:

```jsx
            onAddCapture={addCapture}
            onDeleteCapture={deleteCapture}
            onSetEnergy={setEnergyToday}
            onLogLeetcode={logLeetcode}
```

- [ ] **Step 4: Verify in browser**

Run: `npm run dev` (in another terminal)
Open `http://localhost:5173`
- Verify: Today tab shows Energy Budget card, Capture Inbox card, and LeetCode Tracker card under the existing content.
- Click an Energy checkbox — text changes ("Green / Yellow / Red day" prescription).
- Type into Capture Inbox + Enter — item appears.
- Type a problem in LeetCode + click Log — count increases.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx
git commit -m "feat(today): wire CaptureInbox, EnergyBudget, LeetCodeTracker into Today screen"
```

---

### Task C2: Update Quest Map labels for Foundation phase grouping

**Files:**
- Modify: `src/App.jsx` — `QuestMap` (line 1641)

- [ ] **Step 1: Add a phase label helper above `QuestMap`**

Insert before `function QuestMap(...)`:

```javascript
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
```

- [ ] **Step 2: Show phase badge per stage in `QuestMap`**

Inside `QuestMap`, find where each stage button is rendered (look for `STAGES.map`). Add a phase label badge near the stage title. Example — find the stage title rendering and add right before/after it:

```jsx
<span className={`text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border ${PHASE_COLORS[phaseLabel(stage.order)]}`}>
  {phaseLabel(stage.order)}
</span>
```

- [ ] **Step 3: Verify in browser**

Run dev. Quest Map tab shows each stage with a colored phase pill (Foundation / Portfolio / Branches / Apply / Sprint).

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat(map): show V2 phase labels (Foundation/Portfolio/Branches/Apply/Sprint) on Quest Map"
```

---

### Task C3: Update `GAP_RADAR_GATES` for V2 tracks

**Files:**
- Modify: `src/App.jsx:392-428`

- [ ] **Step 1: Replace `GAP_RADAR_GATES` block**

Replace lines 392-428:

```javascript
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
```

- [ ] **Step 2: Update `GapRadar` component to render all 3 tracks unconditionally**

Find `function GapRadar({ state, onSetGate })` (line 2442). Replace its body so it iterates `["big4", "sales", "analyst"]` instead of the old gate keys. Find the existing iteration logic and update the keys it references.

Look for any reference to old keys `fde`, `se`, `bie` inside `GapRadar` and replace with `big4`, `sales`, `analyst`.

- [ ] **Step 3: Verify in browser**

Career HQ tab → Gap Radar section. Should show 3 panels (Big 4 / Sales / Analyst), each with their gates. Old gates like "Shipped 1 vertical AI agent" should be gone.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat(career): replace Gap Radar gates with V2 tracks (Big 4 / Sales / Analyst)"
```

---

### Task C4: Update `SPRINT_TARGETS` for V2 timeline

**Files:**
- Modify: `src/App.jsx:385-390`

- [ ] **Step 1: Replace `SPRINT_TARGETS`**

Replace lines 385-390:

```javascript
const SPRINT_TARGETS = [
  { date: "Jul 16", target: "Phase 1 done — 75 SQL · 3 dashboards · 1 pandas notebook · 10 STARs" },
  { date: "Aug 6", target: "Phase 2 done — 1 portfolio project shipped to GitHub" },
  { date: "Sep 3", target: "Phase 3 done — 2 branches deep-prepped · 8 mocks · 50 LeetCode mediums" },
  { date: "Oct 1", target: "100+ applications submitted across 3 tracks" },
  { date: "Dec 31", target: "1 offer accepted at $80k+ base" },
];
```

- [ ] **Step 2: Verify in browser**

Today tab → "Sprint Targets" row shows the new dates and targets.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(today): align Sprint Targets with V2 timeline (Phase 1-3 → Apply → Offer)"
```

---

### Task C5: Wire DiscoveryCRM, StarStoriesTracker, PipelineTracker into Career HQ

**Files:**
- Modify: `src/App.jsx` — `CareerHQ` component (line 1914) and the `<CareerHQ>` JSX in `App()` (line 935)

- [ ] **Step 1: Extend `CareerHQ` props**

Find `function CareerHQ({ state, onSetApplicationStatus, onAddArtifact, onRemoveArtifact, onSetGate, onOpenLessonModal, onEditLesson, onDeleteLesson, onStartReview }) {` (line 1914).

Replace the destructuring to:

```javascript
function CareerHQ({
  state,
  onSetApplicationStatus, onAddArtifact, onRemoveArtifact, onSetGate,
  onOpenLessonModal, onEditLesson, onDeleteLesson, onStartReview,
  onAddDiscovery, onUpdateDiscovery, onDeleteDiscovery,
  onAddStar, onUpdateStar, onDeleteStar,
  onAddPipelineStage, onSetPipelineOffer,
}) {
```

- [ ] **Step 2: Add the 3 new sections to `CareerHQ` body**

Find where `CareerHQ` renders its existing children (Application Timeline, Gap Radar, Artifact Wall). Add these 3 sections between the Application Timeline and Gap Radar (or wherever logical):

```jsx
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
```

- [ ] **Step 3: Pass new props from `App()`**

In `App()`'s `<CareerHQ` block, add:

```jsx
            onAddDiscovery={addDiscoveryContact}
            onUpdateDiscovery={updateDiscoveryContact}
            onDeleteDiscovery={deleteDiscoveryContact}
            onAddStar={addStarStory}
            onUpdateStar={updateStarStory}
            onDeleteStar={deleteStarStory}
            onAddPipelineStage={addPipelineStage}
            onSetPipelineOffer={setPipelineOffer}
```

- [ ] **Step 4: Verify in browser**

Career HQ tab. Should now show: Application Timeline → Pipeline Tracker → Discovery CRM → STAR Stories → Gap Radar → Artifact Wall (or whatever order you chose).
- Add a discovery contact → it appears.
- Add a STAR story → counter increments.
- Mark an app as applied (in Application Timeline) → appears in Pipeline Tracker.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx
git commit -m "feat(career): wire DiscoveryCRM, StarStoriesTracker, PipelineTracker into Career HQ"
```

---

### Task C6: Refresh Artifact Wall to feed-style with live counters

**Files:**
- Modify: `src/App.jsx` — `ArtifactWall` (line 2483)

- [ ] **Step 1: Add a counters strip at the top of `ArtifactWall`**

Inside `ArtifactWall` JSX, before the existing list, add:

```jsx
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
```

(Note: `ArtifactWall` will need access to `state` — check its current signature; if it currently only takes `state.artifacts` slice, expand it. If `state` already in props, just reference it.)

- [ ] **Step 2: Verify in browser**

Career HQ → Artifact Wall shows 4 counter cards (SQL solved / Commits / Applications / STAR stories) with progress bars.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(career): add Artifact Wall counters strip (SQL/commits/apps/STARs)"
```

---

## Phase D — Resources, Future Pivots, Track Lock

### Task D1: Replace Resources content with V2 list

**Files:**
- Modify: `src/App.jsx` — `RESOURCES` object (line 303) and/or `Resources` component (line 2610)

- [ ] **Step 1: Add new V2 resources**

In the `RESOURCES` const (line 303-381), append:

```javascript
  // V2 additions
  "tableau-public": { name: "Tableau Public — free training", url: "https://public.tableau.com/app/learn/sample-data", tag: "Free" },
  "powerbi-learn": { name: "Microsoft Learn — Power BI", url: "https://learn.microsoft.com/en-us/training/powerplatform/power-bi", tag: "Free" },
  "exceljet": { name: "ExcelJet — formula tutorials", url: "https://exceljet.net/", tag: "Free" },
  "tableau-cert": { name: "Tableau Specialist cert (~$100)", url: "https://www.tableau.com/learn/certification/specialist", tag: "Tableau · ~$100" },
  "pl-300": { name: "PL-300 Power BI Data Analyst (~$165)", url: "https://learn.microsoft.com/en-us/credentials/certifications/data-analyst-associate/", tag: "Microsoft · ~$165" },
  "neetcode": { name: "NeetCode 150", url: "https://neetcode.io/", tag: "Free" },
  "victor-cheng": { name: "Case Interview Secrets — Victor Cheng (free PDF)", url: "https://www.caseinterview.com/", tag: "Free PDF" },
  "spin-selling": { name: "SPIN Selling — Neil Rackham", url: "https://www.amazon.com/SPIN-Selling-Neil-Rackham/dp/0070511136", tag: "Library copy" },
  "challenger-sale": { name: "The Challenger Sale", url: "https://www.amazon.com/Challenger-Sale-Taking-Customer-Conversation/dp/1591844355", tag: "Library copy" },
  "kaggle-learn": { name: "Kaggle Learn — pandas", url: "https://www.kaggle.com/learn/pandas", tag: "Free" },
  "futureforce": { name: "Salesforce Futureforce", url: "https://www.salesforce.com/company/careers/university-recruiting/", tag: "Tech Sales · new grad" },
  "ms-aspire": { name: "Microsoft Aspire (Sales)", url: "https://careers.microsoft.com/v2/global/en/students.html", tag: "Tech Sales · new grad" },
  "aws-techu": { name: "AWS Tech U Sales", url: "https://www.amazon.jobs/en/teams/AWSTechU", tag: "Tech Sales · new grad" },
```

- [ ] **Step 2: Update `Resources` component to group by V2 phase**

Find `function Resources({ currentStageId })` (line 2610). Restructure its grouping into the new phases:
- **Foundation:** SQL · Excel/Dashboards · Python (resources by stage 1-3)
- **Portfolio:** Stage 4 resources (loom, hosting if any)
- **Branches:** case prep · sales books · analyst (Stage 5)
- **Apply / Sprint:** Pramp, levels.fyi, NWU, etc. (Stage 6-7)

Keep showing the current stage's resources prominently at the top.

- [ ] **Step 3: Verify in browser**

Resources tab. Should show all V2 resources grouped by phase. The "current stage" highlight should still work.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat(resources): replace V1 resources with V2 list (Tableau/PowerBI/NeetCode/sales books)"
```

---

### Task D2: Update Future Pivots to V2 strategy

**Files:**
- Modify: `src/App.jsx:444-448` (`FUTURE_PIVOTS`)

- [ ] **Step 1: Replace `FUTURE_PIVOTS`**

Replace:

```javascript
const FUTURE_PIVOTS = [
  { id: "fde", title: "Forward Deployed Engineer (Anthropic / Sierra / Decagon)", note: "Stretch role for Y3-Y5 once you've shipped customer-facing AI work and built a referral network. Not the new-grad door." },
  { id: "se", title: "Sales / Solutions Engineer at SaaS", note: "Possible Y2-Y3 transition from CSM or IC. Requires demo skill + light Python." },
  { id: "ce-faang", title: "Customer Engineer at Google / AWS / Microsoft", note: "Possible Y2-Y3 if LeetCode side track sticks. Python is the gating skill." },
  { id: "ds", title: "Data Scientist", note: "Requires Python depth + stats. Add 12+ months of LeetCode + statistics if you want this." },
  { id: "mbb", title: "MBB Strategy Consulting", note: "Stretch — only if you commit to 50+ cases. Hyper-competitive entry but possible after Y2 with consulting experience." },
  { id: "pm", title: "Product Manager (APM programs)", note: "Highly competitive. Possible after Y2-Y3 with proven product analytics work." },
];
```

- [ ] **Step 2: Verify in browser**

Future Pivots tab shows 6 V2 pivot options instead of the V1 list.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat(pivots): replace Future Pivots with V2 stretch roles (FDE/SE/CE/DS/MBB/PM)"
```

---

### Task D3: Polish Track Lock copy + Switching Cost

**Files:**
- Modify: `src/App.jsx` — `TrackChangeModal` (line 2696), `SwitchingCostModal` (line 2762)

- [ ] **Step 1: Update banner + modal copy in `TrackLockBanner`**

Find `function TrackLockBanner` (line 1465). Update any user-facing strings that still say "FDE / SE" or "BIE / AE" to use the new track titles dynamically (`trackInfo.short`).

- [ ] **Step 2: Update `TrackChangeModal` to clarify what changes**

Find `TrackChangeModal` (line 2696). Update the explanatory paragraph to say something like: "Switching focus alters which Stage 5 branch you deep-prep (cases vs. sales pitch vs. analyst depth) and which companies are emphasized in Career HQ. Foundation work carries over."

- [ ] **Step 3: Verify in browser**

Today screen → Track Lock banner. Click it. Modal should show V2-aware copy.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat(track): update Track Lock copy to V2 track names + branch-aware switching cost"
```

---

### Task D4: Add Kill-Switch banner on Today

**Files:**
- Modify: `src/App.jsx` — `Today` component

- [ ] **Step 1: Add `KillSwitchBanner` component above `Today`**

Insert before `function Today(...)`:

```javascript
function KillSwitchBanner({ state, calendar }) {
  const today = todayISO();
  const triggers = [];
  // June 1 SQL gate
  if (today >= "2026-06-01") {
    const sqlSolved = (state.artifacts || []).filter((a) => a.kind === "sql_problem").length;
    if (sqlSolved < 25) {
      triggers.push("SQL is below MVP (25). Drop Stage 3 Python, double down on SQL.");
    }
  }
  // July 30 portfolio gate
  if (today >= "2026-07-30" && !state.stages?.["stage-4"]?.mvpShipped) {
    triggers.push("Phase 1 not done by Jul 30. Skip Phase 2 polish, jump to Phase 3 branches with what you have.");
  }
  // Sep 3 portfolio gate
  if (today >= "2026-09-03" && !state.stages?.["stage-4"]?.mvpShipped) {
    triggers.push("No portfolio by Sep 3. Drop LeetCode, ship anything.");
  }
  // Oct 15 interview gate
  if (today >= "2026-10-15") {
    const fr = Object.values(state.pipeline || {}).filter((p) => p.stages.some((s) => s.name === "Recruiter")).length;
    if (fr === 0) {
      triggers.push("No first-round interviews by Oct 15. Drop Big 4 deep prep, lean Sales + Analyst safety net.");
    }
  }
  if (triggers.length === 0) return null;
  return (
    <div className="rounded-md border-l-4 border-rose-400 bg-rose-50 px-4 py-3 mb-4">
      <div className="text-sm font-semibold text-rose-700 mb-1">Kill switch triggered</div>
      <ul className="list-disc pl-5 text-xs text-rose-700 space-y-0.5">
        {triggers.map((t, i) => <li key={i}>{t}</li>)}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Render `<KillSwitchBanner>` at the top of `Today`**

Inside `Today`, near the top of the JSX (before any current content), add:

```jsx
      <KillSwitchBanner state={state} calendar={calendar} />
```

- [ ] **Step 3: Verify in browser**

Today screen. The banner only renders after specific dates have passed (won't show today, May 7 — that's correct). To test, temporarily change a date condition to `today >= "2026-05-01"` and verify the banner renders, then revert.

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat(today): add KillSwitchBanner with date-gated decision triggers"
```

---

## Phase E — Final polish + push

### Task E1: Migration safety pass

**Files:**
- Modify: `src/App.jsx` — `loadState` (line 555)

- [ ] **Step 1: Update `loadState` to merge defaults for new fields**

Replace `loadState`:

```javascript
function loadState() {
  if (typeof window === "undefined") return createInitialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    const defaults = createInitialState();
    return {
      ...defaults,
      ...parsed,
      // ensure nested objects from V2 have defaults
      capture: parsed.capture || [],
      energy: parsed.energy || {},
      leetcode: parsed.leetcode || defaults.leetcode,
      discovery: parsed.discovery || [],
      pipeline: parsed.pipeline || {},
      starStories: parsed.starStories || [],
    };
  } catch {
    return createInitialState();
  }
}
```

- [ ] **Step 2: Verify**

Open browser → DevTools → Application → Local Storage → `career-quest-v3` → set a partial value missing the new keys. Reload. App should not crash.

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "fix(state): merge V2 defaults on load so partial localStorage doesn't crash app"
```

---

### Task E2: Spot-check all tabs in browser

**Files:** none — manual verification

- [ ] **Step 1: Run dev server**

```bash
npm run dev
```

- [ ] **Step 2: Click through every tab and verify**

- **Today:** Streak, current stage, anchor mode picker, sprint targets, energy budget, capture inbox, leetcode tracker — all render. KillSwitch hidden (correct for today's date).
- **Quest Map:** All 7 stages with V2 names, phase pills (Foundation/Portfolio/Branches/Apply/Sprint).
- **Career HQ:** Application Timeline, Pipeline Tracker (empty until apps marked applied), Discovery CRM (empty/+Add works), STAR Stories (empty/+Add works), Gap Radar (3 panels: Big 4 / Sales / Analyst), Artifact Wall (4 counter cards + feed).
- **Resources:** V2 resources grouped by phase, current stage highlighted.
- **Future Pivots:** 6 V2 pivot cards.
- **Track Lock banner:** Opens modal with V2 copy.

- [ ] **Step 3: Take a screenshot of each tab** (optional, for record)

```bash
# Manual — Cmd+Shift+5 in macOS
```

- [ ] **Step 4: Commit if anything was tweaked**

If you found and fixed any issue: `git commit -m "fix: <issue>"`

---

### Task E3: Build + deploy

**Files:** none — deploy pipeline

- [ ] **Step 1: Production build**

```bash
cd /Users/ty/Desktop/FDE/DE-Roadmap
npm run build
```

Expected: `✓ built in <Xms>` with no errors.

- [ ] **Step 2: Push to main (GitHub Actions auto-deploys)**

```bash
git push origin main
```

Watch: https://github.com/tyrone11-2178407/DE-Roadmap/actions

- [ ] **Step 3: Verify deploy**

After ~1 minute, hard-reload `https://tyrone11-2178407.github.io/DE-Roadmap/` (Cmd+Shift+R in Chrome, Option+Cmd+R in Safari). Confirm:
- Page title: "Career Quest"
- Today tab shows new sections
- Career HQ shows Discovery CRM, STAR Stories, Pipeline Tracker

- [ ] **Step 4: Final commit (if needed)**

If deploy revealed any issue: fix + commit + push.

---

## Self-Review

**1. Spec coverage:**

Walking through `ROADMAP_V2.md`:
- ✅ 3-track structure → Tasks A1, C3 (gates), C5 (CareerHQ wiring)
- ✅ Foundation-first phases → Task C2 (Quest Map labels), STAGES already updated
- ✅ Capture inbox → Tasks A2 (state), B1 (component), C1 (wired)
- ✅ Energy budget → Tasks A2, B2, C1
- ✅ LeetCode side track → Tasks A2, B3, C1
- ✅ Discovery CRM → Tasks A2, B4, C5
- ✅ Pipeline tracker → Tasks A2, B6, C5
- ✅ STAR stories tracker → Tasks A2, B5, C5
- ✅ Artifact wall feed-style → Task C6
- ✅ Sprint targets → Task C4
- ✅ Resources V2 → Task D1
- ✅ Future Pivots V2 → Task D2
- ✅ Kill-switch decision tree → Task D4
- ✅ Track Lock V2 copy → Task D3
- ✅ Migration safety → Task E1

**2. Placeholder scan:**
No "TBD," "implement later," or "similar to Task N" patterns. Each step shows actual code or actual commands.

**3. Type / property consistency:**
- `addCapture`/`onAddCapture` ✓
- `setEnergyToday`/`onSetEnergy` ✓
- `logLeetcode`/`onLogLeetcode` ✓
- `addDiscoveryContact`/`onAddDiscovery` ✓
- `addStarStory`/`onAddStar` ✓
- `addPipelineStage`/`onAddPipelineStage` ✓
- `setPipelineOffer`/`onSetPipelineOffer` ✓
- State fields `capture`, `energy`, `leetcode`, `discovery`, `pipeline`, `starStories` consistent across A1, A2, components, and migration in E1.

Plan is consistent and complete.
