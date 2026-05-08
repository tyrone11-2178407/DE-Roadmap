# Career Quest

> A calm, ADHD-friendly learning OS aimed at landing a tech-career role by **December 2026**.

**Top 3 tracks (parallel applications, top 2 deep-prep):**
- Big 4 Tech Consulting (Deloitte / EY / PwC / KPMG)
- Tech Sales New-Grad Programs (Salesforce Futureforce, MSFT Aspire, AWS Tech U, Snowflake, Oracle, HubSpot, Datadog)
- Product / Data Analyst at tech (Salesforce, HubSpot, Atlassian, Asana, Notion, mid-market SaaS)

**Compensation aim:** $80–110k Y1 → $150–200k+ by Y3–Y5.

## Strategy: Foundation-First

Build the shared foundation first (SQL · Excel · Dashboards · STAR · Resume · Portfolio). All 3 tracks need this same base. Then 2–3 weeks of branch-specific prep per track. Apply broadly, deep-prep your top 2 of 3.

**Why foundation-first works for ADHD:** one focus at a time, visible progress compounds, daily decisions are simple ("work on SQL"), and if a track dies, foundation work isn't wasted.

## The Phases

| Phase | Window | Focus |
|---|---|---|
| **Phase 1: Foundation** | May 7 – Jul 16 (10 weeks) | SQL Mastery → Excel + Tableau → Just-Enough Python |
| **Phase 2: Portfolio Project** | Jul 16 – Aug 6 (3 weeks) | One end-to-end project: SQL + dashboard + pandas + write-up |
| **Phase 3: Track Branches** | Aug 6 – Sep 3 (4 weeks) | Pick 2 of 3 branches: A) Cases · B) Sales pitch · C) Analyst depth |
| **Phase 4: Apply + Sprint** | Sep 3 – Dec 31 | 100–150 applications, mock interviews, negotiation, offer |

**Side track:** LeetCode medium fluency (NeetCode 150) — 30 min/day, 6 months. Confidence builder, not required for any of the 3 target tracks.

## ADHD Mechanics

- **Grace days** — 2 free skips/month, auto-applied
- **Floating calendar** — durations not deadlines; only Oct 1 application peak is fixed
- **Minimum Viable Day (MVD)** — 5-min contact still counts
- **Buffer weeks** — 4 weeks built between Phase 3 end and Oct 1
- **Ship MVP buttons** — 30%-done declares phase complete and unlocks the next
- **Track Lock** — locked on these 3 tracks through Aug 1, 2026; re-evaluation requires written reasoning + Switching Cost calc
- **Kill switches** — explicit decision points for if you're behind

## Resource Budget

Total: **~$130** (vs. ~$310 in V1).

| Resource | Cost | Use |
|---|---|---|
| InterviewQuery (LIFETIME) | already paid | SQL/Python/case anchor |
| StrataScratch paid | ~$30 | SQL depth |
| DataCamp (May–Jul) | already paid | SQL + pandas tracks |
| Tableau Public, Power BI Learn, NeetCode, Pramp, Mode SQL | Free | Foundation + portfolio + mocks |
| Tableau Specialist cert (optional) | $100 | Resume credibility |
| Case Interview Secrets (Victor Cheng) | Free PDF | Light case prep |
| SPIN Selling / Challenger Sale | Library | Tech Sales branch |
| NWU career services | Free | Mock interviews + resume review |

## See also

Full spec with stage details, deliverables, AI prompts, decision trees, daily routine, and success metrics:
- [`ROADMAP_V2.md`](./ROADMAP_V2.md)

## Tech Stack

- React 19 · Vite · Tailwind v4 · Lucide React
- Single-file state-driven architecture (`src/App.jsx`)
- localStorage persistence

## Run Locally

```bash
npm install
npm run dev
```

## Deploy

GitHub Actions workflow at `.github/workflows/deploy.yml` deploys from `main` to GitHub Pages on every push.
