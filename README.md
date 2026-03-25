# Data Engineer Quest

A calm, ADHD-friendly learning OS for becoming interview-ready across Data Analyst, BI, BIE, Analytics Engineer, and DE-lite paths.

![Data Engineer Quest preview](./src/assets/hero.png)

## Live Demo

After GitHub Pages is enabled for this repository, the app will deploy automatically from `main`.

Expected demo URL format:

`https://<your-github-username>.github.io/<your-repo-name>/`

## Why This Exists

Most learning trackers either feel too generic, too motivational, or too disconnected from actual hiring outcomes. I built Data Engineer Quest as the operating system behind a serious data-career transition:

- one clear next step instead of a pile of tabs
- stage-based progression tied to DA / BI / BIE / AE readiness
- portfolio projects linked to the learning path
- lightweight proof and interview practice instead of fake completion

This is not meant to replace the actual portfolio projects. It is the system that organizes, paces, and makes those projects easier to finish well.

## What The Product Does

- Guides the user through a 90-day structured curriculum
- Turns each lesson into a clear recipe: open, stop, build, write, mark done
- Tracks role-readiness across Data Analyst, BI / BIE / Analytics Engineering, DE-lite, and AI-for-analyst workflows
- Connects learning segments to real portfolio project steps
- Surfaces top-tech strict readiness gates so progress is honest, not inflated
- Includes interview practice, project framing, and proof-based skill tracking

## Who It Is For

- Career changers moving into data roles
- ADHD learners who need a calmer and more explicit progression system
- People building toward analyst, BI, or pipeline-minded internships
- Learners who want one product to organize curriculum, projects, readiness, and job prep

## Key Product Decisions

- **Recipe-driven Today flow**
  The main screen is designed so a user can understand the next action in a few seconds.

- **Project-driven learning**
  Lessons are tied to the next unfinished project step so the curriculum does not feel abstract.

- **Strict readiness audit**
  The app distinguishes between “done enough to move on” and “actually strong enough for top-tech style hiring bars.”

- **Support-piece positioning**
  This app is a polished frontend product and learning system, but the core hiring proof still lives in the linked data projects.

## What This Project Demonstrates

- Frontend product implementation in React
- UX design for ADHD-friendly flows
- State-heavy single-page app design
- Curriculum / product-system thinking
- Clear project framing for portfolio support tools
- Tasteful visual design for a calm, stationery-inspired interface

## Screens / Product Areas

- **Today**
  One main learning recipe plus a compact checkpoint panel

- **Quest Map**
  Full stage structure, readiness gates, and resource continuation

- **Projects**
  Portfolio steps, outcomes, and interview framing

- **Gap Radar**
  Proof-based progress toward top-company expectations

- **Career HQ**
  Resume, outreach, applications, and progress utilities

## Tech Stack

- React
- Vite
- Tailwind CSS v4
- Lucide React
- Single-file state-driven architecture inside `src/App.jsx`

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

This repo includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

To publish it:

1. Push the repo to GitHub
2. Keep the default branch as `main`
3. In GitHub, open `Settings -> Pages`
4. Set the source to `GitHub Actions`
5. Push to `main` again if needed

The Vite base path is derived automatically during GitHub Actions builds, so it should work under the repository subpath without hardcoding your future repo name.

## Portfolio Framing

This app is not my only portfolio artifact.

It is the planning and progression system behind the deeper portfolio projects in data analysis, BI / BIE workflows, and pipeline thinking. The product itself shows frontend, UX, and systems-thinking ability, while the linked stage projects carry the role-specific proof.

## Future Improvements

- Better screenshot and social-preview polish
- Optional backend or snapshot syncing beyond browser-local save state
- Sharper onboarding for first-time users
- More refined GitHub-ready demo presentation and case-study assets
