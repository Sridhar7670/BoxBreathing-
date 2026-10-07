# Box Breathing App

A guided **box breathing** trainer — an animated ring and circle that expand, hold, contract and rest in time with your breath, with an optional metronome and a session progress read-out.

The web app is built and working. The API is still a NestJS scaffold; session history is not wired up yet.

---

## Contents

- [How it works](#how-it-works)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Roadmap](#roadmap)
- [Author](#author)

---

## How it works

A round is four equal phases — **Inhale → Hold → Exhale → Hold**. Everything the user can change is deliberately small:

| Setting | Options | Notes |
| ------- | ------- | ----- |
| **Phase length** | 3, 4, 5 or 6 seconds | All four phases share one length, so `4` means 4-4-4-4. Uneven patterns (4-7-8) are a different exercise and are not offered. |
| **Session length** | 1, 3, 5, 10 or 15 minutes | Rounded to the nearest **whole round**, so a session always ends on a completed breath (5 min at 4-4-4-4 → 19 rounds = 5:04). |
| **Metronome** | Off, Soft, Med, Loud | Web Audio oscillator: a quiet tick each second, a brighter chime on each phase change. No audio files. |

The timing engine lives in [useBreathingSession.ts](apps/web/components/Breathing/useBreathingSession.ts):

- **One clock, one source.** A single `requestAnimationFrame` loop reads real elapsed time; the countdown, the circle and the ring are all derived from it, so the number on screen can't drift from the picture around it.
- **No re-render per frame.** Continuous values (`breath`, `phaseProgress`, `roundProgress`, `sessionProgress`) are `motion` values written straight to the DOM. React re-renders roughly once a second, when the visible countdown actually changes.
- **Survives stalls.** A frame is capped at 250 ms and phase overflow carries forward instead of resetting, so a slow frame corrects itself rather than accumulating error the way `setInterval` does. Hiding the tab pauses the session explicitly.

Supporting modules: [breathing.constants.ts](apps/web/components/Breathing/breathing.constants.ts) (phases, labels, defaults), [breathing.utils.ts](apps/web/components/Breathing/breathing.utils.ts) (pure easing/format helpers), [ring.geometry.ts](apps/web/components/Breathing/ring.geometry.ts) (SVG arc maths), [breathing.audio.ts](apps/web/components/Breathing/breathing.audio.ts) (metronome).

---

## Tech stack

| Layer | Technology |
| ----- | ---------- |
| **Monorepo** | Yarn 4 workspaces (`apps/*`, `packages/*`) |
| **Frontend** | Next.js 16 (App Router) + React 19 + TypeScript 5 |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/postcss`) + co-located component CSS |
| **Animation** | `motion` (Motion for React) v13 |
| **UI** | Hand-rolled primitives in `components/ui` — no component library |
| **Backend** | NestJS 11 + TypeScript (scaffold) |
| **Database** | Not yet chosen — planned SQLite (dev) / PostgreSQL (prod) |

> Earlier drafts of this README listed shadcn/ui, lucide-react, Tailwind 3 and `framer-motion`. None of those are used: the UI primitives, styles and animations are written directly against Tailwind v4 and `motion`.

---

## Project structure

Components are grouped by feature, each with its own stylesheet and a barrel `index.ts`, so a folder can be imported as one unit (`@/components/Breathing`).

```
BoxBreathing/
├── apps/
│   ├── web/                          # Next.js 16 (App Router at the app root, no src/)
│   │   ├── app/                      # layout, page, loading, error, not-found, globals.css
│   │   └── components/
│   │       ├── Breathing/            # the feature: Breathing, Breathable, PhaseRing,
│   │       │                         # PhaseArc, Customize, Progress + hook, audio,
│   │       │                         # constants, types, interfaces, utils, geometry
│   │       ├── Home/                 # About, HowItWorks, Instructions
│   │       ├── layout/               # Header, Footer
│   │       └── ui/                   # Button, Card
│   ├── api/                          # NestJS scaffold (app.module / controller / service)
│   └── lib/util.ts                   # cn() — clsx + tailwind-merge
├── packages/
│   ├── shared/{types,schemas}/       # placeholders, empty for now
│   └── config/                       # placeholder, empty for now
├── package.json                      # workspace root + dev/build/lint scripts
└── yarn.lock
```

---

## Getting started

**Prerequisites:** Node.js 20+ and Docker (for the database, once there is one). Yarn 4 comes from Corepack.

```bash
git clone https://github.com/Sridhar7670/BoxBreathing-.git
cd BoxBreathing
make setup        # corepack enable + yarn install
```

The repeatable commands live in the [Makefile](Makefile) — run `make` on its own to list them:

| Command | Does |
| ------- | ---- |
| `make setup` | First-time setup: enable Corepack, install dependencies |
| `make web` | Next.js dev server on http://localhost:3000 |
| `make api` | NestJS dev server on http://localhost:3001 |
| `make db` | `docker compose up -d` — also `db-stop`, `db-logs`, `db-reset` |
| `make build` / `make lint` | Both apps; `-web` / `-api` variants run just one |
| `make test` | The API test suite |
| `make clean` / `make reset` | Drop build output; `reset` also reinstalls `node_modules` |

Each target is a thin wrapper over the root `yarn` scripts (`dev:web`, `build:api`, …), so those still work directly if you prefer.

**Two caveats while the backend is unfinished:**

- `docker-compose.yml` is still a placeholder, so the `db` targets will fail until a real service is defined in it.
- The API defaults to `PORT ?? 3000`, which collides with the web app — `make api` pins `PORT=3001` to work around it.

No environment variables are required yet — the frontend does not call the API.

---

## Roadmap

- [ ] Session persistence: `POST/GET /sessions` on the API, plus a database
- [ ] Wire the frontend to the API and add a history/stats view
- [ ] Fill in `packages/shared` with the session types and schemas both apps use
- [ ] Auth, so history belongs to a user
- [ ] More techniques (4-7-8, deep breathing) — needs the "all phases equal" assumption relaxed
- [ ] Ambient sounds, mood tracking, deployment (Vercel + Railway)

---

## Author

**Sridhar Reddy**
[GitHub](https://github.com/Sridhar7670) • [LinkedIn](https://www.linkedin.com/in/sridhar-reddy-37b63a203) • [Portfolio](https://devs-personal-portfolio.netlify.app)
