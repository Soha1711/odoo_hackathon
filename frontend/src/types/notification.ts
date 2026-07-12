export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'COMPLIANCE_ALERT' | 'CHALLENGE_COMPLETED' | 'BADGE_UNLOCKED' | 'APPROVAL_STATUS' | 'SYSTEM';
  createdAt: string;
}
