# FDE / SE Roadmap

A calm, ADHD-friendly learning OS aimed at landing a **Forward Deployed Engineer / AI Solutions Engineer** offer by December 2026.

> **Primary track:** Forward Deployed Engineer / AI Solutions Engineer (FDE / SE)
> **Fallback track:** BI Engineer / Analytics Engineer (BIE / AE)
> **Target compensation:** $90k–$130k+

## Live Demo

After GitHub Pages is enabled, the app deploys automatically from `main`.

`https://<github-username>.github.io/<repo-name>/`

## Why This Exists

Most learning trackers either feel too generic, too motivational, or too disconnected from actual hiring outcomes. This is the operating system behind a serious career transition into customer-facing AI engineering — built ADHD-first so missed days don't punish, and outcome-first so the only thing that counts is what you ship.

- one clear next step instead of a pile of tabs
- contact-based streaks (5-minute days still count)
- floating calendar that shifts when you miss days, instead of a deadline that mocks you
- ship-MVP buttons so you can declare a stage 30%-done and move on

## Tracks

The app supports two tracks. Both share the SQL/Python spine (Stages 1, 2, 7), then diverge.

| | **FDE / SE (primary)** | **BIE / AE (fallback)** |
|---|---|---|
| **Target role** | Forward Deployed Engineer, AI Solutions Engineer, Customer Engineer | BI Engineer, Analytics Engineer, Senior Data Analyst |
| **Differentiator** | Vertical AI agent + customer discovery + cloud cert | SQL depth + dashboard + Python pipeline |
| **Companies** | Anthropic, OpenAI, Sierra, Decagon, Glean, Harvey, Hex, AWS Tech U, MS Aspire, Salesforce Futureforce | Insurance, healthcare, mid-size non-tech |
| **Stages 3–6** | AI Engineering → Vertical Project → Customer Skills → Cloud Cert | Optional / lighter touch |

The **Track Lock banner** locks you on FDE/SE through August 1, 2026. To re-evaluate before then, you write 200+ characters of reasoning, and a Switching Cost calculator shows weeks invested, weeks until applications peak, and which artifacts wouldn't carry over.

## Resource Strategy

Total paid spend across 8 months: **~$310**. Everything else free or library-accessible.

| Resource | Window | Use |
|---|---|---|
| **InterviewQuery** | LIFETIME | Daily anchor problem source May–Dec. Interview sprint platform in October. |
| **DataCamp** | May–Jul 2026 only | Front-load SQL, Python, pandas. Surface-level for AI/LLM. Will not be renewed. |
| **Anthropic docs / OpenAI Cookbook / Eugene Yan / Hamel evals** | Free | Where AI depth actually comes from. |
| **Real Python / Missing Semester / FastAPI** | Free | Python + tooling depth. |
| **Mode SQL / select-star / StrataScratch** | Free | SQL gap-fills. |
| **Stephane Maarek Udemy + Tutorials Dojo** | ~$54 | AWS CCP + SAA prep. |
| **AWS exam fees** | ~$100 + ~$150 | Cloud Practitioner + Solutions Architect Associate. |
| **The Mom Test** | Library copy | Customer discovery framework. |
| **Pramp / Exponent free trial / NWU careers** | Free | Mock interviews. |

## Missed Day Philosophy

The system does not punish you for being human. Four layers:

1. **Grace days.** 2 free skip days per calendar month, applied automatically. Streak displays as `14-day streak · 1 grace left`.
2. **Floating week structure.** Stages have *durations* (e.g., "4–5 weeks"), not deadlines. Miss 4 days, the calendar shifts 4 days. Only application deadlines are fixed.
3. **Minimum Viable Day (MVD).** On bad-focus days, a 5-minute "contact" activity counts as the streak day — one IQ problem read, one Anthropic doc paragraph, one Loom watched. Streak tracks contact, not productivity.
4. **Buffer weeks.** 2 weeks of slack baked between Stage 6 end (target end of September) and application peak (October 1). Falling behind eats buffer instead of missing applications.

## Stage MVPs

Each stage has a "minimum viable" version representing the 30% you absolutely need. The Today screen and each stage detail page show a **Ship MVP** button — clicking it declares the stage done at the MVP level so you can move on if August arrives mid-stage.

## Screens

- **Today** — Track Lock banner, streak with grace days, 3 anchor modes (Full / Half / MVD), current stage with Ship MVP, this week's deliverable, application peak countdown
- **Quest Map** — 7-stage roadmap with floating calendar visualization, concepts, primary + gap-fill resources, MVP definition, done criteria
- **Career HQ** — Application Timeline (23 programs across rolling + cohort tables), Gap Radar (track-specific readiness gates), Artifact Wall
- **Resources** — Resource Strategy panel + every resource grouped by stage
- **Future Pivots** — Honest acknowledgment of what's deferred

## Tech Stack

- React 19
- Vite
- Tailwind CSS v4
- Lucide React
- Single-file state-driven architecture in `src/App.jsx`
- localStorage persistence (`de-roadmap-fde-se-v2`)

## Run Locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## GitHub Pages Deployment

Workflow at `.github/workflows/deploy.yml` deploys from `main`. Set Pages source to "GitHub Actions" in repo settings, or use the `docs/` folder build that's also committed.
