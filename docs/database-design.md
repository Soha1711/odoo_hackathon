# Database Design

This document outlines the database schema, models, and relationships using PostgreSQL and Prisma ORM.

## Entity Relationship Outline

### 1. User & Role
- **User:** `id`, `email`, `passwordHash`, `firstName`, `lastName`, `roleId`, `createdAt`, `updatedAt`
- **Role:** `id`, `name` (Admin, Manager, Contributor), `permissions`

### 2. Environmental Metrics
- **EnvironmentalRecord:** `id`, `userId`, `year`, `month`, `scope1`, `scope2`, `scope3`, `waterConsumption`, `wasteGenerated`, `createdAt`

### 3. Social Metrics
- **SocialRecord:** `id`, `userId`, `year`, `month`, `employeeCount`, `femaleRatio`, `trainingHours`, `injuryIncidentCount`, `createdAt`

### 4. Governance Metrics
- **GovernanceRecord:** `id`, `userId`, `year`, `boardSize`, `femaleBoardMembers`, `whistleblowerReports`, `briberyIncidents`, `createdAt`

### 5. Gamification
- **UserBadge:** `id`, `userId`, `badgeId`, `earnedAt`
- **Badge:** `id`, `name`, `description`, `iconUrl`
- **LeaderboardScore:** `id`, `userId`, `score`, `updatedAt`
