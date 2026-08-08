
#  Box Breathing App

A full-stack web application that guides users through the **4-4-4-4 box breathing technique** using smooth animations, session tracking, and a modern UI. Built as a portfolio-ready project to demonstrate full-stack capabilities with Next.js, NestJS, and Framer Motion.

**Live Demo:** [Coming Soon](#)  
**Backend API:** [Coming Soon](#)

---

##  Table of Contents

- [Overview](#overview)
- [Why This Project](#why-this-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Stretch Features](#stretch-features)
- [Acknowledgements](#acknowledgements)
- [License](#license)

---

##  Overview

Box breathing (4-4-4-4) is a powerful stress-reduction technique used by athletes, military personnel, and mindfulness practitioners. This app provides an immersive, visually guided experience with a smooth expanding/contracting box animation synchronized with each breath phase.

The app tracks completed sessions, allowing users to monitor their progress over time.

---

##  Why This Project

This project was built to:

- Demonstrate proficiency in **Next.js 15 (App Router)** and **NestJS**.
- Showcase advanced animation skills using **Framer Motion**.
- Provide a complete, deployable full-stack solution beyond a typical CRUD app.
- Serve as a proof of my Skillset.

---

##  Features

| Feature                | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| **Technique Selection**| Choose "Box Breathing (4-4-4-4)" as the current practice.                   |
| **Duration Selection** | Pick session lengths of 1, 3, 5, or 10 minutes.                             |
| **Breathing Session**  | 4-phase cycle: Inhale (4s) → Hold (4s) → Exhale (4s) → Hold (4s).           |
| **Smooth Animations**  | Expanding/contracting box synced with breath phases via Framer Motion.      |
| **Phase Instructions** | Clear text cues: "Inhale", "Hold", "Exhale", "Hold".                        |
| **Progress Indicator** | Tracks total session progress and completed cycles.                         |
| **Pause/Resume**       | Temporarily pause and resume a session.                                     |
| **Session History**    | Logs completed sessions (date, duration, technique) to the backend.         |
| **Sound Cues**         | Optional metronome/audio feedback for each phase.                           |

---

##  Tech Stack

| Layer               | Technology                                                               |
| ------------------- | ------------------------------------------------------------------------ |
| **Frontend**        | Next.js 15 (App Router) + React 19 + TypeScript                          |
| **UI Library**      | shadcn/ui (Dialog, Button, Progress, Select)                             |
| **Styling**         | Tailwind CSS 3 + tailwindcss-animate                                     |
| **Animations**      | Framer Motion                                                            |
| **Icons**           | lucide-react                                                             |
| **Backend**         | NestJS + TypeScript                                                      |
| **Database**        | SQLite (development) / PostgreSQL (production)                           |
| **Deployment**      | Vercel (Frontend) + Railway (Backend)                                    |

---

##  Project Structure
```
box-breathing-app/
│
├── apps/
│   │
│   ├── web/                         # Next.js
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── login/
│   │   │   │   ├── session/
│   │   │   │   └── stats/
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── breathing/
│   │   │   │   ├── session/
│   │   │   │   ├── stats/
│   │   │   │   └── ui/
│   │   │   │
│   │   │   ├── lib/
│   │   │   ├── hooks/
│   │   │   └── types/
│   │   │
│   │   ├── package.json
│   │   └── .env.local
│   │
│   └── api/                         # NestJS
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── users/
│       │   │   ├── sessions/
│       │   │   └── stats/
│       │   │
│       │   ├── app.module.ts
│       │   └── main.ts
│       │
│       ├── package.json
│       └── .env
│
├── packages/
│   ├── shared/
│   │   ├── types/
│   │   └── schemas/
│   │
│   └── config/
│
├── docker-compose.yml
├── pnpm-workspace.yaml
├── package.json
└── README.md
```
---

##  Getting Started

### Prerequisites

- **Node.js** v20.x or higher
- **npm** v10.x or higher / **yarn** / **pnpm**
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sridhar7670/BoxBreathing-.git
   cd box-breathing-app
   ```

2. **Set up the Frontend (Next.js)**

   ```bash
   cd apps/web
   npm install
   # or
   yarn install
   ```

3. **Set up the Backend (NestJS)**

   ```bash
   cd ../api
   npm install
   # or
   yarn install
   ```

### Environment Variables

#### Frontend (`.env.local` in `apps/web`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### Backend (`.env` in `apps/api`)

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=sqlite:./data.db          # For SQLite
# For PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost:5432/box_breathing
```

### Running Locally

1. **Start the Backend**

   ```bash
   cd apps/api
   npm run start:dev
   # Server runs at http://localhost:3001
   ```

2. **Start the Frontend**

   ```bash
   cd apps/web
   npm run dev
   # Server runs at http://localhost:3000
   ```

3. Open **http://localhost:3000** in your browser.

4. Open **http://localhost:3001** in your postman to test api behaviour, or study apis in swagger docs. 

---

##  API Endpoints

| Method | Endpoint              | Description                      |
| ------ | --------------------- | -------------------------------- |
| POST   | `/api/sessions`       | Save a completed session.        |
| GET    | `/api/sessions`       | Retrieve all session history.    |
| GET    | `/api/sessions/:id`   | Retrieve a specific session.     |
| DELETE | `/api/sessions/:id`   | Delete a session record.         |

**Session Payload Example:**

```json
{
  "technique": "Box Breathing (4-4-4-4)",
  "duration": 300,
  "cyclesCompleted": 18,
  "startedAt": "2026-08-03T10:00:00Z",
  "completedAt": "2026-08-03T10:05:00Z"
}
```

---

##  Deployment

### Option A: Separate Services 

| Service | Platform      | Configuration                                   |
| ------- | ------------- | ----------------------------------------------- |
| Frontend| Vercel /Railway       | Connect `apps/web` repo; auto-deploy on `main`. |
| Backend | Railway       | Connect `apps/api` repo; set `NODE_ENV=production` and `DATABASE_URL` env. |

### Option B: Monorepo on Railway

1. Push the entire repository to GitHub.
2. Create a new project on Railway, connect your repo.
3. Railway will auto-detect both Next.js and NestJS services.
4. Set environment variables in Railway dashboard.

---

##  Stretch Features (Planned)

- [ ] Multiple techniques (4-7-8 breathing, deep breathing)
- [ ] Telegram Mini App integration
- [ ] Mood tracking (before/after sessions)
- [ ] Analytics dashboard (session patterns over time)
- [ ] Ambient sounds (forest, rain, ocean)

---

##  Acknowledgements

- [shadcn/ui](https://ui.shadcn.com) – For the Dialog Breathing Exercise block.
- [Framer Motion](https://www.framer.com/motion) – For smooth declarative animations.
- [Railway](https://railway.com) – For seamless backend deployment.

---

##  Author

**Sridhar Reddy**  
[GitHub](https://github.com/Sridhar7670) • [LinkedIn](https://www.linkedin.com/in/sridhar-reddy-37b63a203) •
[Portfolio](https://devs-personal-portfolio.netlify.app)

---

**Built with love as part of the Skill Testing.**
