# EcoSphere — ESG Management Platform

> An enterprise-grade **Environmental, Social & Governance (ESG)** management platform built to help modern enterprises track, analyze, report, and gamify their sustainability metrics.

---

## Live Demo

| Account | Email | Password | Role |
|---------|-------|----------|------|
| **Admin** | `admin@ecosphere.com` | `admin123` | Full platform access |
| **Manager** | `manager@ecosphere.com` | `manager123` | Department management |
| **Employee** | `employee@ecosphere.com` | `employee123` | Contributor view |

---

## Features

### Environmental Module
- **Carbon Transaction Logging** — Track Scope 1, 2 & 3 emissions with automatic CO₂e calculation using configurable emission factors
- **Environmental Goals** — Set department-level reduction targets with real-time progress tracking
- **Emission Factor Library** — EPA/DEFRA-sourced conversion factors for electricity, fleet, waste, and water

### Social Module (CSR)
- **CSR Activity Management** — Create, join, and track corporate social responsibility events
- **Volunteer Proof Submission** — Upload photographic evidence for participation verification
- **Manager Approval Workflow** — Review and approve/reject CSR submissions with point allocation

### Governance Module
- **ESG Policy Management** — Publish, version, and track employee policy acknowledgments
- **Compliance Audits** — Log internal and external audits with scoring and outcome tracking
- **Risk & Issue Registry** — File, assign, and resolve compliance issues with severity classification

### Gamification & Rewards
- **Sustainability Challenges** — Multi-difficulty challenges with progress tracking and evidence submission
- **XP & Points System** — Earn experience points and redeemable points for sustainable actions
- **Achievement Badges** — Automatically awarded badges based on unlock rules
- **Rewards Marketplace** — Redeem earned points for real-world eco-friendly rewards

### Reporting & Analytics
- **Executive Dashboard** — Real-time ESG scorecard with gauges, trend charts, leaderboard, and activity feed
- **Emission Breakdown Charts** — Donut and stacked bar visualizations by scope and source type
- **CSV Export** — Download comprehensive carbon register data for regulatory submissions

### Platform
- **Role-Based Access Control** — Admin, Manager, Contributor roles with granular permissions
- **Dark/Light Theme** — Full theme support with system preference detection
- **Mobile Responsive** — Hamburger sidebar, responsive grids, and touch-friendly interactions
- **Real-Time Notifications** — Slide-out notification drawer with unread tracking
- **JWT Authentication** — Secure token-based auth with refresh and rate limiting
- **Security Hardened** — Helmet headers, CORS restrictions, body size limits, and input validation

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts, React Query, React Router, Framer Motion |
| **Backend** | Node.js, Express.js, TypeScript, Zod, JWT, Helmet, Rate Limiting |
| **Database** | PostgreSQL, Prisma ORM (17 models, 10 enums, UUID PKs) |
| **DevOps** | Docker, docker-compose, CI/CD ready |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 14
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/Soha1711/odoo_hackathon.git
cd odoo_hackathon

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Environment

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your PostgreSQL credentials:
#   DATABASE_URL=postgresql://user:password@localhost:5432/ecosphere
#   JWT_SECRET=your-secret-key
#   CORS_ORIGIN=http://localhost:3000

# Frontend
cp frontend/.env.example frontend/.env
# Vite proxies /api to localhost:5000 by default
```

### 3. Setup Database

```bash
cd backend

# Run migrations
npx prisma migrate dev

# Seed demo data (50 users, 125+ transactions, 8 challenges, 4 policies...)
npx prisma db seed
```

### 4. Start Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend && npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend && npm run dev
```

Open **http://localhost:3000** and sign in with any demo account.

---

## Demo Walkthrough (for Hackathon Judges)

1. **Sign In** — Use the quick-access demo buttons on the login page
2. **Executive Dashboard** — View real-time ESG scores (gauge chart), 6-month carbon trend, department leaderboard, and recent activity timeline
3. **Environmental Module** — Browse 8 environmental goals with progress bars, view 125+ carbon transactions across 6 departments, and log a new emission
4. **Social (CSR)** — View 8 scheduled CSR activities, join an event with photo proof, and (as Manager) review pending approvals
5. **Governance** — Sign 4 ESG policies, browse 5 compliance audit records with scores, and review 10 risk/compliance issues
6. **Leaderboards** — View your XP/points balance, tackle sustainability challenges (Easy/Medium/Hard), and redeem points for eco-rewards
7. **Reports** — See donut and stacked bar charts of emissions by scope, and export the full carbon register as CSV
8. **Settings** — Manage departments and emission factors (Manager/Admin only)

---

## API Endpoints (40 REST Routes)

| Module | Routes |
|--------|--------|
| Auth | `POST /register`, `POST /login`, `GET /me` |
| Environment | `GET/POST /transactions`, `GET/POST /goals`, `GET /factors`, `GET /profiles` |
| Social | `GET/POST /activities`, `GET/POST /participations`, `PATCH /review` |
| Governance | `GET/POST /policies`, `POST /acknowledge`, `GET/POST /audits`, `GET/POST /issues`, `PATCH /issues` |
| Gamification | `GET/POST /challenges`, `POST /join`, `POST /progress`, `GET /rewards`, `POST /redeem`, `GET /leaderboard` |
| Dashboard | `GET /summary` |
| Reports | `GET /emissions` |
| Settings | `GET/POST /departments`, `GET /factors` |

---

## Project Structure

```
odoo_hackathon/
├── backend/
│   ├── src/
│   │   ├── modules/         # 8 domain modules (auth, environment, social, governance, etc.)
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── config/          # Prisma client, environment, CORS
│   │   └── app.ts           # Express app setup
│   └── prisma/
│       ├── schema.prisma    # 17 models, 10 enums
│       └── seed.ts          # Comprehensive demo data
├── frontend/
│   ├── src/
│   │   ├── pages/           # 9 page components
│   │   ├── components/      # UI primitives + ESG domain components + charts
│   │   ├── hooks/           # React Query hooks per module
│   │   ├── api/             # Axios API clients per module
│   │   ├── context/         # Auth & Theme providers
│   │   ├── layouts/         # Sidebar, Header, Layout shell
│   │   └── styles/          # Tailwind config + global CSS
│   └── index.html
├── shared/                  # Shared types & constants
├── docker/                  # Dockerfile + docker-compose
├── docs/                    # System design documents
└── scripts/                 # Automation scripts
```

---

## Database Schema (17 Models)

`User` · `Department` · `Category` · `EmissionFactor` · `ProductEsgProfile` · `EnvironmentalGoal` · `EsgPolicy` · `Badge` · `Reward` · `CarbonTransaction` · `CsrActivity` · `EmployeeParticipation` · `Challenge` · `ChallengeParticipation` · `PolicyAcknowledgment` · `Audit` · `ComplianceIssue` · `DepartmentScore` · `RewardRedemption` · `Notification` · `SystemConfig` · `UserBadge`

---

## License

MIT
