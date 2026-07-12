# API Documentation Schema

This document details the expected REST API paths for the EcoSphere platform. All endpoints are prefixed with `/api/v1`.

## Base Path
`https://api.ecosphere.local/api/v1`

## API Endpoints List

### 1. Authentication (`/auth`)
- `POST /auth/register` - Register a new enterprise user.
- `POST /auth/login` - Authenticate and return JWT token.
- `POST /auth/logout` - Invalidate current session.
- `GET /auth/me` - Get logged-in user profile.

### 2. Environmental Metrics (`/environmental`)
- `GET /environmental/emissions` - Retrieve carbon emissions data.
- `POST /environmental/emissions` - Add carbon emissions record.
- `GET /environmental/resources` - Retrieve water/waste metrics.
- `POST /environmental/resources` - Record water/waste metrics.

### 3. Social Metrics (`/social`)
- `GET /social/metrics` - Retrieve demographic, labor, and safety data.
- `POST /social/metrics` - Record social metrics.

### 4. Governance Metrics (`/governance`)
- `GET /governance/compliance` - Retrieve compliance check reports.
- `POST /governance/compliance` - Log standard governance compliance check.

### 5. Gamification (`/gamification`)
- `GET /gamification/leaderboard` - Fetch ESG leaderboard.
- `GET /gamification/achievements` - Get list of achievements and status.

### 6. Reports (`/reports`)
- `GET /reports` - Get all generated ESG reports.
- `POST /reports/generate` - Trigger custom ESG PDF report generation.

### 7. Settings (`/settings`)
- `GET /settings/config` - Fetch platform parameters.
- `PATCH /settings/config` - Update platform parameters.
