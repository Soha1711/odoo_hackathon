export const API_BASE_URL = ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:5000/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  DASHBOARD: {
    SUMMARY: '/dashboard/summary',
  },
  ENVIRONMENTAL: {
    FACTORS: '/environmental/factors',
    PROFILES: '/environmental/profiles',
    TRANSACTIONS: '/environmental/transactions',
    GOALS: '/environmental/goals',
  },
  SOCIAL: {
    ACTIVITIES: '/social/activities',
    PARTICIPATIONS: '/social/participations',
    JOIN: (activityId: string) => `/social/activities/${activityId}/join`,
    APPROVE: (participationId: string) => `/social/participations/${participationId}/approve`,
  },
  GOVERNANCE: {
    POLICIES: '/governance/policies',
    ACKNOWLEDGE: (policyId: string) => `/governance/policies/${policyId}/acknowledge`,
    ACKS: '/governance/acks',
    AUDITS: '/governance/audits',
    ISSUES: '/governance/issues',
    ISSUE_DETAIL: (issueId: string) => `/governance/issues/${issueId}`,
  },
  GAMIFICATION: {
    CHALLENGES: '/gamification/challenges',
    PARTICIPATIONS: '/gamification/participations',
    JOIN_CHALLENGE: (challengeId: string) => `/gamification/challenges/${challengeId}/join`,
    UPDATE_PROGRESS: (challengeId: string) => `/gamification/challenges/${challengeId}/progress`,
    APPROVE_PARTICIPATION: (participationId: string) => `/gamification/participations/${participationId}/approve`,
    BADGES: '/gamification/badges',
    MY_BADGES: '/gamification/badges/my',
    REWARDS: '/gamification/rewards',
    REDEEM: (rewardId: string) => `/gamification/rewards/${rewardId}/redeem`,
    LEADERBOARD: '/gamification/leaderboard',
  },
  REPORTS: {
    COMPILE: '/reports/compile',
  },
  SETTINGS: {
    CONFIG: '/settings/config',
    DEPARTMENTS: '/departments',
    CATEGORIES: '/categories',
  },
};
